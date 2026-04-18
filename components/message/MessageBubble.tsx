import { MessageBody } from 'components/message/MessageBody';
import { MessageBubbleTail } from 'components/message/MessageBubbleTail';
import { JumpingDots } from 'components/ui/jumping-dots/JumpingDots';
import React from 'react';
import {
  Platform,
  PlatformColor,
  Pressable,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const OUTGOING_TIME = 'rgba(255, 255, 255, 0.65)';

export type MessageBubbleVariant = 'incoming' | 'outgoing';

export type MessageBubbleData = {
  text: string;
  /** Pre-formatted time under the bubble (omit when hidden, e.g. pending). */
  time?: string;
};

export type MessageBubbleProps = {
  data: MessageBubbleData;
  variant: MessageBubbleVariant;
  /** Incoming: treat body as failed / show error styling when true. */
  error?: boolean;
  /** Incoming: loading dots instead of body. */
  pending?: boolean;
  actions?: string[];
  onAction?: (actionLabel: string, data: MessageBubbleData) => void;
};

function useIosLikeBubblePalette() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    return {
      outgoingBubble: PlatformColor('systemBlue'),
      incomingTime: PlatformColor('secondaryLabel'),
    };
  }

  if (isDark) {
    return {
      outgoingBubble: '#0A84FF',
      incomingTime: 'rgba(235, 235, 245, 0.6)',
    };
  }

  return {
    outgoingBubble: '#007AFF',
    incomingTime: '#8E8E93',
  };
}

export function MessageBubble({
  data,
  variant,
  error = false,
  pending = false,
  actions = [],
  onAction,
}: MessageBubbleProps) {
  const { theme } = useUnistyles();
  const bubble = useIosLikeBubblePalette();

  if (variant === 'outgoing') {
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
            <Text style={styles.outgoingBubbleText}>{data.text}</Text>
            {data.time != null && data.time.length > 0 ? (
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
          {pending ? (
            <JumpingDots />
          ) : error ? (
            <Text style={styles.errorText}>{data.text}</Text>
          ) : (
            <MessageBody markdown={data.text} />
          )}
          {!pending && data.time != null && data.time.length > 0 ? (
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
      {actions.length > 0 ? (
        <View style={styles.actionsRow}>
          {actions?.map((label) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={() => onAction?.(label, data)}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  outgoingWrap: {
    alignSelf: 'flex-end',
    maxWidth: '88%',
  },
  bubbleOuterOutgoing: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  bubbleOuterIncoming: {
    position: 'relative',
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  bubbleShadow: {
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
  outgoingBubble: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    borderRadius: 18,
  },
  outgoingBubbleText: {
    fontSize: 15,
    color: '#ffffff',
  },
  incomingWrap: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  incomingBubble: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    borderRadius: 18,
  },
  bubbleTime: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: theme.spacing[1],
    color: theme.colors.muted,
  },
  bubbleTimeOutgoing: {
    alignSelf: 'flex-end',
  },
  bubbleTimeIncoming: {
    alignSelf: 'flex-start',
  },
  incomingBubbleError: {
    backgroundColor: theme.colors.incomingBubbleError,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.error,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    alignSelf: 'flex-start',
  },
  actionButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.radius.pill,
  },
  actionButtonPressed: {
    opacity: 0.72,
  },
  actionLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
}));
