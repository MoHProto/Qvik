import type { ThreadItemData } from 'components/thread/ThreadItem';

const THREAD_I18N: Record<
  string,
  { titleKey: string; descriptionKey?: string }
> = {
  '1': { titleKey: 'demo.thread.1.title', descriptionKey: 'demo.thread.1.desc' },
  '2': { titleKey: 'demo.thread.2.title' },
  '3': { titleKey: 'demo.thread.3.title', descriptionKey: 'demo.thread.3.desc' },
  '4': { titleKey: 'demo.thread.4.title', descriptionKey: 'demo.thread.4.desc' },
  '5': { titleKey: 'demo.thread.5.title', descriptionKey: 'demo.thread.5.desc' },
  '6': { titleKey: 'demo.thread.6.title', descriptionKey: 'demo.thread.6.desc' },
};

export function localizeThreadItem(
  item: ThreadItemData,
  t: (key: string) => string,
): ThreadItemData {
  const map = THREAD_I18N[item.id];
  if (!map) {
    return item;
  }
  return {
    ...item,
    title: t(map.titleKey),
    description: map.descriptionKey
      ? t(map.descriptionKey)
      : item.description,
  };
}

/** Demo threads shared by list and message screens. */
export const EXAMPLE_THREADS: ThreadItemData[] = [
  {
    id: '1',
    accountId: 'acc-1',
    title: 'Design sync',
    rootUrl: 'https://picsum.photos/seed/thread1/128',
    description: 'Discuss navigation patterns for v2.',
  },
  {
    id: '2',
    accountId: 'acc-1',
    title: 'Mobile release',
    rootUrl: null,
    iconEmoji: '🚀',
    avatarBackground: '#dbeafe',
    avatarColor: '#1e40af',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: '3',
    accountId: 'acc-2',
    title: 'Support inbox',
    rootUrl: '',
    iconEmoji: '💬',
    avatarBackground: '#f3e8ff',
    avatarColor: '#6b21a8',
    description: 'Queued tickets from the weekend.',
  },
  {
    id: '4',
    accountId: 'acc-1',
    title: 'Plain thread A',
    rootUrl: null,
    description: 'No image, emoji, or avatar tint — initials only.',
  },
  {
    id: '5',
    accountId: 'acc-2',
    title: 'Weekly standup notes',
    description: 'Two-word title for initials.',
  },
  {
    id: '6',
    accountId: 'acc-1',
    title: 'X',
    description: 'Single-letter title edge case.',
  },
];

export function getExampleThreadById(
  threadId: string,
  t: (key: string) => string,
): ThreadItemData {
  const found = EXAMPLE_THREADS.find((row) => row.id === threadId);
  if (found) {
    return localizeThreadItem(found, t);
  }
  return {
    id: threadId,
    accountId: 'acc-1',
    title: t('demo.thread.fallback.title'),
    rootUrl: 'https://picsum.photos/seed/unknown/128',
    description: t('demo.thread.fallback.desc'),
  };
}

export function getLocalizedExampleThreads(
  t: (key: string) => string,
): ThreadItemData[] {
  return EXAMPLE_THREADS.map((row) => localizeThreadItem(row, t));
}
