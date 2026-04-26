import type { MessageStatus } from 'types/message';

export type MessageButtonData = {
  label: string;
  url: string;
};

/**
 * One list row = one persisted `Message`.
 *
 * - `input`: `body` is what the user entered.
 * - `pending`: do not use `body`; show loading dots.
 * - `success`: `body` is the server response body.
 * - `error`: `body` is the error message for the user.
 * - `isOutgoing`: bubble alignment / tail side (independent of `status` once rows evolve).
 */
export type MessageItemData = {
  id: string;
  threadId: string;
  body: string;
  timestamp: number;
  status: MessageStatus;
  isOutgoing: boolean;
  buttons?: MessageButtonData[];
};

export type MessageItemProps = {
  data: MessageItemData;
  showButtons?: boolean;
  onRetry?: (item: MessageItemData) => void;
  onVisit?: (button: MessageButtonData, item: MessageItemData) => void;
};

export function formatBubbleTime(timestampMs: number): string {
  return new Date(timestampMs).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
