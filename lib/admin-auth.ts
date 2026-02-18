import { createSupabaseServerClient } from "@/lib/supabase-server";

export type AdminAuthResult =
  | {
      ok: true;
      user: { id: string; email?: string | null };
      admin: { id: string; role: string | null; active: boolean | null };
    }
  | { ok: false; status: 401 | 403 | 500; reason: string };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, status: 401, reason: "unauthenticated" };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, role, active")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (adminError) {
    return { ok: false, status: 500, reason: "admin_lookup_failed" };
  }

  if (!admin) {
    return { ok: false, status: 403, reason: "forbidden" };
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email },
    admin,
  };
}
