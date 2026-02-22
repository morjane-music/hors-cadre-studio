import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Hors Cadre Studio : un studio créatif orienté impact, singularité et maîtrise, avec un cap concret du brief à la livraison.",
};

export default function AproposPage() {
  return (
    <div className="site-root page-apropos">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Positionnement</span>
          <h1 className="site-title">Un studio orienté résultats, pensé pour vos projets.</h1>
          <p className="site-subtitle">
            Hors Cadre Studio structure des projets créatifs avec une direction affirmée, des choix assumés et
            un résultat utilisable immédiatement.
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

        <div className="site-section site-reveal" style={{ animationDelay: "100ms" }}>
          <div className="site-section-title">Ce Que Nous Faisons</div>
          <div className="site-grid" data-flow>
            <div className="site-card">
              <div className="site-card-title">Direction</div>
              <div className="site-list">Orientation précise et décisions assumées.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Design</div>
              <div className="site-list">Identité forte et cohérence visuelle.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Livraison</div>
              <div className="site-list">Résultat propre, prêt à être exploité.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="140">
          <div className="site-section-title">Direction Incarnée</div>
          <div className="site-founder-showcase">
            <div className="site-founder-visual" role="img" aria-label="Portrait créatif Hors Cadre Studio">
              <div className="site-founder-badge">Hors Cadre Studio</div>
              <div className="site-founder-floating site-founder-floating-1">Direction forte</div>
              <div className="site-founder-floating site-founder-floating-2">Exécution singulière</div>
              <div className="site-founder-floating site-founder-floating-3">Impact visuel</div>
              <div className="site-founder-signature">
                <span className="site-founder-name">Morgane Payet</span>
                <span className="site-founder-role">Directrice créative</span>
              </div>
            </div>
            <div className="site-founder-copy">
              <div className="site-card-title">La personne derrière le résultat</div>
              <div className="site-list-item">Un pilotage unique : stratégie, design, production, finalisation.</div>
              <div className="site-list-item">Une signature visuelle qui vous rend identifiable en quelques secondes.</div>
              <div className="site-list-item">Une méthode directe : orienter vite, décider juste, livrer proprement.</div>
              <div className="site-pill">Direction créative premium</div>
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
