(function () {
  "use strict";

  /* ======================
     Global mistake tracking
     ====================== */
  let stats = {
    totalChecked: 0,
    wrongByTopic: {},   // topic name -> count
    wrongByPair: {},    // "student->correct" -> count
    wrongItems: []      // store recent mistakes
  };

  /* ---------------- TEACHER CONFIG: topics ---------------- */
  const TOPICS = {
    "Articles: a vs an – infinite": {
      instructions: "Type a or an.",
      generator: { type: "articles_a_an", count: 10 },
      explain: `
        <strong>A vs An</strong><br><br>

        Use <strong>a</strong> before a <em>consonant sound</em>:<br>
        a book • a university • a USB cable • a European city<br><br>

        Use <strong>an</strong> before a <em>vowel sound</em>:<br>
        an apple • an hour • an MRI scan • an honest person<br><br>

        <strong>Important:</strong> Decide by the <em>sound</em>, not the first letter.<br>
        “u” and “eu” often sound like /juː/ → <strong>a</strong>.
      `
    },

    "Prepositions: in / on / at (time) – infinite": {
      instructions: "Type in, on, or at.",
      generator: { type: "prepositions_time", count: 10 },
      explain: `
        <strong>In / On / At (time)</strong><br><br>

        Use <strong>at</strong> for precise times:<br>
        at 5 pm • at noon • at midnight<br><br>

        Use <strong>on</strong> for days and dates:<br>
        on Monday • on 5 May • on the 12th<br><br>

        Use <strong>in</strong> for months, years, and longer periods:<br>
        in June • in 2024 • in the morning<br><br>

        <strong>Common mistakes:</strong><br>
        • in 7 o’clock (should be <strong>at</strong>)<br>
        • at Monday (should be <strong>on</strong>)<br>
      `
    },

    "Present perfect vs past simple – infinite": {
      instructions: "Type the correct form. Examples: “have eaten / has eaten / went / did”.",
      generator: { type: "pp_vs_ps", count: 10 },
      explain: `
        <strong>Present perfect vs Past simple</strong><br><br>

        <strong>Present perfect</strong> (have/has + past participle) links the past to <em>now</em>.<br>
        Use it with: already, just, yet, ever/never, so far, today, this week, recently.<br>
        Examples: I <strong>have finished</strong> already. • She <strong>has never been</strong> to London.<br><br>

        <strong>Past simple</strong> is for a <em>finished</em> time in the past.<br>
        Use it with: yesterday, last week, two days ago, in 2020, when I was younger.<br>
        Examples: I <strong>went</strong> yesterday. • They <strong>met</strong> in 2019.<br><br>

        <strong>Rule:</strong> If the time is finished → use <strong>past simple</strong>.
      `
    },

    "Subject–verb agreement – infinite": {
      instructions: "Type the correct verb form (present simple). Example: go/goes, do/does, have/has.",
      generator: { type: "sva_present", count: 10 },
      explain: `
        <strong>Subject–verb agreement (present simple)</strong><br><br>

        <strong>I / you / we / they</strong> + base verb:<br>
        I work • you play • we go • they study<br><br>

        <style>
          .ending { font-weight: bold; }
        </style>

        <strong>He / she / it</strong> + verb + <strong>-s</strong> (or spelling change):<br>
        he work<span class="ending">s</span> •
        she play<span class="ending">s</span> •
        it go<span class="ending">es</span> •
        he studie<span class="ending">s</span> •
        she watche<span class="ending">s</span><br><br>

        <strong>Special verbs:</strong><br>
        do → <strong>does</strong> • have → <strong>has</strong><br><br>

        <strong>Common error:</strong> forgetting the <strong>-s</strong> with he/she/it.<br>
        Quick check: If you can replace the subject with “he” → the verb usually needs <strong>-s</strong>.
      `
    }
  };

  /* ---------------- app logic ---------------- */
  const N = 10;

  // DOM refs (assigned on mount)
  let topicSelect, listEl, newSetBtn, checkAllBtn, showAnswersBtn, hideAnswersBtn, scoreBox;
  let explainBtn, feedbackBtn, explainBox, feedbackBox;

  let currentItems = [];

  function normalize(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, " ");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------------- generators ---------------- */
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pad2(n){ return String(n).padStart(2,"0"); }
  function normalizeSpaces(s){ return String(s).trim().replace(/\s+/g," "); }

  function startsWithVowelSound(word) {
    const w = String(word).toLowerCase();

    // silent h -> vowel sound
    if (/^(honest|honour|honorable|honourable|hour|heir|heiress|herb)\b/.test(w)) return true;

    // acronyms/initialisms said by letter: vowel-sound letter names
    // A, E, F, H, I, L, M, N, O, R, S, X
    if (/^(a|e|f|h|i|l|m|n|o|r|s|x)\b/.test(w)) return true;

    // normal vowel start
    if (/^[aeiou]/.test(w)) return true;

    // "you" sound (consonant) cases -> "a"
    if (/^(eu|u(?![aeiou])|uni|use|user|ufo|uk|usb|euro|european)\b/.test(w)) return false;

    // default consonant
    return false;
  }

  function articleForPhrase(phrase) {
    const firstWord = String(phrase).trim().split(/\s+/)[0];
    return startsWithVowelSound(firstWord) ? "an" : "a";
  }

  /* A / AN generator (curated for sound-based accuracy) */
  const AN_WORDS = [
    "apple","orange","egg","idea","example","engineer","artist","actor",
    "umbrella","email","answer","invoice","essay","exercise","argument",
    "ice cream","airport","island","event","experiment","opportunity",
    "objective","issue","error","accident","adult","animal","editor",
    "author","intern","enemy","image","option","outcome","interest",
    "effect","energy","emotion","episode","estimate","exception",
    "hour","honest person","honour","honest mistake","honourable act",
    "heir","heiress","herb","hourglass","honesty",
    "MBA student","FBI agent","CIA officer","MRI scan","X-ray",
    "SOS message","NSA report","EU agreement","AI system","RNA molecule",
    "LCD screen","LED display","API call","SQL error",
    "online order","unexpected result","important issue","early start",
    "old habit","open discussion","interesting idea","urgent email",
    "empty box","easy question","official answer","excellent result",
    "unusual case","international agreement","advanced level","academic article"
  ];

  const A_WORDS = [
    "book","car","dog","house","table","computer","phone","teacher",
    "student","chair","window","garden","picture","lesson","problem",
    "bike","bag","pen","map","job","team","project","report","meeting",
    "decision","hotel","haircut","homework","school","game","movie",
    "story","plan","goal","rule","test","task","skill","habit","career",
    "university student","uniform","European city","one-time offer",
    "user account","USB cable","UFO story","UK company","unit test",
    "useful skill","unique opportunity","usual problem","young person",
    "yearly report","youth club","yellow card","yoga class","yard sale",
    "historic building","historical event","heavy bag","high score",
    "hard test","helpful teacher","local shop","long journey",
    "modern house","new rule","normal day","practical solution",
    "real problem","simple answer","strong opinion","technical issue",
    "valuable lesson","weekly meeting","wrong answer","working solution","URL address"
  ];

  const A_AN_TEMPLATES = [
    "I need ___ {noun} for class.",
    "She bought ___ {noun} yesterday.",
    "He is ___ {noun}.",
    "They saw ___ {noun} at the station.",
    "We heard ___ {noun} in the meeting.",
    "I ordered ___ {noun} online.",
    "She wants to become ___ {noun}.",
    "He found ___ {noun} on the floor.",
    "They discussed ___ {noun} in class.",
    "I watched ___ {noun} last night.",

    "This is ___ {noun} I like.",
    "That sounds like ___ {noun}.",
    "It was ___ {noun} I didn’t expect.",
    "She mentioned ___ {noun} in her email.",
    "He works as ___ {noun}.",
    "They are looking for ___ {noun}.",
    "I have never seen ___ {noun} before.",
    "We need ___ {noun} right now.",
    "She explained ___ {noun} clearly.",
    "He described ___ {noun} in detail.",

    "It turned into ___ {noun} very quickly.",
    "That would be ___ {noun} to remember.",
    "This could be ___ {noun} for you.",
    "She reacted like ___ {noun}.",
    "He asked for ___ {noun} politely.",
    "They faced ___ {noun} at work.",
    "I was surprised by ___ {noun}.",
    "We considered ___ {noun} carefully.",
    "She gave ___ {noun} as an example.",
    "He ended up with ___ {noun}.",

    "There was ___ {noun} in the room.",
    "I noticed ___ {noun} immediately.",
    "She pointed out ___ {noun}.",
    "They complained about ___ {noun}.",
    "He focused on ___ {noun}.",
    "We talked about ___ {noun} later.",
    "She responded with ___ {noun}.",
    "I remember ___ {noun} clearly.",
    "They discovered ___ {noun} by chance.",
    "He dealt with ___ {noun} calmly.",

    "She was worried about ___ {noun}.",
    "I learned about ___ {noun} today.",
    "They prepared ___ {noun} in advance.",
    "He made ___ {noun} sound easy.",
    "We solved ___ {noun} together.",
    "She expected ___ {noun} to happen.",
    "I came across ___ {noun} online.",
    "They treated it like ___ {noun}."
  ];

  const A_AN_TEMPLATES_INITIAL = [
    "___ {noun} was left on the table.",
    "___ {noun} is missing.",
    "___ {noun} arrived this morning.",
    "___ {noun} caused a problem.",
    "___ {noun} appeared suddenly.",
    "___ {noun} surprised everyone.",
    "___ {noun} was discussed in class.",
    "___ {noun} made the news.",
    "___ {noun} is required for the task.",
    "___ {noun} changed everything.",

    "___ unusual {noun} happened yesterday.",
    "___ interesting {noun} came up in class.",
    "___ important {noun} was mentioned.",
    "___ unexpected {noun} caused confusion.",
    "___ excellent {noun} solved the issue.",
    "___ urgent {noun} needs attention.",
    "___ old {noun} was found.",
    "___ honest {noun} can be helpful.",
    "___ early {noun} made a difference.",
    "___ simple {noun} worked well.",

    "___ {noun} from the report was surprising.",
    "___ {noun} in the email was unclear.",
    "___ {noun} at the meeting stood out.",
    "___ {noun} on the desk belongs to me.",
    "___ {noun} in the story was memorable.",
    "___ {noun} for the project is needed.",
    "___ {noun} during the lesson caused laughter.",
    "___ {noun} on the screen caught attention.",
    "___ {noun} in the test was difficult.",
    "___ {noun} at the start matters most."
  ];

  const A_AN_ADJECTIVES = [
    "unusual","interesting","important","unexpected","excellent","urgent",
    "honest","early","simple","old","advanced","international","academic",
    "official","emergency","expensive","easy","innovative","ordinary",
    "obvious","useful","unique","European","young","yearly","local",
    "modern","practical","real","valuable"
  ];

  function pickNounWithAnswer() {
    const pickAn = Math.random() < 0.5;
    if (pickAn) return { noun: rand(AN_WORDS), article: "an" };
    return { noun: rand(A_WORDS), article: "a" };
  }

  function generateArticlesAAn(n = 10) {
    const out = [];

    for (let i = 0; i < n; i++) {
      const useInitial = Math.random() < 0.3;
      const templates = useInitial ? A_AN_TEMPLATES_INITIAL : A_AN_TEMPLATES;

      let t = rand(templates);
      const picked = pickNounWithAnswer();

      let injectedAdj = null;

      if (t.includes("{noun}") && Math.random() < 0.4 && !picked.noun.includes(" ")) {
        injectedAdj = rand(A_AN_ADJECTIVES);
        t = t.replace("{noun}", `${injectedAdj} {noun}`);
      }

      const prompt = t.replace("{noun}", picked.noun);

      let answer = picked.article;

      if (injectedAdj) {
        answer = startsWithVowelSound(injectedAdj) ? "an" : "a";
      }

      out.push({ prompt, answer });
    }

    return out;
  }

  /* Prepositions time generator */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const TIMES_OF_DAY = ["the morning","the afternoon","the evening"];
  const HOLIDAYS = ["Christmas","Easter","New Year’s Eve","New Year’s Day","Halloween"];

  function randomClockTime() {
    const h = rand([1,2,3,4,5,6,7,8,9,10,11,12]);
    const m = rand([0,5,10,15,20,25,30,35,40,45,50,55]);
    return `${h}:${pad2(m)}`;
  }

  function randomDate() {
    const day = rand([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
    const suf =
      (day % 10 === 1 && day !== 11) ? "st" :
      (day % 10 === 2 && day !== 12) ? "nd" :
      (day % 10 === 3 && day !== 13) ? "rd" : "th";
    return `${day}${suf}`;
  }

  function generatePrepositionsTime(n=10) {
    const frames = [
      () => ({ text: `My birthday is ___ ${rand(MONTHS)}.`, answer: "in" }),
      () => ({ text: `School starts ___ ${rand(MONTHS)}.`, answer: "in" }),
      () => ({ text: `We usually study ___ ${rand(TIMES_OF_DAY)}.`, answer: "in" }),
      () => ({ text: `I started learning English ___ ${rand(["2018","2019","2020","2021","2022","2023","2024","2025","2026"])}.`, answer: "in" }),

      () => ({ text: `We have PE ___ ${rand(WEEKDAYS)}.`, answer: "on" }),
      () => ({ text: `The test is ___ ${rand(WEEKDAYS)}.`, answer: "on" }),
      () => ({ text: `The deadline is ___ the ${randomDate()}.`, answer: "on" }),
      () => ({ text: `We have a quiz ___ ${rand(["Monday morning","Tuesday afternoon","Thursday evening"])}.`, answer: "on" }),

      () => ({ text: `The lesson starts ___ ${randomClockTime()}.`, answer: "at" }),
      () => ({ text: `Please call me ___ ${randomClockTime()}.`, answer: "at" }),
      () => ({ text: `We met ___ ${rand(HOLIDAYS)}.`, answer: "at" }),
      () => ({ text: `The train leaves ___ ${rand(["noon","midnight"])}.`, answer: "at" }),

      () => ({ text: `I relax ___ the weekend.`, answer: "at" })
    ];

    const out = [];
    for (let i = 0; i < n; i++) {
      const q = rand(frames)();
      out.push({ prompt: q.text, answer: q.answer });
    }
    return out;
  }

  /* Present perfect vs past simple generator */
  const VERBS = [
    { base:"go", ps:"went", pp:"gone" },
    { base:"see", ps:"saw", pp:"seen" },
    { base:"eat", ps:"ate", pp:"eaten" },
    { base:"do", ps:"did", pp:"done" },
    { base:"write", ps:"wrote", pp:"written" },
    { base:"take", ps:"took", pp:"taken" },
    { base:"buy", ps:"bought", pp:"bought" },
    { base:"make", ps:"made", pp:"made" },
    { base:"choose", ps:"chose", pp:"chosen" },
    { base:"break", ps:"broke", pp:"broken" },
    { base:"meet", ps:"met", pp:"met" },
    { base:"read", ps:"read", pp:"read" }
  ];

  const SUBJECTS = [
    { s:"I", have:"have" }, { s:"You", have:"have" }, { s:"We", have:"have" }, { s:"They", have:"have" },
    { s:"He", have:"has" }, { s:"She", have:"has" }
  ];

  const PP_MARKERS = ["already","just","recently","so far","today","this week","this month","in my life","yet","ever","never"];
  const PS_MARKERS = ["yesterday","last week","last month","last year","two days ago","three weeks ago","in 2018","in 2020","when I was younger","during the holiday"];

  function generatePPvsPS(n=10) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const subj = rand(SUBJECTS);
      const v = rand(VERBS);
      const usePP = Math.random() < 0.5;

      if (usePP) {
        const marker = rand(PP_MARKERS);
        const frameType = rand(["statement","negative","question"]);
        if (frameType === "question") {
          const aux = subj.have.charAt(0).toUpperCase() + subj.have.slice(1);
          out.push({ prompt: `___ ${subj.s} ever (${v.base}) ${marker}?`, answer: aux });
        } else if (frameType === "negative") {
          out.push({ prompt: `${subj.s} ___ not (${v.base}) ${marker}.`, answer: `${subj.have} ${v.pp}` });
        } else {
          out.push({ prompt: `${subj.s} ___ (${v.base}) ${marker}.`, answer: `${subj.have} ${v.pp}` });
        }
      } else {
        const marker = rand(PS_MARKERS);
        const frameType = rand(["statement","negative","question"]);
        if (frameType === "question") {
          out.push({ prompt: `___ ${subj.s} (${v.base}) it ${marker}?`, answer: "Did" });
        } else if (frameType === "negative") {
          out.push({ prompt: `${subj.s} ___ not (${v.base}) ${marker}.`, answer: v.ps });
        } else {
          out.push({ prompt: `${subj.s} ___ (${v.base}) ${marker}.`, answer: v.ps });
        }
      }
    }
    return out.map(x => ({ prompt: normalizeSpaces(x.prompt), answer: normalizeSpaces(x.answer) }));
  }

  /* Subject–verb agreement generator (present simple) */
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

  /* ---------------- render / check ---------------- */
  function initTopics() {
    topicSelect.innerHTML = "";
    Object.keys(TOPICS).forEach(k => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      topicSelect.appendChild(opt);
    });
    topicSelect.selectedIndex = 0;
  }

  function pickItemsForTopic(topic) {
    if (topic.generator?.type === "prepositions_time") return generatePrepositionsTime(topic.generator.count || N);
    if (topic.generator?.type === "articles_a_an") return generateArticlesAAn(topic.generator.count || N);
    if (topic.generator?.type === "pp_vs_ps") return generatePPvsPS(topic.generator.count || N);
    if (topic.generator?.type === "sva_present") return generateSVA(topic.generator.count || N);
    return shuffle(topic.items || []).slice(0, Math.min(N, (topic.items || []).length));
  }

  function showAnswers() {
    listEl.querySelectorAll(".answer").forEach(el => el.style.display = "inline");
  }
  function hideAnswers() {
    listEl.querySelectorAll(".answer").forEach(el => el.style.display = "none");
  }

  function renderSet() {
    const topic = TOPICS[topicSelect.value];
    currentItems = pickItemsForTopic(topic);

    listEl.innerHTML = "";
    scoreBox.textContent = "";
    explainBox.style.display = "none";
    feedbackBox.style.display = "none";

    const instr = document.createElement("div");
    instr.className = "card";
    const instrText = topic.instructions || "Type the missing word(s).";
    instr.innerHTML = `<div class="q"><strong>Instructions:</strong> ${instrText}</div>`;
    listEl.appendChild(instr);

    currentItems.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.index = String(idx);
      card.dataset.correct = "";

      const promptHtml = item.prompt.includes("___")
        ? item.prompt.replace("___", `<span class="gap">___</span>`)
        : item.prompt;

      card.innerHTML = `
        <div class="q">
          <strong>${idx + 1}.</strong> ${promptHtml}
          <span class="answer">Answer: <span class="ansText"></span></span>
        </div>
        <div class="ctrls">
          <input type="text" aria-label="Your answer" placeholder="Type here" autocomplete="off" spellcheck="false" />
          <button type="button" class="checkBtn">Check</button>
          <span class="result"></span>
        </div>
      `;

      card.querySelector(".ansText").textContent = item.answer;
      listEl.appendChild(card);
    });

    // IMPORTANT: scope to listEl (not document)
    listEl.querySelectorAll(".checkBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        checkOne(card);
        updateScore();
      });
    });

    hideAnswers();
  }

  function checkOne(card) {
    const idx = Number(card.dataset.index);
    const item = currentItems[idx];
    const resultEl = card.querySelector(".result");
    const input = card.querySelector('input[type="text"]');

    let student = normalize(input.value);
    let answer = normalize(item.answer);

    function parseArticle(raw) {
      const cleaned = String(raw)
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z]/g, "");

      if (cleaned === "a" || cleaned === "an") return cleaned;
      return "";
    }

    if (topicSelect.value.startsWith("Articles")) {
      student = parseArticle(input.value);
      answer  = parseArticle(item.answer);

      if (!student) {
        card.dataset.correct = "0";
        resultEl.textContent = 'Type only "a" or "an".';
        resultEl.className = "result bad";
        return;
      }
    }

    if (!student) {
      card.dataset.correct = "0";
      resultEl.textContent = "Enter an answer first.";
      resultEl.className = "result bad";
      return;
    }

    const ok = (student === answer);

    if (!ok && topicSelect.value.startsWith("Articles")) {
      resultEl.textContent = `Incorrect (you: "${student}" expected: "${answer}")`;
      resultEl.className = "result bad";
      return;
    }

    const topicKey = topicSelect.value;
    stats.totalChecked++;
    if (!stats.wrongByTopic[topicKey]) stats.wrongByTopic[topicKey] = 0;

    if (!ok) {
      stats.wrongByTopic[topicKey]++;
      const pairKey = `${student || "(blank)"}->${answer}`;
      stats.wrongByPair[pairKey] = (stats.wrongByPair[pairKey] || 0) + 1;
      stats.wrongItems.push({ topic: topicKey, prompt: item.prompt, student, answer });
      if (stats.wrongItems.length > 50) stats.wrongItems.shift();
    }

    card.dataset.correct = ok ? "1" : "0";
    resultEl.textContent = ok ? "Correct" : "Incorrect";
    resultEl.className = "result " + (ok ? "ok" : "bad");
  }

  function checkAll() {
    // scope to listEl
    listEl.querySelectorAll(".card[data-index]").forEach(card => checkOne(card));
    updateScore();
  }

  function updateScore() {
    const cards = Array.from(listEl.querySelectorAll(".card[data-index]"));
    const attempted = cards.filter(c => c.querySelector(".result")?.textContent);
    if (attempted.length === 0) { scoreBox.textContent = ""; return; }
    const correct = cards.filter(c => c.dataset.correct === "1").length;
    scoreBox.textContent = `Score: ${correct}/${cards.length}`;
  }

  /* ---------------- explain / feedback ---------------- */
  function toggleExplain() {
    const isOpen = explainBox.style.display === "block";

    if (isOpen) {
      explainBox.style.display = "none";
      return;
    }

    const topic = TOPICS[topicSelect.value];
    const html = topic.explain || "<strong>No explanation for this topic yet.</strong>";
    explainBox.innerHTML = html;

    explainBox.style.display = "block";
    feedbackBox.style.display = "none";
  }

  function toggleFeedback() {
    const isOpen = feedbackBox.style.display === "block";

    if (isOpen) {
      feedbackBox.style.display = "none";
      return;
    }

    feedbackBox.style.display = "block";
    explainBox.style.display = "none";

    if (stats.totalChecked === 0) {
      feedbackBox.innerHTML = "<strong>No feedback yet.</strong><br>Check a few answers first.";
      return;
    }

    const topicEntries = Object.entries(stats.wrongByTopic)
      .sort((a, b) => b[1] - a[1]);

    const topTopic = topicEntries[0]?.[0];
    const topTopicCount = topicEntries[0]?.[1] ?? 0;

    const pairEntries = Object.entries(stats.wrongByPair)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    let html = `<strong>Feedback (based on your mistakes)</strong><br><br>`;
    html += `Checked: <strong>${stats.totalChecked}</strong><br><br>`;

    if (topTopic) {
      html += `Most difficult topic so far: <strong>${topTopic}</strong> (${topTopicCount} wrong)<br><br>`;
    }

    if (pairEntries.length) {
      html += `<strong>Most common wrong answers:</strong><br><ol>`;
      pairEntries.forEach(([k, n]) => {
        const [given, correct] = k.split("->");
        html += `<li><code>${given}</code> → <code>${correct}</code> (${n})</li>`;
      });
      html += `</ol>`;
    } else {
      html += `No wrong answers recorded yet.`;
    }

    feedbackBox.innerHTML = html;
  }

  /* ==========================
     MOUNT ENTRY POINT (GLOBAL)
     ========================== */
  window.mountGrammar = function mountGrammar(root) {
    root.innerHTML = `
      <style>
        .row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin: 14px 0; }
        select, button, input[type="text"] { font-size: 1rem; }
        select { padding: 8px 10px; border:1px solid #bbb; border-radius:8px; background:#fff; }
        button { padding: 9px 12px; border:1px solid #bbb; border-radius:8px; background:#fff; cursor:pointer; }
        button:hover { background:#f5f5f5; }
        .card { border:1px solid #e2e2e2; border-radius:12px; padding: 12px; margin: 10px 0; }
        .q { line-height: 1.5; }
        .gap { display:inline-block; min-width: 3.4em; text-align:center; border-bottom:2px solid #222; padding: 0 4px; }
        .ctrls { margin-top: 10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .ctrls input[type="text"] { padding: 8px 10px; border:1px solid #bbb; border-radius:8px; width: 190px; }
        .result { font-weight:700; margin-left: 6px; }
        .result.ok { color: #0a6; }
        .result.bad { color: #c22; }
        .answer { display:none; color:#222; margin-left: 8px; font-weight:700; }
        .score { font-weight:700; }
        code { background:#f4f4f4; padding:2px 5px; border-radius:6px; }
      </style>

      <h2>Grammar exercises</h2>

      <div class="row">
        <label for="topicSelect"><strong>Topic:</strong></label>
        <select id="topicSelect"></select>

        <button id="newSetBtn" type="button">New set (10)</button>
        <button id="checkAllBtn" type="button">Check all</button>
        <button id="showAnswersBtn" type="button">Show answers</button>
        <button id="hideAnswersBtn" type="button">Hide answers</button>

        <button id="explainBtn" type="button">Explain</button>
        <button id="feedbackBtn" type="button">Feedback</button>

        <span class="score" id="scoreBox"></span>
      </div>

      <div id="explainBox" class="card" style="display:none"></div>
      <div id="feedbackBox" class="card" style="display:none"></div>
      <div id="list"></div>
    `;

    // Bind DOM (now it exists)
    topicSelect     = root.querySelector("#topicSelect");
    listEl          = root.querySelector("#list");
    newSetBtn       = root.querySelector("#newSetBtn");
    checkAllBtn     = root.querySelector("#checkAllBtn");
    showAnswersBtn  = root.querySelector("#showAnswersBtn");
    hideAnswersBtn  = root.querySelector("#hideAnswersBtn");
    scoreBox        = root.querySelector("#scoreBox");

    explainBtn      = root.querySelector("#explainBtn");
    feedbackBtn     = root.querySelector("#feedbackBtn");
    explainBox      = root.querySelector("#explainBox");
    feedbackBox     = root.querySelector("#feedbackBox");

    // Attach events
    newSetBtn.addEventListener("click", renderSet);
    checkAllBtn.addEventListener("click", checkAll);
    showAnswersBtn.addEventListener("click", showAnswers);
    hideAnswersBtn.addEventListener("click", hideAnswers);
    topicSelect.addEventListener("change", renderSet);
    explainBtn.addEventListener("click", toggleExplain);
    feedbackBtn.addEventListener("click", toggleFeedback);

    // Boot (starts the app)
    initTopics();
    renderSet();

    // Cleanup (router can call this on navigation)
    return function unmountGrammar() {
      newSetBtn.removeEventListener("click", renderSet);
      checkAllBtn.removeEventListener("click", checkAll);
      showAnswersBtn.removeEventListener("click", showAnswers);
      hideAnswersBtn.removeEventListener("click", hideAnswers);
      topicSelect.removeEventListener("change", renderSet);
      explainBtn.removeEventListener("click", toggleExplain);
      feedbackBtn.removeEventListener("click", toggleFeedback);
      root.innerHTML = "";
    };
  };
})();
