import { EXAMPLE_ACCOUNTS } from 'lib/exampleAccounts';
import { useMemo, useState } from 'react';

export function useExampleAccountSettings() {
  const [activeAccountId, setActiveAccountId] = useState(
    () => EXAMPLE_ACCOUNTS[0]!.id,
  );

  const languageLabel = 'English';

  const currentAccount = useMemo(() => {
    return (
      EXAMPLE_ACCOUNTS.find((a) => a.id === activeAccountId) ??
      EXAMPLE_ACCOUNTS[0]!
    );
  }, [activeAccountId]);

  return {
    accounts: EXAMPLE_ACCOUNTS,
    activeAccountId,
    setActiveAccountId,
    languageLabel,
    currentAccount,
  };
}
