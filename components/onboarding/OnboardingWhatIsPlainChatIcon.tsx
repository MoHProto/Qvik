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
        d="M96 33C135.765 33 168 65.2355 168 105C168 144.765 135.765 177 96 177C75.7757 177 57.4996 168.661 44.4209 155.234C38.3912 168.096 25.3751 177 10.2861 177H0C13.2548 177 24 166.205 24 152.889V104H24.0068C24.5419 64.6965 56.5694 33 96 33ZM96 57C69.4903 57 48 78.4903 48 105C48 131.51 69.4903 153 96 153C122.51 153 144 131.51 144 105C144 78.4903 122.51 57 96 57ZM96 81C109.255 81 120 91.7452 120 105C120 118.255 109.255 129 96 129C82.7452 129 72 118.255 72 105C72 91.7452 82.7452 81 96 81Z"
        fill={color}
      />
    </Svg>
  );
}
