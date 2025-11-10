'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getVisitorId } from "@/lib/fingerprint";

type VisitorContextValue = {
  visitorId: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const VisitorContext = createContext<VisitorContextValue | null>(null);

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveVisitor = useCallback(async () => {
    try {
      setLoading(true);
      const id = await getVisitorId();
      setVisitorId(id);
      setError(null);
    } catch (err) {
      console.error("Failed to resolve visitor ID", err);
      setError(
        err instanceof Error
          ? err.message
          : "Tidak dapat mengidentifikasi perangkat.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void resolveVisitor();
  }, [resolveVisitor]);

  const value = useMemo<VisitorContextValue>(
    () => ({
      visitorId,
      loading,
      error,
      refresh: resolveVisitor,
    }),
    [visitorId, loading, error, resolveVisitor],
  );

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitor must be used within VisitorProvider");
  }
  return context;
}

