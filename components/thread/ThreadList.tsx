import { EmptyMessage } from 'components/ui/EmptyMessage';
import React from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ThreadItem, type ThreadItemData } from './ThreadItem';

export type ThreadListProps = {
  data: ThreadItemData[];
  emptyMessage: React.ComponentProps<typeof EmptyMessage>;
  onItemPress?: (item: ThreadItemData) => void;
};

export function ThreadList({ data, emptyMessage, onItemPress }: ThreadListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ThreadItem
          data={item}
          onPress={onItemPress != null ? () => onItemPress(item) : undefined}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <EmptyMessage
            icon={emptyMessage.icon}
            message={emptyMessage.message}
          />
        </View>
      }
      contentContainerStyle={data.length === 0 ? styles.listEmpty : styles.list}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
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
