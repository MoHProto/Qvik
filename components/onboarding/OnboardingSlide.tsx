import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const ICON_CIRCLE_SIZE = 120;
const ICON_SIZE = 56;

export type OnboardingSlideData = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

export type OnboardingSlideProps = {
  data: OnboardingSlideData;
};

export function OnboardingSlide({ data }: OnboardingSlideProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.root}>
      <View style={styles.iconCircle} accessibilityElementsHidden>
        <Ionicons
          name={data.icon}
          size={ICON_SIZE}
          color={theme.colors.primary}
        />
      </View>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
    gap: theme.spacing[4],
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.onboardingIconCircle,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.subtitle,
    color: theme.colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
}));
