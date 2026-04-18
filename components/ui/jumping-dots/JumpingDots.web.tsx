import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  JUMPING_DOT_AMPLITUDE_PX,
  JUMPING_DOT_HALF_MS,
  JUMPING_DOT_STAGGER_MS,
} from './timing';

const easing = Easing.inOut(Easing.cubic);

function Dot({ delayMs }: { delayMs: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -JUMPING_DOT_AMPLITUDE_PX,
          duration: JUMPING_DOT_HALF_MS,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: JUMPING_DOT_HALF_MS,
          easing,
          useNativeDriver: true,
        }),
      ]),
    );
    const id = setTimeout(() => {
      bounce.start();
    }, delayMs);
    return () => {
      clearTimeout(id);
      bounce.stop();
      translateY.setValue(0);
    };
  }, [translateY, delayMs]);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View style={styles.dotCircle} />
    </Animated.View>
  );
}

/** Three bouncing dots (web: RN Animated). Same timing as native via `timing.ts`. */
export function JumpingDots() {
  return (
    <View style={styles.dotsRow} accessibilityLabel="Loading">
      <Dot delayMs={0} />
      <Dot delayMs={JUMPING_DOT_STAGGER_MS} />
      <Dot delayMs={2 * JUMPING_DOT_STAGGER_MS} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 24,
    paddingVertical: 2,
  },
  dotCircle: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
}));
