import React from 'react';
import { type ColorValue, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

/** Single-path bubble tail (vector asset). */
const TAIL_PATH = 'M14 7C14 13.0751 9.07513 18 3 18H0C3.86599 18 7 14.866 7 11V0H14V7Z';

const VIEW_W = 14;
const VIEW_H = 18;

export type MessageBubbleTailProps = {
  side: 'left' | 'right' | 'center';
  bubbleColor: ColorValue;
  /** @deprecated Unused; kept for call-site compatibility. */
  canvasColor?: ColorValue;
  /** Visual scale factor (1 = default asset size). */
  scale?: number;
  /** Override stacking order when needed. */
  zIndex?: number;
};

export function MessageBubbleTail({
  side,
  bubbleColor,
  scale = 1,
  zIndex,
}: MessageBubbleTailProps) {
  const isRight = side === 'right';
  const isCenter = side === 'center';
  const w = VIEW_W * scale;
  const h = VIEW_H * scale;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.host,
        { width: w, height: h },
        zIndex === undefined ? null : { zIndex },
        isCenter
          ? { left: '50%', marginLeft: -w / 2 - 10, bottom: -7 * scale }
          : isRight
            ? styles.hostRight
            : { ...styles.hostLeft, left: -7 * scale },
      ]}
    >
      <Svg width={w} height={h} viewBox="0 0 14 18">
        {isRight ? (
          <G transform="translate(14, 0) scale(-1, 1)">
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
    bottom: 0,
    zIndex: 2,
  },
  hostLeft: {
    left: -7,
  },
  hostRight: {
    right: -7,
  },
});
