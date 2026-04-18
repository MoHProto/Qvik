import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, type ImageSourcePropType } from 'react-native';

import { warmAppIonIcons } from './warmAppIonIcons';

/** 1×1 transparent GIF — only used as a throwaway `ImageSource` on web (see `load`). */
const WEB_RASTER_PLACEHOLDER: ImageSourcePropType = {
  uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
};

/** Point size passed to `Ionicons.getImageSource` for native tab template images. */
export const TAB_BAR_ION_ICON_SIZE = 26;

export type TabBarIonRasterSources = {
  search: ImageSourcePropType;
  threads: ImageSourcePropType;
  settings: ImageSourcePropType;
};

let resolved: TabBarIonRasterSources | null = null;
let inFlight: Promise<TabBarIonRasterSources> | null = null;

async function load(): Promise<TabBarIonRasterSources> {
  await warmAppIonIcons();
  // `Ionicons.getImageSource` → `expo-font.renderToImageAsync`, which is native-only.
  // Web uses JS `Tabs` + vector icons; callers only need this promise to settle and the font warmed.
  if (Platform.OS === 'web') {
    return {
      search: WEB_RASTER_PLACEHOLDER,
      threads: WEB_RASTER_PLACEHOLDER,
      settings: WEB_RASTER_PLACEHOLDER,
    };
  }
  const size = TAB_BAR_ION_ICON_SIZE;
  const color = 'white';
  const [search, threads, settings] = await Promise.all([
    Ionicons.getImageSource('search-outline', size, color),
    Ionicons.getImageSource('chatbubble-ellipses-outline', size, color),
    Ionicons.getImageSource('settings-outline', size, color),
  ]);
  if (!search || !threads || !settings) {
    throw new Error('Failed to rasterize tab bar Ionicons');
  }
  return { search, threads, settings };
}

/**
 * Warms (or returns cached) Ionicons → image sources for iOS `NativeTabs`.
 * Always waits for `warmAppIonIcons()` first so `getImageSource` runs after the font is loaded.
 */
export function warmTabBarIonRasterSources(): Promise<TabBarIonRasterSources> {
  if (resolved) return Promise.resolve(resolved);
  if (!inFlight) {
    inFlight = load()
      .then((r) => {
        resolved = r;
        return r;
      })
      .catch((err) => {
        inFlight = null;
        throw err;
      });
  }
  return inFlight;
}

export function getTabBarIonRasterSources(): TabBarIonRasterSources | null {
  return resolved;
}

/**
 * Await before navigating to `(tabs)` so the first `NativeTabs` paint can use
 * raster tab icons (no VectorIcon / async placeholder on first layout).
 */
export async function ensureTabBarRasterReady(): Promise<TabBarIonRasterSources> {
  return warmTabBarIonRasterSources();
}
