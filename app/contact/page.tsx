import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import RequestForm from "@/components/forms/RequestForm";
import "../site.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Envoyez votre demande en 2 étapes. Retour sous 24-48h avec une feuille de route adaptée à votre contexte.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string }>;
}) {
  const params = await searchParams;
  const presetType = typeof params.offer === "string" ? params.offer.trim() : undefined;

  return (
    <div className="site-root page-contact">
      <Container className="site-wrap">
        <div className="site-hero site-reveal" data-section-label="Intro">
          <span className="site-kicker">Contact</span>
          <h1 className="site-title">On aligne, puis on lance.</h1>
          <p className="site-subtitle">Deux étapes simples. Vous décrivez l&apos;essentiel, on revient avec une feuille de route actionnable.</p>
        </div>

        <div className="site-section site-reveal accent-blue" data-section-label="Brief" data-reveal data-reveal-delay="100">
          <div className="site-grid" data-flow>
            <div className="site-card site-brief-card">
              <div className="site-card-title">Ce qu&apos;il nous faut</div>
              <div className="site-list-item">Objectif principal du projet.</div>
              <div className="site-list-item">Offre visée (unité, pack ou sur mesure).</div>
              <div className="site-list-item">Délai souhaité.</div>
              <div className="site-list-item">Budget indicatif (si possible).</div>
              <div className="site-list-item">Si besoin : mention “Kap Numérik (préparation)”.</div>
            </div>

            <div className="site-card">
              <div className="site-card-title">Votre demande</div>
              <RequestForm presetType={presetType || undefined} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

