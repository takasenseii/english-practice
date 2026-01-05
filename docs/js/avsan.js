// AvsAN.js
// Articles: a vs an — standardized module: { id, title, generate, render }

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function startsWithVowelSound(word) {
  const w = String(word).toLowerCase();

  // silent h -> vowel sound
  if (/^(honest|honour|honorable|honourable|hour|heir|heiress|herb)\b/.test(w)) return true;

  // initialisms said by letter: vowel-sound letter names
  // A, E, F, H, I, L, M, N, O, R, S, X
  if (/^(a|e|f|h|i|l|m|n|o|r|s|x)\b/.test(w)) return true;

  // normal vowel start
  if (/^[aeiou]/.test(w)) return true;

  // "you" sound (consonant) cases -> "a"
  if (/^(eu|u(?![aeiou])|uni|use|user|ufo|uk|usb|euro|european)\b/.test(w)) return false;

  return false;
}

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

    // Inject adjective before single-word nouns
    if (t.includes("{noun}") && Math.random() < 0.4 && !picked.noun.includes(" ")) {
      injectedAdj = rand(A_AN_ADJECTIVES);
      t = t.replace("{noun}", `${injectedAdj} {noun}`);
    }

    const prompt = t.replace("{noun}", picked.noun);

    // default based on noun list; override if adjective injected (sound-based)
    let answer = picked.article;
    if (injectedAdj) answer = startsWithVowelSound(injectedAdj) ? "an" : "a";

    out.push({ prompt, answer });
  }

  return out;
}

function parseArticle(raw) {
  const cleaned = String(raw)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (cleaned === "a" || cleaned === "an") return cleaned;
  return "";
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
        <div class="q">
          <div class="prompt">${idx + 1}. ${it.prompt.replace("___", "<span class='gap'>___</span>")}</div>
          <input data-i="${idx}" placeholder="a / an" />
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

  function check() {
    const inputs = Array.from(listEl.querySelectorAll("input[data-i]"));
    let correct = 0;
    let attempted = 0;

    inputs.forEach((inp) => {
      const i = Number(inp.dataset.i);
      const student = parseArticle(inp.value);
      if (student) attempted++;
      if (student && student === items[i].answer) correct++;
    });

    if (attempted === 0) {
      resultEl.textContent = "Enter at least one answer.";
      return;
    }

    resultEl.textContent = `Score: ${correct}/${items.length}`;
  }

  function showAnswers() {
    Array.from(listEl.querySelectorAll("input[data-i]")).forEach((inp) => {
      const i = Number(inp.dataset.i);
      inp.value = items[i].answer;
    });
    resultEl.textContent = "Answers filled in.";
  }

  container.querySelector("#new").onclick = newSet;
  container.querySelector("#check").onclick = check;
  container.querySelector("#show").onclick = showAnswers;

  newSet();
}

export { generateArticlesAAn };

export default {
  id: "avsan",
  title: "A vs An",
  generate: generateArticlesAAn,
  render,
};
