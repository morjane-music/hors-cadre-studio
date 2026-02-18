import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="site-hero site-hero-home site-reveal" data-reveal data-reveal-delay="20">
      <div className="site-hero-copy">
        <span className="site-kicker">Studio créatif</span>
        <h1 className="site-title">
          Crée ton univers. Sors du cadre.<span className="site-title-mark">✦</span>
        </h1>
        <p className="site-subtitle">
          Hors Cadre Studio conçoit des identités et des sites pour artistes, indépendants et petites marques qui
          veulent être compris rapidement.
        </p>
        <div className="site-proof-strip" aria-label="Preuves immédiates">
          <span className="site-proof-pill">Réponse 24-48h</span>
          <span className="site-proof-pill">3 étapes validées</span>
          <span className="site-proof-pill">Livrables activables</span>
        </div>
        <div className="site-cta">
          <Link href="/prestations" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
            Voir les prestations
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
