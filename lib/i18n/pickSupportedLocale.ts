import type { AppLocale } from 'lib/i18n/locales';

const PRIMARY_TO_LOCALE: Record<string, AppLocale> = {
  uk: 'uk',
  en: 'en',
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  nl: 'nl',
  pt: 'pt-BR',
  ar: 'ar',
  tr: 'tr',
  uz: 'uz',
  kk: 'kk',
  ru: 'ru',
  fa: 'fa',
};

const TAG_TO_LOCALE: Record<string, AppLocale> = {
  'pt-br': 'pt-BR',
};

export function pickSupportedLocale(languageCodeOrTag: string | null | undefined): AppLocale {
  if (!languageCodeOrTag) {
    return 'en';
  }
  const normalized = languageCodeOrTag.toLowerCase();
  const tagMatch = TAG_TO_LOCALE[normalized];
  if (tagMatch) {
    return tagMatch;
  }
  const primary = normalized.split('-')[0];
  if (!primary) {
    return 'en';
  }
  return PRIMARY_TO_LOCALE[primary] ?? 'en';
}
