import React from 'react';
import { StyleSheet as RNStyleSheet, useWindowDimensions, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

/**
 * Circle center sits on the bottom screen edge at horizontal center (half the disk is below, clipped).
 */
export function OnboardingCircle() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { theme } = useUnistyles();

  const bottomSurfaceRadius = windowHeight / 2;
  const bottomSurfaceDiameter = bottomSurfaceRadius * 2;

  return (
    <View pointerEvents="none" style={RNStyleSheet.absoluteFill}>
      <View
        style={{
          position: 'absolute',
          left: windowWidth / 2 - bottomSurfaceRadius,
          top: windowHeight - bottomSurfaceRadius,
          width: bottomSurfaceDiameter,
          height: bottomSurfaceDiameter,
          borderRadius: bottomSurfaceRadius,
          backgroundColor: theme.colors.surface,
        }}
      />
    </View>
  );
}
