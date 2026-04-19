import { HeaderBackButton } from '@react-navigation/elements';
import type { NativeStackHeaderBackProps } from '@react-navigation/native-stack';
import {
  getMessageFormListInsetBottom,
  MessageForm,
} from 'components/message/MessageForm';
import type { MessageItemData } from 'components/message/MessageItem';
import { MessageList } from 'components/message/MessageList';
import { ThreadTitleButton } from 'components/thread/ThreadTitleButton';
import type { Href } from 'expo-router';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { getExampleThreadById } from 'lib/exampleThreads';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React, { useLayoutEffect, useMemo } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function buildExampleMessages(
  threadId: string,
  t: (key: string) => string,
): MessageItemData[] {
  const now = Date.now();
  return [
    {
      id: 'm-1',
      threadId,
      createdAt: now - 1000 * 60 * 12,
      label: t('demo.message.1.label'),
      body: t('demo.message.1.body'),
      status: 'success',
    },
    {
      id: 'm-2',
      threadId,
      createdAt: now - 1000 * 60 * 8,
      input: t('demo.message.2.input'),
      body: '',
      status: 'pending',
    },
    {
      id: 'm-3',
      threadId,
      createdAt: now - 1000 * 60 * 5,
      label: t('demo.message.3.label'),
      body: t('demo.message.3.body'),
      status: 'success',
    },
    {
      id: 'm-4',
      threadId,
      createdAt: now - 1000 * 60 * 2,
      input: t('demo.message.4.input'),
      body: '',
      error: t('demo.message.4.error'),
      status: 'error',
    },
  ];
}

export default function MessageListScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { t } = useI18n();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = threadId ?? '';

  const thread = useMemo(() => getExampleThreadById(id, t), [id, t]);
  const data = useMemo(() => buildExampleMessages(id, t), [id, t]);
  const listBottomInset = useMemo(
    () =>
      getMessageFormListInsetBottom(
        insets.bottom,
        Platform.OS === 'web' ? theme.spacing[4] : 0,
      ),
    [insets.bottom, theme.spacing],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      // Native stack defaults to left-aligned titles on Android; center like iOS.
      headerTitleAlign: 'center',
      /**
       * iOS native stack stacks the center title view above the default system back control.
       * A custom center title can make the back affordance look visible while taps hit the
       * title layer instead. Hide the default back and use an explicit left `HeaderBackButton`
       * so the control is fully pressable (see react-navigation/native-stack header layout).
       */
      headerBackVisible: false,
      headerLeft: (props: NativeStackHeaderBackProps) =>
        props.canGoBack ? (
          <HeaderBackButton
            {...props}
            /**
             * `HeaderBackButton` applies letterSpacing 0.35 on the label; UIKit’s navigation
             * back title does not, so the label can look like a different weight than
             * ThreadViewScreen’s native back. Reset tracking on iOS to match.
             */
            labelStyle={Platform.OS === 'ios' ? { letterSpacing: 0, fontWeight: '500' } : undefined}
            onPress={() => router.back()}
          />
        ) : null,
      /**
       * Without `pointerEvents="box-none"`, the header center subview can still swallow taps
       * beside the title on some platforms.
       */
      headerTitle: () => (
        <View pointerEvents="box-none" style={{ alignItems: 'center' }}>
          <ThreadTitleButton
            data={thread}
            onPress={() =>
              router.push(`/threads/${thread.id}` as Href)
            }
          />
        </View>
      ),
    });
  }, [navigation, router, thread]);

  return (
    <View style={styles.screen}>
      <MessageList
        data={data}
        contentPaddingBottom={listBottomInset}
        emptyMessage={{
          icon: 'chatbubble-ellipses-outline',
          message: t('messageList.empty'),
        }}
      />
      <MessageForm />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },
}));
