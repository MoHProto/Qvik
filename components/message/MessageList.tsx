import { Background } from 'components/ui/background';
import { EmptyMessage } from 'components/ui/EmptyMessage';
import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { MessageItem, type MessageItemData } from './MessageItem';

export type MessageListProps = {
  data: MessageItemData[];
  emptyMessage: React.ComponentProps<typeof EmptyMessage>;
  /**
   * Extra inset for content at the visual bottom of the thread (e.g. floating composer).
   * Applied as bottom padding in normal mode; as top padding when the list is inverted (chat).
   */
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
  const hasMessages = data.length > 0;
  /** Newest-first for `inverted` FlatList so the latest row sits on the visual bottom. */
  const listData = useMemo(() => (hasMessages ? [...data].reverse() : data), [data, hasMessages]);

  const contentStyle = hasMessages
    ? [
        styles.list,
        // Inverted list: visual bottom corresponds to content’s top edge in layout coordinates.
        { paddingTop: contentPaddingBottom },
      ]
    : [styles.listEmpty, { paddingBottom: contentPaddingBottom }];

  return (
    <View style={styles.listRoot}>
      <Background />
      <FlatList
        style={styles.listFill}
        inverted={hasMessages}
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem data={item} onRetry={onRetry} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyMessage icon={emptyMessage.icon} message={emptyMessage.message} />
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
    backgroundColor: theme.colors.backgroundAlt,
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
