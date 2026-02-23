"use client";

import { useMemo, useState } from "react";
import AcceptButton from "@/app/admin/AcceptButton";
import RegenerateLinkButton from "@/app/admin/RegenerateLinkButton";
import MarkAcomptePaidButton from "@/app/admin/MarkAcomptePaidButton";
import MarkSoldePaidButton from "@/app/admin/MarkSoldePaidButton";
import RefuseButton from "@/app/admin/RefuseButton";
import RequestSoldeButton from "@/app/admin/RequestSoldeButton";
import ProlongDiscussionButton from "@/app/admin/ProlongDiscussionButton";
import CustomPaymentLinkButton from "@/app/admin/CustomPaymentLinkButton";
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
      return "Acceptée";
    case "paid_acompte":
      return "Acompte payé";
    case "pending_solde":
      return "Solde demandé";
    case "paid_solde":
      return "Solde payé";
    case "refused":
      return "Refusée";
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
  return (
    value.includes("sur mesure") ||
    value.includes("kap num") ||
    value.includes("personnalis")
  );
}

function getNextStepText(status: Status, customOnly: boolean) {
  if (customOnly) {
    switch (status) {
      case "pending":
        return "Action : prolonger la discussion, refuser, ou créer un lien d'acompte personnalisé.";
      case "discussion":
        return "Action : finaliser l'échange puis créer le lien d'acompte personnalisé.";
      case "accepted":
        return "Acompte personnalisé envoyé. Attendre le paiement ou renvoyer un nouveau lien personnalisé.";
      case "paid_acompte":
        return "Acompte payé. Créer maintenant le lien de solde personnalisé.";
      case "pending_solde":
        return "Solde personnalisé envoyé. Attendre le paiement client.";
      case "paid_solde":
        return "Solde payé. Dossier finalisé.";
      case "refused":
        return "Demande refusée. Aucun suivi requis.";
    }
  }

  switch (status) {
    case "pending":
      return "Décider maintenant : accepter, refuser, ou demander des précisions.";
    case "discussion":
      return "Discussion prolongée. Attendre le retour client, puis accepter ou refuser.";
    case "accepted":
      return "Acompte envoyé. Attendre le paiement, ou régénérer le lien si besoin.";
    case "paid_acompte":
      return "Acompte payé. Demander le solde maintenant.";
    case "pending_solde":
      return "Solde demandé. Attendre le paiement du solde.";
    case "paid_solde":
      return "Solde payé. Prestation finalisée.";
    case "refused":
      return "Demande refusée. Aucun suivi nécessaire.";
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
      return "Système";
  }
}

export default function AdminDashboard({
  items,
  initialId,
  messagesByRequestId = {},
}: Props) {
  const initial = initialId ?? items[0]?.id;
  const [selectedId, setSelectedId] = useState<string | undefined>(initial);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId]
  );

  const customOnly = selected ? isCustomOnlyType(selected.type) : false;
  const selectedMessages = selected ? messagesByRequestId[selected.id] ?? [] : [];

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
            <div className="admin-empty-title">Sélectionne une demande</div>
            <p className="text-sm text-[var(--text-muted)]">
              Choisis un élément dans la liste pour voir les détails et agir.
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
                  {customOnly ? "Paiement personnalisé" : "Paiement standard"}
                </span>
                {selected.status === "accepted" && (
                  <span className="admin-badge admin-status admin-status-awaiting">
                    En attente de paiement
                  </span>
                )}
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
                      Demander le solde (après acompte)
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
                    Solde personnalisé envoyé (en attente)
                  </button>
                )}
              </div>
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
              {["Acompte envoyé", "Acompte payé", "Solde demandé", "Solde payé"].map(
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
                Aucun message enregistré pour cette demande.
              </div>
            ) : (
              <div className="admin-soft space-y-3">
                {selectedMessages.map((m, idx) => (
                  <div key={`${selected.id}-${m.created_at}-${idx}`} className="border-b pb-2 last:border-b-0">
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
