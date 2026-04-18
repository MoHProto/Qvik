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
