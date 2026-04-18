import React from 'react';
import { type ColorValue, StyleSheet, View } from 'react-native';

/**
 * iMessage-style tail: two overlapping rounded rects (see e.g. FreeCodeCamp
 * “iMessage-like chat bubble”). The first matches the bubble fill; the second
 * uses the chat canvas color to “cut” the curve into a beak.
 */
type MessageBubbleTailProps = {
  side: 'left' | 'right';
  bubbleColor: ColorValue;
  canvasColor: ColorValue;
};

export function MessageBubbleTail({
  side,
  bubbleColor,
  canvasColor,
}: MessageBubbleTailProps) {
  const isRight = side === 'right';
  return (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.tailMain,
          isRight ? styles.tailMainRight : styles.tailMainLeft,
          { backgroundColor: bubbleColor },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.tailCut,
          isRight ? styles.tailCutRight : styles.tailCutLeft,
          { backgroundColor: canvasColor },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tailMain: {
    position: 'absolute',
    width: 20,
    height: 25,
    bottom: 0,
    zIndex: 1,
  },
  tailMainRight: {
    right: -10,
    borderBottomLeftRadius: 25,
  },
  tailMainLeft: {
    left: -10,
    borderBottomRightRadius: 25,
  },
  tailCut: {
    position: 'absolute',
    width: 20,
    height: 35,
    bottom: -6,
    zIndex: 2,
  },
  tailCutRight: {
    right: -20,
    borderBottomLeftRadius: 18,
  },
  tailCutLeft: {
    left: -20,
    borderBottomRightRadius: 18,
  },
});
