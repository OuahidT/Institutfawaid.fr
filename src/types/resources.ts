export const RESOURCE_CATEGORIES = [
  'Débuter en arabe',
  'Lecture & alphabet',
  'Arabe littéraire',
  'Méthode & progression',
  'Choisir ses cours',
] as const;

export const RESOURCE_STATUSES = ['draft', 'published'] as const;

export const RESOURCE_SEARCH_INTENTS = [
  'Informationnelle',
  'Commerciale',
  'Navigationnelle',
] as const;

export const RESOURCE_CONVERSION_TARGETS = [
  '/programmes',
  '/formules',
  '/inscription',
  '/contact',
  'whatsapp',
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];
export type ResourceSearchIntent = (typeof RESOURCE_SEARCH_INTENTS)[number];
export type ResourceConversionTarget = (typeof RESOURCE_CONVERSION_TARGETS)[number];

export const SEO_ROADMAP_TYPES = ['resource_article', 'landing_page'] as const;
export const SEO_ROADMAP_STATUSES = ['published', 'planned', 'draft', 'paused'] as const;

export type SeoRoadmapType = (typeof SEO_ROADMAP_TYPES)[number];
export type SeoRoadmapStatus = (typeof SEO_ROADMAP_STATUSES)[number];

export type SeoRoadmapEntry = {
  priority: number;
  type: SeoRoadmapType;
  slug: string;
  workingTitle: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: ResourceSearchIntent;
  category: ResourceCategory | null;
  conversionTarget: ResourceConversionTarget | null;
  status: SeoRoadmapStatus;
  targetUrl: string;
  relatedTo: string[];
  notes: string;
};

export type SeoRoadmap = {
  version: number;
  purpose: string;
  entries: SeoRoadmapEntry[];
};

export type ResourceArticleMetadata = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: ResourceCategory;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: ResourceSearchIntent;
  featuredImage?: string;
  featuredImageAlt?: string;
  status: ResourceStatus;
  relatedArticles: string[];
  conversionTarget: ResourceConversionTarget;
};

export type ResourceArticle = ResourceArticleMetadata & {
  content: string;
  readingTimeMinutes: number;
};
