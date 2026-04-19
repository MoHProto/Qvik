import type { AppLocale } from 'lib/i18n/catalog';

export function pickSupportedLocale(
  languageCode: string | null | undefined,
): AppLocale {
  if (!languageCode) {
    return 'en';
  }
  const lc = languageCode.toLowerCase();
  if (lc === 'uk') {
    return 'uk';
  }
  return 'en';
}
