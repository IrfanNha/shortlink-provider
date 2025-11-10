import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { ShortenerForm } from "@/components/shortener/ShortenerForm";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      <SiteNavbar />
      <main className="flex flex-1 flex-col items-center">
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-4 py-16 md:flex-row md:items-start md:justify-between md:px-8 md:py-24">
          <div className="flex max-w-xl flex-col gap-6 animate-fade-up">
            <span className="text-xs uppercase tracking-[0.6em] text-[var(--color-muted)]">
              Personal Shortlink Provider
            </span>
            <h1 className="text-4xl font-semibold uppercase leading-tight tracking-[0.3em] text-[var(--color-text)] md:text-5xl">
              transform long urls into confident, friendly shortcuts.
            </h1>
            <p className="text-base text-[var(--color-muted-strong)] md:text-lg">
              IW ShortLink membantu kamu membuat link pendek, melacak performa,
              dan mengidentifikasi visitor secara otomatis lewat FingerprintJS.
              Semua tersimpan rapi di MockAPI.io dan siap dibagikan ke mana pun.
            </p>
            <ul className="grid gap-3 text-sm text-[var(--color-muted-strong)] md:grid-cols-2">
              <li className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
                🎯 Hitung klik secara real-time
              </li>
              <li className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
                🔐 Identifikasi visitor otomatis
              </li>
              <li className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
                🧾 MockAPI.io sebagai storage
              </li>
              <li className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
                ⚡️ Landing & dashboard responsif
              </li>
            </ul>
          </div>
          <div className="w-full max-w-md animate-fade-up">
            <ShortenerForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
