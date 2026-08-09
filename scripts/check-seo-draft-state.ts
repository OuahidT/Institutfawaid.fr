const draftStateFs: typeof import('node:fs') = require('node:fs');
const draftStatePath: typeof import('node:path') = require('node:path');

type DraftStatePullRequest = {
  html_url: string;
  title: string;
  head: {
    ref: string;
    sha: string;
  };
};

type DraftStateBranch = {
  name: string;
};

type DraftStateRoadmap = {
  entries?: Array<{ slug?: string; workingTitle?: string }>;
};

const draftStateRepository = 'OuahidT/Institutfawaid.fr';
const draftStateApiBase = `https://api.github.com/repos/${draftStateRepository}`;
const draftStateRoadmapPath = draftStatePath.join(process.cwd(), 'content', 'seo-roadmap.json');

function draftStateHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'institut-fawaid-seo-workflow',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchDraftStatePage<T>(endpoint: string, page: number): Promise<T[]> {
  const separator = endpoint.includes('?') ? '&' : '?';
  const response = await fetch(`${draftStateApiBase}${endpoint}${separator}per_page=100&page=${page}`, {
    headers: draftStateHeaders(),
  });

  if (!response.ok) {
    throw new Error(`GitHub ${response.status} sur ${endpoint}.`);
  }

  const payload = await response.json() as unknown;

  if (!Array.isArray(payload)) {
    throw new Error(`Réponse GitHub inattendue sur ${endpoint}.`);
  }

  return payload as T[];
}

async function fetchAllDraftStatePages<T>(endpoint: string): Promise<T[]> {
  const values: T[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const pageValues = await fetchDraftStatePage<T>(endpoint, page);
    values.push(...pageValues);

    if (pageValues.length < 100) {
      return values;
    }
  }

  throw new Error(`Pagination GitHub trop importante sur ${endpoint}.`);
}

async function findDraftStatePreviewUrl(commitSha: string) {
  try {
    const response = await fetch(`${draftStateApiBase}/commits/${commitSha}/status`, {
      headers: draftStateHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json() as {
      statuses?: Array<{ context?: string; target_url?: string }>;
    };
    const status = payload.statuses?.find((candidate) =>
      candidate.target_url?.includes('vercel.com') || candidate.context?.toLocaleLowerCase('fr-FR').includes('vercel')
    );

    return status?.target_url ?? null;
  } catch {
    return null;
  }
}

function readDraftStateTitle(slug: string) {
  try {
    const roadmap = JSON.parse(
      draftStateFs.readFileSync(draftStateRoadmapPath, 'utf8')
    ) as DraftStateRoadmap;
    return roadmap.entries?.find((entry) => entry.slug === slug)?.workingTitle ?? null;
  } catch {
    return null;
  }
}

async function checkSeoDraftState() {
  try {
    const [pullRequests, branches] = await Promise.all([
      fetchAllDraftStatePages<DraftStatePullRequest>('/pulls?state=open'),
      fetchAllDraftStatePages<DraftStateBranch>('/branches?protected=false'),
    ]);
    const seoPullRequests = pullRequests.filter((pullRequest) =>
      pullRequest.head.ref.startsWith('seo/') || pullRequest.title.startsWith('[SEO Draft]')
    );
    const seoBranches = branches.filter((branch) => branch.name.startsWith('seo/'));

    if (seoPullRequests.length === 0 && seoBranches.length === 0) {
      console.log(JSON.stringify({ result: 'NO_ACTIVE_SEO_DRAFT' }, null, 2));
      return;
    }

    const primaryPullRequest = seoPullRequests[0];
    const branchName = primaryPullRequest?.head.ref ?? seoBranches[0]?.name;
    const slug = branchName?.replace(/^seo\//, '') ?? null;
    const previewUrl = primaryPullRequest
      ? await findDraftStatePreviewUrl(primaryPullRequest.head.sha)
      : null;

    console.log(JSON.stringify({
      result: 'WAITING_FOR_HUMAN_APPROVAL',
      slug,
      title: slug ? readDraftStateTitle(slug) : null,
      pullRequest: primaryPullRequest?.html_url ?? null,
      previewUrl,
      activeSeoPullRequestCount: seoPullRequests.length,
      activeSeoBranchCount: seoBranches.length,
    }, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ result: 'CANNOT_VERIFY_DRAFT_STATE', error: message }, null, 2));
    process.exitCode = 2;
  }
}

void checkSeoDraftState();
