import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyCTA from "@/components/layout/MobileStickyCTA";
import MicroInteractions from "@/components/ux/MicroInteractions";
import PageTransition from "@/components/ux/PageTransition";
import CookieBanner from "@/components/layout/CookieBanner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://horscadrestudio.re";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }, { url: "/icon.png", type: "image/png" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
  title: {
    default: "Hors Cadre Studio - Sites, identités et visuels numériques à La Réunion",
    template: "%s | Hors Cadre Studio",
  },
  description:
    "Hors Cadre Studio crée des sites, identités et visuels numériques pour artistes, indépendants et projets locaux à La Réunion.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Hors Cadre Studio",
    title: "Hors Cadre Studio - Sites, identités et visuels numériques à La Réunion",
    description: "Un studio créatif à La Réunion : sites, identités et visuels numériques avec direction forte et prix lisibles.",
    url: "/",
    images: [
      {
        url: "/brand/logo-full.png",
        width: 1024,
        height: 1024,
        alt: "Logo Hors Cadre Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hors Cadre Studio",
    description: "Sites, identités et visuels numériques à La Réunion.",
    images: ["/brand/logo-full.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <a href="#main-content" className="site-skip-link">
          Aller au contenu principal
        </a>
        <PageTransition />
        <MicroInteractions />
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <MobileStickyCTA />
        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}



