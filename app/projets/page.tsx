import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "Projets et directions visuelles",
  description:
    "Exemples de directions visuelles, templates et repères de qualité pour sites, identités et visuels numériques Hors Cadre Studio.",
};

export default function ProjetsPage() {
  const templates = [
    { src: "/images/Template-1.png", label: "Ciné premium", meta: "Image forte, contraste, atmosphère" },
    { src: "/images/Template-2.png", label: "Éditorial clair", meta: "Lecture rapide, contenu structuré" },
    { src: "/images/Template-3.png", label: "Minimal architecture", meta: "Silence visuel, crédibilité" },
    { src: "/images/Template-4.png", label: "Mood artiste", meta: "Univers, tension, singularité" },
    { src: "/images/Template-5.png", label: "Studio vibrant", meta: "Couleur, énergie, mémorisation" },
    { src: "/images/Template-6.png", label: "Conversion directe", meta: "Message court, action claire" },
  ];

  return (
    <div className="site-root page-projets">
      <Container className="site-wrap">
        <div className="site-hero site-reveal" data-section-label="Intro">
          <span className="site-kicker">Style & preuves</span>
          <h1 className="site-title">Des directions qui se voient vite.</h1>
          <p className="site-subtitle">
            Ici, on juge le niveau par la lecture, le rythme, la cohérence et la capacité à rendre un projet identifiable.
          </p>
          <p className="site-note">
            Les exemples ci-dessous montrent des pistes de direction et de composition. Les cas clients complets, identités et visuels numériques peuvent être envoyés selon votre besoin.
          </p>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Demander des exemples adaptés
            </Link>
            <Link href="/prestations" className="site-cta-secondary" data-cursor data-sound>
              Voir les tarifs
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-section-label="Directions" data-reveal data-reveal-delay="120">
          <div className="site-section-title">Directions possibles</div>
          <div className="site-template-grid">
            {templates.map((template) => (
              <article
                key={template.src}
                className="site-template-card"
                style={{ backgroundImage: `url(${template.src})` }}
              >
                <div className="site-template-meta">
                  <span className="site-template-badge">Direction</span>
                  <h3 className="site-template-title">{template.label}</h3>
                  <p className="site-note">{template.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-section-label="Repères" data-reveal data-reveal-delay="180">
          <div className="site-section-title">Ce qu’on regarde</div>
          <div className="site-grid" data-flow>
            <div className="site-card">
              <div className="site-card-title">Lisibilité</div>
              <div className="site-list-item">Le visiteur comprend qui vous êtes et quoi faire en quelques secondes.</div>
              <div className="site-list-item">Les textes, visuels et CTA ont chacun un rôle clair.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Signature</div>
              <div className="site-list-item">La direction ne ressemble pas à un template neutre posé au hasard.</div>
              <div className="site-list-item">Les effets wow servent la mémoire, pas le bruit.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Usage</div>
              <div className="site-list-item">Le rendu doit être publiable, partageable et exploitable rapidement.</div>
              <div className="site-list-item">Digital d’abord : site, réseaux, annonces, campagnes locales.</div>
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
