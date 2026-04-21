import { useQuery } from "@tanstack/react-query";
import { accountService } from "services";

export function useAccountList() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.list(),
  });
}