import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "IW ShortLink — Confident Friendly Short URLs",
  description:
    "Shortlink provider pribadi berbasis Next.js dengan FingerprintJS, MockAPI.io, dan desain shadcn modern.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://iwsl.vercel.app",
  ),
  openGraph: {
    title: "IW ShortLink",
    description:
      "Buat shortlink yang modern, pantau statistik, dan identifikasi visitor dengan mudah.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IW ShortLink",
    description:
      "Buat shortlink yang modern, pantau statistik, dan identifikasi visitor dengan mudah.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} bg-[#FAFAFA] text-[#1A1A1A] antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
