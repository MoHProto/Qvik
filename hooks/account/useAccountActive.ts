import { useMemo } from 'react';
import { useAccountList } from './useAccountList';

export function useAccountActive() {
  const { data: accounts } = useAccountList();
  return useMemo(() => {
    if (!accounts || accounts.length === 0) return null;
    return accounts.find((a) => a.isActive) ?? accounts[0] ?? null;
  }, [accounts]);
}