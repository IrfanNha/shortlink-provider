'use client';

import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E5E5E5] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]"
        >
          iwsl
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-[#1A1A1A]/80">
          <Link href="/dashboard" className="transition hover:text-[#1A1A1A]">
            Dashboard
          </Link>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[#1A1A1A]"
          >
            Deploy
          </a>
        </nav>
      </div>
    </header>
  );
}

