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
  title: {
    default: "Hors Cadre Studio - Direction créative, web et identité visuelle",
    template: "%s | Hors Cadre Studio",
  },
  description:
    "Hors Cadre Studio conçoit des sites, identités visuelles et directions artistiques pour artistes, indépendants et petites marques.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Hors Cadre Studio",
    title: "Hors Cadre Studio - Direction créative, web et identité visuelle",
    description: "Un studio créatif orienté résultat : vision claire, design fort, exécution nette.",
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
    description: "Direction créative, web et identité visuelle.",
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


