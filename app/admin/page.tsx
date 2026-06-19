import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";
import Container from "@/components/layout/Container";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminToolbar from "@/components/admin/AdminToolbar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import "./admin.css";

type Status =
  | "pending"
  | "discussion"
  | "accepted"
  | "paid_acompte"
  | "pending_solde"
  | "paid_solde"
  | "refused";

type SortKey = "newest" | "oldest" | "name" | "status";

type RequestMessage = {
  id: string;
  request_id: string;
  sender: "admin" | "client" | "system";
  message: string;
  email_status: "pending" | "sent" | "failed";
  created_at: string;
};

type Metrics = {
  monthlyRevenue: number;
  conversionRate: number;
  avgResponseHours: number;
  activeCount: number;
  sparkline: number[];
};

function getOfferPrice(type: string) {
  const normalized = (type || "").trim();
  switch (normalized) {
    case "Visuel Flash":
      return 50;
    case "Visuel Essentiel":
      return 80;
    case "Visuel Plus":
      return 130;
    case "Pack Événement Digital":
    case "Pack Événement":
    case "Pack Event":
      return 250;
    case "Direction campagne digitale":
      return 450;
    case "Mini identité":
      return 490;
    case "Identité complète":
    case "Identité visuelle":
    case "Identité visuelle (one-shot)":
      return 950;
    case "Identité signature":
      return 1400;
    case "One-page Essentiel":
    case "Offre Essentiel":
      return 850;
    case "Site vitrine simple":
    case "Site vitrine":
    case "Site vitrine (one-shot)":
      return 1200;
    case "Site vitrine signature":
      return 1600;
    case "Pack Lancement":
      return 1500;
    case "Pack Signature":
      return 2400;
    case "Pack Hors Cadre":
      return 3500;
    case "Maintenance Essentielle":
      return 70;
    case "Maintenance Premium":
      return 140;
    default:
      return 0;
  }
}
function buildSparkline(values: Array<{ created_at?: string | null }>) {
  const buckets = Array.from({ length: 8 }, () => 0);
  const now = new Date();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const start = now.getTime() - weekMs * 8;

  for (const row of values) {
    if (!row.created_at) continue;
    const time = new Date(row.created_at).getTime();
    if (Number.isNaN(time) || time < start) continue;
    const delta = time - start;
    const idx = Math.min(7, Math.max(0, Math.floor(delta / weekMs)));
    buckets[idx] += 1;
  }
  return buckets;
}

function getSortLabel(sort: SortKey) {
  switch (sort) {
    case "oldest":
      return "Plus ancien";
    case "name":
      return "Nom (A → Z)";
    case "status":
      return "Statut";
    case "newest":
    default:
      return "Plus récent";
  }
}

function buildUrl(baseParams: URLSearchParams, next: Record<string, string | null>) {
  const params = new URLSearchParams(baseParams.toString());
  Object.entries(next).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string; sort?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  const allRequestIds = (requests ?? []).map((row) => row.id);
  const { data: firstAdminMessages } =
    allRequestIds.length > 0
      ? await supabase
          .from("request_messages")
          .select("request_id,created_at")
          .eq("sender", "admin")
          .in("request_id", allRequestIds)
          .order("created_at", { ascending: true })
      : { data: [] as Array<{ request_id: string; created_at: string }> };

  const total = requests?.length ?? 0;
  const pending = requests?.filter((r) => r.status === "pending").length ?? 0;
  const discussion = requests?.filter((r) => r.status === "discussion").length ?? 0;
  const accepted = requests?.filter((r) => r.status === "accepted").length ?? 0;
  const paidAcompte = requests?.filter((r) => r.status === "paid_acompte").length ?? 0;
  const pendingSolde = requests?.filter((r) => r.status === "pending_solde").length ?? 0;
  const paidSolde = requests?.filter((r) => r.status === "paid_solde").length ?? 0;
  const refused = requests?.filter((r) => r.status === "refused").length ?? 0;
  const activeCount =
    requests?.filter((r) =>
      ["pending", "discussion", "accepted", "paid_acompte", "pending_solde"].includes(r.status)
    ).length ?? 0;

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthlyRevenue = (requests ?? [])
    .filter((r) => {
      if (r.status !== "paid_solde" || !r.created_at) return false;
      const d = new Date(r.created_at);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, row) => sum + getOfferPrice(String(row.type ?? "")), 0);

  const conversionRate = total > 0 ? Math.round((paidSolde / total) * 100) : 0;
  const firstMessageByRequest = new Map<string, string>();
  for (const row of firstAdminMessages ?? []) {
    if (!firstMessageByRequest.has(row.request_id)) {
      firstMessageByRequest.set(row.request_id, row.created_at);
    }
  }
  const delays = (requests ?? [])
    .map((r) => {
      const msgAt = firstMessageByRequest.get(r.id);
      if (!r.created_at || !msgAt) return null;
      const delta = new Date(msgAt).getTime() - new Date(r.created_at).getTime();
      if (Number.isNaN(delta) || delta < 0) return null;
      return delta / (1000 * 60 * 60);
    })
    .filter((v): v is number => v !== null);
  const avgResponseHours =
    delays.length > 0 ? Math.round((delays.reduce((a, b) => a + b, 0) / delays.length) * 10) / 10 : 0;
  const sparkline = buildSparkline(requests ?? []);
  const metrics: Metrics = {
    monthlyRevenue,
    conversionRate,
    avgResponseHours,
    activeCount,
    sparkline,
  };

  const statusFilter = resolvedSearchParams?.status as Status | undefined;
  const searchQuery = (resolvedSearchParams?.q ?? "").trim().toLowerCase();
  const sortKey = (resolvedSearchParams?.sort as SortKey) ?? "newest";
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? 1) || 1);
  const perPage = 20;

  const validStatuses: Status[] = [
    "pending",
    "discussion",
    "accepted",
    "paid_acompte",
    "pending_solde",
    "paid_solde",
    "refused",
  ];

  const filteredByStatus =
    statusFilter && validStatuses.includes(statusFilter)
      ? requests?.filter((r) => r.status === statusFilter)
      : requests;

  const filteredByQuery = searchQuery
    ? filteredByStatus?.filter((r) => {
        const haystack = [r.name, r.email, r.type, r.message]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(searchQuery);
      })
    : filteredByStatus;

  const sortedRequests = [...(filteredByQuery ?? [])].sort((a, b) => {
    if (sortKey === "name") {
      return String(a.name ?? "").localeCompare(String(b.name ?? ""), "fr");
    }
    if (sortKey === "status") {
      return String(a.status ?? "").localeCompare(String(b.status ?? ""), "fr");
    }
    const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
    return sortKey === "oldest" ? aDate - bDate : bDate - aDate;
  });

  const filteredCount = sortedRequests.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / perPage));
  const currentPage = Math.min(page, totalPages);
  const pagedRequests = sortedRequests.slice((currentPage - 1) * perPage, currentPage * perPage);

  const requestIds = (pagedRequests ?? []).map((r) => r.id);
  const { data: requestMessages } =
    requestIds.length > 0
      ? await supabase
          .from("request_messages")
          .select("id,request_id,sender,message,email_status,created_at")
          .in("request_id", requestIds)
          .order("created_at", { ascending: true })
      : { data: [] as RequestMessage[] };

  const messagesByRequestId: Record<string, RequestMessage[]> = {};
  for (const row of (requestMessages as RequestMessage[]) ?? []) {
    if (!messagesByRequestId[row.request_id]) {
      messagesByRequestId[row.request_id] = [];
    }
    messagesByRequestId[row.request_id].push(row);
  }

  const baseParams = new URLSearchParams();
  if (statusFilter) baseParams.set("status", statusFilter);
  if (searchQuery) baseParams.set("q", searchQuery);
  if (sortKey) baseParams.set("sort", sortKey);

  const adminEmail = auth.ok ? auth.user.email ?? "admin" : "admin";
  const adminInitial = adminEmail.slice(0, 1).toUpperCase();
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
  }).format(new Date());

  const items = (pagedRequests ?? []).map((req) => ({
    id: req.id,
    name: req.name,
    email: req.email,
    type: req.type,
    message: req.message,
    status: req.status as Status,
    payment_link: req.payment_link,
    created_at: req.created_at,
    created_date: req.created_at ? req.created_at.slice(0, 10) : null,
  }));

  return (
    <div className="admin-root">
      <Container className="py-12">
        <div className="admin-shell">
          <div className="admin-header">
            <div>
              <p className="admin-eyebrow">Hors Cadre Studio · Admin</p>
              <h1 className="admin-title">Demandes reçues</h1>
              <p className="admin-subtitle">
                {formattedDate} · Vue d&apos;ensemble des demandes et paiements.
              </p>
            </div>
            <div className="admin-actions">
              <div className="admin-profile">
                <div className="admin-avatar">{adminInitial}</div>
                <div className="admin-profile-meta">
                  <div className="admin-profile-role">Administratrice</div>
                  <div className="admin-profile-email">{adminEmail}</div>
                </div>
              </div>
              <a href="/admin/ux" className="admin-btn">
                Analytics UX
              </a>
              <LogoutButton />
            </div>
          </div>

          <div className="admin-kpis">
            <div className="admin-kpi">
              <div className="admin-kpi-label">Total</div>
              <div className="admin-kpi-value">{total}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">En attente</div>
              <div className="admin-kpi-value">{pending}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Discussion</div>
              <div className="admin-kpi-value">{discussion}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Acceptées</div>
              <div className="admin-kpi-value">{accepted}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Acompte payé</div>
              <div className="admin-kpi-value">{paidAcompte}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Solde demandé</div>
              <div className="admin-kpi-value">{pendingSolde}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Solde payé</div>
              <div className="admin-kpi-value">{paidSolde}</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Refusées</div>
              <div className="admin-kpi-value">{refused}</div>
            </div>
          </div>

          <p className="admin-meta">
            Résultats : {filteredCount} · Tri : {getSortLabel(sortKey)}
            {searchQuery ? ` · Recherche : "${searchQuery}"` : ""}
          </p>

          <div className="admin-filters mb-6">
            {[
              { key: null, label: "Tous" },
              { key: "pending", label: "En attente" },
              { key: "discussion", label: "Discussion" },
              { key: "accepted", label: "Acceptées" },
              { key: "paid_acompte", label: "Acompte payé" },
              { key: "pending_solde", label: "Solde demandé" },
              { key: "paid_solde", label: "Solde payé" },
              { key: "refused", label: "Refusées" },
            ].map((filter) => {
              const active = statusFilter === filter.key || (!filter.key && !statusFilter);
              return (
                <a
                  key={filter.label}
                  href={buildUrl(baseParams, { status: filter.key, page: "1" })}
                  className={`admin-chip ${active ? "admin-chip-active" : ""}`}
                >
                  {filter.label}
                </a>
              );
            })}
          </div>

          <AdminToolbar initialQuery={searchQuery} initialSort={sortKey} status={statusFilter} />

          {items.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-title">Aucune demande</div>
              <p className="text-sm text-[var(--text-muted)]">
                Essaie un autre filtre ou enlève la recherche.
              </p>
            </div>
          ) : (
            <AdminDashboard
              items={items}
              initialId={items[0]?.id}
              messagesByRequestId={messagesByRequestId}
              metrics={metrics}
            />
          )}

          <div className="flex items-center justify-between text-sm mt-8">
            <span className="text-[var(--text-muted)]">
              Page {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={buildUrl(baseParams, {
                  page: String(Math.max(1, currentPage - 1)),
                })}
                className={`underline ${
                  currentPage === 1 ? "pointer-events-none text-[var(--text-muted)]" : ""
                }`}
              >
                Précédent
              </a>
              <a
                href={buildUrl(baseParams, {
                  page: String(Math.min(totalPages, currentPage + 1)),
                })}
                className={`underline ${
                  currentPage === totalPages ? "pointer-events-none text-[var(--text-muted)]" : ""
                }`}
              >
                Suivant
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

