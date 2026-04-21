import { useQuery } from "@tanstack/react-query";
import { threadService } from "services";

export function useThreadOne(id: string | null | undefined) {
  return useQuery({
    queryKey: ['threadOne'],
    queryFn: () => id ? threadService.findById(id) : undefined,
    enabled: !!id,
  });
}