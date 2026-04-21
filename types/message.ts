export type MessageStatus = 'input' | 'pending' | 'success' | 'error';

export const MESSAGE_ROW_STATUSES: MessageStatus[] = [
  'input',
  'pending',
  'success',
  'error',
];

export function isMessageStatus(value: string): value is MessageStatus {
  return (MESSAGE_ROW_STATUSES as string[]).includes(value);
}
