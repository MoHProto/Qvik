import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type AvatarProps = {
  url?: string | null;
  icon?: string;
  initials?: string | null;
  background?: string;
  color?: string;
  size?: number;
};

export function Avatar({
  url,
  icon,
  initials,
  background,
  color,
  size = 40,
}: AvatarProps) {
  const { theme } = useUnistyles();
  const hasUrl = Boolean(url && url.length > 0);
  const initialsText = initials?.trim() ?? '';
  const showInitials = initialsText.length > 0;
  const s = size;
  const fill = background ?? theme.colors.avatarFallback;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: s,
          height: s,
          borderRadius: s / 2,
          backgroundColor: fill,
        },
      ]}
    >
      {hasUrl ? (
        <Image
          source={{ uri: url! }}
          style={{ width: s, height: s, borderRadius: s / 2 }}
          contentFit="cover"
        />
      ) : icon ? (
        <Text
          style={[
            styles.emoji,
            { fontSize: s * 0.45, color: color ?? theme.colors.text },
          ]}
        >
          {icon}
        </Text>
      ) : showInitials ? (
        <Text
          style={[
            styles.initials,
            { fontSize: s * 0.38 },
            color ? { color } : null,
          ]}
        >
          {initialsText}
        </Text>
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: s * 0.35, height: s * 0.35, borderRadius: s * 0.175 },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emoji: {
    textAlign: 'center',
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.muted,
  },
  placeholder: {
    backgroundColor: theme.colors.muted,
  },
}));
