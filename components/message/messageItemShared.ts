/**
 * One list row = one chat message (either outgoing user text or an incoming assistant row).
 * Mirrors persisted `Message` fields plus UI-only `status`.
 *
 * Outgoing: set `isOutgoing: true` and put user-visible text in `input` (other fields optional).
 * Incoming: set `isOutgoing` false/omit; use `body` / `error` and `status` for assistant UI.
 */
export type MessageItemData = {
  id: string;
  threadId: string;
  body: string;
  timestamp: number;
  /** Outgoing (user) bubble when true. */
  isOutgoing?: boolean;
  input?: string;
  error?: string;
  status: MessageStatus;
};

export type MessageStatus = 'pending' | 'success' | 'error';

export type MessageItemProps = {
  data: MessageItemData;
  onRetry?: (item: MessageItemData) => void;
};

export function formatBubbleTime(timestampMs: number): string {
  return new Date(timestampMs).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
