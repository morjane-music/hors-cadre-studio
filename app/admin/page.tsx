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

  const total = requests?.length ?? 0;
  const pending = requests?.filter((r) => r.status === "pending").length ?? 0;
  const discussion = requests?.filter((r) => r.status === "discussion").length ?? 0;
  const accepted = requests?.filter((r) => r.status === "accepted").length ?? 0;
  const paidAcompte = requests?.filter((r) => r.status === "paid_acompte").length ?? 0;
  const pendingSolde = requests?.filter((r) => r.status === "pending_solde").length ?? 0;
  const paidSolde = requests?.filter((r) => r.status === "paid_solde").length ?? 0;
  const refused = requests?.filter((r) => r.status === "refused").length ?? 0;

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
  const pagedRequests = sortedRequests.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

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
                {formattedDate} · Vue d’ensemble des demandes et paiements.
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

          <AdminToolbar
            initialQuery={searchQuery}
            initialSort={sortKey}
            status={statusFilter}
          />

          {items.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-title">Aucune demande</div>
              <p className="text-sm text-[var(--text-muted)]">
                Essaie un autre filtre ou enlève la recherche.
              </p>
            </div>
          ) : (
            <AdminDashboard items={items} initialId={items[0]?.id} />
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
                className={`underline ${currentPage === 1 ? "pointer-events-none text-[var(--text-muted)]" : ""}`}
              >
                Précédent
              </a>
              <a
                href={buildUrl(baseParams, {
                  page: String(Math.min(totalPages, currentPage + 1)),
                })}
                className={`underline ${currentPage === totalPages ? "pointer-events-none text-[var(--text-muted)]" : ""}`}
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
