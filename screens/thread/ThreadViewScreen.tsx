import { ThreadItem } from 'components/thread/ThreadItem';
import { getExampleThreadById } from 'lib/exampleThreads';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function ThreadViewScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = threadId ?? '';
  const { t } = useI18n();

  const thread = useMemo(() => getExampleThreadById(id, t), [id, t]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <ThreadItem data={thread} variant="column" />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing[6],
  },
}));
