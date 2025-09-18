import { useState, useEffect } from "react";
import "./Register.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Debug: vérifie que le .env est bien lu + ping l'API (/health)
  useEffect(() => {
    console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
    if (!import.meta.env.VITE_API_URL) {
      console.warn("[RegisterPage] VITE_API_URL manquant. Fallback ->", API_BASE);
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { credentials: "include" });
        const data = await res.json();
        console.log("[HEALTH]", data); // attendu: { ok: true, db: "...", user: "postgres" }
      } catch (e) {
        console.error("[HEALTH ERROR]", e);
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validations minimales
    if (!email || !password || !confirmPassword) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const payload = { email: email.trim(), password };
      if (pseudo.trim()) payload.pseudo = pseudo.trim();

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // pour le cookie JWT
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // corps non JSON → on ignore
      }

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Erreur lors de l'inscription (code ${res.status})`;
        throw new Error(msg);
      }

      setSuccess("Inscription réussie ! Redirection en cours…");

      // 👉 Version actuelle : redirection vers /login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

      /* 👉 Variante auto-login : va direct au dashboard
      // L’utilisateur est déjà connecté (cookie posé par le backend)
      const meRes = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
      const me = await meRes.json();
      if (me?.user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
      */
    } catch (err) {
      setError(err?.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rq-auth">
      <div className="rq-auth-card">
        <h1 className="rq-logo">READQUEST</h1>
        <h2 className="rq-auth-title">Inscription</h2>

        <form onSubmit={handleSubmit} className="rq-auth-form" noValidate>
          <label className="rq-field">
            <span>Adresse e-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              autoComplete="email"
              required
            />
          </label>

          <label className="rq-field">
            <span>Pseudo (optionnel)</span>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Pseudo (optionnel)"
            />
          </label>

          <label className="rq-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>

          <label className="rq-field">
            <span>Confirmer le mot de passe</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>

          {error && <p className="rq-error" role="alert">{error}</p>}
          {success && <p className="rq-success" role="alert">{success}</p>}

          <button type="submit" className="rq-btn rq-btn-gold" disabled={loading}>
            {loading ? "Inscription…" : "S'inscrire"}
          </button>
        </form>

        <p className="rq-auth-switch">
          Déjà un compte ? <a className="rq-link" href="/login">Se connecter</a>
        </p>
      </div>
    </main>
  );
}