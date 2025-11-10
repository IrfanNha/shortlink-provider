'use client';

import Link from "next/link";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/irfannuha" },
  { label: "Dribbble", href: "https://dribbble.com/irfanwork" },
  { label: "GitHub", href: "https://github.com/irfan-work" },
];

const RESOURCE_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "https://irfanwork.com/docs", external: true },
  { label: "Support", href: "mailto:hello@irfanwork.com" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-soft)]">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 text-sm text-[var(--color-muted-strong)] md:grid-cols-4 md:px-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[var(--color-muted)]">
            Irfanwork
          </p>
          <p className="text-sm leading-relaxed">
            IW ShortLink adalah produk internal Irfanwork untuk
            mengelola distribusi link pendek dengan pengalaman yang elegan,
            minimalis, dan ramah kolaborasi.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Products
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="transition hover:text-[var(--color-text)]"
              >
                ShortLink Landing
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="transition hover:text-[var(--color-text)]"
              >
                Analytics Dashboard
              </Link>
            </li>
            <li>
              <a
                href="https://iwsl.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[var(--color-text)]"
              >
                Vercel Deployment
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Resources
          </p>
          <ul className="space-y-2 text-sm">
            {RESOURCE_LINKS.map(({ label, href, external }) =>
              external ? (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-[var(--color-text)]"
                  >
                    {label}
                  </a>
                </li>
              ) : (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition hover:text-[var(--color-text)]"
                  >
                    {label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
            Connect
          </p>
          <ul className="space-y-2 text-sm">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[var(--color-text)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-5 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] md:flex-row md:items-center md:justify-between md:px-8">
          <span>
            © {new Date().getFullYear()} Irfanwork Studio. Crafted in Indonesia.
          </span>
          <div className="flex flex-wrap items-center gap-4 text-[0.65rem]">
            <span>Minimal</span>
            <span>Monochrome</span>
            <span>Responsive</span>
            <span>Fingerprinted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

