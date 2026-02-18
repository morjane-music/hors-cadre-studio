"use client";

type Payload = Record<string, unknown>;

export function trackUxEvent(event: string, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const consent = localStorage.getItem("site-consent-analytics");
  if (consent !== "accepted") return;

  const body = JSON.stringify({
    event,
    payload,
    path: window.location.pathname,
    ts: Date.now(),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/ux-events", blob);
      return;
    }
  } catch {
    // noop
  }

  void fetch("/api/ux-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
