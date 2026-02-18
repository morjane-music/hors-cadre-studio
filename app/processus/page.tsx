import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "Processus",
  description:
    "Un parcours en 3 étapes : orientation, design/production, livraison. Chaque validation est claire et actionnable.",
};

export default function ProcessusPage() {
  return (
    <div className="site-root page-processus">
      <Container className="site-wrap">
        <div className="site-hero site-reveal accent-graphite" data-reveal data-reveal-delay="40">
          <span className="site-kicker">Processus</span>
          <h1 className="site-title">Un tempo assumé, zéro flou.</h1>
          <p className="site-subtitle">
            Chaque étape a un livrable clair. Vous savez où on va et ce qui est validé.
          </p>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Lancer un projet
            </Link>
            <Link href="/prestations" className="site-cta-secondary" data-cursor data-sound>
              Voir les prestations
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="100">
          <div className="site-grid" data-flow>
            <div className="site-card">
              <div className="site-icon">01</div>
              <div className="site-card-title">1. Orientation</div>
              <div className="site-list">Objectifs, cible, périmètre.</div>
              <div className="site-list">Priorités et planning validés.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">02</div>
              <div className="site-card-title">2. Design et production</div>
              <div className="site-list">Conception, ajustements, validation.</div>
              <div className="site-list">Feedback court, exécution nette.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">03</div>
              <div className="site-card-title">3. Livraison</div>
              <div className="site-list">Mise en ligne et passation.</div>
              <div className="site-list">Support initial si nécessaire.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="160">
          <div className="site-section-title">Cap et rythme</div>
          <div className="site-rhythm-grid">
            <div className="site-card site-rhythm-card">
              <div className="site-rhythm-head">
                <span className="site-rhythm-dot" aria-hidden />
                <span className="site-rhythm-kicker">Pilotage</span>
              </div>
              <div className="site-card-title">Décisions nettes</div>
              <div className="site-list">Décisions rapides, sans réunion inutile.</div>
              <div className="site-list">Étapes visibles et validées.</div>
              <div className="site-list">Un point de contact du début à la fin.</div>
              <div className="site-rhythm-tags">
                <span className="site-rhythm-tag">Réponse 24-48h</span>
                <span className="site-rhythm-tag">Validation courte</span>
                <span className="site-rhythm-tag">Livrable activable</span>
              </div>
            </div>

            <div className="site-card site-rhythm-rail">
              <div className="site-rhythm-step">
                <span className="site-rhythm-index">01</span>
                <span className="site-rhythm-line" />
                <span className="site-rhythm-label">Brief utile</span>
              </div>
              <div className="site-rhythm-step">
                <span className="site-rhythm-index">02</span>
                <span className="site-rhythm-line" />
                <span className="site-rhythm-label">Direction validée</span>
              </div>
              <div className="site-rhythm-step">
                <span className="site-rhythm-index">03</span>
                <span className="site-rhythm-line" />
                <span className="site-rhythm-label">Livraison prête à publier</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
