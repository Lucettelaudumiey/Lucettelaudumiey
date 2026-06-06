/* ============================================================
   Loto Quine — Lulu & Titine du 64
   Jeu de loto traditionnel français (numéros 1 à 90)
   ============================================================ */

"use strict";

/* ---------- Surnoms rigolos du loto ---------- */
const NICKNAMES = {
  1: "le p'tit premier", 2: "les deux tourterelles", 3: "le clocher",
  7: "le râteau", 8: "le bonhomme de neige", 9: "le pruneau d'Agen",
  10: "les commandements", 11: "les jambes de mémé", 12: "la douzaine",
  13: "ça porte bonheur !", 18: "la majorité", 21: "le bel âge",
  22: "v'là les flics", 25: "Noël", 30: "le bel âge de Titine",
  31: "le réveillon", 33: "les bougies de Lulu", 40: "les voleurs",
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
  auto: null       // timer du tirage auto
};

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
  winText: $("#winText"),
  winClose: $("#winClose"),
  followBar: $("#followBar"),
  followLast: $("#followLast"),
  followCount: $("#followCount")
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
  const n = Math.min(12, Math.max(1, Number(el.cartonCount.value) || 1));
  state.cartons = [];
  for (let i = 1; i <= n; i++) state.cartons.push(makeCarton(i));
  renderCartons();
  markCartons(true); // applique l'état courant sans bannière
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
  save();
  closePlaqueModal();
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
  ctx.font = "700 30px 'Baloo 2', Arial, sans-serif";
  ctx.fillText("Loto Quine — Lulu & Titine du 64", W / 2, TITLE / 2);

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
    `<span class="carton-no">n°${c.id}</span>` +
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

  state.cartons.forEach((c) => {
    const node = el.cartons.querySelector(`.carton[data-id="${c.id}"]`);
    if (!node) return;

    let completedRows = 0;
    let totalMarked = 0;

    c.grid.forEach((row, r) => {
      const nums = row.filter((v) => v !== null);
      const hits = nums.filter((v) => drawnSet.has(v)).length;
      totalMarked += hits;
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

    // bannière si nouveau palier atteint
    const rank = { none: 0, quine: 1, double: 2, plein: 3 };
    if (!silent && rank[level] > rank[c.achieved]) {
      celebrate(level, c.id);
    }
    c.achieved = level;
  });
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

/* ---------- Bannière de victoire ---------- */
function celebrate(level, id) {
  const titles = { quine: "Quine ! 🎉", double: "Double quine ! 🎉🎉", plein: "CARTON PLEIN ! 🏆" };
  el.winTitle.textContent = titles[level];
  el.winText.textContent = `Carton n°${id}`;
  el.winBanner.hidden = false;
  if (!FOLLOW && el.voice.checked && "speechSynthesis" in window) {
    const txt = level === "plein" ? "Carton plein !" : level === "double" ? "Double quine !" : "Quine !";
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
  try {
    localStorage.setItem("loto64", JSON.stringify({
      drawn: state.drawn, pool: state.pool, cartons: state.cartons, ts: Date.now()
    }));
  } catch (e) { /* stockage indisponible : on ignore */ }
}

function load() {
  try {
    const raw = localStorage.getItem("loto64");
    if (!raw) return false;
    const data = JSON.parse(raw);
    state.drawn = data.drawn || [];
    state.pool = data.pool || Array.from({ length: 90 }, (_, i) => i + 1)
      .filter((n) => !state.drawn.includes(n));
    state.cartons = data.cartons || [];
    return true;
  } catch (e) { return false; }
}

/* ============================================================
   NAVIGATION ENTRE LES VUES
   ============================================================ */
function activateView(name) {
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("is-active", t.dataset.view === name));
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active"));
  $("#view-" + name).classList.add("is-active");
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
  try { data = JSON.parse(localStorage.getItem("loto64")); } catch (e) { return; }
  if (!data || data.ts === state._ts) return;
  state._ts = data.ts;

  const rank = { none: 0, quine: 1, double: 2, plein: 3 };
  const old = {};
  state.cartons.forEach((c) => (old[c.id] = c.achieved));

  state.drawn = data.drawn || [];
  state.pool = data.pool || [];
  state.cartons = data.cartons || [];

  renderAll();
  updateFollowBar();

  // célèbre les nouvelles quines détectées sur l'écran de suivi
  state.cartons.forEach((c) => {
    if (rank[c.achieved] > rank[old[c.id] || "none"]) celebrate(c.achieved, c.id);
  });
}

function startFollowMode() {
  document.body.classList.add("follow-mode");
  el.followBar.hidden = false;
  activateView("cartons"); // par défaut on suit les cartons (les bingos)
  state._ts = null;
  syncFromStorage();
  // mise à jour instantanée quand c'est possible…
  window.addEventListener("storage", (e) => { if (e.key === "loto64") syncFromStorage(); });
  // …et sondage régulier (fonctionne aussi en local file:// et hors-ligne)
  setInterval(syncFromStorage, 500);
}

/* ============================================================
   INITIALISATION
   ============================================================ */
function init() {
  buildBoard();
  setupTabs();

  if (!load()) resetPool();
  renderAll();

  // La fenêtre peut toujours fermer la bannière de victoire
  el.winClose.addEventListener("click", () => (el.winBanner.hidden = true));
  el.winBanner.addEventListener("click", (e) => {
    if (e.target === el.winBanner) el.winBanner.hidden = true;
  });

  // ----- Écran de suivi : on ne fait que refléter la partie -----
  if (FOLLOW) {
    startFollowMode();
    return;
  }

  // ----- Écran de tirage (commandes du jeu) -----
  el.drawBtn.addEventListener("click", drawNumber);
  el.autoBtn.addEventListener("click", toggleAuto);
  el.resetBtn.addEventListener("click", newGame);
  el.speed.addEventListener("change", () => {
    if (state.auto) { stopAuto(); toggleAuto(); }
  });
  el.genBtn.addEventListener("click", generateCartons);
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
