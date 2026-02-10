// idioms.js
// Idioms exercise – 10 questions, 4 options each, mixed A1–C1
// Scoring rule:
// - Attempts: counts how many questions were answered on each Check
// - Correct: counts ONLY newly-correct answers per question within the current quiz
//   (Example: 5/10, then +2/5 => total +7/15)

"use strict";

const EX_ID = "idioms";
const QUESTIONS_PER_QUIZ_DEFAULT = 10;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pickN(pool, n) {
  return shuffle(pool).slice(0, n);
}

// 100 common idioms (sentence + meaning + 3 distractors)
const IDIOMS = [
  { idiom: "break the ice", sentence: "To break the ice, he told a short joke.", correct: "to make people feel more comfortable", wrong: ["to start a fight", "to end a meeting", "to refuse to talk"] },
  { idiom: "piece of cake", sentence: "The test was a piece of cake.", correct: "very easy", wrong: ["very expensive", "very dangerous", "very boring"] },
  { idiom: "once in a blue moon", sentence: "We eat out once in a blue moon.", correct: "very rarely", wrong: ["every day", "at night", "all weekend"] },
  { idiom: "under the weather", sentence: "I’m feeling under the weather today.", correct: "a bit ill", wrong: ["very lucky", "very hungry", "very busy"] },
  { idiom: "hit the books", sentence: "I need to hit the books tonight.", correct: "study", wrong: ["go to sleep", "clean my room", "buy new books"] },
  { idiom: "call it a day", sentence: "Let’s call it a day and continue tomorrow.", correct: "stop working for now", wrong: ["celebrate a birthday", "start over", "work faster"] },
  { idiom: "get the hang of it", sentence: "After two lessons, she got the hang of it.", correct: "learn how to do it", wrong: ["forget it completely", "get angry about it", "pay for it"] },
  { idiom: "in a nutshell", sentence: "In a nutshell, we need more time.", correct: "briefly", wrong: ["very loudly", "with great risk", "in secret"] },
  { idiom: "cost an arm and a leg", sentence: "That jacket costs an arm and a leg.", correct: "is very expensive", wrong: ["is very small", "is very old", "is very popular"] },
  { idiom: "on the same page", sentence: "Before we start, let’s make sure we’re on the same page.", correct: "have the same understanding", wrong: ["read the same book", "sit next to each other", "use the same computer"] },

  { idiom: "spill the beans", sentence: "Don’t spill the beans about the surprise.", correct: "reveal a secret", wrong: ["cook dinner", "change the plan", "make a mistake"] },
  { idiom: "hit the sack", sentence: "I’m tired—I’m going to hit the sack.", correct: "go to bed", wrong: ["go to work", "go shopping", "go jogging"] },
  { idiom: "hang out", sentence: "We usually hang out after school.", correct: "spend time casually", wrong: ["argue loudly", "study hard", "leave quickly"] },
  { idiom: "give it a shot", sentence: "I’ve never tried it, but I’ll give it a shot.", correct: "try it", wrong: ["refuse it", "sell it", "hide it"] },
  { idiom: "the last straw", sentence: "When he lied again, it was the last straw.", correct: "the final problem that makes you give up", wrong: ["a small helpful detail", "a funny coincidence", "a lucky break"] },
  { idiom: "let the cat out of the bag", sentence: "She let the cat out of the bag and ruined the surprise.", correct: "accidentally reveal a secret", wrong: ["buy a pet", "lose something", "avoid a problem"] },
  { idiom: "burn the midnight oil", sentence: "He burned the midnight oil to finish the project.", correct: "worked late at night", wrong: ["woke up early", "took a long break", "traveled far"] },
  { idiom: "back to the drawing board", sentence: "The plan failed, so it’s back to the drawing board.", correct: "start again with a new plan", wrong: ["celebrate success", "do nothing", "ask for a refund"] },
  { idiom: "keep an eye on", sentence: "Please keep an eye on my bag.", correct: "watch/monitor", wrong: ["steal", "throw away", "repair"] },
  { idiom: "get cold feet", sentence: "He got cold feet before the interview.", correct: "become nervous and unsure", wrong: ["feel very confident", "get sick", "become angry"] },

  { idiom: "bark up the wrong tree", sentence: "If you blame me, you’re barking up the wrong tree.", correct: "accusing the wrong person", wrong: ["speaking too quietly", "agreeing too easily", "working too slowly"] },
  { idiom: "kill two birds with one stone", sentence: "By cycling to work, I kill two birds with one stone.", correct: "do two things with one action", wrong: ["waste time", "make things worse", "do something dangerous"] },
  { idiom: "take it with a grain of salt", sentence: "Take his story with a grain of salt.", correct: "don’t fully believe it", wrong: ["repeat it to everyone", "write it down", "feel sorry for him"] },
  { idiom: "a blessing in disguise", sentence: "Losing that job was a blessing in disguise.", correct: "something bad that turns out good", wrong: ["a clear mistake", "a planned event", "a simple lie"] },
  { idiom: "break a leg", sentence: "Break a leg in your performance tonight!", correct: "good luck", wrong: ["be careful", "don’t go", "work harder"] },
  { idiom: "cut corners", sentence: "They cut corners and the quality dropped.", correct: "do something cheaply to save time or money", wrong: ["improve a process", "cancel a project", "share a secret"] },
  { idiom: "keep your chin up", sentence: "Keep your chin up—you’ll do better next time.", correct: "stay positive", wrong: ["be silent", "leave early", "be more strict"] },
  { idiom: "in hot water", sentence: "He’s in hot water for missing the deadline.", correct: "in trouble", wrong: ["on vacation", "in love", "out of money"] },
  { idiom: "out of the blue", sentence: "Out of the blue, she called me after years.", correct: "suddenly, unexpectedly", wrong: ["after careful planning", "in the morning", "as a joke"] },
  { idiom: "on the fence", sentence: "I’m on the fence about moving.", correct: "undecided", wrong: ["very sure", "very tired", "very excited"] },

  { idiom: "the ball is in your court", sentence: "I’ve sent the offer—the ball is in your court.", correct: "it’s your decision/action now", wrong: ["you lost", "you are late", "you are wrong"] },
  { idiom: "pull someone’s leg", sentence: "Relax—I’m just pulling your leg.", correct: "joking/teasing", wrong: ["insulting seriously", "giving advice", "apologizing"] },
  { idiom: "hit the nail on the head", sentence: "You hit the nail on the head about the main issue.", correct: "be exactly right", wrong: ["be completely wrong", "be too rude", "be too quiet"] },
  { idiom: "miss the point", sentence: "You’re missing the point—this is about safety.", correct: "not understand the main idea", wrong: ["agree fully", "explain clearly", "finish quickly"] },
  { idiom: "get out of hand", sentence: "The situation got out of hand.", correct: "became uncontrolled", wrong: ["became very funny", "became very quiet", "became very simple"] },
  { idiom: "see eye to eye", sentence: "They don’t see eye to eye on politics.", correct: "agree", wrong: ["sleep", "compete", "ignore each other"] },
  { idiom: "on thin ice", sentence: "After that comment, you’re on thin ice.", correct: "in a risky situation", wrong: ["very safe", "very famous", "very relaxed"] },
  { idiom: "make up your mind", sentence: "Please make up your mind by Friday.", correct: "decide", wrong: ["complain", "change the topic", "forget"] },
  { idiom: "keep it to yourself", sentence: "If it’s private, keep it to yourself.", correct: "don’t tell others", wrong: ["tell everyone", "write a report", "ask permission"] },
  { idiom: "learn the hard way", sentence: "He learned the hard way not to ignore warnings.", correct: "learn from a bad experience", wrong: ["learn quickly", "learn from a teacher", "learn by reading"] },

  { idiom: "bite the bullet", sentence: "I’ll bite the bullet and call customer support.", correct: "do something unpleasant but necessary", wrong: ["avoid it forever", "celebrate loudly", "make it worse"] },
  { idiom: "get something off your chest", sentence: "I need to get this off my chest.", correct: "say something you’ve been holding in", wrong: ["exercise", "change clothes", "forget a promise"] },
  { idiom: "take it easy", sentence: "You’ve worked a lot—take it easy.", correct: "relax", wrong: ["work faster", "argue more", "travel far"] },
  { idiom: "over the moon", sentence: "She was over the moon about the results.", correct: "very happy", wrong: ["very angry", "very confused", "very bored"] },
  { idiom: "fed up", sentence: "I’m fed up with these delays.", correct: "annoyed and tired of it", wrong: ["excited", "hungry", "curious"] },
  { idiom: "get your act together", sentence: "We need to get our act together before Monday.", correct: "become organized and responsible", wrong: ["start acting classes", "go on vacation", "stop communicating"] },
  { idiom: "make ends meet", sentence: "It’s hard to make ends meet right now.", correct: "have enough money to live", wrong: ["become famous", "move abroad", "finish a book"] },
  { idiom: "a rip-off", sentence: "That price is a rip-off.", correct: "too expensive / unfair price", wrong: ["a bargain", "a gift", "a refund"] },
  { idiom: "by the book", sentence: "She does everything by the book.", correct: "following rules strictly", wrong: ["without planning", "with creativity", "as a joke"] },
  { idiom: "off the top of my head", sentence: "Off the top of my head, I can name three reasons.", correct: "from memory, without thinking long", wrong: ["after research", "by accident", "with help"] },

  { idiom: "take it personally", sentence: "Don’t take it personally—it wasn’t about you.", correct: "feel offended as if it targets you", wrong: ["feel proud", "feel sleepy", "feel confused"] },
  { idiom: "run out of time", sentence: "We ran out of time before the last question.", correct: "have no time left", wrong: ["have extra time", "be on time", "waste time"] },
  { idiom: "in the long run", sentence: "In the long run, this will save money.", correct: "over a long period of time", wrong: ["right now", "by chance", "for one day only"] },
  { idiom: "so far, so good", sentence: "So far, so good—no problems yet.", correct: "until now, things are okay", wrong: ["everything is finished", "things are terrible", "nothing matters"] },
  { idiom: "a quick fix", sentence: "This is only a quick fix, not a real solution.", correct: "a temporary solution", wrong: ["a perfect plan", "a slow process", "a secret trick"] },
  { idiom: "get the wrong end of the stick", sentence: "You got the wrong end of the stick—I meant something else.", correct: "misunderstand", wrong: ["understand perfectly", "get angry", "change your mind"] },
  { idiom: "go the extra mile", sentence: "She always goes the extra mile for customers.", correct: "make extra effort", wrong: ["leave early", "avoid work", "complain loudly"] },
  { idiom: "in the same boat", sentence: "We’re in the same boat—we all need help.", correct: "in the same situation", wrong: ["in different cities", "in danger", "in charge"] },
  { idiom: "keep someone posted", sentence: "Keep me posted about any changes.", correct: "keep me informed", wrong: ["ignore me", "argue with me", "pay me"] },
  { idiom: "make a long story short", sentence: "To make a long story short, we missed the train.", correct: "summarize briefly", wrong: ["add details", "lie", "change the subject"] },

  { idiom: "take a rain check", sentence: "Can I take a rain check on dinner?", correct: "postpone to another time", wrong: ["cancel forever", "pay in advance", "arrive early"] },
  { idiom: "jump the gun", sentence: "Don’t jump the gun—wait for the signal.", correct: "act too early", wrong: ["act too late", "act very carefully", "act secretly"] },
  { idiom: "cut to the chase", sentence: "Can we cut to the chase?", correct: "get to the main point", wrong: ["change the topic", "stop talking", "tell a joke"] },
  { idiom: "throw in the towel", sentence: "After three tries, he threw in the towel.", correct: "give up", wrong: ["win easily", "get promoted", "start exercising"] },
  { idiom: "keep your fingers crossed", sentence: "Keep your fingers crossed for tomorrow.", correct: "hope for good luck", wrong: ["plan carefully", "stay silent", "work harder"] },
  { idiom: "on a roll", sentence: "She’s on a roll—three wins in a row.", correct: "having repeated success", wrong: ["feeling sick", "being confused", "being late"] },
  { idiom: "give someone the benefit of the doubt", sentence: "Let’s give him the benefit of the doubt.", correct: "assume he may be innocent/right", wrong: ["blame him immediately", "ignore him", "punish him"] },
  { idiom: "speak of the devil", sentence: "Speak of the devil—here she is!", correct: "the person appears as you talk about them", wrong: ["tell a scary story", "say something rude", "change your opinion"] },
  { idiom: "go without saying", sentence: "It goes without saying that safety comes first.", correct: "is obvious", wrong: ["is false", "is secret", "is funny"] },
  { idiom: "pull yourself together", sentence: "Pull yourself together—we need to focus.", correct: "calm down and regain control", wrong: ["run away", "get excited", "take a nap"] },

  { idiom: "take a step back", sentence: "Let’s take a step back and look at the bigger picture.", correct: "pause and reconsider", wrong: ["leave forever", "rush forward", "celebrate"] },
  { idiom: "in the nick of time", sentence: "He arrived in the nick of time.", correct: "just in time", wrong: ["very early", "very late", "by accident"] },
  { idiom: "turn a blind eye", sentence: "The manager turned a blind eye to the mistake.", correct: "ignore it on purpose", wrong: ["fix it quickly", "report it", "laugh at it"] },
  { idiom: "read between the lines", sentence: "Read between the lines—he’s not happy.", correct: "understand the hidden meaning", wrong: ["read aloud", "translate word for word", "skip the text"] },
  { idiom: "a hot topic", sentence: "AI is a hot topic right now.", correct: "a widely discussed subject", wrong: ["a cooking method", "a private secret", "a small detail"] },
  { idiom: "up in the air", sentence: "Our travel plans are still up in the air.", correct: "not decided yet", wrong: ["finished", "very expensive", "very exciting"] },
  { idiom: "at the end of the day", sentence: "At the end of the day, health matters most.", correct: "when everything is considered", wrong: ["at midnight", "in the morning", "during lunch"] },
  { idiom: "take it or leave it", sentence: "That’s my final offer—take it or leave it.", correct: "accept it or reject it", wrong: ["improve it later", "borrow it", "hide it"] },
  { idiom: "keep your word", sentence: "He always keeps his word.", correct: "does what he promised", wrong: ["talks too much", "lies often", "forgets easily"] },
  { idiom: "make a point", sentence: "She made a point about fairness.", correct: "emphasize an important idea", wrong: ["end the conversation", "tell a lie", "avoid the topic"] },

  { idiom: "the tip of the iceberg", sentence: "What we found is just the tip of the iceberg.", correct: "only a small part of a bigger problem", wrong: ["the final solution", "a lucky moment", "a simple mistake"] },
  { idiom: "bend the rules", sentence: "They bent the rules to help him.", correct: "not follow rules strictly", wrong: ["create new rules", "punish someone", "refuse help"] },
  { idiom: "play it by ear", sentence: "We don’t have a plan—let’s play it by ear.", correct: "decide as we go", wrong: ["follow strict rules", "cancel immediately", "ask for permission"] },
  { idiom: "throw someone under the bus", sentence: "He threw his teammate under the bus.", correct: "blame someone to save yourself", wrong: ["praise someone publicly", "help someone", "ignore someone"] },
  { idiom: "break even", sentence: "We broke even on the event.", correct: "no profit and no loss", wrong: ["made a lot of money", "lost everything", "forgot to pay"] },
  { idiom: "get wind of", sentence: "She got wind of the new policy.", correct: "hear about (often unofficially)", wrong: ["forget about", "argue about", "write about"] },
  { idiom: "in over your head", sentence: "I’m in over my head with this project.", correct: "it’s too difficult for me", wrong: ["it’s too easy", "it’s boring", "it’s illegal"] },
  { idiom: "keep a low profile", sentence: "After the mistake, he kept a low profile.", correct: "avoid attention", wrong: ["show off", "travel a lot", "work faster"] },
  { idiom: "make a fuss", sentence: "Don’t make a fuss—it's a small issue.", correct: "complain too much", wrong: ["solve it quickly", "laugh loudly", "pay extra"] },
  { idiom: "take a hit", sentence: "Sales took a hit this month.", correct: "decreased / were damaged", wrong: ["increased", "stayed the same", "disappeared completely"] },

  { idiom: "put all your eggs in one basket", sentence: "Don’t put all your eggs in one basket with investments.", correct: "depend on only one option", wrong: ["save money", "work too slowly", "change your mind"] },
  { idiom: "throw money down the drain", sentence: "Buying that was throwing money down the drain.", correct: "wasting money", wrong: ["saving money", "earning money", "borrowing money"] },
  { idiom: "get your hands dirty", sentence: "He’s not afraid to get his hands dirty.", correct: "do hard or practical work", wrong: ["avoid work", "commit a crime", "get sick easily"] },
  { idiom: "keep your head above water", sentence: "I’m just trying to keep my head above water.", correct: "survive/manage with difficulty", wrong: ["be very successful", "quit immediately", "celebrate"] },
  { idiom: "ahead of the curve", sentence: "Their tech is ahead of the curve.", correct: "more advanced than others", wrong: ["outdated", "illegal", "unpopular"] },
  { idiom: "add fuel to the fire", sentence: "His comment added fuel to the fire.", correct: "made the situation worse", wrong: ["calmed things down", "ended the problem", "changed the topic"] },
  { idiom: "have a lot on your plate", sentence: "I can’t help—I have a lot on my plate.", correct: "have many responsibilities", wrong: ["be very hungry", "be bored", "be very rich"] },
  { idiom: "get the ball rolling", sentence: "Let’s get the ball rolling.", correct: "start the process", wrong: ["stop everything", "delay", "argue"] },
  { idiom: "go down in flames", sentence: "The deal went down in flames.", correct: "failed badly", wrong: ["succeeded easily", "was postponed", "was kept secret"] },
  { idiom: "hit a snag", sentence: "We hit a snag with the payment system.", correct: "face an unexpected problem", wrong: ["finish early", "get praise", "change jobs"] },

  { idiom: "have second thoughts", sentence: "I’m having second thoughts about buying it.", correct: "doubting the decision", wrong: ["feeling sure", "feeling sick", "feeling proud"] },
  { idiom: "out of your comfort zone", sentence: "Public speaking is out of my comfort zone.", correct: "unfamiliar and challenging", wrong: ["very relaxing", "very boring", "very expensive"] },
  { idiom: "keep something in mind", sentence: "Keep in mind that the deadline is Friday.", correct: "remember/consider", wrong: ["forget", "deny", "celebrate"] },
  { idiom: "on short notice", sentence: "Sorry for the meeting on short notice.", correct: "with little warning time", wrong: ["with a long plan", "very late", "in private"] },
  { idiom: "rule of thumb", sentence: "As a rule of thumb, save 10% of your income.", correct: "a general practical guideline", wrong: ["a strict law", "a random guess", "a personal secret"] },
  { idiom: "get something straight", sentence: "Let’s get one thing straight.", correct: "clarify", wrong: ["celebrate", "hide it", "forget it"] },
  { idiom: "cut someone some slack", sentence: "Cut her some slack—she’s new.", correct: "be less critical", wrong: ["be stricter", "ignore completely", "fire her"] },
  { idiom: "go back and forth", sentence: "We went back and forth for an hour.", correct: "argue/discuss repeatedly", wrong: ["agree quickly", "stay silent", "work alone"] },
  { idiom: "get your priorities straight", sentence: "You need to get your priorities straight.", correct: "focus on what matters most", wrong: ["work faster", "sleep more", "travel less"] },
  { idiom: "a wake-up call", sentence: "That accident was a wake-up call.", correct: "a warning that forces you to take action", wrong: ["a celebration", "a small joke", "a lucky sign"] },

  { idiom: "the big picture", sentence: "Don’t focus on details—look at the big picture.", correct: "the overall situation", wrong: ["a photo", "a small problem", "a secret plan"] },
  { idiom: "on the right track", sentence: "You’re on the right track with this essay.", correct: "moving toward success", wrong: ["completely wrong", "finished already", "being rude"] },
  { idiom: "throw a fit", sentence: "He threw a fit when he lost.", correct: "have an angry outburst", wrong: ["laugh quietly", "leave politely", "fall asleep"] },
  { idiom: "cross that bridge when we come to it", sentence: "Let’s cross that bridge when we come to it.", correct: "deal with it later if it happens", wrong: ["solve it now", "ignore forever", "avoid responsibility"] },
  { idiom: "bite off more than you can chew", sentence: "I bit off more than I can chew this semester.", correct: "take on too much", wrong: ["do too little", "be lazy", "be very lucky"] },
  { idiom: "go out of your way", sentence: "Thanks for going out of your way to help.", correct: "make extra effort", wrong: ["refuse help", "leave early", "delay on purpose"] },
  { idiom: "get your wires crossed", sentence: "We got our wires crossed about the time.", correct: "miscommunicate", wrong: ["agree perfectly", "cancel quickly", "forget a name"] },
  { idiom: "keep the peace", sentence: "She tried to keep the peace in the group.", correct: "prevent conflict", wrong: ["start conflict", "win a debate", "avoid work"] },
  { idiom: "take someone’s word for it", sentence: "I’ll take your word for it.", correct: "believe you without proof", wrong: ["argue with you", "ignore you", "test you"] },
  { idiom: "make a comeback", sentence: "After the injury, she made a comeback.", correct: "return to success", wrong: ["move abroad", "quit forever", "lose interest"] }
];

function buildQuestions(count) {
  return pickN(IDIOMS, count).map((it, idx) => {
    const options = shuffle([it.correct, ...it.wrong]).map(String);
    const correctIndex = options.indexOf(it.correct);
    return {
      n: idx + 1,
      idiom: it.idiom,
      sentence: it.sentence,
      options,
      correctIndex
    };
  });
}

function render(root) {
  const state = {
    questions: buildQuestions(QUESTIONS_PER_QUIZ_DEFAULT),
    checked: false,
    lastScoreText: "",
    awardedCorrect: new Array(QUESTIONS_PER_QUIZ_DEFAULT).fill(false),
    lastAnswers: null   
  };


  root.innerHTML = `
    <div class="container">
      <div class="topbar">
        <div class="brand">Idioms</div>
        <div class="global-stats" data-ex="${EX_ID}"></div>
      </div>

      <div class="card">
        <div class="pill">Vocabulary</div>
        <h3>Idioms (10 questions)</h3>
        <p>Choose the best meaning of the idiom in the sentence.</p>

        <div class="row" style="gap:10px; flex-wrap:wrap; margin: 12px 0;">
          <button class="btn" id="newBtn">New quiz</button>
          <button class="btn" id="checkBtn">Check</button>
          <div id="score" style="margin-left:auto;"></div>
        </div>

        <div id="list"></div>
      </div>
    </div>
  `;

  const listEl = root.querySelector("#list");
  const scoreEl = root.querySelector("#score");
  const checkBtn = root.querySelector("#checkBtn");
  const newBtn = root.querySelector("#newBtn");

  function renderList() {
    const html = state.questions
      .map((q, qi) => {
        const name = `q_${qi}`;
        const opts = q.options
          .map((opt, oi) => {
            return `
              <label class="choice" style="display:flex; gap:10px; align-items:flex-start; padding:8px 0;">
                <input type="radio" name="${name}" value="${oi}" ${state.checked ? "disabled" : ""} />
                <span>${escapeHtml(opt)}</span>
                <span class="mark" data-mark="${qi}_${oi}" style="margin-left:auto;"></span>
              </label>
            `;
          })
          .join("");

        return `
          <div class="q" data-q="${qi}" style="padding:12px 0; border-top: 1px solid rgba(255,255,255,0.08);">
            <div class="prompt" style="margin-bottom:8px;">
              <div style="opacity:0.85; font-size: 13px; margin-bottom:6px;">
                ${q.n}) Idiom: <strong>${escapeHtml(q.idiom)}</strong>
              </div>
              <div>${escapeHtml(q.sentence)}</div>
            </div>
            <div class="choices">${opts}</div>
          </div>
        `;
      })
      .join("");

    listEl.innerHTML = html;
    scoreEl.textContent = state.checked ? state.lastScoreText : "";
  }

  function getUserAnswers() {
    return state.questions.map((q, qi) => {
      const checked = root.querySelector(`input[name="q_${qi}"]:checked`);
      return checked ? Number(checked.value) : null;
    });
  }

  function clearMarks() {
    root.querySelectorAll(".mark").forEach((m) => {
      m.textContent = "";
      m.style.color = "";
      m.style.fontWeight = "";
    });
  }

function markResults(answers) {
  clearMarks();
  const picked = Array.isArray(answers) ? answers : getUserAnswers();


    let attemptedThisCheck = 0;
    let newlyCorrectThisCheck = 0;

    // for display only (current correct out of 10)
    let correctNow = 0;

    state.questions.forEach((q, qi) => {
      const a = picked[qi];

      if (a !== null) attemptedThisCheck++;

      const isCorrect = a === q.correctIndex;
      if (isCorrect) correctNow++;

      // mark user's choice
      if (a !== null) {
        const markEl = root.querySelector(`[data-mark="${qi}_${a}"]`);
        if (markEl) {
          markEl.textContent = isCorrect ? "✔" : "✖";
          markEl.style.color = isCorrect ? "#3ddc84" : "#ff6b6b";
          markEl.style.fontWeight = "700";
        }
      }

      // always show correct option
      const correctMarkEl = root.querySelector(`[data-mark="${qi}_${q.correctIndex}"]`);
      if (correctMarkEl && a !== q.correctIndex) {
        correctMarkEl.textContent = "✔";
        correctMarkEl.style.color = "#3ddc84";
        correctMarkEl.style.fontWeight = "700";
      }

      // stats: only newly-correct answers count as correct points (once per question)
      if (isCorrect && !state.awardedCorrect[qi]) {
        state.awardedCorrect[qi] = true;
        newlyCorrectThisCheck++;
      }
    });

    state.lastScoreText = `Score: ${correctNow}/${state.questions.length}`;
    scoreEl.textContent = state.lastScoreText;

    // example: 5/10 then +2/5 => total 7/15
    if (typeof window.recordExerciseResult === "function" && attemptedThisCheck > 0) {
      window.recordExerciseResult(EX_ID, attemptedThisCheck, newlyCorrectThisCheck);
    }
  }
  
checkBtn.addEventListener("click", () => {
  state.lastAnswers = getUserAnswers(); // read while inputs are enabled
  state.checked = true;
  renderList();                         // rebuild + disable inputs
  markResults(state.lastAnswers);       // apply marks on the new DOM
});

  newBtn.addEventListener("click", () => {
    state.questions = buildQuestions(QUESTIONS_PER_QUIZ_DEFAULT);
    state.checked = false;
    state.lastScoreText = "";
    state.awardedCorrect = new Array(state.questions.length).fill(false);
    renderList();
    clearMarks();
  });

  renderList();

  if (typeof window.updateGlobalStatsUI === "function") {
    window.updateGlobalStatsUI();
  }

  return function unmount() {};
}

export default { id: EX_ID, title: "Idioms", render };
