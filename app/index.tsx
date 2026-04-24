import { Href, useRouter } from 'expo-router';
import { useAccountList } from 'hooks/account/useAccountList';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function RootIndex() {
  const router = useRouter();
  const { data: accounts, isLoading } = useAccountList();

  useEffect(() => {
    if (isLoading) return;
    const hasActive = Boolean(accounts?.some((a) => a.isActive));
    router.replace((hasActive ? '/(tabs)/threads' : '/(onboarding)') as Href);
  }, [accounts, isLoading, router]);

  // Intentionally blank: this route only redirects (no back stack).
  return <View />;
}
