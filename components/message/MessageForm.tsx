import { MenuModal, type MenuItem } from "components/ui/MenuModal";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import { useI18n } from "hooks/i18n/I18nProvider";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet as RNStyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { hexToRgba } from "utils/color";
import { messageReplySchema } from "validation/messageReplySchema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePopupManager } from "react-popup-manager";

/** Vertical padding inside the floating footer (excluding safe area). */
const FOOTER_VERTICAL_PADDING = 12;

/** Min height of the primary control (pill). */
const CONTROL_MIN_HEIGHT = 48;

/**
 * Floating footer over message content: transparent chrome, no border.
 * Primary action is a full-width pill with primary background.
 */
export function MessageForm({
  onStartPress,
  showMenuButton = false,
  menu = [],
  onMenuItemPress,
  replyPath,
  replyComposerKey,
  onSendReply,
  visitInFlight = false,
}: {
  onStartPress?: () => void;
  showMenuButton?: boolean;
  menu?: MenuItem[];
  onMenuItemPress?: (item: MenuItem) => void;
  /** When set, shows a text field (Plain `input` reply) using this request path. */
  replyPath?: string | null;
  /** Bumps Formik remount when the server prompt message changes. */
  replyComposerKey?: string;
  onSendReply?: (text: string) => void | Promise<void>;
  visitInFlight?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const paddingBottom =
    insets.bottom + (Platform.OS === "web" ? theme.spacing[4] : 0);
  const { t } = useI18n();
  const popupManager = usePopupManager();

  const openMenu = () => {
    const { response } = popupManager.open(MenuModal, {
      data: menu,
    });

    response.then((result) => {
      if (result && typeof result === "object") {
        onMenuItemPress?.(result);
      }
    });
  };

  const menuButtonCompact = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("a11y.menu")}
      onPress={openMenu}
      style={({ pressed }) => [
        styles.menuIconButton,
        pressed && styles.controlPressed,
      ]}
    >
      <Ionicons name="menu" size={22} color={theme.colors.text} />
    </Pressable>
  );

  const menuButtonFullWidth = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("a11y.menu")}
      onPress={openMenu}
      style={({ pressed }) => [
        styles.menuControl,
        pressed && styles.controlPressed,
      ]}
    >
      <Ionicons name="menu" size={18} color={theme.colors.text} />
      <Text style={styles.menuLabel}>{t("a11y.menu")}</Text>
    </Pressable>
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom }]}>
      <LinearGradient
        colors={[
          hexToRgba(theme.colors.backgroundAlt, 0),
          theme.colors.backgroundAlt,
        ]}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={RNStyleSheet.absoluteFill}
      />
      {showMenuButton ? (
        replyPath ? (
          <View style={styles.footerRow}>
            {menuButtonCompact}
            <Formik
              key={replyComposerKey ?? replyPath}
              initialValues={{ replyText: "" }}
              validationSchema={messageReplySchema}
              onSubmit={async (values, { resetForm }) => {
                const text = values.replyText.trim();
                if (!text || visitInFlight) {
                  return;
                }
                await onSendReply?.(text);
                resetForm();
              }}
            >
              {({ values, handleChange, handleBlur, handleSubmit }) => (
                <View style={styles.replyCluster}>
                  <TextInput
                    accessibilityLabel={t("messageForm.replyTextPlaceholder")}
                    autoCapitalize="sentences"
                    autoCorrect
                    editable={!visitInFlight}
                    onBlur={handleBlur("replyText")}
                    onChangeText={handleChange("replyText")}
                    onSubmitEditing={() => handleSubmit()}
                    placeholder={t("messageForm.replyTextPlaceholder")}
                    placeholderTextColor={theme.colors.muted}
                    returnKeyType="send"
                    style={styles.replyField}
                    value={values.replyText}
                  />
                  {values.replyText.trim().length > 0 ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t("a11y.sendMessage")}
                      disabled={visitInFlight}
                      onPress={() => handleSubmit()}
                      style={({ pressed }) => [
                        styles.sendButton,
                        { backgroundColor: theme.colors.primary },
                        pressed && styles.controlPressed,
                        visitInFlight && styles.sendDisabled,
                      ]}
                    >
                      <Ionicons name="send" size={20} color="#ffffff" />
                    </Pressable>
                  ) : null}
                </View>
              )}
            </Formik>
          </View>
        ) : (
          menuButtonFullWidth
        )
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("messageForm.startPress")}
          android_ripple={
            Platform.OS === "android"
              ? { color: "rgba(255, 255, 255, 0.25)", borderless: false }
              : undefined
          }
          onPress={onStartPress}
          style={({ pressed }) => [
            styles.control,
            { backgroundColor: theme.colors.primary },
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.controlLabel}>{t("messageForm.startPress")}</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Extra bottom padding for scroll content so rows clear the floating footer.
 * Pass `theme.spacing[4]` as `additionalBottom` on web so it matches the footer’s bottom inset.
 */
export function getMessageFormListInsetBottom(
  safeBottom: number,
  additionalBottom = 0,
): number {
  return (
    FOOTER_VERTICAL_PADDING * 2 + CONTROL_MIN_HEIGHT + safeBottom + additionalBottom
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: FOOTER_VERTICAL_PADDING,
    borderWidth: 0,
    overflow: "visible",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  menuControl: {
    alignSelf: "stretch",
    minHeight: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    flexDirection: "row",
    gap: theme.spacing[2],
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.inputBorder,
  },
  menuIconButton: {
    width: CONTROL_MIN_HEIGHT,
    height: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.inputBorder,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  replyCluster: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
    minHeight: CONTROL_MIN_HEIGHT,
  },
  replyField: {
    flex: 1,
    minHeight: CONTROL_MIN_HEIGHT,
    maxHeight: 120,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: Platform.OS === "ios" ? theme.spacing[3] : theme.spacing[2],
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.inputBorder,
    fontSize: 16,
    color: theme.colors.text,
  },
  sendButton: {
    width: CONTROL_MIN_HEIGHT,
    height: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  sendDisabled: {
    opacity: 0.5,
  },
  control: {
    minHeight: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  controlPressed: {
    opacity: 0.85,
  },
  controlLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
  },
}));
