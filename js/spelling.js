<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Spelling Practice</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; max-width: 980px; margin: 28px auto; padding: 0 16px; }
    h1 { font-size: 1.6rem; margin: 0 0 6px; }
    .meta { color:#555; margin: 0 0 14px; }
    .nav { margin: 10px 0 14px; }
    .nav a { margin-right: 12px; }
    .row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin: 12px 0; }
    textarea, input, select, button { font-size: 1rem; }
    textarea { width: 100%; min-height: 90px; padding: 10px; border:1px solid #bbb; border-radius:10px; }
    input[type="text"] { padding: 8px 10px; border:1px solid #bbb; border-radius:8px; }
    select { padding: 8px 10px; border:1px solid #bbb; border-radius:8px; background:#fff; }
    button { padding: 9px 12px; border:1px solid #bbb; border-radius:8px; background:#fff; cursor:pointer; }
    button:hover { background:#f5f5f5; }
    .card { border:1px solid #e2e2e2; border-radius:12px; padding: 12px; margin: 10px 0; }
    .small { color:#666; font-size: 0.95rem; }
    .list { display:flex; gap:8px; flex-wrap:wrap; margin-top: 8px; }
    .chip { border:1px solid #bbb; border-radius:999px; padding: 6px 10px; background:#fff; display:flex; gap:8px; align-items:center; }
    .chip button { padding: 4px 8px; border-radius:999px; }
    .quizItem { border:1px solid #e2e2e2; border-radius:12px; padding: 12px; margin: 10px 0; }
    .qrow { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
    .result { font-weight:700; margin-left: 6px; }
    .ok { color:#0a6; }
    .bad { color:#c22; }
    .score { font-weight:700; }
    .tips { margin-top: 6px; color:#444; }
    code { background:#f4f4f4; padding:2px 5px; border-radius:6px; }
  </style>
</head>
<body>
  <h1>Spelling Practice</h1>
  <p class="meta">Add words → save → practise 10 random words with audio → check spelling → score. Words persist on this device.</p>

  <div class="nav">
    <a href="./index.html">Grammar practice</a>
  </div>

  <div class="card">
    <strong>Add words</strong>
    <div class="small">Enter one per line (or separated by commas). You can add any number.</div>
    <div class="row">
      <select id="accentSelect" aria-label="Accent">
        <option value="auto">Voice: auto</option>
        <option value="en-GB">Prefer UK (en-GB)</option>
        <option value="en-US">Prefer US (en-US)</option>
      </select>
      <button id="refreshVoicesBtn" type="button">Reload voices</button>
    </div>
    <textarea id="wordsInput" placeholder="example
necessary
because
environment
through"></textarea>
    <div class="row">
      <button id="saveWordsBtn" type="button">Save words</button>
      <button id="showWordsBtn" type="button">Show saved words</button>
      <button id="clearAllBtn" type="button">Clear all saved words</button>
      <span class="small" id="countBox"></span>
    </div>
    <div id="savedWordsArea" class="list"></div>
  </div>

  <div class="card">
    <strong>Quiz</strong>
    <div class="small">Click “New quiz” to generate up to 10 random saved words. Click “Speak” to hear the word.</div>
    <div class="row">
      <button id="newQuizBtn" type="button">New quiz (10)</button>
      <button id="checkAllBtn" type="button">Check all</button>
      <span class="score" id="scoreBox"></span>
    </div>
    <div id="quizArea"></div>
  </div>

<script>
const STORAGE_KEY = "spelling_words_v1";

const wordsInput = document.getElementById("wordsInput");
const saveWordsBtn = document.getElementById("saveWordsBtn");
const showWordsBtn = document.getElementById("showWordsBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const savedWordsArea = document.getElementById("savedWordsArea");
const countBox = document.getElementById("countBox");

const newQuizBtn = document.getElementById("newQuizBtn");
const checkAllBtn = document.getElementById("checkAllBtn");
const quizArea = document.getElementById("quizArea");
const scoreBox = document.getElementById("scoreBox");

const accentSelect = document.getElementById("accentSelect");
const refreshVoicesBtn = document.getElementById("refreshVoicesBtn");

let words = loadWords();
let quizWords = [];
let voices = [];

function normalizeWord(w) {
  return String(w).trim().toLowerCase().replace(/\s+/g, " ");
}

function loadWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveWordsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function updateCount() {
  countBox.textContent = `Saved: ${words.length}`;
}

function parseInputWords(text) {
  // split by newlines or commas
  return text
    .split(/\n|,/g)
    .map(x => x.trim())
    .filter(Boolean);
}

function addWords(newOnes) {
  const set = new Set(words.map(normalizeWord));
  newOnes.forEach(w => set.add(normalizeWord(w)));
  words = Array.from(set).sort();
  saveWordsToStorage();
  updateCount();
}

function renderSavedWords() {
  savedWordsArea.innerHTML = "";
  words.forEach(w => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `<span>${w}</span>`;
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      words = words.filter(x => x !== w);
      saveWordsToStorage();
      renderSavedWords();
      updateCount();
    });
    chip.appendChild(del);
    savedWordsArea.appendChild(chip);
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- speech synthesis ---------- */
function loadVoices() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
function chooseVoice() {
  const pref = accentSelect.value; // auto / en-GB / en-US
  if (!voices.length) return null;

  if (pref === "en-GB") {
    return voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /en/i.test(v.lang)) || voices[0];
  }
  if (pref === "en-US") {
    return voices.find(v => /en-US/i.test(v.lang)) || voices.find(v => /en/i.test(v.lang)) || voices[0];
  }
  // auto
  return voices.find(v => /en/i.test(v.lang)) || voices[0];
}

function speakWord(word) {
  if (!window.speechSynthesis) {
    alert("Speech synthesis not available in this browser.");
    return;
  }
  const u = new SpeechSynthesisUtterance(word);
  const v = chooseVoice();
  if (v) u.voice = v;
  u.rate = 0.95; // slightly slower
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/* Some simple spelling feedback patterns */
function spellingTips(correct, attempt) {
  const c = normalizeWord(correct);
  const a = normalizeWord(attempt);
  const tips = [];

  if (!attempt) return tips;

  // Common clusters / digraph hints (general, not perfect phonetics)
  if (c.includes("ch") && !a.includes("ch")) tips.push("Hint: “ch” is a common spelling for the /tʃ/ sound (as in “chair”).");
  if (c.includes("tion") && !a.includes("tion")) tips.push("Hint: Many nouns end with “-tion” (nation, information).");
  if (c.includes("sion") && !a.includes("sion")) tips.push("Hint: “-sion” is common (decision, revision).");
  if (c.includes("ough") && !a.includes("ough")) tips.push("Hint: “-ough” has several pronunciations. Focus on the letters, not the sound.");
  if (c.includes("ie") && !a.includes("ie")) tips.push("Hint: “ie/ei” can be tricky. Check the vowel order carefully.");
  if (c.endsWith("ed") && !a.endsWith("ed")) tips.push("Hint: Regular past tense often ends in “-ed”.");
  if (c.endsWith("ing") && !a.endsWith("ing")) tips.push("Hint: Continuous forms often end in “-ing”.");
  if (c.includes("double") || c.match(/(.)\1/)) {
    // if correct has double letter and attempt does not
    const doubles = c.match(/([a-z])\1/g);
    if (doubles && !a.match(/([a-z])\1/g)) tips.push("Hint: Watch for double letters (e.g., “necessary”, “accommodate”).");
  }

  // Generic guidance if close but wrong
  if (Math.abs(c.length - a.length) <= 2) tips.push("Tip: Compare the word letter-by-letter. Look for missing or swapped letters.");
  return tips;
}

/* ---------- quiz ---------- */
function renderQuiz() {
  quizArea.innerHTML = "";
  scoreBox.textContent = "";

  quizWords.forEach((w, idx) => {
    const item = document.createElement("div");
    item.className = "quizItem";
    item.dataset.index = String(idx);
    item.dataset.correct = "";

    item.innerHTML = `
      <div class="qrow">
        <strong>${idx + 1}.</strong>
        <button type="button" class="speakBtn">Speak</button>
        <input type="text" class="ans" placeholder="Type the word" autocomplete="off" spellcheck="false" />
        <button type="button" class="checkBtn">Check</button>
        <span class="result"></span>
      </div>
      <div class="tips"></div>
    `;

    item.querySelector(".speakBtn").addEventListener("click", () => speakWord(w));
    item.querySelector(".checkBtn").addEventListener("click", () => {
      checkOne(item);
      updateScore();
    });

    quizArea.appendChild(item);
  });
}

function checkOne(itemEl) {
  const idx = Number(itemEl.dataset.index);
  const correct = quizWords[idx];
  const attempt = itemEl.querySelector(".ans").value;

  const resultEl = itemEl.querySelector(".result");
  const tipsEl = itemEl.querySelector(".tips");

  if (!attempt.trim()) {
    itemEl.dataset.correct = "0";
    resultEl.textContent = "Enter an answer.";
    resultEl.className = "result bad";
    tipsEl.textContent = "";
    return;
  }

  const ok = normalizeWord(attempt) === normalizeWord(correct);
  itemEl.dataset.correct = ok ? "1" : "0";
  resultEl.textContent = ok ? "Correct" : `Incorrect (correct: ${correct})`;
  resultEl.className = "result " + (ok ? "ok" : "bad");

  const tips = ok ? [] : spellingTips(correct, attempt);
  tipsEl.innerHTML = tips.length ? tips.map(t => `<div>${t}</div>`).join("") : "";
}

function checkAll() {
  document.querySelectorAll(".quizItem").forEach(el => checkOne(el));
  updateScore();
}

function updateScore() {
  const items = Array.from(document.querySelectorAll(".quizItem"));
  const attempted = items.filter(x => x.querySelector(".result")?.textContent);
  if (!attempted.length) { scoreBox.textContent = ""; return; }
  const correct = items.filter(x => x.dataset.correct === "1").length;
  scoreBox.textContent = `Score: ${correct}/${items.length}`;
}

function newQuiz() {
  if (!words.length) {
    alert("No saved words yet. Add words first.");
    return;
  }
  quizWords = shuffle(words).slice(0, Math.min(10, words.length));
  renderQuiz();
}

/* ---------- events ---------- */
saveWordsBtn.addEventListener("click", () => {
  const list = parseInputWords(wordsInput.value);
  if (!list.length) return;
  addWords(list);
  wordsInput.value = "";
});

showWordsBtn.addEventListener("click", renderSavedWords);

clearAllBtn.addEventListener("click", () => {
  if (!confirm("Clear all saved words?")) return;
  words = [];
  saveWordsToStorage();
  renderSavedWords();
  updateCount();
  quizArea.innerHTML = "";
  scoreBox.textContent = "";
});

newQuizBtn.addEventListener("click", newQuiz);
checkAllBtn.addEventListener("click", checkAll);

refreshVoicesBtn.addEventListener("click", () => {
  loadVoices();
  alert(`Voices loaded: ${voices.length}`);
});

/* voices load can be async in some browsers */

</script>
</body>
</html>
