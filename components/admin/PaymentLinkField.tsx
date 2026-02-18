"use client";

import { useState } from "react";

export default function PaymentLinkField({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  function handleSelect(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.select();
  }

  async function handleCopy() {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      alert("Copie automatique impossible. Sélectionne le lien et copie-le.");
    }
  }

  return (
    <div className="text-sm">
      <p className="admin-section-title">Lien de paiement</p>
      <input
        value={link}
        readOnly
        onFocus={handleSelect}
        className="admin-input w-full"
      />
      <div className="flex items-center gap-3 text-sm mt-2">
        <button type="button" onClick={handleCopy} className="admin-btn">
          {copied ? "Lien copié" : "Copier le lien"}
        </button>
        <a href={link} target="_blank" rel="noreferrer" className="admin-btn">
          Ouvrir
        </a>
        <span className="text-[var(--text-muted)]">
          Astuce : clique dans le champ pour sélectionner.
        </span>
      </div>
    </div>
  );
}
