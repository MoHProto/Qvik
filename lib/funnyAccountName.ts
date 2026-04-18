const ADJECTIVES = [
  'Sleepy',
  'Chaotic',
  'Sneaky',
  'Overcaffeinated',
  'Tiny',
  'Grand',
  'Pixelated',
  'Mystical',
  'Hungry',
  'Philosophical',
  'Wobbly',
  'Cosmic',
  'Skeptical',
  'Jazzed',
  'Feral',
  'Certified',
  'Unhinged',
  'Polite',
  'Turbo',
  'Ambient',
] as const;

const NOUNS = [
  'Potato',
  'Waffle',
  'Noodle',
  'Llama',
  'Penguin',
  'Taco',
  'Cactus',
  'Banana',
  'Otter',
  'Fox',
  'Muffin',
  'Goblin',
  'Wizard',
  'Toaster',
  'Badger',
  'Crumpet',
  'Pigeon',
  'Narwhal',
  'Bagel',
  'Moose',
] as const;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Random display name for new accounts (prefills the account form). */
export function generateFunnyAccountName(): string {
  return `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
}
