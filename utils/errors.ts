/**
 * User-facing text from an `Error` for toast bodies and similar UI.
 * Prefer this over raw `error.message` so empty messages use a caller-provided fallback (e.g. i18n).
 */
export function formatErrorMessage(error: Error, fallback: string = 'An unknown error occurred'): string {
  const msg = error.message.trim();
  if (msg.length > 0) return msg;
  return fallback.trim();
}
