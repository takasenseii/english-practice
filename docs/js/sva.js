// sva.js
// Subject–verb agreement (present simple) — standardized module: { id, title, generate, render }

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function normalize(s){ return String(s).trim().toLowerCase().replace(/\s+/g," "); }

const SVA_SUBJECTS = [
  { subj:"I", third:false },
  { subj:"You", third:false },
  { subj:"We", third:false },
  { subj:"They", third:false },
  { subj:"He", third:true },
  { subj:"She", third:true },
  { subj:"It", third:true },
  { subj:"My friends", third:false },
  { subj:"The teacher", third:true },
  { subj:"The students", third:false }
];

const SVA_VERBS = [
  { base:"go", third:"goes" },
  { base:"do", third:"does" },
  { base:"have", third:"has" },
  { base:"watch", third:"watches" },
  { base:"study", third:"studies" },
  { base:"play", third:"plays" },
  { base:"work", third:"works" },
  { base:"try", third:"tries" },
  { base:"teach", third:"teaches" },
  { base:"fix", third:"fixes" },
  { base:"carry", third:"carries" }
];

const SVA_FREQ_ADVERBS = [
  "always","usually","often","sometimes","rarely","never","normally","generally","frequently",
  "occasionally","regularly","hardly ever","almost always","almost never","often enough",
  "once in a while","every now and then","most of the time","from time to time","on occasion"
];

const SVA_TIME_PHRASES = [
  "after school","on weekends","every day","in the morning","in the afternoon","in the evening",
  "at night","at home","in class","in the library","in the gym","at school","during lessons",
  "after work","before class","on weekdays","on Mondays","after lunch","in the afternoon","at the weekend"
];

const SVA_COMPLEMENTS = {
  go: ["to school", "to the gym", "to the library", "home after school", "to practice"],
  do: ["homework", "their homework", "the dishes", "a project", "exercise"],
  have: ["breakfast", "a test", "a lesson", "a lot of homework", "time"],
  watch: ["TV", "a film", "football", "videos", "the match"],
  study: ["English", "maths", "at home", "in the library", "after school"],
  play: ["football", "basketball", "video games", "tennis", "music"],
  work: ["at home", "in the library", "after school", "on weekends", "every day"],
  try: ["hard", "to improve", "again", "to help", "to learn"],
  teach: ["English", "maths", "PE", "the class", "students"],
  fix: ["bikes", "computers", "phones", "the problem", "things"],
  carry: ["a bag", "books", "a backpack", "a box", "shopping bags"]
};

function generateSVA(n = 10) {
  const out = [];

  for (let i = 0; i < n; i++) {
    const v = rand(SVA_VERBS);
    const s = rand(SVA_SUBJECTS);

    const complement = rand(SVA_COMPLEMENTS[v.base]);
    const correct = s.third ? v.third : v.base;

    const useFreq = Math.random() < 0.5;
    const freq = rand(SVA_FREQ_ADVERBS);
    const time = rand(SVA_TIME_PHRASES);

    const prompt = useFreq
      ? `${s.subj} ${freq} ___ ${complement}. (${v.base})`
      : `${s.subj} ___ ${complement} ${time}. (${v.base})`;

    out.push({ prompt, answer: correct });
  }

  return out;
}

function render(container) {
  container.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>Subject–verb agreement</h2>
        <p>Type the correct verb form (present simple).</p>

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
              <input data-i="${idx}" placeholder="Type the verb" />
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
    items = generateSVA(n);
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

export { generateSVA };

export default {
  id: "sva",
  title: "Subject–verb agreement",
  generate: generateSVA,
  render
};
