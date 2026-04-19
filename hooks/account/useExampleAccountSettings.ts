import type { AccountItemData } from 'components/account/AccountItem';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { EXAMPLE_ACCOUNTS } from 'lib/exampleAccounts';
import { useCallback, useMemo, useState } from 'react';

export function useExampleAccountSettings() {
  const { locale, t } = useI18n();
  const [accounts, setAccounts] = useState<AccountItemData[]>(() => [...EXAMPLE_ACCOUNTS]);
  const [activeAccountId, setActiveAccountId] = useState(() => EXAMPLE_ACCOUNTS[0]!.id);

  const languageLabel = useMemo(() => t(`language.name.${locale}`), [locale, t]);

  const currentAccount = useMemo(() => {
    return accounts.find((a) => a.id === activeAccountId) ?? accounts[0]!;
  }, [accounts, activeAccountId]);

  const addAccount = useCallback((account: AccountItemData) => {
    setAccounts((prev) => [...prev, account]);
    setActiveAccountId(account.id);
  }, []);

  const updateAccount = useCallback((account: AccountItemData) => {
    setAccounts((prev) => prev.map((a) => (a.id === account.id ? { ...a, ...account } : a)));
    setActiveAccountId(account.id);
  }, []);

  return {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    updateAccount,
    languageLabel,
    currentAccount,
  };
}
