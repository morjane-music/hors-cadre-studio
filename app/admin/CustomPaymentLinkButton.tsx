"use client";

import { useMemo, useState } from "react";
import PaymentLinkField from "@/components/admin/PaymentLinkField";
import { createCustomPaymentLink } from "./actions";

type Props = {
  requestId: string;
  defaultType: "acompte" | "solde";
};

export default function CustomPaymentLinkButton({ requestId, defaultType }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"acompte" | "solde">(defaultType);
  const [amount, setAmount] = useState(defaultType === "solde" ? "600" : "400");
  const [label, setLabel] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const title = useMemo(
    () =>
      paymentType === "acompte"
        ? "Paiement d'acompte personnalisé"
        : "Paiement du solde personnalisé",
    [paymentType]
  );

  async function handleSubmit() {
    const parsed = Number(amount.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setFeedback({ kind: "error", text: "Montant invalide." });
      return;
    }

    try {
      setFeedback(null);
      setLoading(true);
      const url = await createCustomPaymentLink({
        requestId,
        amountEuros: parsed,
        paymentType,
        label: label.trim() || undefined,
      });
      setLink(url);
      setFeedback({ kind: "success", text: "Lien de paiement créé et envoyé." });
    } catch (error) {
      console.error(error);
      setFeedback({
        kind: "error",
        text: "Erreur lors de la création du lien de paiement.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="admin-btn admin-btn-warn"
      >
        {open ? "Fermer paiement personnalisé" : "Accepter + lien personnalisé"}
      </button>

      {open && (
        <div className="admin-soft grid gap-2">
          <p className="text-sm font-medium">{title}</p>
          <div className="grid gap-2 md:grid-cols-3">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as "acompte" | "solde")}
              className="admin-select"
            >
              <option value="acompte">Acompte</option>
              <option value="solde">Solde</option>
            </select>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="admin-input"
              placeholder="Montant en euros"
            />
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="admin-input"
              placeholder="Intitulé (optionnel)"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`admin-btn admin-btn-primary ${loading ? "admin-btn-muted" : ""}`}
            >
              {loading ? "Création du lien..." : "Créer et envoyer le lien"}
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

      {link ? <PaymentLinkField link={link} /> : null}
    </div>
  );
}
