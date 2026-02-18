import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import "./merci.css";

export const metadata: Metadata = {
  title: "Merci",
  description: "Votre demande est enregistrée. Vous recevrez rapidement les prochaines étapes.",
};

export default function MerciPage() {
  return (
    <div className="merci-root">
      <Container className="py-16">
        <div className="merci-card">
          <p className="merci-eyebrow">Merci pour votre confiance</p>
          <h1 className="merci-title">Votre demande est bien enregistr&eacute;e</h1>
          <p className="merci-sub">
            Nous revenons rapidement avec les prochaines &eacute;tapes.
            Le solde est demand&eacute; uniquement &agrave; la livraison finale.
          </p>

          <div className="merci-steps">
            <div className="merci-step">
              <div className="merci-step-index">1</div>
              <div className="merci-step-title">Confirmation</div>
              <div className="merci-step-desc">Paiement valid&eacute; et dossier ouvert.</div>
            </div>
            <div className="merci-step">
              <div className="merci-step-index">2</div>
              <div className="merci-step-title">Pr&eacute;paration</div>
              <div className="merci-step-desc">Priorisation des actions essentielles.</div>
            </div>
            <div className="merci-step">
              <div className="merci-step-index">3</div>
              <div className="merci-step-title">Livraison</div>
              <div className="merci-step-desc">Validation finale puis r&egrave;glement du solde.</div>
            </div>
          </div>

          <div className="merci-actions">
            <Link href="/" className="merci-btn merci-btn-primary">
              Retour au site
            </Link>
            <Link href="/contact" className="merci-btn">
              Nous contacter
            </Link>
            <Link href="/prestations" className="merci-btn">
              Voir la maintenance (optionnelle)
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
