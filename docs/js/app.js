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
    <h2>Choose</h2>
    ${menuSections.map(section => `
      <h3>${section.title}</h3>
      <ul>
        ${section.items.map(item =>
          `<li><a href="#/${item.id}">${item.label}</a></li>`
        ).join("")}
      </ul>
    `).join("")}
  `;

  view.innerHTML = `<p>Select an exercise.</p>`;
}

function router() {
  const route = (location.hash || "#/").replace("#/", "");

  if (!route) return renderMenu();

  const item = menuSections.flatMap(s => s.items).find(i => i.id === route);
  if (!item) return renderMenu();

  document.getElementById("menu").innerHTML =
    `<button id="backBtn">← Back to menu</button>`;

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
