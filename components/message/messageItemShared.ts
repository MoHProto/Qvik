/** Mirrors persisted `Message` fields plus UI-only `status`. */
export type MessageItemData = {
  id: string;
  threadId: string;
  body: string;
  createdAt: number;
  label?: string;
  input?: string;
  error?: string;
  status: MessageStatus;
};

export type MessageStatus = 'pending' | 'success' | 'error';

export type MessageItemProps = {
  data: MessageItemData;
  onRetry?: (item: MessageItemData) => void;
};

export function formatBubbleTime(createdAtMs: number): string {
  return new Date(createdAtMs).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
