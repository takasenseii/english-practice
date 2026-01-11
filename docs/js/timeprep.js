// timeprep.js
// Prepositions: in / on / at (time) — standardized module: { id, title, generate, render }

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pad2(n){ return String(n).padStart(2,"0"); }
function normalize(s) { return String(s).trim().toLowerCase().replace(/\s+/g, " "); }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES_OF_DAY = ["the morning","the afternoon","the evening"];
const HOLIDAYS = ["Christmas","Easter","New Year’s Eve","New Year’s Day","Halloween"];
// FULL years 1974 → 2026
const YEARS = [];
for (let y = 1974; y <= 2026; y++) YEARS.push(String(y));

// DECADES (1970s → 2020s)
const DECADES = [];
for (let d = 1970; d <= 2020; d += 10) {
  DECADES.push(`${d}s`); // e.g. "1990s"
}

const SUB_DECADES = [];
for (let d = 1970; d <= 2020; d += 10) {
  SUB_DECADES.push(`the early ${d}s`);
  SUB_DECADES.push(`the mid-${d}s`);
  SUB_DECADES.push(`the late ${d}s`);
}

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

function generatePrepositionsTime(n = 10) {
  const frames = [
    // ---- IN: long periods, months, years, parts of day ----
    () => ({ prompt: `My birthday is ___ ${rand(MONTHS)}.`, answer: "in" }),
    () => ({ prompt: `School starts ___ ${rand(MONTHS)}.`, answer: "in" }),
    () => ({ prompt: `We usually study ___ ${rand(TIMES_OF_DAY)}.`, answer: "in" }),
    () => ({ prompt: `I started learning English ___ ${rand(YEARS)}.`, answer: "in" }),
    () => ({ prompt: `They moved to this city ___ ${rand(YEARS)}.`, answer: "in" }),
    () => ({ prompt: `We often travel ___ summer.`, answer: "in" }),
    () => ({ prompt: `It usually snows here ___ winter.`, answer: "in" }),
    () => ({ prompt: `The project will finish ___ ${rand(["two weeks","three months","six months","a year"])}.`, answer: "in" }),
    () => ({ prompt: `I like to go for a walk ___ the evening.`, answer: "in" }),
    () => ({ prompt: `He takes a shower ___ the morning.`, answer: "in" }),
    () => ({ prompt: `Many people are tired ___ the middle of the week.`, answer: "in" }),
    () => ({ prompt: `They usually have exams ___ June.`, answer: "in" }),
    () => ({ prompt: `I was born ___ the 2000s.`, answer: "in" }),
    () => ({ prompt: `We will see real results ___ a few days.`, answer: "in" }),
    () => ({ prompt: `The match is sometime ___ October.`, answer: "in" }),
    () => ({ prompt: `She learned to drive ___ her twenties.`, answer: "in" }),

    // ---- ON: days, dates, specific day+part of day ----
    () => ({ prompt: `We have PE ___ ${rand(WEEKDAYS)}.`, answer: "on" }),
    () => ({ prompt: `The test is ___ ${rand(WEEKDAYS)}.`, answer: "on" }),
    () => ({ prompt: `The deadline is ___ the ${randomDate()}.`, answer: "on" }),
    () => ({ prompt: `We have a quiz ___ ${rand(["Monday morning","Tuesday afternoon","Thursday evening"])}.`, answer: "on" }),
    () => ({ prompt: `My next game is ___ ${rand(WEEKDAYS)} evening.`, answer: "on" }),
    () => ({ prompt: `The meeting is ___ ${randomDate()} of ${rand(MONTHS)}.`, answer: "on" }),
    () => ({ prompt: `We usually have pizza ___ Friday nights.`, answer: "on" }),
    () => ({ prompt: `Our class trip is ___ the first day of school.`, answer: "on" }),
    () => ({ prompt: `I will see the doctor ___ ${rand(WEEKDAYS)} morning.`, answer: "on" }),
    () => ({ prompt: `He visited his grandparents ___ ${rand(["Saturday afternoon","Sunday morning"])}.`, answer: "on" }),
    () => ({ prompt: `The movie comes out ___ my birthday.`, answer: "on" }),
    () => ({ prompt: `We had a big test ___ the last day of term.`, answer: "on" }),
    () => ({ prompt: `We usually visit family ___ Christmas Day.`, answer: "on" }),
    () => ({ prompt: `The concert is ___ 15${rand(["th","th","th","th"])} of May.`, answer: "on" }),

    // ---- AT: exact times + fixed phrases ----
    () => ({ prompt: `The lesson starts ___ ${randomClockTime()}.`, answer: "at" }),
    () => ({ prompt: `Please call me ___ ${randomClockTime()}.`, answer: "at" }),
    () => ({ prompt: `The train leaves ___ ${rand(["noon","midnight"])}.`, answer: "at" }),
    () => ({ prompt: `We usually have dinner ___ ${rand(["7 o'clock","half past six","eight o'clock"])}.`, answer: "at" }),
    () => ({ prompt: `The shop opens ___ 9:00.`, answer: "at" }),
    () => ({ prompt: `Our meeting is ___ 3:30.`, answer: "at" }),
    () => ({ prompt: `I feel sleepy ___ night.`, answer: "at" }),
    () => ({ prompt: `They have football training ___ the weekend.`, answer: "at" }),
    () => ({ prompt: `I like to relax ___ the weekend.`, answer: "at" }),
    () => ({ prompt: `We have lunch ___ noon.`, answer: "at" }),
    () => ({ prompt: `The show starts ___ exactly 8 p.m.`, answer: "at" }),
    () => ({ prompt: `He usually wakes up ___ six in the morning.`, answer: "at" }),
    () => ({ prompt: `The fireworks start ___ midnight on New Year’s Eve.`, answer: "at" }),
    () => ({ prompt: `The bell rings ___ the end of the lesson.`, answer: "at" }),
    () => ({ prompt: `They normally go to bed ___ the same time every day.`, answer: "at" })
  ];

  const out = [];
  for (let i = 0; i < n; i++) {
    const q = rand(frames)();
    out.push({ prompt: q.prompt, answer: q.answer });
  }
  return out;
}

function render(container) {
  container.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>Time prepositions</h2>
        <div class="global-stats" data-ex="timeprep" style="font-size:0.85rem; opacity:0.8;"></div>
        <p>Choose <b>in</b>, <b>on</b> or <b>at</b>.</p>

        <button id="toggleExplain" class="explain-btn">Show explanation</button>
        <div id="explainBox" class="explain-box" style="display:none; margin-top:8px; font-size:0.9rem;">
          <p>Use <b>in</b>, <b>on</b> and <b>at</b> with time like this:</p>
          <ul>
            <li><b>in</b> + long periods: <i>in 2020, in July, in the morning, in the 1990s</i></li>
            <li><b>on</b> + days and dates: <i>on Monday, on Friday morning, on 12 May</i></li>
            <li><b>at</b> + exact times and fixed phrases: <i>at 7 o'clock, at noon, at night, at the weekend</i></li>
          </ul>
          <p>Think: <b>in</b> = “big time”, <b>on</b> = “days / dates”, <b>at</b> = “exact time”.</p>
        </div>

        <div class="row" style="margin-top:12px;">
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

  // explanation toggle
  const explainBtn = container.querySelector("#toggleExplain");
  const explainBox = container.querySelector("#explainBox");
  let explainOpen = false;

  explainBtn.onclick = () => {
    explainOpen = !explainOpen;
    explainBox.style.display = explainOpen ? "block" : "none";
    explainBtn.textContent = explainOpen ? "Hide explanation" : "Show explanation";
  };

  // stats line inside exercise
  if (typeof window.updateGlobalStatsUI === "function") {
    window.updateGlobalStatsUI();
  }

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

    inputs.forEach(inp => {
      const i = Number(inp.dataset.i);
      const student = normalize(inp.value);
      const qEl = inp.closest(".q");

      // remove old mark
      const old = qEl.querySelector(".mark");
      if (old) old.remove();

      if (!student) return;

      attempted++;

      const isCorrect = student === normalize(items[i].answer);
      if (isCorrect) correct++;

      const mark = document.createElement("span");
      mark.className = "mark " + (isCorrect ? "ok" : "bad");
      mark.textContent = isCorrect ? "✔" : "✖";

      inp.after(mark);
    });

    if (attempted === 0) {
      resultEl.textContent = "Enter at least one answer.";
      return;
    }

    resultEl.textContent = `Score: ${correct}/${items.length}`;

    // update stats for THIS exercise only
    if (typeof window.recordExerciseResult === "function") {
      window.recordExerciseResult("timeprep", attempted, correct);
    }
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
