export const RESOURCE_CATEGORIES = [
  'Débuter en arabe',
  'Lecture & alphabet',
  'Arabe littéraire',
  'Méthode & progression',
  'Choisir ses cours',
] as const;

export const RESOURCE_STATUSES = ['draft', 'published'] as const;

export const RESOURCE_CONVERSION_TARGETS = [
  '/programmes',
  '/formules',
  '/inscription',
  '/contact',
  'whatsapp',
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];
export type ResourceConversionTarget = (typeof RESOURCE_CONVERSION_TARGETS)[number];

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
  searchIntent: string;
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
