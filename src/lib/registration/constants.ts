export const REGISTRATION_LEVEL_OPTIONS = ['Débutant', 'Intermédiaire', 'Avancé'] as const;
export const REGISTRATION_COURSE_TYPE_OPTIONS = ['Solo', 'Duo', 'Groupe'] as const;
export const REGISTRATION_HOURS_OPTIONS = ['1', '2', '3', 'autre'] as const;
export const REGISTRATION_PAYMENT_OPTIONS = ['PayPal', 'Wero', 'Virement bancaire'] as const;
export const REGISTRATION_WHATSAPP_COUNTRY_OPTIONS = [
  { value: '+33', label: 'France (+33)' },
  { value: '+32', label: 'Belgique (+32)' },
  { value: '+41', label: 'Suisse (+41)' },
  { value: '+1', label: 'Canada / USA (+1)' },
  { value: '+44', label: 'Royaume-Uni (+44)' },
  { value: '+212', label: 'Maroc (+212)' },
  { value: '+213', label: 'Algérie (+213)' },
  { value: '+216', label: 'Tunisie (+216)' },
  { value: '+20', label: 'Égypte (+20)' },
] as const;

export const REGISTRATION_DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export const REGISTRATION_AVAILABILITY_SLOTS = ['morning', 'afternoon', 'evening', 'unavailable'] as const;
export const REGISTRATION_ACTIVE_AVAILABILITY_SLOTS = ['morning', 'afternoon', 'evening'] as const;

export type RegistrationDayKey = (typeof REGISTRATION_DAY_KEYS)[number];
export type RegistrationAvailabilitySlot = (typeof REGISTRATION_AVAILABILITY_SLOTS)[number];
export type RegistrationActiveAvailabilitySlot = (typeof REGISTRATION_ACTIVE_AVAILABILITY_SLOTS)[number];
export type RegistrationDayAvailability = Record<RegistrationAvailabilitySlot, boolean>;
export type RegistrationAvailabilities = Record<RegistrationDayKey, RegistrationDayAvailability>;

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

function createDefaultDayAvailability(): RegistrationDayAvailability {
  return {
    morning: false,
    afternoon: false,
    evening: false,
    unavailable: true,
  };
}

export function createDefaultAvailabilities(): RegistrationAvailabilities {
  return {
    monday: createDefaultDayAvailability(),
    tuesday: createDefaultDayAvailability(),
    wednesday: createDefaultDayAvailability(),
    thursday: createDefaultDayAvailability(),
    friday: createDefaultDayAvailability(),
    saturday: createDefaultDayAvailability(),
    sunday: createDefaultDayAvailability(),
  };
}

function normalizeDayAvailability(value: unknown): RegistrationDayAvailability {
  const base = createDefaultDayAvailability();

  // Backward compatibility: previous payload stored a single string slot.
  if (typeof value === 'string' && REGISTRATION_AVAILABILITY_SLOTS.includes(value as RegistrationAvailabilitySlot)) {
    if (value === 'unavailable') {
      return base;
    }
    base.unavailable = false;
    base[value as RegistrationActiveAvailabilitySlot] = true;
    return base;
  }

  if (Array.isArray(value)) {
    let hasActiveSelection = false;
    for (const entry of value) {
      if (typeof entry !== 'string') continue;
      if (!REGISTRATION_AVAILABILITY_SLOTS.includes(entry as RegistrationAvailabilitySlot)) continue;
      if (entry === 'unavailable') continue;
      base[entry as RegistrationActiveAvailabilitySlot] = true;
      hasActiveSelection = true;
    }
    base.unavailable = !hasActiveSelection;
    return base;
  }

  if (!value || typeof value !== 'object') {
    return base;
  }

  const input = value as Partial<Record<RegistrationAvailabilitySlot, unknown>>;
  let hasActiveSelection = false;

  for (const slot of REGISTRATION_ACTIVE_AVAILABILITY_SLOTS) {
    if (input[slot] === true) {
      base[slot] = true;
      hasActiveSelection = true;
    }
  }

  if (!hasActiveSelection && input.unavailable === true) {
    base.unavailable = true;
    return base;
  }

  base.unavailable = !hasActiveSelection;
  return base;
}

export function sanitizeAvailabilities(value: unknown): RegistrationAvailabilities {
  const fallback = createDefaultAvailabilities();
  if (!value || typeof value !== 'object') return fallback;

  const input = value as Partial<Record<RegistrationDayKey, unknown>>;
  for (const day of REGISTRATION_DAY_KEYS) {
    fallback[day] = normalizeDayAvailability(input[day]);
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
