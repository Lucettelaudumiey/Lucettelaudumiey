/* Loto Quine — assistant de tirage
   Loto traditionnel français : 90 numéros, tirage aléatoire sans remise. */

const TOTAL = 90;
const STORAGE_KEY = 'loto-quine-state';

const state = {
  drawn: [],        // ordre de tirage
  announces: [],    // { type, n, time }
};

let autoTimer = null;

/* ---------- Persistance ---------- */
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* stockage indisponible : on continue sans persistance */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.drawn)) state.drawn = data.drawn;
    if (Array.isArray(data.announces)) state.announces = data.announces;
  } catch (e) { /* données corrompues : on repart de zéro */ }
}

/* ---------- Tirage ---------- */
function remainingNumbers() {
  const drawnSet = new Set(state.drawn);
  const remaining = [];
  for (let n = 1; n <= TOTAL; n++) {
    if (!drawnSet.has(n)) remaining.push(n);
  }
  return remaining;
}

/* Entier aléatoire uniforme et non biaisé via l'API crypto si disponible. */
function randomInt(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const limit = Math.floor(0xffffffff / max) * max;
    const arr = new Uint32Array(1);
    let x;
    do {
      window.crypto.getRandomValues(arr);
      x = arr[0];
    } while (x >= limit);
    return x % max;
  }
  return Math.floor(Math.random() * max);
}

function drawNumber() {
  const remaining = remainingNumbers();
  if (remaining.length === 0) return null;
  const n = remaining[randomInt(remaining.length)];
  state.drawn.push(n);
  save();
  render();
  announceVoice(n);
  return n;
}

/* Annonce vocale du numéro (si supporté). */
function announceVoice(n) {
  if (!window.speechSynthesis) return;
  try {
    const u = new SpeechSynthesisUtterance(String(n));
    u.lang = 'fr-FR';
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) { /* synthèse vocale indisponible */ }
}

/* ---------- Annonces quine ---------- */
function logAnnounce(type) {
  const labels = {
    quine: 'Quine (une ligne)',
    double: 'Double quine',
    carton: 'Carton plein',
  };
  const lastN = state.drawn[state.drawn.length - 1] ?? '—';
  state.announces.unshift({
    type,
    label: labels[type] || type,
    afterCount: state.drawn.length,
    lastN,
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  });
  save();
  renderAnnounces();
}

/* ---------- Vérification d'un carton ---------- */
function parseCard(text) {
  return [...new Set(
    text.split(/[\s,;]+/)
      .map(s => parseInt(s, 10))
      .filter(n => Number.isInteger(n) && n >= 1 && n <= TOTAL)
  )];
}

function verifyCard(text) {
  const card = parseCard(text);
  const drawnSet = new Set(state.drawn);
  if (card.length === 0) {
    return { html: '<span class="pending">Aucun numéro valide saisi (1 à 90).</span>' };
  }
  const matched = card.filter(n => drawnSet.has(n));
  const missing = card.filter(n => !drawnSet.has(n));
  const pct = Math.round((matched.length / card.length) * 100);

  let verdict;
  if (missing.length === 0) {
    verdict = '<span class="ok">🎉 CARTON PLEIN ! Tous les numéros sont sortis.</span>';
  } else {
    verdict = `<span class="pending">Encore ${missing.length} numéro(s) à sortir : ${missing.sort((a, b) => a - b).join(', ')}</span>`;
  }

  return {
    html: `
      <div>${verdict}</div>
      <div style="margin-top:8px">Marqués : <strong>${matched.length}/${card.length}</strong> (${pct}%)</div>
    `,
  };
}

/* ---------- Rendu ---------- */
function buildGrid() {
  const grid = document.getElementById('numberGrid');
  grid.innerHTML = '';
  for (let n = 1; n <= TOTAL; n++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = n;
    cell.dataset.n = n;
    cell.setAttribute('role', 'gridcell');
    // Permet de marquer/démarquer manuellement (correction d'un tirage physique).
    cell.addEventListener('click', () => toggleManual(n));
    grid.appendChild(cell);
  }
}

function toggleManual(n) {
  const idx = state.drawn.indexOf(n);
  if (idx === -1) {
    state.drawn.push(n);
  } else {
    state.drawn.splice(idx, 1);
  }
  save();
  render();
}

function render() {
  const drawnSet = new Set(state.drawn);
  const latest = state.drawn[state.drawn.length - 1];

  // Numéro courant
  const cur = document.getElementById('currentNumber');
  cur.textContent = latest ?? '—';
  cur.classList.remove('pop');
  void cur.offsetWidth; // relance l'animation
  if (latest) cur.classList.add('pop');

  // Derniers numéros (5)
  const last = document.getElementById('lastNumbers');
  last.innerHTML = '';
  state.drawn.slice(-6, -1).reverse().forEach(n => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = n;
    last.appendChild(chip);
  });

  // Grille
  document.querySelectorAll('.number-grid .cell').forEach(cell => {
    const n = parseInt(cell.dataset.n, 10);
    cell.classList.toggle('drawn', drawnSet.has(n));
    cell.classList.toggle('latest', n === latest);
  });

  // Stats
  document.getElementById('countDrawn').textContent = state.drawn.length;
  document.getElementById('countRemaining').textContent = TOTAL - state.drawn.length;

  // Désactive le tirage si tout est sorti
  const done = state.drawn.length >= TOTAL;
  document.getElementById('drawBtn').disabled = done;
  if (done) stopAuto();
}

function renderAnnounces() {
  const ul = document.getElementById('announceLog');
  ul.innerHTML = '';
  state.announces.forEach(a => {
    const li = document.createElement('li');
    if (a.type === 'carton') li.classList.add('carton');
    li.textContent = `${a.time} — ${a.label} (au ${a.afterCount}ᵉ tirage, n°${a.lastN})`;
    ul.appendChild(li);
  });
}

/* ---------- Tirage automatique ---------- */
function startAuto() {
  if (autoTimer) return;
  const btn = document.getElementById('autoBtn');
  btn.classList.add('active');
  btn.textContent = 'Stop auto';
  autoTimer = setInterval(() => {
    if (drawNumber() === null) stopAuto();
  }, 3500);
}

function stopAuto() {
  if (!autoTimer) {
    document.getElementById('autoBtn').textContent = 'Tirage auto';
    return;
  }
  clearInterval(autoTimer);
  autoTimer = null;
  const btn = document.getElementById('autoBtn');
  btn.classList.remove('active');
  btn.textContent = 'Tirage auto';
}

function reset() {
  if (state.drawn.length && !confirm('Démarrer une nouvelle partie ? Le tirage en cours sera effacé.')) return;
  stopAuto();
  state.drawn = [];
  state.announces = [];
  save();
  render();
  renderAnnounces();
  document.getElementById('verifyResult').innerHTML = '';
}

/* ---------- Initialisation ---------- */
function init() {
  load();
  buildGrid();
  render();
  renderAnnounces();

  document.getElementById('drawBtn').addEventListener('click', () => drawNumber());
  document.getElementById('resetBtn').addEventListener('click', reset);
  document.getElementById('autoBtn').addEventListener('click', () => {
    autoTimer ? stopAuto() : startAuto();
  });

  document.querySelectorAll('[data-announce]').forEach(btn => {
    btn.addEventListener('click', () => logAnnounce(btn.dataset.announce));
  });

  document.getElementById('verifyBtn').addEventListener('click', () => {
    const text = document.getElementById('cardInput').value;
    document.getElementById('verifyResult').innerHTML = verifyCard(text).html;
  });

  // Raccourci : barre d'espace pour tirer
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      drawNumber();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
