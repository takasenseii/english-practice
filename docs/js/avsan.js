// avsan.js
// Articles: a vs an — standardized module: { id, title, generate, render }

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Normalizers (needed for check icons)
function normalizeSpaces(s) {
  return String(s).trim().replace(/\s+/g, " ");
}
function normalize(s) {
  return normalizeSpaces(s).toLowerCase();
}

function startsWithVowelSound(word) {
  const w = String(word).toLowerCase().trim();

  // silent-h words → "an"
  if (/^(honest|honour|honorable|honourable|hour|heir|heiress|herb)\b/.test(w)) {
    return true;
  }

  // "you" sound → "a" (must be checked BEFORE generic vowel rule)
  if (/^(eu|u(?![aeiou])|uni|use|user|ufo|uk|usb|euro|european)\b/.test(w)) {
    return false;
  }

  // letter names pronounced with initial vowel sound → "an" (F = "ef", M = "em", etc.)
  if (/^(a|e|f|h|i|l|m|n|o|r|s|x)\b/.test(w)) {
    return true;
  }

  // normal vowel start → "an"
  if (/^[aeiou]/.test(w)) {
    return true;
  }

  return false;
}

const AN_WORDS = [
  "apple", "orange", "egg", "idea", "example", "engineer", "artist", "actor",
  "umbrella", "email", "answer", "invoice", "essay", "exercise", "argument",
  "ice cream", "airport", "island", "event", "experiment", "opportunity",
  "hour", "honest person", "honour", "honest mistake", "honourable act",
  "heir", "heiress", "herb", "hourglass", "honesty",
  "MBA student", "FBI agent", "CIA officer", "MRI scan", "X-ray"
];

const A_WORDS = [
  "book", "car", "dog", "house", "table", "computer", "phone", "teacher",
  "student", "chair", "window", "garden", "picture", "lesson", "problem",
  "university student", "uniform", "European city", "one-time offer",
  "user account", "USB cable", "UFO story", "UK company", "unit test"
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
  "She explained ___ {noun} clearly.",
  "We found ___ {noun} in the drawer.",
  "They discussed ___ {noun} at lunch.",
  "She wrote about ___ {noun}.",
  "He complained about ___ {noun}.",
  "They needed ___ {noun} urgently.",
  "I couldn't find ___ {noun} anywhere.",
  "He pointed at ___ {noun}.",
  "They were looking for ___ {noun}.",
  "She received ___ {noun} this morning.",
  "He delivered ___ {noun} yesterday.",
  "They mentioned ___ {noun} in class.",
  "We practiced with ___ {noun}.",
  "She demonstrated ___ {noun} to the group.",
  "He rented ___ {noun} for the weekend.",
  "They prepared ___ {noun} in advance.",
  "The teacher recommended ___ {noun}.",
  "The guide showed us ___ {noun}.",
  "They introduced ___ {noun} to the audience.",
  "He sketched ___ {noun} on paper.",
  "She highlighted ___ {noun} during the lecture."
];

const A_AN_ADJECTIVES = [
  "unusual",
  "interesting",
  "important",
  "unexpected",
  "excellent",
  "urgent",
  "honest",
  "early",
  "simple",
  "old",
  "advanced",
  "European",
  "innovative",
  "original",
  "academic",
  "efficient",
  "ordinary",
  "expensive",
  "affordable",
  "outstanding",
  "awkward",
  "elegant",
  "optimistic",
  "impossible",
  "emotional",
  "iconic",
  "artistic",
  "urban",
  "official",
  "unprecedented"
];

function pickNounWithAnswer() {
  // We use AN_WORDS / A_WORDS mainly as curated exception lists
  if (Math.random() < 0.5) {
    return { noun: rand(AN_WORDS) };
  } else {
    return { noun: rand(A_WORDS) };
  }
}

function generateArticlesAAn(n = 10) {
  const out = [];

  for (let i = 0; i < n; i++) {
    let t = rand(A_AN_TEMPLATES);
    const picked = pickNounWithAnswer();
    const baseNoun = picked.noun;

    let injectedAdj = null;

    // Only inject an adjective into single-word base nouns
    if (!baseNoun.includes(" ") && Math.random() < 0.4) {
      injectedAdj = rand(A_AN_ADJECTIVES);
      t = t.replace("{noun}", `${injectedAdj} {noun}`);
    }

    // Phrase that actually follows the blank
    const phrase = injectedAdj ? `${injectedAdj} ${baseNoun}` : baseNoun;

    const prompt = t.replace("{noun}", baseNoun);

    let answer;

    // First, respect curated exceptions for multi-word phrases
    if (AN_WORDS.includes(phrase)) {
      answer = "an";
    } else if (A_WORDS.includes(phrase)) {
      answer = "a";
    } else {
      // Otherwise: decide by the first spoken word after the gap
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

        <button id="toggleExplain" class="explain-btn">Show explanation</button>
        <div id="explainBox" class="explain-box" style="display:none; margin-top:8px; font-size:0.9rem;">
          <p>We choose <b>a</b> or <b>an</b> by the <b>sound</b>, not only the letter:</p>
          <ul>
            <li><b>an</b> + vowel sound: <i>an apple, an engineer, an hour, an honest mistake</i></li>
            <li><b>a</b> + consonant sound: <i>a book, a car, a user, a European city</i></li>
            <li>Look at the <b>first word after the gap</b>: adjectives count.<br>
                <i>an honest person, an unusual idea, a European teacher</i></li>
            <li>Some special cases: <i>an MBA student, an FBI agent, a UK company, a UFO story</i></li>
          </ul>
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

    resultEl.textContent = `Score: ${correct}/${items.length}`;
  }

  function showAnswers() {
    items.forEach((it, i) => {
      const ansEl = listEl.querySelector(`.ans[data-ans="${i}"]`);
      const qEl = listEl.querySelector(`.q[data-i="${i}"]`);
      if (!ansEl || !qEl) return;
      ansEl.textContent = it.answer;
      qEl.classList.add("show-ans");
    });
    resultEl.textContent = "Answers shown.";
  }

  container.querySelector("#new").onclick = newSet;
  container.querySelector("#check").onclick = check;
  container.querySelector("#show").onclick = showAnswers;

  newSet();
} // <--- closes render()

export { generateArticlesAAn };

export default {
  id: "avsan",
  title: "A vs An",
  generate: generateArticlesAAn,
  render
}; // <--- closes export object
