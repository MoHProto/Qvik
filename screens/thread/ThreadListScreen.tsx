import { ThreadList } from 'components/thread/ThreadList';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useThreadList } from 'hooks/thread/useThreadList';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function ThreadListScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { data: threads = [] } = useThreadList();

  return (
    <View style={styles.screen}>
      <ThreadList
        data={threads}
        onItemPress={(item) => {
          router.push(`/threads/${item.id}/messages` as Href);
        }}
        emptyMessage={{
          icon: 'chatbubbles-outline',
          message: t('threadList.empty'),
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
