import avsan from "./avsan.js";
import timeprep from "./timeprep.js";
import ppvsps from "./ppvsps.js";
import sva from "./sva.js";

// optional; modules are strict by default
"use strict";

// GLOBAL STATS (persisted in localStorage)
const STATS_KEY = "english_study_space_global_stats_v1";

function loadGlobalStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return { totalAttempts: 0, totalCorrect: 0 };
    }
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.totalAttempts !== "number" ||
      typeof parsed.totalCorrect !== "number"
    ) {
      return { totalAttempts: 0, totalCorrect: 0 };
    }
    return parsed;
  } catch (e) {
    return { totalAttempts: 0, totalCorrect: 0 };
  }
}

function saveGlobalStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // ignore write errors (private mode etc.)
  }
}

// load once when the app starts
const globalStats = loadGlobalStats();

function getGlobalAccuracy() {
  if (!globalStats.totalAttempts) return 0;
  return Math.round(
    (globalStats.totalCorrect / globalStats.totalAttempts) * 100
  );
}

// make available to modules
window.updateGlobalStatsUI = function () {
  const text = globalStats.totalAttempts
    ? `Overall accuracy: ${globalStats.totalCorrect}/${globalStats.totalAttempts} (${getGlobalAccuracy()}%)`
    : `Overall accuracy: –`;

  document.querySelectorAll(".global-stats").forEach((el) => {
    el.textContent = text;
  });
};

window.recordExerciseResult = function (attempted, correct) {
  if (!attempted) return;
  globalStats.totalAttempts += attempted;
  globalStats.totalCorrect += correct;
  saveGlobalStats(globalStats);
  window.updateGlobalStatsUI();
};



/* MENU + ROUTER */

const menuSections = [
  {
    title: "Exercises",
    items: [
      { id: "avsan",    label: "A vs An",                 render: renderAvsan },
      { id: "timeprep", label: "Time prepositions",       render: renderTimeprep },
      { id: "ppvsps",   label: "PP vs PS",                render: renderPpvsps },
      { id: "sva",      label: "Subject–verb agreement",  render: renderSva },
      { id: "spelling", label: "Spelling exercises",      render: renderSpelling }
    ]
  }
];

let currentUnmount = null;

function renderMenu() {
  if (typeof currentUnmount === "function") {
    currentUnmount();
    currentUnmount = null;
  }

  const menu = document.getElementById("menu");
  const view = document.getElementById("view");

menu.innerHTML = `
  <div class="container">
    <div class="topbar">
      <div class="brand">English Study Space Online</div>
      <div class="global-stats"></div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="pill">Grammar</div>
        <h3>A vs An</h3>
        <p>Choose the correct article.</p>
        <a class="btn" href="#/avsan">Open →</a>
      </div>

      <div class="card">
        <div class="pill">Grammar</div>
        <h3>Time prepositions</h3>
        <p>In / on / at.</p>
        <a class="btn" href="#/timeprep">Open →</a>
      </div>

      <div class="card">
        <div class="pill">Grammar</div>
        <h3>PP vs PS</h3>
        <p>Present perfect vs past simple.</p>
        <a class="btn" href="#/ppvsps">Open →</a>
      </div>

      <div class="card">
        <div class="pill">Grammar</div>
        <h3>Subject–verb agreement</h3>
        <p>Present simple verb forms.</p>
        <a class="btn" href="#/sva">Open →</a>
      </div>

      <div class="card">
        <div class="pill">Spelling</div>
        <h3>Spelling exercises</h3>
        <p>Save your own word list, practise with audio, check answers, track score.</p>
        <a class="btn" href="#/spelling">Open →</a>
      </div>
    </div>
  </div>
`;

updateGlobalStatsUI();
  view.innerHTML = "";
}

function router() {
  const route = (location.hash || "#/").replace("#/", "");

  if (!route) return renderMenu();

  const item = menuSections.flatMap(s => s.items).find(i => i.id === route);
  if (!item) return renderMenu();

document.getElementById("menu").innerHTML = `
  <div class="container">
    <button class="backBtn" id="backBtn">← Back to menu</button>
  </div>
`;

  document.getElementById("backBtn").onclick = () => { location.hash = "#/"; };

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
function renderTimeprep(root) { mountExercise(timeprep, root); }
function renderPpvsps(root)   { mountExercise(ppvsps, root); }
function renderSva(root)      { mountExercise(sva, root); }

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
