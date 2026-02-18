import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import RequestForm from "@/components/forms/RequestForm";
import "../site.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Envoyez votre demande en 2 étapes. Réponse rapide avec une suite claire et un plan adapté à votre contexte.",
};

export default function ContactPage() {
  return (
    <div className="site-root page-contact">
      <Container className="site-wrap">
        <div className="site-hero site-reveal" data-section-label="Intro">
          <span className="site-kicker">Contact</span>
          <h1 className="site-title">On aligne, puis on lance.</h1>
          <p className="site-subtitle">Deux étapes simples. Vous décrivez l&apos;essentiel, on revient avec un plan clair.</p>
        </div>

        <div className="site-section site-reveal accent-blue" data-section-label="Brief" data-reveal data-reveal-delay="100">
          <div className="site-grid" data-flow>
            <div className="site-card">
              <div className="site-card-title">Ce qu&apos;il nous faut</div>
              <div className="site-list">Objectif principal du projet.</div>
              <div className="site-list">Type de prestation visé.</div>
              <div className="site-list">Délai souhaité.</div>
              <div className="site-list">Budget indicatif (si possible).</div>
              <div className="site-list">Si besoin : mention “Kap Numérik (préparation)” pour anticiper le dossier.</div>
            </div>

            <div className="site-card">
              <div className="site-card-title">Votre demande</div>
              <RequestForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

