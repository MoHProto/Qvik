import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import {
  JUMPING_DOT_AMPLITUDE_PX,
  JUMPING_DOT_HALF_MS,
  JUMPING_DOT_STAGGER_MS,
} from './timing';

const timingConfig = {
  duration: JUMPING_DOT_HALF_MS,
  easing: Easing.inOut(Easing.cubic),
};

/** Three bouncing dots (native: Reanimated). Stagger = exactly ⅓ of one full bounce cycle. */
export function JumpingDots() {
  const d1 = useSharedValue(0);
  const d2 = useSharedValue(0);
  const d3 = useSharedValue(0);

  useEffect(() => {
    const makeBounce = () =>
      withRepeat(
        withSequence(
          withTiming(-JUMPING_DOT_AMPLITUDE_PX, timingConfig),
          withTiming(0, timingConfig),
        ),
        -1,
        false,
      );
    d1.value = makeBounce();
    d2.value = withDelay(JUMPING_DOT_STAGGER_MS, makeBounce());
    d3.value = withDelay(2 * JUMPING_DOT_STAGGER_MS, makeBounce());
  }, [d1, d2, d3]);

  const s1 = useAnimatedStyle(() => ({
    transform: [{ translateY: d1.value }],
  }));
  const s2 = useAnimatedStyle(() => ({
    transform: [{ translateY: d2.value }],
  }));
  const s3 = useAnimatedStyle(() => ({
    transform: [{ translateY: d3.value }],
  }));

  return (
    <View style={styles.dotsRow} accessibilityLabel="Loading">
      <Animated.View style={s1}>
        <View style={styles.dotCircle} />
      </Animated.View>
      <Animated.View style={s2}>
        <View style={styles.dotCircle} />
      </Animated.View>
      <Animated.View style={s3}>
        <View style={styles.dotCircle} />
      </Animated.View>
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
