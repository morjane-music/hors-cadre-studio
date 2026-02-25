"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AcceptButton from "@/app/admin/AcceptButton";
import RegenerateLinkButton from "@/app/admin/RegenerateLinkButton";
import MarkAcomptePaidButton from "@/app/admin/MarkAcomptePaidButton";
import MarkSoldePaidButton from "@/app/admin/MarkSoldePaidButton";
import RefuseButton from "@/app/admin/RefuseButton";
import RequestSoldeButton from "@/app/admin/RequestSoldeButton";
import ProlongDiscussionButton from "@/app/admin/ProlongDiscussionButton";
import CustomPaymentLinkButton from "@/app/admin/CustomPaymentLinkButton";
import DeleteRequestButton from "@/app/admin/DeleteRequestButton";
import PaymentLinkField from "@/components/admin/PaymentLinkField";

type Status =
  | "pending"
  | "discussion"
  | "accepted"
  | "paid_acompte"
  | "pending_solde"
  | "paid_solde"
  | "refused";

type RequestItem = {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: Status;
  payment_link?: string | null;
  created_at?: string | null;
  created_date?: string | null;
};

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

type SmartFilter = "all" | "urgent" | "late" | "follow";

type Props = {
  items: RequestItem[];
  initialId?: string;
  messagesByRequestId?: Record<string, RequestMessage[]>;
  metrics: Metrics;
};

type PipelineLane = {
  id: string;
  title: string;
  statuses: Status[];
};

type Command = {
  id: string;
  label: string;
};

const LANES: PipelineLane[] = [
  { id: "new", title: "Nouveau", statuses: ["pending"] },
  { id: "discussion", title: "Discussion", statuses: ["discussion"] },
  { id: "acompte", title: "Acompte", statuses: ["accepted", "paid_acompte"] },
  { id: "solde", title: "Solde", statuses: ["pending_solde"] },
  { id: "done", title: "Finalise", statuses: ["paid_solde", "refused"] },
];

const QUICK_COMMANDS: Command[] = [
  { id: "sync", label: "Synchroniser maintenant" },
  { id: "filter-urgent", label: "Filtre : Urgent" },
  { id: "filter-late", label: "Filtre : En retard" },
  { id: "filter-follow", label: "Filtre : A relancer" },
  { id: "filter-all", label: "Filtre : Tout" },
  { id: "accept", label: "Action : Accepter" },
  { id: "prolong", label: "Action : Prolonger discussion" },
  { id: "refuse", label: "Action : Refuser" },
  { id: "custom", label: "Action : Lien personnalise" },
  { id: "solde", label: "Action : Demander solde" },
];

function getStatusLabel(status: Status) {
  switch (status) {
    case "pending":
      return "En attente";
    case "discussion":
      return "Discussion";
    case "accepted":
      return "Acceptee";
    case "paid_acompte":
      return "Acompte paye";
    case "pending_solde":
      return "Solde demande";
    case "paid_solde":
      return "Solde paye";
    case "refused":
      return "Refusee";
  }
}

function getStatusClasses(status: Status) {
  switch (status) {
    case "pending":
      return "admin-badge admin-status admin-status-pending";
    case "discussion":
      return "admin-badge admin-status admin-status-discussion";
    case "accepted":
      return "admin-badge admin-status admin-status-accepted";
    case "paid_acompte":
      return "admin-badge admin-status admin-status-paid";
    case "pending_solde":
      return "admin-badge admin-status admin-status-pending-solde";
    case "paid_solde":
      return "admin-badge admin-status admin-status-paid-solde";
    case "refused":
      return "admin-badge admin-status admin-status-refused";
  }
}

function getMessageToneClass(sender: RequestMessage["sender"]) {
  switch (sender) {
    case "admin":
      return "admin-message admin-message-admin";
    case "client":
      return "admin-message admin-message-client";
    case "system":
      return "admin-message admin-message-system";
  }
}

function laneForStatus(status: Status) {
  return LANES.find((lane) => lane.statuses.includes(status))?.id ?? "new";
}

function isCustomOnlyType(type: string) {
  const value = (type || "").toLowerCase();
  return value.includes("sur mesure") || value.includes("kap num") || value.includes("personnalis");
}

function daysSince(date?: string | null) {
  if (!date) return 0;
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000));
}

function matchesSmartFilter(item: RequestItem, filter: SmartFilter) {
  const age = daysSince(item.created_at);
  if (filter === "urgent") {
    return (item.status === "pending" || item.status === "discussion") && age >= 3;
  }
  if (filter === "late") {
    return (item.status === "accepted" || item.status === "pending_solde") && age >= 7;
  }
  if (filter === "follow") {
    return (item.status === "discussion" || item.status === "accepted") && age >= 2;
  }
  return true;
}

function getNextStepText(status: Status, customOnly: boolean) {
  if (customOnly) {
    switch (status) {
      case "pending":
        return "Prolonger la discussion, refuser, ou creer un lien d'acompte personnalise.";
      case "discussion":
        return "Finaliser l'echange puis creer le lien d'acompte personnalise.";
      case "accepted":
        return "Acompte personnalise envoye. Attendre le paiement.";
      case "paid_acompte":
        return "Acompte paye. Creer le lien de solde personnalise.";
      case "pending_solde":
        return "Solde personnalise envoye. Attendre le paiement client.";
      case "paid_solde":
        return "Dossier finalise.";
      case "refused":
        return "Demande refusee.";
    }
  }

  switch (status) {
    case "pending":
      return "Accepter, refuser, ou demander des precisions.";
    case "discussion":
      return "Attendre le retour client puis accepter ou refuser.";
    case "accepted":
      return "Acompte envoye. Attendre le paiement.";
    case "paid_acompte":
      return "Acompte paye. Demander le solde.";
    case "pending_solde":
      return "Solde demande. Attendre le paiement.";
    case "paid_solde":
      return "Prestation finalisee.";
    case "refused":
      return "Demande refusee.";
  }
}

export default function AdminDashboard({
  items,
  initialId,
  messagesByRequestId = {},
  metrics,
}: Props) {
  const router = useRouter();
  const initial = initialId ?? items[0]?.id;
  const [selectedId, setSelectedId] = useState<string | undefined>(initial);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [smartFilter, setSmartFilter] = useState<SmartFilter>(() => {
    if (typeof window === "undefined") return "all";
    const saved = window.localStorage.getItem("admin-smart-filter");
    if (saved === "all" || saved === "urgent" || saved === "late" || saved === "follow") {
      return saved;
    }
    return "all";
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [localLaneOverrides, setLocalLaneOverrides] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const acceptRef = useRef<HTMLDivElement>(null);
  const prolongRef = useRef<HTMLDivElement>(null);
  const refuseRef = useRef<HTMLDivElement>(null);
  const customLinkRef = useRef<HTMLDivElement>(null);
  const soldeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.localStorage.setItem("admin-smart-filter", smartFilter);
  }, [smartFilter]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 20000);
    return () => window.clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((v) => !v);
        setPaletteQuery("");
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const filteredItems = useMemo(
    () => items.filter((item) => matchesSmartFilter(item, smartFilter)),
    [items, smartFilter]
  );

  const selected = useMemo(
    () => filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0],
    [filteredItems, selectedId]
  );

  const selectedMessages = useMemo(() => {
    if (!selected) return [];
    const source = messagesByRequestId[selected.id] ?? [];
    return [...source].sort((a, b) => {
      const at = new Date(a.created_at).getTime();
      const bt = new Date(b.created_at).getTime();
      if (at !== bt) return at - bt;
      return a.id.localeCompare(b.id);
    });
  }, [messagesByRequestId, selected]);

  const cardsByLane = useMemo(() => {
    const result: Record<string, RequestItem[]> = {};
    for (const lane of LANES) result[lane.id] = [];
    for (const item of filteredItems) {
      const lane = localLaneOverrides[item.id] ?? laneForStatus(item.status);
      if (!result[lane]) result[lane] = [];
      result[lane].push(item);
    }
    return result;
  }, [filteredItems, localLaneOverrides]);

  const sparkMax = Math.max(1, ...metrics.sparkline);

  const smartCounts = useMemo(
    () => ({
      all: items.length,
      urgent: items.filter((item) => matchesSmartFilter(item, "urgent")).length,
      late: items.filter((item) => matchesSmartFilter(item, "late")).length,
      follow: items.filter((item) => matchesSmartFilter(item, "follow")).length,
    }),
    [items]
  );

  const filteredCommands = useMemo(
    () =>
      QUICK_COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().includes(paletteQuery.trim().toLowerCase())
      ),
    [paletteQuery]
  );

  function clickInside(ref: React.RefObject<HTMLDivElement | null>) {
    const button = ref.current?.querySelector("button");
    if (button && !button.hasAttribute("disabled")) {
      button.click();
      setPaletteOpen(false);
    }
  }

  function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    router.refresh();
    setToast("Dashboard synchronise");
    window.setTimeout(() => setIsRefreshing(false), 550);
  }

  function runCommand(commandId: string) {
    if (commandId === "sync") {
      handleRefresh();
    } else if (commandId === "filter-urgent") {
      setSmartFilter("urgent");
    } else if (commandId === "filter-late") {
      setSmartFilter("late");
    } else if (commandId === "filter-follow") {
      setSmartFilter("follow");
    } else if (commandId === "filter-all") {
      setSmartFilter("all");
    } else if (commandId === "accept") {
      clickInside(acceptRef);
    } else if (commandId === "prolong") {
      clickInside(prolongRef);
    } else if (commandId === "refuse") {
      clickInside(refuseRef);
    } else if (commandId === "custom") {
      clickInside(customLinkRef);
    } else if (commandId === "solde") {
      clickInside(soldeRef);
    }
  }

  function handleDrop(laneId: string, requestId: string) {
    setLocalLaneOverrides((prev) => ({ ...prev, [requestId]: laneId }));
    setToast("Carte deplacee (vue locale)");
  }

  const customOnly = selected ? isCustomOnlyType(selected.type) : false;

  return (
    <div className={`admin-v2 ${isRefreshing ? "is-refreshing" : ""}`}>
      <div className="admin-v2-kpi-grid">
        <div className="admin-v2-kpi-card">
          <div className="admin-v2-kpi-title">CA du mois</div>
          <div className="admin-v2-kpi-value">{metrics.monthlyRevenue.toLocaleString("fr-FR")} €</div>
          <div className="admin-v2-sparkline">
            {metrics.sparkline.map((point, idx) => (
              <span
                key={`${idx}-${point}`}
                style={{ height: `${Math.max(14, Math.round((point / sparkMax) * 42))}px` }}
              />
            ))}
          </div>
        </div>
        <div className="admin-v2-kpi-card">
          <div className="admin-v2-kpi-title">Taux de conversion</div>
          <div className="admin-v2-kpi-value">{metrics.conversionRate}%</div>
          <div className="admin-v2-kpi-sub">Dossiers finalises / total</div>
        </div>
        <div className="admin-v2-kpi-card">
          <div className="admin-v2-kpi-title">Delai moyen de reponse</div>
          <div className="admin-v2-kpi-value">{metrics.avgResponseHours} h</div>
          <div className="admin-v2-kpi-sub">Premier message admin</div>
        </div>
        <div className="admin-v2-kpi-card">
          <div className="admin-v2-kpi-title">Dossiers actifs</div>
          <div className="admin-v2-kpi-value">{metrics.activeCount}</div>
          <div className="admin-v2-kpi-sub">Pending / Discussion / Paiement</div>
        </div>
      </div>

      <div className="admin-v2-topbar">
        <div className="admin-v2-smart-filters">
          {[
            { key: "all", label: "Tous", count: smartCounts.all },
            { key: "urgent", label: "Urgent", count: smartCounts.urgent },
            { key: "late", label: "En retard", count: smartCounts.late },
            { key: "follow", label: "A relancer", count: smartCounts.follow },
          ].map((chip) => (
            <button
              key={chip.key}
              type="button"
              className={`admin-chip ${smartFilter === chip.key ? "admin-chip-active" : ""}`}
              onClick={() => setSmartFilter(chip.key as SmartFilter)}
            >
              {chip.label} · {chip.count}
            </button>
          ))}
        </div>
        <div className="admin-v2-top-actions">
          <button type="button" className="admin-btn admin-btn-sync" onClick={() => setPaletteOpen(true)}>
            Ctrl/Cmd + K
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sync ${isRefreshing ? "admin-btn-muted" : ""}`}
            disabled={isRefreshing}
            onClick={handleRefresh}
          >
            {isRefreshing ? "Sync..." : "Sync"}
          </button>
        </div>
      </div>

      <div className="admin-v2-pipeline">
        {LANES.map((lane) => (
          <div
            key={lane.id}
            className="admin-v2-lane"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const requestId = e.dataTransfer.getData("text/request-id");
              if (requestId) handleDrop(lane.id, requestId);
            }}
          >
            <div className="admin-v2-lane-head">
              <span>{lane.title}</span>
              <span className="admin-badge">{(cardsByLane[lane.id] ?? []).length}</span>
            </div>
            <div className="admin-v2-lane-body">
              {(cardsByLane[lane.id] ?? []).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/request-id", item.id)}
                  className={`admin-v2-card ${selected?.id === item.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="admin-v2-card-title">{item.name || "Sans nom"}</div>
                  <div className="admin-v2-card-meta">{item.type}</div>
                  <div className="admin-v2-card-meta">{item.email}</div>
                  <span className={getStatusClasses(item.status)}>{getStatusLabel(item.status)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-v2-split">
        <section className="admin-v2-panel">
          {!selected ? (
            <div className="admin-empty">
              <div className="admin-empty-title">Aucune demande</div>
            </div>
          ) : (
            <>
              <div className="admin-v2-panel-head">
                <div>
                  <div className="admin-detail-name">{selected.name}</div>
                  <div className="admin-detail-email">{selected.email}</div>
                  <div className="admin-detail-id">ID : {selected.id}</div>
                </div>
                <div className="admin-status-row">
                  <span className={getStatusClasses(selected.status)}>{getStatusLabel(selected.status)}</span>
                  {(selected.status === "paid_acompte" || selected.status === "paid_solde") && (
                    <span className="admin-badge admin-status admin-status-paid-auto">
                      Paiement confirme automatiquement
                    </span>
                  )}
                </div>
              </div>

              <p className="admin-next-desc">{getNextStepText(selected.status, customOnly)}</p>

              <div className="admin-next-cta">
                {!customOnly && selected.status === "pending" && (
                  <>
                    <div ref={acceptRef}>
                      <AcceptButton requestId={selected.id} type={selected.type} />
                    </div>
                    <div ref={prolongRef}>
                      <ProlongDiscussionButton requestId={selected.id} />
                    </div>
                    <div ref={refuseRef}>
                      <RefuseButton requestId={selected.id} />
                    </div>
                  </>
                )}
                {!customOnly && selected.status === "discussion" && (
                  <>
                    <div ref={acceptRef}>
                      <AcceptButton requestId={selected.id} type={selected.type} />
                    </div>
                    <div ref={refuseRef}>
                      <RefuseButton requestId={selected.id} />
                    </div>
                  </>
                )}
                {!customOnly && selected.status === "accepted" && (
                  <>
                    <RegenerateLinkButton requestId={selected.id} type={selected.type} />
                    <MarkAcomptePaidButton requestId={selected.id} />
                  </>
                )}
                {!customOnly && selected.status === "paid_acompte" && (
                  <div ref={soldeRef}>
                    <RequestSoldeButton requestId={selected.id} type={selected.type} />
                  </div>
                )}
                {!customOnly && selected.status === "pending_solde" && (
                  <MarkSoldePaidButton requestId={selected.id} />
                )}
                {customOnly && (
                  <div ref={customLinkRef}>
                    <CustomPaymentLinkButton
                      requestId={selected.id}
                      defaultType={selected.status === "paid_acompte" ? "solde" : "acompte"}
                    />
                  </div>
                )}
                <DeleteRequestButton requestId={selected.id} />
              </div>

              <div className="admin-soft text-sm">
                <p>
                  <strong>Type :</strong> {selected.type}
                </p>
                <p>
                  <strong>Message :</strong> {selected.message}
                </p>
              </div>
              {selected.payment_link && <PaymentLinkField link={selected.payment_link} />}
            </>
          )}
        </section>

        <section className="admin-v2-panel">
          <div className="admin-section-title">Timeline premium</div>
          {selectedMessages.length === 0 ? (
            <div className="admin-soft text-sm text-[var(--text-muted)]">
              Aucun message enregistre pour cette demande.
            </div>
          ) : (
            <div className="admin-soft space-y-3">
              {selectedMessages.map((m) => (
                <article key={m.id} className={getMessageToneClass(m.sender)}>
                  <div className="admin-v2-message-head">
                    <span className="admin-badge">
                      {m.sender === "admin" ? "Email envoye" : m.sender === "client" ? "Reponse client" : "Evenement systeme"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(m.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{m.message}</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {paletteOpen && (
        <div className="admin-v2-palette-backdrop" onClick={() => setPaletteOpen(false)}>
          <div className="admin-v2-palette" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
              className="admin-input w-full"
              placeholder="Rechercher une action..."
            />
            <div className="admin-v2-palette-list">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  type="button"
                  className="admin-v2-palette-item"
                  onClick={() => {
                    runCommand(cmd.id);
                    setPaletteOpen(false);
                  }}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast ? <div className="admin-v2-toast">{toast}</div> : null}
    </div>
  );
}
