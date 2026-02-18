"use client";

import { useState } from "react";
import PaymentLinkField from "@/components/admin/PaymentLinkField";
import { regenerateAcompteLink } from "./actions";

type Props = {
  requestId: string;
  type: string;
};

export default function RegenerateLinkButton({ requestId, type }: Props) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleClick() {
    try {
      setFeedback(null);
      setLoading(true);
      const url = await regenerateAcompteLink(requestId, type);
      setLink(url);
      setFeedback({ kind: "success", text: "Nouveau lien d’acompte généré." });
    } catch (error) {
      console.error(error);
      setFeedback({
        kind: "error",
        text: "Erreur lors de la régénération du lien.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`admin-btn admin-btn-warn ${loading ? "admin-btn-muted" : ""}`}
      >
        {loading ? "Régénération..." : "Régénérer le lien d’acompte"}
      </button>
      {link ? (
        <div className="space-y-2">
          <p className="text-sm">Nouveau lien d’acompte :</p>
          <PaymentLinkField link={link} />
        </div>
      ) : null}
      {feedback ? (
        <p
          role={feedback.kind === "error" ? "alert" : "status"}
          aria-live={feedback.kind === "error" ? "assertive" : "polite"}
          className={`admin-feedback ${
            feedback.kind === "error" ? "admin-feedback-error" : "admin-feedback-success"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}
