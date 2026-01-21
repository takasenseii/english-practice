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

// ---- random pools + helpers for dynamic sentences ----

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Capitalise a single word
function capWord(w) {
  w = String(w);
  if (!w) return w;
  return w[0].toUpperCase() + w.slice(1);
}

// Capitalise each word in a title unless it is an article or a preposition less than five letters
function capTitle(str) {
  const small = new Set([
    "a","an","the",
    "and","but","or","nor","for","so","yet",
    "at","by","in","of","on","to","up","via","per",
    "as","from","into","onto","with","over","out","off"
  ]);

  // acronyms we want fully uppercased in titles
  const acronyms = new Set([
    "un","eu","nato","usa","uk","uae","nasa","esa","who","imf","oecd","europa","unesco"
  ]);

  const words = String(str).split(" ");
  const last = words.length - 1;

  return words
    .map((w, i) => {
      const isFirst = i === 0;
      const isLast = i === last;

      // Extract leading/trailing punctuation, keep core for logic
      const match = w.match(/^([^A-Za-z0-9]*)([A-Za-z0-9\-]+)([^A-Za-z0-9]*)$/);
      if (!match) {
        // nothing special, just return as-is (numbers, symbols, etc.)
        return w;
      }

      const [, prefix, core, suffix] = match;

      // Handle hyphenated words inside the core
      const parts = core.split("-");
      const newParts = parts.map((part, partIndex) => {
        const lower = part.toLowerCase();
        const cleanForAcronym = lower.replace(/\./g, ""); // just in case

        // Acronym? → all caps
        if (acronyms.has(cleanForAcronym)) {
          return part.toUpperCase();
        }

        // First/last *word* in the title: first segment always capitalised
        if ((isFirst || isLast) && partIndex === 0) {
          return capWord(lower);
        }

        // For hyphenated compounds, many styles also capitalise second part.
        // To keep it simple: if it's a "small word", keep lowercase, else capitalise.
        if (small.has(lower)) {
          return lower;
        }

        return capWord(lower);
      });

      const newCore = newParts.join("-");
      return prefix + newCore + suffix;
    })
    .join(" ");
}


const CAP_NAMES = ["alex","sara","michael","fatima","joel","anna","david","maria","li","mei","yuki","arjun","aisha","samuel","kwame","amina","diego","sofia","omar","hana","luca","noah","leila","yara","mohamed","chi","noura","raj","tariq","lina"];
const CAP_CITIES = ["paris","london","stockholm","tokyo","nairobi","berlin","madrid","rome","cairo","lagos","addis ababa","helsinki","oslo","copenhagen","zurich","vienna","istanbul","dubai","mumbai","delhi","jakarta","seoul","beijing","shanghai","sydney","toronto","new york","mexico city","buenos aires","santiago"];
const CAP_COUNTRIES = ["france","united kingdom","sweden","japan","kenya","germany","spain","italy","egypt","nigeria","ethiopia","finland","norway","denmark","switzerland","austria","turkiye","united arab emirates","india","china","south korea","indonesia","australia","canada","mexico","argentina","chile","brazil","south africa"];
const CAP_LANGUAGES = ["english","swedish","french","german","spanish","portuguese","italian","russian","ukrainian","polish","turkish","arabic","persian","hebrew","amharic","somali","hausa","yoruba","zulu","afrikaans","hindi","urdu","bengali","tamil","japanese","korean","chinese","vietnamese","thai","indonesian"];
const CAP_NATIONALITIES = ["french","british","swedish","japanese","kenyan","german","spanish","italian","egyptian","nigerian","ethiopian","finnish","norwegian","danish","swiss","austrian","turkish","emirati","indian","chinese","korean","indonesian","australian","canadian","mexican","argentinian","brazilian","south african","tanzanian","rwandan"];
const CAP_WEEKDAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const CAP_MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const CAP_HOLIDAYS = ["christmas","easter","good friday","new year","hanukkah","yom kippur","passover","ramadan","eid al-fitr","eid al-adha","diwali","holi","vesak","lunar new year","chuseok","songkran","nowruz","thanksgiving","halloween","independence day","labor day","bastille day","midsummer","day of the dead","carnival","kwanzaa","purim","pongal"];
const CAP_BOOKS = ["harry potter","the hunger games","the fault in our stars","the outsiders","to kill a mockingbird","the great gatsby","animal farm","lord of the flies","the catcher in the rye","the hobbit","the lord of the rings","twilight","percy jackson","maze runner","divergent","romeo and juliet","hamlet","the diary of a young girl","the chronicles of narnia"];


const CAP_ORGS = [
  { shortLower: "un", shortUpper: "UN", city: "new york city" },
  { shortLower: "eu", shortUpper: "EU", city: "brussels" },
  { shortLower: "nato", shortUpper: "NATO", city: "brussels" }
];

const CAP_TITLES = ["president", "prime minister", "king", "queen", "professor"];

// Each template returns { text, corrected } like CAPITAL_ITEMS
// 1) Names + cities + months
function capTemplateTravel() {
  const name = rand(CAP_NAMES);
  const city = rand(CAP_CITIES);
  const month = rand(CAP_MONTHS);

  const text = `${name} travelled to ${city} in ${month}.`;
  const corrected = `${capWord(name)} travelled to ${capTitle(city)} in ${capWord(month)}.`;

  return { text, corrected };
}


// 2) Pronoun I + country + weekday
function capTemplateITravel() {
  const country = rand(CAP_COUNTRIES);
  const weekday = rand(CAP_WEEKDAYS);

  const text = `i will travel to ${country} next ${weekday}.`;
  const corrected = `I will travel to ${capWord(country)} next ${capWord(weekday)}.`;

  return { text, corrected };
}

// 3) Languages and nationalities
function capTemplateLanguages() {
  const lang1 = rand(CAP_LANGUAGES);
  let lang2 = rand(CAP_LANGUAGES);
  while (lang2 === lang1) lang2 = rand(CAP_LANGUAGES);

  const text = `my sister speaks ${lang1} and ${lang2}.`;
  const corrected = `My sister speaks ${capWord(lang1)} and ${capWord(lang2)}.`;

  return { text, corrected };
}

// 4) Holidays + weekday + country
function capTemplateHoliday() {
  const holiday = rand(CAP_HOLIDAYS);
  const weekday = rand(CAP_WEEKDAYS);
  const country = rand(CAP_COUNTRIES);

  const text = `on ${weekday}, we celebrate ${holiday} in ${country}.`;
  const corrected = `On ${capWord(weekday)}, we celebrate ${capTitle(holiday)} in ${capTitle(country)}.`;

  return { text, corrected };
}


// 5) Titles before names + countries
function capTemplateTitle() {
  const title = rand(CAP_TITLES);
  const name = rand(CAP_NAMES);
  const country = rand(CAP_COUNTRIES);

  const text = `yesterday, ${title} ${name} visited ${country}.`;
  const corrected = `Yesterday, ${capWord(title)} ${capWord(name)} visited ${capTitle(country)}.`;

  return { text, corrected };
}


// 6) Organisations like UN / EU / NATO + cities
function capTemplateOrg() {
  const org = rand(CAP_ORGS);
  const text = `the ${org.shortLower} has its headquarters in ${org.city}.`;
  const corrected = `The ${org.shortUpper} has its headquarters in ${capTitle(org.city)}.`;

  return { text, corrected };
}

// 7) Book titles in quotation marks
function capTemplateBook() {
  const book = rand(CAP_BOOKS);
  const text = `have you read "${book}"?`;
  const corrected = `Have you read "${capTitle(book)}"?`;

  return { text, corrected };
}

const CAPITAL_TEMPLATES = [
  capTemplateTravel,
  capTemplateITravel,
  capTemplateLanguages,
  capTemplateHoliday,
  capTemplateTitle,
  capTemplateOrg,
  capTemplateBook
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
  const out = [];

  // Shuffle static items so they still appear, but in random order
  const staticItems = shuffle(CAPITAL_ITEMS);
  let staticIndex = 0;

  while (out.length < n) {
    const useStatic =
      staticIndex < staticItems.length && Math.random() < 0.5;

    if (useStatic) {
      // Use one of the original fixed examples
      out.push(staticItems[staticIndex++]);
    } else {
      // Use a dynamic template example
      const tpl = rand(CAPITAL_TEMPLATES);
      out.push(tpl());
    }
  }

  return out;
}


// ---- main render ----

function renderCapitalisation(root) {
  let questionCount = QUESTIONS_PER_QUIZ_DEFAULT;

  function mount(n = questionCount) {
    const items = generateCapital(n);
    let countedThisQuiz = false;

    root.innerHTML = "";

    const container = document.createElement("div");
    container.className = "container sentence-exercise";


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
      input.className = "capital-input sentence-input";
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
