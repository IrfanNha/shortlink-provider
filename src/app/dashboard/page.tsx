'use client';

import useSWR from "swr";

import { LinkPreviewCard } from "@/components/dashboard/LinkPreviewCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShortlinkRecord } from "@/lib/mockapi";
import { useVisitor } from "@/contexts/visitor-context";

export default function DashboardPage() {
  const { visitorId, loading, error, refresh } = useVisitor();
  const { data: links, error: statsError, isLoading, mutate, isValidating } =
    useSWR<ShortlinkRecord[]>(
      visitorId ? `/api/stats?visitorId=${visitorId}` : null,
      {
        revalidateOnReconnect: true,
        refreshInterval: 30_000,
      },
    );

  const isFetching = loading || isLoading || isValidating;
  const effectiveError = error ?? statsError?.message ?? null;
  const totalClicks =
    links?.reduce((acc, item) => acc + (item.clickCount ?? 0), 0) ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      <SiteNavbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16 md:px-8 md:py-24">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.6em] text-[var(--color-muted)]">
              Your Shortlinks
            </span>
            <h1 className="text-3xl font-semibold uppercase tracking-[0.3em] text-[var(--color-text)] md:text-4xl">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--color-muted-strong)] md:text-base">
              Pantau performa shortlink kamu secara real-time, salin visitor ID,
              dan kelola distribusi link dengan percaya diri.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard
              label="Total Links"
              value={links?.length ?? 0}
              hint="Jumlah shortlink aktif milikmu."
            />
            <MetricCard
              label="Total Clicks"
              value={totalClicks}
              hint="Akumulasi klik dari semua link."
            />
            <MetricCard
              label="Status"
              value={isFetching ? "SYNCING" : "LIVE"}
              hint={isFetching ? "Memperbarui statistik..." : "Data terbaru."}
            />
          </div>
        </header>

        <Card className="border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
                Visitor ID
              </CardTitle>
              <p className="text-xs text-[var(--color-muted-strong)]">
                Gunakan Visitor ID ini untuk mengakses data statistik dari
                perangkat ini.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-md border-[var(--color-border-strong)] text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]"
                onClick={() => {
                  void refresh();
                  void mutate();
                }}
              >
                Refresh
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-md border-[var(--color-accent)] text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)]"
                onClick={async () => {
                  if (!visitorId) return;
                  if (typeof navigator === "undefined" || !navigator.clipboard) {
                    return;
                  }
                  await navigator.clipboard.writeText(visitorId);
                }}
                disabled={!visitorId}
              >
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 font-mono text-sm text-[var(--color-text)]">
              {loading ? "Memuat Visitor ID..." : visitorId ?? "—"}
            </div>
            {effectiveError && (
              <p className="mt-3 text-sm text-[var(--color-warning)]">
                {effectiveError}
              </p>
            )}
          </CardContent>
        </Card>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Terbaru
            </h2>
            <Button
              type="button"
              variant="ghost"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              onClick={() => mutate()}
              disabled={isFetching}
            >
              {isFetching ? "Syncing..." : "Sync"}
            </Button>
          </div>

          {isFetching && (
            <div className="grid gap-4 md:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!isFetching && !effectiveError && links && links.length === 0 && (
            <EmptyState />
          )}

          {!isFetching && effectiveError && (
            <ErrorState message={effectiveError} />
          )}

          {!isFetching && !effectiveError && links && links.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {links.map((link) => (
                <LinkPreviewCard key={link.id} link={link} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="hover-lift animate-fade-up border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <CardContent className="flex flex-col gap-2 p-5">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          {label}
        </span>
        <span className="text-2xl font-semibold text-[var(--color-text)]">
          {value}
        </span>
        <span className="text-xs text-[var(--color-muted-strong)]">{hint}</span>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="mb-4 h-4 w-2/3 rounded bg-[var(--color-surface-soft)]" />
      <div className="mb-2 h-3 w-1/2 rounded bg-[var(--color-surface-soft)]" />
      <div className="mb-6 h-3 w-1/3 rounded bg-[var(--color-surface-soft)]" />
      <div className="h-10 rounded bg-[var(--color-surface-soft)]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="animate-fade-up rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-10 text-center text-sm text-[var(--color-muted-strong)]">
      Belum ada shortlink. Ayo buat shortlink pertama melalui halaman utama!
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="animate-fade-up rounded-lg border border-[var(--color-warning)] bg-[var(--color-warning-soft)] px-6 py-6 text-sm text-[var(--color-warning)]">
      {message}
    </div>
  );
}

