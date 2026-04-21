import { useAccountList } from "./useAccountList";

export function useAccountActive() {
  const { data: accounts } = useAccountList();
  return accounts?.[0] ?? null;
}