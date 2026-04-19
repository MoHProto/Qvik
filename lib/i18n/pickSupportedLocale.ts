import type { AppLocale } from 'lib/i18n/catalog';

const PRIMARY_TO_LOCALE: Record<string, AppLocale> = {
  en: 'en',
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  pt: 'pt',
  pl: 'pl',
  uk: 'uk',
};

export function pickSupportedLocale(languageCode: string | null | undefined): AppLocale {
  if (!languageCode) {
    return 'en';
  }
  const primary = languageCode.split('-')[0]?.toLowerCase();
  if (!primary) {
    return 'en';
  }
  return PRIMARY_TO_LOCALE[primary] ?? 'en';
}
