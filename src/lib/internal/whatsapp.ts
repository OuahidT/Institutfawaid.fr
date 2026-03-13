type WhatsappNormalizationOptions = {
  countryDialCode?: string | null;
};

const DEFAULT_COUNTRY_DIAL_CODE = '+33';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeCountryDialCode(value: string | null | undefined) {
  const digits = digitsOnly(String(value ?? ''));
  if (!digits) return DEFAULT_COUNTRY_DIAL_CODE;
  return `+${digits}`;
}

export function normalizeWhatsappNumber(value: string | null | undefined, options: WhatsappNormalizationOptions = {}) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  let normalized = trimmed.replace(/[\s().-]/g, '');
  if (!normalized) return null;

  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`;
  }

  const selectedDialCode = normalizeCountryDialCode(options.countryDialCode);
  const selectedDialDigits = selectedDialCode.slice(1);
  const startsWithPlus = normalized.startsWith('+');

  let digits = digitsOnly(normalized);
  if (!digits) return null;

  if (startsWithPlus) {
    return `+${digits}`;
  }

  if (digits.startsWith(selectedDialDigits)) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
    if (!digits) return null;
    return `+${selectedDialDigits}${digits}`;
  }

  return `+${selectedDialDigits}${digits}`;
}

export function toWhatsappHref(
  value: string | null | undefined,
  options: WhatsappNormalizationOptions = {}
) {
  const normalized = normalizeWhatsappNumber(value, options);
  if (!normalized) return null;
  return `https://wa.me/${digitsOnly(normalized)}`;
}
