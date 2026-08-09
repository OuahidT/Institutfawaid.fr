const nextSeoFs: typeof import('node:fs') = require('node:fs');
const nextSeoPath: typeof import('node:path') = require('node:path');

type NextSeoRoadmapEntry = {
  priority: number;
  type: 'resource_article' | 'landing_page';
  slug: string;
  workingTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'Informationnelle' | 'Commerciale' | 'Navigationnelle';
  category: string | null;
  conversionTarget: string | null;
  status: 'published' | 'planned' | 'draft' | 'paused';
  targetUrl: string;
  relatedTo: string[];
  notes: string;
};

type NextSeoRoadmap = {
  entries: NextSeoRoadmapEntry[];
};

const nextSeoRoadmapPath = nextSeoPath.join(process.cwd(), 'content', 'seo-roadmap.json');

function getNextSeoArticle() {
  let roadmap: NextSeoRoadmap;

  try {
    roadmap = JSON.parse(nextSeoFs.readFileSync(nextSeoRoadmapPath, 'utf8')) as NextSeoRoadmap;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ result: 'TECHNICAL_FAILURE', error: message }, null, 2));
    process.exitCode = 1;
    return;
  }

  if (!Array.isArray(roadmap.entries)) {
    console.error(JSON.stringify({ result: 'TECHNICAL_FAILURE', error: 'entries doit être une liste.' }, null, 2));
    process.exitCode = 1;
    return;
  }

  const nextArticle = roadmap.entries
    .filter((entry) => entry.type === 'resource_article' && entry.status === 'planned')
    .sort((a, b) => a.priority - b.priority)[0];

  if (!nextArticle) {
    console.log(JSON.stringify({ result: 'NO_PLANNED_RESOURCE_ARTICLE' }, null, 2));
    return;
  }

  const {
    priority,
    slug,
    workingTitle,
    primaryKeyword,
    secondaryKeywords,
    searchIntent,
    category,
    conversionTarget,
    targetUrl,
    relatedTo,
    notes,
  } = nextArticle;

  console.log(JSON.stringify({
    result: 'NEXT_ARTICLE_AVAILABLE',
    priority,
    slug,
    workingTitle,
    primaryKeyword,
    secondaryKeywords,
    searchIntent,
    category,
    conversionTarget,
    targetUrl,
    relatedTo,
    notes,
  }, null, 2));
}

getNextSeoArticle();
