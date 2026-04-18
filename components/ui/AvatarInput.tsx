import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const DEFAULT_ITEM_WIDTH = 56;
const DEFAULT_CIRCLE_SIZE = 88;
const DEFAULT_STRIP_HEIGHT = 52;

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

function indexFromOffset(
  offsetX: number,
  itemWidth: number,
  length: number,
): number {
  if (length <= 0) return 0;
  return Math.min(length - 1, Math.max(0, Math.round(offsetX / itemWidth)));
}

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
  const scrollRef = useRef<ScrollView>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const sideInset = useMemo(() => {
    if (trackWidth <= 0) return 0;
    return Math.max(0, (trackWidth - itemWidth) / 2);
  }, [trackWidth, itemWidth]);

  const valueIndex = useMemo(() => {
    const i = emojis.indexOf(value);
    return i >= 0 ? i : 0;
  }, [emojis, value]);

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, animated: boolean) => {
      const x = index * itemWidth;
      scrollRef.current?.scrollTo({ x, y: 0, animated });
    },
    [itemWidth],
  );

  useEffect(() => {
    if (trackWidth <= 0) return;
    scrollToIndex(valueIndex, false);
    setCenterIndex(valueIndex);
  }, [trackWidth, valueIndex, scrollToIndex]);

  const commitFromOffset = useCallback(
    (offsetX: number) => {
      const idx = indexFromOffset(offsetX, itemWidth, emojis.length);
      setCenterIndex(idx);
      const next = emojis[idx];
      if (next != null && next !== value) {
        onChange(next);
      }
    },
    [emojis, itemWidth, onChange, value],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      setCenterIndex(indexFromOffset(x, itemWidth, emojis.length));
    },
    [emojis.length, itemWidth],
  );

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      commitFromOffset(e.nativeEvent.contentOffset.x);
    },
    [commitFromOffset],
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
      accessibilityHint="Scroll horizontally to choose an emoji; the centered emoji is selected."
    >
      <View style={styles.trackWrap} onLayout={onTrackLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={[styles.scroll, { height: DEFAULT_STRIP_HEIGHT }]}
          contentContainerStyle={{
            paddingHorizontal: sideInset,
            alignItems: 'center',
            minHeight: DEFAULT_STRIP_HEIGHT,
          }}
          decelerationRate="fast"
          snapToInterval={itemWidth}
          snapToAlignment="start"
          disableIntervalMomentum
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
        >
          {emojis.map((emoji, index) => (
            <View
              key={`${index}-${emoji}`}
              style={[styles.cell, { width: itemWidth, height: DEFAULT_STRIP_HEIGHT }]}
            >
              <Text style={[styles.stripEmoji, { fontSize: stripFont }]}>{emoji}</Text>
            </View>
          ))}
        </ScrollView>

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
  scroll: {
    width: '100%',
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
