import React from 'react';
import { StyleSheet as RNStyleSheet, useWindowDimensions, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

/**
 * Large surface disk behind onboarding; horizontally centered.
 * Center y is −1.5× viewport height; diameter is 1.5× viewport width.
 */
export function OnboardingCircle() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { theme } = useUnistyles();

  const bottomSurfaceDiameter = windowWidth * 1.5;
  const bottomSurfaceRadius = bottomSurfaceDiameter / 2;

  return (
    <View pointerEvents="none" style={RNStyleSheet.absoluteFill}>
      <View
        style={{
          position: 'absolute',
          left: windowWidth / 2 - bottomSurfaceRadius,
          top: windowHeight / 2 - 50,
          width: bottomSurfaceDiameter,
          height: bottomSurfaceDiameter,
          borderRadius: '100%',
          backgroundColor: theme.colors.surface,
        }}
      />
    </View>
  );
}
