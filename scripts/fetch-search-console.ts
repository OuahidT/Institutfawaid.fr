const gscFs: typeof import('node:fs') = require('node:fs');
const gscPath: typeof import('node:path') = require('node:path');

type DateRange = {
  startDate: string;
  endDate: string;
  days: number;
};

type SearchConsoleRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type SearchConsolePeriod = DateRange & {
  rowCount: number;
  responseAggregationType: string | null;
  rowTotals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  rows: SearchConsoleRow[];
};

type SearchConsoleApiRow = {
  keys?: unknown;
  clicks?: unknown;
  impressions?: unknown;
  ctr?: unknown;
  position?: unknown;
};

type SearchConsoleApiResponse = {
  rows?: unknown;
  responseAggregationType?: unknown;
  error?: unknown;
};

const API_ROOT = 'https://www.googleapis.com/webmasters/v3';
const OUTPUT_PATH = gscPath.join(
  process.cwd(),
  'data',
  'seo',
  'search-console',
  'latest.json'
);
const PACIFIC_TIME_ZONE = 'America/Los_Angeles';
const FINAL_DATA_LAG_DAYS = 3;
const ROW_LIMIT = 25_000;
const MAX_ATTEMPTS = 4;

function isGscRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function roundMetric(value: number) {
  return Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000;
}

function dateInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const year = values.get('year');
  const month = values.get('month');
  const day = values.get('day');

  if (!year || !month || !day) {
    throw new Error(`Impossible de déterminer la date dans le fuseau ${timeZone}.`);
  }

  return `${year}-${month}-${day}`;
}

function shiftDate(date: string, dayCount: number) {
  const timestamp = Date.parse(`${date}T00:00:00Z`);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`Date invalide : ${date}.`);
  }

  return new Date(timestamp + dayCount * 86_400_000).toISOString().slice(0, 10);
}

function buildDateRanges(now: Date) {
  const todayInPacificTime = dateInTimeZone(now, PACIFIC_TIME_ZONE);
  const safeEndDate = shiftDate(todayInPacificTime, -FINAL_DATA_LAG_DAYS);
  const last28StartDate = shiftDate(safeEndDate, -27);
  const previous28EndDate = shiftDate(last28StartDate, -1);

  return {
    last28Days: {
      startDate: last28StartDate,
      endDate: safeEndDate,
      days: 28,
    },
    previous28Days: {
      startDate: shiftDate(previous28EndDate, -27),
      endDate: previous28EndDate,
      days: 28,
    },
    context90Days: {
      startDate: shiftDate(safeEndDate, -89),
      endDate: safeEndDate,
      days: 90,
    },
  } satisfies Record<string, DateRange>;
}

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`La variable d’environnement ${name} est absente.`);
  }

  return value;
}

function validateSiteUrl(siteUrl: string) {
  if (!/^sc-domain:[a-z0-9.-]+$/i.test(siteUrl)) {
    throw new Error(
      'GSC_SITE_URL doit être une propriété de domaine Search Console au format sc-domain:example.com.'
    );
  }
}

function numberMetric(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Réponse Search Console invalide : ${field} doit être un nombre.`);
  }

  return value;
}

function normalizeRow(value: unknown): SearchConsoleRow {
  if (!isGscRecord(value)) {
    throw new Error('Réponse Search Console invalide : une ligne n’est pas un objet.');
  }

  const row = value as SearchConsoleApiRow;

  if (
    !Array.isArray(row.keys) ||
    row.keys.length !== 2 ||
    typeof row.keys[0] !== 'string' ||
    typeof row.keys[1] !== 'string'
  ) {
    throw new Error('Réponse Search Console invalide : les dimensions query/page sont absentes.');
  }

  return {
    query: row.keys[0],
    page: row.keys[1],
    clicks: numberMetric(row.clicks, 'clicks'),
    impressions: numberMetric(row.impressions, 'impressions'),
    ctr: numberMetric(row.ctr, 'ctr'),
    position: numberMetric(row.position, 'position'),
  };
}

function getApiErrorMessage(payload: unknown) {
  if (!isGscRecord(payload) || !isGscRecord(payload.error)) {
    return null;
  }

  return typeof payload.error.message === 'string' ? payload.error.message : null;
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function requestSearchConsole(
  endpoint: string,
  accessToken: string,
  requestBody: Record<string, unknown>
): Promise<SearchConsoleApiResponse> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const responseText = await response.text();
    let payload: unknown = {};

    if (responseText) {
      try {
        payload = JSON.parse(responseText) as unknown;
      } catch {
        payload = {};
      }
    }

    if (response.ok) {
      if (!isGscRecord(payload)) {
        throw new Error('Search Console a renvoyé une réponse JSON invalide.');
      }

      return payload as SearchConsoleApiResponse;
    }

    const retryable = response.status === 429 || response.status >= 500;

    if (retryable && attempt < MAX_ATTEMPTS) {
      await wait(1_000 * 2 ** (attempt - 1));
      continue;
    }

    const apiMessage = getApiErrorMessage(payload);
    throw new Error(
      `Échec Search Console (${response.status})${apiMessage ? ` : ${apiMessage}` : '.'}`
    );
  }

  throw new Error('Échec Search Console après plusieurs tentatives.');
}

function calculateRowTotals(rows: SearchConsoleRow[]) {
  const totals = rows.reduce(
    (result, row) => ({
      clicks: result.clicks + row.clicks,
      impressions: result.impressions + row.impressions,
      weightedPosition: result.weightedPosition + row.position * row.impressions,
    }),
    { clicks: 0, impressions: 0, weightedPosition: 0 }
  );

  return {
    clicks: roundMetric(totals.clicks),
    impressions: roundMetric(totals.impressions),
    ctr: totals.impressions > 0 ? roundMetric(totals.clicks / totals.impressions) : 0,
    position:
      totals.impressions > 0
        ? roundMetric(totals.weightedPosition / totals.impressions)
        : 0,
  };
}

async function fetchPeriod(
  siteUrl: string,
  accessToken: string,
  range: DateRange
): Promise<SearchConsolePeriod> {
  const endpoint = `${API_ROOT}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const rows: SearchConsoleRow[] = [];
  let startRow = 0;
  let responseAggregationType: string | null = null;

  while (true) {
    const response = await requestSearchConsole(endpoint, accessToken, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['query', 'page'],
      type: 'web',
      aggregationType: 'auto',
      dataState: 'final',
      rowLimit: ROW_LIMIT,
      startRow,
    });
    const apiRows = Array.isArray(response.rows) ? response.rows : [];

    if (
      responseAggregationType === null &&
      typeof response.responseAggregationType === 'string'
    ) {
      responseAggregationType = response.responseAggregationType;
    }

    rows.push(...apiRows.map(normalizeRow));

    if (apiRows.length < ROW_LIMIT) {
      break;
    }

    startRow += apiRows.length;
  }

  return {
    ...range,
    rowCount: rows.length,
    responseAggregationType,
    rowTotals: calculateRowTotals(rows),
    rows,
  };
}

function percentageChange(current: number, previous: number) {
  return previous === 0 ? null : roundMetric(((current - previous) / previous) * 100);
}

function buildComparison(current: SearchConsolePeriod, previous: SearchConsolePeriod) {
  return {
    clicks: {
      absoluteChange: roundMetric(current.rowTotals.clicks - previous.rowTotals.clicks),
      percentChange: percentageChange(current.rowTotals.clicks, previous.rowTotals.clicks),
    },
    impressions: {
      absoluteChange: roundMetric(
        current.rowTotals.impressions - previous.rowTotals.impressions
      ),
      percentChange: percentageChange(
        current.rowTotals.impressions,
        previous.rowTotals.impressions
      ),
    },
    ctr: {
      absoluteChange: roundMetric(current.rowTotals.ctr - previous.rowTotals.ctr),
      percentagePointChange: roundMetric(
        (current.rowTotals.ctr - previous.rowTotals.ctr) * 100
      ),
    },
    position: {
      absoluteChange: roundMetric(
        current.rowTotals.position - previous.rowTotals.position
      ),
      note: 'Une valeur négative correspond à une amélioration de la position moyenne.',
    },
  };
}

async function main() {
  const now = new Date();
  const siteUrl = requiredEnvironmentVariable('GSC_SITE_URL');
  validateSiteUrl(siteUrl);
  const ranges = buildDateRanges(now);

  if (process.argv.includes('--dry-run')) {
    console.log(JSON.stringify({ siteUrl, ranges }, null, 2));
    return;
  }

  const accessToken = requiredEnvironmentVariable('GSC_ACCESS_TOKEN');
  const last28Days = await fetchPeriod(siteUrl, accessToken, ranges.last28Days);
  const previous28Days = await fetchPeriod(siteUrl, accessToken, ranges.previous28Days);
  const context90Days = await fetchPeriod(siteUrl, accessToken, ranges.context90Days);
  const output = {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    siteUrl,
    searchType: 'web',
    dimensions: ['query', 'page'],
    metrics: ['clicks', 'impressions', 'ctr', 'position'],
    datePolicy: {
      timeZone: PACIFIC_TIME_ZONE,
      dataState: 'final',
      excludedRecentDays: FINAL_DATA_LAG_DAYS,
      note: 'Les trois jours les plus récents sont exclus en plus de dataState=final afin d’éviter les données potentiellement incomplètes.',
    },
    limitations: [
      'Search Console peut limiter la réponse aux principales lignes disponibles.',
      'Les agrégats rowTotals portent uniquement sur les lignes query/page renvoyées par l’API.',
    ],
    periods: {
      last28Days,
      previous28Days,
      context90Days,
    },
    comparison28Days: buildComparison(last28Days, previous28Days),
  };

  gscFs.mkdirSync(gscPath.dirname(OUTPUT_PATH), { recursive: true });
  const temporaryPath = `${OUTPUT_PATH}.tmp-${process.pid}`;
  gscFs.writeFileSync(temporaryPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  gscFs.renameSync(temporaryPath, OUTPUT_PATH);

  console.log(
    `[Search Console] ${last28Days.rowCount + previous28Days.rowCount + context90Days.rowCount} lignes enregistrées dans ${gscPath.relative(process.cwd(), OUTPUT_PATH)}.`
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Search Console] ${message}`);
  process.exitCode = 1;
});
