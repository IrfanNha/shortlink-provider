'use client';

import { useMemo, useState } from "react";
import { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ShortlinkRecord } from "@/lib/mockapi";
import { useVisitor } from "@/contexts/visitor-context";

type ShortenResponse = {
  shortUrl: string;
  link: ShortlinkRecord;
};

function extractPreview(url: string) {
  try {
    const parsed = new URL(url);
    return {
      hostname: parsed.hostname.replace("www.", ""),
      protocol: parsed.protocol.replace(":", ""),
    };
  } catch {
    return null;
  }
}

export function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const { mutate } = useSWRConfig();
  const { visitorId, loading: visitorLoading, error: visitorError } = useVisitor();

  const preview = useMemo(() => (url ? extractPreview(url) : null), [url]);

  const disableSubmit =
    isSubmitting || !url || !visitorId || Boolean(visitorError);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visitorId) return;
    setIsSubmitting(true);
    setError(null);
    setHasCopied(false);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-requested-with": "XMLHttpRequest",
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
        throw new Error(data.error ?? "Failed to create shortlink");
      }

      setResult(data);
      setUrl("");
      void mutate(`/api/stats?visitorId=${visitorId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!result?.shortUrl) return;
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error();
      }
      await navigator.clipboard.writeText(result.shortUrl);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 1500);
    } catch {
      setError("Cannot copy link. Please copy manually!");
    }
  }

  return (
    <Card className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg transition duration-300 hover:border-[var(--color-border-strong)] sm:animate-scale-in">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl font-semibold uppercase tracking-[0.4em] text-[var(--color-text)]">
          Shorten URL
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-[var(--color-muted)]">
          Paste your long URL, get an instant shortlink, and preview the
          destination before sharing.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          aria-label="Shortlink generator form"
        >
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/product/123"
            className="h-12 rounded-md border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] text-base text-[var(--color-text)] focus-visible:border-[var(--color-accent)] focus-visible:ring-[var(--color-accent)]"
            type="url"
            required
          />
          {preview && (
            <div className="animate-fade-up rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              <span className="font-semibold text-[var(--color-text)]">
                {preview.hostname}
              </span>{" "}
              <span className="rounded-full bg-[var(--color-border)] px-2 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--color-muted)]">
                {preview.protocol}
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={disableSubmit}
            className="h-12 w-full rounded-md bg-[var(--color-accent)] text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-surface)] transition hover:opacity-90 disabled:opacity-60 md:text-base md:tracking-[0.35em]"
          >
            {isSubmitting
              ? "Generating…"
              : visitorLoading
                ? "Initialising…"
                : "Generate Shortlink"}
          </Button>
        </form>

        <div className="space-y-2" aria-live="assertive">
          {visitorError && (
            <p className="animate-fade-up text-sm font-medium text-[var(--color-warning)]">
              {visitorError}
            </p>
          )}

          {error && (
            <p className="animate-fade-up text-sm font-medium text-[var(--color-warning)]">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="animate-fade-up flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                Short URL
              </span>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <code className="flex-1 truncate text-sm font-semibold text-[var(--color-text)] md:text-base">
                  {result.shortUrl}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-10 w-full rounded-md border-[var(--color-accent)] text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)] md:w-auto md:tracking-[0.3em]"
                >
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                Destination Preview
              </span>
              <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)]">
                {result.link.originalUrl}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

