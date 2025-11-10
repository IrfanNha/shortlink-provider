'use client';

import { ReactNode } from "react";
import { SWRConfig } from "swr";

import { ThemeProvider } from "@/contexts/theme-context";
import { VisitorProvider } from "@/contexts/visitor-context";

function jsonFetcher<T>(input: string, init?: RequestInit): Promise<T> {
  return fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  }).then(async (response) => {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? (payload as { error?: string }).error
          : response.statusText;

      throw new Error(message ?? "Request failed.");
    }

    return payload as T;
  });
}

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <VisitorProvider>
        <SWRConfig
          value={{
            fetcher: jsonFetcher,
            revalidateOnFocus: false,
            dedupingInterval: 1000,
          }}
        >
          {children}
        </SWRConfig>
      </VisitorProvider>
    </ThemeProvider>
  );
}

