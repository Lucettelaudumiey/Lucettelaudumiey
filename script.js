/* ============================================================
   Suivi Loto Bingo Lulu du 64
   Jeu de loto traditionnel français (numéros 1 à 90)
   © 2026 Lucette Laudumiey — propriété de Lucette Laudumiey.
   Tous droits réservés.
   ============================================================ */

"use strict";

/* ---------- Surnoms rigolos du loto ---------- */
const NICKNAMES = {
  1: "le p'tit premier", 2: "les deux tourterelles", 3: "le clocher",
  7: "le râteau", 8: "le bonhomme de neige", 9: "le pruneau d'Agen",
  10: "les commandements", 11: "les jambes de mémé", 12: "la douzaine",
  13: "ça porte bonheur !", 18: "la majorité", 21: "le bel âge",
  22: "v'là les flics", 25: "Noël", 30: "la trentaine",
  31: "le réveillon", 33: "les bougies de Lucette", 40: "les voleurs",
  44: "les bretelles", 45: "milieu de partie", 49: "le rugby (Section 64 !)",
  50: "le demi-siècle", 55: "les frites", 64: "notre beau département",
  66: "la nationale 7", 69: "l'année érotique", 75: "Paris",
  77: "les deux drapeaux", 80: "la retraite", 88: "les deux gros",
  90: "le grand-père"
};

/* ---------- État de la partie ---------- */
const state = {
  pool: [],        // numéros restants à tirer
  drawn: [],       // numéros déjà tirés (ordre)
  cartons: [],     // cartons générés
  event: { assoc: "", orga: "", date: "" }, // infos de la partie en cours
  auto: null       // timer du tirage auto
};

/* ---------- Plusieurs parties (suivi de plusieurs lotos) ---------- */
const PKEY = "loto64-parties";
function fullPool() { return Array.from({ length: 90 }, (_, i) => i + 1); }
function uid() { return "p" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }
function makeParty(name) {
  return { id: uid(), name: name || "Partie 1", drawn: [], pool: fullPool(),
           cartons: [], event: { assoc: "", orga: "", date: "" } };
}
let parties = [];
let currentId = null;
function currentParty() { return parties.find((p) => p.id === currentId) || parties[0]; }
// l'état de travail (state) pointe directement sur les tableaux de la partie
function stateFromParty(p) {
  if (!p.event) p.event = { assoc: "", orga: "", date: "" };
  state.drawn = p.drawn; state.pool = p.pool; state.cartons = p.cartons; state.event = p.event;
}
function syncStateToParty() {
  const p = currentParty(); if (!p) return;
  p.drawn = state.drawn; p.pool = state.pool; p.cartons = state.cartons; p.event = state.event;
}

/* ---------- Mode « écran de suivi » (deux écrans) ---------- */
// Une fenêtre ouverte avec ?ecran=suivi ne fait que refléter la partie en direct.
const FOLLOW = new URLSearchParams(location.search).get("ecran") === "suivi";

/* ---------- Raccourcis DOM ---------- */
const $ = (sel) => document.querySelector(sel);
const el = {
  ball: $("#currentBall"),
  label: $("#currentLabel"),
  drawBtn: $("#drawBtn"),
  autoBtn: $("#autoBtn"),
  resetBtn: $("#resetBtn"),
  voice: $("#voiceToggle"),
  nick: $("#nicknameToggle"),
  speed: $("#speedSelect"),
  countDrawn: $("#countDrawn"),
  countLeft: $("#countLeft"),
  history: $("#history"),
  board: $("#board"),
  cartons: $("#cartons"),
  cartonCount: $("#cartonCount"),
  genBtn: $("#genCartonsBtn"),
  importBtn: $("#importBtn"),
  csvImport: $("#csvImport"),
  addPlaqueBtn: $("#addPlaqueBtn"),
  downloadBtn: $("#downloadBtn"),
  csvBtn: $("#csvBtn"),
  printBtn: $("#printBtn"),
  screenBtn: $("#screenBtn"),
  plaqueModal: $("#plaqueModal"),
  pmName: $("#pmName"),
  pmRow1: $("#pmRow1"),
  pmRow2: $("#pmRow2"),
  pmRow3: $("#pmRow3"),
  pmError: $("#pmError"),
  pmCancel: $("#pmCancel"),
  pmSave: $("#pmSave"),
  winBanner: $("#winBanner"),
  winTitle: $("#winTitle"),
  winList: $("#winList"),
  winClose: $("#winClose"),
  followBar: $("#followBar"),
  followLast: $("#followLast"),
  followCount: $("#followCount"),
  aboutBtn: $("#aboutBtn"),
  aboutModal: $("#aboutModal"),
  aboutClose: $("#aboutClose"),
  themeBtn: $("#themeBtn"),
  themeBtnTop: $("#themeBtnTop"),
  themeModal: $("#themeModal"),
  themePresets: $("#themePresets"),
  accentPick: $("#accentPick"),
  bgPick: $("#bgPick"),
  themeReset: $("#themeReset"),
  themeClose: $("#themeClose"),
  winNewGame: $("#winNewGame"),
  resetAllBtn: $("#resetAllBtn"),
  partySelect: $("#partySelect"),
  partyNew: $("#partyNew"),
  partyDup: $("#partyDup"),
  partyDel: $("#partyDel"),
  eventInfo: $("#eventInfo"),
  eventBtn: $("#eventBtn"),
  eventModal: $("#eventModal"),
  evPartie: $("#evPartie"),
  evAssoc: $("#evAssoc"),
  evOrga: $("#evOrga"),
  evDate: $("#evDate"),
  eventClear: $("#eventClear"),
  eventClose: $("#eventClose"),
  lockScreen: $("#lockScreen"),
  lockName: $("#lockName"),
  lockCode: $("#lockCode"),
  lockError: $("#lockError"),
  lockGo: $("#lockGo"),
  lockOwnerLink: $("#lockOwnerLink"),
  ownerPanel: $("#ownerPanel"),
  ownerPwd: $("#ownerPwd"),
  ownerGo: $("#ownerGo"),
  ownerTools: $("#ownerTools"),
  genName: $("#genName"),
  genGo: $("#genGo"),
  genResult: $("#genResult"),
  ownerUnlock: $("#ownerUnlock")
};

/* ============================================================
   TABLEAU DES 90 NUMÉROS
   ============================================================ */
function buildBoard() {
  el.board.innerHTML = "";
  for (let n = 1; n <= 90; n++) {
    const c = document.createElement("div");
    c.className = "cell";
    c.dataset.n = n;
    c.textContent = n;
    // sur l'écran de suivi, le tableau est en lecture seule
    if (!FOLLOW) c.addEventListener("click", () => toggleMark(n));
    el.board.appendChild(c);
  }
}

// Pointe (ou retire) un numéro à la main — pour suivre un loto annoncé par autrui
function toggleMark(n) {
  const i = state.drawn.indexOf(n);
  if (i >= 0) {
    state.drawn.splice(i, 1);
    if (!state.pool.includes(n)) state.pool.push(n);
  } else {
    state.drawn.push(n);
    const p = state.pool.indexOf(n);
    if (p >= 0) state.pool.splice(p, 1);
    // petite boule + libellé comme pour un tirage
    el.ball.classList.remove("empty", "pop");
    void el.ball.offsetWidth;
    el.ball.classList.add("pop");
    el.ball.textContent = n;
    const nick = el.nick.checked && NICKNAMES[n] ? ` — ${NICKNAMES[n]}` : "";
    el.label.textContent = `Le ${n}${nick}`;
  }
  refreshHeadline();
  updateStats();
  refreshBoard();
  markCartons();
}

function refreshBoard() {
  document.querySelectorAll(".cell").forEach((c) => {
    const n = Number(c.dataset.n);
    c.classList.toggle("hit", state.drawn.includes(n));
    c.classList.toggle("latest", n === state.drawn[state.drawn.length - 1]);
  });
}

/* ============================================================
   TIRAGE
   ============================================================ */
function resetPool() {
  state.pool = Array.from({ length: 90 }, (_, i) => i + 1);
  state.drawn = [];
}

function drawNumber() {
  if (state.pool.length === 0) {
    el.label.textContent = "🎊 Tous les numéros sont sortis !";
    stopAuto();
    return;
  }
  const idx = Math.floor(Math.random() * state.pool.length);
  const n = state.pool.splice(idx, 1)[0];
  state.drawn.push(n);

  // Animation de la boule
  el.ball.classList.remove("empty", "pop");
  void el.ball.offsetWidth; // relance l'animation
  el.ball.classList.add("pop");
  el.ball.textContent = n;

  const nick = el.nick.checked && NICKNAMES[n] ? ` — ${NICKNAMES[n]}` : "";
  el.label.textContent = `Le ${n}${nick}`;

  announce(n, NICKNAMES[n]);
  updateStats();
  refreshBoard();
  pushHistory(n);
  markCartons();
}

function pushHistory(n) {
  const last = state.drawn.slice(-6).reverse();
  el.history.innerHTML = "";
  last.forEach((num, i) => {
    const b = document.createElement("div");
    b.className = "ball";
    if (i === 0) b.classList.add("latest");
    b.textContent = num;
    el.history.appendChild(b);
  });
}

function updateStats() {
  el.countDrawn.textContent = state.drawn.length;
  el.countLeft.textContent = state.pool.length;
  el.drawBtn.disabled = state.pool.length === 0;
}

/* ---------- Annonce vocale (français) ---------- */
function announce(n, nick) {
  if (FOLLOW || !el.voice.checked || !("speechSynthesis" in window)) return;
  const phrase = nick ? `${n}, ${nick}` : `${n}`;
  const u = new SpeechSynthesisUtterance(phrase);
  u.lang = "fr-FR";
  u.rate = 0.95;
  const fr = speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
  if (fr) u.voice = fr;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* ---------- Tirage automatique ---------- */
function toggleAuto() {
  if (state.auto) {
    stopAuto();
  } else {
    drawNumber();
    state.auto = setInterval(drawNumber, Number(el.speed.value));
    el.autoBtn.textContent = "⏸ Pause";
  }
}
function stopAuto() {
  clearInterval(state.auto);
  state.auto = null;
  el.autoBtn.textContent = "▶︎ Tirage auto";
}

/* ---------- Nouvelle partie ---------- */
function newGame() {
  stopAuto();
  resetPool();
  el.ball.classList.add("empty");
  el.ball.textContent = "--";
  el.label.textContent = "Prêt à jouer ?";
  el.history.innerHTML = "";
  updateStats();
  refreshBoard();
  // on garde les cartons mais on remet les marquages à zéro
  state.cartons.forEach((c) => (c.achieved = "none"));
  renderCartons();
  save();
}

/* ============================================================
   GÉNÉRATION DES CARTONS (3 lignes × 9 colonnes, 15 numéros)
   ============================================================ */
function columnRange(j) {
  if (j === 0) return [1, 9];
  if (j === 8) return [80, 90];
  return [j * 10, j * 10 + 9];
}

// Tirage des effectifs par colonne : 9 colonnes, chacune 1 à 3, total 15
function columnCounts() {
  const counts = Array(9).fill(1); // chaque colonne au moins un numéro
  let remaining = 15 - 9;          // 6 à répartir
  while (remaining > 0) {
    const j = Math.floor(Math.random() * 9);
    if (counts[j] < 3) {
      counts[j]++;
      remaining--;
    }
  }
  return counts;
}

// Matrice 3×9 : 1 = case occupée. Chaque ligne = 5, chaque colonne = counts[j]
function fillMatrix(counts) {
  for (let attempt = 0; attempt < 500; attempt++) {
    const m = [Array(9).fill(0), Array(9).fill(0), Array(9).fill(0)];
    const rowLeft = [5, 5, 5];
    let ok = true;

    // colonnes traitées des plus chargées aux moins chargées
    const order = [...Array(9).keys()].sort((a, b) => counts[b] - counts[a]);
    for (const j of order) {
      // lignes candidates avec de la place, mélangées et triées par place restante
      const rows = [0, 1, 2]
        .filter((r) => rowLeft[r] > 0)
        .sort(() => Math.random() - 0.5)
        .sort((a, b) => rowLeft[b] - rowLeft[a]);
      if (rows.length < counts[j]) { ok = false; break; }
      for (let k = 0; k < counts[j]; k++) {
        const r = rows[k];
        m[r][j] = 1;
        rowLeft[r]--;
      }
    }
    if (ok && rowLeft.every((x) => x === 0)) return m;
  }
  return null; // extrêmement rare
}

function makeCarton(id) {
  let matrix = null;
  while (!matrix) matrix = fillMatrix(columnCounts());

  // pour chaque colonne, tire les numéros nécessaires et les place de haut en bas
  const grid = [Array(9).fill(null), Array(9).fill(null), Array(9).fill(null)];
  for (let j = 0; j < 9; j++) {
    const need = matrix[0][j] + matrix[1][j] + matrix[2][j];
    const [lo, hi] = columnRange(j);
    const all = [];
    for (let v = lo; v <= hi; v++) all.push(v);
    // mélange et garde "need" numéros, triés
    for (let i = all.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      [all[i], all[k]] = [all[k], all[i]];
    }
    const picked = all.slice(0, need).sort((a, b) => a - b);
    let p = 0;
    for (let r = 0; r < 3; r++) {
      if (matrix[r][j]) grid[r][j] = picked[p++];
    }
  }
  return { id, grid, achieved: "none", name: "" };
}

function generateCartons() {
  const n = Math.min(24, Math.max(1, Number(el.cartonCount.value) || 1));
  state.cartons = [];
  for (let i = 1; i <= n; i++) state.cartons.push(makeCarton(i));
  renderCartons();
  markCartons(true); // applique l'état courant sans bannière
  if (currentView === "regie") requestAnimationFrame(fitRegie);
  save();
}

function renderCartons() {
  el.cartons.innerHTML = "";
  state.cartons.forEach((c) => el.cartons.appendChild(cartonNode(c)));
}

/* ---------- Saisie manuelle d'une plaque achetée ---------- */
function openPlaqueModal() {
  el.pmName.value = "";
  el.pmRow1.value = el.pmRow2.value = el.pmRow3.value = "";
  el.pmError.textContent = "";
  el.plaqueModal.hidden = false;
  el.pmRow1.focus();
}
function closePlaqueModal() { el.plaqueModal.hidden = true; }

// extrait les nombres 1..90 d'une chaîne saisie
function parseRow(str) {
  return (str.match(/\d+/g) || []).map(Number).filter((n) => n >= 1 && n <= 90);
}

// place 5 numéros dans une ligne 9 colonnes (colonne = dizaine)
function rowToCells(nums) {
  const cells = Array(9).fill(null);
  for (const n of nums) {
    const col = Math.min(8, Math.floor(n / 10));
    if (cells[col] !== null) return null; // deux numéros dans la même colonne : impossible
    cells[col] = n;
  }
  return cells;
}

function savePlaque() {
  const rows = [parseRow(el.pmRow1.value), parseRow(el.pmRow2.value), parseRow(el.pmRow3.value)];
  const all = rows.flat();

  if (rows.some((r) => r.length !== 5)) {
    el.pmError.textContent = "Chaque ligne doit contenir exactement 5 numéros.";
    return;
  }
  if (new Set(all).size !== 15) {
    el.pmError.textContent = "Un numéro est en double sur la plaque.";
    return;
  }
  const grid = rows.map(rowToCells);
  if (grid.some((g) => g === null)) {
    el.pmError.textContent = "Deux numéros de la même dizaine sur une ligne : vérifiez la saisie.";
    return;
  }

  const id = state.cartons.reduce((m, c) => Math.max(m, c.id), 0) + 1;
  state.cartons.push({ id, grid, achieved: "none", name: el.pmName.value.trim() });
  renderCartons();
  markCartons(true);
  if (currentView === "regie") requestAnimationFrame(fitRegie);
  save();
  closePlaqueModal();
}

/* ---------- Import d'une planche CommuPass (fichier CSV) ----------
   Format d'une ligne :
   N°851597 - BINGO LOTO - Planche N°71633,4294198070,33-48-50-...-88-
   -> le dernier champ = 15 numéros (3 lignes de 5) séparés par des tirets */
function importCommupassText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const addedCartons = [];
  let skipped = 0;
  let nextId = state.cartons.reduce((m, c) => Math.max(m, c.id), 0) + 1;

  lines.forEach((line) => {
    const parts = line.split(",").map((s) => s.trim());
    // le champ des numéros ne contient que des chiffres et des tirets
    const numField = parts.find((p) => p.includes("-") && /^[0-9\s-]+$/.test(p));
    if (!numField) { skipped++; return; }
    const nums = (numField.match(/\d+/g) || []).map(Number).filter((n) => n >= 1 && n <= 90);
    if (nums.length !== 15 || new Set(nums).size !== 15) { skipped++; return; }

    const rows = [nums.slice(0, 5), nums.slice(5, 10), nums.slice(10, 15)];
    const grid = rows.map(rowToCells);
    if (grid.some((g) => g === null)) { skipped++; return; }

    // référence du carton (ex. N°851597) pour le retrouver
    const isTechnical = (p) => /bingo|loto|planche|carton/i.test(p);
    const label = parts.find((p) => /[A-Za-z]/.test(p) && isTechnical(p)) || "";
    const m = label.match(/N°\s*(\d+)/);
    const ref = m ? "N°" + m[1] : "";
    const pm = label.match(/Planche\s*N°\s*(\d+)/i);
    const planche = pm ? pm[1] : "";

    // nom : celui du fichier s'il existe, sinon on intègre automatiquement
    // le numéro de plaque sur chaque carton
    const nameField = parts.find(
      (p) => /[A-Za-zÀ-ÿ]/.test(p) && !isTechnical(p) && !/^[0-9\s.-]+$/.test(p)
    );
    const name = nameField ? nameField.trim() : (planche ? "Planche N°" + planche : "");

    const carton = { id: nextId++, grid, achieved: "none", name, ref, planche };
    state.cartons.push(carton);
    addedCartons.push(carton);
  });

  renderCartons();
  markCartons(true);
  if (currentView === "regie") requestAnimationFrame(fitRegie);
  save();
  return { added: addedCartons.length, skipped, cartons: addedCartons };
}

function handleCsvFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const res = importCommupassText(String(reader.result));
    if (res.added === 0) {
      alert("Aucun carton reconnu dans ce fichier.\nVérifiez qu'il s'agit bien d'un export CommuPass (.csv).");
      return;
    }
    const planches = [...new Set(res.cartons.map((c) => c.planche).filter(Boolean))];
    let msg = `✅ ${res.added} carton(s) importé(s) sur ${planches.length || 1} planche(s) !\n`
            + `Le numéro de plaque est déjà inscrit sur chaque carton — vous pouvez le remplacer par un nom de joueur si vous voulez.`;
    if (res.skipped) msg += `\n(${res.skipped} ligne(s) ignorée(s).)`;
    alert(msg);
  };
  reader.readAsText(file, "utf-8");
}

/* ---------- Téléchargement des cartons en image PNG ---------- */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCarton(ctx, x, y, w, h, c, d) {
  const { CELL, GAP, PAD, HEAD } = d;
  // carte
  ctx.fillStyle = "#fff8e6";
  roundRect(ctx, x, y, w, h, 16); ctx.fill();
  // nom du joueur
  ctx.fillStyle = "#3a2400"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.font = "700 22px 'Baloo 2', Arial, sans-serif";
  const nom = (c.name && c.name.trim()) ? c.name.trim() : "Joueur";
  ctx.fillText(nom, x + PAD, y + PAD + 13);
  // numéro du carton
  ctx.textAlign = "right";
  ctx.font = "600 16px 'Fredoka', Arial, sans-serif";
  ctx.fillStyle = "#8a6a2a";
  ctx.fillText("Carton n°" + c.id, x + w - PAD, y + PAD + 13);
  // grille des numéros
  const gx = x + PAD, gy = y + PAD + HEAD;
  for (let r = 0; r < 3; r++) {
    for (let j = 0; j < 9; j++) {
      const v = c.grid[r][j];
      if (v === null) continue;
      const cellX = gx + j * (CELL + GAP), cellY = gy + r * (CELL + GAP);
      ctx.fillStyle = "#fffdf7";
      roundRect(ctx, cellX, cellY, CELL, CELL, 8); ctx.fill();
      ctx.strokeStyle = "#e3cf9e"; ctx.lineWidth = 1;
      roundRect(ctx, cellX, cellY, CELL, CELL, 8); ctx.stroke();
      ctx.fillStyle = "#3a2400"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "700 24px 'Baloo 2', Arial, sans-serif";
      ctx.fillText(String(v), cellX + CELL / 2, cellY + CELL / 2 + 1);
    }
  }
}

function downloadCartons() {
  if (!state.cartons.length) {
    alert("Générez d'abord vos cartons !");
    return;
  }
  const D = { CELL: 54, GAP: 4, PAD: 16, HEAD: 46 };
  const TITLE = 60, MARGIN = 20;
  const cols = state.cartons.length === 1 ? 1 : 2;
  const rows = Math.ceil(state.cartons.length / cols);
  const cartonW = D.PAD * 2 + 9 * D.CELL + 8 * D.GAP;
  const gridH = 3 * D.CELL + 2 * D.GAP;
  const cartonH = D.PAD * 2 + D.HEAD + gridH;
  const W = MARGIN + cols * (cartonW + MARGIN);
  const H = TITLE + MARGIN + rows * (cartonH + MARGIN);

  const scale = 2; // image bien nette
  const cv = document.createElement("canvas");
  cv.width = W * scale; cv.height = H * scale;
  const ctx = cv.getContext("2d");
  ctx.scale(scale, scale);

  // fond + titre
  ctx.fillStyle = "#0f1437"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffd23f"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const ev = state.event || {};
  const sub = [currentParty() && currentParty().name, ev.assoc, formatDate(ev.date), ev.orga ? "Org. " + ev.orga : ""]
    .filter(Boolean).join("   ·   ");
  if (sub) {
    ctx.font = "700 26px 'Baloo 2', Arial, sans-serif";
    ctx.fillText("Suivi Loto Bingo Lulu du 64", W / 2, TITLE / 2 - 12);
    ctx.font = "600 17px 'Fredoka', Arial, sans-serif";
    ctx.fillStyle = "#e0d4ff";
    ctx.fillText(sub, W / 2, TITLE / 2 + 16);
  } else {
    ctx.font = "700 30px 'Baloo 2', Arial, sans-serif";
    ctx.fillText("Suivi Loto Bingo Lulu du 64", W / 2, TITLE / 2);
  }

  // cartons
  state.cartons.forEach((c, i) => {
    const cx = MARGIN + (i % cols) * (cartonW + MARGIN);
    const cy = TITLE + MARGIN + Math.floor(i / cols) * (cartonH + MARGIN);
    drawCarton(ctx, cx, cy, cartonW, cartonH, c, D);
  });

  cv.toBlob((blob) => downloadBlob(blob, "cartons-loto-64.png"));
}

/* ---------- Téléchargement des cartons en CSV (Excel) ---------- */
function downloadCSV() {
  if (!state.cartons.length) {
    alert("Générez d'abord vos cartons !");
    return;
  }
  const SEP = ";"; // séparateur attendu par Excel en français
  const lines = [];
  state.cartons.forEach((c) => {
    const nom = (c.name && c.name.trim()) ? c.name.trim() : "Joueur";
    lines.push([`Carton n°${c.id}`, nom].join(SEP));
    c.grid.forEach((row) => {
      lines.push(row.map((v) => (v === null ? "" : v)).join(SEP));
    });
    lines.push(""); // ligne vide entre deux cartons
  });
  // BOM UTF-8 pour qu'Excel affiche bien les accents
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, "cartons-loto-64.csv");
}

/* ---------- Utilitaire de téléchargement ---------- */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function cartonNode(c) {
  const wrap = document.createElement("div");
  wrap.className = "carton";
  wrap.dataset.id = c.id;

  const head = document.createElement("div");
  head.className = "carton-head";
  head.innerHTML =
    `<input class="carton-name" type="text" placeholder="Nom du joueur" maxlength="24" />` +
    `<span class="carton-no">${c.ref ? c.ref : "n°" + c.id}</span>` +
    `<span class="carton-score">·</span>` +
    `<span class="carton-badge">en jeu</span>`;
  const nameInput = head.querySelector(".carton-name");
  nameInput.value = c.name || "";
  if (FOLLOW) {
    nameInput.readOnly = true; // l'écran de suivi ne modifie rien
  } else {
    nameInput.addEventListener("input", () => { c.name = nameInput.value; save(); });
  }
  wrap.appendChild(head);

  const grid = document.createElement("div");
  grid.className = "carton-grid";
  c.grid.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "carton-row";
    rowEl.style.display = "contents";
    row.forEach((val) => {
      const cell = document.createElement("div");
      if (val === null) {
        cell.className = "carton-cell blank";
      } else {
        cell.className = "carton-cell";
        cell.textContent = val;
        cell.dataset.n = val;
      }
      rowEl.appendChild(cell);
    });
    grid.appendChild(rowEl);
  });
  wrap.appendChild(grid);
  return wrap;
}

/* ---------- Marquage + détection quine / double / plein ---------- */
function markCartons(silent = false) {
  const drawnSet = new Set(state.drawn);
  const winners = [];
  const rank = { none: 0, quine: 1, double: 2, plein: 3 };

  state.cartons.forEach((c) => {
    const node = el.cartons.querySelector(`.carton[data-id="${c.id}"]`);
    if (!node) return;

    let completedRows = 0;
    let totalMarked = 0;
    let bestRow = 0;

    c.grid.forEach((row, r) => {
      const nums = row.filter((v) => v !== null);
      const hits = nums.filter((v) => drawnSet.has(v)).length;
      totalMarked += hits;
      if (hits > bestRow) bestRow = hits;
      const rowComplete = hits === nums.length;
      if (rowComplete) completedRows++;

      // applique les classes aux cellules de la ligne
      const cells = node.querySelectorAll(".carton-row")[r].querySelectorAll(".carton-cell");
      cells.forEach((cell) => {
        if (cell.classList.contains("blank")) return;
        cell.classList.toggle("marked", drawnSet.has(Number(cell.dataset.n)));
      });
      const rowEl = node.querySelectorAll(".carton-row")[r];
      rowEl.classList.toggle("row-quine", rowComplete);
    });

    const isPlein = totalMarked === 15;
    let level = "none";
    if (isPlein) level = "plein";
    else if (completedRows >= 2) level = "double";
    else if (completedRows >= 1) level = "quine";

    applyCartonLevel(node, level);

    // score affiché : meilleure ligne /5 (ou total /15 si carton plein)
    const scoreEl = node.querySelector(".carton-score");
    if (scoreEl) scoreEl.textContent = isPlein ? "15/15" : bestRow + "/5";

    // collecte les nouveaux gagnants
    if (!silent && rank[level] > rank[c.achieved]) {
      winners.push({ c, level });
    }
    c.achieved = level;
  });

  // numéros « en attente » (clignotants) sur le tableau
  const awaited = computeAwaited();
  document.querySelectorAll(".cell").forEach((cell) => {
    const n = Number(cell.dataset.n);
    cell.classList.toggle("awaited", awaited.has(n) && !drawnSet.has(n));
  });

  // annonce des gagnants (tous ceux qui viennent de gagner)
  if (winners.length) showWinners(winners);

  // en vue Tout-en-un, on garde les mieux placés en tête
  if (currentView === "regie") { rankCartons(); adaptRegieGrid(); }
  save();
}

function applyCartonLevel(node, level) {
  node.classList.toggle("is-plein", level === "plein");
  const rows = node.querySelectorAll(".carton-row");
  // colore en violet les lignes complètes quand on a une double quine
  rows.forEach((r) => r.classList.remove("row-double"));
  if (level === "double" || level === "plein") {
    rows.forEach((r) => {
      if (r.classList.contains("row-quine")) r.classList.add("row-double");
    });
  }
  const badge = node.querySelector(".carton-badge");
  badge.className = "carton-badge" + (level !== "none" ? " " + level : "");
  badge.textContent =
    level === "plein" ? "CARTON PLEIN" :
    level === "double" ? "Double quine" :
    level === "quine" ? "Quine !" : "en jeu";
}

/* ---------- Numéros « en attente » (à 1 numéro de la quine) ---------- */
function computeAwaited() {
  const drawn = new Set(state.drawn);
  const res = new Set();
  state.cartons.forEach((c) => {
    let total = 0;
    c.grid.forEach((row) => {
      const nums = row.filter((v) => v !== null);
      const marked = nums.filter((v) => drawn.has(v)).length;
      total += marked;
      if (marked === nums.length - 1) {           // ligne à 1 numéro près
        const miss = nums.find((v) => !drawn.has(v));
        if (miss) res.add(miss);
      }
    });
    if (total === 14) {                            // carton plein à 1 numéro près
      const miss = c.grid.flat().find((v) => v !== null && !drawn.has(v));
      if (miss) res.add(miss);
    }
  });
  return res;
}

/* ---------- Bannière de victoire : cartons gagnants en grand ---------- */
function winnerCard(c, level, drawnSet) {
  const labels = { quine: "Quine", double: "Double quine", plein: "Carton plein" };
  const wrap = document.createElement("div");
  wrap.className = "winner " + level;
  const ref = c.ref || ("Carton n°" + c.id);
  const name = (c.name && c.name.trim()) ? c.name.trim() : "";
  const head = document.createElement("div");
  head.className = "winner-head";
  head.innerHTML = `<span class="winner-level">${labels[level]}</span>` +
    `<span class="winner-id">${ref}${name ? " · " + name : ""}</span>`;
  wrap.appendChild(head);
  const grid = document.createElement("div");
  grid.className = "winner-grid";
  c.grid.forEach((row) => row.forEach((v) => {
    const cell = document.createElement("div");
    if (v === null) { cell.className = "winner-cell blank"; }
    else { cell.className = "winner-cell" + (drawnSet.has(v) ? " marked" : ""); cell.textContent = v; }
    grid.appendChild(cell);
  }));
  wrap.appendChild(grid);
  return wrap;
}
function showWinners(winners) {
  const rank = { none: 0, quine: 1, double: 2, plein: 3 };
  winners.sort((a, b) => rank[b.level] - rank[a.level]);
  const top = winners[0].level;
  const titles = { quine: "Quine ! 🎉", double: "Double quine ! 🎉🎉", plein: "CARTON PLEIN ! 🏆" };
  el.winTitle.textContent = titles[top] + (winners.length > 1 ? `  (${winners.length} gagnants)` : "");
  const drawnSet = new Set(state.drawn);
  el.winList.innerHTML = "";
  winners.forEach((w) => el.winList.appendChild(winnerCard(w.c, w.level, drawnSet)));
  el.winBanner.hidden = false;
  if (!FOLLOW && el.voice.checked && "speechSynthesis" in window) {
    const txt = top === "plein" ? "Carton plein !" : top === "double" ? "Double quine !" : "Quine !";
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "fr-FR"; u.rate = 0.95;
    speechSynthesis.speak(u);
  }
}

/* ============================================================
   SAUVEGARDE LOCALE
   ============================================================ */
function save() {
  if (FOLLOW) return; // l'écran de suivi ne fait que lire, jamais écrire
  syncStateToParty();
  try {
    localStorage.setItem(PKEY, JSON.stringify({ current: currentId, parties, ts: Date.now() }));
  } catch (e) { /* stockage indisponible : on ignore */ }
}

function load() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(PKEY)); } catch (e) { /* ignore */ }
  if (!data || !Array.isArray(data.parties) || !data.parties.length) {
    // reprise d'une éventuelle ancienne partie unique
    let old = null;
    try { old = JSON.parse(localStorage.getItem("loto64")); } catch (e) { /* ignore */ }
    const p = makeParty("Partie 1");
    if (old) {
      p.drawn = old.drawn || [];
      p.pool = old.pool || fullPool().filter((n) => !p.drawn.includes(n));
      p.cartons = old.cartons || [];
    }
    parties = [p]; currentId = p.id;
  } else {
    parties = data.parties;
    currentId = (data.current && data.parties.some((p) => p.id === data.current))
      ? data.current : data.parties[0].id;
  }
  stateFromParty(currentParty());
  return true;
}

/* ============================================================
   NAVIGATION ENTRE LES VUES
   ============================================================ */
let currentView = "tirage";

// La vue « Tout-en-un » réutilise les vrais blocs (tirage + tableau + cartons)
// en les déplaçant : on les sort de leur vue d'origine, puis on les y remet.
function enterRegie() {
  $("#regieDraw").append($(".draw-stage"), $(".stats"), $(".board-wrap"));
  $("#regieCartons").append($("#cartons"));
  rankCartons();
  adaptRegieGrid();
  requestAnimationFrame(fitRegie);
}
function exitRegie() {
  const tv = $("#view-tirage");
  tv.prepend($(".stats"));         // ordre rétabli : tirage, stats, tableau
  tv.prepend($(".draw-stage"));
  tv.append($(".board-wrap"));
  const cartonsEl = $("#cartons");
  cartonsEl.style.gridTemplateColumns = ""; // retire l'adaptation régie
  $("#view-cartons").append(cartonsEl);
  restoreCartonOrder();            // remet les cartons dans l'ordre normal
  const view = $("#view-regie");
  if (view) view.style.height = "";
}

// Redimensionne la « scène » pour que tout tienne sur l'écran, sans scroll
function fitRegie() {
  if (currentView !== "regie") return;
  const view = $("#view-regie"), stage = $("#regieStage");
  if (!view || !stage) return;
  stage.style.transform = "none";
  const natW = stage.offsetWidth, natH = stage.offsetHeight;
  if (!natW || !natH) return;
  const availW = view.clientWidth - 4;
  const availH = window.innerHeight - view.getBoundingClientRect().top - 12;
  const scale = Math.min(availW / natW, availH / natH, 1);
  stage.style.transform = `scale(${scale})`;
  stage.style.marginLeft = Math.max(0, (availW - natW * scale) / 2) + "px";
  view.style.height = natH * scale + "px";
}

// Réordonne les cartons dans le DOM selon un comparateur
function orderCartons(cmp) {
  const cont = $("#cartons");
  [...cont.children].sort(cmp).forEach((n) => cont.appendChild(n));
}

// Score d'un carton : d'abord la ligne la plus avancée (proche de la quine),
// puis le total de numéros cochés (proche du carton plein)
function cartonScore(id) {
  const c = state.cartons.find((c) => c.id === Number(id));
  if (!c) return { best: 0, total: 0 };
  const drawn = new Set(state.drawn);
  let best = 0, total = 0;
  c.grid.forEach((row) => {
    let hits = 0;
    row.forEach((v) => { if (v !== null && drawn.has(v)) hits++; });
    total += hits;
    if (hits > best) best = hits;
  });
  return { best, total };
}

// Classe les cartons du mieux placé au moins avancé (pour la vue Tout-en-un)
function rankCartons() {
  orderCartons((x, y) => {
    const a = cartonScore(x.dataset.id), b = cartonScore(y.dataset.id);
    return b.best - a.best || b.total - a.total || Number(x.dataset.id) - Number(y.dataset.id);
  });
}

function restoreCartonOrder() {
  orderCartons((x, y) => Number(x.dataset.id) - Number(y.dataset.id));
}

/* ============================================================
   COULEURS / THÈMES
   ============================================================ */
const DEFAULT_THEME = {
  bg: "#0f1437", bg2: "#161c4d", card: "#1d2560", card2: "#232c75",
  ink: "#f5f7ff", inkSoft: "#b9c0e8", accent: "#ffd23f", accent2: "#ff8a3d"
};
const THEMES = [
  { name: "Nuit dorée", v: { ...DEFAULT_THEME } },
  { name: "Pastel", v: { bg: "#e7d9ff", bg2: "#efe6ff", card: "#ffffff", card2: "#f3ecff", ink: "#3c2b57", inkSoft: "#6f5f8c", accent: "#b15bff", accent2: "#ff8ac4" } },
  { name: "Océan", v: { bg: "#07223a", bg2: "#0a2f4d", card: "#0e3a5e", card2: "#12496f", ink: "#eaf6ff", inkSoft: "#a9c8dd", accent: "#33d1c9", accent2: "#2b8fd0" } },
  { name: "Forêt", v: { bg: "#0e2417", bg2: "#123020", card: "#163d29", card2: "#1c4c33", ink: "#eafaf0", inkSoft: "#a9d0b8", accent: "#8ede5a", accent2: "#2ecc71" } },
  { name: "Coucher de soleil", v: { bg: "#2a0f2e", bg2: "#3d143a", card: "#4d1a3f", card2: "#66214a", ink: "#fff0f6", inkSoft: "#e0b3c9", accent: "#ffcf3f", accent2: "#ff5d73" } },
  { name: "Rose bonbon", v: { bg: "#3a0f2a", bg2: "#4d1438", card: "#5e1a45", card2: "#742155", ink: "#fff0f7", inkSoft: "#e6b8d2", accent: "#ff8ac4", accent2: "#ff5d99" } },
  { name: "Noël", v: { bg: "#0e2a1a", bg2: "#123a24", card: "#17492e", card2: "#1e5c39", ink: "#fff5ec", inkSoft: "#cfe6d6", accent: "#ffd23f", accent2: "#e63946" } },
  { name: "Bleu-blanc-rouge", v: { bg: "#0a1a3a", bg2: "#0e2350", card: "#132c66", card2: "#18387d", ink: "#ffffff", inkSoft: "#bcccf0", accent: "#ef3d4e", accent2: "#f4f7ff" } },
  { name: "Doux bébé", v: { bg: "#eaf3ff", bg2: "#f2f8ff", card: "#ffffff", card2: "#eef5ff", ink: "#3a4a63", inkSoft: "#6f83a0", accent: "#7cc4ff", accent2: "#ffb3d1" } },
  { name: "Lavande", v: { bg: "#efe9ff", bg2: "#f5f0ff", card: "#ffffff", card2: "#f2eeff", ink: "#443a63", inkSoft: "#756b93", accent: "#9b7bff", accent2: "#c58bff" } },
  { name: "Menthe", v: { bg: "#e4f7f0", bg2: "#eefaf5", card: "#ffffff", card2: "#e9faf3", ink: "#2c4a40", inkSoft: "#5f8377", accent: "#2ecca0", accent2: "#4bd0c0" } },
  { name: "Or & Noir", v: { bg: "#14120c", bg2: "#1c1a12", card: "#241f14", card2: "#2f291a", ink: "#fbf6e9", inkSoft: "#cbbf9d", accent: "#ffd23f", accent2: "#d4a534" } },
  { name: "Pâques", v: { bg: "#eafaf0", bg2: "#f3fbf6", card: "#ffffff", card2: "#eefaf3", ink: "#3a5a44", inkSoft: "#6f9080", accent: "#ff9ec7", accent2: "#a8e06a" } },
  { name: "Halloween", v: { bg: "#1a0f22", bg2: "#241533", card: "#2e1a3f", card2: "#3a214f", ink: "#ffece0", inkSoft: "#d8b8c8", accent: "#ff8a2b", accent2: "#8a2be2" } },
  { name: "Nouvel An", v: { bg: "#0a0e1f", bg2: "#12172e", card: "#1a2140", card2: "#232c55", ink: "#fff8e6", inkSoft: "#cbc4a8", accent: "#ffd700", accent2: "#b9c0e8" } },
  { name: "Anniversaire", v: { bg: "#241040", bg2: "#33174d", card: "#42205e", card2: "#552970", ink: "#fff0fb", inkSoft: "#e0b8e6", accent: "#ff5db1", accent2: "#ffd23f" } },
  { name: "Automne", v: { bg: "#241206", bg2: "#2f1808", card: "#3a2010", card2: "#4a2914", ink: "#fff2e6", inkSoft: "#e0c3a6", accent: "#ff9a3d", accent2: "#e0542b" } },
  { name: "Saint-Valentin", v: { bg: "#2e0f1c", bg2: "#3f1428", card: "#521a34", card2: "#6a2144", ink: "#fff0f4", inkSoft: "#eab8c6", accent: "#ff4d79", accent2: "#ff9ec7" } }
];

// éclaircit (p>0) ou assombrit (p<0) une couleur hex
function shade(hex, p) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = p < 0 ? 0 : 255, a = Math.abs(p);
  r = Math.round((t - r) * a) + r;
  g = Math.round((t - g) * a) + g;
  b = Math.round((t - b) * a) + b;
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
}

function applyTheme(v) {
  const r = document.documentElement.style;
  r.setProperty("--bg", v.bg); r.setProperty("--bg-2", v.bg2);
  r.setProperty("--card", v.card); r.setProperty("--card-2", v.card2);
  r.setProperty("--ink", v.ink); r.setProperty("--ink-soft", v.inkSoft);
  r.setProperty("--accent", v.accent); r.setProperty("--accent-2", v.accent2);
  state.theme = { ...v };
  if (el.accentPick) el.accentPick.value = v.accent;
  if (el.bgPick) el.bgPick.value = v.bg;
  markActiveSwatch();
  try { localStorage.setItem("loto64-theme", JSON.stringify(v)); } catch (e) { /* ignore */ }
}
function markActiveSwatch() {
  document.querySelectorAll(".theme-swatch").forEach((s) => {
    const same = s.dataset.accent === state.theme.accent && s.dataset.bg === state.theme.bg;
    s.classList.toggle("is-active", same);
  });
}
function buildThemeSwatches() {
  el.themePresets.innerHTML = "";
  THEMES.forEach((t) => {
    const b = document.createElement("button");
    b.className = "theme-swatch";
    b.dataset.accent = t.v.accent; b.dataset.bg = t.v.bg;
    b.style.background = t.v.bg2; b.style.color = t.v.ink;
    b.innerHTML = `<span class="sw-bar" style="background:linear-gradient(90deg,${t.v.accent},${t.v.accent2})"></span>${t.name}`;
    b.addEventListener("click", () => applyTheme(t.v));
    el.themePresets.appendChild(b);
  });
}
function setupTheme() {
  buildThemeSwatches();
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem("loto64-theme")); } catch (e) { /* ignore */ }
  applyTheme(saved && saved.bg ? saved : DEFAULT_THEME);

  el.accentPick.addEventListener("input", () => {
    applyTheme({ ...state.theme, accent: el.accentPick.value, accent2: shade(el.accentPick.value, -0.18) });
  });
  el.bgPick.addEventListener("input", () => {
    const base = el.bgPick.value, light = isLight(base);
    applyTheme({
      ...state.theme, bg: base,
      bg2: shade(base, light ? -0.05 : 0.08),
      card: shade(base, light ? -0.10 : 0.14),
      card2: shade(base, light ? -0.16 : 0.22),
      ink: light ? "#2a2340" : "#f5f7ff",
      inkSoft: light ? "#5c5578" : "#c2c9ec"
    });
  });
  el.themeReset.addEventListener("click", () => applyTheme(DEFAULT_THEME));
  const openTheme = () => (el.themeModal.hidden = false);
  el.themeBtn.addEventListener("click", openTheme);
  if (el.themeBtnTop) el.themeBtnTop.addEventListener("click", openTheme);
  el.themeClose.addEventListener("click", () => (el.themeModal.hidden = true));
  el.themeModal.addEventListener("click", (e) => {
    if (e.target === el.themeModal) el.themeModal.hidden = true;
  });
}

function activateView(name) {
  if (name === "regie" && currentView !== "regie") enterRegie();
  else if (name !== "regie" && currentView === "regie") exitRegie();

  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("is-active", t.dataset.view === name));
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active"));
  $("#view-" + name).classList.add("is-active");
  currentView = name;
}

/* ============================================================
   ACCÈS RÉSERVÉ (code d'accès distribué par la propriétaire)
   ============================================================ */
const AKEY = "loto64-access";
const SECRET = "Lulu64!zephyr-2026";     // graine des codes
const OWNER_PWD = "LULU638";              // mot de passe propriétaire

function normName(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}
function makeCode(name) {
  const str = SECRET + "|" + normName(name);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  h = h >>> 0;
  return "LU" + (h.toString(36).toUpperCase() + "0000").slice(0, 4);
}
function isUnlocked() {
  try {
    const a = JSON.parse(localStorage.getItem(AKEY));
    return !!(a && a.name && a.code === makeCode(a.name));
  } catch (e) { return false; }
}
function doUnlock(name) {
  try { localStorage.setItem(AKEY, JSON.stringify({ name, code: makeCode(name) })); } catch (e) { /* ignore */ }
  el.lockScreen.hidden = true;
}
function setupLock() {
  // l'écran de suivi et une session déjà déverrouillée passent directement
  if (FOLLOW || isUnlocked()) { el.lockScreen.hidden = true; return true; }
  el.lockScreen.hidden = false;

  el.lockGo.addEventListener("click", () => {
    const name = el.lockName.value.trim();
    const code = el.lockCode.value.trim().toUpperCase();
    if (!name) { el.lockError.textContent = "Entrez votre prénom."; return; }
    if (code === makeCode(name)) { doUnlock(name); }
    else { el.lockError.textContent = "Code incorrect. Demandez votre code à Lucette."; }
  });
  el.lockCode.addEventListener("keydown", (e) => { if (e.key === "Enter") el.lockGo.click(); });

  el.lockOwnerLink.addEventListener("click", () => { el.ownerPanel.hidden = !el.ownerPanel.hidden; });
  el.ownerGo.addEventListener("click", () => {
    if (el.ownerPwd.value === OWNER_PWD) { el.ownerTools.hidden = false; el.lockError.textContent = ""; }
    else { el.lockError.textContent = "Mot de passe propriétaire incorrect."; }
  });
  el.genGo.addEventListener("click", () => {
    const n = el.genName.value.trim();
    el.genResult.textContent = n ? `Code de ${n} : ${makeCode(n)}` : "";
  });
  el.ownerUnlock.addEventListener("click", () => doUnlock("Lucette (propriétaire)"));
  return false;
}

/* ============================================================
   PARTIES + INFOS DE LA PARTIE
   ============================================================ */
function formatDate(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : iso;
}
function renderEventInfo() {
  if (!el.eventInfo) return;
  const ev = state.event || {};
  const out = [];
  if (ev.assoc) out.push("🎪 " + ev.assoc);
  if (ev.date) out.push("📅 " + formatDate(ev.date));
  if (ev.orga) out.push("👤 " + ev.orga);
  el.eventInfo.textContent = out.join("   ·   ");
}
function renderPartyBar() {
  if (!el.partySelect) return;
  el.partySelect.innerHTML = "";
  parties.forEach((p) => {
    const o = document.createElement("option");
    o.value = p.id; o.textContent = p.name || "Partie";
    if (p.id === currentId) o.selected = true;
    el.partySelect.appendChild(o);
  });
  renderEventInfo();
}
function switchParty(id) {
  save();
  currentId = id;
  stateFromParty(currentParty());
  renderAll(); renderPartyBar();
}
function addParty() {
  save();
  const p = makeParty("Partie " + (parties.length + 1));
  parties.push(p); currentId = p.id;
  stateFromParty(p); renderAll(); renderPartyBar(); save();
}
function duplicateParty() {
  save();
  const src = currentParty();
  const copy = JSON.parse(JSON.stringify(src));
  copy.id = uid();
  copy.name = (src.name || "Partie") + " (copie)";
  parties.push(copy); currentId = copy.id;
  stateFromParty(copy); renderAll(); renderPartyBar(); save();
}
function deleteParty() {
  if (parties.length <= 1) { alert("Il faut garder au moins une partie."); return; }
  if (!confirm(`Supprimer la partie « ${currentParty().name || ""} » ?`)) return;
  parties = parties.filter((p) => p.id !== currentId);
  currentId = parties[0].id;
  stateFromParty(currentParty()); renderAll(); renderPartyBar(); save();
}
function resetAll() {
  if (!confirm("Tout effacer pour cette partie : numéros tirés, cartons et infos ?")) return;
  stopAuto();
  const p = currentParty();
  p.drawn = []; p.pool = fullPool(); p.cartons = []; p.event = { assoc: "", orga: "", date: "" };
  stateFromParty(p);
  renderAll(); renderPartyBar(); save();
}
function setupParties() {
  renderPartyBar();
  el.partySelect.addEventListener("change", () => switchParty(el.partySelect.value));
  el.partyNew.addEventListener("click", addParty);
  el.partyDup.addEventListener("click", duplicateParty);
  el.partyDel.addEventListener("click", deleteParty);
}
function setupEvent() {
  const open = () => {
    el.evPartie.value = currentParty().name || "";
    el.evAssoc.value = state.event.assoc || "";
    el.evOrga.value = state.event.orga || "";
    el.evDate.value = state.event.date || "";
    el.eventModal.hidden = false;
  };
  el.eventBtn.addEventListener("click", open);
  el.evPartie.addEventListener("input", () => { currentParty().name = el.evPartie.value; renderPartyBar(); save(); });
  el.evAssoc.addEventListener("input", () => { state.event.assoc = el.evAssoc.value; renderEventInfo(); save(); });
  el.evOrga.addEventListener("input", () => { state.event.orga = el.evOrga.value; renderEventInfo(); save(); });
  el.evDate.addEventListener("input", () => { state.event.date = el.evDate.value; renderEventInfo(); save(); });
  el.eventClear.addEventListener("click", () => {
    state.event.assoc = ""; state.event.orga = ""; state.event.date = "";
    el.evAssoc.value = ""; el.evOrga.value = ""; el.evDate.value = "";
    renderEventInfo(); save();
  });
  el.eventClose.addEventListener("click", () => (el.eventModal.hidden = true));
  el.eventModal.addEventListener("click", (e) => { if (e.target === el.eventModal) el.eventModal.hidden = true; });
}

// Adapte le nombre de colonnes des 12 meilleurs cartons selon leur nombre
function adaptRegieGrid() {
  const grid = $("#cartons");
  if (!grid) return;
  const n = Math.min(state.cartons.length, 24);
  const cols = n <= 1 ? 1 : n <= 2 ? 2 : n <= 6 ? 3 : n <= 12 ? 4 : n <= 18 ? 5 : 6;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => activateView(tab.dataset.view));
  });
}

/* ============================================================
   AFFICHAGE GLOBAL
   ============================================================ */
// Met à jour la grosse boule, le libellé et l'historique
function refreshHeadline() {
  if (state.drawn.length) {
    const last = state.drawn[state.drawn.length - 1];
    el.ball.classList.remove("empty");
    el.ball.textContent = last;
    const nick = NICKNAMES[last] ? ` — ${NICKNAMES[last]}` : "";
    el.label.textContent = `Le ${last}${nick}`;
    pushHistory(last);
  } else {
    el.ball.classList.add("empty");
    el.ball.textContent = "--";
    el.label.textContent = "Prêt à jouer ?";
    el.history.innerHTML = "";
  }
}

// Rafraîchit tout l'affichage à partir de l'état courant
function renderAll() {
  updateStats();
  refreshBoard();
  refreshHeadline();
  renderCartons();
  markCartons(true);
}

/* ============================================================
   MODE DEUX ÉCRANS (synchronisation entre fenêtres)
   ============================================================ */
// Ouvre une fenêtre « écran de suivi » (à placer sur l'écran d'à côté)
function openFollowScreen() {
  const url = location.pathname + "?ecran=suivi" + location.hash;
  window.open(url, "loto_suivi", "width=1000,height=760");
}

function updateFollowBar() {
  const last = state.drawn[state.drawn.length - 1];
  el.followLast.textContent = last != null ? last : "--";
  el.followCount.textContent = state.drawn.length;
}

// Recharge l'état depuis localStorage si l'écran de tirage a changé quelque chose
function syncFromStorage() {
  let data;
  try { data = JSON.parse(localStorage.getItem(PKEY)); } catch (e) { return; }
  if (!data || !data.parties || data.ts === state._ts) return;
  state._ts = data.ts;

  const cur = data.parties.find((p) => p.id === data.current) || data.parties[0];
  if (!cur) return;

  const rank = { none: 0, quine: 1, double: 2, plein: 3 };
  const old = {};
  state.cartons.forEach((c) => (old[c.id] = c.achieved));

  state.drawn = cur.drawn || [];
  state.pool = cur.pool || [];
  state.cartons = cur.cartons || [];
  state.event = cur.event || { assoc: "", orga: "", date: "" };

  renderAll();
  renderEventInfo();
  updateFollowBar();

  // affiche les gagnants détectés sur l'écran de suivi
  const winners = [];
  state.cartons.forEach((c) => {
    if (rank[c.achieved] > rank[old[c.id] || "none"]) winners.push({ c, level: c.achieved });
  });
  if (winners.length) showWinners(winners);
}

function startFollowMode() {
  document.body.classList.add("follow-mode");
  el.followBar.hidden = false;
  activateView("cartons"); // par défaut on suit les cartons (les bingos)
  state._ts = null;
  syncFromStorage();
  // mise à jour instantanée quand c'est possible…
  window.addEventListener("storage", (e) => { if (e.key === PKEY) syncFromStorage(); });
  // …et sondage régulier (fonctionne aussi en local file:// et hors-ligne)
  setInterval(syncFromStorage, 500);
}

/* ============================================================
   INITIALISATION
   ============================================================ */
function init() {
  setupLock();
  buildBoard();
  setupTabs();
  setupTheme();

  load();
  renderAll();
  renderPartyBar();
  renderEventInfo();

  // La fenêtre peut toujours fermer la bannière de victoire
  el.winClose.addEventListener("click", () => (el.winBanner.hidden = true));
  el.winBanner.addEventListener("click", (e) => {
    if (e.target === el.winBanner) el.winBanner.hidden = true;
  });

  // À propos / Acheter
  el.aboutBtn.addEventListener("click", () => (el.aboutModal.hidden = false));
  el.aboutClose.addEventListener("click", () => (el.aboutModal.hidden = true));
  el.aboutModal.addEventListener("click", (e) => {
    if (e.target === el.aboutModal) el.aboutModal.hidden = true;
  });

  // ----- Écran de suivi : on ne fait que refléter la partie -----
  if (FOLLOW) {
    startFollowMode();
    return;
  }

  // ----- Écran de tirage (commandes du jeu) -----
  setupParties();
  setupEvent();
  el.winNewGame.addEventListener("click", () => { el.winBanner.hidden = true; newGame(); });
  el.resetAllBtn.addEventListener("click", resetAll);
  el.drawBtn.addEventListener("click", drawNumber);
  el.autoBtn.addEventListener("click", toggleAuto);
  el.resetBtn.addEventListener("click", newGame);
  el.speed.addEventListener("change", () => {
    if (state.auto) { stopAuto(); toggleAuto(); }
  });
  el.genBtn.addEventListener("click", generateCartons);
  el.importBtn.addEventListener("click", () => el.csvImport.click());
  el.csvImport.addEventListener("change", (e) => {
    handleCsvFile(e.target.files[0]);
    e.target.value = ""; // permet de ré-importer le même fichier
  });
  el.addPlaqueBtn.addEventListener("click", openPlaqueModal);
  el.pmSave.addEventListener("click", savePlaque);
  el.pmCancel.addEventListener("click", closePlaqueModal);
  el.plaqueModal.addEventListener("click", (e) => {
    if (e.target === el.plaqueModal) closePlaqueModal();
  });
  el.downloadBtn.addEventListener("click", downloadCartons);
  el.csvBtn.addEventListener("click", downloadCSV);
  el.printBtn.addEventListener("click", () => window.print());
  el.screenBtn.addEventListener("click", openFollowScreen);

  // redimensionne la vue Tout-en-un quand la fenêtre change de taille
  window.addEventListener("resize", fitRegie);

  // précharge les voix de synthèse
  if ("speechSynthesis" in window) speechSynthesis.getVoices();

  // raccourci clavier : espace = tirer
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && $("#view-tirage").classList.contains("is-active")) {
      e.preventDefault();
      drawNumber();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
