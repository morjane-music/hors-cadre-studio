"use client";

import { useState } from "react";
import { markAcomptePaid } from "./actions";

export default function MarkAcomptePaidButton({
  requestId,
}: {
  requestId: string;
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
      await markAcomptePaid(requestId);
      setFeedback({ kind: "success", text: "Acompte marqué payé. Rechargement…" });
      setTimeout(() => window.location.reload(), 350);
    } catch {
      setFeedback({
        kind: "error",
        text: "Erreur lors du marquage de l’acompte.",
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
        className={`admin-btn admin-btn-success ${loading ? "admin-btn-muted" : ""}`}
      >
        {loading ? "Mise à jour..." : "Marquer acompte payé (manuel)"}
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
