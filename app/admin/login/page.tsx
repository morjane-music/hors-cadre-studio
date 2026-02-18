"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Mode = "login" | "forgot" | "reset";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      return "reset";
    }
    return "login";
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(() =>
    typeof window !== "undefined" && window.location.hash.includes("type=recovery")
      ? "Lien valide. Définis ton nouveau mot de passe."
      : null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Connexion impossible. Vérifie email et mot de passe.");
      return;
    }

    router.push("/admin");
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const redirectTo =
      typeof window === "undefined"
        ? undefined
        : `${window.location.origin}/admin/login`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );

    setLoading(false);

    if (resetError) {
      setError("Impossible d'envoyer l'email de réinitialisation.");
      return;
    }

    setMessage("Email envoyé. Vérifie ta boîte mail puis ouvre le lien.");
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setLoading(false);
      setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (updateError) {
      setError("Impossible de changer le mot de passe.");
      return;
    }

    setMessage("Mot de passe mis à jour. Tu peux maintenant te connecter.");
    setMode("login");
    setPassword("");
    setNewPassword("");
  }

  return (
    <Container>
      <h1 className="text-3xl mb-6">Connexion admin</h1>

      {mode === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-6 max-w-sm">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full border px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="border border-black px-6 py-3 hover:text-[var(--accent)] hover:border-[var(--accent)]"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError(null);
                setMessage(null);
              }}
              className="underline text-sm"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={handleForgotSubmit} className="space-y-6 max-w-sm">
          <p className="text-sm text-[var(--text-muted)]">
            Entre ton email admin. Un lien de réinitialisation sera envoyé.
          </p>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full border px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="border border-black px-6 py-3 hover:text-[var(--accent)] hover:border-[var(--accent)]"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setMessage(null);
              }}
              className="underline text-sm"
            >
              Retour connexion
            </button>
          </div>
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={handleResetSubmit} className="space-y-6 max-w-sm">
          <p className="text-sm text-[var(--text-muted)]">
            Choisis un nouveau mot de passe (8 caractères minimum).
          </p>
          <div>
            <label className="block text-sm mb-1">Nouveau mot de passe</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              minLength={8}
              required
              className="w-full border px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="border border-black px-6 py-3 hover:text-[var(--accent)] hover:border-[var(--accent)]"
          >
            {loading ? "Validation..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      {message && <p className="text-sm text-green-700 mt-4">{message}</p>}
    </Container>
  );
}
