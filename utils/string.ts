/**
 * Derives up to two initials from a display name (e.g. "Design sync" → "DS").
 */
export function formatInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/).filter((p) => p.length > 0);
  if (parts.length >= 2) {
    const a = parts[0]![0];
    const b = parts[1]![0];
    if (a != null && b != null) return `${a}${b}`.toUpperCase();
  }
  const word = parts[0] ?? '';
  if (word.length >= 2) return word.slice(0, 2).toUpperCase();
  return word.toUpperCase();
}
