import resolveAssetSource from 'expo-asset/build/resolveAssetSource';
import React from 'react';
import { type ImageSourcePropType, StyleSheet, useColorScheme, View } from 'react-native';

import type { BackgroundProps } from './background.types';

const DEFAULT_OPACITY_LIGHT = 0.75;
const DEFAULT_OPACITY_DARK = 0.06;

/**
 * Web: `react-native-web` `Image` pins intrinsic asset size (~tile), so tiling via `repeat`
 * fails. Use CSS `background-repeat` on a full-size `View`.
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
  const resolved = resolveAssetSource(source as ImageSourcePropType);
  const uri = resolved?.uri;

  const pattern =
    uri != null ? (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundImage: `url(${uri})`,
            backgroundRepeat: 'repeat',
            backgroundSize: `${tileSize}px ${tileSize}px`,
            opacity,
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
  fill: {
    flex: 1,
  },
});
