import Ionicons from '@expo/vector-icons/Ionicons';

let loadPromise: Promise<void> | null = null;

/**
 * Preloads the Ionicons font (Expo `Font.loadAsync` for the Ionicon set).
 * Safe to call from multiple places; subsequent calls share the same promise.
 */
export function warmAppIonIcons(): Promise<void> {
  if (!loadPromise) {
    loadPromise = Ionicons.loadFont();
  }
  return loadPromise;
}
