import { Avatar } from 'components/ui/Avatar';
import { useDateFormatter } from 'hooks/date/useDateFormatter';
import { formatInitials } from 'utils/string';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** UI thread row; aligns with `Thread` plus optional list fields. */
export type ThreadItemData = {
  id: string;
  title: string;
  accountId: string;
  rootUrl?: string | null;
  description?: string;
  createdAt?: number;
  iconEmoji?: string;
  avatarBackground?: string;
  avatarColor?: string;
};

export type ThreadItemVariant = 'row' | 'column';

export type ThreadItemProps = {
  data: ThreadItemData;
  onPress?: () => void;
  /** List row (default) or stacked layout for detail / profile-style views. */
  variant?: ThreadItemVariant;
};

export function ThreadItem({
  data,
  onPress,
  variant = 'row',
}: ThreadItemProps) {
  const formatDate = useDateFormatter();
  const hasUrl = Boolean(data.rootUrl && data.rootUrl.length > 0);
  const showIcon = !hasUrl && Boolean(data.iconEmoji);
  const initials = !hasUrl && !showIcon ? formatInitials(data.title) : '';
  const subtitle =
    data.description ??
    (data.createdAt != null ? formatDate(data.createdAt) : '');
  const isColumn = variant === 'column';
  const avatarSize = isColumn ? 56 : 40;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        isColumn ? styles.column : styles.row,
        pressed && onPress ? styles.rowPressed : null,
      ]}
    >
      <Avatar
        url={data.rootUrl}
        icon={showIcon ? data.iconEmoji : undefined}
        initials={initials || undefined}
        background={data.avatarBackground}
        color={data.avatarColor}
        size={avatarSize}
      />
      <View style={isColumn ? styles.textColColumn : styles.textCol}>
        <Text
          style={isColumn ? styles.titleColumn : styles.title}
          numberOfLines={isColumn ? 3 : 1}
        >
          {data.title}
        </Text>
        {subtitle.length > 0 ? (
          <Text
            style={isColumn ? styles.subtitleColumn : styles.subtitle}
            numberOfLines={isColumn ? 4 : 1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
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
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing[4],
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  rowPressed: {
    opacity: 0.7,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing[1],
  },
  textColColumn: {
    alignItems: 'center',
    gap: theme.spacing[2],
    maxWidth: 320,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  titleColumn: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  subtitleColumn: {
    fontSize: 15,
    color: theme.colors.muted,
    textAlign: 'center',
  },
}));
