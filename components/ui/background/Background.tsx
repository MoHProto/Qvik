import { Image as ExpoImage } from 'expo-image';
import React, { useMemo } from 'react';
import { Image as RNImage, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { BackgroundProps } from './background.types';

export type { BackgroundProps } from './background.types';

const defaultBackgroundSource = require('../../../assets/backgrounds/default.png');

export function Background({
  tileSize,
  children,
  scale = 3,
}: BackgroundProps) {
  const { width, height } = useWindowDimensions();

  const resolvedDefault = RNImage.resolveAssetSource(defaultBackgroundSource);
  const effectiveTileSize =
    (resolvedDefault?.width ?? resolvedDefault?.height ?? tileSize) / scale;

  const tiles = useMemo(() => {
    const cols = Math.max(1, Math.ceil(width / effectiveTileSize) + 1);
    const rows = Math.max(1, Math.ceil(height / effectiveTileSize) + 1);
    const list: { key: string; left: number; top: number }[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        list.push({
          key: `${row}-${col}`,
          left: col * effectiveTileSize,
          top: row * effectiveTileSize,
        });
      }
    }
    return list;
  }, [width, height, effectiveTileSize]);

  const pattern = (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip]}>
      {tiles.map(({ key, left, top }) => (
        <ExpoImage
          key={key}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          cachePolicy="memory-disk"
          contentFit="fill"
          source={defaultBackgroundSource}
          style={[
            styles.tile,
            {
              width: effectiveTileSize,
              height: effectiveTileSize,
              left,
              top,
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
