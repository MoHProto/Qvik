import {
  MESSAGES_PATTERN_TILE_PX,
  messagesPatternSource,
} from 'assets/backgrounds/messagesPattern';
import { OnboardingCircle } from 'components/onboarding/OnboardingCircle';
import type { OnboardingSlideData } from 'components/onboarding/OnboardingSlide';
import { OnboardingSlider } from 'components/onboarding/OnboardingSlider';
import { Background } from 'components/ui/background';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type OnboardingScreenProps = {
  /** e.g. navigate into the app after the last slide. */
  onGetStarted?: () => void;
};

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const { t } = useI18n();

  const slides = useMemo<OnboardingSlideData[]>(
    () => [
      {
        id: 'web-without-noise',
        icon: 'globe-outline',
        title: t('onboarding.slide0.title'),
        description: t('onboarding.slide0.body'),
      },
      {
        id: 'markdown-core',
        icon: 'document-text-outline',
        title: t('onboarding.slide1.title'),
        description: t('onboarding.slide1.body'),
      },
      {
        id: 'always-with-you',
        icon: 'cloud-offline-outline',
        title: t('onboarding.slide2.title'),
        description: t('onboarding.slide2.body'),
      },
    ],
    [t],
  );

  return (
    <View style={styles.fill}>
      <Background source={messagesPatternSource} tileSize={MESSAGES_PATTERN_TILE_PX} />
      <OnboardingCircle />
      <OnboardingSlider data={slides} onGetStarted={onGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundAlt,
  },
}));
