import resolveAssetSource from 'expo-asset/build/resolveAssetSource';
import React from 'react';
import { type ImageSourcePropType, StyleSheet, View } from 'react-native';

import type { BackgroundProps } from './background.types';

const defaultBackgroundSource = require('../../../assets/backgrounds/default.png');
const DEFAULT_TILE_SIZE_PX = 128;

/**
 * Web: `react-native-web` `Image` pins intrinsic asset size (~tile), so tiling via `repeat`
 * fails. Use CSS `background-repeat` on a full-size `View`.
 */
export function Background({
  tileSize,
  children,
  scale = 3,
}: BackgroundProps) {
  const resolvedDefault = resolveAssetSource(defaultBackgroundSource as ImageSourcePropType);
  const intrinsicOrProvided =
    resolvedDefault?.width ?? resolvedDefault?.height ?? tileSize ?? DEFAULT_TILE_SIZE_PX;
  const effectiveTileSize = intrinsicOrProvided / scale;
  const uri = resolvedDefault?.uri;

  const pattern =
    uri != null ? (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.clip,
          {
            backgroundImage: `url(${uri})`,
            backgroundRepeat: 'repeat',
            backgroundSize: `${effectiveTileSize}px ${effectiveTileSize}px`,
          },
        ]}
      />
    ) : null;

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
});
