// docs/js/capitalisation.js
// Capitalisation exercise – matched to A vs An layout/behaviour.

const EX_ID = "capital";
const STATS_KEY = "english_study_space_per_exercise_stats_v1";
const QUESTIONS_PER_QUIZ_DEFAULT = 10;

const CAPITAL_ITEMS = [
  {
    text: "we visited london in april.",
    corrected: "We visited London in April."
  },
  {
    text: "my sister speaks spanish and german.",
    corrected: "My sister speaks Spanish and German."
  },
  {
    text: "yesterday, president biden met with the prime minister.",
    corrected: "Yesterday, President Biden met with the Prime Minister."
  },
  {
    text: "on monday, we will celebrate christmas in sweden.",
    corrected: "On Monday, we will celebrate Christmas in Sweden."
  },
  {
    text: "he read 'harry potter' by j.k. rowling.",
    corrected: "He read 'Harry Potter' by J.K. Rowling."
  },
  {
    text: "the un is based in new york city.",
    corrected: "The UN is based in New York City."
  },
  {
    text: "we drove south until we reached the pacific ocean.",
    corrected: "We drove south until we reached the Pacific Ocean."
  },
  {
    text: "every january, the university opens new courses.",
    corrected: "Every January, the University opens new courses."
  },
  {
    text: "they moved to france in september.",
    corrected: "They moved to France in September."
  },
  {
    text: "we saw the eiffel tower in paris.",
    corrected: "We saw the Eiffel Tower in Paris."
  }
];

// ---- shared stats reading (same key as index.js) ----

function loadAllStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getExerciseStats(id) {
  const all = loadAllStats();
  if (!all[id]) return { totalAttempts: 0, totalCorrect: 0 };
  return all[id];
}

function getExerciseAccuracy(st) {
  if (!st.totalAttempts) return "Accuracy: –";
  const pct = Math.round((st.totalCorrect / st.totalAttempts) * 100);
  return `Accuracy: ${st.totalCorrect}/${st.totalAttempts} (${pct}%)`;
}

// ---- quiz generation ----

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateCapital(n) {
  const src =
    n <= CAPITAL_ITEMS.length
      ? shuffle(CAPITAL_ITEMS).slice(0, n)
      : shuffle(CAPITAL_ITEMS);
  return src;
}

// ---- main render ----

function renderCapitalisation(root) {
  let questionCount = QUESTIONS_PER_QUIZ_DEFAULT;

  function mount(n = questionCount) {
    const items = generateCapital(n);
    let countedThisQuiz = false;

    root.innerHTML = "";

    const container = document.createElement("div");
    container.className = "container";

    // ── Top card like A vs An ───────────────────────────
    const introCard = document.createElement("div");
    introCard.className = "card";

    const titleEl = document.createElement("h2");
    titleEl.style.marginTop = "0";
    titleEl.textContent = "Capitalisation";

    const accuracyEl = document.createElement("div");
    accuracyEl.style.marginBottom = "8px";
    accuracyEl.style.color = "var(--muted)";
    accuracyEl.textContent = getExerciseAccuracy(getExerciseStats(EX_ID));

    const introText = document.createElement("p");
    introText.style.color = "var(--muted)";
    introText.style.marginTop = "0";
    introText.textContent = "Rewrite the sentence with correct capital letters.";

    const explBtn = document.createElement("button");
    explBtn.className = "btn";
    explBtn.type = "button";
    explBtn.textContent = "Show explanation";

    const explBox = document.createElement("div");
    explBox.className = "exp";
    explBox.style.display = "none";
    explBox.style.marginTop = "8px";
    explBox.innerHTML = `
      <p style="margin-top:0;">
        Use capital letters for:
      </p>
      <ul style="margin-top:4px; padding-left:20px;">
        <li>The first word in a sentence.</li>
        <li>Names of people (J.K. Rowling), countries (France), cities (Paris).</li>
        <li>Languages and nationalities (Spanish, German).</li>
        <li>Days, months and holidays (Monday, April, Christmas).</li>
        <li>Titles before names (President Biden, Prime Minister).</li>
        <li>Main words in book and film titles (Harry Potter).</li>
      </ul>
    `;

    explBtn.onclick = () => {
      const visible = explBox.style.display === "block";
      explBox.style.display = visible ? "none" : "block";
      explBtn.textContent = visible ? "Show explanation" : "Hide explanation";
    };

    introCard.appendChild(titleEl);
    introCard.appendChild(accuracyEl);
    introCard.appendChild(introText);
    introCard.appendChild(explBtn);
    introCard.appendChild(explBox);
    container.appendChild(introCard);

    // ── Second card: controls + questions ──────────────
    const quizCard = document.createElement("div");
    quizCard.className = "card";

    // Controls row: Questions select + New set (like A vs An)
    const controlsRow = document.createElement("div");
    controlsRow.className = "row";

    const label = document.createElement("span");
    label.textContent = "Questions:";

    const select = document.createElement("select");
    select.innerHTML = `
      <option value="5">5</option>
      <option value="10" selected>10</option>
    `;
    select.value = String(n);
    select.onchange = () => {
      questionCount = parseInt(select.value, 10) || QUESTIONS_PER_QUIZ_DEFAULT;
    };

    const newSetBtn = document.createElement("button");
    newSetBtn.className = "btn";
    newSetBtn.type = "button";
    newSetBtn.textContent = "New set";

    controlsRow.appendChild(label);
    controlsRow.appendChild(select);
    controlsRow.appendChild(newSetBtn);
    quizCard.appendChild(controlsRow);

    // Question list
    const listEl = document.createElement("div");
    listEl.id = "list";
    quizCard.appendChild(listEl);

    items.forEach((item, idx) => {
      const qEl = document.createElement("div");
      qEl.className = "q";
      qEl.dataset.i = String(idx);

      const prompt = document.createElement("div");
      prompt.className = "prompt";
      prompt.textContent = `${idx + 1}. ${item.text}`;

      const row = document.createElement("div");
      row.className = "row";

      const input = document.createElement("input");
      input.className = "capital-input"; // not "ans"
      input.placeholder = "Rewrite with correct capitalisation";
      input.autocomplete = "off";
      input.spellcheck = false;

      const mark = document.createElement("span");
      mark.className = "mark";

      row.appendChild(input);
      row.appendChild(mark);

      qEl.appendChild(prompt);
      qEl.appendChild(row);
      listEl.appendChild(qEl);
    });

    // Check answers button under questions (like other grammar sets)
    const checkRow = document.createElement("div");
    checkRow.className = "row";

    const checkBtn = document.createElement("button");
    checkBtn.className = "btn";
    checkBtn.type = "button";
    checkBtn.textContent = "Check answers";

    checkRow.appendChild(checkBtn);
    quizCard.appendChild(checkRow);

    container.appendChild(quizCard);
    root.appendChild(container);

    // ── Logic ──────────────────────────────────────────
    function refreshAccuracy() {
      accuracyEl.textContent = getExerciseAccuracy(getExerciseStats(EX_ID));
    }

    function checkAll() {
      const qs = Array.from(listEl.querySelectorAll(".q"));
      let correct = 0;
      let attempted = 0;

      qs.forEach((qEl, i) => {
        const input = qEl.querySelector(".capital-input");
        const mark = qEl.querySelector(".mark");
        if (!input || !mark) return;

        const user = String(input.value || "").trim();
        const target = items[i].corrected.trim();

        if (!user) {
          mark.textContent = "";
          mark.className = "mark";
          qEl.dataset.correct = "";
          return;
        }

        attempted++;

        if (user === target) {
          mark.textContent = "✔";
          mark.className = "mark ok";
          qEl.dataset.correct = "1";
          correct++;
        } else {
          mark.textContent = "✖";
          mark.className = "mark bad";
          qEl.dataset.correct = "0";
        }
      });

      if (
        typeof window.recordExerciseResult === "function" &&
        !countedThisQuiz &&
        attempted > 0
      ) {
        window.recordExerciseResult(EX_ID, attempted, correct);
        countedThisQuiz = true;
        refreshAccuracy();
      }
    }

    checkBtn.onclick = checkAll;

    newSetBtn.onclick = () => {
      // rebuild with the currently selected number of questions
      mount(parseInt(select.value, 10) || QUESTIONS_PER_QUIZ_DEFAULT);
    };
  }

  mount(questionCount);
}

export default {
  id: EX_ID,
  render(root) {
    renderCapitalisation(root);
  }
};
