import { Crypto, PlainClient } from "plainweb-sdk";
import { useMemo } from "react";

function boundFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return globalThis.fetch(input, init);
}

export function createPlainClient(
  baseUrl: string,
  privateKeyHex?: string | null,
): PlainClient {
  const crypto =
    typeof privateKeyHex === "string" && privateKeyHex.trim().length > 0
      ? new Crypto(privateKeyHex.trim())
      : null;
  return new PlainClient(baseUrl, crypto, boundFetch);
}

export function usePlainClient(
  baseUrl: string | null | undefined,
  privateKeyHex?: string | null,
) {
  console.log("usePlainClient", baseUrl, privateKeyHex);
  return useMemo(
    () => createPlainClient(baseUrl ?? "", privateKeyHex),
    [baseUrl, privateKeyHex],
  );
}
