import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import "../admin.css";

type UxEventRow = {
  id: string;
  event: string;
  path: string | null;
  payload: Record<string, unknown> | null;
  occurred_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function countByEvent(rows: UxEventRow[], event: string) {
  return rows.filter((row) => row.event === event).length;
}

function topEntries(values: string[], limit = 5) {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const normalized = value.trim();
    if (!normalized) return;
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export default async function AdminUxPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  let events: UxEventRow[] = [];
  let loadError: string | null = null;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    loadError = "SUPABASE_SERVICE_ROLE_KEY manquant : persistance UX inactive.";
  } else {
    const supabase = createSupabaseServiceClient();
    const sinceDate = new Date();
    sinceDate.setUTCDate(sinceDate.getUTCDate() - 30);
    const since = sinceDate.toISOString();

    const { data, error } = await supabase
      .from("ux_events")
      .select("id, event, path, payload, occurred_at")
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: false })
      .limit(1500);

    if (error) {
      loadError = `Impossible de charger ux_events (${error.code ?? "n/a"}).`;
    } else {
      events = (data ?? []) as UxEventRow[];
    }
  }

  const ctaClicks = countByEvent(events, "cta_click");
  const formSuccess = countByEvent(events, "form_submit_success");
  const formError = countByEvent(events, "form_submit_error");
  const formAbandon = countByEvent(events, "form_abandon");
  const formStart = countByEvent(events, "form_start");
  const conversionRate = ctaClicks > 0 ? Math.round((formSuccess / ctaClicks) * 100) : 0;
  const abandonRate = formSuccess + formAbandon > 0 ? Math.round((formAbandon / (formSuccess + formAbandon)) * 100) : 0;
  const submitErrorRate = formSuccess + formError > 0 ? Math.round((formError / (formSuccess + formError)) * 100) : 0;

  const alerts: string[] = [];
  if (conversionRate > 0 && conversionRate < 12) alerts.push("Conversion CTA -> formulaire faible (< 12%).");
  if (abandonRate > 35) alerts.push("Taux d'abandon élevé (> 35%).");
  if (submitErrorRate > 20) alerts.push("Taux d'erreur formulaire élevé (> 20%).");
  if (events.length < 20) alerts.push("Volume de données faible : confirmer avec plus de trafic.");

  const topCtas = topEntries(
    events
      .filter((item) => item.event === "cta_click")
      .map((item) => String(item.payload?.label ?? ""))
  );
  const topPaths = topEntries(events.map((item) => String(item.path ?? "")));

  return (
    <div className="admin-root">
      <Container className="py-12">
        <div className="admin-shell">
          <div className="admin-header">
            <div>
              <p className="admin-eyebrow">Hors Cadre Studio · Admin</p>
              <h1 className="admin-title">Analytics UX</h1>
              <p className="admin-subtitle">
                Événements des 30 derniers jours pour piloter les décisions design et conversion.
              </p>
            </div>
            <div className="admin-actions">
              <Link href="/admin" className="admin-btn">
                Retour aux demandes
              </Link>
            </div>
          </div>

          {loadError ? (
            <div className="admin-empty">
              <div className="admin-empty-title">Dashboard indisponible</div>
              <p className="text-sm text-[var(--text-muted)]">{loadError}</p>
            </div>
          ) : (
            <>
              {alerts.length > 0 ? (
                <div className="admin-card mb-4">
                  <p className="admin-section-title">Alertes</p>
                  <div className="admin-ux-list">
                    {alerts.map((alert) => (
                      <div key={alert} className="admin-ux-row">
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="admin-kpis">
                <div className="admin-kpi">
                  <div className="admin-kpi-label">Événements</div>
                  <div className="admin-kpi-value">{events.length}</div>
                </div>
                <div className="admin-kpi">
                  <div className="admin-kpi-label">CTA clicks</div>
                  <div className="admin-kpi-value">{ctaClicks}</div>
                </div>
                <div className="admin-kpi">
                  <div className="admin-kpi-label">Form start</div>
                  <div className="admin-kpi-value">{formStart}</div>
                </div>
                <div className="admin-kpi">
                  <div className="admin-kpi-label">Form submit</div>
                  <div className="admin-kpi-value">{formSuccess}</div>
                </div>
                <div className="admin-kpi">
                  <div className="admin-kpi-label">Form abandon</div>
                  <div className="admin-kpi-value">{formAbandon}</div>
                </div>
                <div className="admin-kpi">
                  <div className="admin-kpi-label">Conv. CTA-&gt;submit</div>
                  <div className="admin-kpi-value">{conversionRate}%</div>
                </div>
              </div>

              <div className="admin-grid mt-6">
                <div className="admin-card">
                  <p className="admin-section-title">Top CTA</p>
                  {topCtas.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">Aucune donnée.</p>
                  ) : (
                    <div className="admin-ux-list">
                      {topCtas.map(([label, count]) => (
                        <div key={label} className="admin-ux-row">
                          <span>{label}</span>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-card">
                  <p className="admin-section-title">Top pages</p>
                  {topPaths.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">Aucune donnée.</p>
                  ) : (
                    <div className="admin-ux-list">
                      {topPaths.map(([path, count]) => (
                        <div key={path} className="admin-ux-row">
                          <span>{path}</span>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-card mt-6">
                <p className="admin-section-title">Événements récents</p>
                <div className="admin-ux-table">
                  <div className="admin-ux-table-head">
                    <span>Quand</span>
                    <span>Event</span>
                    <span>Path</span>
                    <span>Payload</span>
                  </div>
                  {events.slice(0, 50).map((event) => (
                    <div key={event.id} className="admin-ux-table-row">
                      <span>{formatDate(event.occurred_at)}</span>
                      <span>{event.event}</span>
                      <span>{event.path ?? "-"}</span>
                      <span className="admin-ux-payload">{event.payload ? JSON.stringify(event.payload) : "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
