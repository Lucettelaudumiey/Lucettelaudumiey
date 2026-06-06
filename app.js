/* Logique de l'application "Les Histoires de Mamie" */

(function () {
  "use strict";

  // Prénoms pré-remplis par défaut (modifiable librement par l'utilisateur)
  const DEFAULT_CHILDREN = [
    { name: "Maddy", gender: "f" },
    { name: "Alba", gender: "f" },
    { name: "Lou-Ann", gender: "f" },
    { name: "Léonie", gender: "f" }
  ];

  // --- Récupération des éléments de la page ---
  const form = document.getElementById("story-form");
  const childrenList = document.getElementById("children-list");
  const addChildBtn = document.getElementById("add-child");
  const lienSelect = document.getElementById("lien");
  const lienField = document.getElementById("lien-field");
  const animalSelect = document.getElementById("animal");
  const storySelect = document.getElementById("story-select");
  const storyDesc = document.getElementById("story-desc");

  const setupSection = document.getElementById("setup");
  const outputSection = document.getElementById("story-output");
  const storyTitle = document.getElementById("story-title");
  const storyTextEl = document.getElementById("story-text");

  const readBtn = document.getElementById("read-btn");
  const stopBtn = document.getElementById("stop-btn");
  const fontSmaller = document.getElementById("font-smaller");
  const fontBigger = document.getElementById("font-bigger");
  const printBtn = document.getElementById("print-btn");
  const newBtn = document.getElementById("new-btn");

  let currentFontSize = 1.25; // en rem
  let currentList = STORIES;  // liste d'histoires affichée selon le mode

  // =========================================================
  //  Liste dynamique des enfants
  // =========================================================
  function addChildRow(child) {
    child = child || { name: "", gender: "f" };

    const row = document.createElement("div");
    row.className = "child-row";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "child-name";
    nameInput.placeholder = "Prénom…";
    nameInput.maxLength = 20;
    nameInput.value = child.name;

    const genderSelect = document.createElement("select");
    genderSelect.className = "child-gender";
    genderSelect.innerHTML =
      '<option value="f">👧 fille</option><option value="m">👦 garçon</option>';
    genderSelect.value = child.gender;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-child";
    removeBtn.setAttribute("aria-label", "Retirer cet enfant");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", function () {
      row.remove();
      refreshStoryOptions();
    });

    nameInput.addEventListener("input", refreshStoryOptions);
    genderSelect.addEventListener("change", refreshStoryOptions);

    row.appendChild(nameInput);
    row.appendChild(genderSelect);
    row.appendChild(removeBtn);
    childrenList.appendChild(row);
  }

  // Lit les enfants dont le prénom n'est pas vide
  function getChildren() {
    const rows = childrenList.querySelectorAll(".child-row");
    const children = [];
    rows.forEach(function (row) {
      const name = row.querySelector(".child-name").value.trim();
      if (name) {
        children.push({
          name: capitalizeName(name),
          gender: row.querySelector(".child-gender").value
        });
      }
    });
    return children;
  }

  // Met une majuscule à chaque morceau du prénom : "lou-ann" → "Lou-Ann"
  function capitalizeName(name) {
    return name.replace(/(^|[\s'-])([a-zàâäéèêëïîôöùûüç])/g, function (m, sep, letter) {
      return sep + letter.toUpperCase();
    });
  }

  // Joint les prénoms : ["A","B","C"] → "A, B et C"
  function joinNames(names) {
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(", ") + " et " + names[names.length - 1];
  }

  addChildBtn.addEventListener("click", function () {
    addChildRow();
    refreshStoryOptions();
  });

  // =========================================================
  //  Choix des histoires selon le nombre d'enfants
  // =========================================================
  function refreshStoryOptions() {
    const children = getChildren();
    const isGroup = children.length >= 2;
    currentList = isGroup ? GROUP_STORIES : STORIES;

    // Le lien de parenté n'a de sens qu'à plusieurs
    lienField.classList.toggle("hidden", !isGroup);

    const previous = storySelect.value;
    storySelect.innerHTML = "";
    currentList.forEach(function (story, index) {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = clean(story.title);
      storySelect.appendChild(option);
    });
    // On essaie de conserver le choix précédent si possible
    if (previous && currentList[previous]) {
      storySelect.value = previous;
    }
    updateDescription();
  }

  function updateDescription() {
    const story = currentList[storySelect.value];
    storyDesc.textContent = story ? story.description : "";
  }
  storySelect.addEventListener("change", updateDescription);

  // =========================================================
  //  Remplacement des marqueurs
  // =========================================================

  // Histoire à un seul héros
  function personalizeSingle(text, child) {
    const isGirl = child.gender === "f";
    const map = {
      "{prenom}": child.name,
      "{animal}": animalSelect.value,
      "{un}": isGirl ? "une" : "un",
      "{il}": isGirl ? "elle" : "il",
      "{Il}": isGirl ? "Elle" : "Il",
      "{e}": isGirl ? "e" : "",
      "{x}": isGirl ? "se" : "x",
      "{petit}": isGirl ? "petite" : "petit",
      "{Petit}": isGirl ? "Petite" : "Petit",
      "{ami}": isGirl ? "amie" : "ami",
      "{héros}": isGirl ? "héroïne" : "héros"
    };
    return replaceMarkers(text, map);
  }

  // Histoire de groupe (plusieurs enfants)
  function personalizeGroup(text, children) {
    const names = children.map(function (c) { return c.name; });
    // En français, le pluriel est masculin dès qu'il y a un garçon
    const allGirls = children.every(function (c) { return c.gender === "f"; });
    const pick = function (i) { return names[i % names.length]; };

    const map = {
      "{prenoms}": joinNames(names),
      "{prenom1}": pick(0),
      "{prenom2}": pick(1),
      "{prenom3}": pick(2),
      "{prenom4}": pick(3),
      "{lien}": lienSelect.value,
      "{animal}": animalSelect.value,
      "{elles}": allGirls ? "elles" : "ils",
      "{Elles}": allGirls ? "Elles" : "Ils",
      "{toutes}": allGirls ? "toutes" : "tous",
      "{Toutes}": allGirls ? "Toutes" : "Tous",
      "{es}": allGirls ? "es" : "s",
      "{ses}": allGirls ? "ses" : "x"
    };
    return replaceMarkers(text, map);
  }

  function replaceMarkers(text, map) {
    let result = text;
    Object.keys(map).forEach(function (marker) {
      result = result.split(marker).join(map[marker]);
    });
    return result;
  }

  // Enlève tous les marqueurs (pour les titres des menus)
  function clean(text) {
    return text.replace(/\{[^}]+\}/g, "").replace(/\s+/g, " ").trim();
  }

  // Majuscule en début de phrase
  function fixCapitals(text) {
    return text.replace(/(^|[.!?]\s+|: )([a-zàâäéèêëïîôöùûüç])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  }

  // =========================================================
  //  Génération de l'histoire
  // =========================================================
  function generateStory(event) {
    event.preventDefault();

    const children = getChildren();
    if (children.length === 0) {
      const first = childrenList.querySelector(".child-name");
      if (first) first.focus();
      return;
    }

    const isGroup = children.length >= 2;
    const story = currentList[storySelect.value] || currentList[0];

    const transform = function (text) {
      const filled = isGroup
        ? personalizeGroup(text, children)
        : personalizeSingle(text, children[0]);
      return fixCapitals(filled);
    };

    storyTitle.textContent = transform(story.title);
    storyTextEl.innerHTML = "";
    story.paragraphs.forEach(function (para) {
      const p = document.createElement("p");
      p.textContent = transform(para);
      storyTextEl.appendChild(p);
    });

    applyFontSize();
    setupSection.classList.add("hidden");
    outputSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    outputSection.focus();
  }

  form.addEventListener("submit", generateStory);

  // --- Retour aux réglages ---
  newBtn.addEventListener("click", function () {
    stopReading();
    outputSection.classList.add("hidden");
    setupSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Taille du texte ---
  function applyFontSize() {
    storyTextEl.style.fontSize = currentFontSize + "rem";
  }
  fontBigger.addEventListener("click", function () {
    currentFontSize = Math.min(currentFontSize + 0.15, 2.5);
    applyFontSize();
  });
  fontSmaller.addEventListener("click", function () {
    currentFontSize = Math.max(currentFontSize - 0.15, 0.9);
    applyFontSize();
  });

  // --- Impression ---
  printBtn.addEventListener("click", function () {
    window.print();
  });

  // =========================================================
  //  Lecture à voix haute
  // =========================================================
  const synth = window.speechSynthesis;

  function getFrenchVoice() {
    const voices = synth.getVoices();
    return (
      voices.find(function (v) { return v.lang === "fr-FR"; }) ||
      voices.find(function (v) { return v.lang && v.lang.indexOf("fr") === 0; }) ||
      null
    );
  }

  function readAloud() {
    if (!synth) {
      alert("La lecture à voix haute n'est pas disponible sur cet appareil.");
      return;
    }
    stopReading();

    const fullText =
      storyTitle.textContent + ". " +
      Array.prototype.map.call(storyTextEl.querySelectorAll("p"), function (p) {
        return p.textContent;
      }).join(" ");

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    const voice = getFrenchVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = function () {
      readBtn.classList.remove("hidden");
      stopBtn.classList.add("hidden");
    };

    synth.speak(utterance);
    readBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");
  }

  function stopReading() {
    if (synth && synth.speaking) {
      synth.cancel();
    }
    readBtn.classList.remove("hidden");
    stopBtn.classList.add("hidden");
  }

  readBtn.addEventListener("click", readAloud);
  stopBtn.addEventListener("click", stopReading);

  if (synth && typeof synth.onvoiceschanged !== "undefined") {
    synth.onvoiceschanged = getFrenchVoice;
  }

  // =========================================================
  //  Démarrage : on pré-remplit les quatre prénoms
  // =========================================================
  DEFAULT_CHILDREN.forEach(addChildRow);
  refreshStoryOptions();
})();
