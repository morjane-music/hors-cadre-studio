import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "Projets et avant/apr\u00E8s",
  description:
    "Des preuves visuelles pour \u00E9valuer le niveau de direction artistique, la coh\u00E9rence du design et la qualit\u00E9 d'ex\u00E9cution.",
};

export default function ProjetsPage() {
  const templates = [
    { src: "/images/Template-1.png", label: "Template 01 · Ciné premium" },
    { src: "/images/Template-2.png", label: "Template 02 · Editorial clair" },
    { src: "/images/Template-3.png", label: "Template 03 · Minimal architecture" },
    { src: "/images/Template-4.png", label: "Template 04 · Mood dark artiste" },
    { src: "/images/Template-5.png", label: "Template 05 · Studio vibrant" },
    { src: "/images/Template-6.png", label: "Template 06 · Conversion directe" },
  ];

  return (
    <div className="site-root page-projets">
      <Container className="site-wrap">
        <div className="site-hero site-reveal" data-section-label="Intro">
          <span className="site-kicker">Projets</span>
          <h1 className="site-title">Preuves visuelles, lecture imm&eacute;diate.</h1>
          <p className="site-subtitle">
            Des exemples concrets pour &eacute;valuer la direction, la coh&eacute;rence du design et la finition.
          </p>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Demander des exemples adapt&eacute;s
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-section-label="Exemples de templates" data-reveal data-reveal-delay="160">
          <div className="site-section-title">Exemples de templates</div>
          <div className="site-template-grid">
            {templates.map((template) => (
              <article
                key={template.src}
                className="site-template-card"
                style={{ backgroundImage: `url(${template.src})` }}
              >
                <div className="site-template-meta">
                  <span className="site-template-badge">Exemple</span>
                  <h3 className="site-template-title">{template.label}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="site-cta">
            <Link href="/processus" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir le processus complet
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-section-label="Repères" data-reveal data-reveal-delay="220">
          <div className="site-section-title">Repères de qualité</div>
          <div className="site-grid">
            <div className="site-card">
              <div className="site-card-title">Cas concret</div>
              <div className="site-list-item">Brief clarifi&eacute; en 48h.</div>
              <div className="site-list-item">Direction valid&eacute;e en 3 boucles courtes.</div>
              <div className="site-list-item">Mise en ligne et passation sous 3 semaines.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Rendu final</div>
              <div className="site-list-item">Hiérarchie visuelle nette et lecture rapide.</div>
              <div className="site-list-item">Parcours court : message clair, action immédiate.</div>
              <div className="site-list-item">Fichiers propres pour réutilisation multi-supports.</div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Obtenir mon plan de projet
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}


