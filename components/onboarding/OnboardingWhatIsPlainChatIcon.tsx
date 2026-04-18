import React from 'react';
import Svg, { Path } from 'react-native-svg';

export type OnboardingWhatIsPlainChatIconProps = {
  /** Logical width; height follows viewBox aspect ratio. */
  width?: number;
  color?: string;
};

/**
 * PlainChat bubble + ellipsis mark for the first onboarding slide (289×163 viewBox).
 */
export function OnboardingWhatIsPlainChatIcon({
  width = 120,
  color = '#ffffff',
}: OnboardingWhatIsPlainChatIconProps) {
  const height = (width * 163) / 289;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 289 163"
      fill="none"
      accessibilityLabel="PlainChat — chat over Markdown files"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M228 0C261.689 0 289 27.3106 289 61V102C289 135.689 261.689 163 228 163H85C68.2929 163 53.1554 156.283 42.1387 145.402C35.4486 155.98 23.6842 163 10.2861 163H0C13.2548 163 24 152.205 24 138.889V61C24 27.3106 51.3106 4.91249e-07 85 0H228ZM108.125 65C99.2194 65 92 72.2194 92 81.125C92 90.0306 99.2194 97.25 108.125 97.25C117.031 97.25 124.25 90.0306 124.25 81.125C124.25 72.2194 117.031 65 108.125 65ZM156.5 65C147.594 65 140.375 72.2194 140.375 81.125C140.375 90.0306 147.594 97.25 156.5 97.25C165.406 97.25 172.625 90.0306 172.625 81.125C172.625 72.2194 165.406 65 156.5 65ZM204.875 65C195.969 65 188.75 72.2194 188.75 81.125C188.75 90.0306 195.969 97.25 204.875 97.25C213.781 97.25 221 90.0306 221 81.125C221 72.2194 213.781 65 204.875 65Z"
        fill={color}
      />
    </Svg>
  );
}
