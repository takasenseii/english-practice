import avsan from "./avsan.js";
import capital from "./capitalisation.js"; 
import timeprep from "./timeprep.js";
import ppvsps from "./ppvsps.js";
import sva from "./sva.js";
import idioms from "./idioms.js";
import phrasalverbs from "./phrasalverbs.js";
import tutor from "./tutor.js";
import writing from "./writing.js";
import ibc from "./ibc.js";
import improveWriting from "./improve-writing.js";
import speaking from "./speaking.js";
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
    id: "writing",
    title: "Writing",
    description: "Plan, organise and develop structured texts.",
    items: [
      { id: "ibc", label: "IBC: Whole Essay", description: "Practise introductions, body plans and conclusions at three levels.", render: renderIbc },
      { id: "peel", label: "PEEL: Body Paragraphs", description: "Read complete model essays and practise building body paragraphs.", render: renderWriting },
      { id: "improve-writing", label: "Improve Your Writing", description: "Practise evidence, punctuation, transitions and linking words.", render: renderWritingImprovement }
    ]
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Organise and deliver clear oral presentations.",
    items: [
      { id: "oral-ibc", label: "IBC for Oral Presentations", description: "Plan an introduction, body and conclusion for a presentation.", render: renderSpeaking }
    ]
  },
  {
    id: "private-tutor",
    title: "Private Tutor",
    description: "Choose your English course, unit and learning resource.",
    countLabel: "courses",
    countLabel: "courses",
    items: ["English 1", "English 2", "English 3"].map((label, index) => ({
      id: `private-tutor/english-${index + 1}`,
      label,
      description: `Open units and resources for ${label}.`,
      badge: "Course"
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
            <div class="category-count">${section.items.length} ${section.countLabel || (section.items.length === 1 ? "activity" : "activities")}</div>
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

function renderTutorCourse(courseId) {
  clearMountedView();
  const courseNumber = courseId.replace("english-", "");
  const courseTitle = `English ${courseNumber}`;
  const courseMaterials = tutorMaterials.filter(material => material.courseId === courseId);
  const units = [...new Map(courseMaterials.map(material => [material.unitId, {
    id: material.unitId,
    title: material.unitTitle,
    count: courseMaterials.filter(item => item.unitId === material.unitId).length
  }])).values()].sort((a, b) => a.title.localeCompare(b.title));

  document.getElementById("menu").innerHTML = `
    <div class="container">
      <button class="backBtn" id="backBtn">← Back to Private Tutor</button>
      <div class="category-heading"><div class="pill">Course</div><h1>${courseTitle}</h1><p>Choose a unit.</p></div>
      ${units.length ? `<div class="grid">${units.map(unit => `
        <div class="card">
          <div class="pill">Unit</div>
          <h3>${unit.title}</h3>
          <p>${unit.count} ${unit.count === 1 ? "resource" : "resources"}</p>
          <a class="btn" href="#/private-tutor/${courseId}/${unit.id}">Choose →</a>
        </div>`).join("")}</div>` : `<div class="card empty-category"><h2>No units yet</h2><p>Materials for ${courseTitle} will appear here when they are added.</p></div>`}
    </div>`;
  document.getElementById("backBtn").onclick = () => { location.hash = "#/private-tutor"; };
}

function renderTutorUnit(courseId, unitId) {
  clearMountedView();
  const resources = tutorMaterials
    .filter(material => material.courseId === courseId && material.unitId === unitId)
    .sort((a, b) => a.title.localeCompare(b.title));
  if (!resources.length) { renderTutorCourse(courseId); return; }
  const unitTitle = resources[0].unitTitle;

  function resourceSizeLabel(material) {
    if (material.mediaType === "youtube") {
      return `Approx. ${material.durationMinutes} ${material.durationMinutes === 1 ? "minute" : "minutes"}`;
    }
    const words = (material.text || [])
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return `${words} ${words === 1 ? "word" : "words"}`;
  }

  document.getElementById("menu").innerHTML = `
    <div class="container">
      <button class="backBtn" id="backBtn">← Back to English ${courseId.replace("english-", "")}</button>
      <div class="category-heading"><div class="pill">Unit</div><h1>${unitTitle}</h1><p>Choose a resource.</p></div>
      <div class="grid">${resources.map(material => `
        <div class="card">
          <div class="pill">${material.mediaType === "youtube" ? "Video" : "Reading"}</div>
          <h3>${material.title}</h3>
          <p>${material.topic}</p>
          <p><strong>${resourceSizeLabel(material)}</strong></p>
          <a class="btn" href="#/private-tutor/${courseId}/${unitId}/${material.id}">Open →</a>
        </div>`).join("")}</div>
    </div>`;
  document.getElementById("backBtn").onclick = () => { location.hash = `#/private-tutor/${courseId}`; };
}


function router() {
  const route = (location.hash || "#/").replace("#/", "");

  if (route === "ibc-peel") {
    location.replace("#/peel");
    return;
  }

  if (!route) {
    renderMenu();
    return;
  }

  const section = menuSections.find(item => item.id === route);
  if (section) {
    renderCategory(section);
    return;
  }

  const tutorRoute = route.split("/");
  if (tutorRoute[0] === "private-tutor" && tutorRoute.length >= 2) {
    const [, courseId, unitId, materialId] = tutorRoute;
    if (!unitId) {
      renderTutorCourse(courseId);
      return;
    }
    if (!materialId) {
      renderTutorUnit(courseId, unitId);
      return;
    }
    const material = tutorMaterials.find(item => item.id === materialId && item.courseId === courseId && item.unitId === unitId);
    if (!material) {
      renderTutorUnit(courseId, unitId);
      return;
    }
    document.getElementById("menu").innerHTML = `<div class="container"><button class="backBtn" id="backBtn">← Back to ${material.unitTitle}</button></div>`;
    document.getElementById("backBtn").onclick = () => { location.hash = `#/private-tutor/${courseId}/${unitId}`; };
    renderTutor(document.getElementById("view"), material.id);
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
function renderWriting(root) { mountExercise(writing, root); }
function renderIbc(root) { mountExercise(ibc, root); }
function renderWritingImprovement(root) { mountExercise(improveWriting, root); }
function renderSpeaking(root) { mountExercise(speaking, root); }
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
