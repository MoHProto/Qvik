import type { AccountItemData } from 'components/account/AccountItem';
import { EXAMPLE_ACCOUNTS } from 'lib/exampleAccounts';
import { useCallback, useMemo, useState } from 'react';

export function useExampleAccountSettings() {
  const [accounts, setAccounts] = useState<AccountItemData[]>(
    () => [...EXAMPLE_ACCOUNTS],
  );
  const [activeAccountId, setActiveAccountId] = useState(
    () => EXAMPLE_ACCOUNTS[0]!.id,
  );

  const languageLabel = 'English';

  const currentAccount = useMemo(() => {
    return (
      accounts.find((a) => a.id === activeAccountId) ?? accounts[0]!
    );
  }, [accounts, activeAccountId]);

  const addAccount = useCallback((account: AccountItemData) => {
    setAccounts((prev) => [...prev, account]);
    setActiveAccountId(account.id);
  }, []);

  return {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    languageLabel,
    currentAccount,
  };
}
