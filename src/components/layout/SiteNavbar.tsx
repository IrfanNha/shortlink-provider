"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/theme-context";

import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "https://irfanwork.vercel.app", label: "Irfanwork", external: true },
];

const THEME_LABELS: Record<string, string> = {
  classic: "Classic",
  slate: "Slate",
  noir: "Noir",
};

export function SiteNavbar() {
  const { theme } = useTheme();

  // Tentukan logo berdasarkan tema
  const logoSrc = theme === "noir" ? "/logo/light.png" : "/dark.png";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 md:px-8">
        {/* === LOGO + TEXT === */}
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold uppercase tracking-[0.4em] text-[var(--color-text)]"
        >
          <Image
            src={logoSrc}
            alt="IWSL logo"
            width={24}
            height={24}
            priority
          />
          <span>IWSL.</span>
        </Link>

        {/* === DESKTOP NAV === */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--color-muted)] md:flex">
          {NAV_LINKS.map(({ href, label, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[var(--color-text)]"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className="transition hover:text-[var(--color-text)]"
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* === RIGHT SIDE === */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="text-left">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map(({ href, label, external }) =>
                  external ? (
                    <SheetClose asChild key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                      >
                        {label}
                      </a>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild key={label}>
                      <Link
                        href={href}
                        className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  )
                )}
              </div>
              <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-xs text-[var(--color-muted-strong)]">
                <p className="font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">
                  Irfanwork updates
                </p>
                <p className="mt-2 leading-relaxed">
                  Ikuti update terbaru IW ShortLink langsung dari dashboard atau
                  hubungi{" "}
                  <a
                    href="mailto:irfannuha@protonmail.com"
                    className="underline decoration-dotted underline-offset-4 hover:text-[var(--color-text)]"
                  >
                    irfannuha@protonmail.com
                  </a>
                  .
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
