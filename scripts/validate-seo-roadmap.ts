const fs: typeof import('node:fs') = require('node:fs');
const path: typeof import('node:path') = require('node:path');

const allowedTypes = ['resource_article', 'landing_page'] as const;
const allowedStatuses = ['published', 'planned', 'draft', 'paused'] as const;
const allowedSearchIntents = [
  'Informationnelle',
  'Commerciale',
  'Navigationnelle',
] as const;
const allowedCategories = [
  'Débuter en arabe',
  'Lecture & alphabet',
  'Arabe littéraire',
  'Méthode & progression',
  'Choisir ses cours',
] as const;
const allowedConversionTargets = [
  '/programmes',
  '/formules',
  '/inscription',
  '/contact',
  'whatsapp',
] as const;

const roadmapPath = path.join(process.cwd(), 'content', 'seo-roadmap.json');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const issues: string[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(
  entry: Record<string, unknown>,
  field: string,
  label: string
): string | undefined {
  const value = entry[field];

  if (typeof value !== 'string' || value.trim().length === 0) {
    issues.push(`${label}.${field} doit être une chaîne non vide.`);
    return undefined;
  }

  return value.trim();
}

function stringArray(
  entry: Record<string, unknown>,
  field: string,
  label: string
): string[] | undefined {
  const value = entry[field];

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    issues.push(`${label}.${field} doit être une liste de chaînes non vides.`);
    return undefined;
  }

  const normalized = value.map((item) => item.trim());

  if (new Set(normalized).size !== normalized.length) {
    issues.push(`${label}.${field} contient une valeur dupliquée.`);
  }

  return normalized;
}

function allowedValue<T extends string>(
  entry: Record<string, unknown>,
  field: string,
  allowed: readonly T[],
  label: string
): T | undefined {
  const value = entry[field];

  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    issues.push(`${label}.${field} doit être l’une des valeurs suivantes : ${allowed.join(', ')}.`);
    return undefined;
  }

  return value as T;
}

function normalizedKeyword(keyword: string) {
  return keyword
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('fr-FR')
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, ' ');
}

function registerUnique(
  seen: Map<string, string>,
  value: string | number | undefined,
  field: string,
  label: string,
  normalize = false
) {
  if (value === undefined) {
    return;
  }

  const rawValue = String(value);
  const key = normalize ? normalizedKeyword(rawValue) : rawValue;
  const previous = seen.get(key);

  if (previous) {
    issues.push(`${label}.${field} duplique la valeur déjà utilisée par ${previous}.`);
    return;
  }

  seen.set(key, label);
}

let parsed: unknown;

try {
  parsed = JSON.parse(fs.readFileSync(roadmapPath, 'utf8')) as unknown;
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Roadmap SEO invalide] Impossible de lire ${roadmapPath}\n- ${message}`);
  process.exitCode = 1;
  parsed = undefined;
}

if (parsed !== undefined) {
  if (!isRecord(parsed)) {
    issues.push('La racine du fichier doit être un objet JSON.');
  } else {
    if (parsed.version !== 1) {
      issues.push('version doit être égale à 1.');
    }

    if (typeof parsed.purpose !== 'string' || parsed.purpose.trim().length === 0) {
      issues.push('purpose doit être une chaîne non vide.');
    }

    if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
      issues.push('entries doit être une liste non vide.');
    } else {
      const seenPriorities = new Map<string, string>();
      const seenSlugs = new Map<string, string>();
      const seenTargetUrls = new Map<string, string>();
      const seenPrimaryKeywords = new Map<string, string>();
      const knownSlugs = new Set<string>();
      const relationships: Array<{ label: string; slug?: string; relatedTo: string[] }> = [];

      parsed.entries.forEach((rawEntry, index) => {
        const label = `entries[${index}]`;

        if (!isRecord(rawEntry)) {
          issues.push(`${label} doit être un objet.`);
          return;
        }

        const priority = rawEntry.priority;
        if (typeof priority !== 'number' || !Number.isInteger(priority) || priority < 1) {
          issues.push(`${label}.priority doit être un entier positif.`);
        }

        const type = allowedValue(rawEntry, 'type', allowedTypes, label);
        const slug = nonEmptyString(rawEntry, 'slug', label);
        nonEmptyString(rawEntry, 'workingTitle', label);
        const primaryKeyword = nonEmptyString(rawEntry, 'primaryKeyword', label);
        const secondaryKeywords = stringArray(rawEntry, 'secondaryKeywords', label);
        allowedValue(rawEntry, 'searchIntent', allowedSearchIntents, label);
        allowedValue(rawEntry, 'status', allowedStatuses, label);
        const targetUrl = nonEmptyString(rawEntry, 'targetUrl', label);
        const relatedTo = stringArray(rawEntry, 'relatedTo', label) ?? [];
        nonEmptyString(rawEntry, 'notes', label);

        if (slug && !slugPattern.test(slug)) {
          issues.push(`${label}.slug doit contenir uniquement des minuscules, chiffres et tirets simples.`);
        }

        if (targetUrl && !targetUrl.startsWith('/')) {
          issues.push(`${label}.targetUrl doit commencer par « / ».`);
        }

        if (type === 'resource_article') {
          allowedValue(rawEntry, 'category', allowedCategories, label);
          allowedValue(rawEntry, 'conversionTarget', allowedConversionTargets, label);

          if (secondaryKeywords && secondaryKeywords.length === 0) {
            issues.push(`${label}.secondaryKeywords doit contenir au moins une valeur pour un resource_article.`);
          }

          if (typeof priority === 'number' && priority >= 20) {
            issues.push(`${label}.priority doit être comprise entre 1 et 19 pour un resource_article.`);
          }

          if (slug && targetUrl && targetUrl !== `/ressources/${slug}`) {
            issues.push(`${label}.targetUrl doit être égal à /ressources/${slug}.`);
          }
        }

        if (type === 'landing_page') {
          if (rawEntry.category !== null) {
            issues.push(`${label}.category doit être null pour une landing_page.`);
          }

          if (rawEntry.conversionTarget !== null) {
            issues.push(`${label}.conversionTarget doit être null pour une landing_page.`);
          }

          if (typeof priority === 'number' && priority < 20) {
            issues.push(`${label}.priority doit être supérieure ou égale à 20 pour une landing_page.`);
          }

          if (slug && targetUrl && targetUrl !== `/${slug}`) {
            issues.push(`${label}.targetUrl doit être égal à /${slug}.`);
          }
        }

        registerUnique(seenPriorities, typeof priority === 'number' ? priority : undefined, 'priority', label);
        registerUnique(seenSlugs, slug, 'slug', label);
        registerUnique(seenTargetUrls, targetUrl, 'targetUrl', label);
        registerUnique(seenPrimaryKeywords, primaryKeyword, 'primaryKeyword', label, true);

        if (slug) {
          knownSlugs.add(slug);
        }
        relationships.push({ label, slug, relatedTo });
      });

      for (const relationship of relationships) {
        for (const relatedSlug of relationship.relatedTo) {
          if (relatedSlug === relationship.slug) {
            issues.push(`${relationship.label}.relatedTo ne peut pas référencer son propre slug.`);
          } else if (!knownSlugs.has(relatedSlug)) {
            issues.push(`${relationship.label}.relatedTo référence le slug inconnu « ${relatedSlug} ».`);
          }
        }
      }
    }
  }

  if (issues.length > 0) {
    console.error(`[Roadmap SEO invalide] ${roadmapPath}\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    const entryCount = isRecord(parsed) && Array.isArray(parsed.entries) ? parsed.entries.length : 0;
    console.log(`[Roadmap SEO valide] ${entryCount} entrées contrôlées dans content/seo-roadmap.json.`);
  }
}
