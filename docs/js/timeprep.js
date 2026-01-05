// timeprep.js
// Prepositions: in / on / at (time) — standardized module: { id, title, generate, render }

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pad2(n){ return String(n).padStart(2,"0"); }
function normalize(s) { return String(s).trim().toLowerCase().replace(/\s+/g, " "); }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES_OF_DAY = ["the morning","the afternoon","the evening"];
const HOLIDAYS = ["Christmas","Easter","New Year’s Eve","New Year’s Day","Halloween"];

function randomClockTime() {
  const h = rand([1,2,3,4,5,6,7,8,9,10,11,12]);
  const m = rand([0,5,10,15,20,25,30,35,40,45,50,55]);
  return `${h}:${pad2(m)}`;
}

function randomDate() {
  const day = rand([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
  const suf =
    (day % 10 === 1 && day !== 11) ? "st" :
    (day % 10 === 2 && day !== 12) ? "nd" :
    (day % 10 === 3 && day !== 13) ? "rd" : "th";
  return `${day}${suf}`;
}

function generatePrepositionsTime(n=10) {
  const frames = [
    () => ({ text: `My birthday is ___ ${rand(MONTHS)}.`, answer: "in" }),
    () => ({ text: `School starts ___ ${rand(MONTHS)}.`, answer: "in" }),
    () => ({ text: `We usually study ___ ${rand(TIMES_OF_DAY)}.`, answer: "in" }),
    () => ({ text: `I started learning English ___ ${rand(["2018","2019","2020","2021","2022","2023","2024","2025","2026"])}.`, answer: "in" }),

    () => ({ text: `We have PE ___ ${rand(WEEKDAYS)}.`, answer: "on" }),
    () => ({ text: `The test is ___ ${rand(WEEKDAYS)}.`, answer: "on" }),
    () => ({ text: `The deadline is ___ the ${randomDate()}.`, answer: "on" }),
    () => ({ text: `We have a quiz ___ ${rand(["Monday morning","Tuesday afternoon","Thursday evening"])}.`, answer: "on" }),

    () => ({ text: `The lesson starts ___ ${randomClockTime()}.`, answer: "at" }),
    () => ({ text: `Please call me ___ ${randomClockTime()}.`, answer: "at" }),
    () => ({ text: `We met ___ ${rand(HOLIDAYS)}.`, answer: "at" }),
    () => ({ text: `The train leaves ___ ${rand(["noon","midnight"])}.`, answer: "at" }),

    () => ({ text: `I relax ___ the weekend.`, answer: "at" })
  ];

  const out = [];
  for (let i = 0; i < n; i++) {
    const q = rand(frames)();
    out.push({ prompt: q.text, answer: q.answer });
  }
  return out;
}

function render(container) {
  container.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>Time prepositions</h2>
        <p>Type <b>in</b>, <b>on</b>, or <b>at</b>.</p>

        <div class="row">
          <label>Questions:
            <input id="n" type="number" min="1" max="50" value="10" />
          </label>
          <button id="new">New set</button>
        </div>

        <div id="list"></div>

        <div class="row">
          <button id="check">Check</button>
          <button id="show">Show answers</button>
        </div>

        <div id="result" class="result"></div>
      </div>
    </div>
  `;

  const nEl = container.querySelector("#n");
  const listEl = container.querySelector("#list");
  const resultEl = container.querySelector("#result");

  let items = [];

  function draw() {
    listEl.innerHTML = items
      .map((it, idx) => `
        <div class="q" data-i="${idx}">
          <div class="left">
            <div class="prompt">${idx + 1}. ${it.prompt.replace("___", "<span class='gap'>___</span>")}</div>
            <div class="row">
              <input data-i="${idx}" placeholder="in / on / at" />
              <div class="ans" data-ans="${idx}"></div>
            </div>
          </div>
        </div>
      `)
      .join("");
    resultEl.textContent = "";
  }

  function newSet() {
    const n = Math.max(1, Math.min(50, Number(nEl.value || 10)));
    items = generatePrepositionsTime(n);
    draw();
  }

  function check() {
    const inputs = Array.from(listEl.querySelectorAll("input[data-i]"));
    let correct = 0;
    let attempted = 0;

    inputs.forEach((inp) => {
      const i = Number(inp.dataset.i);
      const student = normalize(inp.value);
      if (student) attempted++;
      if (student && student === items[i].answer) correct++;
    });

    if (attempted === 0) {
      resultEl.textContent = "Enter at least one answer.";
      return;
    }

    resultEl.textContent = `Score: ${correct}/${items.length}`;
  }

  function showAnswers() {
    items.forEach((it, i) => {
      const qEl = listEl.querySelector(`.q[data-i="${i}"]`);
      const ansEl = listEl.querySelector(`.ans[data-ans="${i}"]`);
      if (!qEl || !ansEl) return;

      ansEl.textContent = it.answer;
      qEl.classList.add("show-ans");
    });

    resultEl.textContent = "Answers shown.";
  }

  container.querySelector("#new").onclick = newSet;
  container.querySelector("#check").onclick = check;
  container.querySelector("#show").onclick = showAnswers;

  newSet();
}

export { generatePrepositionsTime };

export default {
  id: "timeprep",
  title: "Time prepositions",
  generate: generatePrepositionsTime,
  render,
};
