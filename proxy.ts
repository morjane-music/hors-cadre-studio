import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function withRateLimitHeaders(response: NextResponse, result: ReturnType<typeof applyRateLimit>) {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("Retry-After", String(result.retryAfter));
  return response;
}

function resolveRule(pathname: string) {
  if (pathname === "/admin/login") {
    return { scope: "admin-login", limit: 25, windowMs: 10 * 60 * 1000 };
  }
  if (pathname === "/api/ux-events") {
    return { scope: "ux-events", limit: 80, windowMs: 60 * 1000 };
  }
  if (pathname.startsWith("/api/stripe/")) {
    return { scope: "stripe-api", limit: 40, windowMs: 60 * 1000 };
  }
  return null;
}

export function proxy(request: NextRequest) {
  const rule = resolveRule(request.nextUrl.pathname);
  if (!rule) return NextResponse.next();

  const key = `${rule.scope}:${getClientIp(request)}`;
  const result = applyRateLimit({
    key,
    limit: rule.limit,
    windowMs: rule.windowMs,
  });

  if (result.allowed) {
    return withRateLimitHeaders(NextResponse.next(), result);
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return withRateLimitHeaders(
      NextResponse.json(
        {
          error: "rate_limited",
          message: "Trop de requêtes. Réessaie dans quelques instants.",
        },
        { status: 429 }
      ),
      result
    );
  }

  return withRateLimitHeaders(
    new NextResponse("Trop de tentatives. Réessaie dans quelques instants.", {
      status: 429,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }),
    result
  );
}

export const config = {
  matcher: ["/admin/login", "/api/ux-events", "/api/stripe/:path*"],
};

