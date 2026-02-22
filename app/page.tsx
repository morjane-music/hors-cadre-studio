import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Hero from "@/components/sections/Hero";
import "./site.css";

export const metadata: Metadata = {
  title: "Studio créatif pour artistes, indépendants et petites marques",
  description:
    "Direction forte, exécution singulière. Découvrez la méthode Hors Cadre Studio et des offres activables rapidement.",
};

export default function Home() {
  return (
    <div className="site-root page-home">
      <Container className="site-wrap">
        <Hero />

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="40">
          <div className="site-section-title">Showreel de r&eacute;f&eacute;rence</div>
          <div className="site-video-card site-parallax" data-parallax>
            <div className="site-video-badge">Showreel</div>
            <video className="site-video" controls preload="metadata" src="/videos/morjane-demo.mp4" />
            <div className="site-note">Un extrait r&eacute;el pour juger le niveau de direction, de design et de finition.</div>
          </div>
          <div className="site-cta">
            <Link href="/projets" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir les r&eacute;alisations
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="80">
          <div className="site-section-title">Ce Que Vous Obtenez</div>
          <div className="site-grid site-stagger site-grid-obtention" data-flow>
            <div className="site-card">
              <div className="site-icon">01</div>
              <span className="site-pill site-pill-wide">Clart&eacute;</span>
              <div className="site-card-title">Positionnement précis</div>
              <div className="site-list-item">Votre activit&eacute; est comprise imm&eacute;diatement.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">02</div>
              <span className="site-pill site-pill-wide">Impact</span>
              <div className="site-card-title">Design qui marque</div>
              <div className="site-list-item">Une image forte, coh&eacute;rente et m&eacute;morable.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">03</div>
              <span className="site-pill site-pill-wide">Ma&icirc;trise</span>
              <div className="site-card-title">Ex&eacute;cution singuli&egrave;re</div>
              <div className="site-list-item">Un livrable propre, pr&ecirc;t &agrave; l&apos;emploi.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="100">
          <div className="site-section-title">Pourquoi Choisir Hors Cadre Studio</div>
          <div className="site-grid site-stagger" data-flow>
            <div className="site-card">
              <div className="site-card-title">Direction assumée</div>
              <div className="site-list-item">
                Une vision forte, des choix tranch&eacute;s, une ex&eacute;cution sans dispersion.
              </div>
            </div>
            <div className="site-card">
              <div className="site-card-title">M&eacute;thode directe</div>
              <div className="site-list-item">
                Un parcours simple en 3 &eacute;tapes pour avancer sans friction.
              </div>
            </div>
            <div className="site-card">
              <div className="site-card-title">R&eacute;sultat activable</div>
              <div className="site-list-item">
                Site, identit&eacute; et assets livr&eacute;s pour &ecirc;tre utilis&eacute;s tout de suite.
              </div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Parler de votre projet
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="120">
          <div className="site-section-title">Repères concrets</div>
          <div className="site-proof site-stagger">
            <div className="site-stat">
              <div className="site-stat-value">24-48h</div>
              <div className="site-stat-label">R&eacute;ponse initiale exploitable avec plan de suite.</div>
            </div>
            <div className="site-stat">
              <div className="site-stat-value">3 &eacute;tapes</div>
              <div className="site-stat-label">Vision, production, livraison : parcours lisible.</div>
            </div>
            <div className="site-stat">
              <div className="site-stat-value">1 cap</div>
              <div className="site-stat-label">Des d&eacute;cisions utiles, sans effet gratuit.</div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/processus" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir le processus
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="160">
          <div className="site-section-title">Prestations Principales</div>
          <div className="site-grid site-stagger" data-flow>
            <div className="site-card">
              <div className="site-card-title">Site vitrine</div>
              <div className="site-list-item">Structure, copywriting, design et mise en ligne.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Identit&eacute; visuelle</div>
              <div className="site-list-item">Logo, palette, typographies et r&egrave;gles d&apos;usage.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Direction artistique</div>
              <div className="site-list-item">Cap cr&eacute;atif pour aligner message, style et perception.</div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/prestations" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir toutes les offres
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="200">
          <div className="site-section-title">Engagements Clairs</div>
          <div className="site-guarantees site-stagger">
            <div className="site-guarantee">
              <div className="site-card-title">Cap affirm&eacute;</div>
              <div className="site-list-item">Objectifs et livrables explicites d&egrave;s le d&eacute;part.</div>
            </div>
            <div className="site-guarantee">
              <div className="site-card-title">Tempo direct</div>
              <div className="site-list-item">Peu d&apos;allers-retours, d&eacute;cisions assum&eacute;es.</div>
            </div>
            <div className="site-guarantee">
              <div className="site-card-title">Passation solide</div>
              <div className="site-list-item">Transmission structur&eacute;e et accompagnement initial.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal site-break" data-reveal data-reveal-delay="240">
          <div className="site-signature">
            <div className="site-signature-title">Autorit&eacute; cr&eacute;ative, sous contr&ocirc;le.</div>
            <div className="site-signature-sub">
              Un site qui affirme qui vous &ecirc;tes, ce que vous proposez et comment vous contacter.
            </div>
            <div className="site-cta site-signature-cta">
              <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
                D&eacute;marrer un projet
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}


