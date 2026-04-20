import type { ReactNode } from 'react';

export type BackgroundProps = {
  /**
   * Tile edge length in px.
   * If omitted, the component uses the background image’s intrinsic pixel width (fallback to a safe default).
   */
  tileSize?: number;
  scale?: number;
  /**
   * When set, wraps `children` in a full-size column with the pattern behind.
   * When omitted, renders only the pattern layer — use inside a parent with `flex: 1` (pattern is `position: 'absolute'` fill).
   */
  children?: ReactNode;
};
