import { ThreadItem } from 'components/thread/ThreadItem';
import { ButtonsNav, type ButtonsNavItemData } from 'components/ui/ButtonsNav';
import { getExampleThreadById } from 'data/example/exampleThreads';
import { useLocalSearchParams } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useNotifyToast } from 'hooks/notify/useNotifyToast';
import { useThreadOne } from 'hooks/thread/useThreadOne';
import { Thread } from 'models';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { baseUrlFromUrl } from 'utils/url/normalizeUrl';

const THREAD_ACTION_BUTTONS: ButtonsNavItemData[] = [
  { name: 'Mute', icon: 'volume-mute-outline' },
  { name: 'Share', icon: 'share-outline' },
  { name: 'More', icon: 'ellipsis-horizontal-outline' },
];

export default function ThreadViewScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = threadId ?? '';
  const { t } = useI18n();
  const notify = useNotifyToast();

  const { data: threadModel } = useThreadOne(id);

  const thread = useMemo(() => {
    if (!threadModel) {
      return getExampleThreadById(id, t);
    }

    const item = {
      id: threadModel.id,
      accountId: threadModel.accountId,
      title: threadModel.title,
      description: threadModel.description,
      url: baseUrlFromUrl(threadModel.url),
    };
    return item;
  }, [id, t, threadModel]);

  const onThreadAction = useCallback(
    (button: ButtonsNavItemData) => {
      notify.info(button.name);
    },
    [notify],
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <ThreadItem data={thread} variant="column" />
      </View>
      <View style={styles.actions}>
        <ButtonsNav data={THREAD_ACTION_BUTTONS} onButtonPress={onThreadAction} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  card: {
  },
  actions: {
    marginTop: theme.spacing[2],
  },
}));
