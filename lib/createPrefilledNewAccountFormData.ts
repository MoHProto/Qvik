import { pickRandomAccountAvatarEmoji } from './accountAvatarEmojis';
import { generateFunnyAccountName } from './funnyAccountName';
import { avatarTintFromName } from 'utils/avatarTintFromName';

/** Prefill for `AccountFormModal` `initialAccount` (call before opening the modal). */
export function createPrefilledNewAccountFormData(): {
  name: string;
  avatarIcon: string;
  avatarBackground?: string;
  avatarColor?: string;
} {
  const name = generateFunnyAccountName();
  const tint = avatarTintFromName(name);
  return {
    name,
    avatarIcon: pickRandomAccountAvatarEmoji(),
    avatarBackground: tint?.avatarBackground,
    avatarColor: tint?.avatarColor,
  };
}
