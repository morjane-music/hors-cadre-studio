"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SortKey = "newest" | "oldest" | "name" | "status";

type Props = {
  initialQuery: string;
  initialSort: SortKey;
  status?: string;
};

export default function AdminToolbar({ initialQuery, initialSort, status }: Props) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>(initialSort);

  const hasChanges = useMemo(() => {
    return query !== initialQuery || sort !== initialSort;
  }, [query, sort, initialQuery, initialSort]);

  function buildUrl(nextQuery: string, nextSort: SortKey) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    params.set("sort", nextSort);
    params.set("page", "1");
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  function applyFilters() {
    router.replace(buildUrl(query, sort));
    router.refresh();
  }

  function clearFilters() {
    setQuery("");
    setSort("newest");
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const qs = params.toString();
    router.replace(qs ? `/admin?${qs}` : "/admin");
    router.refresh();
  }

  return (
    <div className="admin-toolbar">
      <div className="admin-field flex-1 min-w-[240px]">
        <label className="admin-label">Recherche</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom, email, type, message..."
          className="admin-input w-full"
        />
      </div>

      <div className="admin-field">
        <label className="admin-label">Tri</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="admin-select"
        >
          <option value="newest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
          <option value="name">Nom (A → Z)</option>
          <option value="status">Statut</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={applyFilters}
          className="admin-btn"
        >
          Appliquer
        </button>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasChanges && !initialQuery}
          className={`admin-btn ${!hasChanges && !initialQuery ? "admin-btn-muted" : ""}`}
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="admin-btn"
        >
          Recharger
        </button>
      </div>
    </div>
  );
}
