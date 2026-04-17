import { Avatar } from 'components/ui/Avatar';
import { formatInitials } from 'utils/string';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type AccountItemData = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  avatarIcon?: string;
  avatarBackground?: string;
  avatarColor?: string;
};

export type AccountItemProps = {
  data: AccountItemData;
  onPress?: () => void;
  /** Trailing chevron (e.g. Settings header row). */
  showChevron?: boolean;
  /** Trailing checkmark (e.g. active row in account picker). */
  selected?: boolean;
};

export function AccountItem({
  data,
  onPress,
  showChevron,
  selected,
}: AccountItemProps) {
  const { theme } = useUnistyles();
  const hasUrl = Boolean(data.avatarUrl && data.avatarUrl.length > 0);
  const showIcon = !hasUrl && Boolean(data.avatarIcon);
  const initials =
    !hasUrl && !showIcon ? formatInitials(data.name) : '';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress ? styles.rowPressed : null,
      ]}
    >
      <Avatar
        url={data.avatarUrl}
        icon={showIcon ? data.avatarIcon : undefined}
        initials={initials || undefined}
        background={data.avatarBackground}
        color={data.avatarColor}
        size={40}
      />
      <Text style={styles.name} numberOfLines={1}>
        {data.name}
      </Text>
      {selected ? (
        <Ionicons
          name="checkmark"
          size={22}
          color={theme.colors.primary}
          style={styles.trailingIcon}
        />
      ) : showChevron ? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.muted}
          style={styles.trailingIcon}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    minHeight: 56,
  },
  rowPressed: {
    opacity: 0.65,
  },
  name: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: '400',
    color: theme.colors.text,
  },
  trailingIcon: {
    marginLeft: theme.spacing[1],
  },
}));
