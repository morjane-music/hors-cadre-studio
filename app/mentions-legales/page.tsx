import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "Mentions l\u00E9gales",
  description: "Mentions l\u00E9gales du site Hors Cadre Studio.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="site-root page-mentions-legales">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Informations l&eacute;gales</span>
          <h1 className="site-title">Mentions l&eacute;gales</h1>
          <p className="site-subtitle">Informations obligatoires et conditions d&apos;utilisation du site.</p>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="40">
          <div className="site-section-title">&Eacute;diteur du site</div>
          <div className="site-card">
            <div className="site-list-item">Nom commercial : Hors Cadre Studio.</div>
            <div className="site-list-item">Responsable de publication : Morgane Payet.</div>
            <div className="site-list-item">Contact : via la page Contact du site.</div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="80">
          <div className="site-section-title">H&eacute;bergement</div>
          <div className="site-card">
            <div className="site-list-item">H&eacute;bergeur : Netlify, Inc.</div>
            <div className="site-list-item">Adresse : 512 2nd Street, Suite 200, San Francisco, CA 94107, USA.</div>
            <div className="site-list-item">Site : netlify.com.</div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="120">
          <div className="site-section-title">Propri&eacute;t&eacute; intellectuelle</div>
          <div className="site-card">
            <div className="site-list-item">Les contenus du site sont prot&eacute;g&eacute;s par le droit d&apos;auteur.</div>
            <div className="site-list-item">Toute reproduction non autoris&eacute;e est interdite.</div>
            <div className="site-list-item">Les marques et visuels tiers restent la propri&eacute;t&eacute; de leurs titulaires.</div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="160">
          <div className="site-section-title">Donn&eacute;es et cookies</div>
          <div className="site-card">
            <div className="site-list-item">Les formulaires collectent uniquement les donn&eacute;es n&eacute;cessaires au traitement de la demande.</div>
            <div className="site-list-item">Le site peut utiliser des cookies techniques pour son fonctionnement.</div>
            <div className="site-list-item">Pour toute demande sur vos donn&eacute;es, utilisez la page Contact.</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
