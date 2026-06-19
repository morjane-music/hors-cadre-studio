"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type CtaConfig = {
  href: string;
  label: string;
};

function getCta(pathname: string): CtaConfig | null {
  if (pathname.startsWith("/admin") || pathname.startsWith("/contact") || pathname.startsWith("/merci")) {
    return null;
  }

  if (pathname.startsWith("/prestations")) {
    return { href: "/contact", label: "Demander un devis" };
  }

  if (pathname.startsWith("/projets")) {
    return { href: "/contact", label: "Lancer un projet" };
  }

  if (pathname.startsWith("/processus")) {
    return { href: "/contact", label: "Lancer un projet" };
  }

  if (pathname.startsWith("/a-propos")) {
    return { href: "/contact", label: "Parler du projet" };
  }

  return { href: "/contact", label: "Démarrer un projet" };
}

export default function MobileStickyCTA() {
  const pathname = usePathname() ?? "/";
  const cta = getCta(pathname);

  if (!cta) {
    return null;
  }

  return (
    <div className="site-mobile-cta-wrap">
      <Link
        href={cta.href}
        className="site-btn site-btn-primary site-mobile-cta-btn"
        data-track="mobile_sticky_cta"
        data-cursor
        data-sound
      >
        {cta.label}
      </Link>
    </div>
  );
}

