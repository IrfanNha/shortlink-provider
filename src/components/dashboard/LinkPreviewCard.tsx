'use client';

import { useMemo, useState } from "react";

import { BASE_URL } from "@/constants/api";
import type { ShortlinkRecord } from "@/lib/mockapi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type LinkPreviewCardProps = {
  link: ShortlinkRecord;
};

function formatDate(value: string) {
  if (!value) return "–";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function extractHostname(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function LinkPreviewCard({ link }: LinkPreviewCardProps) {
  const [copied, setCopied] = useState(false);

  const shortUrl = useMemo(
    () => `${BASE_URL.replace(/\/$/, "")}/${link.code}`,
    [link.code],
  );

  const hostname = useMemo(() => extractHostname(link.originalUrl), [link]);

  async function handleCopy() {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error();
      }
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="hover-lift animate-fade-up border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition duration-300">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-lg font-semibold text-[var(--color-text)]">
          {hostname}
        </CardTitle>
        <p className="break-words text-sm text-[var(--color-muted)]">
          {link.originalUrl}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-3 sm:flex-row sm:items-center sm:gap-3">
          <code className="flex-1 truncate text-sm font-semibold text-[var(--color-accent)] sm:text-base">
            {shortUrl}
          </code>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="h-9 w-full rounded-md border-[var(--color-accent)] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)] sm:w-auto sm:tracking-[0.3em]"
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <div>
            <dt className="mb-1">Clicks</dt>
            <dd className="text-lg font-semibold text-[var(--color-text)]">
              {link.clickCount}
            </dd>
          </div>
          <div>
            <dt className="mb-1">Created</dt>
            <dd>{formatDate(link.createdAt)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="mb-1">Last Clicked</dt>
            <dd>{formatDate(link.lastClickedAt)}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] sm:w-auto"
          onClick={() => window.open(link.originalUrl, "_blank", "noopener")}
        >
          Visit
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] sm:w-auto"
          onClick={() => window.open(shortUrl, "_blank", "noopener")}
        >
          Open Short
        </Button>
      </CardFooter>
    </Card>
  );
}

