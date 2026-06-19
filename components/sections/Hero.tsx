import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="site-hero site-hero-home site-reveal" data-reveal data-reveal-delay="20">
      <div className="site-hero-copy">
        <span className="site-kicker">Studio créatif à La Réunion</span>
        <h1 className="site-title">
          Une image qui claque, sans perdre le cap.<span className="site-title-mark">✦</span>
        </h1>
        <p className="site-subtitle">
          Sites, identités et visuels numériques pour artistes, indépendants et projets locaux qui veulent être
          compris vite, mémorisés fort, et rester crédibles.
        </p>
        <div className="site-proof-strip" aria-label="Preuves immédiates">
          <span className="site-proof-pill">Visuels digitaux dès 50 €</span>
          <span className="site-proof-pill">One-page dès 850 €</span>
          <span className="site-proof-pill">Réponse 24-48h</span>
        </div>
        <div className="site-cta">
          <Link href="/prestations" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
            Voir les offres
          </Link>
          <Link href="/projets" className="site-cta-secondary" data-cursor data-sound>
            Voir le style
          </Link>
        </div>
      </div>

      <div className="site-hero-orbit" aria-hidden="true">
        <div className="site-hero-logo-float">
          <Image
            src="/brand/logo-full.png"
            alt=""
            fill
            className="site-hero-logo-image"
            sizes="(max-width: 860px) 150px, 280px"
          />
        </div>
      </div>
    </section>
  );
}
