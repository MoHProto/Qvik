import type { ThreadItemData } from 'components/thread/ThreadItem';

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

export function getExampleThreadById(threadId: string): ThreadItemData {
  const found = EXAMPLE_THREADS.find((t) => t.id === threadId);
  if (found) {
    return found;
  }
  return {
    id: threadId,
    accountId: 'acc-1',
    title: 'Thread',
    rootUrl: 'https://picsum.photos/seed/unknown/128',
    description: 'Example header when thread id is unknown.',
  };
}
