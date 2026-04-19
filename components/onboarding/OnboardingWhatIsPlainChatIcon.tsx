import React from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type OnboardingWhatIsPlainChatIconProps = {
  /** Logical width; height follows viewBox aspect ratio. */
  width?: number;
  color?: ColorValue;
};

/**
 * PlainChat mark for the first onboarding slide (210×210 viewBox).
 */
export function OnboardingWhatIsPlainChatIcon({
  width = 120,
  color = '#ffffff',
}: OnboardingWhatIsPlainChatIconProps) {
  const height = width;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 210 210"
      fill="none"
      accessibilityLabel="PlainChat — chat over Markdown files"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M105 24C149.735 24 186 60.2649 186 105C186 149.735 149.735 186 105 186C81.7166 186 60.7287 176.175 45.9531 160.446C40.8592 175.315 26.816 186 10.2861 186H0C13.2548 186 24 175.205 24 161.889V107H24.0244C24.0083 106.335 24 105.669 24 105C24 60.2649 60.2649 24 105 24ZM105 81C91.7452 81 81 91.7452 81 105C81 118.255 91.7452 129 105 129C118.255 129 129 118.255 129 105C129 91.7452 118.255 81 105 81Z"
        fill={color}
      />
    </Svg>
  );
}
