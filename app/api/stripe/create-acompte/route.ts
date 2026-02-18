import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAdmin } from "@/lib/admin-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { amount, requestId } = (payload ?? {}) as {
    amount?: unknown;
    requestId?: unknown;
  };

  const amountCents = Number(amount);
  const requestIdString = String(requestId ?? "");

  if (!Number.isFinite(amountCents) || !Number.isInteger(amountCents)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (amountCents < 50 || amountCents > 10_000_000) {
    return NextResponse.json({ error: "Amount out of range" }, { status: 400 });
  }
  if (!/^[0-9a-f-]{36}$/i.test(requestIdString)) {
    return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Acompte de la prestation",
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/merci`,
    cancel_url: `${baseUrl}/admin`,
    metadata: {
      requestId: requestIdString,
      type: "acompte",
    },
  });

  return NextResponse.json({ url: session.url });
}
