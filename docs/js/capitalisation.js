// docs/js/capitalisation.js  (ES module, fixed input visibility)

const CAPITAL_ITEMS = [
  {
    text: "we visited london in april.",
    corrected: "We visited London in April.",
    explanation: "Capitalize the first word, proper nouns (London) and months (April)."
  },
  {
    text: "my sister speaks spanish and german.",
    corrected: "My sister speaks Spanish and German.",
    explanation: "Capitalize the first word and languages (Spanish, German)."
  },
  {
    text: "yesterday, president biden met with the prime minister.",
    corrected: "Yesterday, President Biden met with the Prime Minister.",
    explanation: "Capitalize the first word and formal titles before names."
  },
  {
    text: "on monday, we will celebrate christmas in sweden.",
    corrected: "On Monday, we will celebrate Christmas in Sweden.",
    explanation: "Capitalize days, holidays and country names."
  },
  {
    text: "he read 'harry potter' by j.k. rowling.",
    corrected: "He read 'Harry Potter' by J.K. Rowling.",
    explanation: "Capitalize book titles and names."
  },
  {
    text: "the un is based in new york city.",
    corrected: "The UN is based in New York City.",
    explanation: "Capitalize the first word, acronyms (UN) and cities."
  },
  {
    text: "we drove south until we reached the pacific ocean.",
    corrected: "We drove south until we reached the Pacific Ocean.",
    explanation: "Capitalize geographic names (Pacific Ocean)."
  },
  {
    text: "every january, the university opens new courses.",
    corrected: "Every January, the University opens new courses.",
    explanation: "Capitalize months and institutions when used as proper names."
  },
  {
    text: "they moved to france in september.",
    corrected: "They moved to France in September.",
    explanation: "Capitalize the first word, country names and months."
  },
  {
    text: "we saw the eiffel tower in paris.",
    corrected: "We saw the Eiffel Tower in Paris.",
    explanation: "Capitalize monument names (Eiffel Tower) and cities (Paris)."
  }
];

const QUESTIONS_PER_QUIZ = 10;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateCapital() {
  return shuffle(CAPITAL_ITEMS).slice(0, QUESTIONS_PER_QUIZ);
}

function buildExercise(root) {
  const items = generateCapital();

  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container";

  // Intro card
  const introCard = document.createElement("div");
  introCard.className = "card";
  introCard.innerHTML = `
    <h2 style="margin-top:0;">Capitalisation</h2>
    <p style="color:var(--muted); margin-top:0;">
      Rewrite each sentence with correct capital letters. Then click “Check answers”.
    </p>
  `;

  const helpBtn = document.createElement("button");
  helpBtn.className = "btn";
  helpBtn.type = "button";
  helpBtn.textContent = "Show grammar help";
  helpBtn.style.marginTop = "8px";

  const helpBox = document.createElement("div");
  helpBox.className = "exp";
  helpBox.style.display = "none";
  helpBox.style.marginTop = "10px";
  helpBox.innerHTML = `
    <strong>Quick rules:</strong>
    <ul style="margin-top:4px; padding-left:20px;">
      <li>Capitalize the first word of every sentence.</li>
      <li>Capitalize names of people, countries, cities and languages.</li>
      <li>Capitalize days, months and holidays (Monday, April, Christmas).</li>
      <li>Capitalize titles before names (President Biden, Prime Minister).</li>
      <li>Capitalize important words in book titles (Harry Potter).</li>
    </ul>
  `;

  helpBtn.onclick = () => {
    const visible = helpBox.style.display === "block";
    helpBox.style.display = visible ? "none" : "block";
    helpBtn.textContent = visible ? "Show grammar help" : "Hide grammar help";
  };

  introCard.appendChild(helpBtn);
  introCard.appendChild(helpBox);
  container.appendChild(introCard);

  // Quiz card
  const quizCard = document.createElement("div");
  quizCard.className = "card";

  const scoreBox = document.createElement("div");
  scoreBox.className = "local-score";
  scoreBox.style.marginBottom = "12px";
  quizCard.appendChild(scoreBox);

  const listEl = document.createElement("div");
  listEl.id = "capital-list";
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
    input.className = "capital-input";          // NOT "ans"
    input.dataset.i = String(idx);
    input.placeholder = "Rewrite with correct capitalisation";
    input.autocomplete = "off";
    input.spellcheck = false;

    const mark = document.createElement("span");
    mark.className = "mark";

    row.appendChild(input);
    row.appendChild(mark);

    const exp = document.createElement("div");
    exp.className = "exp";
    exp.style.display = "none";
    exp.style.marginTop = "4px";
    exp.textContent = item.explanation;

    qEl.appendChild(prompt);
    qEl.appendChild(row);
    qEl.appendChild(exp);

    listEl.appendChild(qEl);
  });

  const btnRow = document.createElement("div");
  btnRow.className = "row";
  btnRow.style.marginTop = "12px";

  const checkBtn = document.createElement("button");
  checkBtn.className = "btn";
  checkBtn.type = "button";
  checkBtn.textContent = "Check answers";

  const tryBtn = document.createElement("button");
  tryBtn.className = "btn";
  tryBtn.type = "button";
  tryBtn.textContent = "Try again";

  const expBtn = document.createElement("button");
  expBtn.className = "btn";
  expBtn.type = "button";
  expBtn.textContent = "Show explanations";

  btnRow.appendChild(checkBtn);
  btnRow.appendChild(tryBtn);
  btnRow.appendChild(expBtn);
  quizCard.appendChild(btnRow);

  container.appendChild(quizCard);
  root.appendChild(container);

  // Logic
  function checkAll() {
    const qs = Array.from(listEl.querySelectorAll(".q"));
    let correct = 0;

    qs.forEach((qEl, i) => {
      const input = qEl.querySelector(".capital-input");
      const mark = qEl.querySelector(".mark");
      const exp = qEl.querySelector(".exp");
      if (!input || !mark || !exp) return;

      const user = String(input.value || "").trim();
      const target = items[i].corrected.trim();

      if (!user) {
        mark.textContent = "";
        mark.className = "mark";
        qEl.dataset.correct = "";
        return;
      }

      if (user === target) {
        mark.textContent = "✔";
        mark.className = "mark ok";
        exp.style.display = "none";
        qEl.dataset.correct = "1";
        correct++;
      } else {
        mark.textContent = "✖";
        mark.className = "mark bad";
        exp.style.display = "block";
        qEl.dataset.correct = "0";
      }
    });

    const total = items.length;
    scoreBox.textContent = `Score: ${correct} / ${total}`;

    if (typeof window.recordExerciseResult === "function") {
      window.recordExerciseResult("capital", total, correct);
    }
  }

  function toggleExplanations() {
    const all = quizCard.querySelectorAll(".exp");
    const anyVisible = [...all].some(e => e.style.display === "block");
    all.forEach(e => (e.style.display = anyVisible ? "none" : "block"));
    expBtn.textContent = anyVisible ? "Show explanations" : "Hide explanations";
  }

  function restart() {
    buildExercise(root);
  }

  checkBtn.onclick = checkAll;
  expBtn.onclick = toggleExplanations;
  tryBtn.onclick = restart;
}

export default {
  id: "capital",
  render(root) {
    buildExercise(root);
  }
};
