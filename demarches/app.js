/* Mes Démarches Facile — logique de l'application (sans serveur, tout en local) */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lire = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
  const auj = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (iso) => iso ? new Date(iso + "T00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
  const euros = (n) => Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  const joursDepuis = (iso) => Math.floor((new Date(auj()) - new Date(iso)) / 864e5);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------- Navigation ---------- */
  document.querySelectorAll("nav.onglets button").forEach((b) => b.addEventListener("click", () => allerA(b.dataset.page)));
  function allerA(p) {
    document.querySelectorAll(".page").forEach((s) => s.classList.toggle("active", s.id === "page-" + p));
    document.querySelectorAll("nav.onglets button").forEach((b) => b.classList.toggle("active", b.dataset.page === p));
    window.scrollTo({ top: 0 });
    ecrire("mdf-page", p);
  }

  /* ---------- Démarches ---------- */
  let catOuverte = null;
  function carteDemarche(d) {
    return `<div class="carte"><h4>${esc(d.t)}</h4><p>${esc(d.d)}</p>
      ${d.p ? `<div class="astuce">💡 ${esc(d.p)}</div>` : ""}
      <div class="liens">${d.l.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">🔗 ${esc(n)}</a>`).join("")}
      <a class="btn sec" href="${SP_RECHERCHE}${encodeURIComponent(d.t)}" target="_blank" rel="noopener">📖 Fiche service-public</a></div></div>`;
  }
  function rendreDemarches() {
    const q = $("#rech-dem").value.trim().toLowerCase();
    const zone = $("#dem-contenu");
    if (q) {
      const res = [];
      CATEGORIES.forEach((c) => c.demarches.forEach((d) => {
        if ((d.t + " " + d.d + " " + c.nom).toLowerCase().includes(q)) res.push({ ...d, cat: c });
      }));
      zone.innerHTML = res.length
        ? res.map((d) => `<div class="org">${d.cat.icone} ${esc(d.cat.nom)}</div>` + carteDemarche(d)).join("")
        : `<div class="vide-msg">Aucune démarche trouvée.<br><a href="${SP_RECHERCHE}${encodeURIComponent(q)}" target="_blank" rel="noopener">Chercher « ${esc(q)} » sur service-public.gouv.fr</a></div>`;
      return;
    }
    if (catOuverte) {
      const c = CATEGORIES.find((x) => x.id === catOuverte);
      zone.innerHTML = `<button class="retour" id="dem-retour">‹ Toutes les catégories</button>
        <h3>${c.icone} ${esc(c.nom)}</h3>${c.demarches.map(carteDemarche).join("")}`;
      $("#dem-retour").addEventListener("click", () => { catOuverte = null; rendreDemarches(); });
      return;
    }
    zone.innerHTML = `<div class="grille-cat">${CATEGORIES.map((c) =>
      `<button class="cat" data-cat="${c.id}"><span class="ic">${c.icone}</span><b>${esc(c.nom)}</b><small>${c.demarches.length} démarches</small></button>`).join("")}</div>`;
    zone.querySelectorAll(".cat").forEach((b) => b.addEventListener("click", () => { catOuverte = b.dataset.cat; rendreDemarches(); }));
  }
  $("#rech-dem").addEventListener("input", rendreDemarches);

  /* ---------- Aides ---------- */
  let profils = new Set(lire("mdf-profils", []));
  function rendreAides() {
    $("#puces-profil").innerHTML = PROFILS.map(([id, n]) => `<button class="puce ${profils.has(id) ? "active" : ""}" data-p="${id}">${n}</button>`).join("");
    $("#puces-profil").querySelectorAll(".puce").forEach((b) => b.addEventListener("click", () => {
      profils.has(b.dataset.p) ? profils.delete(b.dataset.p) : profils.add(b.dataset.p);
      ecrire("mdf-profils", [...profils]); rendreAides();
    }));
    const liste = profils.size ? AIDES.filter((a) => a.profil.some((p) => profils.has(p))) : AIDES;
    $("#aides-contenu").innerHTML = liste.map((a) => `<div class="carte"><h4>${esc(a.t)}</h4><div class="org">${esc(a.o)}</div><p>${esc(a.d)}</p>
      <div class="liens"><a href="${esc(a.url)}" target="_blank" rel="noopener">🔗 Faire la demande</a></div></div>`).join("");
  }

  /* ---------- Astuces ---------- */
  let catAstuce = "recuperer";
  function rendreAstuces() {
    $("#puces-astuces").innerHTML = CAT_ASTUCES.map(([id, n]) => `<button class="puce ${catAstuce === id ? "active" : ""}" data-c="${id}">${n}</button>`).join("");
    $("#puces-astuces").querySelectorAll(".puce").forEach((b) => b.addEventListener("click", () => { catAstuce = b.dataset.c; rendreAstuces(); }));
    $("#astuces-contenu").innerHTML = ASTUCES.filter((a) => a.c === catAstuce).map((a) => `<div class="carte"><h4>${esc(a.t)}</h4><p>${esc(a.d)}</p>
      ${a.url ? `<div class="liens"><a href="${esc(a.url)}" target="_blank" rel="noopener">🔗 En savoir plus</a></div>` : ""}</div>`).join("");
  }

  /* ---------- Calendrier ---------- */
  let evts = lire("mdf-evts", []);
  let vue = new Date(); vue.setDate(1);
  let jourSel = auj();
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  // Occurrences d'un événement sur une date donnée (gère mensuel / annuel)
  function tombeLe(e, iso) {
    if (e.date === iso) return true;
    if (iso < e.date) return false;
    const [y, m, d] = iso.split("-").map(Number), [ey, em, ed] = e.date.split("-").map(Number);
    const dernier = new Date(y, m, 0).getDate();
    if (e.rep === "mensuel") return d === Math.min(ed, dernier);
    if (e.rep === "annuel") return m === em && d === Math.min(ed, dernier);
    return false;
  }
  const evtsDu = (iso) => evts.filter((e) => tombeLe(e, iso));

  function rendreCalendrier() {
    const y = vue.getFullYear(), m = vue.getMonth();
    $("#cal-titre").textContent = MOIS[m] + " " + y;
    const nbJ = new Date(y, m + 1, 0).getDate();
    const decal = (new Date(y, m, 1).getDay() + 6) % 7;
    let html = ["L", "M", "M", "J", "V", "S", "D"].map((j) => `<div class="jn">${j}</div>`).join("");
    for (let i = 0; i < decal; i++) html += `<div class="jour vide"></div>`;
    let entrees = 0, sorties = 0;
    for (let d = 1; d <= nbJ; d++) {
      const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const liste = evtsDu(iso);
      liste.forEach((e) => { const mt = Number(e.montant) || 0; if (e.type === "revenu") entrees += mt; else if (e.type === "prelevement" || e.type === "sortie") sorties += mt; });
      html += `<div class="jour ${iso === auj() ? "auj" : ""} ${iso === jourSel ? "sel" : ""}" data-d="${iso}"><span class="n">${d}</span>
        <div class="pts">${liste.slice(0, 6).map((e) => `<i class="pt t-${e.type}"></i>`).join("")}</div></div>`;
    }
    $("#cal-grille").innerHTML = html;
    $("#cal-grille").querySelectorAll(".jour[data-d]").forEach((j) => j.addEventListener("click", () => { jourSel = j.dataset.d; $("#ev-date").value = jourSel; rendreCalendrier(); }));
    $("#bilan").innerHTML = `<div><b style="color:var(--vert)">+${euros(entrees)}</b><small>Rentrées du mois</small></div>
      <div><b style="color:var(--rouge)">−${euros(sorties)}</b><small>Sorties + prélèvements</small></div>
      <div><b>${euros(entrees - sorties)}</b><small>Reste prévu</small></div>`;
    rendreJour();
  }
  function rendreJour() {
    $("#jour-titre").textContent = "📌 " + fmtDate(jourSel);
    const liste = evtsDu(jourSel);
    $("#jour-evts").innerHTML = liste.length ? liste.map((e) => {
      const mt = Number(e.montant) || 0;
      const cls = e.type === "revenu" ? "pos" : (e.type === "prelevement" || e.type === "sortie") ? "neg" : "";
      return `<div class="evt"><i class="pt t-${e.type}"></i><div><b>${esc(e.titre)}</b>${e.note ? `<small>${esc(e.note)}</small>` : ""}${e.rep ? `<small>🔁 ${e.rep === "mensuel" ? "tous les mois" : "tous les ans"}</small>` : ""}</div>
        ${mt ? `<span class="m ${cls}">${cls === "neg" ? "−" : cls === "pos" ? "+" : ""}${euros(mt)}</span>` : ""}
        <button class="x" data-id="${e.id}" title="Supprimer">✕</button></div>`;
    }).join("") : `<div class="vide-msg">Rien de prévu ce jour-là.</div>`;
    $("#jour-evts").querySelectorAll(".x").forEach((b) => b.addEventListener("click", () => {
      if (confirm("Supprimer cet événement (et ses répétitions) ?")) { evts = evts.filter((e) => e.id !== b.dataset.id); ecrire("mdf-evts", evts); rendreCalendrier(); }
    }));
  }
  $("#cal-prec").addEventListener("click", () => { vue.setMonth(vue.getMonth() - 1); rendreCalendrier(); });
  $("#cal-suiv").addEventListener("click", () => { vue.setMonth(vue.getMonth() + 1); rendreCalendrier(); });
  $("#ev-ajouter").addEventListener("click", () => {
    const titre = $("#ev-titre").value.trim(), date = $("#ev-date").value;
    if (!titre || !date) return alert("Indiquez au moins un titre et une date.");
    evts.push({ id: uid(), titre, date, type: $("#ev-type").value, montant: $("#ev-montant").value, rep: $("#ev-rep").value === "0" ? "" : $("#ev-rep").value, note: $("#ev-note").value.trim() });
    ecrire("mdf-evts", evts);
    $("#ev-titre").value = ""; $("#ev-montant").value = ""; $("#ev-note").value = "";
    jourSel = date; vue = new Date(date + "T00:00"); vue.setDate(1);
    rendreCalendrier();
  });
  $("#ev-reperes").addEventListener("click", () => {
    const y = new Date().getFullYear();
    let n = 0;
    DATES_REPERES.forEach((r) => {
      const date = `${y}-${String(r.mois + 1).padStart(2, "0")}-${String(r.jour).padStart(2, "0")}`;
      if (!evts.some((e) => e.repere === r.t)) { evts.push({ id: uid(), titre: r.t, date, type: r.type, rep: "annuel", note: "Date repère indicative, à vérifier", repere: r.t }); n++; }
    });
    ecrire("mdf-evts", evts); rendreCalendrier();
    alert(n ? n + " dates repères ajoutées (répétées chaque année)." : "Les dates repères sont déjà dans votre calendrier.");
  });
  $("#ev-ics").addEventListener("click", () => {
    const rrule = (e) => e.rep === "mensuel" ? "RRULE:FREQ=MONTHLY\n" : e.rep === "annuel" ? "RRULE:FREQ=YEARLY\n" : "";
    const ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Mes Demarches Facile//FR\n" + evts.map((e) =>
      `BEGIN:VEVENT\nUID:${e.id}@mesdemarches\nDTSTART;VALUE=DATE:${e.date.replace(/-/g, "")}\n${rrule(e)}SUMMARY:${e.titre.replace(/\n/g, " ")}${e.montant ? " (" + e.montant + " €)" : ""}\nDESCRIPTION:${(e.note || "").replace(/\n/g, " ")}\nEND:VEVENT`).join("\n") + "\nEND:VCALENDAR";
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "mon-calendrier.ics"; a.click();
  });

  /* ---------- Demandes (jamais honorées) ---------- */
  let demandes = lire("mdf-demandes", []);
  let filtreStatut = "encours";
  const STATUTS = { attente: ["En attente", "s-attente"], relance: ["Relancée", "s-relance"], litige: ["Litige / recours", "s-litige"], resolu: ["Résolue", "s-resolu"] };
  function statutAuto(d) {
    if (d.statut === "resolu") return "resolu";
    const faites = d.faites || [];
    if (faites.length >= 4) return "litige";
    if (faites.length >= 2) return "relance";
    return "attente";
  }
  function rendreDemandes() {
    const encours = demandes.filter((d) => d.statut !== "resolu");
    const tardives = encours.filter((d) => joursDepuis(d.date) >= 30);
    $("#alerte-demandes").innerHTML = tardives.length ? `<div class="alerte">⚠️ ${tardives.length} demande${tardives.length > 1 ? "s" : ""} sans réponse depuis plus de 30 jours : passez à l'étape suivante ci-dessous.</div>` : "";
    $("#puces-statut").innerHTML = [["encours", `⏳ En cours (${encours.length})`], ["resolu", `✅ Résolues (${demandes.length - encours.length})`]]
      .map(([id, n]) => `<button class="puce ${filtreStatut === id ? "active" : ""}" data-s="${id}">${n}</button>`).join("");
    $("#puces-statut").querySelectorAll(".puce").forEach((b) => b.addEventListener("click", () => { filtreStatut = b.dataset.s; rendreDemandes(); }));
    const liste = demandes.filter((d) => (filtreStatut === "resolu") === (d.statut === "resolu")).sort((a, b) => a.date.localeCompare(b.date));
    if (!liste.length) { $("#demandes-contenu").innerHTML = `<div class="vide-msg">${filtreStatut === "resolu" ? "Aucune demande résolue pour l'instant." : "Aucune demande en cours. Enregistrez votre première demande ci-dessous : l'appli vous rappellera quand relancer."}</div>`; return; }
    $("#demandes-contenu").innerHTML = liste.map((d) => {
      const j = joursDepuis(d.date), st = statutAuto(d), rec = RECOURS[d.type], faites = d.faites || [];
      let prochaine = rec.etapes.findIndex((e, i) => !faites.includes(i));
      return `<div class="carte" data-id="${d.id}"><h4>${esc(d.objet)} <span class="statut ${STATUTS[st][1]}">${STATUTS[st][0]}</span></h4>
        <div class="org">${esc(d.org)} · ${esc(rec.nom)}${d.ref ? " · réf. " + esc(d.ref) : ""}${d.montant ? " · " + euros(d.montant) : ""}</div>
        <div class="jours">Demande du ${fmtDate(d.date)} — <b>${j} jour${j > 1 ? "s" : ""}</b> écoulé${j > 1 ? "s" : ""}</div>
        ${d.note ? `<p><small>${esc(d.note)}</small></p>` : ""}
        ${d.statut !== "resolu" ? `<ul class="etapes">${rec.etapes.map((e, i) => {
          const faite = faites.includes(i), maintenant = !faite && i === prochaine && j >= e.apres;
          return `<li class="${faite ? "faite" : ""} ${maintenant ? "maintenant" : ""}"><b>${esc(e.t)}</b> <small>${e.apres ? "à partir de " + e.apres + " jours" : "dès maintenant"}${faite ? " — ✔ fait le " + fmtDate((d.dates || {})[i] || "") : ""}</small>${esc(e.d)}
            ${e.url ? ` <a href="${esc(e.url)}" target="_blank" rel="noopener">Lien</a>` : ""}
            ${!faite ? ` <button class="btn petit sec" data-etape="${i}">Marquer comme fait</button>` : ""}</li>`;
        }).join("")}</ul>
        <div class="actions">
          <button class="btn sec" data-courrier="relance">✉️ Lettre de relance</button>
          <button class="btn sec" data-courrier="miseendemeure">📮 Mise en demeure</button>
          <button class="btn sec" data-courrier="mediateur">⚖️ Saisir le médiateur</button>
          <button class="btn sec" data-cal="1">📅 Rappel dans 15 jours</button>
          <button class="btn vert" data-resolu="1">✅ Résolue</button>
          <button class="btn danger" data-suppr="1">🗑️</button>
        </div>` : `<div class="actions"><button class="btn sec" data-rouvrir="1">↩️ Rouvrir</button><button class="btn danger" data-suppr="1">🗑️ Supprimer</button></div>`}
      </div>`;
    }).join("");
    $("#demandes-contenu").querySelectorAll(".carte").forEach((c) => {
      const d = demandes.find((x) => x.id === c.dataset.id);
      c.querySelectorAll("[data-etape]").forEach((b) => b.addEventListener("click", () => {
        d.faites = [...(d.faites || []), Number(b.dataset.etape)]; d.dates = { ...(d.dates || {}), [b.dataset.etape]: auj() }; sauverDemandes();
      }));
      c.querySelectorAll("[data-courrier]").forEach((b) => b.addEventListener("click", () => ouvrirCourrier(d, b.dataset.courrier)));
      c.querySelector("[data-cal]")?.addEventListener("click", () => {
        const dt = new Date(); dt.setDate(dt.getDate() + 15);
        evts.push({ id: uid(), titre: "Relancer : " + d.objet, date: dt.toISOString().slice(0, 10), type: "demarche", note: d.org + (d.ref ? " – réf. " + d.ref : "") });
        ecrire("mdf-evts", evts); alert("Rappel ajouté au calendrier le " + fmtDate(dt.toISOString().slice(0, 10)) + ".");
      });
      c.querySelector("[data-resolu]")?.addEventListener("click", () => { d.statut = "resolu"; d.resoluLe = auj(); sauverDemandes(); });
      c.querySelector("[data-rouvrir]")?.addEventListener("click", () => { delete d.statut; sauverDemandes(); });
      c.querySelector("[data-suppr]")?.addEventListener("click", () => { if (confirm("Supprimer cette demande ?")) { demandes = demandes.filter((x) => x.id !== d.id); sauverDemandes(); } });
    });
  }
  function sauverDemandes() { ecrire("mdf-demandes", demandes); rendreDemandes(); }
  $("#dm-ajouter").addEventListener("click", () => {
    const objet = $("#dm-objet").value.trim(), org = $("#dm-org").value.trim(), date = $("#dm-date").value;
    if (!objet || !org || !date) return alert("Indiquez l'objet, l'organisme et la date de la demande.");
    demandes.push({ id: uid(), objet, org, date, type: $("#dm-type").value, ref: $("#dm-ref").value.trim(), montant: $("#dm-montant").value, note: $("#dm-note").value.trim(), faites: [] });
    ["#dm-objet", "#dm-org", "#dm-ref", "#dm-montant", "#dm-note"].forEach((s) => $(s).value = "");
    filtreStatut = "encours"; sauverDemandes();
  });

  /* Courriers */
  let courrierCourant = null;
  const identite = lire("mdf-identite", { nom: "", adresse: "" });
  function texteCourrier() {
    const { d, modele } = courrierCourant;
    const champs = { nom: $("#c-nom").value || "[Vos nom et prénom]", adresse: $("#c-adresse").value || "[Votre adresse]", organisme: d.org, objet: d.objet, reference: d.ref || "(aucune)", date: fmtDate(d.date), aujourdhui: fmtDate(auj()) };
    return MODELES[modele].replace(/\{(\w+)\}/g, (_, k) => champs[k] ?? "");
  }
  function ouvrirCourrier(d, modele) {
    courrierCourant = { d, modele };
    $("#dlg-titre").textContent = { relance: "✉️ Lettre de relance", miseendemeure: "📮 Mise en demeure (recommandé avec AR)", mediateur: "⚖️ Saisine du médiateur" }[modele];
    $("#c-nom").value = identite.nom; $("#c-adresse").value = identite.adresse;
    $("#c-texte").textContent = texteCourrier();
    $("#dlg-courrier").showModal();
  }
  ["#c-nom", "#c-adresse"].forEach((s) => $(s).addEventListener("input", () => {
    identite.nom = $("#c-nom").value; identite.adresse = $("#c-adresse").value; ecrire("mdf-identite", identite);
    $("#c-texte").textContent = texteCourrier();
  }));
  $("#c-fermer").addEventListener("click", () => $("#dlg-courrier").close());
  $("#c-copier").addEventListener("click", async () => { try { await navigator.clipboard.writeText($("#c-texte").textContent); alert("Courrier copié !"); } catch { alert("Sélectionnez le texte et copiez-le manuellement."); } });
  $("#c-imprimer").addEventListener("click", () => {
    const w = window.open("", "_blank"); w.document.write(`<pre style="font-family:serif;font-size:13pt;white-space:pre-wrap;padding:2cm">${esc($("#c-texte").textContent)}</pre>`); w.document.close(); w.print();
  });

  /* ---------- Démarrage ---------- */
  $("#ev-date").value = auj(); $("#dm-date").value = auj();
  rendreDemarches(); rendreAides(); rendreAstuces(); rendreCalendrier(); rendreDemandes();
  allerA(lire("mdf-page", "demarches"));
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => { });
})();
