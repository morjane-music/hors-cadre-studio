"use client";

import { useState } from "react";
import { sendDiscussionMessage } from "./actions";

export default function ProlongDiscussionButton({
  requestId,
}: {
  requestId: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    "Bonjour,\n\nMerci pour votre demande. Pour bien orienter le projet, pouvez-vous préciser :\n- objectif principal\n- délai souhaité\n- budget indicatif\n\nMerci."
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSend() {
    try {
      setFeedback(null);
      setLoading(true);
      await sendDiscussionMessage(requestId, message);
      setOpen(false);
      setFeedback({ kind: "success", text: "Message envoyé au client. Rechargement..." });
      setTimeout(() => window.location.reload(), 450);
    } catch {
      setFeedback({ kind: "error", text: "Erreur lors de l'envoi du message." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setOpen((v) => !v)} className="admin-btn">
        {open ? "Fermer" : "Prolonger discussion"}
      </button>

      {open && (
        <div className="space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="admin-input w-full min-h-[120px]"
            placeholder="Écris le message à envoyer au client..."
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className={`admin-btn admin-btn-primary ${
                loading || !message.trim() ? "admin-btn-muted" : ""
              }`}
            >
              {loading ? "Envoi..." : "Envoyer au client"}
            </button>
          </div>
        </div>
      )}

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
