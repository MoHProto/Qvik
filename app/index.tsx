import { useRouter } from 'expo-router';
import { useAccountFormModal } from 'hooks/account/useAccountFormModal';
import { THREADS_TAB_HREF } from 'lib/appRoutes';
import { createPrefilledNewAccountFormData } from 'lib/createPrefilledNewAccountFormData';
import { ensureTabBarRasterReady, warmTabBarIonRasterSources } from 'lib/tabBarIonRasterSources';
import { warmAppIonIcons } from 'lib/warmAppIonIcons';
import React, { useCallback, useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { OnboardingScreen } from 'screens/onboarding/OnboardingScreen';

function deferUntilAfterInteractions(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
}

function deferTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export default function RootIndex() {
  const router = useRouter();
  const openAccountFormModal = useAccountFormModal();

  useEffect(() => {
    void warmAppIonIcons();
    void warmTabBarIonRasterSources();
  }, []);

  const onGetStarted = useCallback(() => {
    void (async () => {
      const result = await openAccountFormModal({
        data: { initialAccount: createPrefilledNewAccountFormData() },
      });
      if (result !== undefined && result !== null) {
        await warmAppIonIcons();
        await ensureTabBarRasterReady();
        await deferUntilAfterInteractions();
        await deferTwoFrames();
        router.replace(THREADS_TAB_HREF);
      }
    })();
  }, [openAccountFormModal, router]);

  return <OnboardingScreen onGetStarted={onGetStarted} />;
}
