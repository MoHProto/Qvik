import type { ThreadItemData } from 'components/thread/ThreadItem';
import { ThreadList } from 'components/thread/ThreadList';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const EXAMPLE_THREADS: ThreadItemData[] = [
  {
    id: '1',
    accountId: 'acc-1',
    title: 'Design sync',
    rootUrl: 'https://picsum.photos/seed/thread1/128',
    description: 'Discuss navigation patterns for v2.',
  },
  {
    id: '2',
    accountId: 'acc-1',
    title: 'Mobile release',
    rootUrl: null,
    iconEmoji: '🚀',
    avatarBackground: '#dbeafe',
    avatarColor: '#1e40af',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: '3',
    accountId: 'acc-2',
    title: 'Support inbox',
    rootUrl: '',
    iconEmoji: '💬',
    avatarBackground: '#f3e8ff',
    avatarColor: '#6b21a8',
    description: 'Queued tickets from the weekend.',
  },
  {
    id: '4',
    accountId: 'acc-1',
    title: 'Plain thread A',
    rootUrl: null,
    description: 'No image, emoji, or avatar tint — initials only.',
  },
  {
    id: '5',
    accountId: 'acc-2',
    title: 'Weekly standup notes',
    description: 'Two-word title for initials.',
  },
  {
    id: '6',
    accountId: 'acc-1',
    title: 'X',
    description: 'Single-letter title edge case.',
  },
];

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
