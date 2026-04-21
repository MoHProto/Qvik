/**
 * Normalizes user-entered URL text for storage and display (adds https when missing).
 */
export function normalizeUrlInput(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Origin (scheme + host + port) for thread storage — strips path, query, and hash.
 * Call with a normalized absolute URL (see {@link normalizeUrlInput}).
 */
export function baseUrlFromUrl(normalizedUrl: string): string {
  try {
    return new URL(normalizedUrl).origin;
  } catch {
    return normalizedUrl;
  }
}

/**
 * Pathname segment of a normalized absolute URL (leading `/`, no query or hash).
 * On parse failure returns `'/'`.
 */
export function pathnameFromUrl(normalizedUrl: string): string {
  try {
    return new URL(normalizedUrl).pathname;
  } catch {
    return '/';
  }
}

/** Short label from a normalized absolute URL (hostname, without leading www). */
export function titleFromUrl(normalizedUrl: string): string {
  try {
    const u = new URL(normalizedUrl);
    const host = u.hostname.replace(/^www\./i, '');
    return host.length > 0 ? host : normalizedUrl;
  } catch {
    return normalizedUrl;
  }
}
