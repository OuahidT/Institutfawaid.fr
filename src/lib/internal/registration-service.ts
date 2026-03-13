import 'server-only';

import { normalizeWhatsappNumber } from '@/lib/internal/whatsapp';
import {
  REGISTRATION_COURSE_TYPE_OPTIONS,
  REGISTRATION_LEVEL_OPTIONS,
  REGISTRATION_PAYMENT_OPTIONS,
  parseHoursPerWeekInput,
  sanitizeAvailabilities,
} from '@/lib/registration/constants';
import { getSupabaseServiceClient } from '@/lib/supabase/service';

export type PublicRegistrationInput = {
  email: string;
  fullName: string;
  gender?: string | null;
  age?: string | number | null;
  whatsappCountryCode?: string | null;
  whatsappNumber: string;
  arabicLevel: string;
  courseType: string;
  hoursPerWeek: string;
  paymentMethod: string;
  discoverySource?: string | null;
  applicantNote?: string | null;
  availabilities: unknown;
};

type NormalizedRegistrationInput = {
  email: string;
  full_name: string;
  gender: string | null;
  age: number | null;
  whatsapp_number: string;
  normalized_whatsapp_number: string | null;
  arabic_level: string;
  course_type: string;
  hours_per_week: number | null;
  payment_method: string;
  discovery_source: string | null;
  applicant_note: string | null;
  availabilities: ReturnType<typeof sanitizeAvailabilities>;
};

function asTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeAge(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function assertRequired(value: string, message: string) {
  if (!value) throw new Error(message);
}

function normalizeRegistrationInput(input: PublicRegistrationInput): NormalizedRegistrationInput {
  const email = asTrimmedString(input.email).toLowerCase();
  const fullName = asTrimmedString(input.fullName);
  const whatsappCountryCode = asTrimmedString(input.whatsappCountryCode) || '+33';
  const whatsappNumber = asTrimmedString(input.whatsappNumber);
  const arabicLevel = asTrimmedString(input.arabicLevel);
  const courseType = asTrimmedString(input.courseType);
  const paymentMethod = asTrimmedString(input.paymentMethod);
  const gender = asTrimmedString(input.gender);
  const discoverySource = asTrimmedString(input.discoverySource);
  const applicantNote = asTrimmedString(input.applicantNote);

  assertRequired(email, "L'email est obligatoire.");
  assertRequired(fullName, 'Le nom est obligatoire.');
  assertRequired(whatsappNumber, 'Le numéro WhatsApp est obligatoire.');
  assertRequired(arabicLevel, 'Le niveau est obligatoire.');
  assertRequired(courseType, 'Le type de cours est obligatoire.');
  assertRequired(paymentMethod, 'Le moyen de paiement est obligatoire.');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Le format de l'email est invalide.");
  }

  if (!REGISTRATION_LEVEL_OPTIONS.includes(arabicLevel as (typeof REGISTRATION_LEVEL_OPTIONS)[number])) {
    throw new Error("Niveau d'arabe invalide.");
  }

  if (!REGISTRATION_COURSE_TYPE_OPTIONS.includes(courseType as (typeof REGISTRATION_COURSE_TYPE_OPTIONS)[number])) {
    throw new Error('Type de cours invalide.');
  }

  if (!REGISTRATION_PAYMENT_OPTIONS.includes(paymentMethod as (typeof REGISTRATION_PAYMENT_OPTIONS)[number])) {
    throw new Error('Moyen de paiement invalide.');
  }

  const normalizedWhatsapp = normalizeWhatsappNumber(whatsappNumber, {
    countryDialCode: whatsappCountryCode,
  });
  if (!normalizedWhatsapp) {
    throw new Error('Le numéro WhatsApp semble invalide.');
  }
  const hoursPerWeek = parseHoursPerWeekInput(asTrimmedString(input.hoursPerWeek));

  return {
    email,
    full_name: fullName,
    gender: gender || null,
    age: normalizeAge(input.age),
    whatsapp_number: normalizedWhatsapp,
    normalized_whatsapp_number: normalizedWhatsapp,
    arabic_level: arabicLevel,
    course_type: courseType,
    hours_per_week: hoursPerWeek,
    payment_method: paymentMethod,
    discovery_source: discoverySource || null,
    applicant_note: applicantNote || null,
    availabilities: sanitizeAvailabilities(input.availabilities),
  };
}

export async function createRegistrationRequest(input: PublicRegistrationInput) {
  const supabase = getSupabaseServiceClient();
  const payload = normalizeRegistrationInput(input);

  const { data, error } = await supabase
    .from('registration_requests')
    .insert({
      ...payload,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Création inscription impossible: ${error.message}`);
  }

  return data.id;
}
