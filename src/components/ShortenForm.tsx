'use client';

import { useEffect, useMemo, useState } from "react";
import { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getVisitorId } from "@/lib/fingerprint";

type ShortenResponse = {
  shortUrl: string;
};

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    let cancelled = false;

    async function resolveVisitorId() {
      try {
        const generated = await getVisitorId();
        if (!cancelled) {
          setVisitorId(generated);
        }
      } catch (err) {
        console.error("Failed to initialise FingerprintJS", err);
        if (!cancelled) {
          setError("Tidak dapat mengidentifikasi perangkat. Coba lagi.");
        }
      }
    }

    resolveVisitorId();

    return () => {
      cancelled = true;
    };
  }, []);

  const disableSubmit = useMemo(
    () => !url || !visitorId || isSubmitting,
    [url, visitorId, isSubmitting],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visitorId) return;

    setIsSubmitting(true);
    setError(null);
    setShortUrl(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          visitorId,
        }),
      });

      const data = (await response.json()) as ShortenResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Gagal membuat shortlink");
      }

      setShortUrl(data.shortUrl);
      setUrl("");
      if (visitorId) {
        void mutate(`/api/stats?visitorId=${visitorId}`);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) return;
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error();
      }
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      setError("Tidak dapat menyalin link. Salin manual saja ya!");
    }
  }

  return (
    <Card className="w-full border-none bg-white shadow-[0_24px_48px_-24px_rgba(26,26,26,0.25)]">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold uppercase tracking-[0.4em] text-[#1A1A1A]">
          Create Shortlink
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste your long URL here..."
            className="h-12 rounded-[6px] border-[#E5E5E5] bg-[#FAFAFA] text-base text-[#1A1A1A] focus-visible:ring-[#007AFF]"
            type="url"
            required
          />
          <Button
            type="submit"
            disabled={disableSubmit}
            className="h-12 rounded-[6px] bg-[#007AFF] text-base font-semibold text-white transition hover:opacity-90"
          >
            {isSubmitting ? "Generating…" : "Generate Shortlink"}
          </Button>

          {visitorId ? (
            <p className="text-xs uppercase tracking-[0.3em] text-[#666]">
              Visitor ID: {visitorId}
            </p>
          ) : (
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF6F00]">
              Mempersiapkan identitas perangkat…
            </p>
          )}

          {shortUrl && (
            <div className="flex flex-col gap-2 rounded-[6px] border border-[#E5E5E5] bg-[#F8F8F8] p-4">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#1A1A1A]">
                Short URL
              </span>
              <div className="flex items-center gap-3">
                <code className="flex-1 truncate text-base font-semibold text-[#007AFF]">
                  {shortUrl}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-10 rounded-[6px] border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm font-medium text-[#FF6F00]">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

