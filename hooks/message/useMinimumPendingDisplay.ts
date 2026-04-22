import { useEffect, useRef, useState } from 'react';

const DEFAULT_MIN_PENDING_MS = 450;

/**
 * Keeps pending (three-dot) UI visible for at least `minMs` after a row enters
 * pending, so a fast success response does not flash the loader. Errors clear
 * immediately when the row leaves pending.
 */
export function useMinimumPendingDisplay(
  messageId: string,
  isPending: boolean,
  isError: boolean,
  minMs: number = DEFAULT_MIN_PENDING_MS,
): boolean {
  const [showPending, setShowPending] = useState(isPending);
  const pendingSinceRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKeyRef = useRef(messageId);

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    clearTimer();

    if (prevKeyRef.current !== messageId) {
      prevKeyRef.current = messageId;
      pendingSinceRef.current = null;
      setShowPending(isPending);
      if (isPending) {
        pendingSinceRef.current = Date.now();
      }
      return clearTimer;
    }

    if (isPending) {
      pendingSinceRef.current = Date.now();
      setShowPending(true);
      return clearTimer;
    }

    if (isError) {
      pendingSinceRef.current = null;
      setShowPending(false);
      return clearTimer;
    }

    const started = pendingSinceRef.current;
    pendingSinceRef.current = null;

    if (started == null) {
      setShowPending(false);
      return clearTimer;
    }

    const elapsed = Date.now() - started;
    const remaining = minMs - elapsed;
    if (remaining <= 0) {
      setShowPending(false);
      return clearTimer;
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setShowPending(false);
    }, remaining);

    return clearTimer;
  }, [messageId, isPending, isError, minMs]);

  return showPending;
}
