const draftValidatorFs: typeof import('node:fs') = require('node:fs');
const draftValidatorPath: typeof import('node:path') = require('node:path');
const draftValidatorMatter: (source: string) => {
  data: Record<string, unknown>;
  content: string;
} = require('gray-matter');

type DraftValidatorRoadmapEntry = {
  type: 'resource_article' | 'landing_page';
  slug: string;
  workingTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  category: string | null;
  conversionTarget: string | null;
  status: 'published' | 'planned' | 'draft' | 'paused';
  relatedTo: string[];
};

type DraftValidatorArticle = {
  fileName: string;
  slug: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  category: string;
  conversionTarget: string;
  status: string;
  relatedArticles: string[];
  content: string;
};

const draftValidatorRoot = process.cwd();
const draftValidatorRoadmapPath = draftValidatorPath.join(draftValidatorRoot, 'content', 'seo-roadmap.json');
const draftValidatorResourcesDirectory = draftValidatorPath.join(draftValidatorRoot, 'content', 'ressources');
const draftValidatorIssues: string[] = [];
const draftValidatorDialectPattern = /\b(dialectes?|darija|algérien|algérienne|marocain|marocaine|tunisien|tunisienne|égyptien|égyptienne|levantin|levantine)\b/iu;
const draftValidatorLinkPattern = /\[[^\]]+\]\((\/[^)\s#]+)(?:#[^)\s]+)?\)/g;

function readDraftValidatorArticles(): DraftValidatorArticle[] {
  return draftValidatorFs.readdirSync(draftValidatorResourcesDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const source = draftValidatorFs.readFileSync(
        draftValidatorPath.join(draftValidatorResourcesDirectory, fileName),
        'utf8'
      );
      const parsed = draftValidatorMatter(source);
      const data = parsed.data;

      return {
        fileName,
        slug: typeof data.slug === 'string' ? data.slug : '',
        title: typeof data.title === 'string' ? data.title : '',
        primaryKeyword: typeof data.primaryKeyword === 'string' ? data.primaryKeyword : '',
        secondaryKeywords: Array.isArray(data.secondaryKeywords) ? data.secondaryKeywords as string[] : [],
        searchIntent: typeof data.searchIntent === 'string' ? data.searchIntent : '',
        category: typeof data.category === 'string' ? data.category : '',
        conversionTarget: typeof data.conversionTarget === 'string' ? data.conversionTarget : '',
        status: typeof data.status === 'string' ? data.status : '',
        relatedArticles: Array.isArray(data.relatedArticles) ? data.relatedArticles as string[] : [],
        content: parsed.content,
      };
    });
}

function isDraftValidatorInternalLinkValid(href: string, articles: DraftValidatorArticle[]) {
  if (href === '/') {
    return draftValidatorFs.existsSync(draftValidatorPath.join(draftValidatorRoot, 'app', 'page.tsx'));
  }

  if (href.startsWith('/ressources/')) {
    const slug = href.replace('/ressources/', '').replace(/\/$/, '');
    return articles.some((article) => article.slug === slug && article.status === 'published');
  }

  const appPath = href.replace(/^\//, '').replace(/\/$/, '');
  return draftValidatorFs.existsSync(draftValidatorPath.join(draftValidatorRoot, 'app', appPath, 'page.tsx'));
}

function compareDraftValidatorArray(label: string, left: string[], right: string[]) {
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    draftValidatorIssues.push(`${label} ne correspond pas à la roadmap.`);
  }
}

function validateSeoDraft() {
  const roadmap = JSON.parse(
    draftValidatorFs.readFileSync(draftValidatorRoadmapPath, 'utf8')
  ) as { entries: DraftValidatorRoadmapEntry[] };
  const articles = readDraftValidatorArticles();
  const roadmapDrafts = roadmap.entries.filter((entry) => entry.type === 'resource_article' && entry.status === 'draft');
  const articleDrafts = articles.filter((article) => article.status === 'draft');

  if (roadmapDrafts.length > 1) {
    draftValidatorIssues.push('La roadmap contient plus d’un resource_article en draft.');
  }

  if (articleDrafts.length > 1) {
    draftValidatorIssues.push('content/ressources contient plus d’un article en draft.');
  }

  if (roadmapDrafts.length !== articleDrafts.length) {
    draftValidatorIssues.push('Le nombre de drafts de la roadmap ne correspond pas au nombre de fichiers article en draft.');
  }

  const roadmapDraft = roadmapDrafts[0];
  const articleDraft = articleDrafts[0];

  if (roadmapDraft && articleDraft) {
    if (roadmapDraft.slug !== articleDraft.slug) {
      draftValidatorIssues.push('Le slug du draft article ne correspond pas au draft de la roadmap.');
    }
    if (roadmapDraft.workingTitle !== articleDraft.title) {
      draftValidatorIssues.push('Le titre du draft article ne correspond pas au workingTitle de la roadmap.');
    }
    if (roadmapDraft.primaryKeyword !== articleDraft.primaryKeyword) {
      draftValidatorIssues.push('Le primaryKeyword du draft article ne correspond pas à la roadmap.');
    }
    if (roadmapDraft.searchIntent !== articleDraft.searchIntent) {
      draftValidatorIssues.push('Le searchIntent du draft article ne correspond pas à la roadmap.');
    }
    if (roadmapDraft.category !== articleDraft.category) {
      draftValidatorIssues.push('La catégorie du draft article ne correspond pas à la roadmap.');
    }
    if (roadmapDraft.conversionTarget !== articleDraft.conversionTarget) {
      draftValidatorIssues.push('Le conversionTarget du draft article ne correspond pas à la roadmap.');
    }

    compareDraftValidatorArray(
      'La liste secondaryKeywords du draft article',
      articleDraft.secondaryKeywords,
      roadmapDraft.secondaryKeywords
    );

    for (const relatedSlug of articleDraft.relatedArticles) {
      if (!roadmapDraft.relatedTo.includes(relatedSlug)) {
        draftValidatorIssues.push(`relatedArticles contient « ${relatedSlug} », absent de relatedTo.`);
      }

      const relatedArticle = articles.find((article) => article.slug === relatedSlug);
      if (!relatedArticle || relatedArticle.status !== 'published') {
        draftValidatorIssues.push(`L’article lié « ${relatedSlug} » n’existe pas avec le statut published.`);
      }
    }

    if (draftValidatorDialectPattern.test(`${articleDraft.title}\n${articleDraft.content}`)) {
      draftValidatorIssues.push('Le draft contient un terme dialectal interdit sans validation humaine explicite.');
    }

    for (const match of articleDraft.content.matchAll(draftValidatorLinkPattern)) {
      const href = match[1];
      if (!isDraftValidatorInternalLinkValid(href, articles)) {
        draftValidatorIssues.push(`Le lien interne « ${href} » ne pointe pas vers une page publiée existante.`);
      }
    }
  }

  if (draftValidatorIssues.length > 0) {
    console.error(`[Brouillon SEO invalide]\n${draftValidatorIssues.map((issue) => `- ${issue}`).join('\n')}`);
    process.exitCode = 1;
    return;
  }

  if (!articleDraft) {
    console.log('[Brouillon SEO valide] Aucun draft actif sur cette branche.');
    return;
  }

  console.log(`[Brouillon SEO valide] ${articleDraft.slug} est l’unique draft actif et respecte la roadmap.`);
}

validateSeoDraft();
