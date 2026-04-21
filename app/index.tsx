import { Href, useRouter } from 'expo-router';
import { useAccountAdd } from 'hooks/account/useAccountAdd';
import { useAccountFormModal } from 'hooks/account/useAccountFormModal';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React, { useCallback } from 'react';
import { OnboardingScreen } from 'screens/onboarding/OnboardingScreen';
import { createPrefilledNewAccountFormData } from 'utils/account/createPrefilledNewAccountFormData';

export default function RootIndex() {
  const router = useRouter();
  const { locale } = useI18n();
  const openAccountFormModal = useAccountFormModal();
  const { mutateAsync: createAccount } = useAccountAdd();

  const onGetStarted = useCallback(() => {
    void (async () => {
      const result = await openAccountFormModal({
        data: {
          initialAccount: createPrefilledNewAccountFormData(locale),
          showSuccessToast: false,
        },
      });
      if (result !== undefined && result !== null) {
        await createAccount({ name: result.name.trim() });
        router.replace('/(tabs)/threads' as Href);
      }
    })();
  }, [createAccount, locale, openAccountFormModal, router]);

  return <OnboardingScreen onGetStarted={onGetStarted} />;
}
