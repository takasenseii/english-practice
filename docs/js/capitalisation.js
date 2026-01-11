// capitalisation.js  (ES module)

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
  }
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateCapital(n = 8) {
  return shuffle(CAPITAL_ITEMS).slice(0, n);
}

function buildExercise(root) {
  const items = generateCapital();

  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container";

  const scoreBox = document.createElement("div");
  scoreBox.className = "local-score";
  scoreBox.style.marginBottom = "12px";
  container.appendChild(scoreBox);

  const listEl = document.createElement("div");
  listEl.id = "capital-list";
  container.appendChild(listEl);

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const row = document.createElement("div");
    row.className = "row q";

    const prompt = document.createElement("div");
    prompt.className = "prompt";
    prompt.textContent = item.text;

    const input = document.createElement("input");
    input.className = "ans";
    input.placeholder = "Write the sentence with correct capitalisation";

    const mark = document.createElement("span");
    mark.className = "mark";

    row.appendChild(prompt);
    row.appendChild(input);
    row.appendChild(mark);
    card.appendChild(row);

    const exp = document.createElement("div");
    exp.className = "exp";
    exp.style.display = "none";
    exp.textContent = item.explanation;
    card.appendChild(exp);

    listEl.appendChild(card);
  });

  const btnRow = document.createElement("div");
  btnRow.style.marginTop = "12px";

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "Check answers";

  const tryBtn = document.createElement("button");
  tryBtn.textContent = "Try again";
  tryBtn.style.marginLeft = "10px";

  const expBtn = document.createElement("button");
  expBtn.textContent = "Show explanations";
  expBtn.style.marginLeft = "10px";

  btnRow.appendChild(checkBtn);
  btnRow.appendChild(tryBtn);
  btnRow.appendChild(expBtn);
  container.appendChild(btnRow);

  root.appendChild(container);

  function checkAll() {
    const cards = container.querySelectorAll(".card");
    let correct = 0;
    const total = items.length;

    cards.forEach((card, i) => {
      const input = card.querySelector(".ans");
      const mark = card.querySelector(".mark");
      const exp = card.querySelector(".exp");

      const user = String(input.value).trim();
      const target = items[i].corrected.trim();

      if (!user) {
        mark.textContent = "";
        mark.className = "mark";
        return;
      }

      if (user === target) {
        mark.textContent = "✔";
        mark.className = "mark ok";
        correct++;
      } else {
        mark.textContent = "✖";
        mark.className = "mark bad";
        exp.style.display = "block";
      }
    });

    scoreBox.textContent = `Score: ${correct} / ${total}`;

    if (typeof window.recordExerciseResult === "function") {
      window.recordExerciseResult("capital", items.length, correct);
    }
  }

  function toggleExplanations() {
    const all = container.querySelectorAll(".exp");
    const anyVisible = [...all].some((e) => e.style.display === "block");
    all.forEach((e) => (e.style.display = anyVisible ? "none" : "block"));
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
