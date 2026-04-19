import { EmptyMessage } from 'components/ui/EmptyMessage';
import React from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AccountItem, type AccountItemData } from './AccountItem';

export type AccountListProps = {
  data: AccountItemData[];
  emptyMessage: React.ComponentProps<typeof EmptyMessage>;
  onItemPress?: (item: AccountItemData) => void;
  activeAccountId?: string;
};

export function AccountList({
  data,
  emptyMessage,
  onItemPress,
  activeAccountId,
}: AccountListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AccountItem
          data={item}
          onPress={onItemPress != null ? () => onItemPress(item) : undefined}
          selected={item.id === activeAccountId}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <EmptyMessage icon={emptyMessage.icon} message={emptyMessage.message} />
        </View>
      }
      contentContainerStyle={data.length === 0 ? styles.listEmpty : styles.list}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    flexGrow: 0,
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
    minHeight: 160,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing[4] + 40 + theme.spacing[3],
  },
}));
