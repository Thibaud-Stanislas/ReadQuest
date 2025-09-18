import React from "react";
import "./accueil.css";
// Si tu utilises react-helmet-async pour le SEO, décommente :
// import { Helmet } from "react-helmet-async";
// Si tu utilises react-router-dom, tu peux remplacer <a> par <Link> :
// import { Link } from "react-router-dom";

// Images
import LivreIcon from "../../images/livre.png";
import AdoIcon from "../../images/ado.png";
import EcoleIcon from "../../images/ecole.png";
import AdulteIcon from "../../images/adulte.png";

export default function Accueil() {
  return (
    <main className="rq-home" id="content">
      {/* SEO / Partage */}
      {/* 
      <Helmet>
        <title>ReadQuest — La lecture devient une aventure RPG</title>
        <meta
          name="description"
          content="Progresse en lisant, gagne de l’XP, débloque des objets et des quêtes. Rejoins l’aventure ReadQuest."
        />
        <meta property="og:title" content="ReadQuest" />
        <meta property="og:description" content="La lecture devient une aventure RPG." />
        <meta property="og:image" content="/og-readquest.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      */}

      {/* HERO */}
      <section className="rq-hero" aria-labelledby="rq-hero-title">
        <h1 id="rq-hero-title" className="rq-title">READQUEST</h1>
        <p className="rq-subtitle">La lecture devient une aventure RPG</p>

        {/* Remplace <a> par <Link to="/signup"> si tu as react-router */}
        <a className="rq-cta" href="/signup">
          Rejoindre l’aventure
        </a>
      </section>

      {/* SECTION PRINCIPALE */}
      <section className="rq-main grid" aria-label="Présentation et nouveautés">
        {/* Qui suis-je */}
        <article className="rq-card rq-about" aria-labelledby="rq-about-title">
          <div className="rq-avatar" aria-hidden="true">{/* avatar plus tard */}</div>
          <div>
            <h2 id="rq-about-title">Qui suis‑je&nbsp;?</h2>
            <p>
              Un jour, je me suis demandé&nbsp;: et si lire devenait une aventure&nbsp;?
              ReadQuest est né de cette idée&nbsp;: transformer la lecture en un véritable
              jeu de rôle où chaque page te fait progresser, débloquer des objets
              et accomplir des quêtes.
            </p>
            <p>
              Mon but&nbsp;: redonner envie de lire grâce à une expérience ludique,
              motivante et accessible à tous — fans de fantasy, élèves, curieux…
            </p>
            <p className="rq-sign">— Stanislas</p>
          </div>
        </article>

        {/* Nouveautés */}
        <aside className="rq-card rq-news" aria-labelledby="rq-news-title">
          <h3 id="rq-news-title">Nouveautés ReadQuest</h3>
          <ul className="rq-list">
            <li>Nouvelle interface bibliothèque (À lire / En cours / Terminés) + XP + validation IA</li>
            <li>Progression RPG validée (objets, sorts, badges, historique de lectures)</li>
            <li>Prochaine étape&nbsp;: design de la première quête</li>
            <li>Sondage en cours sur le forum</li>
          </ul>
          <p className="rq-note">
            Lancement prévu&nbsp;: <strong>automne 2025</strong>
          </p>
        </aside>
      </section>

      {/* POUR QUI + ÉVÉNEMENT */}
      <section className="rq-audience-and-book grid" aria-label="Public et événement">
        <div className="rq-card rq-audience">
          <h3>Pour qui est ReadQuest&nbsp;?</h3>

          <div className="rq-audience-grid">
            <div className="rq-audience-item">
              <div className="icon">
                <img
                  src={LivreIcon}
                  alt="Lecteurs curieux"
                  loading="lazy"
                  width="80"
                  height="80"
                />
              </div>
              <p>Lecteurs curieux</p>
            </div>

            <div className="rq-audience-item">
              <div className="icon">
                <img
                  src={AdoIcon}
                  alt="Ados fans de RPG"
                  loading="lazy"
                  width="80"
                  height="80"
                />
              </div>
              <p>Ados fans de RPG</p>
            </div>

            <div className="rq-audience-item">
              <div className="icon">
                <img
                  src={EcoleIcon}
                  alt="Élèves à motiver"
                  loading="lazy"
                  width="80"
                  height="80"
                />
              </div>
              <p>Élèves à motiver</p>
            </div>

            <div className="rq-audience-item">
              <div className="icon">
                <img
                  src={AdulteIcon}
                  alt="Enseignants et parents"
                  loading="lazy"
                  width="80"
                  height="80"
                />
              </div>
              <p>Enseignants & parents</p>
            </div>
          </div>
        </div>

        <aside className="rq-card rq-event" aria-labelledby="rq-event-title">
          <h3 id="rq-event-title" className="rq-event-title">Événement à venir</h3>
          <div className="rq-event-body">
            <p className="rq-event-line">📅 Septembre — Live “démo bibliothèque”</p>
            <p className="rq-event-line">🎁 Giveaways&nbsp;: 3 accès bêta privés</p>
            <a className="rq-cta rq-cta--ghost" href="/signup">Être prévenu</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
