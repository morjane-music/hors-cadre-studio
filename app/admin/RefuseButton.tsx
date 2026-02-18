"use client";

import { useState } from "react";
import { refuseRequest } from "./actions";

export default function RefuseButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleClick() {
    try {
      setFeedback(null);
      setLoading(true);
      await refuseRequest(requestId);
      setFeedback({ kind: "success", text: "Demande refusée. Rechargement…" });
      setTimeout(() => window.location.reload(), 350);
    } catch {
      setFeedback({ kind: "error", text: "Erreur lors du refus." });
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
        className={`admin-btn admin-btn-danger ${loading ? "admin-btn-muted" : ""}`}
      >
        {loading ? "Refus..." : "Refuser"}
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
