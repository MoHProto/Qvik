import type { AccountItemData } from 'components/account/AccountItem';
import { useAccountList } from 'hooks/account/useAccountList';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { accountModelToItemData } from 'utils/account/accountModelToItemData';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useAccountSettings() {
  const { locale, t } = useI18n();
  const { data: models = [] } = useAccountList();

  const accounts = useMemo(() => models.map(accountModelToItemData), [models]);

  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (accounts.length === 0) return;
    setActiveAccountId((prev) => {
      if (prev != null && accounts.some((a) => a.id === prev)) return prev;
      return accounts[0]!.id;
    });
  }, [accounts]);

  const placeholderAccount: AccountItemData = useMemo(
    () => ({
      id: '',
      name: t('accountSelector.empty'),
      avatarUrl: null,
    }),
    [t],
  );

  const currentAccount = useMemo(() => {
    if (accounts.length === 0) return placeholderAccount;
    const id = activeAccountId ?? accounts[0]!.id;
    return accounts.find((a) => a.id === id) ?? accounts[0]!;
  }, [accounts, activeAccountId, placeholderAccount]);

  const languageLabel = useMemo(() => t(`language.name.${locale}`), [locale, t]);

  const updateAccount = useCallback((account: AccountItemData) => {
    setActiveAccountId(account.id);
  }, []);

  return {
    accounts,
    activeAccountId: activeAccountId ?? '',
    setActiveAccountId,
    updateAccount,
    languageLabel,
    currentAccount,
  };
}
