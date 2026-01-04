/* spelling.js — MOUNT VERSION
   Usage in index.html:
   1) <script src="./js/spelling.js"></script>  (before your router script)
   2) In your router render function call: mountSpelling(root)
*/

(function () {
  "use strict";

  // Expose one global entry point for your router:
  // window.mountSpelling(root)
  window.mountSpelling = function mountSpelling(root) {
    // ----- HTML (injected each time you navigate to Spelling) -----
    root.innerHTML = `
      <style>
        .sp-body { font-family: system-ui, Arial, sans-serif; max-width: 980px; margin: 12px auto; padding: 0 8px; }
        .sp-meta { color:#555; margin: 0 0 14px; }
        .sp-row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin: 12px 0; }
        .sp-textarea, .sp-input, .sp-select, .sp-btn { font-size: 1rem; }
        .sp-textarea { width: 100%; min-height: 90px; padding: 10px; border:1px solid #bbb; border-radius:10px; }
        .sp-input { padding: 8px 10px; border:1px solid #bbb; border-radius:8px; }
        .sp-select { padding: 8px 10px; border:1px solid #bbb; border-radius:8px; background:#fff; }
        .sp-btn { padding: 9px 12px; border:1px solid #bbb; border-radius:8px; background:#fff; cursor:pointer; }
        .sp-btn:hover { background:#f5f5f5; }
        .sp-card { border:1px solid #e2e2e2; border-radius:12px; padding: 12px; margin: 10px 0; }
        .sp-small { color:#666; font-size: 0.95rem; }
        .sp-list { display:flex; gap:8px; flex-wrap:wrap; margin-top: 8px; }
        .sp-chip { border:1px solid #bbb; border-radius:999px; padding: 6px 10px; background:#fff; display:flex; gap:8px; align-items:center; }
        .sp-chip button { padding: 4px 8px; border-radius:999px; }
        .sp-quizItem { border:1px solid #e2e2e2; border-radius:12px; padding: 12px; margin: 10px 0; }
        .sp-qrow { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .sp-result { font-weight:700; margin-left: 6px; }
        .sp-ok { color:#0a6; }
        .sp-bad { color:#c22; }
        .sp-score { font-weight:700; }
        .sp-tips { margin-top: 6px; color:#444; }
        code { background:#f4f4f4; padding:2px 5px; border-radius:6px; }
      </style>

      <div class="sp-body">
        <h2>Spelling Practice</h2>
        <p class="sp-meta">Add words → save → practise 10 random words with audio → check spelling → score. Words persist on this device.</p>

        <div class="sp-card">
          <strong>Add words</strong>
          <div class="sp-small">Enter one per line (or separated by commas). You can add any number.</div>

          <div class="sp-row">
            <select id="accentSelect" class="sp-select" aria-label="Accent">
              <option value="auto">Voice: auto</option>
              <option value="en-GB">Prefer UK (en-GB)</option>
              <option value="en-US">Prefer US (en-US)</option>
            </select>
            <button id="refreshVoicesBtn" class="sp-btn" type="button">Reload voices</button>
          </div>

          <textarea id="wordsInput" class="sp-textarea" placeholder="example
necessary
because
environment
through"></textarea>

          <div class="sp-row">
            <button id="saveWordsBtn" class="sp-btn" type="button">Save words</button>
            <button id="showWordsBtn" class="sp-btn" type="button">Show saved words</button>
            <button id="clearAllBtn" class="sp-btn" type="button">Clear all saved words</button>
            <span class="sp-small" id="countBox"></span>
          </div>

          <div id="savedWordsArea" class="sp-list"></div>
        </div>

        <div class="sp-card">
          <strong>Quiz</strong>
          <div class="sp-small">Click “New quiz” to generate up to 10 random saved words. Click “Speak” to hear the word.</div>
          <div class="sp-row">
            <button id="newQuizBtn" class="sp-btn" type="button">New quiz (10)</button>
            <button id="checkAllBtn" class="sp-btn" type="button">Check all</button>
            <span class="sp-score" id="scoreBox"></span>
          </div>
          <div id="quizArea"></div>
        </div>
      </div>
    `;

    // ----- State -----
    const STORAGE_KEY = "spelling_words_v1";

    let words = loadWords();
    let quizWords = [];
    let voices = [];
    let voicesChangedHandler = null;

    // ----- DOM (scoped to root) -----
    const wordsInput = root.querySelector("#wordsInput");
    const saveWordsBtn = root.querySelector("#saveWordsBtn");
    const showWordsBtn = root.querySelector("#showWordsBtn");
    const clearAllBtn = root.querySelector("#clearAllBtn");
    const savedWordsArea = root.querySelector("#savedWordsArea");
    const countBox = root.querySelector("#countBox");

    const newQuizBtn = root.querySelector("#newQuizBtn");
    const checkAllBtn = root.querySelector("#checkAllBtn");
    const quizArea = root.querySelector("#quizArea");
    const scoreBox = root.querySelector("#scoreBox");

    const accentSelect = root.querySelector("#accentSelect");
    const refreshVoicesBtn = root.querySelector("#refreshVoicesBtn");

    // ----- Helpers -----
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
        chip.className = "sp-chip";
        chip.innerHTML = `<span>${w}</span>`;
        const del = document.createElement("button");
        del.type = "button";
        del.className = "sp-btn";
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

    // ----- Speech synthesis -----
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
      u.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }

    // ----- Feedback patterns -----
    function spellingTips(correct, attempt) {
      const c = normalizeWord(correct);
      const a = normalizeWord(attempt);
      const tips = [];

      if (!attempt) return tips;

      if (c.includes("ch") && !a.includes("ch")) tips.push("Hint: “ch” is a common spelling for the /tʃ/ sound (as in “chair”).");
      if (c.includes("tion") && !a.includes("tion")) tips.push("Hint: Many nouns end with “-tion” (nation, information).");
      if (c.includes("sion") && !a.includes("sion")) tips.push("Hint: “-sion” is common (decision, revision).");
      if (c.includes("ough") && !a.includes("ough")) tips.push("Hint: “-ough” has several pronunciations. Focus on the letters, not the sound.");
      if (c.includes("ie") && !a.includes("ie")) tips.push("Hint: “ie/ei” can be tricky. Check the vowel order carefully.");
      if (c.endsWith("ed") && !a.endsWith("ed")) tips.push("Hint: Regular past tense often ends in “-ed”.");
      if (c.endsWith("ing") && !a.endsWith("ing")) tips.push("Hint: Continuous forms often end in “-ing”.");
      if (c.includes("double") || c.match(/(.)\1/)) {
        const doubles = c.match(/([a-z])\1/g);
        if (doubles && !a.match(/([a-z])\1/g)) tips.push("Hint: Watch for double letters (e.g., “necessary”, “accommodate”).");
      }

      if (Math.abs(c.length - a.length) <= 2) tips.push("Tip: Compare the word letter-by-letter. Look for missing or swapped letters.");
      return tips;
    }

    // ----- Quiz -----
    function renderQuiz() {
      quizArea.innerHTML = "";
      scoreBox.textContent = "";

      quizWords.forEach((w, idx) => {
        const item = document.createElement("div");
        item.className = "sp-quizItem";
        item.dataset.index = String(idx);
        item.dataset.correct = "";

        item.innerHTML = `
          <div class="sp-qrow">
            <strong>${idx + 1}.</strong>
            <button type="button" class="sp-btn speakBtn">Speak</button>
            <input type="text" class="sp-input ans" placeholder="Type the word" autocomplete="off" spellcheck="false" />
            <button type="button" class="sp-btn checkBtn">Check</button>
            <span class="sp-result result"></span>
          </div>
          <div class="sp-tips tips"></div>
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
        resultEl.className = "sp-result sp-bad result";
        tipsEl.textContent = "";
        return;
      }

      const ok = normalizeWord(attempt) === normalizeWord(correct);
      itemEl.dataset.correct = ok ? "1" : "0";
      resultEl.textContent = ok ? "Correct" : `Incorrect (correct: ${correct})`;
      resultEl.className = "sp-result " + (ok ? "sp-ok" : "sp-bad") + " result";

      const tips = ok ? [] : spellingTips(correct, attempt);
      tipsEl.innerHTML = tips.length ? tips.map(t => `<div>${t}</div>`).join("") : "";
    }

    function checkAll() {
      quizArea.querySelectorAll(".sp-quizItem").forEach(el => checkOne(el));
      updateScore();
    }

    function updateScore() {
      const items = Array.from(quizArea.querySelectorAll(".sp-quizItem"));
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

    // ----- Events (bound after mount) -----
    const onSave = () => {
      const list = parseInputWords(wordsInput.value);
      if (!list.length) return;
      addWords(list);
      wordsInput.value = "";
    };

    const onShow = () => renderSavedWords();

    const onClearAll = () => {
      if (!confirm("Clear all saved words?")) return;
      words = [];
      saveWordsToStorage();
      renderSavedWords();
      updateCount();
      quizArea.innerHTML = "";
      scoreBox.textContent = "";
    };

    const onNewQuiz = () => newQuiz();
    const onCheckAll = () => checkAll();

    const onRefreshVoices = () => {
      loadVoices();
      alert(`Voices loaded: ${voices.length}`);
    };

    saveWordsBtn.addEventListener("click", onSave);
    showWordsBtn.addEventListener("click", onShow);
    clearAllBtn.addEventListener("click", onClearAll);
    newQuizBtn.addEventListener("click", onNewQuiz);
    checkAllBtn.addEventListener("click", onCheckAll);
    refreshVoicesBtn.addEventListener("click", onRefreshVoices);

    // voices init (boot moved into mount)
    if (window.speechSynthesis) {
      loadVoices();
      voicesChangedHandler = () => loadVoices();
      window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
    }

    updateCount();

    // Return cleanup so router can call it when navigating away (optional but recommended)
    return function unmountSpelling() {
      saveWordsBtn.removeEventListener("click", onSave);
      showWordsBtn.removeEventListener("click", onShow);
      clearAllBtn.removeEventListener("click", onClearAll);
      newQuizBtn.removeEventListener("click", onNewQuiz);
      checkAllBtn.removeEventListener("click", onCheckAll);
      refreshVoicesBtn.removeEventListener("click", onRefreshVoices);

      // stop speech + detach handler
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.onvoiceschanged === voicesChangedHandler) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      }
    };
  };
})();
