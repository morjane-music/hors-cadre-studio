type MonitoringContext = {
  source: string;
  status?: number;
  metadata?: Record<string, unknown>;
};

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { message: String(error) };
}

async function sendLogtail(payload: Record<string, unknown>) {
  const token = process.env.LOGTAIL_SOURCE_TOKEN;
  if (!token) return;

  await fetch("https://in.logs.betterstack.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function sendWebhookAlert(payload: Record<string, unknown>) {
  const webhook = process.env.ALERT_WEBHOOK_URL;
  if (!webhook) return;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `[Hors Cadre] ${payload.source} a renvoyé une erreur serveur`,
      payload,
    }),
  });
}

async function sendSentry(error: unknown, context: MonitoringContext) {
  if (!process.env.SENTRY_DSN) return;

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      tags: {
        source: context.source,
      },
      extra: context.metadata,
    });
  } catch {
    // Sentry dependency not installed/configured: ignore.
  }
}

export async function reportServerError(error: unknown, context: MonitoringContext) {
  const serialized = serializeError(error);
  const payload = {
    level: "error",
    ts: new Date().toISOString(),
    source: context.source,
    status: context.status ?? 500,
    ...serialized,
    ...(context.metadata ?? {}),
  };

  console.error(`[monitoring] ${context.source}`, payload);

  const tasks = [sendLogtail(payload), sendWebhookAlert(payload), sendSentry(error, context)];
  await Promise.allSettled(tasks);
}

