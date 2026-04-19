import React from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type OnboardingWhatIsPlainChatIconProps = {
  /** Logical width; height follows viewBox aspect ratio. */
  width?: number;
  color?: ColorValue;
};

/**
 * PlainChat mark for the first onboarding slide (192×192 viewBox).
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
      viewBox="0 0 192 192"
      fill="none"
      accessibilityLabel="PlainChat — chat over Markdown files"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M96 24C135.764 24 168 56.2355 168 96C168 135.764 135.764 168 96 168C75.7757 168 57.4996 159.661 44.4209 146.234C38.3912 159.096 25.3751 168 10.2861 168H0C13.2548 168 24 157.205 24 143.889V95H24.0068C24.5419 55.6965 56.5694 24 96 24ZM60.7324 84C54.2528 84 49 89.3726 49 96C49 102.627 54.2528 108 60.7324 108C67.2121 108 72.4648 102.627 72.4648 96C72.4648 89.3726 67.2121 84 60.7324 84ZM96 84C89.5204 84 84.2676 89.3726 84.2676 96C84.2676 102.627 89.5204 108 96 108C102.48 108 107.732 102.627 107.732 96C107.732 89.3726 102.48 84 96 84ZM131.268 84C124.788 84 119.535 89.3726 119.535 96C119.535 102.627 124.788 108 131.268 108C137.747 108 143 102.627 143 96C143 89.3726 137.747 84 131.268 84Z"
        fill={color}
      />
    </Svg>
  );
}
