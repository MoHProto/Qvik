import type { ImageProps } from 'expo-image';
import type { ReactNode } from 'react';

export type BackgroundProps = {
  /** Static asset from `require('.../file.svg')` (Metro `assetExts` includes `svg`). */
  source: NonNullable<ImageProps['source']>;
  /** Tile edge length in px; should match the SVG viewBox for seamless repeats. */
  tileSize: number;
  opacityLight?: number;
  opacityDark?: number;
  /**
   * When set, wraps `children` in a full-size column with the pattern behind.
   * When omitted, renders only the pattern layer — use inside a parent with `flex: 1` (pattern is `position: 'absolute'` fill).
   */
  children?: ReactNode;
};
