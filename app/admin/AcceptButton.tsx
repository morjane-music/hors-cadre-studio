"use client";

import { useState } from "react";
import { acceptAndCreateAcompte } from "./actions";

type Props = {
  requestId: string;
  type: string;
};

export default function AcceptButton({ requestId, type }: Props) {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  async function handleClick() {
    try {
      setFeedback(null);
      setLoading(true);
      const url = await acceptAndCreateAcompte(requestId, type);
      setLink(url);
      setFeedback({ kind: "success", text: "Lien d’acompte généré." });
    } catch (error) {
      console.error(error);
      setFeedback({
        kind: "error",
        text: "Erreur lors de la génération du lien d’acompte.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.select();
  }

  async function handleCopy() {
    if (!link) return;
    setCopied(false);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setFeedback({ kind: "success", text: "Lien copié." });
    } catch {
      setFeedback({
        kind: "error",
        text: "Copie automatique impossible. Sélectionnez le lien et copiez-le.",
      });
    }
  }

  return (
    <div className="space-y-2">
      {!link ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`admin-btn admin-btn-primary ${loading ? "admin-btn-muted" : ""}`}
        >
          {loading ? "Génération du lien..." : "Accepter · générer le lien d’acompte"}
        </button>
      ) : (
        <>
          <p className="text-sm">Lien d’acompte généré :</p>
          <input
            value={link}
            readOnly
            onFocus={handleSelect}
            className="admin-input w-full"
          />
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={handleCopy}
              className="admin-btn"
            >
              {copied ? "Lien copié" : "Copier le lien"}
            </button>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="admin-btn"
            >
              Ouvrir
            </a>
            <span className="text-[var(--text-muted)]">
              Astuce : clique dans le champ pour sélectionner.
            </span>
          </div>
        </>
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
