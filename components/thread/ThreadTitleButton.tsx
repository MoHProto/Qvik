import { Avatar } from 'components/ui/Avatar';
import { formatInitials } from 'utils/string';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { ThreadItemData } from './ThreadItem';

const AVATAR_SIZE = 28;

/** Default cap on header title width; title text scales down to fit inside. */
export const THREAD_TITLE_BUTTON_MAX_WIDTH = 260;

/** Largest font size before `adjustsFontSizeToFit` shrinks to fit the title cell. */
const TITLE_FONT_SIZE_MAX = 13;

/** Smallest scale applied vs `TITLE_FONT_SIZE_MAX` (about 8.5pt at default). */
const TITLE_MIN_FONT_SCALE = 0.65;

export type ThreadTitleButtonProps = {
  data: ThreadItemData;
  onPress?: () => void;
  /** Max width for the column; text uses adaptive font size to stay within this width. */
  maxWidth?: number;
};

export function ThreadTitleButton({
  data,
  onPress,
  maxWidth = THREAD_TITLE_BUTTON_MAX_WIDTH,
}: ThreadTitleButtonProps) {
  const hasUrl = Boolean(data.rootUrl && data.rootUrl.length > 0);
  const showIcon = !hasUrl && Boolean(data.iconEmoji);
  const initials = !hasUrl && !showIcon ? formatInitials(data.title) : '';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.column,
        { maxWidth },
        pressed && onPress ? styles.columnPressed : null,
      ]}
    >
      <Avatar
        url={data.rootUrl}
        icon={showIcon ? data.iconEmoji : undefined}
        initials={initials || undefined}
        background={data.avatarBackground}
        color={data.avatarColor}
        size={AVATAR_SIZE}
      />
      <View style={styles.titleCell}>
        <Text
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={TITLE_MIN_FONT_SCALE}
        >
          {data.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: theme.spacing[1],
    minWidth: 0,
  },
  columnPressed: {
    opacity: 0.7,
  },
  titleCell: {
    alignSelf: 'stretch',
    flexShrink: 1,
    minWidth: 0,
  },
  title: {
    fontSize: TITLE_FONT_SIZE_MAX,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
}));
