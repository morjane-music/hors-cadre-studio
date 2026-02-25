import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
const REQUEST_ID_REGEX =
  /\[REQ:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\]/i;
const UUID_REGEX = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

type InboundPayload = {
  type?: string;
  data?: {
    email_id?: string;
    from?: string | { email?: string };
    to?: string | string[] | { email?: string } | Array<{ email?: string }>;
    subject?: string;
    text?: string;
    html?: string;
    created_at?: string;
  };
};

type ResendInboundMessage = {
  from?: string | { email?: string };
  to?: string | string[] | { email?: string } | Array<{ email?: string }>;
  subject?: string;
  text?: string;
  html?: string;
};

function getHeader(request: Request, key: string) {
  return (
    request.headers.get(key) ??
    request.headers.get(`svix-${key}`) ??
    request.headers.get(`x-${key}`) ??
    ""
  );
}

function extractEmail(input: unknown): string | null {
  if (!input) return null;

  if (typeof input === "string") {
    const match = input.match(/<([^>]+)>/);
    const value = (match?.[1] ?? input).trim().toLowerCase();
    return value.includes("@") ? value : null;
  }

  if (Array.isArray(input)) {
    for (const item of input) {
      const email = extractEmail(item);
      if (email) return email;
    }
    return null;
  }

  if (typeof input === "object") {
    const maybeEmail = (input as { email?: string }).email;
    return extractEmail(maybeEmail ?? null);
  }

  return null;
}

function extractRequestIdFromText(value: string | null | undefined) {
  if (!value) return null;
  const tagged = value.match(REQUEST_ID_REGEX)?.[1];
  if (tagged) return tagged;
  const anyUuid = value.match(UUID_REGEX)?.[1];
  return anyUuid ?? null;
}

function extractRequestIdFromRecipient(recipientEmail: string | null) {
  if (!recipientEmail) return null;
  const localPart = recipientEmail.split("@")[0] ?? "";
  const plusChunk = localPart.includes("+") ? localPart.split("+").pop() : null;
  return extractRequestIdFromText(plusChunk);
}

async function fetchInboundMessage(emailId: string | undefined): Promise<ResendInboundMessage | null> {
  if (!emailId) return null;
  try {
    const result = await resend.emails.receiving.get(emailId);
    if ((result as { error?: unknown }).error) {
      return null;
    }
    return ((result as { data?: ResendInboundMessage | null }).data ?? null) as ResendInboundMessage | null;
  } catch {
    return null;
  }
}

async function resolveRequestId(input: {
  senderEmail: string | null;
  recipientEmail: string | null;
  subject: string;
  text: string;
}) {
  const fromSubject = extractRequestIdFromText(input.subject);
  if (fromSubject) return fromSubject;

  const fromRecipient = extractRequestIdFromRecipient(input.recipientEmail);
  if (fromRecipient) return fromRecipient;

  const fromBody = extractRequestIdFromText(input.text);
  if (fromBody) return fromBody;

  if (!input.senderEmail) return null;

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("requests")
    .select("id")
    .eq("email", input.senderEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "missing_webhook_secret" },
      { status: 500 }
    );
  }

  const payloadText = await request.text();
  const headers = {
    id: getHeader(request, "id"),
    timestamp: getHeader(request, "timestamp"),
    signature: getHeader(request, "signature"),
  };

  try {
    resend.webhooks.verify({
      payload: payloadText,
      headers,
      webhookSecret,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let payload: InboundPayload;
  try {
    payload = JSON.parse(payloadText) as InboundPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const eventType = payload.type ?? "";
  const allowedEvents = new Set(["email.received", "inbound_email.received"]);
  if (eventType && !allowedEvents.has(eventType)) {
    return NextResponse.json({ ok: true, skipped: "ignored_event_type" });
  }

  const inboundMessage = await fetchInboundMessage(payload.data?.email_id);
  const senderEmail = extractEmail(inboundMessage?.from ?? payload.data?.from);
  const recipientEmail = extractEmail(inboundMessage?.to ?? payload.data?.to);
  const subject = inboundMessage?.subject ?? payload.data?.subject ?? "";
  const message =
    inboundMessage?.text?.trim() ||
    payload.data?.text?.trim() ||
    inboundMessage?.html?.trim() ||
    payload.data?.html?.trim() ||
    "[Reponse client sans contenu texte exploitable]";

  const requestId = await resolveRequestId({
    senderEmail,
    recipientEmail,
    subject,
    text: message,
  });

  if (!requestId) {
    console.warn("[resend-inbound] unmatched_request", {
      eventType,
      senderEmail,
      recipientEmail,
      emailId: payload.data?.email_id ?? null,
      subject,
    });
    return NextResponse.json({ ok: true, skipped: "unmatched_request" });
  }

  const service = createSupabaseServiceClient();
  const { error } = await service.from("request_messages").insert({
    request_id: requestId,
    sender: "client",
    message,
    email_to: recipientEmail,
    email_status: "sent",
    resend_id: payload.data?.email_id ?? headers.id ?? null,
    error_message: null,
  });

  if (error) {
    console.error("[resend-inbound] insert_failed", error);
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
