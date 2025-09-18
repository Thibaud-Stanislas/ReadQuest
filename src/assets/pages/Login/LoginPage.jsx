import { useState } from "react";
import "./Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Merci de renseigner votre e-mail et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Identifiants invalides");
      }

      window.location.href = "/accueil";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rq-auth">
      <div className="rq-auth-card">
        <h1 className="rq-logo">READQUEST</h1>
        <h2 className="rq-auth-title">Connexion</h2>

        <form onSubmit={handleSubmit} className="rq-auth-form" noValidate>
          <label className="rq-field">
            <span>Adresse e-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              autoComplete="email"
            />
          </label>

          <label className="rq-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="rq-link small rq-link-button"
              onClick={() => setShowForgot(true)}
            >
              Mot de passe oublié ?
            </button>
          </label>

          {error && <p className="rq-error" role="alert">{error}</p>}

          <button className="rq-btn rq-btn-gold" disabled={loading}>
            {loading ? "Connexion…" : "Connexion"}
          </button>
        </form>

        <p className="rq-auth-switch">
          Nouvel(le) aventurier(ère) ? <a className="rq-link" href="/signup">Créer un compte</a>
        </p>
      </div>

      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </main>
  );
}