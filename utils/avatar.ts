/**
 * Deterministic pastel avatar fill + readable foreground from a display name.
 */
export function avatarTintFromName(name: string): {
  avatarBackground: string;
  avatarColor: string;
} | null {
  const key = name.trim();
  if (!key) return null;

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;
  return {
    avatarBackground: `hsl(${h}, 62%, 90%)`,
    avatarColor: `hsl(${h}, 52%, 26%)`,
  };
}
