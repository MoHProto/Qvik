import { MessageBubbleTail } from 'components/message/MessageBubbleTail';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentType } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Text,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const ICON_CIRCLE_SIZE = 120;
const ICON_SIZE = 56;

export type OnboardingSlideSvgIllustrationProps = {
  width?: number;
  color?: string;
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
              <data.SvgIllustration width={ICON_SIZE} color="#ffffff" />
            ) : (
              <Ionicons
                name={data.icon}
                size={ICON_SIZE}
                color="#ffffff"
              />
            )}
          </Animated.View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>
        <MessageBubbleTail bubbleColor={theme.colors.surface} side="left" />
      </View>
    </View>
  );
}

const BUBBLE_RADIUS = 18;

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
    marginBottom: theme.spacing[2],
  },
  /** Centered onboarding card; shadow matches `MessageBubble` `bubbleShadow`. */
  bubbleCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: BUBBLE_RADIUS,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[6],
    gap: theme.spacing[4],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.03,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 0,
      },
      default: {
        boxShadow: '0 0.5px 1.5px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
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
