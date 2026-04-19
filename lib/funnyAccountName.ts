import type { AppLocale } from 'lib/i18n/catalog';

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

/** Pre-composed phrases (gender/agreement handled per phrase). */
const UKRAINIAN_NAMES = [
  'Сонний нарвал',
  'Хаотичний тостер',
  'Голодний лось',
  'Містичний кактус',
  'Крихітний пінгвін',
  'Філософський голуб',
  'Шалений гоблін',
  'Піксельний лис',
  'Космічний мафін',
  'Скептичний банан',
  'Нічний борсук',
  'Опівнічне тако',
  'Лінивий їжак',
  'Зірковий кролик',
  'Турбулентний бублик',
  'Атмосферний лось',
  'Підступний кактус',
  'Велика видра',
  'Дикий борсук',
  'Чемний нарвал',
  'Сертифікований тостер',
  'Надмірно кофеїновий пінгвін',
  'Трохи зламаний тостер',
  'Амбітний голуб',
  'Тихий гоблін',
  'Гучний лось',
  'М’який нарвал',
  'Раптовий тако',
  'Вічно голодний банан',
] as const;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Random display name for new accounts (prefills the account form). */
export function generateFunnyAccountName(locale: AppLocale = 'en'): string {
  if (locale === 'uk') {
    return pick(UKRAINIAN_NAMES);
  }
  return `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
}
