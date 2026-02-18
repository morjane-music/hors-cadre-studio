"use client";

import Link from "next/link";
import { useState } from "react";

type ConsentValue = "accepted" | "refused" | null;

const CONSENT_KEY = "site-consent-analytics";

function readStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "refused" ? value : null;
  } catch {
    // Continue with cookie fallback.
  }

  try {
    const fromCookie = document.cookie
      .split(";")
      .map((chunk) => chunk.trim())
      .find((chunk) => chunk.startsWith(`${CONSENT_KEY}=`))
      ?.split("=")[1];
    return fromCookie === "accepted" || fromCookie === "refused" ? fromCookie : null;
  } catch {
    return null;
  }
}

function persistConsent(value: Exclude<ConsentValue, null>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // If storage is blocked, keep in-memory state only.
  }

  try {
    document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // Ignore cookie write errors.
  }
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentValue>(() => readStoredConsent());

  function handleConsent(value: Exclude<ConsentValue, null>) {
    persistConsent(value);
    setConsent(value);
  }

  if (consent !== null) return null;

  return (
    <div className="site-cookie-banner" role="dialog" aria-label="Gestion des cookies">
      <p>
        Nous utilisons des mesures d&apos;audience anonymisées pour améliorer le site.
        Vous pouvez accepter ou refuser.
      </p>
      <div className="site-cookie-actions">
        <button type="button" className="site-btn site-btn-primary" onClick={() => handleConsent("accepted")}>
          Accepter
        </button>
        <button type="button" className="site-btn site-btn-ghost" onClick={() => handleConsent("refused")}>
          Refuser
        </button>
        <Link href="/politique-confidentialite" className="site-cta-secondary">
          En savoir plus
        </Link>
      </div>
    </div>
  );
}
