import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Hors Cadre Studio : un studio créatif orienté clarté, impact et maîtrise, avec un cap concret du brief à la livraison.",
};

export default function AproposPage() {
  return (
    <div className="site-root page-apropos">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Positionnement</span>
          <h1 className="site-title">Un studio, pas un portfolio personnel.</h1>
          <p className="site-subtitle">
            Hors Cadre Studio structure des projets cr&eacute;atifs avec une direction claire, des choix assum&eacute;s et
            un r&eacute;sultat utilisable imm&eacute;diatement.
          </p>
          <div className="site-cta">
            <Link href="/prestations" className="site-btn site-btn-primary">
              Voir les prestations
            </Link>
            <Link href="/contact" className="site-cta-secondary">
              D&eacute;marrer un projet
            </Link>
          </div>
        </div>

        <div className="site-section site-reveal" style={{ animationDelay: "100ms" }}>
          <div className="site-section-title">Ce Que Nous Faisons</div>
          <div className="site-grid" data-flow>
            <div className="site-card">
              <div className="site-card-title">Direction</div>
              <div className="site-list">Orientation pr&eacute;cise et d&eacute;cisions assum&eacute;es.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Design</div>
              <div className="site-list">Identit&eacute; forte et coh&eacute;rence visuelle.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Livraison</div>
              <div className="site-list">R&eacute;sultat propre, pr&ecirc;t &agrave; &ecirc;tre exploit&eacute;.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="140">
          <div className="site-section-title">Direction Incarn&eacute;e</div>
          <div className="site-founder-showcase">
            <div className="site-founder-visual" role="img" aria-label="Portrait cr&eacute;atif Hors Cadre Studio">
              <div className="site-founder-badge">Hors Cadre Studio</div>
              <div className="site-founder-floating site-founder-floating-1">Direction forte</div>
              <div className="site-founder-floating site-founder-floating-2">Ex&eacute;cution singuli&egrave;re</div>
              <div className="site-founder-floating site-founder-floating-3">Impact visuel</div>
              <div className="site-founder-signature">
                <span className="site-founder-name">Morgane Payet</span>
                <span className="site-founder-role">Directrice cr&eacute;ative</span>
              </div>
            </div>
            <div className="site-founder-copy">
              <div className="site-card-title">La personne derri&egrave;re le r&eacute;sultat</div>
              <div className="site-list-item">Un pilotage unique : strat&eacute;gie, design, production, finalisation.</div>
              <div className="site-list-item">Une signature visuelle qui vous rend identifiable en quelques secondes.</div>
              <div className="site-list-item">Une m&eacute;thode claire : orienter vite, d&eacute;cider net, livrer proprement.</div>
              <div className="site-pill">Direction cr&eacute;ative premium</div>
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

