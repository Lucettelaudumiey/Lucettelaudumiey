/* ============================================================
   Le Bon Lien : fonctionnement
   Accueil (3 grandes demandes) → thème → liens officiels.
   Recherche par mots, avec ou sans accents, ou à la voix.
   La navigation passe par l'adresse (#…) : le bouton
   « retour » du téléphone fonctionne normalement.
   ============================================================ */

const vue = document.getElementById("vue");
const champ = document.getElementById("q");

/* ---------- Outils ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function norm(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
}
const demandeParId = id => DEMANDES.find(d => d.id === id);
const themeDe = (d, th) => (demandeParId(d) || { themes: [] }).themes.find(t => t.id === th);

/* Mots trop courants pour aider à trouver */
const MOTS_VIDES = new Set(("je j me m moi mon ma mes un une des de du d la le les l pour comment faire " +
  "veux voudrais vouloir cherche chercher recherche besoin demande demander obtenir avoir trouver " +
  "et ou en au aux a sur dans avec par est ce quoi qui que quel quelle quelles quels il elle on nous vous " +
  "lien liens site internet svp merci bonjour peux peut puis dois ne n pas ai plus mais si tres").split(" "));
/* Mots trop généraux : on les ignore s'il y a d'autres mots dans la demande */
const MOTS_FAIBLES = new Set(["aide", "aides", "aider"]);

/* ---------- Recherche ---------- */
const INDEX = LIENS.map(l => {
  const th = themeDe(l.d, l.th);
  return {
    lien: l,
    titre: norm(l.t).split(" "),
    cles: norm(l.k || "").split(" "),
    texte: norm(l.x + " " + (th ? th.nom : "") + " " + demandeParId(l.d).nom).split(" ")
  };
});

function correspond(mot, liste) {
  for (const m of liste) {
    if (!m) continue;
    if (m === mot) return 2;
    /* Début de mot commun (allocation / allocations), mais pas « pass » / « passeport » */
    const court = Math.min(m.length, mot.length), long = Math.max(m.length, mot.length);
    if (court >= 4 && court / long >= 0.6 && (m.startsWith(mot) || mot.startsWith(m))) return 1;
  }
  return 0;
}

function chercher(texte) {
  let mots = norm(texte).split(" ").filter(m => m && !MOTS_VIDES.has(m));
  if (!mots.length) mots = norm(texte).split(" ").filter(Boolean);
  if (!mots.length) return [];
  if (mots.some(m => !MOTS_FAIBLES.has(m))) mots = mots.filter(m => !MOTS_FAIBLES.has(m));
  const res = [];
  for (const e of INDEX) {
    let score = 0, trouves = 0;
    for (const mot of mots) {
      const s = correspond(mot, e.titre) * 3 + correspond(mot, e.cles) * 2 + correspond(mot, e.texte);
      if (s > 0) { score += s; trouves++; }
    }
    if (score > 0) res.push({ lien: e.lien, score: score + trouves * 6, trouves });
  }
  res.sort((a, b) => b.score - a.score);
  /* On garde ceux qui contiennent le plus de mots de la demande */
  const maxi = res.reduce((m, r) => Math.max(m, r.trouves), 0);
  const mini = maxi >= 3 ? maxi - 1 : maxi;
  return res.filter(r => r.trouves >= mini).slice(0, 12).map(r => r.lien);
}

/* ---------- Affichage d'un lien ---------- */
function carteLien(l, avecTheme) {
  const tel = l.url.startsWith("tel:");
  const d = demandeParId(l.d), th = themeDe(l.d, l.th);
  const cible = tel ? "" : ' target="_blank" rel="noopener noreferrer"';
  const bouton = tel ? "📞 Appeler" : "Ouvrir le site ↗";
  const etiquette = avecTheme && th ? `<span class="etiquette">${d.icone} ${esc(th.nom)}</span>` : "";
  return `<a class="lien" href="${esc(l.url)}"${cible}>
      ${etiquette}
      <span class="lien-titre">${esc(l.t)}</span>
      <span class="lien-texte">${esc(l.x)}</span>
      <span class="lien-bouton">${bouton}</span>
    </a>`;
}

function blocSecours(q) {
  const items = SECOURS.map(s => {
    const url = s.recherche ? sp(q || "") : s.url;
    const tel = url.startsWith("tel:");
    const cible = tel ? "" : ' target="_blank" rel="noopener noreferrer"';
    const titre = s.recherche && q ? `Chercher « ${esc(q)} » sur Service-Public.fr` : esc(s.t);
    return `<a class="lien secours-lien" href="${esc(url)}"${cible}>
        <span class="lien-titre">${titre}</span>
        <span class="lien-texte">${esc(s.x)}</span>
        <span class="lien-bouton">${tel ? "📞 Appeler" : "Ouvrir le site ↗"}</span>
      </a>`;
  }).join("");
  return `<section class="secours"><h3>Vous ne trouvez pas ? Toujours une solution :</h3><div class="liens">${items}</div></section>`;
}

/* ---------- Les vues ---------- */
const FREQUENTES = ["Carte d'identité", "Carte grise", "APL", "RSA", "Prime d'activité", "Chèque énergie",
  "Retraite", "Impôts", "Formulaire Cerfa", "France Services", "Mutuelle gratuite", "Arnaque"];

function vueAccueil() {
  const grands = DEMANDES.map(d => `
    <a class="grande-demande" href="#d=${d.id}">
      <span class="gd-icone" aria-hidden="true">${d.icone}</span>
      <span class="gd-texte"><b>${esc(d.nom)}</b><small>${esc(d.court)}</small></span>
      <span class="gd-fleche" aria-hidden="true">›</span>
    </a>`).join("");
  const puces = FREQUENTES.map(f => `<a class="puce" href="#q=${encodeURIComponent(f)}">${esc(f)}</a>`).join("");
  return `
    <h1 tabindex="-1">Que voulez-vous faire ?</h1>
    <p class="intro">Touchez votre demande. Le Bon Lien vous ouvre le bon site officiel.</p>
    <nav class="grandes">${grands}</nav>
    <h2>Les demandes les plus fréquentes</h2>
    <div class="puces">${puces}</div>`;
}

function vueDemande(d) {
  const themes = d.themes.map(t => {
    const n = LIENS.filter(l => l.d === d.id && l.th === t.id).length;
    return `<a class="theme" href="#d=${d.id}&t=${t.id}">
        <span class="theme-icone" aria-hidden="true">${t.icone}</span>
        <span class="theme-nom">${esc(t.nom)}</span>
        <span class="theme-nb">${n} lien${n > 1 ? "s" : ""}</span>
      </a>`;
  }).join("");
  return `
    <a class="retour" href="#">← Accueil</a>
    <h1 tabindex="-1">${d.icone} ${esc(d.nom)}</h1>
    <p class="intro">Choisissez le sujet de votre demande.</p>
    <nav class="themes">${themes}</nav>`;
}

function vueTheme(d, t) {
  const liens = LIENS.filter(l => l.d === d.id && l.th === t.id).map(l => carteLien(l, false)).join("");
  return `
    <a class="retour" href="#d=${d.id}">← ${esc(d.nom)}</a>
    <h1 tabindex="-1">${t.icone} ${esc(t.nom)}</h1>
    <p class="intro">${liens.includes('href="tel:') ? "Touchez un numéro : l'appel se lance." : "Touchez un lien : le site officiel s'ouvre."}</p>
    <div class="liens">${liens}</div>
    ${blocSecours(t.nom)}`;
}

function vueResultats(q) {
  const trouves = chercher(q);
  const liste = trouves.length
    ? `<p class="intro">${trouves.length} lien${trouves.length > 1 ? "s" : ""} pour « ${esc(q)} » :</p>
       <div class="liens">${trouves.map(l => carteLien(l, true)).join("")}</div>`
    : `<p class="intro">Aucun lien trouvé pour « ${esc(q)} ». Essayez un autre mot, ou utilisez une des solutions ci-dessous.</p>`;
  return `
    <a class="retour" href="#">← Accueil</a>
    <h1 tabindex="-1">🔎 Votre recherche</h1>
    ${liste}
    ${blocSecours(q)}`;
}

/* ---------- Navigation ---------- */
function lireAdresse() {
  const p = new URLSearchParams(location.hash.slice(1));
  return { d: p.get("d"), t: p.get("t"), q: p.get("q") };
}

function afficher() {
  const { d, t, q } = lireAdresse();
  const dem = d && demandeParId(d);
  const th = dem && t && dem.themes.find(x => x.id === t);
  if (q) { vue.innerHTML = vueResultats(q); if (champ.value !== q) champ.value = q; }
  else if (th) vue.innerHTML = vueTheme(dem, th);
  else if (dem) vue.innerHTML = vueDemande(dem);
  else { vue.innerHTML = vueAccueil(); champ.value = ""; }
  document.title = q ? `${q} · Le Bon Lien` : th ? `${th.nom} · Le Bon Lien` : dem ? `${dem.nom} · Le Bon Lien` : "Le Bon Lien";
  const titre = vue.querySelector("h1");
  if (afficher.dejaFait && titre) { titre.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  afficher.dejaFait = true;
}

document.getElementById("form-recherche").addEventListener("submit", e => {
  e.preventDefault();
  const q = champ.value.trim();
  if (!q) { champ.focus(); return; }
  champ.blur();
  location.hash = "q=" + encodeURIComponent(q);
});

window.addEventListener("hashchange", afficher);
afficher();

/* ---------- Recherche à la voix (si le navigateur le permet) ---------- */
(function () {
  const Reco = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reco) return;
  const bouton = document.getElementById("micro");
  const ecoute = document.getElementById("ecoute");
  bouton.hidden = false;
  let rec = null;
  bouton.addEventListener("click", () => {
    if (rec) { rec.stop(); return; }
    rec = new Reco();
    rec.lang = "fr-FR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = ev => {
      const dit = ev.results[0][0].transcript.trim();
      if (dit) { champ.value = dit; location.hash = "q=" + encodeURIComponent(dit); }
    };
    let erreur = false;
    rec.onend = () => { rec = null; if (!erreur) ecoute.hidden = true; bouton.classList.remove("actif"); };
    rec.onerror = () => { erreur = true; ecoute.textContent = "🎤 Je n'ai pas compris. Touchez le micro pour réessayer, ou écrivez votre demande."; };
    ecoute.textContent = "🎤 Je vous écoute… dites votre demande.";
    ecoute.hidden = false;
    bouton.classList.add("actif");
    try { rec.start(); } catch (e) { rec = null; ecoute.hidden = true; bouton.classList.remove("actif"); }
  });
})();
