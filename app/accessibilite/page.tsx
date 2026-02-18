import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "Accessibilité",
  description:
    "Engagement accessibilité de Hors Cadre Studio : lisibilité, navigation clavier, contraste, alternatives et amélioration continue.",
};

export default function AccessibilitePage() {
  return (
    <div className="site-root page-accessibilite">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Accessibilité</span>
          <h1 className="site-title">Un site lisible et utilisable par tous.</h1>
          <p className="site-subtitle">
            Nous appliquons une démarche progressive alignée sur les bonnes pratiques WCAG 2.2 AA.
          </p>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="50">
          <div className="site-section-title">Mesures déjà en place</div>
          <div className="site-grid">
            <div className="site-card">
              <div className="site-card-title">Interface accessible</div>
              <div className="site-list-item">Mode contraste renforcé.</div>
              <div className="site-list-item">Texte agrandi.</div>
              <div className="site-list-item">Réduction des animations.</div>
              <div className="site-list-item">Soulignement renforcé des liens.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Navigation</div>
              <div className="site-list-item">Navigation clavier sur les actions principales.</div>
              <div className="site-list-item">États de focus visibles.</div>
              <div className="site-list-item">Libellés explicites sur boutons et sections.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Lisibilité</div>
              <div className="site-list-item">Contrastes vérifiés sur les textes principaux.</div>
              <div className="site-list-item">Hiérarchie de titres claire.</div>
              <div className="site-list-item">Micro-copies orientées action.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="100">
          <div className="site-section-title">Amélioration continue</div>
          <div className="site-card">
            <div className="site-list-item">Contrôle régulier des contrastes et des parcours clavier.</div>
            <div className="site-list-item">Correction prioritaire des points bloquants signalés.</div>
            <div className="site-list-item">Mise à jour des composants pour rester conforme aux exigences en vigueur.</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
