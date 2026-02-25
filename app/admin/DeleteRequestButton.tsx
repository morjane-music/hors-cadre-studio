"use client";

import { useState } from "react";
import { deleteRequest } from "./actions";

export default function DeleteRequestButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleDelete() {
    const ok = window.confirm(
      "Supprimer définitivement cette demande ? Cette action est irréversible."
    );
    if (!ok) return;

    try {
      setFeedback(null);
      setLoading(true);
      await deleteRequest(requestId);
      setFeedback({ kind: "success", text: "Demande supprimée. Rechargement…" });
      setTimeout(() => window.location.reload(), 350);
    } catch {
      setFeedback({ kind: "error", text: "Erreur lors de la suppression." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className={`admin-btn admin-btn-danger ${loading ? "admin-btn-muted" : ""}`}
      >
        {loading ? "Suppression..." : "Supprimer la demande"}
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
