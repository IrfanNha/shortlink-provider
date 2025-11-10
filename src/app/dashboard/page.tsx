'use client';

import { useEffect, useState } from "react";
import useSWR from "swr";

import { Footer } from "@/components/Footer";
import { LinkCard } from "@/components/LinkCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVisitorId } from "@/lib/fingerprint";
import type { ShortlinkRecord } from "@/lib/mockapi";

export default function DashboardPage() {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [visitorMessage, setVisitorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVisitor() {
      try {
        const id = await getVisitorId();
        if (!cancelled) {
          setVisitorId(id);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setClientError(
            error instanceof Error
              ? error.message
              : "Tidak dapat memuat informasi visitor.",
          );
        }
      }
    }

    loadVisitor();

    return () => {
      cancelled = true;
    };
  }, []);

  const {
    data: links,
    error,
    isLoading,
    isValidating,
  } = useSWR<ShortlinkRecord[]>(
    visitorId ? `/api/stats?visitorId=${visitorId}` : null,
  );

  const isFetching = isLoading || isValidating;
  const effectiveError = error?.message ?? clientError;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-[#1A1A1A]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 py-16 md:py-24">
        <header className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.6em] text-[#7ED957]">
            Your Shortlinks
          </span>
          <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
            stats dashboard
          </h1>
          <p className="text-sm text-[#555]">
            Kelola semua link pendek milikmu, pantau performa, dan bagikan
            dengan percaya diri.
          </p>
        </header>

        <Card className="border-none bg-white shadow-[0_24px_48px_-24px_rgba(26,26,26,0.25)]">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-[0.3em] text-[#666]">
              Visitor ID
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {visitorId ? (
              <code className="rounded-[6px] bg-[#F2F2F2] px-4 py-2 text-sm text-[#1A1A1A]">
                {visitorId}
              </code>
            ) : (
              <span className="text-sm text-[#FF6F00]">
                Mencari informasi visitor…
              </span>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-fit rounded-[6px] border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white"
              onClick={async () => {
                if (!visitorId) return;
                if (typeof navigator === "undefined" || !navigator.clipboard) {
                  setClientError("Clipboard tidak tersedia di perangkat ini.");
                  return;
                }
                await navigator.clipboard.writeText(visitorId);
                setVisitorMessage("Visitor ID berhasil disalin.");
                setClientError(null);
              }}
              disabled={!visitorId}
            >
              Salin Visitor ID
            </Button>
            {visitorMessage && (
              <p className="text-xs text-[#666]">{visitorMessage}</p>
            )}
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {isFetching && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!isFetching && effectiveError && (
            <div className="col-span-full rounded-[6px] border border-[#FF6F00] bg-[#FFF4E6] p-6 text-sm text-[#FF6F00]">
              {effectiveError}
            </div>
          )}

          {!isFetching && !effectiveError && (links?.length ?? 0) === 0 && (
            <div className="col-span-full rounded-[6px] border border-[#E5E5E5] bg-white p-6 text-sm text-[#666]">
              Belum ada link. Buat shortlink pertama kamu dari halaman utama.
            </div>
          )}

          {!isFetching &&
            !effectiveError &&
            links?.map((link) => <LinkCard key={link.id} link={link} />)}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[6px] border border-[#E5E5E5] bg-white p-6">
      <div className="mb-4 h-4 w-2/3 rounded bg-[#F2F2F2]" />
      <div className="mb-2 h-3 w-1/2 rounded bg-[#F2F2F2]" />
      <div className="mb-6 h-3 w-1/3 rounded bg-[#F2F2F2]" />
      <div className="h-10 rounded bg-[#F2F2F2]" />
    </div>
  );
}

