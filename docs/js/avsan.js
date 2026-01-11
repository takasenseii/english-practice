// avsan.js
// Articles: a vs an — standardized module: { id, title, generate, render }

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Normalizers (needed for check icons)
function normalizeSpaces(s) { return String(s).trim().replace(/\s+/g, " "); }
function normalize(s) { return normalizeSpaces(s).toLowerCase(); }

function startsWithVowelSound(word) {
  const w = String(word).toLowerCase().trim();

  // silent-h words → "an"
  if (/^(honest|honour|honorable|honourable|hour|heir|heiress|herb)\b/.test(w)) return true;

  // "you" sound → "a" (must be checked BEFORE generic vowel rule)
  if (/^(eu|u(?![aeiou])|uni|use|user|ufo|uk|usb|euro|european)\b/.test(w)) return false;

  // letter names pronounced with initial vowel sound → "an" (F = "ef", M = "em", etc.)
  if (/^(a|e|f|h|i|l|m|n|o|r|s|x)\b/.test(w)) return true;

  // normal vowel start → "an"
  if (/^[aeiou]/.test(w)) return true;

  return false;
}

const AN_WORDS = [
  "apple","orange","egg","idea","example","engineer","artist","actor",
  "umbrella","email","answer","invoice","essay","exercise","argument",
  "ice cream","airport","island","event","experiment","opportunity",
  "hour","honest person","honour","honest mistake","honourable act",
  "heir","heiress","herb","hourglass","honesty",
  "MBA student","FBI agent","CIA officer","MRI scan","X-ray"
];

const A_WORDS = [
  "book","car","dog","house","table","computer","phone","teacher",
  "student","chair","window","garden","picture","lesson","problem",
  "university student","uniform","European city","one-time offer",
  "user account","USB cable","UFO story","UK company","unit test"
];

const A_AN_TEMPLATES = [
  "I need ___ {noun} for class.",
  "She bought ___ {noun} yesterday.",
  "He is ___ {noun}.",
  "They saw ___ {noun} at the station.",
  "I ordered ___ {noun} online.",
  "This is ___ {noun} I like.",
  "That sounds like ___ {noun}.",
  "He works as ___ {noun}.",
  "There was ___ {noun} in the room.",
  "She explained ___ {noun} clearly."
];

const A_AN_ADJECTIVES = [
  "unusual","interesting","important","unexpected","excellent",
  "urgent","honest","early","simple","old","advanced","European"
];

function pickNounWithAnswer() {
  // We keep the arrays only as *curated exceptions*; the raw article is not trusted
  if (Math.random() < 0.5) {
    return { noun: rand(AN_WORDS), baseArticle: "an" };
  } else {
    return { noun: rand(A_WORDS), baseArticle: "a" };
  }
}

function generateArticlesAAn(n = 10) {
  const out = [];

  for (let i = 0; i < n; i++) {
    let t = rand(A_AN_TEMPLATES);
    const picked = pickNounWithAnswer();

    let injectedAdj = null;

    // Only inject an adjective into *single-word* base nouns
    if (!picked.noun.includes(" ") && Math.random() < 0.4) {
      injectedAdj = rand(A_AN_ADJECTIVES);
      t = t.replace("{noun}", `${injectedAdj} {noun}`);
    }

    // Build the phrase that actually follows the blank
    const phrase = injectedAdj ? `${injectedAdj} ${picked.noun}` : picked.noun;

    const prompt = t.replace("{noun}", picked.noun);

    let answer;

    if (!injectedAdj && (AN_WORDS.includes(phrase) || A_WORDS.includes(phrase))) {
      // For phrases exactly in our curated lists (e.g. "MBA student", "European city")
      answer = AN_WORDS.includes(phrase) ? "an" : "a";
    } else {
      // General rule: decide by the *first word* actually spoken after the gap
      const firstWord = phrase.split(/\s+/)[0];
      answer = startsWithVowelSound(firstWord) ? "an" : "a";
    }

    out.push({ prompt, answer });
  }

  return out;
}

function parseArticle(raw) {
  const cleaned = String(raw).toLowerCase().replace(/[^a-z]/g, "");
  return cleaned === "a" || cleaned === "an" ? cleaned : "";
}

function render(container) {
  container.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>A vs An</h2>
        <p>Type <b>a</b> or <b>an</b>.</p>

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
          <div class="prompt">
            ${idx + 1}. ${it.prompt.replace("___", "<span class='gap'>___</span>")}
          </div>
          <div class="row">
            <input data-i="${idx}" placeholder="a / an" />
            <span class="mark" data-mark="${idx}"></span>
            <div class="ans" data-ans="${idx}"></div>
          </div>
        </div>
      `)
      .join("");
    resultEl.textContent = "";
  }

  function newSet() {
    const n = Math.max(1, Math.min(50, Number(nEl.value || 10)));
    items = generateArticlesAAn(n);
    draw();
  }

  function clearMark(i) {
    const m = listEl.querySelector(`.mark[data-mark="${i}"]`);
    if (!m) return;
    m.className = "mark";
    m.textContent = "";
  }

  function setMark(i, ok) {
    const m = listEl.querySelector(`.mark[data-mark="${i}"]`);
    if (!m) return;
    m.className = "mark " + (ok ? "ok" : "bad");
    m.textContent = ok ? "✔" : "✖";
  }

  function check() {
    const inputs = Array.from(listEl.querySelectorAll("input[data-i]"));
    let correct = 0;
    let attempted = 0;

    inputs.forEach((inp) => {
      const i = Number(inp.dataset.i);
      const student = parseArticle(inp.value);

      if (!student) {
        clearMark(i);
        return;
      }

      attempted++;

      const ok = normalize(student) === normalize(items[i].answer);
      if (ok) correct++;

      setMark(i, ok);
    });

    if (attempted === 0) {
      resultEl.textContent = "Enter at least one answer.";
      return;
    }

    // Keep original scoring style (total questions as denominator)
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
