import type { OnboardingSlideData } from 'components/onboarding/OnboardingSlide';
import { OnboardingSlider } from 'components/onboarding/OnboardingSlider';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 'what-is-qvik',
    icon: 'globe-outline',
    title: 'What is Qvik?',
    description:
      'Qvik is text-first chat for the web: short, clear answers instead of busy pages. Wikipedia and similar services sit in that same simple flow — without ad clutter.',
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
      <OnboardingSlider data={ONBOARDING_SLIDES} onGetStarted={onGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
