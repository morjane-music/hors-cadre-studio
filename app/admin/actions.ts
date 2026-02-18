"use server";

import { Resend } from "resend";
import Stripe from "stripe";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function createCheckoutSession({
  amount,
  requestId,
  type,
  label,
}: {
  amount: number;
  requestId: string;
  type: "acompte" | "solde";
  label: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    client_reference_id: requestId,
    payment_intent_data: {
      metadata: { requestId, type },
    },
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: label },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/merci`,
    cancel_url: `${baseUrl}/admin`,
    metadata: { requestId, type },
  });

  return session.url as string;
}

function getTotalPrice(type: string) {
  switch (type) {
    case "Site vitrine":
      return 1000;
    case "Identité visuelle":
      return 800;
    case "Affiche / flyer":
      return 300;
    default:
      return 500;
  }
}

async function assertAdmin() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    throw new Error("Unauthorized");
  }
}

export async function acceptAndCreateAcompte(requestId: string, type: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { data: request } = await supabase
    .from("requests")
    .select("email, name")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Demande introuvable");
  }

  const total = getTotalPrice(type);
  const acompte = Math.round(total * 0.4 * 100);

  const url = await createCheckoutSession({
    amount: acompte,
    requestId,
    type: "acompte",
    label: "Acompte de la prestation",
  });

  await supabase
    .from("requests")
    .update({
      status: "accepted",
      payment_link: url,
    })
    .eq("id", requestId);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: request.email,
    subject: "Votre demande a été acceptée",
    html: `
    <p>Bonjour ${request.name || ""},</p>

    <p>Votre demande a bien été acceptée.</p>

    <p>
      Pour lancer le travail, un acompte de <strong>40 %</strong> est demandé.
    </p>

    <p>
      <a href="${url}">Accéder au paiement de l'acompte</a>
    </p>

    <p>
      Le solde sera à régler une fois la prestation finalisée.
    </p>

    <p>
      À bientôt,<br />
      Hors Cadre Studio
    </p>
  `,
  });

  return url as string;
}

export async function regenerateAcompteLink(requestId: string, type: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { data: request } = await supabase
    .from("requests")
    .select("email, name")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Demande introuvable");
  }

  const total = getTotalPrice(type);
  const acompte = Math.round(total * 0.4 * 100);

  const url = await createCheckoutSession({
    amount: acompte,
    requestId,
    type: "acompte",
    label: "Acompte de la prestation",
  });

  await supabase
    .from("requests")
    .update({
      status: "accepted",
      payment_link: url,
    })
    .eq("id", requestId);

  return url as string;
}

export async function refuseRequest(requestId: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("requests")
    .update({ status: "refused" })
    .eq("id", requestId);

  if (error) {
    console.error("Erreur refus :", error);
    throw new Error("Impossible de refuser la demande");
  }
}

export async function prolongDiscussion(requestId: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { data: request } = await supabase
    .from("requests")
    .select("email, name")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Demande introuvable");
  }

  const { error } = await supabase
    .from("requests")
    .update({ status: "discussion" })
    .eq("id", requestId);

  if (error) {
    // Status "discussion" may not exist yet in some DBs.
    console.warn("Statut discussion non appliqué :", error);
  }

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: request.email,
    subject: "Complément d'informations pour votre demande",
    html: `
      <p>Bonjour ${request.name || ""},</p>
      <p>Merci pour votre demande.</p>
      <p>
        Nous avons besoin de quelques précisions pour bien orienter votre projet.
        Vous pouvez répondre directement à cet email avec les détails utiles.
      </p>
      <p>À bientôt,<br />Hors Cadre Studio</p>
    `,
  });
}

export async function sendDiscussionMessage(requestId: string, message: string) {
  await assertAdmin();

  const content = message.trim();
  if (!content) {
    throw new Error("Message vide");
  }

  const supabase = await createSupabaseServerClient();
  const { data: request } = await supabase
    .from("requests")
    .select("email, name")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Demande introuvable");
  }

  const { error } = await supabase
    .from("requests")
    .update({ status: "discussion" })
    .eq("id", requestId);

  if (error) {
    // Continue email flow even if status update fails on legacy constraints.
    console.warn("Statut discussion non appliqué :", error);
  }

  const safe = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: request.email,
    subject: "Message de suivi concernant votre demande",
    html: `
      <p>Bonjour ${request.name || ""},</p>
      <p>${safe}</p>
      <p>Vous pouvez répondre directement à cet email.</p>
      <p>À bientôt,<br />Hors Cadre Studio</p>
    `,
  });
}

export async function requestSolde(requestId: string, type: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const total = getTotalPrice(type);
  const solde = Math.round(total * 0.6 * 100);

  const { data: request } = await supabase
    .from("requests")
    .select("email, name")
    .eq("id", requestId)
    .single();

  if (!request) throw new Error("Demande introuvable");

  const url = await createCheckoutSession({
    amount: solde,
    requestId,
    type: "solde",
    label: "Solde de la prestation",
  });

  await supabase
    .from("requests")
    .update({ status: "pending_solde", payment_link: url })
    .eq("id", requestId);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: request.email,
    subject: "Solde de votre prestation",
    html: `
      <p>Bonjour ${request.name || ""},</p>
      <p>La prestation est finalisée.</p>
      <p><a href="${url}">Régler le solde (60 %)</a></p>
      <p>Merci pour votre confiance.</p>
    `,
  });

  return url;
}

export async function markAcomptePaid(requestId: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("requests")
    .update({ status: "paid_acompte" })
    .eq("id", requestId);

  if (error) {
    console.error("Erreur acompte payé :", error);
    throw new Error("Impossible de marquer l'acompte comme payé");
  }
}

export async function markSoldePaid(requestId: string) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("requests")
    .update({ status: "paid_solde" })
    .eq("id", requestId);

  if (error) {
    console.error("Erreur solde payé :", error);
    throw new Error("Impossible de marquer le solde comme payé");
  }
}

export async function createCustomPaymentLink(input: {
  requestId: string;
  amountEuros: number;
  paymentType: "acompte" | "solde";
  label?: string;
}) {
  await assertAdmin();

  const { requestId, amountEuros, paymentType, label } = input;
  const normalizedAmount = Number(amountEuros);
  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error("Montant invalide");
  }

  const amountCents = Math.round(normalizedAmount * 100);
  if (amountCents < 50) {
    throw new Error("Montant trop faible");
  }

  const supabase = await createSupabaseServerClient();
  const { data: request } = await supabase
    .from("requests")
    .select("email, name")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Demande introuvable");
  }

  const paymentLabel =
    label?.trim() ||
    (paymentType === "acompte"
      ? "Paiement d'acompte"
      : "Paiement du solde");

  const url = await createCheckoutSession({
    amount: amountCents,
    requestId,
    type: paymentType,
    label: paymentLabel,
  });

  await supabase
    .from("requests")
    .update({
      status: paymentType === "acompte" ? "accepted" : "pending_solde",
      payment_link: url,
    })
    .eq("id", requestId);

  const amountDisplay = normalizedAmount.toFixed(2).replace(".", ",");
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: request.email,
    subject:
      paymentType === "acompte"
        ? "Lien de paiement d'acompte"
        : "Lien de paiement du solde",
    html: `
      <p>Bonjour ${request.name || ""},</p>
      <p>Voici votre lien de paiement.</p>
      <p>Montant : <strong>${amountDisplay} €</strong></p>
      <p><a href="${url}">Accéder au paiement</a></p>
      <p>Merci,<br />Hors Cadre Studio</p>
    `,
  });

  return url;
}



