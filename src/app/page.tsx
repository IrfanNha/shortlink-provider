import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { ShortenerForm } from "@/components/shortener/ShortenerForm";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-(--color-background) text-(--color-text)">
      <SiteNavbar />
      <main className="flex flex-1 flex-col items-center">
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-4 py-16 md:flex-row md:items-start md:justify-between md:px-8 md:py-24">
          <div className="flex max-w-xl flex-col gap-6 animate-fade-up">
            <span className="text-xs uppercase tracking-wider text-(--color-muted)">
              {"Irfanwork Shortlink [ IWSL ]"}
            </span>
            <h1 className="text-4xl font-semibold uppercase leading-tight tracking-[0.3em] text-(--color-text) md:text-5xl">
              Shorten your links with IWSL.
            </h1>
            <p className="text-base text-(--color-muted-strong) md:text-lg">
              IW ShortLink helps you create short links, track performance,
              and identify visitors automatically.
            </p>
            <ul className="grid gap-3 text-sm text-(--color-muted-strong) md:grid-cols-2">
              <li className="rounded-md border border-(--color-border) bg-(--color-surface-soft) px-4 py-3">
                Anonymous & private link shortener
              </li>
              <li className="rounded-md border border-(--color-border) bg-(--color-surface-soft) px-4 py-3">
                Real-time click tracking
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
