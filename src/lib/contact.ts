export const CONTACT_LEVEL_OPTIONS = ['Débutant', 'Intermédiaire', 'Avancé', 'Je ne sais pas encore'] as const;

export const CONTACT_FORMULA_OPTIONS = ['Solo', 'Duo', 'Groupe', 'Je souhaite être orienté'] as const;

export type ContactFormPayload = {
  fullName: string;
  email: string;
  phone: string;
  level: string;
  objective: string;
  formula: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormPayload, string>>;

const MAX_LENGTHS: Record<keyof ContactFormPayload, number> = {
  fullName: 120,
  email: 180,
  phone: 40,
  level: 50,
  objective: 180,
  formula: 80,
  message: 3000,
};

const MIN_MESSAGE_LENGTH = 10;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeInline(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function normalizeMultiline(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim().slice(0, maxLength);
}

export function normalizeContactPayload(input: Partial<ContactFormPayload>): ContactFormPayload {
  return {
    fullName: normalizeInline(input.fullName, MAX_LENGTHS.fullName),
    email: normalizeInline(input.email, MAX_LENGTHS.email).toLowerCase(),
    phone: normalizeInline(input.phone, MAX_LENGTHS.phone),
    level: normalizeInline(input.level, MAX_LENGTHS.level),
    objective: normalizeInline(input.objective, MAX_LENGTHS.objective),
    formula: normalizeInline(input.formula, MAX_LENGTHS.formula),
    message: normalizeMultiline(input.message, MAX_LENGTHS.message),
  };
}

export function validateContactPayload(payload: ContactFormPayload): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!payload.fullName) {
    errors.fullName = 'Veuillez renseigner votre prénom et nom.';
  }

  if (!payload.email || !EMAIL_REGEX.test(payload.email)) {
    errors.email = 'Veuillez saisir un email valide.';
  }

  if (!payload.phone) {
    errors.phone = 'Veuillez renseigner un numéro de téléphone ou WhatsApp.';
  }

  if (!CONTACT_LEVEL_OPTIONS.includes(payload.level as (typeof CONTACT_LEVEL_OPTIONS)[number])) {
    errors.level = 'Veuillez indiquer votre niveau actuel.';
  }

  if (!payload.objective) {
    errors.objective = 'Veuillez préciser votre objectif.';
  }

  if (!CONTACT_FORMULA_OPTIONS.includes(payload.formula as (typeof CONTACT_FORMULA_OPTIONS)[number])) {
    errors.formula = 'Veuillez choisir une formule souhaitée.';
  }

  if (!payload.message || payload.message.length < MIN_MESSAGE_LENGTH) {
    errors.message = 'Veuillez saisir un message plus détaillé.';
  }

  return errors;
}

export function parseContactPayload(input: unknown) {
  const data = normalizeContactPayload(
    typeof input === 'object' && input !== null ? (input as Partial<ContactFormPayload>) : {}
  );
  const errors = validateContactPayload(data);

  return {
    data,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function buildContactEmailText(payload: ContactFormPayload) {
  return [
    'Nouvelle demande de contact',
    '',
    `Prénom et nom : ${payload.fullName}`,
    `Email : ${payload.email}`,
    `Téléphone / WhatsApp : ${payload.phone}`,
    `Niveau actuel : ${payload.level}`,
    `Objectif : ${payload.objective}`,
    `Formule souhaitée : ${payload.formula}`,
    '',
    'Message :',
    payload.message,
  ].join('\n');
}
