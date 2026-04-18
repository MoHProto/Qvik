import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';

import type { BackgroundProps } from './background.types';

export type { BackgroundProps } from './background.types';

const DEFAULT_OPACITY_LIGHT = 0.25;
const DEFAULT_OPACITY_DARK = 0.25;

/**
 * Repeating SVG texture layer. On iOS, core `Image` does not render SVG; this uses `expo-image`
 * in a tile grid. On web, use `Background.web.tsx` (CSS `background-repeat`).
 */
export function Background({
  source,
  tileSize,
  opacityLight = DEFAULT_OPACITY_LIGHT,
  opacityDark = DEFAULT_OPACITY_DARK,
  children,
}: BackgroundProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const opacity = isDark ? opacityDark : opacityLight;
  const { width, height } = useWindowDimensions();

  const tiles = useMemo(() => {
    const cols = Math.max(1, Math.ceil(width / tileSize) + 1);
    const rows = Math.max(1, Math.ceil(height / tileSize) + 1);
    const list: { key: string; left: number; top: number }[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        list.push({
          key: `${row}-${col}`,
          left: col * tileSize,
          top: row * tileSize,
        });
      }
    }
    return list;
  }, [width, height, tileSize]);

  const pattern = (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.clip]}
    >
      {tiles.map(({ key, left, top }) => (
        <Image
          key={key}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          cachePolicy="memory-disk"
          contentFit="fill"
          source={source}
          style={[
            styles.tile,
            {
              width: tileSize,
              height: tileSize,
              left,
              top,
              opacity,
            },
          ]}
        />
      ))}
    </View>
  );

  if (children != null) {
    return (
      <View style={styles.fill}>
        {pattern}
        <View style={styles.fill}>{children}</View>
      </View>
    );
  }

  return pattern;
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  tile: {
    position: 'absolute',
  },
});
