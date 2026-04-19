import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type EmptyMessageProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  message: string;
};

export function EmptyMessage({ icon, message }: EmptyMessageProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.muted} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[6],
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
  },
  message: {
    ...theme.typography.subtitle,
    color: theme.colors.muted,
    textAlign: 'center',
  },
}));
