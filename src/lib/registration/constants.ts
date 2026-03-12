export const REGISTRATION_LEVEL_OPTIONS = ['Débutant', 'Intermédiaire', 'Avancé'] as const;
export const REGISTRATION_COURSE_TYPE_OPTIONS = ['Solo', 'Duo', 'Groupe'] as const;
export const REGISTRATION_HOURS_OPTIONS = ['1', '2', '3', 'autre'] as const;
export const REGISTRATION_PAYMENT_OPTIONS = ['PayPal', 'Wero', 'Virement bancaire'] as const;

export const REGISTRATION_DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export const REGISTRATION_AVAILABILITY_SLOTS = ['morning', 'afternoon', 'evening', 'unavailable'] as const;

export type RegistrationDayKey = (typeof REGISTRATION_DAY_KEYS)[number];
export type RegistrationAvailabilitySlot = (typeof REGISTRATION_AVAILABILITY_SLOTS)[number];
export type RegistrationAvailabilities = Record<RegistrationDayKey, RegistrationAvailabilitySlot>;

export const REGISTRATION_DAY_LABELS: Record<RegistrationDayKey, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export const REGISTRATION_SLOT_LABELS: Record<RegistrationAvailabilitySlot, string> = {
  morning: 'Matin (08h - 12h)',
  afternoon: 'Après-midi (12h - 18h)',
  evening: 'Soir (18h - 22h)',
  unavailable: 'Non disponible',
};

export function createDefaultAvailabilities(): RegistrationAvailabilities {
  return {
    monday: 'unavailable',
    tuesday: 'unavailable',
    wednesday: 'unavailable',
    thursday: 'unavailable',
    friday: 'unavailable',
    saturday: 'unavailable',
    sunday: 'unavailable',
  };
}

export function sanitizeAvailabilities(value: unknown): RegistrationAvailabilities {
  const fallback = createDefaultAvailabilities();
  if (!value || typeof value !== 'object') return fallback;

  const input = value as Partial<Record<RegistrationDayKey, unknown>>;
  for (const day of REGISTRATION_DAY_KEYS) {
    const candidate = input[day];
    if (typeof candidate === 'string' && REGISTRATION_AVAILABILITY_SLOTS.includes(candidate as RegistrationAvailabilitySlot)) {
      fallback[day] = candidate as RegistrationAvailabilitySlot;
    }
  }

  return fallback;
}

export function parseHoursPerWeekInput(value: string | null | undefined) {
  if (!value || value === 'autre') return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

export function serializeHoursPerWeek(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 'autre';
  if (value === 1 || value === 2 || value === 3) return String(value);
  return String(value);
}
