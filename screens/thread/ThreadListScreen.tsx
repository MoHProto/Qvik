import { ThreadList } from 'components/thread/ThreadList';
import { EXAMPLE_THREADS } from 'lib/exampleThreads';
import type { Href } from 'expo-router';
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
          router.push(`/threads/${item.id}/messages` as Href);
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
