"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { trackUxEvent } from "@/lib/ux-client";

type Scope = "visual" | "site" | "brand" | "full";
type Budget = "starter" | "mid" | "high";
type Tempo = "soon" | "normal";

export default function OfferEstimator() {
  const [scope, setScope] = useState<Scope>("site");
  const [budget, setBudget] = useState<Budget>("mid");
  const [tempo, setTempo] = useState<Tempo>("normal");

  const recommendation = useMemo(() => {
    if (scope === "visual") {
      return tempo === "soon"
        ? {
            title: "Visuel Flash",
            price: "50 €",
            reason: "Un visuel numérique rapide pour publier proprement sans ouvrir un gros chantier.",
          }
        : {
            title: "Visuel Plus",
            price: "130 €",
            reason: "Une direction plus travaillée avec déclinaisons digitales pour réseaux et annonce.",
          };
    }

    if (scope === "full" || budget === "high") {
      return {
        title: "Pack Hors Cadre",
        price: "3 500 €+",
        reason: "Direction artistique, site et assets prioritaires pour une image plus ambitieuse.",
      };
    }

    if (scope === "brand") {
      return budget === "starter"
        ? {
            title: "Mini identité",
            price: "490 €",
            reason: "Une base visuelle propre pour lancer sans charte complète.",
          }
        : {
            title: "Identité complète",
            price: "950 €",
            reason: "Logo, couleurs, typographies et règles simples pour rendre le projet identifiable.",
          };
    }

    if (budget === "starter") {
      return {
        title: "One-page Essentiel",
        price: "850 €",
        reason: "Une présence web claire et accessible pour présenter l’essentiel.",
      };
    }

    return {
      title: "Site vitrine signature",
      price: "1 600-1 900 €",
      reason: "Un site plus distinctif avec structure persuasive, design fort et effets maîtrisés.",
    };
  }, [scope, budget, tempo]);

  return (
    <div className="site-estimator">
      <div className="site-estimator-grid">
        <div className="site-estimator-block">
          <div className="site-estimator-label">Besoin</div>
          <div className="site-estimator-row">
            <button type="button" aria-pressed={scope === "visual"} className={`site-estimator-choice ${scope === "visual" ? "is-active" : ""}`} onClick={() => setScope("visual")}>
              Visuel digital
            </button>
            <button type="button" aria-pressed={scope === "site"} className={`site-estimator-choice ${scope === "site" ? "is-active" : ""}`} onClick={() => setScope("site")}>
              Site web
            </button>
            <button type="button" aria-pressed={scope === "brand"} className={`site-estimator-choice ${scope === "brand" ? "is-active" : ""}`} onClick={() => setScope("brand")}>
              Identité
            </button>
            <button type="button" aria-pressed={scope === "full"} className={`site-estimator-choice ${scope === "full" ? "is-active" : ""}`} onClick={() => setScope("full")}>
              Projet complet
            </button>
          </div>
        </div>

        <div className="site-estimator-block">
          <div className="site-estimator-label">Budget</div>
          <div className="site-estimator-row">
            <button type="button" aria-pressed={budget === "starter"} className={`site-estimator-choice ${budget === "starter" ? "is-active" : ""}`} onClick={() => setBudget("starter")}>
              Accessible
            </button>
            <button type="button" aria-pressed={budget === "mid"} className={`site-estimator-choice ${budget === "mid" ? "is-active" : ""}`} onClick={() => setBudget("mid")}>
              Sérieux
            </button>
            <button type="button" aria-pressed={budget === "high"} className={`site-estimator-choice ${budget === "high" ? "is-active" : ""}`} onClick={() => setBudget("high")}>
              Signature
            </button>
          </div>
        </div>

        <div className="site-estimator-block">
          <div className="site-estimator-label">Délai</div>
          <div className="site-estimator-row">
            <button type="button" aria-pressed={tempo === "soon"} className={`site-estimator-choice ${tempo === "soon" ? "is-active" : ""}`} onClick={() => setTempo("soon")}>
              Rapide
            </button>
            <button type="button" aria-pressed={tempo === "normal"} className={`site-estimator-choice ${tempo === "normal" ? "is-active" : ""}`} onClick={() => setTempo("normal")}>
              Cadence normale
            </button>
          </div>
        </div>
      </div>

      <div className="site-estimator-result">
        <div className="site-estimator-kicker">Recommandation</div>
        <div className="site-estimator-title">{recommendation.title}</div>
        <div className="site-pill">{recommendation.price}</div>
        <div className="site-estimator-copy">{recommendation.reason}</div>
        <div className="site-cta">
          <Link
            href={`/contact?offer=${encodeURIComponent(recommendation.title)}`}
            className="site-btn site-btn-primary"
            onClick={() => trackUxEvent("estimator_recommendation_click", { offer: recommendation.title, scope, budget, tempo })}
          >
            Continuer avec cette offre
          </Link>
        </div>
      </div>
    </div>
  );
}
