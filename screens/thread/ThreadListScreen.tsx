import { ThreadList } from 'components/thread/ThreadList';
import { EXAMPLE_THREADS } from 'lib/exampleThreads';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function ThreadListScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ThreadList
        data={EXAMPLE_THREADS}
        onItemPress={(item) => {
          router.push({
            pathname: '/threads/[threadId]/messages',
            params: { threadId: item.id },
          });
        }}
        emptyMessage={{
          icon: 'chatbubbles-outline',
          message: 'No threads yet.',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
