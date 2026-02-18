"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type FooterContext = {
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

function getFooterContext(pathname: string): FooterContext {
  if (pathname.startsWith("/prestations")) {
    return {
      title: "Choisir juste. Exécuter fort.",
      copy: "One-shot ou sur mesure : un périmètre clair, un rendu prêt à activer.",
      primaryHref: "/contact",
      primaryLabel: "Lancer une demande",
      secondaryHref: "/processus",
      secondaryLabel: "Voir le processus",
    };
  }

  if (pathname.startsWith("/projets")) {
    return {
      title: "Le niveau est posé. Place à votre projet.",
      copy: "On traduit votre contexte en décisions visuelles utiles.",
      primaryHref: "/contact",
      primaryLabel: "Passer en mode Hors Cadre",
      secondaryHref: "/prestations",
      secondaryLabel: "Comparer les offres",
    };
  }

  if (pathname.startsWith("/processus")) {
    return {
      title: "Un cap clair du brief à la livraison.",
      copy: "Chaque étape est visible, validée et orientée résultat.",
      primaryHref: "/contact",
      primaryLabel: "Démarrer",
      secondaryHref: "/projets",
      secondaryLabel: "Voir des cas concrets",
    };
  }

  if (pathname.startsWith("/contact")) {
    return {
      title: "Une demande courte, une suite concrète.",
      copy: "Vous recevez un plan d'action, pas une réponse vague.",
      primaryHref: "/contact",
      primaryLabel: "Envoyer la demande",
      secondaryHref: "/prestations",
      secondaryLabel: "Revoir les prestations",
    };
  }

  if (pathname.startsWith("/merci")) {
    return {
      title: "Merci pour votre confiance.",
      copy: "On revient vite avec la suite opérationnelle.",
      primaryHref: "/prestations",
      primaryLabel: "Voir les prestations",
      secondaryHref: "/processus",
      secondaryLabel: "Comprendre les étapes",
    };
  }

  return {
    title: "Direction forte. Exécution nette.",
    copy: "Sites, identités et direction artistique pour artistes, indépendants et petites marques.",
    primaryHref: "/contact",
    primaryLabel: "Démarrer un projet",
    secondaryHref: "/projets",
    secondaryLabel: "Voir les projets",
  };
}

export default function Footer() {
  const pathname = usePathname() ?? "/";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const context = getFooterContext(pathname);
  const navItems = [
    { href: "/prestations", label: "Prestations", meta: "Offres & packs" },
    { href: "/projets", label: "Projets", meta: "Avant / après" },
    { href: "/processus", label: "Processus", meta: "Étapes claires" },
    { href: "/contact", label: "Contact", meta: "Réponse 24-48h" },
  ];

  const frameItems = [
    { label: "One-shot + devis sur mesure", icon: "bolt" as const },
    { label: "Réponse initiale rapide (24-48h)", icon: "time" as const },
    { label: "Maintenance mensuelle disponible", icon: "gear" as const },
  ];

  return (
    <footer className="site-footer site-footer-compact">
      <div className="site-footer-top site-footer-top-compact">
        <div className="site-footer-brand">
          <p className="site-footer-kicker">Hors Cadre Studio</p>
          <h2 className="site-footer-title">{context.title}</h2>
          <p className="site-footer-copy">{context.copy}</p>
          <div className="site-cta">
            <Link href={context.primaryHref} className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              {context.primaryLabel}
            </Link>
            <Link href={context.secondaryHref} className="site-cta-secondary" data-cursor data-sound>
              {context.secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="site-footer-column site-footer-column-compact">
          <p className="site-footer-heading">Navigation</p>
          <div className="site-footer-links-compact">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="site-footer-link-compact" data-cursor data-sound>
                <span>{item.label}</span>
                <small>{item.meta}</small>
              </Link>
            ))}
          </div>
          <div className="site-footer-mini-divider" />
          <p className="site-footer-heading">Repères</p>
          <div className="site-footer-chips-compact">
            {frameItems.map((item) => (
              <span key={item.label} className="site-footer-chip-compact">
                <span className={`site-footer-chip-icon is-${item.icon}`} aria-hidden />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Hors Cadre Studio</span>
        <span>Direction créative · Web · Identité visuelle</span>
        <span className="site-footer-legal-links">
          <Link href="/accessibilite">Accessibilité</Link>
          <Link href="/politique-confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </span>
      </div>
    </footer>
  );
}

