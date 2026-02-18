"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { trackUxEvent } from "@/lib/ux-client";

type Scope = "one" | "brand" | "full";
type Budget = "tight" | "mid" | "high";
type Tempo = "soon" | "normal";

export default function OfferEstimator() {
  const [scope, setScope] = useState<Scope>("one");
  const [budget, setBudget] = useState<Budget>("mid");
  const [tempo, setTempo] = useState<Tempo>("normal");

  const recommendation = useMemo(() => {
    if (scope === "full" || budget === "high") {
      return {
        title: "Pack Hors Cadre",
        reason: "Direction artistique + site + assets prioritaires pour une sortie premium.",
      };
    }
    if (scope === "brand" || budget === "mid") {
      if (tempo === "soon") {
        return {
          title: "Identité visuelle (one-shot)",
          reason: "Refonte claire et rapide pour renforcer votre singularité visuelle.",
        };
      }
      return {
        title: "Pack Signature",
        reason: "Site vitrine + identité visuelle complète avec système activable.",
      };
    }
    return {
      title: "Site vitrine (one-shot)",
      reason: "Une présence web claire, directe et activable rapidement.",
    };
  }, [scope, budget, tempo]);

  return (
    <div className="site-estimator">
      <div className="site-estimator-grid">
        <div className="site-estimator-block">
          <div className="site-estimator-label">Périmètre</div>
          <div className="site-estimator-row">
            <button type="button" aria-pressed={scope === "one"} className={`site-estimator-choice ${scope === "one" ? "is-active" : ""}`} onClick={() => setScope("one")}>
              Site vitrine
            </button>
            <button type="button" aria-pressed={scope === "brand"} className={`site-estimator-choice ${scope === "brand" ? "is-active" : ""}`} onClick={() => setScope("brand")}>
              Site + identité
            </button>
            <button type="button" aria-pressed={scope === "full"} className={`site-estimator-choice ${scope === "full" ? "is-active" : ""}`} onClick={() => setScope("full")}>
              Projet complet
            </button>
          </div>
        </div>

        <div className="site-estimator-block">
          <div className="site-estimator-label">Budget</div>
          <div className="site-estimator-row">
            <button type="button" aria-pressed={budget === "tight"} className={`site-estimator-choice ${budget === "tight" ? "is-active" : ""}`} onClick={() => setBudget("tight")}>
              &le; 1 500 €
            </button>
            <button type="button" aria-pressed={budget === "mid"} className={`site-estimator-choice ${budget === "mid" ? "is-active" : ""}`} onClick={() => setBudget("mid")}>
              1 500-3 000 €
            </button>
            <button type="button" aria-pressed={budget === "high"} className={`site-estimator-choice ${budget === "high" ? "is-active" : ""}`} onClick={() => setBudget("high")}>
              3 000 €+
            </button>
          </div>
        </div>

        <div className="site-estimator-block">
          <div className="site-estimator-label">Délai</div>
          <div className="site-estimator-row">
            <button type="button" aria-pressed={tempo === "soon"} className={`site-estimator-choice ${tempo === "soon" ? "is-active" : ""}`} onClick={() => setTempo("soon")}>
              Priorité rapide
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
