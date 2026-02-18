import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function updateRequestStatus(requestId: string, paymentType: "acompte" | "solde") {
  const supabase = createSupabaseServiceClient();
  const status = paymentType === "acompte" ? "paid_acompte" : "paid_solde";

  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", requestId);

  if (error) {
    console.error("[stripe] supabase update failed", error);
    return false;
  }

  return true;
}

export async function POST(req: Request) {
  console.log("[stripe] webhook received");
  if (!webhookSecret) {
    console.error("[stripe] missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe] signature verify failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    let requestId = session.metadata?.requestId ?? session.client_reference_id ?? undefined;
    let paymentType = session.metadata?.type ?? undefined;

    if ((!requestId || !paymentType) && session.payment_intent) {
      try {
        const pi = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );
        requestId = requestId ?? pi.metadata?.requestId;
        paymentType = paymentType ?? (pi.metadata?.type as string | undefined);
      } catch (err) {
        console.error("[stripe] payment_intent retrieve failed", err);
      }
    }

    console.log("[stripe] checkout.session.completed", {
      requestId,
      paymentType,
      sessionId: session.id,
    });

    if (requestId && (paymentType === "acompte" || paymentType === "solde")) {
      const ok = await updateRequestStatus(requestId, paymentType);
      if (!ok) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }
    } else {
      console.warn("[stripe] missing metadata for update", {
        requestId,
        paymentType,
      });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const requestId = pi.metadata?.requestId;
    const paymentType = pi.metadata?.type as "acompte" | "solde" | undefined;

    console.log("[stripe] payment_intent.succeeded", {
      requestId,
      paymentType,
      paymentIntentId: pi.id,
    });

    if (requestId && (paymentType === "acompte" || paymentType === "solde")) {
      const ok = await updateRequestStatus(requestId, paymentType);
      if (!ok) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
