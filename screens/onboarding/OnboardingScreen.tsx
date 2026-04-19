import {
  MESSAGES_PATTERN_TILE_PX,
  messagesPatternSource,
} from 'assets/backgrounds/messagesPattern';
import type { OnboardingSlideData } from 'components/onboarding/OnboardingSlide';
import { OnboardingSlider } from 'components/onboarding/OnboardingSlider';
import { OnboardingWhatIsPlainChatIcon } from 'components/onboarding/OnboardingWhatIsPlainChatIcon';
import { Background } from 'components/ui/background';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React, { useMemo } from 'react';
import { StyleSheet as RNStyleSheet, useWindowDimensions, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type OnboardingScreenProps = {
  /** e.g. navigate into the app after the last slide. */
  onGetStarted?: () => void;
};

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { theme } = useUnistyles();
  const { t } = useI18n();

  /** Circle center sits on the bottom screen edge at horizontal center (half the disk is below, clipped). */
  const bottomSurfaceRadius = windowHeight / 2;
  const bottomSurfaceDiameter = bottomSurfaceRadius * 2;

  const slides = useMemo<OnboardingSlideData[]>(
    () => [
      {
        id: 'what-is-plainchat',
        SvgIllustration: OnboardingWhatIsPlainChatIcon,
        title: t('onboarding.slide0.title'),
        description: t('onboarding.slide0.body'),
      },
      {
        id: 'threads',
        icon: 'chatbubbles-outline',
        title: t('onboarding.slide1.title'),
        description: t('onboarding.slide1.body'),
      },
      {
        id: 'account',
        icon: 'id-card-outline',
        title: t('onboarding.slide2.title'),
        description: t('onboarding.slide2.body'),
      },
    ],
    [t],
  );

  return (
    <View style={styles.fill}>
      <Background
        source={messagesPatternSource}
        tileSize={MESSAGES_PATTERN_TILE_PX}
      />
      <View pointerEvents="none" style={RNStyleSheet.absoluteFill}>
        <View
          style={{
            position: 'absolute',
            left: windowWidth / 2 - bottomSurfaceRadius,
            top: windowHeight - bottomSurfaceRadius,
            width: bottomSurfaceDiameter,
            height: bottomSurfaceDiameter,
            borderRadius: bottomSurfaceRadius,
            backgroundColor: theme.colors.surface,
          }}
        />
      </View>
      <OnboardingSlider data={slides} onGetStarted={onGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },
}));
