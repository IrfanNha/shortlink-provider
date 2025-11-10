'use client';

export function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] bg-[#F2F2F2]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-4 py-6 text-sm text-[#666] md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} IW ShortLink. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em]">
          <span>modern ui</span>
          <span>minimal</span>
          <span>friendly</span>
        </div>
      </div>
    </footer>
  );
}

