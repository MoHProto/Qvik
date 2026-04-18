import {
  MESSAGES_PATTERN_TILE_PX,
  messagesPatternSource,
} from 'assets/backgrounds/messagesPattern';
import type { OnboardingSlideData } from 'components/onboarding/OnboardingSlide';
import { OnboardingSlider } from 'components/onboarding/OnboardingSlider';
import { Background } from 'components/ui/background';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 'what-is-marchat',
    icon: 'globe-outline',
    title: 'What is Marchat?',
    description:
      'Marchat is text-first chat for the web — where “the web” is a web of Markdown files. Short, clear answers instead of heavy design, busy pages, and annoying ads.',
  },
  {
    id: 'threads',
    icon: 'chatbubbles-outline',
    title: 'Threads',
    description:
      'Each thread is one ongoing conversation with a single site or service. The full history lives in your message timeline, so you can scroll back anytime.',
  },
  {
    id: 'account',
    icon: 'person-outline',
    title: 'Account',
    description:
      'Your account and related data stay on this device. When you switch devices, you can transfer your information when you are ready.',
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
