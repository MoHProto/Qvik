import type { AppLocale } from 'lib/i18n/locales';
import { APP_LOCALES } from 'lib/i18n/locales';
import { ar } from 'langs/ar';
import { de } from 'langs/de';
import { en } from 'langs/en';
import { es } from 'langs/es';
import { fa } from 'langs/fa';
import { fr } from 'langs/fr';
import { it } from 'langs/it';
import { kk } from 'langs/kk';
import { nl } from 'langs/nl';
import { ptBR } from 'langs/ptBR';
import { ru } from 'langs/ru';
import { tr } from 'langs/tr';
import { uk } from 'langs/uk';
import { uz } from 'langs/uz';

export const catalog: Record<AppLocale, Record<string, string>> = {
  uk,
  en,
  de,
  es,
  fr,
  it,
  nl,
  'pt-BR': ptBR,
  ar,
  tr,
  uz,
  kk,
  ru,
  fa,
};

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value != null && (APP_LOCALES as readonly string[]).includes(value);
}
