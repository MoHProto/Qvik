import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const DEFAULT_ITEM_WIDTH = 56;
const DEFAULT_CIRCLE_SIZE = 88;
const DEFAULT_STRIP_HEIGHT = 52;

/** Longer glide than Reanimated default (0.998); closer to 1 = slower velocity decay. */
const SLIDER_DECELERATION = 0.9995;
/** Amplify throw from finger velocity (px/s → decay). */
const SLIDER_VELOCITY_FACTOR = 1.35;
/** Below this |velocityX|, skip decay and spring straight to the nearest slot. */
const LOW_VELOCITY_PX_PER_S = 120;

const SNAP_SPRING = {
  damping: 18,
  stiffness: 220,
  mass: 0.35,
} as const;

function clampIndexFromScroll(
  scroll: number,
  itemWidth: number,
  emojiCount: number,
): { idx: number; snap: number } {
  'worklet';
  const maxIdx = Math.max(0, emojiCount - 1);
  const idx = Math.min(maxIdx, Math.max(0, Math.round(scroll / itemWidth)));
  return { idx, snap: idx * itemWidth };
}

export type AvatarInputProps = {
  emojis: readonly string[] | string[];
  value: string;
  onChange: (emoji: string) => void;
  /** Background of the center preview circle (defaults to theme avatar fallback). */
  circleBackgroundColor?: string;
  /** Text color for the emoji in the circle (optional). */
  emojiColor?: string;
  itemWidth?: number;
  circleSize?: number;
};

export function AvatarInput({
  emojis,
  value,
  onChange,
  circleBackgroundColor: circleBackgroundColorProp,
  emojiColor,
  itemWidth = DEFAULT_ITEM_WIDTH,
  circleSize = DEFAULT_CIRCLE_SIZE,
}: AvatarInputProps) {
  const { theme } = useUnistyles();
  const circleBackgroundColor =
    circleBackgroundColorProp ?? theme.colors.avatarFallback;

  const valueIndex = useMemo(() => {
    const i = emojis.indexOf(value);
    return i >= 0 ? i : 0;
  }, [emojis, value]);

  const [trackWidth, setTrackWidth] = useState(0);
  const sideInset = useMemo(() => {
    if (trackWidth <= 0) return 0;
    return Math.max(0, (trackWidth - itemWidth) / 2);
  }, [trackWidth, itemWidth]);

  const scrollX = useSharedValue(valueIndex * itemWidth);
  const panOriginScroll = useSharedValue(0);
  const maxScrollSV = useSharedValue(
    Math.max(0, (emojis.length - 1) * itemWidth),
  );
  const emojiCountSV = useSharedValue(emojis.length);

  const [centerIndex, setCenterIndex] = useState(valueIndex);

  useEffect(() => {
    emojiCountSV.value = emojis.length;
    maxScrollSV.value = Math.max(0, (emojis.length - 1) * itemWidth);
  }, [emojis.length, itemWidth, emojiCountSV, maxScrollSV]);

  useEffect(() => {
    cancelAnimation(scrollX);
    scrollX.value = valueIndex * itemWidth;
    setCenterIndex(valueIndex);
  }, [valueIndex, itemWidth, scrollX]);

  const onCommitIndex = useCallback(
    (idx: number) => {
      setCenterIndex(idx);
      const next = emojis[idx];
      if (next != null && next !== value) {
        onChange(next);
      }
    },
    [emojis, onChange, value],
  );

  useAnimatedReaction(
    () => Math.round(scrollX.value / itemWidth),
    (idx, prev) => {
      'worklet';
      const maxI = Math.max(0, emojiCountSV.value - 1);
      const clamped = Math.min(maxI, Math.max(0, idx));
      const prevClamped =
        prev === null || prev === undefined
          ? null
          : Math.min(maxI, Math.max(0, prev));
      if (prevClamped === null || clamped !== prevClamped) {
        runOnJS(setCenterIndex)(clamped);
      }
    },
    [itemWidth],
  );

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }],
  }));

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-14, 14])
        .failOffsetY([-18, 18])
        .onStart(() => {
          'worklet';
          cancelAnimation(scrollX);
          panOriginScroll.value = scrollX.value;
        })
        .onUpdate((e) => {
          'worklet';
          const maxS = maxScrollSV.value;
          const next = panOriginScroll.value - e.translationX;
          scrollX.value = Math.min(maxS, Math.max(0, next));
        })
        .onEnd((e) => {
          'worklet';
          const maxS = maxScrollSV.value;
          const count = emojiCountSV.value;
          const w = itemWidth;
          const vxThrow = -e.velocityX * SLIDER_VELOCITY_FACTOR;

          const springTo = (snap: number, idx: number) => {
            'worklet';
            scrollX.value = withSpring(snap, SNAP_SPRING, (finished) => {
              if (finished) {
                runOnJS(onCommitIndex)(idx);
              }
            });
          };

          if (Math.abs(e.velocityX) < LOW_VELOCITY_PX_PER_S) {
            const { idx, snap } = clampIndexFromScroll(scrollX.value, w, count);
            springTo(snap, idx);
            return;
          }

          scrollX.value = withDecay(
            {
              velocity: vxThrow,
              deceleration: SLIDER_DECELERATION,
              clamp: [0, maxS],
              rubberBandEffect: true,
              rubberBandFactor: 0.55,
            },
            (finished) => {
              if (!finished) {
                return;
              }
              const { idx, snap } = clampIndexFromScroll(scrollX.value, w, count);
              springTo(snap, idx);
            },
          );
        }),
    [itemWidth, onCommitIndex],
  );

  const displayEmoji = emojis[centerIndex] ?? emojis[0] ?? '';
  const circleFont = circleSize * 0.45;
  const stripFont = itemWidth * 0.42;

  if (emojis.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.outer}
      accessibilityRole="adjustable"
      accessibilityLabel="Account avatar emoji"
      accessibilityHint="Drag horizontally to choose an emoji; the centered emoji is selected."
    >
      <View style={styles.trackWrap} onLayout={onTrackLayout}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.gestureHost} collapsable={false}>
            <Animated.View style={[styles.emojiRow, animatedRowStyle]}>
              <View style={{ width: sideInset }} />
              {emojis.map((emoji, index) => (
                <View
                  key={`${index}-${emoji}`}
                  style={[styles.cell, { width: itemWidth, height: DEFAULT_STRIP_HEIGHT }]}
                >
                  <Text style={[styles.stripEmoji, { fontSize: stripFont }]}>{emoji}</Text>
                </View>
              ))}
              <View style={{ width: sideInset }} />
            </Animated.View>
          </View>
        </GestureDetector>

        <View style={styles.overlay} pointerEvents="none">
          <View
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: circleBackgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.circleEmoji,
                {
                  fontSize: circleFont,
                  color: emojiColor ?? theme.colors.text,
                },
              ]}
            >
              {displayEmoji}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  outer: {
    width: '100%',
    alignItems: 'stretch',
  },
  trackWrap: {
    width: '100%',
    minHeight: DEFAULT_CIRCLE_SIZE + theme.spacing[2],
    justifyContent: 'center',
  },
  gestureHost: {
    width: '100%',
    minHeight: DEFAULT_CIRCLE_SIZE + theme.spacing[2],
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DEFAULT_STRIP_HEIGHT,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripEmoji: {
    textAlign: 'center',
    opacity: 0.35,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 6,
  },
  circleEmoji: {
    textAlign: 'center',
  },
}));
