import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Hero from "@/components/sections/Hero";
import "./site.css";

export const metadata: Metadata = {
  title: "Studio créatif à La Réunion pour sites, identités et visuels digitaux",
  description:
    "Hors Cadre Studio crée des sites, identités et visuels numériques pour artistes, indépendants et projets locaux à La Réunion.",
};

export default function Home() {
  return (
    <div className="site-root page-home">
      <Container className="site-wrap">
        <Hero />

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="60">
          <div className="site-section-title">Choisir vite</div>
          <div className="site-grid site-stagger" data-flow>
            <Link href="/contact?offer=Visuel%20Flash" className="site-card site-card-link" data-cursor data-sound>
              <span className="site-pill site-pill-wide">Petit besoin</span>
              <div className="site-card-title">Visuel numérique</div>
              <div className="site-list-item">Post, story, annonce, flyer digital ou cover pour diffusion web/réseaux.</div>
              <div className="site-pill">Dès 50 €</div>
            </Link>
            <Link href="/contact?offer=One-page%20Essentiel" className="site-card site-card-link" data-cursor data-sound>
              <span className="site-pill site-pill-wide">Présence web</span>
              <div className="site-card-title">One-page essentiel</div>
              <div className="site-list-item">Une page claire pour présenter votre projet, vos infos et un appel à l’action.</div>
              <div className="site-pill">850 €</div>
            </Link>
            <Link href="/contact?offer=Pack%20Lancement" className="site-card site-card-link" data-cursor data-sound>
              <span className="site-pill site-pill-wide">Projet sérieux</span>
              <div className="site-card-title">Pack Lancement</div>
              <div className="site-list-item">Site court, base visuelle et assets prioritaires pour sortir avec cohérence.</div>
              <div className="site-pill">1 500 €</div>
            </Link>
          </div>
          <div className="site-cta">
            <Link href="/prestations" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Comparer les offres
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="100">
          <div className="site-section-title">Style & rythme</div>
          <div className="site-video-card site-parallax" data-parallax>
            <div className="site-video-badge">Direction visuelle</div>
            <video className="site-video" controls preload="metadata" src="/videos/morjane-demo.mp4" />
            <div className="site-note">Un extrait réel pour sentir le niveau de composition, de rythme et de finition.</div>
          </div>
          <div className="site-cta">
            <Link href="/projets" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir les exemples
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="140">
          <div className="site-section-title">Méthode courte</div>
          <div className="site-grid site-stagger" data-flow>
            <div className="site-card">
              <div className="site-icon">01</div>
              <div className="site-card-title">Cadrer</div>
              <div className="site-list-item">Objectif, cible, style, livrables et budget sont posés dès le départ.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">02</div>
              <div className="site-card-title">Créer</div>
              <div className="site-list-item">Direction visuelle forte, effets wow maîtrisés, ajustements utiles.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">03</div>
              <div className="site-card-title">Livrer</div>
              <div className="site-list-item">Fichiers, mise en ligne ou exports prêts à diffuser selon l’offre.</div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/processus" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir le processus
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal site-break" data-reveal data-reveal-delay="180">
          <div className="site-signature">
            <div className="site-signature-title">Créer plus fort, vendre plus clair.</div>
            <div className="site-signature-sub">
              On part de votre réalité locale, puis on construit une image qui tient debout en ligne.
            </div>
            <div className="site-cta site-signature-cta">
              <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
                Parler de mon projet
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
