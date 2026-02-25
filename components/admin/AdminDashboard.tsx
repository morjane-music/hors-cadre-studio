"use client";

import { useEffect, useMemo, useState } from "react";
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

type Props = {
  items: RequestItem[];
  initialId?: string;
  messagesByRequestId?: Record<string, RequestMessage[]>;
};

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

function isActionRequired(status: Status) {
  return (
    status === "pending" ||
    status === "discussion" ||
    status === "paid_acompte" ||
    status === "pending_solde"
  );
}

function isCustomOnlyType(type: string) {
  const value = (type || "").toLowerCase();
  return value.includes("sur mesure") || value.includes("kap num") || value.includes("personnalis");
}

function getNextStepText(status: Status, customOnly: boolean) {
  if (customOnly) {
    switch (status) {
      case "pending":
        return "Action : prolonger la discussion, refuser, ou creer un lien d'acompte personnalise.";
      case "discussion":
        return "Action : finaliser l'echange puis creer le lien d'acompte personnalise.";
      case "accepted":
        return "Acompte personnalise envoye. Attendre le paiement ou renvoyer un nouveau lien personnalise.";
      case "paid_acompte":
        return "Acompte paye. Creer maintenant le lien de solde personnalise.";
      case "pending_solde":
        return "Solde personnalise envoye. Attendre le paiement client.";
      case "paid_solde":
        return "Solde paye. Dossier finalise.";
      case "refused":
        return "Demande refusee. Aucun suivi requis.";
    }
  }

  switch (status) {
    case "pending":
      return "Decider maintenant : accepter, refuser, ou demander des precisions.";
    case "discussion":
      return "Discussion prolongee. Attendre le retour client, puis accepter ou refuser.";
    case "accepted":
      return "Acompte envoye. Attendre le paiement, ou regenerer le lien si besoin.";
    case "paid_acompte":
      return "Acompte paye. Demander le solde maintenant.";
    case "pending_solde":
      return "Solde demande. Attendre le paiement du solde.";
    case "paid_solde":
      return "Solde paye. Prestation finalisee.";
    case "refused":
      return "Demande refusee. Aucun suivi necessaire.";
  }
}

function getStepIndex(status: Status) {
  switch (status) {
    case "accepted":
      return 0;
    case "paid_acompte":
      return 1;
    case "pending_solde":
      return 2;
    case "paid_solde":
      return 3;
    default:
      return -1;
  }
}

function getProgressPercent(status: Status) {
  const step = getStepIndex(status);
  if (step < 0) return 0;
  return Math.round(((step + 1) / 4) * 100);
}

function getSenderLabel(sender: RequestMessage["sender"]) {
  switch (sender) {
    case "admin":
      return "Admin";
    case "client":
      return "Client";
    case "system":
      return "Systeme";
  }
}

export default function AdminDashboard({
  items,
  initialId,
  messagesByRequestId = {},
}: Props) {
  const router = useRouter();
  const initial = initialId ?? items[0]?.id;
  const [selectedId, setSelectedId] = useState<string | undefined>(initial);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId]
  );

  const customOnly = selected ? isCustomOnlyType(selected.type) : false;
  const selectedMessages = useMemo(() => {
    if (!selected) return [];
    const source = messagesByRequestId[selected.id] ?? [];
    return [...source].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      if (aTime !== bTime) return aTime - bTime;
      return a.id.localeCompare(b.id);
    });
  }, [messagesByRequestId, selected]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 20000);
    return () => window.clearInterval(interval);
  }, [router]);

  function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    router.refresh();
    window.setTimeout(() => setIsRefreshing(false), 500);
  }

  return (
    <div className="admin-layout">
      <div className="admin-list">
        <div className="admin-list-head">
          <span>Nom</span>
          <span>Statut</span>
          <span>Date</span>
        </div>
        <div role="listbox" className="admin-list-body">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === selected?.id}
              onClick={() => setSelectedId(item.id)}
              className={`admin-row ${item.id === selected?.id ? "admin-row-active" : ""}`}
            >
              <div className="admin-row-main">
                <div className="admin-row-name">{item.name || "-"}</div>
                <div className="admin-row-meta">
                  {item.type} · {item.email}
                </div>
              </div>
              <span className={getStatusClasses(item.status)}>{getStatusLabel(item.status)}</span>
              <span className="admin-row-date">{item.created_date ?? "-"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-detail">
        {!selected ? (
          <div className="admin-empty">
            <div className="admin-empty-title">Selectionne une demande</div>
            <p className="text-sm text-[var(--text-muted)]">
              Choisis un element dans la liste pour voir les details et agir.
            </p>
          </div>
        ) : (
          <div className="admin-detail-card">
            <div className="admin-detail-head">
              <div>
                <div className="admin-detail-name">{selected.name}</div>
                <div className="admin-detail-email">{selected.email}</div>
                <div className="admin-detail-id">ID : {selected.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={getStatusClasses(selected.status)}>{getStatusLabel(selected.status)}</span>
                <span className="admin-badge">
                  {customOnly ? "Paiement personnalise" : "Paiement standard"}
                </span>
                {(selected.status === "paid_acompte" || selected.status === "paid_solde") && (
                  <span className="admin-badge admin-status admin-status-paid-auto">
                    Paiement confirme automatiquement
                  </span>
                )}
                {selected.status === "accepted" && (
                  <span className="admin-badge admin-status admin-status-awaiting">
                    En attente de paiement
                  </span>
                )}
                <button
                  type="button"
                  className={`admin-btn ${isRefreshing ? "admin-btn-muted" : ""}`}
                  disabled={isRefreshing}
                  onClick={handleRefresh}
                >
                  {isRefreshing ? "Sync..." : "Sync"}
                </button>
              </div>
            </div>

            <div className="admin-next admin-next--action">
              <div className="admin-next-title">
                <span className="admin-next-icon" aria-hidden="true">
                  *
                </span>
                Ce qu&apos;il faut faire maintenant
                {isActionRequired(selected.status) ? (
                  <span className="admin-next-pill admin-next-pill-action">Action requise</span>
                ) : (
                  <span className="admin-next-pill">En attente</span>
                )}
              </div>
              <p className="admin-next-desc">{getNextStepText(selected.status, customOnly)}</p>
              <div className="admin-next-cta">
                {!customOnly && selected.status === "pending" && (
                  <>
                    <AcceptButton requestId={selected.id} type={selected.type} />
                    <ProlongDiscussionButton requestId={selected.id} />
                    <RefuseButton requestId={selected.id} />
                  </>
                )}
                {!customOnly && selected.status === "discussion" && (
                  <>
                    <AcceptButton requestId={selected.id} type={selected.type} />
                    <RefuseButton requestId={selected.id} />
                  </>
                )}
                {!customOnly && selected.status === "accepted" && (
                  <>
                    <RegenerateLinkButton requestId={selected.id} type={selected.type} />
                    <MarkAcomptePaidButton requestId={selected.id} />
                    <button type="button" disabled className="admin-btn admin-btn-muted">
                      Demander le solde (apres acompte)
                    </button>
                  </>
                )}
                {!customOnly && selected.status === "paid_acompte" && (
                  <RequestSoldeButton requestId={selected.id} type={selected.type} />
                )}
                {!customOnly && selected.status === "pending_solde" && (
                  <MarkSoldePaidButton requestId={selected.id} />
                )}

                {customOnly && (selected.status === "pending" || selected.status === "discussion") && (
                  <>
                    <CustomPaymentLinkButton requestId={selected.id} defaultType="acompte" />
                    <ProlongDiscussionButton requestId={selected.id} />
                    <RefuseButton requestId={selected.id} />
                  </>
                )}
                {customOnly && selected.status === "accepted" && (
                  <CustomPaymentLinkButton requestId={selected.id} defaultType="acompte" />
                )}
                {customOnly && selected.status === "paid_acompte" && (
                  <CustomPaymentLinkButton requestId={selected.id} defaultType="solde" />
                )}
                {customOnly && selected.status === "pending_solde" && (
                  <button type="button" disabled className="admin-btn admin-btn-muted">
                    Solde personnalise envoye (en attente)
                  </button>
                )}
                <DeleteRequestButton requestId={selected.id} />
              </div>
              {(selected.status === "accepted" || selected.status === "pending_solde") && (
                <p className="admin-helper-note">
                  Paiement Stripe synchronise automatiquement. Les boutons manuels restent un secours.
                </p>
              )}
            </div>

            <p className="admin-section-title">Timeline du paiement</p>
            <div className="text-xs text-[var(--text-muted)]">
              Progression : {getProgressPercent(selected.status)}%
            </div>
            <div className="admin-progress" aria-hidden="true">
              <div
                className="admin-progress-fill"
                style={{ width: `${getProgressPercent(selected.status)}%` }}
              />
            </div>
            <div className="admin-stepper">
              {["Acompte envoye", "Acompte paye", "Solde demande", "Solde paye"].map(
                (label, index) => {
                  const currentStep = getStepIndex(selected.status);
                  const isDone = currentStep >= index;
                  const isCurrent = currentStep === index;
                  const icon = isDone ? "OK" : isCurrent ? "..." : "o";
                  return (
                    <div
                      key={label}
                      className={`admin-step ${
                        isCurrent ? "admin-step-current" : isDone ? "admin-step-done" : ""
                      }`}
                    >
                      <div className="admin-step-index" aria-hidden="true">
                        {icon}
                      </div>
                      <div className="admin-step-label">{label}</div>
                    </div>
                  );
                }
              )}
            </div>

            <p className="admin-section-title">Historique discussion</p>
            {selectedMessages.length === 0 ? (
              <div className="admin-soft text-sm text-[var(--text-muted)]">
                Aucun message enregistre pour cette demande.
              </div>
            ) : (
              <div className="admin-soft space-y-3">
                {selectedMessages.map((m, idx) => (
                  <div key={m.id || `${selected.id}-${m.created_at}-${idx}`} className="border-b pb-2 last:border-b-0">
                    <div className="text-xs text-[var(--text-muted)] mb-1">
                      {getSenderLabel(m.sender)} · {new Date(m.created_at).toLocaleString("fr-FR")} ·
                      envoi : {m.email_status}
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{m.message}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="admin-soft text-sm">
              <p>
                <strong>Type :</strong> {selected.type}
              </p>
              <p>
                <strong>Message :</strong> {selected.message}
              </p>
            </div>

            {selected.payment_link && <PaymentLinkField link={selected.payment_link} />}
          </div>
        )}
      </div>
    </div>
  );
}
