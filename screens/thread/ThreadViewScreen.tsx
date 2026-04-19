import { ThreadItem } from 'components/thread/ThreadItem';
import { useLocalSearchParams } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { getExampleThreadById } from 'data/example/exampleThreads';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function ThreadViewScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = threadId ?? '';
  const { t } = useI18n();

  const thread = useMemo(() => getExampleThreadById(id, t), [id, t]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <ThreadItem data={thread} variant="column" />
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
}));
