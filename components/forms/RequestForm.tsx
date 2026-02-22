"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { trackUxEvent } from "@/lib/ux-client";

type Props = {
  presetType?: string;
};

type FormState = {
  name: string;
  email: string;
  type: string;
  message: string;
};

type UiFeedback =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

export default function RequestForm({ presetType }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState<UiFeedback>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    type: presetType ?? "Site vitrine",
    message: "",
  });
  const hasInteractedRef = useRef(false);
  const abandonSentRef = useRef(false);

  const stepLabel = useMemo(
    () => (step === 1 ? "Étape 1/2 · Profil" : "Étape 2/2 · Besoin"),
    [step]
  );

  const feedbackId = "contact-feedback";
  const nameId = "contact-name";
  const emailId = "contact-email";
  const typeId = "contact-type";
  const messageId = "contact-message";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    hasInteractedRef.current = true;
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStepOne() {
    if (!form.name.trim()) return "Le nom est requis.";
    if (!form.email.trim()) return "L'email est requis.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "L'email n'est pas valide.";
    if (!form.type.trim()) return "Le type de demande est requis.";
    return "";
  }

  function onNextStep() {
    const message = validateStepOne();
    if (message) {
      setFeedback({ kind: "error", text: message });
      return;
    }
    setFeedback(null);
    setStep(2);
    trackUxEvent("form_step_change", { toStep: 2, type: form.type });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const message = validateStepOne();
    if (message) {
      setStep(1);
      setFeedback({ kind: "error", text: message });
      return;
    }
    if (!form.message.trim()) {
      setFeedback({ kind: "error", text: "Le message est requis." });
      return;
    }

    setFeedback(null);
    setLoading(true);
    const { error: insertError } = await supabase.from("requests").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      type: form.type.trim(),
      message: form.message.trim(),
      status: "pending",
    });
    setLoading(false);

    if (insertError) {
      setFeedback({ kind: "error", text: "Erreur lors de l'envoi. Réessayez." });
      trackUxEvent("form_submit_error", { reason: "insert_failed", type: form.type });
      return;
    }

    trackUxEvent("form_submit_success", { type: form.type });
    setSent(true);
    abandonSentRef.current = true;
    setStep(1);
    setFeedback({
      kind: "success",
      text: "Demande envoyée. Vous recevez une réponse claire rapidement.",
    });
    setForm({
      name: "",
      email: "",
      type: presetType ?? "Site vitrine",
      message: "",
    });
  }

  useEffect(() => {
    function trackAbandon() {
      if (abandonSentRef.current || sent || !hasInteractedRef.current) return;
      abandonSentRef.current = true;
      trackUxEvent("form_abandon", {
        step,
        type: form.type || presetType || "inconnu",
      });
    }

    window.addEventListener("beforeunload", trackAbandon);
    return () => {
      window.removeEventListener("beforeunload", trackAbandon);
      trackAbandon();
    };
  }, [form.type, presetType, sent, step]);

  if (sent) {
    return (
      <p role="status" aria-live="polite" className="site-form-feedback site-form-feedback-success">
        Merci, demande envoyée. Réponse rapide avec une suite claire.
      </p>
    );
  }

  const hasError = feedback?.kind === "error";

  return (
    <form onSubmit={onSubmit} className="site-form">
      <div className="site-pill site-pill-wide">{stepLabel}</div>

      {step === 1 ? (
        <>
          <div>
            <label htmlFor={nameId} className="site-label">Nom</label>
            <input
              id={nameId}
              name="name"
              required
              className="site-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              aria-invalid={hasError}
              aria-describedby={feedback ? feedbackId : undefined}
            />
          </div>

          <div>
            <label htmlFor={emailId} className="site-label">Email</label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              className="site-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              aria-invalid={hasError}
              aria-describedby={feedback ? feedbackId : undefined}
            />
          </div>

          {!presetType ? (
            <div>
              <label htmlFor={typeId} className="site-label">Type de demande</label>
              <select
                id={typeId}
                name="type"
                className="site-select"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                aria-invalid={hasError}
                aria-describedby={feedback ? feedbackId : undefined}
              >
                <option>Site vitrine</option>
                <option>Offre Essentiel</option>
                <option>Identité visuelle</option>
                <option>Direction artistique</option>
                <option>Visuel Essentiel</option>
                <option>Visuel Plus</option>
                <option>Pack Événement</option>
                <option>Pack Lancement</option>
                <option>Pack Signature</option>
                <option>Pack Hors Cadre</option>
                <option>Maintenance Essentielle</option>
                <option>Maintenance Premium</option>
                <option>Demande Kap Numérik (préparation)</option>
                <option>Projet sur mesure</option>
              </select>
            </div>
          ) : (
            <input type="hidden" name="type" value={form.type} />
          )}

          <div className="site-form-actions">
            <button
              type="button"
              className="site-btn site-btn-primary"
              onClick={onNextStep}
              data-track="contact_step_1_continue"
              data-sound
            >
              Continuer
            </button>
            <span className="site-note">Objectif : clarifier vite votre besoin.</span>
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor={messageId} className="site-label">Message</label>
            <textarea
              id={messageId}
              name="message"
              required
              rows={5}
              className="site-textarea"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Contexte, objectif, délai, budget indicatif."
              aria-invalid={hasError}
              aria-describedby={feedback ? feedbackId : undefined}
            />
          </div>

          <div className="site-form-actions">
            <button
              type="button"
              className="site-btn site-btn-ghost"
              onClick={() => {
                setStep(1);
                trackUxEvent("form_step_change", { toStep: 1, type: form.type });
              }}
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className="site-btn site-btn-primary"
              data-magnetic
              data-cursor
              data-sound
              data-track="contact_submit"
              aria-busy={loading}
            >
              {loading ? "Envoi..." : "Envoyer la demande"}
            </button>
          </div>
        </>
      )}

      {feedback ? (
        <p
          id={feedbackId}
          role={feedback.kind === "error" ? "alert" : "status"}
          aria-live={feedback.kind === "error" ? "assertive" : "polite"}
          className={`site-form-feedback ${
            feedback.kind === "error" ? "site-form-feedback-error" : "site-form-feedback-success"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </form>
  );
}

