import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

import { SkipLink } from "@/components/layout/SkipLink";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bangla = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali"],
  display: "swap",
});

const SITE_URL = "https://nagoriksheba.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NagorikSheba — বাংলাদেশের সরকারি সেবার এক ঠিকানা",
    template: "%s | NagorikSheba",
  },
  description:
    "NagorikSheba (নাগরিক সেবা) helps citizens discover Bangladesh government services — eligibility, required documents, fees, step-by-step procedures, offices, notices and official links in one place.",
  applicationName: "NagorikSheba",
  keywords: [
    "NagorikSheba",
    "নাগরিক সেবা",
    "Bangladesh government services",
    "সরকারি সেবা",
    "NID",
    "e-Passport",
    "e-TIN",
    "driving license",
    "land mutation",
    "government offices Bangladesh",
  ],
  authors: [{ name: "NagorikSheba" }],
  creator: "NagorikSheba",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "NagorikSheba",
    title: "NagorikSheba — Bangladesh Government Services, One Place",
    description:
      "Find the government service you need, understand the process, and access the official service.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NagorikSheba — Bangladesh Government Services, One Place",
    description:
      "Find the government service you need, understand the process, and access the official service.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#004D3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${bangla.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900">
        <LanguageProvider>
          <SkipLink />

          <main id="main-content" className="flex-1  min-h-[calc(600vh-5000px)]">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
