import { ThreadList } from 'components/thread/ThreadList';
import { ThreadListHeaderAddButton } from 'components/thread/ThreadListHeaderAddButton';
import type { Href } from 'expo-router';
import { useNavigation, useRouter } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useThreadCreate } from 'hooks/thread/useThreadCreate';
import { useThreadList } from 'hooks/thread/useThreadList';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { baseUrlFromUrl } from 'utils/url/normalizeUrl';

export default function ThreadListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useI18n();
  const { data: threads = [] } = useThreadList();
  const { addThreadFromUrl, isAddingThread } = useThreadCreate();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ThreadListHeaderAddButton onPress={addThreadFromUrl} disabled={isAddingThread} />
      ),
    });
  }, [navigation, addThreadFromUrl, isAddingThread]);

  return (
    <View style={styles.screen}>
      <ThreadList
        data={threads}
        onItemPress={(item) => {
          const path = `/threads/${item.id}/messages`;
          const baseUrl = item.url ? baseUrlFromUrl(item.url) : '';
          const href =
            baseUrl.length > 0 ? `${path}?path=${encodeURIComponent(baseUrl)}` : path;
          router.push(href as Href);
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
