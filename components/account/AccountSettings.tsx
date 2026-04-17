import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AccountItem, type AccountItemData } from './AccountItem';

export type AccountSettingsProps = {
  account: AccountItemData;
  languageLabel: string;
  onAccountHeaderPress: () => void;
  onLanguagePress: () => void;
  onAccountSettingPress: () => void;
};

type SettingsRowProps = {
  title: string;
  value?: string;
  onPress: () => void;
  showSeparator?: boolean;
};

function SettingsRow({
  title,
  value,
  onPress,
  showSeparator,
}: SettingsRowProps) {
  const { theme } = useUnistyles();
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.settingsRow,
          pressed && styles.settingsRowPressed,
        ]}
      >
        <Text style={styles.settingsTitle}>{title}</Text>
        <View style={styles.settingsRight}>
          {value != null && value.length > 0 ? (
            <Text style={styles.settingsValue} numberOfLines={1}>
              {value}
            </Text>
          ) : null}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.muted}
          />
        </View>
      </Pressable>
      {showSeparator ? <View style={styles.rowSeparator} /> : null}
    </>
  );
}

export function AccountSettings({
  account,
  languageLabel,
  onAccountHeaderPress,
  onLanguagePress,
  onAccountSettingPress,
}: AccountSettingsProps) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <AccountItem
          data={account}
          onPress={onAccountHeaderPress}
          showChevron
        />
      </View>

      <View style={styles.card}>
        <SettingsRow
          title="Language"
          value={languageLabel}
          onPress={onLanguagePress}
          showSeparator
        />
        <SettingsRow title="Account" onPress={onAccountSettingPress} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.groupedListBackground,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[6],
    gap: theme.spacing[5],
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
  },
  settingsRowPressed: {
    opacity: 0.65,
  },
  settingsTitle: {
    fontSize: 17,
    color: theme.colors.text,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flexShrink: 0,
    maxWidth: '52%',
  },
  settingsValue: {
    fontSize: 17,
    color: theme.colors.muted,
    flexShrink: 1,
  },
  rowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing[4],
  },
}));
