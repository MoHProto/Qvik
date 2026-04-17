/**
 * Central query keys for React Query. Keeps cache keys aligned with services.
 */
export const queryKeys = {
  accounts: {
    all: ['accounts'] as const,
    detail: (id: string) => ['accounts', id] as const,
  },
  threads: {
    all: ['threads'] as const,
    byAccount: (accountId: string) =>
      ['threads', 'account', accountId] as const,
  },
  messages: {
    byThread: (threadId: string) => ['messages', 'thread', threadId] as const,
  },
} as const;
