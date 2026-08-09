export function isSeoDraftPreview() {
  return process.env.VERCEL_ENV === 'preview';
}

export const seoPreviewRobots = {
  index: false,
  follow: false,
  noarchive: true,
} as const;
