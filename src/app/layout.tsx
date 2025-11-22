import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IW ShortLink — Confident Friendly Short URLs",
    template: "%s | IW ShortLink",
  },
  description:
    "Sistem shortlink pribadi berbasis Next.js dengan FingerprintJS, MockAPI.io, dan desain shadcn/ui modern.",
  keywords: [
    "shortlink",
    "url shortener",
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "MockAPI",
    "FingerprintJS",
    "link analytics",
    "vercel",
    "shadcn ui",
  ],
  authors: [{ name: "Irfan Nuha", url: process.env.NEXT_PUBLIC_BASE_URL }],
  creator: "Irfan Nuha",
  publisher: "Irfan Nuha",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://iwsl.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://iwsl.vercel.app",
    title: "IW ShortLink by Irfanwork",
    description:
      "Buat shortlink modern, pantau statistik, dan identifikasi pengguna dengan aman & efisien.",
    siteName: "IW ShortLink",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "IW ShortLink — Confident Friendly Short URLs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IW ShortLink — Modern Short URLs",
    description:
      "Shortlink provider modern dengan analitik dan identifikasi pengguna menggunakan FingerprintJS.",
    images: ["/og.png"],
    creator: "@irfannuha",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
    ],
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL ?? "https://iwsl.vercel.app",
  },
  other: {
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
    robots: "index, follow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable} bg-[#FAFAFA] text-[#1A1A1A] antialiased`}
      >
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
