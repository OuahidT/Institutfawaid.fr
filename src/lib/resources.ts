import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

import { isSeoDraftPreview } from '@/lib/seo-preview';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CONVERSION_TARGETS,
  RESOURCE_SEARCH_INTENTS,
  RESOURCE_STATUSES,
  type ResourceArticle,
  type ResourceArticleMetadata,
  type ResourceCategory,
  type ResourceConversionTarget,
  type ResourceSearchIntent,
  type ResourceStatus,
} from '@/types/resources';

const resourcesDirectory = path.join(process.cwd(), 'content', 'ressources');
const articleExtensions = new Set(['.md']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const wordsPerMinute = 220;

function failValidation(fileName: string, issues: string[]): never {
  throw new Error(
    `[Contenu SEO invalide] ${fileName}\n${issues.map((issue) => `- ${issue}`).join('\n')}`
  );
}

function requiredString(
  data: Record<string, unknown>,
  field: keyof ResourceArticleMetadata,
  issues: string[]
) {
  const value = data[field];

  if (typeof value !== 'string' || value.trim().length === 0) {
    issues.push(`Le champ « ${field} » est obligatoire et doit être une chaîne non vide.`);
    return '';
  }

  return value.trim();
}

function optionalString(
  data: Record<string, unknown>,
  field: keyof ResourceArticleMetadata,
  issues: string[]
) {
  const value = data[field];

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    issues.push(`Le champ « ${field} » doit être une chaîne non vide lorsqu’il est défini.`);
    return undefined;
  }

  return value.trim();
}

function requiredStringArray(
  data: Record<string, unknown>,
  field: 'secondaryKeywords' | 'relatedArticles',
  issues: string[],
  allowEmpty: boolean
) {
  const value = data[field];

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    issues.push(`Le champ « ${field} » doit être une liste de chaînes non vides.`);
    return [];
  }

  const normalized = value.map((item) => item.trim());

  if (!allowEmpty && normalized.length === 0) {
    issues.push(`Le champ « ${field} » doit contenir au moins une valeur.`);
  }

  return normalized;
}

function dateString(
  data: Record<string, unknown>,
  field: 'publishedAt' | 'updatedAt',
  issues: string[],
  required: boolean
) {
  const rawValue = data[field];

  if ((rawValue === undefined || rawValue === null || rawValue === '') && !required) {
    return undefined;
  }

  const value = rawValue instanceof Date
    ? rawValue.toISOString().slice(0, 10)
    : typeof rawValue === 'string'
      ? rawValue.trim()
      : '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    issues.push(`Le champ « ${field} » doit utiliser le format YYYY-MM-DD.`);
    return undefined;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    issues.push(`Le champ « ${field} » contient une date invalide.`);
    return undefined;
  }

  return value;
}

function enumValue<T extends string>(
  data: Record<string, unknown>,
  field: keyof ResourceArticleMetadata,
  allowedValues: readonly T[],
  issues: string[]
) {
  const value = data[field];

  if (typeof value !== 'string' || !allowedValues.includes(value as T)) {
    issues.push(`Le champ « ${field} » doit être l’une des valeurs suivantes : ${allowedValues.join(', ')}.`);
    return allowedValues[0];
  }

  return value as T;
}

function calculateReadingTime(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[`*_>#\[\]()-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function validateArticle(fileName: string): ResourceArticle {
  const filePath = path.join(resourcesDirectory, fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const issues: string[] = [];
  const normalizedData = data as Record<string, unknown>;
  const fileSlug = path.basename(fileName, path.extname(fileName));

  const slug = requiredString(normalizedData, 'slug', issues);
  const title = requiredString(normalizedData, 'title', issues);
  const seoTitle = requiredString(normalizedData, 'seoTitle', issues);
  const description = requiredString(normalizedData, 'description', issues);
  const excerpt = requiredString(normalizedData, 'excerpt', issues);
  const publishedAt = dateString(normalizedData, 'publishedAt', issues, true) ?? '';
  const updatedAt = dateString(normalizedData, 'updatedAt', issues, false);
  const author = requiredString(normalizedData, 'author', issues);
  const category = enumValue(
    normalizedData,
    'category',
    RESOURCE_CATEGORIES,
    issues
  ) as ResourceCategory;
  const primaryKeyword = requiredString(normalizedData, 'primaryKeyword', issues);
  const secondaryKeywords = requiredStringArray(
    normalizedData,
    'secondaryKeywords',
    issues,
    false
  );
  const searchIntent = enumValue(
    normalizedData,
    'searchIntent',
    RESOURCE_SEARCH_INTENTS,
    issues
  ) as ResourceSearchIntent;
  const featuredImage = optionalString(normalizedData, 'featuredImage', issues);
  const featuredImageAlt = optionalString(normalizedData, 'featuredImageAlt', issues);
  const status = enumValue(
    normalizedData,
    'status',
    RESOURCE_STATUSES,
    issues
  ) as ResourceStatus;
  const relatedArticles = requiredStringArray(
    normalizedData,
    'relatedArticles',
    issues,
    true
  );
  const conversionTarget = enumValue(
    normalizedData,
    'conversionTarget',
    RESOURCE_CONVERSION_TARGETS,
    issues
  ) as ResourceConversionTarget;

  if (slug && !slugPattern.test(slug)) {
    issues.push('Le slug doit contenir uniquement des minuscules, des chiffres et des tirets simples.');
  }

  if (slug && slug !== fileSlug) {
    issues.push(`Le slug « ${slug} » doit correspondre au nom de fichier « ${fileSlug} ».`);
  }

  if (updatedAt && publishedAt && updatedAt < publishedAt) {
    issues.push('updatedAt ne peut pas être antérieur à publishedAt.');
  }

  if (featuredImage && !featuredImage.startsWith('/')) {
    issues.push('featuredImage doit être un chemin public absolu commençant par « / ».');
  }

  if (featuredImage && !featuredImageAlt) {
    issues.push('featuredImageAlt est obligatoire lorsqu’une featuredImage est définie.');
  }

  if (!featuredImage && featuredImageAlt) {
    issues.push('featuredImageAlt ne doit être défini que lorsqu’une featuredImage est présente.');
  }

  if (relatedArticles.includes(slug)) {
    issues.push('Un article ne peut pas se déclarer lui-même dans relatedArticles.');
  }

  if (content.trim().length === 0) {
    issues.push('Le corps Markdown de l’article ne peut pas être vide.');
  }

  if (/^#\s+/m.test(content)) {
    issues.push('Le corps Markdown ne doit pas contenir de H1 : le titre de page est généré depuis title.');
  }

  if (/^#{4,}\s+/m.test(content)) {
    issues.push('Le corps Markdown doit se limiter aux niveaux H2 et H3.');
  }

  if (issues.length > 0) {
    failValidation(fileName, issues);
  }

  return {
    slug,
    title,
    seoTitle,
    description,
    excerpt,
    publishedAt,
    updatedAt,
    author,
    category,
    primaryKeyword,
    secondaryKeywords,
    searchIntent,
    featuredImage,
    featuredImageAlt,
    status,
    relatedArticles,
    conversionTarget,
    content: content.trim(),
    readingTimeMinutes: calculateReadingTime(content),
  };
}

export function getAllResourceArticles() {
  if (!fs.existsSync(resourcesDirectory)) {
    return [];
  }

  const articles = fs
    .readdirSync(resourcesDirectory)
    .filter((fileName) => articleExtensions.has(path.extname(fileName)))
    .map(validateArticle);
  const slugs = new Set<string>();

  for (const article of articles) {
    if (slugs.has(article.slug)) {
      failValidation(article.slug, [`Le slug « ${article.slug} » est utilisé par plusieurs articles.`]);
    }
    slugs.add(article.slug);
  }

  for (const article of articles) {
    const missingRelatedArticles = article.relatedArticles.filter((slug) => !slugs.has(slug));

    if (missingRelatedArticles.length > 0) {
      failValidation(article.slug, [
        `Les articles liés suivants n’existent pas : ${missingRelatedArticles.join(', ')}.`,
      ]);
    }
  }

  return articles;
}

export function getPublishedResourceArticles() {
  return getAllResourceArticles()
    .filter((article) => article.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getVisibleResourceArticles() {
  if (!isSeoDraftPreview()) {
    return getPublishedResourceArticles();
  }

  return getAllResourceArticles()
    .filter((article) => article.status === 'published' || article.status === 'draft')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function hasPublishedResources() {
  return getPublishedResourceArticles().length > 0;
}

export function getPublishedResourceArticle(slug: string) {
  return getPublishedResourceArticles().find((article) => article.slug === slug);
}

export function getVisibleResourceArticle(slug: string) {
  return getVisibleResourceArticles().find((article) => article.slug === slug);
}

export function getRelatedPublishedArticles(article: ResourceArticle) {
  const publishedBySlug = new Map(
    getPublishedResourceArticles().map((candidate) => [candidate.slug, candidate])
  );

  return article.relatedArticles.flatMap((slug) => {
    const relatedArticle = publishedBySlug.get(slug);
    return relatedArticle ? [relatedArticle] : [];
  });
}

export async function renderResourceArticle(content: string) {
  const rendered = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return rendered.toString();
}
