/* Générateur de plaques de cartons de loto (loto quine, 90 numéros).

   Rappel des règles :
   - Un carton = 3 lignes × 9 colonnes, 5 numéros par ligne (15 numéros).
   - Colonne 1 : 1-9, colonnes 2-8 : 10-19 … 70-79, colonne 9 : 80-90.
   - Une PLAQUE de 6 cartons contient les 90 numéros, chacun une seule fois.
   - Une PLAQUE de 12 cartons = 2 plaques de 6 (chaque numéro y figure 2 fois).
*/

const LotoCartons = (() => {
  const STORAGE_KEY = 'loto-quine-plaque';
  const COL_CAP = [9, 10, 10, 10, 10, 10, 10, 10, 11]; // numéros par colonne
  let plaque = null; // { size, name, cartons: [{ id, grid }] }  grid = 3×9 de (number|null)

  /* ----- utilitaires ----- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function columnNumbers() {
    // Liste triée des numéros de chaque colonne.
    const cols = [];
    let n = 1;
    for (let j = 0; j < 9; j++) {
      const arr = [];
      for (let k = 0; k < COL_CAP[j]; k++) arr.push(n++);
      cols.push(arr);
    }
    return cols; // total 90
  }

  /* ----- 1) Matrice de comptage : 6 cartons × 9 colonnes -----
     Chaque case ∈ [0..3], somme par ligne (carton) = 15, somme par colonne = COL_CAP. */
  function countsMatrix() {
    for (let attempt = 0; attempt < 1000; attempt++) {
      const M = Array.from({ length: 6 }, () => Array(9).fill(0));
      const rowRem = Array(6).fill(15); // numéros restant à placer par carton
      let ok = true;

      for (let j = 0; j < 9 && ok; j++) {
        let cap = COL_CAP[j];
        const colsLeftAfter = 9 - j - 1;
        const assign = Array(6).fill(0);

        // Minimum imposé : éviter qu'un carton ait plus de restant que de place future.
        for (let t = 0; t < 6; t++) {
          const mn = Math.max(0, rowRem[t] - 3 * colsLeftAfter);
          assign[t] = mn;
          cap -= mn;
        }
        if (cap < 0) { ok = false; break; }

        // Répartit le reste, une unité à la fois, sur des cartons non saturés.
        let guard = 0;
        while (cap > 0) {
          const t = Math.floor(Math.random() * 6);
          if (assign[t] < Math.min(3, rowRem[t])) { assign[t]++; cap--; }
          if (++guard > 5000) { ok = false; break; }
        }
        if (!ok) break;

        for (let t = 0; t < 6; t++) {
          M[t][j] = assign[t];
          rowRem[t] -= assign[t];
          if (rowRem[t] < 0) ok = false;
        }
      }

      if (ok && rowRem.every(r => r === 0) &&
          M.every(row => row.reduce((a, b) => a + b, 0) === 15)) {
        return M;
      }
    }
    return null;
  }

  /* ----- 2) Place les comptes d'un carton dans 3 lignes (5 par ligne) -----
     colCounts : 9 valeurs ∈ [0..3], somme 15 → renvoie une grille 3×9 booléenne. */
  function placeRows(colCounts) {
    for (let attempt = 0; attempt < 500; attempt++) {
      const grid = [Array(9).fill(false), Array(9).fill(false), Array(9).fill(false)];
      const rowCount = [0, 0, 0];
      let ok = true;

      // Colonnes les plus « lourdes » d'abord (3 = lignes forcées).
      const cols = [...Array(9).keys()].sort((a, b) => colCounts[b] - colCounts[a]);
      for (const j of cols) {
        const c = colCounts[j];
        if (c === 0) continue;
        // Lignes encore disponibles, celles qui ont le plus de place d'abord.
        let rows = [0, 1, 2].filter(r => rowCount[r] < 5);
        rows = shuffle(rows).sort((a, b) => rowCount[a] - rowCount[b]);
        if (rows.length < c) { ok = false; break; }
        for (const r of rows.slice(0, c)) { grid[r][j] = true; rowCount[r]++; }
      }

      if (ok && rowCount.every(r => r === 5)) return grid;
    }
    return null;
  }

  /* ----- 3) Construit une plaque de 6 cartons (les 90 numéros) ----- */
  function buildStrip() {
    for (let attempt = 0; attempt < 50; attempt++) {
      const M = countsMatrix();
      if (!M) continue;

      const cols = columnNumbers();
      const cartons = [];
      let ok = true;

      // Découpe les numéros de chaque colonne entre les 6 cartons.
      const colSlices = []; // colSlices[j][t] = tableau de numéros (triés)
      for (let j = 0; j < 9; j++) {
        const pool = cols[j].slice();
        const perTicket = [];
        let idx = 0;
        for (let t = 0; t < 6; t++) {
          perTicket.push(pool.slice(idx, idx + M[t][j]));
          idx += M[t][j];
        }
        colSlices.push(perTicket);
      }

      for (let t = 0; t < 6 && ok; t++) {
        const colCounts = M[t];
        const placed = placeRows(colCounts);
        if (!placed) { ok = false; break; }

        const grid = [Array(9).fill(null), Array(9).fill(null), Array(9).fill(null)];
        for (let j = 0; j < 9; j++) {
          const nums = colSlices[j][t]; // déjà triés croissants
          // Lignes occupées de cette colonne, de haut en bas.
          const rows = [0, 1, 2].filter(r => placed[r][j]);
          rows.forEach((r, k) => { grid[r][j] = nums[k]; });
        }
        cartons.push({ grid });
      }

      if (ok) return cartons; // 6 cartons
    }
    return null;
  }

  /* ----- API publique ----- */
  function generate(size) {
    const strips = size === 12 ? 2 : 1;
    const all = [];
    for (let s = 0; s < strips; s++) {
      const strip = buildStrip();
      if (!strip) return false;
      all.push(...strip);
    }
    all.forEach((c, i) => { c.id = i + 1; });
    plaque = { size, name: `Plaque de ${size} cartons`, cartons: all };
    save();
    renderPlaque();
    return true;
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plaque)); } catch (e) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) plaque = JSON.parse(raw);
    } catch (e) { plaque = null; }
  }

  function clear() {
    plaque = null;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    renderPlaque();
  }

  /* ----- Rendu ----- */
  function renderPlaque() {
    const wrap = document.getElementById('plaqueOutput');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!plaque) return;

    const title = document.createElement('div');
    title.className = 'plaque-header';
    title.innerHTML = `<strong>${plaque.name}</strong> · ${plaque.cartons.length} cartons`;
    wrap.appendChild(title);

    const sheet = document.createElement('div');
    sheet.className = 'plaque-sheet';
    plaque.cartons.forEach(c => sheet.appendChild(renderCarton(c)));
    wrap.appendChild(sheet);

    renderMarks(new Set(window.LotoState ? window.LotoState.drawn : []));
  }

  function renderCarton(carton) {
    const box = document.createElement('div');
    box.className = 'carton';
    box.dataset.id = carton.id;

    const head = document.createElement('div');
    head.className = 'carton-title';
    head.textContent = `Carton n°${carton.id}`;
    box.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'carton-grid';
    for (let r = 0; r < 3; r++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('div');
        const val = carton.grid[r][j];
        if (val == null) {
          cell.className = 'carton-cell empty';
        } else {
          cell.className = 'carton-cell';
          cell.textContent = val;
          cell.dataset.n = val;
        }
        grid.appendChild(cell);
      }
    }
    box.appendChild(grid);
    return box;
  }

  /* Marque les numéros sortis sur tous les cartons affichés. */
  function renderMarks(drawnSet) {
    document.querySelectorAll('#plaqueOutput .carton-cell[data-n]').forEach(cell => {
      const n = parseInt(cell.dataset.n, 10);
      cell.classList.toggle('marked', drawnSet.has(n));
    });
    // Met en évidence un carton complet (carton plein).
    document.querySelectorAll('#plaqueOutput .carton').forEach(box => {
      const cells = box.querySelectorAll('.carton-cell[data-n]');
      const full = cells.length > 0 && [...cells].every(c => c.classList.contains('marked'));
      box.classList.toggle('full', full);
    });
  }

  function print() {
    if (!plaque) { alert('Générez d\'abord une plaque.'); return; }
    window.print();
  }

  return { generate, load, clear, renderPlaque, renderMarks, print,
    get current() { return plaque; } };
})();
