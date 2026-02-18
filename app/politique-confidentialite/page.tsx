import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "../site.css";

export const metadata: Metadata = {
  title: "Politique de confidentialit\u00E9",
  description:
    "Politique de confidentialit\u00E9 de Hors Cadre Studio : donn\u00E9es collect\u00E9es, finalit\u00E9s, dur\u00E9e et droits des personnes.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="site-root page-politique-confidentialite">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Donn&eacute;es personnelles</span>
          <h1 className="site-title">Politique de confidentialit&eacute;</h1>
          <p className="site-subtitle">Transparence sur les donn&eacute;es collect&eacute;es, leur usage et vos droits.</p>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="40">
          <div className="site-section-title">Donn&eacute;es collect&eacute;es</div>
          <div className="site-card">
            <div className="site-list-item">Donn&eacute;es du formulaire : nom, email, type de demande, message.</div>
            <div className="site-list-item">Donn&eacute;es de navigation anonymis&eacute;es si consentement analytics.</div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="80">
          <div className="site-section-title">Finalit&eacute;s</div>
          <div className="site-card">
            <div className="site-list-item">R&eacute;pondre aux demandes et piloter les projets.</div>
            <div className="site-list-item">Am&eacute;liorer l&apos;UX gr&acirc;ce &agrave; des &eacute;v&eacute;nements techniques anonymis&eacute;s.</div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="120">
          <div className="site-section-title">Vos droits</div>
          <div className="site-card">
            <div className="site-list-item">Acc&egrave;s, rectification, suppression, limitation et opposition.</div>
            <div className="site-list-item">Demande via la page Contact.</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
