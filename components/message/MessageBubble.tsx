import { MessageBody } from "components/message/MessageBody";
import { MessageBubbleTail } from "components/message/MessageBubbleTail";
import { JumpingDots } from "components/ui/jumping-dots/JumpingDots";
import React from "react";
import {
  Platform,
  PlatformColor,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const OUTGOING_TIME = "rgba(255, 255, 255, 0.65)";

export type MessageBubbleVariant = "incoming" | "outgoing";

export type MessageBubbleData = {
  text: string;
  time?: string;
};

export type MessageBubbleButton =
  | { type: "visit"; label: string; url: string }
  | { type: "action"; label: string };

export type MessageBubbleProps = {
  data: MessageBubbleData;
  variant: MessageBubbleVariant;
  error?: boolean;
  pending?: boolean;
  buttons?: MessageBubbleButton[];
  onButtonPress?: (
    button: MessageBubbleButton,
    data: MessageBubbleData,
  ) => void;
};

function useIosLikeBubblePalette() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (Platform.OS === "ios") {
    return {
      outgoingBubble: PlatformColor("systemBlue"),
      incomingTime: PlatformColor("secondaryLabel"),
    };
  }

  if (isDark) {
    return {
      outgoingBubble: "#0A84FF",
      incomingTime: "rgba(235, 235, 245, 0.6)",
    };
  }

  return {
    outgoingBubble: "#007AFF",
    incomingTime: "#8E8E93",
  };
}

export function MessageBubble({
  data,
  variant,
  error = false,
  pending = false,
  buttons = [],
  onButtonPress,
}: MessageBubbleProps) {
  const { theme } = useUnistyles();
  const bubble = useIosLikeBubblePalette();
  const hasTime = !pending && data.time != null && data.time.length > 0;

  if (variant === "outgoing") {
    return (
      <View style={styles.outgoingWrap}>
        <View style={styles.bubbleOuterOutgoing}>
          <View
            style={[
              styles.outgoingBubble,
              styles.bubbleShadow,
              { backgroundColor: bubble.outgoingBubble },
            ]}
          >
            <View style={[styles.bubbleContent, hasTime && styles.bubbleContentWithTime]}>
              {pending ? (
                <JumpingDots dotColor="rgba(255,255,255,0.9)" />
              ) : (
                <Text style={styles.outgoingBubbleText}>{data.text}</Text>
              )}
            </View>
            {hasTime ? (
              <Text
                style={[
                  styles.bubbleTime,
                  styles.bubbleTimeOutgoing,
                  { color: OUTGOING_TIME },
                ]}
              >
                {data.time}
              </Text>
            ) : null}
          </View>
          <MessageBubbleTail bubbleColor={bubble.outgoingBubble} side="right" />
        </View>
      </View>
    );
  }

  const incomingTailColor = error
    ? theme.colors.incomingBubbleError
    : theme.colors.surface;

  return (
    <View style={styles.incomingWrap}>
      <View style={styles.bubbleOuterIncoming}>
        <View
          style={[
            styles.incomingBubble,
            styles.bubbleShadow,
            error && styles.incomingBubbleError,
          ]}
        >
          <View style={[styles.bubbleContent, hasTime && styles.bubbleContentWithTime]}>
            {pending ? (
              <JumpingDots />
            ) : error ? (
              <Text style={styles.errorText}>{data.text}</Text>
            ) : (
              <MessageBody markdown={data.text} />
            )}
          </View>
          {hasTime ? (
            <Text
              style={[
                styles.bubbleTime,
                styles.bubbleTimeIncoming,
                { color: bubble.incomingTime },
              ]}
            >
              {data.time}
            </Text>
          ) : null}
        </View>
        <MessageBubbleTail bubbleColor={incomingTailColor} side="left" />
      </View>
      {!pending && buttons.length > 0 ? (
        <View style={styles.buttonsRow}>
          {buttons?.map((button) => (
            <Pressable
              key={`${button.type}:${button.label}${
                button.type === "visit" ? `:${button.url}` : ""
              }`}
              accessibilityRole="button"
              accessibilityLabel={button.label}
              onPress={() => onButtonPress?.(button, data)}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonLabel}>{button.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  outgoingWrap: {
    alignSelf: "flex-end",
    maxWidth: "88%",
  },
  bubbleOuterOutgoing: {
    position: "relative",
    alignSelf: "flex-end",
  },
  bubbleOuterIncoming: {
    position: "relative",
    alignSelf: "flex-start",
  },
  bubbleShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.03,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 0,
      },
      default: {
        boxShadow: "0 0.5px 1.5px rgba(0, 0, 0, 0.04)",
      },
    }),
  },
  outgoingBubble: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    // Reserve space for the timestamp (positioned absolute).
    paddingBottom: theme.spacing[4],
    borderRadius: 18,
    position: "relative",
  },
  outgoingBubbleText: {
    fontSize: 15,
    color: "#ffffff",
  },
  incomingWrap: {
    alignSelf: "flex-start",
    maxWidth: "92%",
  },
  incomingBubble: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    // Reserve space for the timestamp (positioned absolute).
    paddingBottom: theme.spacing[4],
    borderRadius: 18,
    position: "relative",
  },
  bubbleContent: {
    minWidth: 0,
  },
  bubbleContentWithTime: {
    // Prevent last line from flowing underneath the absolute timestamp.
    paddingRight: theme.spacing[6],
  },
  bubbleTime: {
    fontSize: 10,
    lineHeight: 12,
    color: theme.colors.muted,
    position: "absolute",
    bottom: theme.spacing[2],
  },
  bubbleTimeOutgoing: {
    right: theme.spacing[4],
  },
  bubbleTimeIncoming: {
    // Keep timestamp away from the left tail.
    right: theme.spacing[4],
  },
  incomingBubbleError: {
    backgroundColor: theme.colors.incomingBubbleError,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.error,
  },
  buttonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    alignSelf: "flex-start",
    marginTop: theme.spacing[2],
  },
  button: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  buttonLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}));
