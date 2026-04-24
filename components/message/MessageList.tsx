import { Background } from 'components/ui/background';
import { EmptyMessage } from 'components/ui/EmptyMessage';
import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { MessageItem, type MessageItemData } from './MessageItem';

export type MessageListProps = {
  data: MessageItemData[];
  emptyMessage: React.ComponentProps<typeof EmptyMessage>;
  contentPaddingBottom?: number;
  onRetry?: (item: MessageItemData) => void;
  onVisit?: (button: { label: string; url: string }, item: MessageItemData) => void;
};

export function MessageList({
  data,
  emptyMessage,
  contentPaddingBottom = 0,
  onRetry,
  onVisit,
}: MessageListProps) {
  const hasMessages = data.length > 0;
  const listData = useMemo(() => (hasMessages ? [...data].reverse() : data), [data, hasMessages]);

  const contentStyle = hasMessages
    ? [
        styles.list,
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
        renderItem={({ item }) => <MessageItem data={item} onRetry={onRetry} onVisit={onVisit} />}
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
