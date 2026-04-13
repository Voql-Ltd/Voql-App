import { parsePhoneNumberFromString } from 'libphonenumber-js';

type NormalizeOptions = {
  defaultCountry?: string; // e.g. "NG"
};

export function normalizePhone(
  phone: string,
  options?: NormalizeOptions
): string | null {
  try {
    const cleaned = phone.trim();

    if (cleaned.startsWith('+')) {
      const parsed = parsePhoneNumberFromString(cleaned);
      return parsed?.isValid() ? parsed.number : null;
    }

    if (options?.defaultCountry) {
      const parsed = parsePhoneNumberFromString(
        cleaned,
        options.defaultCountry as any
      );
      return parsed?.isValid() ? parsed.number : null;
    }

    return null;
  } catch {
    return null;
  }
}


