import Ionicons from '@expo/vector-icons/Ionicons';
import { MessageBubbleTail } from 'components/message/MessageBubbleTail';
import type { ComponentType } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Text,
  View,
  type ColorValue
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const ICON_CIRCLE_SIZE = 120;
const ICON_SIZE = 56;

export type OnboardingSlideSvgIllustrationProps = {
  width?: number;
  color?: ColorValue;
};

export type OnboardingSlideData = {
  id: string;
  title: string;
  description: string;
} & (
  | { icon: keyof typeof Ionicons.glyphMap }
  | {
      SvgIllustration: ComponentType<OnboardingSlideSvgIllustrationProps>;
    }
);

export type OnboardingSlideProps = {
  data: OnboardingSlideData;
};

export function OnboardingSlide({ data }: OnboardingSlideProps) {
  const { theme } = useUnistyles();
  const [reduceMotion, setReduceMotion] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const enabled = await AccessibilityInfo.isReduceMotionEnabled();
      if (mounted) {
        setReduceMotion(enabled);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      floatAnim.setValue(0);
      return;
    }

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    anim.start();
    return () => {
      anim.stop();
    };
  }, [floatAnim, reduceMotion]);

  const iconTransformStyle = useMemo(() => {
    if (reduceMotion) {
      return undefined;
    }

    const translateY = floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -6],
    });

    const rotate = floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['-1.5deg', '1.5deg'],
    });

    return {
      transform: [{ translateY }, { rotate }],
    } as const;
  }, [floatAnim, reduceMotion]);

  return (
    <View style={styles.root}>
      <View style={styles.bubbleOuter}>
        <View style={styles.bubbleCard}>
          <Animated.View
            style={[styles.iconCircle, iconTransformStyle]}
            accessibilityElementsHidden
          >
            {'SvgIllustration' in data ? (
              <data.SvgIllustration width={ICON_SIZE} color={theme.colors.primary} />
            ) : (
              <Ionicons name={data.icon} size={ICON_SIZE} color={theme.colors.primary} />
            )}
          </Animated.View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>
        <MessageBubbleTail bubbleColor={theme.colors.primary} side="left" scale={3} zIndex={0} />
      </View>
    </View>
  );
}

const BUBBLE_RADIUS = 40;

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  bubbleOuter: {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    /** Space below the bubble so the iMessage-style tail is not clipped. */
    marginBottom: theme.spacing[5],
  },
  /** Centered onboarding card; shadow matches `MessageBubble` `bubbleShadow`. */
  bubbleCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: BUBBLE_RADIUS,
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[6] + theme.spacing[3],
    gap: theme.spacing[4],
    zIndex: 1,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    /** Match title text so the well reads as “cut out” of the primary bubble. */
    backgroundColor: theme.colors.surface,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.surface,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.subtitle,
    fontSize: 16,
    color: theme.colors.surface,
    opacity: 0.88,
    textAlign: 'center',
    lineHeight: 24,
  },
}));
