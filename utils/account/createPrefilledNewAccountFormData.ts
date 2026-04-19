import type { AppLocale } from 'lib/i18n/locales';
import { pickRandomAccountAvatarEmoji } from 'utils/account/accountAvatarEmojis';
import { avatarTintFromName } from 'utils/avatar';
import { generateFunnyAccountName } from 'utils/names';

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

