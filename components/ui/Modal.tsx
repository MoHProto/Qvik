import type { PopupProps } from 'react-popup-manager';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  StyleSheet as RNStyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const DEFAULT_ANIM_MS = 240;

export type OverlaySheetModalRenderContext<TResult> = {
  /** Run close animation, hide modal, then `onClose(result)` for the popup manager. */
  finish: (result: TResult) => void;
};

export type OverlaySheetModalProps<TResult = unknown> = PopupProps & {
  maxSheetHeight: number;
  animationDurationMs?: number;
  /** When true, wraps content in `KeyboardAvoidingView` (iOS padding / Android height). */
  keyboardAvoiding?: boolean;
  /** Result when the user taps the dimmed backdrop (default `undefined`). */
  backdropDismissValue?: TResult;
  /** Result on Android hardware back (default `null`). */
  hardwareBackValue?: TResult;
  /**
   * `intrinsic`: sheet uses `maxHeight` + `flexShrink` (default bottom sheets).
   * `fill`: sheet uses fixed `height` = `maxSheetHeight` (tall picker-style sheets).
   */
  sheetSize?: 'intrinsic' | 'fill';
  /** Merged into the animated sheet container after base layout styles. */
  sheetStyle?: StyleProp<ViewStyle>;
  children: (ctx: OverlaySheetModalRenderContext<TResult>) => React.ReactNode;
};

/**
 * Bottom overlay: RN `Modal`, fade backdrop + slide sheet, single `finish(result)` exit path.
 * Keeps visibility + animation + `closingRef` in one place so feature modals only render content.
 */
export function OverlaySheetModal<TResult = unknown>({
  isOpen: _isOpen,
  onClose,
  maxSheetHeight,
  animationDurationMs = DEFAULT_ANIM_MS,
  keyboardAvoiding = false,
  backdropDismissValue = undefined as TResult,
  hardwareBackValue = null as TResult,
  sheetSize = 'intrinsic',
  sheetStyle,
  children,
}: OverlaySheetModalProps<TResult>) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { width: viewportWidth } = useWindowDimensions();

  const viewportCapStyle = useMemo<ViewStyle>(
    () =>
      viewportWidth > 0
        ? { width: '100%', maxWidth: viewportWidth }
        : { width: '100%', maxWidth: '100%' },
    [viewportWidth],
  );

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(maxSheetHeight)).current;
  const [visible, setVisible] = useState(true);
  const closingRef = useRef(false);

  const bottomPad = Math.max(insets.bottom, theme.spacing[4]);

  const finish = useCallback(
    (result: TResult) => {
      if (closingRef.current) return;
      closingRef.current = true;
      // Do not mix native + non-native drivers in one parallel — the completion
      // callback may never run on some platforms, so onClose/visible never update.
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: animationDurationMs,
          useNativeDriver: false,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: maxSheetHeight,
          duration: animationDurationMs,
          useNativeDriver: false,
        }),
      ]).start(() => {
        try {
          setVisible(false);
          onClose?.(result as never);
        } finally {
          closingRef.current = false;
        }
      });
    },
    [animationDurationMs, backdropOpacity, maxSheetHeight, onClose, sheetTranslateY],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: animationDurationMs,
        useNativeDriver: false,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: animationDurationMs,
        useNativeDriver: false,
      }),
    ]).start();
  }, [animationDurationMs, backdropOpacity, sheetTranslateY]);

  const sheetLayoutStyle: ViewStyle =
    sheetSize === 'fill'
      ? {
          height: maxSheetHeight,
          paddingBottom: bottomPad,
          transform: [{ translateY: sheetTranslateY }],
        }
      : {
          maxHeight: maxSheetHeight,
          flexShrink: 1,
          paddingBottom: bottomPad,
          transform: [{ translateY: sheetTranslateY }],
        };

  const shell = (
    <View style={[styles.root, viewportCapStyle]}>
      <Pressable
        style={[RNStyleSheet.absoluteFill, styles.backdropLayer]}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={() => finish(backdropDismissValue)}
      >
        <Animated.View
          style={[RNStyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
        />
      </Pressable>

      <Animated.View style={[styles.sheet, sheetLayoutStyle, sheetStyle, viewportCapStyle]}>
        {children({ finish })}
      </Animated.View>
    </View>
  );

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={() => finish(hardwareBackValue)}
      style={[styles.modalViewport, viewportCapStyle]}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={[styles.kavRoot, viewportCapStyle]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {shell}
        </KeyboardAvoidingView>
      ) : (
        shell
      )}
    </RNModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  modalViewport: {
    flex: 1,
    minWidth: 0,
  },
  kavRoot: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
  },
  root: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  backdropLayer: {
    zIndex: 0,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    zIndex: 1,
    elevation: 12,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    alignSelf: 'stretch',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    paddingTop: theme.spacing[2],
    borderWidth: RNStyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
}));
