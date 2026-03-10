export function getCoursesRemaining(totalCoursesPurchased: number, coursesCompleted: number) {
  return totalCoursesPurchased - coursesCompleted;
}

export function toSafeInteger(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number.parseFloat(normalized);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }

  return fallback;
}

export function toNullableInteger(value: unknown) {
  const parsed = toSafeInteger(value, Number.NaN);
  return Number.isNaN(parsed) ? null : parsed;
}
