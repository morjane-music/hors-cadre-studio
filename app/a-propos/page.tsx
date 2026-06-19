import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Hors Cadre Studio, studio créatif à La Réunion pour sites, identités et visuels numériques avec direction affirmée.",
};

export default function AproposPage() {
  return (
    <div className="site-root page-apropos">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Positionnement</span>
          <h1 className="site-title">Un studio local, une direction qui tranche.</h1>
          <p className="site-subtitle">
            Je travaille avec des projets qui ont besoin d’une image forte sans passer par une grosse agence : artistes,
            indépendants, événements, lieux et petites marques locales.
          </p>
          <div className="site-cta">
            <Link href="/prestations" className="site-btn site-btn-primary">
              Voir les prestations
            </Link>
            <Link href="/contact" className="site-cta-secondary">
              Démarrer un projet
            </Link>
          </div>
        </div>

        <div className="site-section site-reveal accent-blue" style={{ animationDelay: "100ms" }}>
          <div className="site-section-title">Ce que le studio apporte</div>
          <div className="site-grid" data-flow>
            <div className="site-card">
              <div className="site-card-title">Du cadrage</div>
              <div className="site-list-item">Message, cible, format, budget et priorité commerciale sont clarifiés avant de produire.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Du style</div>
              <div className="site-list-item">Une direction visuelle forte, avec des effets wow quand ils servent vraiment l’image.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Du concret</div>
              <div className="site-list-item">Des visuels, sites ou identités prêts à publier et faciles à utiliser.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="140">
          <div className="site-section-title">Direction incarnée</div>
          <div className="site-founder-showcase">
            <div className="site-founder-visual" role="img" aria-label="Portrait créatif Hors Cadre Studio">
              <div className="site-founder-badge">Hors Cadre Studio</div>
              <div className="site-founder-floating site-founder-floating-1">Direction forte</div>
              <div className="site-founder-floating site-founder-floating-2">Design précis</div>
              <div className="site-founder-floating site-founder-floating-3">Digital first</div>
              <div className="site-founder-signature">
                <span className="site-founder-name">Morgane Payet</span>
                <span className="site-founder-role">Direction créative</span>
              </div>
            </div>
            <div className="site-founder-copy">
              <div className="site-card-title">La personne derrière le résultat</div>
              <div className="site-list-item">Un pilotage unique : stratégie, design, production, finalisation.</div>
              <div className="site-list-item">Une approche adaptée aux budgets et réalités des projets locaux.</div>
              <div className="site-list-item">Une méthode directe : orienter vite, décider juste, livrer proprement.</div>
              <div className="site-pill">Studio créatif · La Réunion</div>
              <div className="site-cta">
                <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
                  Travailler avec Hors Cadre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
