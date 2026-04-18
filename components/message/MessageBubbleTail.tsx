import React from 'react';
import { type ColorValue, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

/** Single-path bubble tail (vector asset). */
const TAIL_PATH =
  'M17 3C17 11.2843 10.2843 18 2 18H0C5.52285 18 10 13.5228 10 8V0H17V3Z';

const VIEW_W = 17;
const VIEW_H = 18;

export type MessageBubbleTailProps = {
  side: 'left' | 'right';
  bubbleColor: ColorValue;
  /** @deprecated Unused; kept for call-site compatibility. */
  canvasColor?: ColorValue;
};

export function MessageBubbleTail({
  side,
  bubbleColor,
}: MessageBubbleTailProps) {
  const isRight = side === 'right';

  return (
    <View
      pointerEvents="none"
      style={[styles.host, isRight ? styles.hostRight : styles.hostLeft]}
    >
      <Svg width={VIEW_W} height={VIEW_H} viewBox="0 0 17 18">
        {isRight ? (
          <G transform="translate(17, 0) scale(-1, 1)">
            <Path d={TAIL_PATH} fill={bubbleColor} />
          </G>
        ) : (
          <Path d={TAIL_PATH} fill={bubbleColor} />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    width: VIEW_W,
    height: VIEW_H,
    bottom: 0,
    zIndex: 2,
  },
  hostLeft: {
    left: -10,
  },
  hostRight: {
    right: -10,
  },
});
