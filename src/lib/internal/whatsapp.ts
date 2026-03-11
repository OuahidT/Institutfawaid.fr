function stripPhoneToDigits(value: string) {
  return value.replace(/[^\d+]/g, '');
}

export function normalizeWhatsappNumber(value: string | null | undefined) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  let normalized = stripPhoneToDigits(trimmed);
  if (!normalized) return null;

  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`;
  }

  let digits = normalized.startsWith('+') ? normalized.slice(1) : normalized;
  digits = digits.replace(/\D/g, '');

  if (!digits) return null;

  // Local French numbers: 06XXXXXXXX / 07XXXXXXXX -> 33XXXXXXXXX
  if (/^0[67]\d{8}$/.test(digits)) {
    return `33${digits.slice(1)}`;
  }

  // French mobile without leading 0: 6XXXXXXXX / 7XXXXXXXX
  if (/^[67]\d{8}$/.test(digits)) {
    return `33${digits}`;
  }

  return digits;
}

export function toWhatsappHref(value: string | null | undefined) {
  const normalized = normalizeWhatsappNumber(value);
  return normalized ? `https://wa.me/${normalized}` : null;
}

