import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeProvider } from '@react-navigation/native';
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import { usePathname, useRouter, type Href } from 'expo-router';
import { getTabBarIonRasterSources, warmTabBarIonRasterSources } from 'lib/tabBarIonRasterSources';
import { getAppNavigationTheme } from 'lib/navigationTheme';
import { getSystemAccentColor } from 'lib/systemAccent';
import React, { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';

export default function NavigationTabs() {
  const colorScheme = useColorScheme();
  const navigationTheme = getAppNavigationTheme(colorScheme);
  const tabIconColorDefault = navigationTheme.colors.text;
  const tabIconColorSelected = getSystemAccentColor();
  const pathname = usePathname();
  const router = useRouter();

  const [raster, setRaster] = useState(getTabBarIonRasterSources);
  const prevRasterRef = useRef(getTabBarIonRasterSources());

  useEffect(() => {
    if (raster) return;
    let cancelled = false;
    void warmTabBarIonRasterSources().then((sources) => {
      if (!cancelled) setRaster(sources);
    });
    return () => {
      cancelled = true;
    };
  }, [raster]);

  /**
   * When icons switch from VectorIcon placeholders to raster `ImageSource`s, the native
   * tab bar can keep the wrong selected appearance. Re-assert the current `(tabs)` route
   * without changing the URL so the active item matches navigation state again.
   */
  useEffect(() => {
    if (!raster) return;
    const prev = prevRasterRef.current;
    if (prev === raster) return;
    prevRasterRef.current = raster;
    if (prev !== null) return;

    if (!pathname.startsWith('/(tabs)/')) return;

    const id = requestAnimationFrame(() => {
      router.replace(pathname as Href);
    });
    return () => cancelAnimationFrame(id);
  }, [raster, pathname, router]);

  return (
    <ThemeProvider value={navigationTheme}>
      <NativeTabs
        iconColor={{
          default: tabIconColorDefault,
          selected: tabIconColorSelected,
        }}
      >
        <NativeTabs.Trigger name="search">
          <Icon
            src={
              raster
                ? {
                    default: raster.search,
                    selected: raster.search,
                  }
                : {
                    default: <VectorIcon family={Ionicons} name="search-outline" />,
                    selected: <VectorIcon family={Ionicons} name="search-outline" />,
                  }
            }
          />
          <Label>Search</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="threads">
          <Icon
            src={
              raster
                ? {
                    default: raster.threads,
                    selected: raster.threads,
                  }
                : {
                    default: (
                      <VectorIcon
                        family={Ionicons}
                        name="chatbubble-ellipses-outline"
                      />
                    ),
                    selected: (
                      <VectorIcon
                        family={Ionicons}
                        name="chatbubble-ellipses-outline"
                      />
                    ),
                  }
            }
          />
          <Label>Threads</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <Icon
            src={
              raster
                ? {
                    default: raster.settings,
                    selected: raster.settings,
                  }
                : {
                    default: <VectorIcon family={Ionicons} name="settings-outline" />,
                    selected: (
                      <VectorIcon family={Ionicons} name="settings-outline" />
                    ),
                  }
            }
          />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
