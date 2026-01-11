// ppvsps.js
// Present perfect vs past simple — standardized module: { id, title, generate, render }

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function normalizeSpaces(s){ return String(s).trim().replace(/\s+/g," "); }
function normalize(s){ return normalizeSpaces(s).toLowerCase(); }

const VERBS = [
  { base:"go", ps:"went", pp:"gone" },
  { base:"see", ps:"saw", pp:"seen" },
  { base:"eat", ps:"ate", pp:"eaten" },
  { base:"do", ps:"did", pp:"done" },
  { base:"write", ps:"wrote", pp:"written" },
  { base:"take", ps:"took", pp:"taken" },
  { base:"buy", ps:"bought", pp:"bought" },
  { base:"make", ps:"made", pp:"made" },
  { base:"choose", ps:"chose", pp:"chosen" },
  { base:"break", ps:"broke", pp:"broken" },
  { base:"meet", ps:"met", pp:"met" },
  { base:"read", ps:"read", pp:"read" }
];

const SUBJECTS = [
  { s:"I", have:"have" },
  { s:"You", have:"have" },
  { s:"We", have:"have" },
  { s:"They", have:"have" },
  { s:"He", have:"has" },
  { s:"She", have:"has" }
];

const PP_MARKERS = [
  "already","just","recently","so far","today",
  "this week","this month","in my life","yet","ever","never"
];

const PS_MARKERS = [
  "yesterday","last week","last month","last year",
  "two days ago","three weeks ago","in 2018","in 2020",
  "when I was younger","during the holiday"
];

function generatePPvsPS(n = 10) {
  const out = [];

  for (let i = 0; i < n; i++) {
    const subj = rand(SUBJECTS);
    const v = rand(VERBS);
    const usePP = Math.random() < 0.5;

    if (usePP) {
      const marker = rand(PP_MARKERS);
      const type = rand(["statement","negative","question"]);

      if (type === "question") {
        const aux = subj.have.charAt(0).toUpperCase() + subj.have.slice(1);
        out.push({ prompt: `___ ${subj.s} ever (${v.base}) ${marker}?`, answer: aux });
      } else if (type === "negative") {
        out.push({ prompt: `${subj.s} ___ not (${v.base}) ${marker}.`, answer: `${subj.have} ${v.pp}` });
      } else {
        out.push({ prompt: `${subj.s} ___ (${v.base}) ${marker}.`, answer: `${subj.have} ${v.pp}` });
      }
    } else {
      const marker = rand(PS_MARKERS);
      const type = rand(["statement","negative","question"]);

      if (type === "question") {
        out.push({ prompt: `___ ${subj.s} (${v.base}) it ${marker}?`, answer: "Did" });
      } else if (type === "negative") {
        out.push({ prompt: `${subj.s} ___ not (${v.base}) ${marker}.`, answer: v.ps });
      } else {
        out.push({ prompt: `${subj.s} ___ (${v.base}) ${marker}.`, answer: v.ps });
      }
    }
  }

  return out.map(x => ({
    prompt: normalizeSpaces(x.prompt),
    answer: normalizeSpaces(x.answer)
  }));
}

function render(container) {
  container.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>Present perfect vs Past simple</h2>
        <p>Type the correct form (e.g. <b>have eaten</b>, <b>has eaten</b>, <b>went</b>, <b>Did</b>).</p>

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

  // guard against double-recording
  let counted = false;

  let items = [];

  function draw() {
    listEl.innerHTML = items
      .map((it, idx) => `
        <div class="q" data-i="${idx}">
          <div class="left">
            <div class="prompt">
              ${idx + 1}. ${it.prompt.replace("___", "<span class='gap'>___</span>")}
            </div>
            <div class="row">
              <input data-i="${idx}" placeholder="Type here" />
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
    items = generatePPvsPS(n);
    draw();
    counted = false;   // reset on new questions
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

  // update stats for PP vs PS (only once per set)
  if (!counted && typeof window.recordExerciseResult === "function") {
    window.recordExerciseResult("ppvsps", attempted, correct);
    counted = true;
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

export { generatePPvsPS };

export default {
  id: "ppvsps",
  title: "PP vs PS",
  generate: generatePPvsPS,
  render
};
