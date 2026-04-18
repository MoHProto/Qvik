import {
  MESSAGES_PATTERN_TILE_PX,
  messagesPatternSource,
} from 'assets/backgrounds/messagesPattern';
import type { OnboardingSlideData } from 'components/onboarding/OnboardingSlide';
import { OnboardingSlider } from 'components/onboarding/OnboardingSlider';
import { OnboardingWhatIsPlainChatIcon } from 'components/onboarding/OnboardingWhatIsPlainChatIcon';
import { Background } from 'components/ui/background';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 'what-is-plainchat',
    SvgIllustration: OnboardingWhatIsPlainChatIcon,
    title: 'What is PlainChat?',
    description:
      "It's chat for Plain Web. For the web without heavy design or annoying ads.",
  },
  {
    id: 'threads',
    icon: 'chatbubbles-outline',
    title: 'What is a thread?',
    description:
      "It's like visiting a website, but the whole history stays in one timeline. You can come back to it anytime.",
  },
  {
    id: 'account',
    icon: 'id-card-outline',
    title: 'Is it private?',
    description:
      'Yes. Your account stays on this device. Move it over when you switch to a new one.',
  },
];

export type OnboardingScreenProps = {
  /** e.g. navigate into the app after the last slide. */
  onGetStarted?: () => void;
};

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <View style={styles.fill}>
      <Background
        source={messagesPatternSource}
        tileSize={MESSAGES_PATTERN_TILE_PX}
      />
      <OnboardingSlider data={ONBOARDING_SLIDES} onGetStarted={onGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },
}));
