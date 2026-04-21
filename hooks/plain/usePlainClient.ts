import { PlainClient } from "plainweb-sdk";
import { useMemo } from "react";

function boundFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return globalThis.fetch(input, init);
}

export function usePlainClient(baseUrl: string | null | undefined) {
  return useMemo(
    () => new PlainClient(baseUrl ?? "", null, boundFetch),
    [baseUrl],
  );
}
