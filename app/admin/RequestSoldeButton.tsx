"use client";

import { useState } from "react";
import { requestSolde } from "./actions";

export default function RequestSoldeButton({
  requestId,
  type,
}: {
  requestId: string;
  type: string;
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleClick() {
    try {
      setFeedback(null);
      setLoading(true);
      await requestSolde(requestId, type);
      setFeedback({ kind: "success", text: "Demande de solde envoyée. Rechargement…" });
      setTimeout(() => window.location.reload(), 350);
    } catch {
      setFeedback({ kind: "error", text: "Erreur lors de la demande de solde." });
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
        className={`admin-btn admin-btn-success admin-btn-primary ${
          loading ? "admin-btn-muted" : ""
        }`}
      >
        {loading ? "Envoi..." : "Demander le solde"}
      </button>
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
