/* Logique de l'application "Les Histoires de Mamie" */

(function () {
  "use strict";

  // --- Récupération des éléments de la page ---
  const form = document.getElementById("story-form");
  const nameInput = document.getElementById("child-name");
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

  // --- Remplit la liste déroulante des histoires ---
  STORIES.forEach(function (story, index) {
    const option = document.createElement("option");
    option.value = index;
    // On enlève les marqueurs pour le titre du menu
    option.textContent = clean(story.title);
    storySelect.appendChild(option);
  });

  function updateDescription() {
    const story = STORIES[storySelect.value];
    storyDesc.textContent = story ? story.description : "";
  }
  storySelect.addEventListener("change", updateDescription);
  updateDescription();

  // --- Remplacement des marqueurs par les bonnes valeurs ---
  function personalize(text, data) {
    const isGirl = data.gender === "f";

    const map = {
      "{prenom}": data.name,
      "{animal}": data.animal,
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

    let result = text;
    Object.keys(map).forEach(function (marker) {
      result = result.split(marker).join(map[marker]);
    });
    return result;
  }

  // Enlève simplement tous les marqueurs (pour les menus)
  function clean(text) {
    return text.replace(/\{[^}]+\}/g, "").replace(/\s+/g, " ").trim();
  }

  // Met une majuscule à la première lettre (le prénom commence parfois la phrase)
  function fixCapitals(text) {
    // Majuscule en début de paragraphe et après . ! ? :
    return text.replace(/(^|[.!?]\s+|: )([a-zàâäéèêëïîôöùûüç])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  }

  // --- Génération de l'histoire ---
  function generateStory(event) {
    event.preventDefault();

    const rawName = nameInput.value.trim();
    if (!rawName) {
      nameInput.focus();
      return;
    }

    // Première lettre du prénom en majuscule
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    const data = {
      name: name,
      animal: animalSelect.value,
      gender: form.elements["gender"].value
    };

    const story = STORIES[storySelect.value];

    // Titre
    storyTitle.textContent = fixCapitals(personalize(story.title, data));

    // Paragraphes
    storyTextEl.innerHTML = "";
    story.paragraphs.forEach(function (para) {
      const p = document.createElement("p");
      p.textContent = fixCapitals(personalize(para, data));
      storyTextEl.appendChild(p);
    });

    applyFontSize();

    // Affichage
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
    nameInput.focus();
    nameInput.select();
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

  // --- Lecture à voix haute (synthèse vocale) ---
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
    utterance.rate = 0.9;   // un peu plus lent, pour les enfants
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

  // Certains navigateurs chargent les voix de façon asynchrone
  if (synth && typeof synth.onvoiceschanged !== "undefined") {
    synth.onvoiceschanged = getFrenchVoice;
  }
})();
