import avsan from "./avsan.js";
import capital from "./capitalisation.js"; 
import timeprep from "./timeprep.js";
import ppvsps from "./ppvsps.js";
import sva from "./sva.js";
import idioms from "./idioms.js";
import phrasalverbs from "./phrasalverbs.js";
import tutor from "./tutor.js";
import { tutorMaterials } from "./tutor-materials.js";



// optional; modules are strict by default
"use strict";

// PER-EXERCISE STATS (persisted in localStorage)
const STATS_KEY = "english_study_space_per_exercise_stats_v1";

function loadAllStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveAllStats(allStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
  } catch (e) {
    // ignore
  }
}

const allStats = loadAllStats();

function getExerciseStats(id) {
  if (!allStats[id]) {
    allStats[id] = { totalAttempts: 0, totalCorrect: 0 };
  }
  return allStats[id];
}

function getExerciseAccuracy(st) {
  if (!st.totalAttempts) return 0;
  return Math.round((st.totalCorrect / st.totalAttempts) * 100);
}

// called by pages to refresh any .global-stats[data-ex="..."]
window.updateGlobalStatsUI = function () {
  document.querySelectorAll(".global-stats[data-ex]").forEach((el) => {
    const id = el.dataset.ex;
    const st = getExerciseStats(id);
    const txt = st.totalAttempts
      ? `Accuracy: ${st.totalCorrect}/${st.totalAttempts} (${getExerciseAccuracy(st)}%)`
      : "Accuracy: –";
    el.textContent = txt;
  });
};

// called by exercises when user presses "Check"
window.recordExerciseResult = function (exerciseId, attempted, correct) {
  if (!exerciseId || !attempted) return;
  const st = getExerciseStats(exerciseId);
  st.totalAttempts += attempted;
  st.totalCorrect += correct;
  saveAllStats(allStats);
  window.updateGlobalStatsUI();
};


/* MENU + ROUTER */

const menuSections = [
  {
    id: "grammar",
    title: "Grammar",
    description: "Practise grammar rules and sentence structure.",
    items: [
      { id: "avsan", label: "A vs An", description: "Choose the correct article.", render: renderAvsan },
      { id: "capital", label: "Capitalisation", description: "Fix capital letters in sentences.", render: renderCapital },
      { id: "ppvsps", label: "Present Perfect vs Past Simple", description: "Choose the correct tense.", render: renderPpvsps },
      { id: "sva", label: "Subject–Verb Agreement", description: "Practise present simple verb forms.", render: renderSva },
      { id: "timeprep", label: "Time Prepositions", description: "Practise in, on and at.", render: renderTimeprep }
    ]
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    description: "Build vocabulary with words, idioms and expressions.",
    items: [
      { id: "idioms", label: "Idioms", description: "Choose the meaning of common idioms.", render: renderIdioms },
      { id: "phrasalverbs", label: "Phrasal Verbs", description: "Choose the meaning of common phrasal verbs.", render: renderPhrasalverbs }
    ]
  },
  {
    id: "spelling",
    title: "Spelling",
    description: "Practise spelling with personalised word lists.",
    items: [
      { id: "spelling-exercises", legacyId: "spelling", label: "Spelling Exercises", description: "Save a word list, practise with audio and track your score.", render: renderSpelling }
    ]
  },
  {
    id: "private-tutor",
    title: "Private Tutor",
    description: "Work actively with articles, videos and guided questions.",
    items: tutorMaterials.map(material => ({
      id: `tutor/${material.id}`,
      label: material.title,
      description: material.topic,
      badge: material.mediaType === "youtube" ? "Video" : "Reading",
      render: root => renderTutor(root, material.id)
    }))
  }
];

let currentUnmount = null;

function clearMountedView() {
  if (typeof currentUnmount === "function") {
    currentUnmount();
    currentUnmount = null;
  }
  document.getElementById("view").innerHTML = "";
}

function renderMenu() {
  clearMountedView();

  const menu = document.getElementById("menu");
  const sections = [...menuSections].sort((a, b) => a.title.localeCompare(b.title));

  menu.innerHTML = `
    <div class="container">
      <div class="topbar">
        <div class="brand">English Practice Space Online</div>
        <p class="home-intro">What would you like to practise?</p>
      </div>
      <div class="grid category-grid">
        ${sections.map(section => `
          <div class="card category-card">
            <div class="pill">Category</div>
            <h2>${section.title}</h2>
            <p>${section.description}</p>
            <div class="category-count">${section.items.length} ${section.items.length === 1 ? "activity" : "activities"}</div>
            <a class="btn" href="#/${section.id}">Choose →</a>
          </div>`).join("")}
      </div>
    </div>`;
}

function renderCategory(section) {
  clearMountedView();
  const menu = document.getElementById("menu");
  const items = [...section.items].sort((a, b) => a.label.localeCompare(b.label));

  menu.innerHTML = `
    <div class="container">
      <button class="backBtn" id="backBtn">← All categories</button>
      <div class="category-heading">
        <div class="pill">${section.title}</div>
        <h1>${section.title}</h1>
        <p>${section.description}</p>
      </div>
      <div class="grid">
        ${items.map(item => `
          <div class="card">
            <div class="pill">${item.badge || section.title}</div>
            <h3>${item.label}</h3>
            <p>${item.description}</p>
            ${section.id !== "private-tutor" ? `<div class="global-stats" data-ex="${item.legacyId || item.id}"></div>` : ""}
            <a class="btn" href="#/${item.id}">Open →</a>
          </div>`).join("")}
      </div>
    </div>`;

  document.getElementById("backBtn").onclick = () => { location.hash = "#/"; };
  window.updateGlobalStatsUI();
}


function router() {
  const route = (location.hash || "#/").replace("#/", "");

  if (!route) {
    renderMenu();
    return;
  }

  const section = menuSections.find(item => item.id === route);
  if (section) {
    renderCategory(section);
    return;
  }

  const legacyItem = menuSections.flatMap(s => s.items).find(i => i.legacyId === route);
  const item = menuSections.flatMap(s => s.items).find(i => i.id === route) || legacyItem;
  if (!item) {
    renderMenu();
    return;
  }

  const parentSection = menuSections.find(sectionItem => sectionItem.items.includes(item));

  document.getElementById("menu").innerHTML = `
    <div class="container">
      <button class="backBtn" id="backBtn">← Back to ${parentSection.title}</button>
    </div>
  `;

  document.getElementById("backBtn").onclick = () => { location.hash = `#/${parentSection.id}`; };

  item.render(document.getElementById("view"));
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

/* MOUNTED EXERCISES */

function mountExercise(mod, root) {
  if (typeof currentUnmount === "function") {
    currentUnmount();
    currentUnmount = null;
  }
  mod.render(root);
  currentUnmount = null;
}

function renderAvsan(root)    { mountExercise(avsan, root); }
function renderCapital(root)  { mountExercise(capital, root); }
function renderTimeprep(root) { mountExercise(timeprep, root); }
function renderPpvsps(root)   { mountExercise(ppvsps, root); }
function renderSva(root)      { mountExercise(sva, root); }
function renderIdioms(root) { mountExercise(idioms, root); }
function renderPhrasalverbs(root) { mountExercise(phrasalverbs, root); }
function renderTutor(root, materialId) {
  if (typeof currentUnmount === "function") {
    currentUnmount();
    currentUnmount = null;
  }
  tutor.render(root, materialId);
}

function renderSpelling(root) {
  if (typeof currentUnmount === "function") {
    currentUnmount();
    currentUnmount = null;
  }
  if (typeof window.mountSpelling !== "function") {
    root.innerHTML = "<p>mountSpelling is not loaded. Check ./js/spelling.js</p>";
    return;
  }
  currentUnmount = window.mountSpelling(root) || null;
}
