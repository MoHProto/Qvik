/** Curated emoji options for account avatar (order = picker order). */
export const ACCOUNT_AVATAR_EMOJIS = [
  '🙂',
  '😀',
  '😄',
  '😎',
  '🤓',
  '🧑‍💻',
  '👤',
  '🎨',
  '🎭',
  '🎵',
  '📷',
  '✈️',
  '🏠',
  '⚙️',
  '💡',
  '🔒',
  '🌟',
  '🌿',
  '🐱',
  '🐶',
  '🚀',
  '💼',
  '📚',
  '☕',
  '🎯',
] as const;

export type AccountAvatarEmoji = (typeof ACCOUNT_AVATAR_EMOJIS)[number];

export const DEFAULT_ACCOUNT_AVATAR_EMOJI: string = ACCOUNT_AVATAR_EMOJIS[0]!;

/** Random curated emoji for new-account prefill (same pool as the avatar picker). */
export function pickRandomAccountAvatarEmoji(): string {
  const i = Math.floor(Math.random() * ACCOUNT_AVATAR_EMOJIS.length);
  return ACCOUNT_AVATAR_EMOJIS[i]!;
}
