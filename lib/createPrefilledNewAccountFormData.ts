import { pickRandomAccountAvatarEmoji } from './accountAvatarEmojis';
import { generateFunnyAccountName } from './funnyAccountName';
import type { AppLocale } from 'lib/i18n/locales';
import { avatarTintFromName } from 'utils/avatarTintFromName';

/** Prefill for `AccountFormModal` `initialAccount` (call before opening the modal). */
export function createPrefilledNewAccountFormData(locale: AppLocale = 'en'): {
  name: string;
  avatarIcon: string;
  avatarBackground?: string;
  avatarColor?: string;
} {
  const name = generateFunnyAccountName(locale);
  const tint = avatarTintFromName(name);
  return {
    name,
    avatarIcon: pickRandomAccountAvatarEmoji(),
    avatarBackground: tint?.avatarBackground,
    avatarColor: tint?.avatarColor,
  };
}
