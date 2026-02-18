import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

let persistenceDisabled = false;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event?: string;
      payload?: Record<string, unknown>;
      path?: string;
      ts?: number;
    };

    const event = String(body?.event ?? "").trim().slice(0, 64);
    if (!event) {
      return NextResponse.json({ ok: false, error: "missing_event" }, { status: 400 });
    }

    const path = String(body.path ?? "unknown").slice(0, 180);
    const payload = body.payload ?? {};
    const occurredAt = new Date(body.ts ?? Date.now()).toISOString();
    const userAgent = request.headers.get("user-agent")?.slice(0, 250) ?? null;
    const referrer = request.headers.get("referer")?.slice(0, 250) ?? null;

    // Log local (dev) même si la persistance est indisponible.
    console.log("[ux-event]", { event, path, payload, ts: occurredAt });

    if (!persistenceDisabled && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createSupabaseServiceClient();
      const { error } = await supabase.from("ux_events").insert({
        event,
        path,
        payload,
        occurred_at: occurredAt,
        user_agent: userAgent,
        referrer,
      });

      if (error) {
        // Table absente / droits: on ne casse jamais le parcours front.
        if (error.code === "42P01" || error.code === "42501" || error.code === "42703") {
          persistenceDisabled = true;
        }
        console.error("[ux-event] persistence_failed", {
          code: error.code,
          message: error.message,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
}
