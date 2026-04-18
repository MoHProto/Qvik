import {
  MESSAGES_PATTERN_TILE_PX,
  messagesPatternSource,
} from 'assets/backgrounds/messagesPattern';
import { Background } from 'components/ui/background';
import { EmptyMessage } from 'components/ui/EmptyMessage';
import React from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { MessageItem, type MessageItemData } from './MessageItem';

export type MessageListProps = {
  data: MessageItemData[];
  emptyMessage: React.ComponentProps<typeof EmptyMessage>;
  /** Extra bottom padding (e.g. for a floating footer over the list). */
  contentPaddingBottom?: number;
  /** Called when the user taps Retry on a failed message row. */
  onRetry?: (item: MessageItemData) => void;
};

export function MessageList({
  data,
  emptyMessage,
  contentPaddingBottom = 0,
  onRetry,
}: MessageListProps) {
  const contentStyle =
    data.length === 0
      ? [styles.listEmpty, { paddingBottom: contentPaddingBottom }]
      : [styles.list, { paddingBottom: contentPaddingBottom }];

  return (
    <View style={styles.listRoot}>
      <Background
        source={messagesPatternSource}
        tileSize={MESSAGES_PATTERN_TILE_PX}
      />
      <FlatList
        style={styles.listFill}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem data={item} onRetry={onRetry} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyMessage
              icon={emptyMessage.icon}
              message={emptyMessage.message}
            />
          </View>
        }
        contentContainerStyle={contentStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  listRoot: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listFill: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  list: {
    flexGrow: 1,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing[6],
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 240,
  },
}));
