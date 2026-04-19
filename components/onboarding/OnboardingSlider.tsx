import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  type LayoutChangeEvent,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { OnboardingSlide, type OnboardingSlideData } from 'components/onboarding/OnboardingSlide';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useLanguagePickerModal } from 'hooks/i18n/useLanguagePickerModal';

export type OnboardingSliderProps = {
  data: OnboardingSlideData[];
  /** Called when the user taps “Get started” on the last slide. */
  onGetStarted?: () => void;
};

const SIDE_SLOT_WIDTH = 96;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 55,
  minimumViewTime: 0,
} as const;

export function OnboardingSlider({ data, onGetStarted }: OnboardingSliderProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { t, locale, setLocale } = useI18n();
  const openLanguagePickerModal = useLanguagePickerModal();
  const listRef = useRef<FlatList<OnboardingSlideData>>(null);
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  /** Horizontal `FlatList` rows use content height unless the cell height is explicit. */
  const [slideViewportHeight, setSlideViewportHeight] = useState(0);
  /** Page width must match the list viewport — `useWindowDimensions` can disagree with `pagingEnabled`. */
  const [listViewportWidth, setListViewportWidth] = useState(0);

  const onSlideViewportLayout = useCallback((e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    const rw = Math.round(w);
    const rh = Math.round(h);
    setListViewportWidth((prev) => (prev === rw ? prev : rw));
    setSlideViewportHeight((prev) => (prev === rh ? prev : rh));
  }, []);

  /** Until `onLayout`, approximate the flex region above the footer so slides center sensibly. */
  /** Reserve space for language row + Back/Next + safe area (see `styles.footer`). */
  const slideHeightFallback = Math.max(200, windowHeight - insets.top - insets.bottom - 196);
  const slideCellHeight = slideViewportHeight > 0 ? slideViewportHeight : slideHeightFallback;

  const lastIndex = Math.max(0, data.length - 1);
  const isFirst = index === 0;
  const isLast = index === lastIndex;

  const pageWidth = listViewportWidth > 0 ? listViewportWidth : windowWidth;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const next = viewableItems[0]?.index;
    if (typeof next === 'number') {
      setIndex((prev) => (prev === next ? prev : next));
    }
  }).current;

  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      if (pageWidth <= 0) {
        return;
      }
      const next = Math.round(offsetX / pageWidth);
      setIndex((prev) => {
        const clamped = Math.min(Math.max(0, next), lastIndex);
        return prev === clamped ? prev : clamped;
      });
    },
    [lastIndex, pageWidth],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset],
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset],
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(Math.max(0, nextIndex), lastIndex);
      listRef.current?.scrollToIndex({ index: clamped, animated: true });
      setIndex(clamped);
    },
    [lastIndex],
  );

  const renderItem = useCallback(
    ({ item, index: itemIndex }: ListRenderItemInfo<OnboardingSlideData>) => {
      const inputRange = [
        (itemIndex - 1) * pageWidth,
        itemIndex * pageWidth,
        (itemIndex + 1) * pageWidth,
      ];

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [14, 0, 14],
        extrapolate: 'clamp',
      });

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.965, 1, 0.965],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.75, 1, 0.75],
        extrapolate: 'clamp',
      });

      return (
        <View style={{ width: pageWidth, height: slideCellHeight }}>
          <Animated.View
            style={{
              flex: 1,
              opacity,
              transform: [{ translateY }, { scale }],
            }}
          >
            <OnboardingSlide data={item} />
          </Animated.View>
        </View>
      );
    },
    [pageWidth, scrollX, slideCellHeight],
  );

  const keyExtractor = useCallback((item: OnboardingSlideData) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<OnboardingSlideData> | null | undefined, i: number) => ({
      length: pageWidth,
      offset: pageWidth * i,
      index: i,
    }),
    [pageWidth],
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      const offset = info.averageItemLength * info.index;
      listRef.current?.scrollToOffset({ offset, animated: true });
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      onGetStarted?.();
      return;
    }
    goTo(index + 1);
  }, [goTo, index, isLast, onGetStarted]);

  const handleBack = useCallback(() => {
    if (isFirst) {
      return;
    }
    goTo(index - 1);
  }, [goTo, index, isFirst]);

  const onLanguagePress = useCallback(() => {
    void (async () => {
      const result = await openLanguagePickerModal({
        data: { currentLocale: locale },
      });
      if (result !== undefined && result !== null) {
        setLocale(result.locale);
      }
    })();
  }, [locale, openLanguagePickerModal, setLocale]);

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.root}>
      <View style={styles.listViewport} onLayout={onSlideViewportLayout}>
        <Animated.FlatList
          ref={listRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          onScrollToIndexFailed={onScrollToIndexFailed}
          getItemLayout={pageWidth > 0 ? getItemLayout : undefined}
          initialNumToRender={data.length}
          windowSize={data.length + 1}
          style={styles.list}
        />
      </View>
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + theme.spacing[5] + theme.spacing[4],
          },
        ]}
      >
        <View style={styles.controlsRow}>
          <View style={[styles.sideSlot, { width: SIDE_SLOT_WIDTH }]}>
            {!isFirst ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('onboarding.a11y.back')}
                onPress={handleBack}
                hitSlop={12}
                style={({ pressed }) => [styles.navPressable, pressed && styles.navPressablePressed]}
              >
                <Text style={[styles.navButton, styles.backLabel]} numberOfLines={1} ellipsizeMode="middle">{t('onboarding.back')}</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('settings.language')}
                onPress={onLanguagePress}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.navPressable,
                  styles.languageIconButton,
                  pressed && styles.navPressablePressed,
                ]}
              >
                <Ionicons name="language-outline" size={22} color={theme.colors.primary} />
              </Pressable>
            )}
          </View>
          <View style={styles.dotsWrap}>
            {data.map((slide, i) => {
              const inputRange = [(i - 1) * pageWidth, i * pageWidth, (i + 1) * pageWidth];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1, 1.35, 1],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.35, 1, 0.35],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={slide.id}
                  style={[
                    styles.dot,
                    i === index ? styles.dotActive : styles.dotInactive,
                    {
                      opacity,
                      transform: [{ scale }],
                    },
                  ]}
                />
              );
            })}
          </View>
          <View style={[styles.sideSlot, styles.sideSlotEnd, { width: SIDE_SLOT_WIDTH }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isLast ? t('onboarding.a11y.getStarted') : t('onboarding.a11y.next')
              }
              onPress={handleNext}
              hitSlop={12}
              style={({ pressed }) => [styles.navPressable, pressed && styles.navPressablePressed]}
            >
              <Text style={[styles.navButton, styles.nextNavLabel]} numberOfLines={1} ellipsizeMode="middle">
                {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
  },
  listViewport: {
    flex: 1,
    marginBottom: - theme.spacing[5],
  },
  list: {
    flex: 1,
  },
  footer: {
    /** Keep Back / Next comfortably inset from screen edges (beyond default screen padding). */
    paddingHorizontal: theme.spacing[5] + theme.spacing[4],
    paddingTop: theme.spacing[3],
    gap: theme.spacing[4],
  },
  navPressable: {
    minHeight: 32,
    justifyContent: 'center',
  },
  navPressablePressed: {
    opacity: 0.65,
  },
  languageIconButton: {
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  sideSlot: {
    justifyContent: 'center',
  },
  sideSlotEnd: {
    alignItems: 'flex-end',
  },
  dotsWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    maxWidth: 40,
  },
  dot: {
    borderRadius: 999,
  },
  dotActive: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.primary,
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: theme.colors.muted,
    opacity: 0.45,
  },
  navButton: {
    fontSize: theme.typography.headerButton.fontSize,
    color: theme.colors.primary,
  },
  backLabel: {
    fontWeight: '400',
    whiteSpace: 'nowrap',
  },
  nextNavLabel: {
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
}));
