import { notify } from 'lib/notify';

export type { NotifyOptions } from 'lib/notify';

/** Stable API for in-app toasts; wraps `lib/notify` for use from components. */
export function useNotifyToast() {
  return notify;
}
