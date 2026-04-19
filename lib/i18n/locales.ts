export const APP_LOCALES = [
  'uk',
  'en',
  'de',
  'es',
  'fr',
  'it',
  'nl',
  'pt-BR',
  'ar',
  'tr',
  'uz',
  'kk',
  'ru',
  'fa',
] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'mohproto.appLocale';

