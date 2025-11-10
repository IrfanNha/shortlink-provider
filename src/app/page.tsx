import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ShortenForm } from "@/components/ShortenForm";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-[#1A1A1A]">
      <Navbar />
      <main className="flex flex-1 flex-col items-center">
        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-10 px-4 py-16 md:flex-row md:items-start md:justify-between md:py-24">
          <div className="flex max-w-lg flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.6em] text-[#FF6F00]">
              Personal Shortlink Provider
            </span>
            <h1 className="text-4xl font-semibold uppercase leading-tight tracking-[0.1em] md:text-5xl">
              transform your links into confident, friendly shortcuts.
            </h1>
            <p className="text-base text-[#444] md:text-lg">
              IW ShortLink membantu kamu membuat link pendek, melacak performa,
              dan mengidentifikasi visitor secara otomatis lewat FingerprintJS.
              Semua tersimpan rapi di MockAPI.io dan siap dibagikan ke mana pun.
            </p>
          </div>
          <div className="w-full max-w-md">
            <ShortenForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
