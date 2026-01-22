// spelling.js — mount version (keeps window.mountSpelling)
// Uses the same UI system as the other exercises: .container .card .row #list .q .prompt .ans + ✔/✖

(function () {
  "use strict";

  const STORAGE_KEY = "spelling_words_v2";

  function normalizeWord(w) {
    return String(w).trim().toLowerCase().replace(/\s+/g, " ");
  }

  function parseInputWords(text) {
    return String(text)
      .split(/\n|,/g)
      .map(x => x.trim())
      .filter(Boolean);
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

  function saveWordsToStorage(words) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
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
function getVoicesSafe() {
  try {
    return window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  } catch {
    return [];
  }
}

function pickVoiceByName(voices, name) {
  if (!voices.length) return null;

  // If a specific name was chosen and exists, use it
  if (name) {
    const found = voices.find(v => v.name === name);
    if (found) return found;
  }

  // Fallback: first English voice, else first voice
  return voices.find(v => /^en[-_]/i.test(v.lang)) || voices[0];
}

function speakWord(word, voices, voiceName, rate) {
  if (!window.speechSynthesis) {
    alert("Speech synthesis not available in this browser.");
    return;
  }

  const u = new SpeechSynthesisUtterance(word);
  const v = pickVoiceByName(voices, voiceName);
  if (v) u.voice = v;

  u.rate = rate || 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}


  // ----- Mount -----
  window.mountSpelling = function mountSpelling(root) {
    let words = loadWords();
    let quizWords = [];
    let voices = getVoicesSafe();
    let voicesChangedHandler = null;
    let countedThisQuiz = false;
    let showingSavedWords = false;

    root.innerHTML = `
      <div class="container">
        <div class="card">
          <h2>Spelling practice</h2>
          <p style="color: var(--muted); margin-top: 0;">
            Add words → save → practise with audio → check answers → score. Words persist on this device.
          </p>

<div class="row">
<label style="color: var(--muted);">
  Voice:
  <select id="voiceSelect">
    <option value="">Auto (first English voice)</option>
  </select>
</label>


  <label style="color: var(--muted);">
    Speed:
    <select id="speedSelect">
      <option value="normal">Normal</option>
      <option value="slow">Slow</option>
    </select>
  </label>

  <button class="btn" id="refreshVoicesBtn" type="button">Reload voices</button>
  <span id="voiceCount" style="color: var(--muted);"></span>
</div>


          <div class="row" style="align-items:flex-start;">
            <div style="flex:1; min-width:260px;">
              <div style="color: var(--muted); margin-bottom: 6px;">Add words (one per line or separated by commas):</div>
              <textarea id="wordsInput" rows="5" style="
                width: 100%;
                padding: 10px 12px;
                border-radius: 12px;
                border: 1px solid var(--border);
                background: rgba(255,255,255,.04);
                color: var(--text);
                outline: none;
                resize: vertical;
              " placeholder="example
necessary
because
environment
through"></textarea>

              <div class="row">
                <button class="btn" id="saveWordsBtn" type="button">Save words</button>
                <button class="btn" id="showWordsBtn" type="button">Show saved words</button>
                <button class="btn" id="clearAllBtn" type="button">Clear all</button>
                <span id="countBox" style="color: var(--muted);"></span>
              </div>
            </div>
          </div>

          <div id="savedWordsArea" class="row" style="gap:8px; margin-top:0; flex-wrap:wrap;"></div>
        </div>

        <div class="card" style="margin-top:14px;">
          <h2 style="margin-top:0;">Quiz</h2>
          <p style="color: var(--muted); margin-top: 0;">
            Click “New quiz” to generate up to 10 random saved words. Click “Speak” to hear the word.
          </p>

          <div class="row">
            <button class="btn" id="newQuizBtn" type="button">New quiz (10)</button>
            <button class="btn" id="checkAllBtn" type="button">Check all</button>
            <button class="btn" id="showAnswersBtn" type="button">Show answers</button>
            <span id="scoreBox" style="font-weight:700;"></span>
          </div>

          <div id="list"></div>
        </div>
      </div>
    `;

    // DOM
    const wordsInput = root.querySelector("#wordsInput");
    const saveWordsBtn = root.querySelector("#saveWordsBtn");
    const showWordsBtn = root.querySelector("#showWordsBtn");
    const clearAllBtn = root.querySelector("#clearAllBtn");
    const savedWordsArea = root.querySelector("#savedWordsArea");
    const countBox = root.querySelector("#countBox");

    const newQuizBtn = root.querySelector("#newQuizBtn");
    const checkAllBtn = root.querySelector("#checkAllBtn");
    const showAnswersBtn = root.querySelector("#showAnswersBtn");
    const listEl = root.querySelector("#list");
    const scoreBox = root.querySelector("#scoreBox");

    const voiceSelect = root.querySelector("#voiceSelect");
    const refreshVoicesBtn = root.querySelector("#refreshVoicesBtn");
    const voiceCount = root.querySelector("#voiceCount");
    const speedSelect = root.querySelector("#speedSelect");
 

    function updateVoiceCount() {
      voiceCount.textContent = voices.length ? `Voices: ${voices.length}` : "";
    }

    function populateVoiceSelect() {
      if (!voiceSelect) return;

      voiceSelect.innerHTML = "";

      // Default auto option
      const autoOpt = document.createElement("option");
      autoOpt.value = "";
      autoOpt.textContent = "Auto (first English voice)";
      voiceSelect.appendChild(autoOpt);
      
// One option per English voice only
voices
  .filter(v => /^en[-_]/i.test(v.lang))   // keep only english
  .forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
}
    
    function updateCount() {
      countBox.textContent = `Saved: ${words.length}`;
    }

    function addWords(newOnes) {
      const set = new Set(words.map(normalizeWord));
      newOnes.forEach(w => set.add(normalizeWord(w)));
      words = Array.from(set).sort();
      saveWordsToStorage(words);
      updateCount();
    }

    function renderSavedWords() {
      savedWordsArea.innerHTML = "";
      if (!words.length) {
        savedWordsArea.innerHTML = `<span style="color: var(--muted);">No saved words yet.</span>`;
        return;
      }

      words.forEach(w => {
        const chip = document.createElement("span");
        chip.className = "pill";
        chip.style.display = "inline-flex";
        chip.style.alignItems = "center";
        chip.style.gap = "8px";
        chip.style.margin = "0";
        chip.innerHTML = `<span>${w}</span>`;

        const del = document.createElement("button");
        del.type = "button";
        del.className = "btn";
        del.style.padding = "6px 10px";
        del.style.borderRadius = "999px";
        del.textContent = "Delete";
        del.addEventListener("click", () => {
          words = words.filter(x => x !== w);
          saveWordsToStorage(words);
          renderSavedWords();
          updateCount();
          listEl.innerHTML = "";
          scoreBox.textContent = "";
        });

        chip.appendChild(del);
        savedWordsArea.appendChild(chip);
      });
    }

    function setMark(nextToEl, ok) {
      const qEl = nextToEl.closest(".q");
      if (!qEl) return;

      const old = qEl.querySelector(".mark");
      if (old) old.remove();

      const mark = document.createElement("span");
      mark.className = "mark " + (ok ? "ok" : "bad");
      mark.textContent = ok ? "✔" : "✖";
      nextToEl.after(mark);
    }

    function renderQuiz() {
      // Use the same structure as other exercises:
      // .q (block) -> .prompt (line) -> .row (input + ans + buttons)
listEl.innerHTML = quizWords.map((w, idx) => `
  <div class="q" data-i="${idx}">
    <div class="prompt">${idx + 1}. Listen and type the word.</div>
    <div class="row">
      <button class="btn speakBtn" type="button" data-i="${idx}">Speak</button>
      <input data-i="${idx}" placeholder="Type the word" autocomplete="off" spellcheck="false" />
      <div class="ans" data-ans="${idx}"></div>
    </div>
  </div>
`).join("");


      scoreBox.textContent = "";

      // bind buttons (scoped)
listEl.querySelectorAll(".speakBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const i = Number(btn.dataset.i);
    const selectedVoiceName = voiceSelect ? voiceSelect.value : "";

    const speedChoice = speedSelect.value;   // "normal" or "slow"
    const rate = speedChoice === "slow" ? 0.6 : 0.85;

    speakWord(quizWords[i], voices, selectedVoiceName, rate);
  });
});



    }

    function newQuiz() {
      if (!words.length) {
        alert("No saved words yet. Add words first.");
        return;
      }
      quizWords = shuffle(words).slice(0, Math.min(10, words.length));
      renderQuiz();
      countedThisQuiz = false;  // reset stats guard for new quiz
    }

    function checkOne(i) {
      const qEl = listEl.querySelector(`.q[data-i="${i}"]`);
      if (!qEl) return;

      const inp = qEl.querySelector(`input[data-i="${i}"]`);
      const ansEl = qEl.querySelector(`.ans[data-ans="${i}"]`);
      if (!inp || !ansEl) return;

      // clear old answer reveal (don’t auto show correct word on check)
      ansEl.textContent = "";
      qEl.classList.remove("show-ans");

      const attempt = String(inp.value || "").trim();
      if (!attempt) {
        setMark(inp, false);
        return;
      }

      const ok = normalizeWord(attempt) === normalizeWord(quizWords[i]);
      setMark(inp, ok);
      qEl.dataset.correct = ok ? "1" : "0";
    }

    function checkAll() {
      quizWords.forEach((_, i) => checkOne(i));
      updateScore();
    }

    function showAnswers() {
      quizWords.forEach((w, i) => {
        const qEl = listEl.querySelector(`.q[data-i="${i}"]`);
        const ansEl = listEl.querySelector(`.ans[data-ans="${i}"]`);
        if (!qEl || !ansEl) return;

        ansEl.textContent = w;
        qEl.classList.add("show-ans");
      });
    }

    function updateScore() {
      // No quiz yet
      if (!quizWords.length) {
        scoreBox.textContent = "";
        return;
      }

      const qs = Array.from(listEl.querySelectorAll(".q"));

      // how many items have some attempt
      const attemptedQs = qs.filter(q => {
        const inp = q.querySelector("input[data-i]");
        return inp && inp.value.trim();
      });
      const attemptedCount = attemptedQs.length;

      const correct = qs.filter(q => q.dataset.correct === "1").length;

      // Always show something once there is a quiz
      scoreBox.textContent = `Score: ${correct}/${quizWords.length}`;

      // record stats only once per quiz
      if (!countedThisQuiz && attemptedCount > 0 && typeof window.recordExerciseResult === "function") {
        window.recordExerciseResult("spelling", attemptedCount, correct);
        countedThisQuiz = true;
      }
    }



    // events
    const onSave = () => {
      const list = parseInputWords(wordsInput.value);
      if (!list.length) return;
      addWords(list);
      wordsInput.value = "";
      if (showingSavedWords) {
        renderSavedWords();
      }
    };


    const onShow = () => {
      if (!showingSavedWords) {
        // show
        renderSavedWords();
        showingSavedWords = true;
        showWordsBtn.textContent = "Hide saved words";
      } else {
        // hide
        savedWordsArea.innerHTML = "";
        showingSavedWords = false;
        showWordsBtn.textContent = "Show saved words";
      }
    };


    const onClearAll = () => {
      if (!confirm("Clear all saved words?")) return;
      words = [];
      saveWordsToStorage(words);

      if (showingSavedWords) {
        renderSavedWords();
      } else {
        savedWordsArea.innerHTML = "";
      }

      updateCount();
      listEl.innerHTML = "";
      scoreBox.textContent = "";
    };


    const onNewQuiz = () => newQuiz();
    const onCheckAll = () => checkAll();
    const onShowAnswers = () => showAnswers();

const onRefreshVoices = () => {
  voices = getVoicesSafe();
  updateVoiceCount();
  populateVoiceSelect();
  alert(`Voices loaded: ${voices.length}`);
};


    saveWordsBtn.addEventListener("click", onSave);
    showWordsBtn.addEventListener("click", onShow);
    clearAllBtn.addEventListener("click", onClearAll);

    newQuizBtn.addEventListener("click", onNewQuiz);
    checkAllBtn.addEventListener("click", onCheckAll);
    showAnswersBtn.addEventListener("click", onShowAnswers);

    refreshVoicesBtn.addEventListener("click", onRefreshVoices);

    // init voices handler
if (window.speechSynthesis) {
  voicesChangedHandler = () => {
    voices = getVoicesSafe();
    updateVoiceCount();
    populateVoiceSelect();
  };
  window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
}


    updateCount();
    updateVoiceCount();
    populateVoiceSelect();

    savedWordsArea.innerHTML = "";           // start hidden so that words are not shown from start
    showWordsBtn.textContent = "Show saved words";
    showingSavedWords = false;

    // UPDATE GLOBAL STATS WHEN ENTERING THIS PAGE
    if (typeof window.updateGlobalStatsUI === "function") {
      window.updateGlobalStatsUI();
    }    

    // cleanup for router
    return function unmountSpelling() {
      saveWordsBtn.removeEventListener("click", onSave);
      showWordsBtn.removeEventListener("click", onShow);
      clearAllBtn.removeEventListener("click", onClearAll);

      newQuizBtn.removeEventListener("click", onNewQuiz);
      checkAllBtn.removeEventListener("click", onCheckAll);
      showAnswersBtn.removeEventListener("click", onShowAnswers);

      refreshVoicesBtn.removeEventListener("click", onRefreshVoices);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.onvoiceschanged === voicesChangedHandler) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      }
    };
  };
})();
