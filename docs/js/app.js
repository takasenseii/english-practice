"use strict";

/* MENU + ROUTER */

const menuSections = [
  {
    title: "Exercises",
    items: [
      { id: "grammar",  label: "Grammar exercises",  render: renderGrammar },
      { id: "spelling", label: "Spelling exercises", render: renderSpelling }
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
        <div class="brand">English Practice</div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="pill">Grammar</div>
          <h3>Grammar exercises</h3>
          <p>Articles, time prepositions, present perfect vs past simple, subject–verb agreement.</p>
          <a class="btn" href="#/grammar">Open →</a>
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

function renderGrammar(root) {
  if (typeof currentUnmount === "function") {
    currentUnmount();
    currentUnmount = null;
  }
  if (typeof window.mountGrammar !== "function") {
    root.innerHTML = "<p>mountGrammar is not loaded. Check ./js/grammar.js</p>";
    return;
  }
  currentUnmount = window.mountGrammar(root) || null;
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
