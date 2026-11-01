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

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlights first occurrence of idiom in sentence
function highlightTerm(sentence, term) {
  const s = String(sentence);
  const t = String(term).trim();
  if (!t) return escapeHtml(s);

  const re = new RegExp(`\\b${escapeRegExp(t)}\\b`, "i");
  const m = s.match(re);
  if (!m) return escapeHtml(s);

  const start = m.index;
  const end = start + m[0].length;

  return (
    escapeHtml(s.slice(0, start)) +
    `<span class="hl-phrase">${escapeHtml(s.slice(start, end))}</span>` +
    escapeHtml(s.slice(end))
  );
}

function pickN(pool, n) {
  return shuffle(pool).slice(0, n);
}

// Idiom bank (sentence + meaning + 3 distractors)
const IDIOMS = [
  { idiom: "break the ice", sentence: "To break the ice, he told a short joke.", correct: "to make people feel more comfortable", wrong: ["to avoid discussing an uncomfortable subject", "to make a formal introduction", "to refuse to talk"] },
  { idiom: "piece of cake", sentence: "The test was a piece of cake.", correct: "very easy", wrong: ["very familiar", "very short", "very boring"] },
  { idiom: "once in a blue moon", sentence: "We eat out once in a blue moon.", correct: "very rarely", wrong: ["at regular intervals", "at an unexpected time", "all weekend"] },
  { idiom: "under the weather", sentence: "I’m feeling under the weather today.", correct: "a bit ill", wrong: ["a little anxious", "physically exhausted", "very busy"] },
  { idiom: "hit the books", sentence: "I need to hit the books tonight.", correct: "study", wrong: ["prepare a written timetable", "finish a written assignment", "buy new books"] },
  { idiom: "call it a day", sentence: "Let’s call it a day and continue tomorrow.", correct: "stop working for now", wrong: ["finish the whole project", "change the way we work", "work faster"] },
  { idiom: "get the hang of it", sentence: "After two lessons, she got the hang of it.", correct: "learn how to do it", wrong: ["become confident enough to teach it", "find an easier way to avoid it", "pay for it"] },
  { idiom: "in a nutshell", sentence: "In a nutshell, we need more time.", correct: "briefly", wrong: ["in simpler language", "with a personal example", "in secret"] },
  { idiom: "cost an arm and a leg", sentence: "That jacket costs an arm and a leg.", correct: "is very expensive", wrong: ["is poor value despite being cheap", "requires a payment in instalments", "is very popular"] },
  { idiom: "on the same page", sentence: "Before we start, let’s make sure we’re on the same page.", correct: "have the same understanding", wrong: ["have the same responsibilities", "have the same level of experience", "use the same computer"] },

  { idiom: "spill the beans", sentence: "Don’t spill the beans about the surprise.", correct: "reveal a secret", wrong: ["spread a rumour", "explain a misunderstanding", "make a mistake"] },
  { idiom: "hit the sack", sentence: "I’m tired—I’m going to hit the sack.", correct: "go to bed", wrong: ["leave work", "stop worrying", "go jogging"] },
  { idiom: "hang out", sentence: "We usually hang out after school.", correct: "spend time casually", wrong: ["travel somewhere together", "take part in organised activities", "leave quickly"] },
  { idiom: "give it a shot", sentence: "I’ve never tried it, but I’ll give it a shot.", correct: "try it", wrong: ["make another attempt after failing", "agree to watch someone try", "hide it"] },
  { idiom: "the last straw", sentence: "When he lied again, it was the last straw.", correct: "the final problem that makes you give up", wrong: ["the strongest reason for beginning", "the last difficulty before success", "a lucky break"] },
  { idiom: "let the cat out of the bag", sentence: "She let the cat out of the bag and ruined the surprise.", correct: "accidentally reveal a secret", wrong: ["deliberately spread a rumour", "discover someone else's secret", "avoid a problem"] },
  { idiom: "burn the midnight oil", sentence: "He burned the midnight oil to finish the project.", correct: "worked late at night", wrong: ["started work early in the morning", "continued working without a break all day", "traveled far"] },
  { idiom: "back to the drawing board", sentence: "The plan failed, so it’s back to the drawing board.", correct: "start again with a new plan", wrong: ["repair the weakest part of the existing plan", "repeat the same plan more carefully", "ask for a refund"] },
  { idiom: "keep an eye on", sentence: "Please keep an eye on my bag.", correct: "watch/monitor", wrong: ["carry for someone", "search for carefully", "repair"] },
  { idiom: "get cold feet", sentence: "He got cold feet before the interview.", correct: "become nervous and unsure", wrong: ["become embarrassed about a mistake", "become impatient while waiting", "become angry"] },

  { idiom: "bark up the wrong tree", sentence: "If you blame me, you’re barking up the wrong tree.", correct: "accusing the wrong person", wrong: ["asking the wrong question", "using the wrong method", "working too slowly"] },
  { idiom: "kill two birds with one stone", sentence: "By cycling to work, I kill two birds with one stone.", correct: "do two things with one action", wrong: ["achieve one goal in two stages", "choose the better of two actions", "do something dangerous"] },
  { idiom: "take it with a grain of salt", sentence: "Take his story with a grain of salt.", correct: "don’t fully believe it", wrong: ["don’t discuss it publicly", "don’t let it upset you", "feel sorry for him"] },
  { idiom: "a blessing in disguise", sentence: "Losing that job was a blessing in disguise.", correct: "something bad that turns out good", wrong: ["something good that causes later trouble", "something helpful that was planned in advance", "a simple lie"] },
  { idiom: "break a leg", sentence: "Break a leg in your performance tonight!", correct: "good luck", wrong: ["be careful", "take a break", "work harder"] },
  { idiom: "cut corners", sentence: "They cut corners and the quality dropped.", correct: "do something cheaply to save time or money", wrong: ["reduce the amount of work by delegating", "reduce costs by negotiating better prices", "share a secret"] },
  { idiom: "keep your chin up", sentence: "Keep your chin up—you’ll do better next time.", correct: "stay positive", wrong: ["keep trying the same method", "hide your disappointment", "be more strict"] },
  { idiom: "in hot water", sentence: "He’s in hot water for missing the deadline.", correct: "in trouble", wrong: ["under pressure to make a decision", "in disagreement with a colleague", "out of money"] },
  { idiom: "out of the blue", sentence: "Out of the blue, she called me after years.", correct: "suddenly, unexpectedly", wrong: ["after careful consideration", "at a regularly arranged time", "as a joke"] },
  { idiom: "on the fence", sentence: "I’m on the fence about moving.", correct: "undecided", wrong: ["reluctant to discuss it", "opposed to it", "very excited"] },

  { idiom: "the ball is in your court", sentence: "I’ve sent the offer—the ball is in your court.", correct: "it’s your decision/action now", wrong: ["it’s your responsibility to explain the earlier decision", "it’s your turn to suggest a different offer", "you are wrong"] },
  { idiom: "pull someone’s leg", sentence: "Relax—I’m just pulling your leg.", correct: "joking/teasing", wrong: ["testing your patience", "trying to persuade you", "apologizing"] },
  { idiom: "hit the nail on the head", sentence: "You hit the nail on the head about the main issue.", correct: "be exactly right", wrong: ["identify one possible issue", "agree with the majority", "be too quiet"] },
  { idiom: "miss the point", sentence: "You’re missing the point—this is about safety.", correct: "not understand the main idea", wrong: ["ignore a minor detail", "disagree with the conclusion", "finish quickly"] },
  { idiom: "get out of hand", sentence: "The situation got out of hand.", correct: "became uncontrolled", wrong: ["became more complicated", "became widely known", "became very simple"] },
  { idiom: "see eye to eye", sentence: "They don’t see eye to eye on politics.", correct: "agree", wrong: ["understand one another", "have similar experiences", "ignore each other"] },
  { idiom: "on thin ice", sentence: "After that comment, you’re on thin ice.", correct: "in a risky situation", wrong: ["in an unfamiliar situation", "in a difficult argument", "very relaxed"] },
  { idiom: "make up your mind", sentence: "Please make up your mind by Friday.", correct: "decide", wrong: ["explain your decision", "change your decision", "forget"] },
  { idiom: "keep it to yourself", sentence: "If it’s private, keep it to yourself.", correct: "don’t tell others", wrong: ["deal with it alone", "think about it carefully", "ask permission"] },
  { idiom: "learn the hard way", sentence: "He learned the hard way not to ignore warnings.", correct: "learn from a bad experience", wrong: ["learn without anyone's help", "learn through repeated practice", "learn by reading"] },

  { idiom: "bite the bullet", sentence: "I’ll bite the bullet and call customer support.", correct: "do something unpleasant but necessary", wrong: ["admit that an earlier decision was wrong", "refuse to accept an unfair request", "make it worse"] },
  { idiom: "get something off your chest", sentence: "I need to get this off my chest.", correct: "say something you’ve been holding in", wrong: ["ask someone else to solve a problem", "explain a decision you have already made", "forget a promise"] },
  { idiom: "take it easy", sentence: "You’ve worked a lot—take it easy.", correct: "relax", wrong: ["work at a steady pace", "avoid making any decisions", "travel far"] },
  { idiom: "over the moon", sentence: "She was over the moon about the results.", correct: "very happy", wrong: ["very relieved", "very surprised", "very bored"] },
  { idiom: "fed up", sentence: "I’m fed up with these delays.", correct: "annoyed and tired of it", wrong: ["worried about it", "confused by it", "curious"] },
  { idiom: "get your act together", sentence: "We need to get our act together before Monday.", correct: "become organized and responsible", wrong: ["agree on a shared opinion", "accept a change in responsibilities", "stop communicating"] },
  { idiom: "make ends meet", sentence: "It’s hard to make ends meet right now.", correct: "have enough money to live", wrong: ["save enough money for the future", "repay all borrowed money", "finish a book"] },
  { idiom: "a rip-off", sentence: "That price is a rip-off.", correct: "too expensive / unfair price", wrong: ["a price that is difficult to afford", "a price that changes unexpectedly", "a refund"] },
  { idiom: "by the book", sentence: "She does everything by the book.", correct: "following rules strictly", wrong: ["following written advice selectively", "recording every decision in writing", "as a joke"] },
  { idiom: "off the top of my head", sentence: "Off the top of my head, I can name three reasons.", correct: "from memory, without thinking long", wrong: ["from an earlier written list", "after considering several alternatives", "with help"] },

  { idiom: "take it personally", sentence: "Don’t take it personally—it wasn’t about you.", correct: "feel offended as if it targets you", wrong: ["accept responsibility for causing it", "interpret it as practical advice", "feel confused"] },
  { idiom: "run out of time", sentence: "We ran out of time before the last question.", correct: "have no time left", wrong: ["use more time than expected", "finish earlier than expected", "waste time"] },
  { idiom: "in the long run", sentence: "In the long run, this will save money.", correct: "over a long period of time", wrong: ["after repeated attempts", "at the final stage of a process", "for one day only"] },
  { idiom: "so far, so good", sentence: "So far, so good—no problems yet.", correct: "until now, things are okay", wrong: ["the final result is satisfactory", "the plan is better than expected", "nothing matters"] },
  { idiom: "a quick fix", sentence: "This is only a quick fix, not a real solution.", correct: "a temporary solution", wrong: ["an inexpensive solution", "a simple permanent solution", "a secret trick"] },
  { idiom: "get the wrong end of the stick", sentence: "You got the wrong end of the stick—I meant something else.", correct: "misunderstand", wrong: ["remember incorrectly", "reach a decision too quickly", "change your mind"] },
  { idiom: "go the extra mile", sentence: "She always goes the extra mile for customers.", correct: "make extra effort", wrong: ["work faster than expected", "take responsibility for another person's mistake", "complain loudly"] },
  { idiom: "in the same boat", sentence: "We’re in the same boat—we all need help.", correct: "in the same situation", wrong: ["working towards the same goal", "sharing the same opinion", "in charge"] },
  { idiom: "keep someone posted", sentence: "Keep me posted about any changes.", correct: "keep me informed", wrong: ["remind me before a deadline", "ask me to approve each change", "pay me"] },
  { idiom: "make a long story short", sentence: "To make a long story short, we missed the train.", correct: "summarize briefly", wrong: ["explain the most surprising detail", "leave out the ending", "change the subject"] },

  { idiom: "take a rain check", sentence: "Can I take a rain check on dinner?", correct: "postpone to another time", wrong: ["decline without suggesting another time", "accept if the weather improves", "arrive early"] },
  { idiom: "jump the gun", sentence: "Don’t jump the gun—wait for the signal.", correct: "act too early", wrong: ["react too strongly", "prepare more than necessary", "act secretly"] },
  { idiom: "cut to the chase", sentence: "Can we cut to the chase?", correct: "get to the main point", wrong: ["explain the reasons in more detail", "ask someone else for their view", "tell a joke"] },
  { idiom: "throw in the towel", sentence: "After three tries, he threw in the towel.", correct: "give up", wrong: ["take a temporary break", "accept a less ambitious target", "start exercising"] },
  { idiom: "keep your fingers crossed", sentence: "Keep your fingers crossed for tomorrow.", correct: "hope for good luck", wrong: ["prepare for several possible outcomes", "promise to give practical help", "work harder"] },
  { idiom: "on a roll", sentence: "She’s on a roll—three wins in a row.", correct: "having repeated success", wrong: ["working without a break", "gaining experience from repeated attempts", "being late"] },
  { idiom: "give someone the benefit of the doubt", sentence: "Let’s give him the benefit of the doubt.", correct: "assume he may be innocent/right", wrong: ["agree that his account is proven", "postpone listening to his explanation", "punish him"] },
  { idiom: "speak of the devil", sentence: "Speak of the devil—here she is!", correct: "the person appears as you talk about them", wrong: ["the person reminds you of someone else", "the person has heard your earlier conversation", "change your opinion"] },
  { idiom: "go without saying", sentence: "It goes without saying that safety comes first.", correct: "is obvious", wrong: ["should remain private", "has already been discussed", "is funny"] },
  { idiom: "pull yourself together", sentence: "Pull yourself together—we need to focus.", correct: "calm down and regain control", wrong: ["make a decision without help", "hide your real opinion", "take a nap"] },

  { idiom: "take a step back", sentence: "Let’s take a step back and look at the bigger picture.", correct: "pause and reconsider", wrong: ["return to an earlier decision", "let someone else take responsibility", "celebrate"] },
  { idiom: "in the nick of time", sentence: "He arrived in the nick of time.", correct: "just in time", wrong: ["earlier than expected", "later than arranged", "by accident"] },
  { idiom: "turn a blind eye", sentence: "The manager turned a blind eye to the mistake.", correct: "ignore it on purpose", wrong: ["fail to notice it", "privately disagree with it", "laugh at it"] },
  { idiom: "read between the lines", sentence: "Read between the lines—he’s not happy.", correct: "understand the hidden meaning", wrong: ["check whether the facts are accurate", "identify the main argument", "skip the text"] },
  { idiom: "a hot topic", sentence: "AI is a hot topic right now.", correct: "a widely discussed subject", wrong: ["a subject causing personal embarrassment", "a subject discussed only by experts", "a small detail"] },
  { idiom: "up in the air", sentence: "Our travel plans are still up in the air.", correct: "not decided yet", wrong: ["likely to be cancelled", "kept private for now", "very exciting"] },
  { idiom: "at the end of the day", sentence: "At the end of the day, health matters most.", correct: "when everything is considered", wrong: ["after a long delay", "when the work has finished", "during lunch"] },
  { idiom: "take it or leave it", sentence: "That’s my final offer—take it or leave it.", correct: "accept it or reject it", wrong: ["negotiate before deciding", "accept only part of it", "hide it"] },
  { idiom: "keep your word", sentence: "He always keeps his word.", correct: "does what he promised", wrong: ["remembers what he said", "defends his earlier opinion", "forgets easily"] },
  { idiom: "make a point", sentence: "She made a point about fairness.", correct: "emphasize an important idea", wrong: ["give a brief personal example", "reach a final decision", "avoid the topic"] },

  { idiom: "the tip of the iceberg", sentence: "What we found is just the tip of the iceberg.", correct: "only a small part of a bigger problem", wrong: ["the main cause of a bigger problem", "the final stage of a developing problem", "a simple mistake"] },
  { idiom: "bend the rules", sentence: "They bent the rules to help him.", correct: "not follow rules strictly", wrong: ["change the rules officially", "follow only the newest rules", "refuse help"] },
  { idiom: "play it by ear", sentence: "We don’t have a plan—let’s play it by ear.", correct: "decide as we go", wrong: ["follow someone else's instructions", "choose a plan at random", "ask for permission"] },
  { idiom: "throw someone under the bus", sentence: "He threw his teammate under the bus.", correct: "blame someone to save yourself", wrong: ["leave someone out of a project", "criticise someone to help them improve", "ignore someone"] },
  { idiom: "break even", sentence: "We broke even on the event.", correct: "no profit and no loss", wrong: ["earn back half the cost", "earn the same profit as last time", "forgot to pay"] },
  { idiom: "get wind of", sentence: "She got wind of the new policy.", correct: "hear about (often unofficially)", wrong: ["find evidence against", "receive formal confirmation of", "write about"] },
  { idiom: "in over your head", sentence: "I’m in over my head with this project.", correct: "it’s too difficult for me", wrong: ["I have too many separate tasks", "I lack enough time rather than skill", "it’s illegal"] },
  { idiom: "keep a low profile", sentence: "After the mistake, he kept a low profile.", correct: "avoid attention", wrong: ["avoid taking responsibility", "keep personal information secret", "work faster"] },
  { idiom: "make a fuss", sentence: "Don’t make a fuss—it's a small issue.", correct: "complain too much", wrong: ["ask for clarification repeatedly", "make a problem public for the first time", "pay extra"] },
  { idiom: "take a hit", sentence: "Sales took a hit this month.", correct: "decreased / were damaged", wrong: ["became more unpredictable", "grew more slowly than expected", "disappeared completely"] },

  { idiom: "put all your eggs in one basket", sentence: "Don’t put all your eggs in one basket with investments.", correct: "depend on only one option", wrong: ["choose the least expensive option", "invest before investigating the risks", "change your mind"] },
  { idiom: "throw money down the drain", sentence: "Buying that was throwing money down the drain.", correct: "wasting money", wrong: ["spending more than planned", "borrowing more than needed", "borrowing money"] },
  { idiom: "get your hands dirty", sentence: "He’s not afraid to get his hands dirty.", correct: "do hard or practical work", wrong: ["take responsibility for other people's errors", "work without asking for payment", "get sick easily"] },
  { idiom: "keep your head above water", sentence: "I’m just trying to keep my head above water.", correct: "survive/manage with difficulty", wrong: ["avoid accepting new responsibilities", "make progress more slowly than planned", "celebrate"] },
  { idiom: "ahead of the curve", sentence: "Their tech is ahead of the curve.", correct: "more advanced than others", wrong: ["more popular than others", "more expensive than others", "unpopular"] },
  { idiom: "add fuel to the fire", sentence: "His comment added fuel to the fire.", correct: "made the situation worse", wrong: ["made the disagreement more widely known", "made the original complaint easier to understand", "changed the topic"] },
  { idiom: "have a lot on your plate", sentence: "I can’t help—I have a lot on my plate.", correct: "have many responsibilities", wrong: ["have several possible opportunities", "have many unfinished ideas", "be very rich"] },
  { idiom: "get the ball rolling", sentence: "Let’s get the ball rolling.", correct: "start the process", wrong: ["explain the final goal", "agree on who will lead", "argue"] },
  { idiom: "go down in flames", sentence: "The deal went down in flames.", correct: "failed badly", wrong: ["ended after a long delay", "succeeded at a high cost", "was kept secret"] },
  { idiom: "hit a snag", sentence: "We hit a snag with the payment system.", correct: "face an unexpected problem", wrong: ["discover a weakness that was already expected", "receive a complaint after finishing", "change jobs"] },

  { idiom: "have second thoughts", sentence: "I’m having second thoughts about buying it.", correct: "doubting the decision", wrong: ["considering a second purchase", "remembering an earlier decision", "feeling proud"] },
  { idiom: "out of your comfort zone", sentence: "Public speaking is out of my comfort zone.", correct: "unfamiliar and challenging", wrong: ["unsuitable for my interests", "different from what I had planned", "very expensive"] },
  { idiom: "keep something in mind", sentence: "Keep in mind that the deadline is Friday.", correct: "remember/consider", wrong: ["explain to someone else", "investigate in detail", "celebrate"] },
  { idiom: "on short notice", sentence: "Sorry for the meeting on short notice.", correct: "with little warning time", wrong: ["earlier than the usual time", "for a shorter time than planned", "in private"] },
  { idiom: "rule of thumb", sentence: "As a rule of thumb, save 10% of your income.", correct: "a general practical guideline", wrong: ["a strict formal requirement", "a carefully calculated prediction", "a personal secret"] },
  { idiom: "get something straight", sentence: "Let’s get one thing straight.", correct: "clarify", wrong: ["agree", "correct a completed piece of work", "forget it"] },
  { idiom: "cut someone some slack", sentence: "Cut her some slack—she’s new.", correct: "be less critical", wrong: ["give her fewer responsibilities", "ignore what she says", "fire her"] },
  { idiom: "go back and forth", sentence: "We went back and forth for an hour.", correct: "argue/discuss repeatedly", wrong: ["change our opinion once", "repeat another person's explanation", "work alone"] },
  { idiom: "get your priorities straight", sentence: "You need to get your priorities straight.", correct: "focus on what matters most", wrong: ["finish the easiest tasks first", "keep to the original timetable", "travel less"] },
  { idiom: "a wake-up call", sentence: "That accident was a wake-up call.", correct: "a warning that forces you to take action", wrong: ["a reminder of an existing success", "a chance to avoid responsibility", "a lucky sign"] },

  { idiom: "the big picture", sentence: "Don’t focus on details—look at the big picture.", correct: "the overall situation", wrong: ["the most serious problem", "the most likely future result", "a secret plan"] },
  { idiom: "on the right track", sentence: "You’re on the right track with this essay.", correct: "moving toward success", wrong: ["following the original instructions exactly", "finishing sooner than expected", "being rude"] },
  { idiom: "throw a fit", sentence: "He threw a fit when he lost.", correct: "have an angry outburst", wrong: ["make a strong complaint calmly", "refuse to discuss the outcome", "fall asleep"] },
  { idiom: "cross that bridge when we come to it", sentence: "Let’s cross that bridge when we come to it.", correct: "deal with it later if it happens", wrong: ["prepare for it immediately", "ask someone else to deal with it", "avoid responsibility"] },
  { idiom: "bite off more than you can chew", sentence: "I bit off more than I can chew this semester.", correct: "take on too much", wrong: ["choose work that does not interest you", "spend too much time on one task", "be very lucky"] },
  { idiom: "go out of your way", sentence: "Thanks for going out of your way to help.", correct: "make extra effort", wrong: ["change an earlier decision", "take over someone else's responsibility", "delay on purpose"] },
  { idiom: "get your wires crossed", sentence: "We got our wires crossed about the time.", correct: "miscommunicate", wrong: ["disagree about priorities", "forget an agreed arrangement", "forget a name"] },
  { idiom: "keep the peace", sentence: "She tried to keep the peace in the group.", correct: "prevent conflict", wrong: ["avoid taking part in the group", "persuade everyone to share one opinion", "avoid work"] },
  { idiom: "take someone’s word for it", sentence: "I’ll take your word for it.", correct: "believe you without proof", wrong: ["agree with you after checking", "repeat what you said to others", "test you"] },
  { idiom: "make a comeback", sentence: "After the injury, she made a comeback.", correct: "return to success", wrong: ["recover physically without competing again", "return to the same place", "lose interest"] },

  { idiom: "a drop in the ocean", sentence: "The donation helped, but it was a drop in the ocean.", correct: "a very small amount compared to what is needed", wrong: ["a useful amount that solves one part of the problem", "a large amount that is spent too quickly", "a sudden change"] },
{ idiom: "add insult to injury", sentence: "Losing the match and getting injured added insult to injury.", correct: "make a bad situation worse", wrong: ["reveal why a bad situation happened", "blame someone for an earlier problem", "apologise sincerely"] },
{ idiom: "at a crossroads", sentence: "After graduation, she felt at a crossroads.", correct: "facing an important decision", wrong: ["considering a change of location", "waiting for someone else's decision", "working too hard"] },
{ idiom: "back to square one", sentence: "The plan failed, so we’re back to square one.", correct: "starting again from the beginning", wrong: ["returning to the last successful stage", "changing one detail of the original plan", "nearly successful"] },
{ idiom: "bite your tongue", sentence: "I wanted to respond, but I bit my tongue.", correct: "stop yourself from speaking", wrong: ["choose more polite words", "take back something already said", "make a joke"] },
{ idiom: "by the skin of your teeth", sentence: "He passed the exam by the skin of his teeth.", correct: "just barely", wrong: ["with unexpected help", "after several attempts", "by cheating"] },
{ idiom: "cross your fingers", sentence: "Cross your fingers that everything works.", correct: "hope for good luck", wrong: ["make a shared promise", "wait before taking action", "stop trying"] },
{ idiom: "cut to the bone", sentence: "The criticism cut to the bone.", correct: "hurt deeply", wrong: ["felt unfair rather than accurate", "caused public embarrassment without private distress", "was ignored"] },
{ idiom: "down to earth", sentence: "Despite her success, she’s very down to earth.", correct: "practical and realistic", wrong: ["quiet and unwilling to discuss success", "informal and uninterested in practical details", "unmotivated"] },
{ idiom: "face the music", sentence: "He finally had to face the music.", correct: "accept the consequences", wrong: ["explain the reasons beforehand", "deny responsibility publicly", "change the topic"] },

{ idiom: "get a grip", sentence: "Get a grip and focus on the task.", correct: "control yourself", wrong: ["decide quickly", "accept someone else's judgement", "give up"] },
{ idiom: "get the short end of the stick", sentence: "I always get the short end of the stick.", correct: "receive unfair treatment", wrong: ["receive less than you expected, even if fairly", "be given the most difficult task by choice", "be praised"] },
{ idiom: "go around in circles", sentence: "We’re going around in circles.", correct: "make no progress", wrong: ["reconsider a decision once", "discuss several unrelated subjects", "solve the issue"] },
{ idiom: "have a bone to pick", sentence: "I have a bone to pick with you.", correct: "have something to complain about", wrong: ["have a difficult favour to ask", "have a secret to share", "feel relaxed"] },
{ idiom: "in the same breath", sentence: "He criticised the plan and praised it in the same breath.", correct: "at the same time", wrong: ["in the same conversation on different days", "using the same exact words", "in private"] },
{ idiom: "jump on the bandwagon", sentence: "Everyone jumped on the bandwagon.", correct: "join something popular", wrong: ["join an organised trip", "follow a plan made privately", "stop suddenly"] },
{ idiom: "keep your cool", sentence: "She kept her cool during the argument.", correct: "stay calm", wrong: ["hid her opinion", "avoided the discussion", "lose focus"] },
{ idiom: "leave no stone unturned", sentence: "We left no stone unturned.", correct: "searched everywhere", wrong: ["checked the most likely places first", "continued searching in the same place", "worked quickly"] },
{ idiom: "make a mountain out of a molehill", sentence: "You’re making a mountain out of a molehill.", correct: "exaggerate a small problem", wrong: ["describe a large problem too briefly", "focus on the wrong part of a problem", "explain clearly"] },
{ idiom: "miss the boat", sentence: "If you wait too long, you’ll miss the boat.", correct: "lose an opportunity", wrong: ["arrive later than arranged", "choose the less useful opportunity", "change plans"] },

{ idiom: "no strings attached", sentence: "The help came with no strings attached.", correct: "with no conditions", wrong: ["with no payment required", "with no deadline given", "with delays"] },
{ idiom: "off the beaten path", sentence: "They chose a restaurant off the beaten path.", correct: "unusual or not popular", wrong: ["recently opened", "difficult to afford", "dangerous"] },
{ idiom: "on cloud nine", sentence: "She’s been on cloud nine all day.", correct: "extremely happy", wrong: ["extremely relieved", "extremely confident", "very angry"] },
{ idiom: "on shaky ground", sentence: "His argument is on shaky ground.", correct: "not reliable", wrong: ["too complex to follow", "not relevant", "clearly proven"] },
{ idiom: "out of your depth", sentence: "I’m out of my depth in this course.", correct: "in a situation too difficult for you", wrong: ["in a situation you did not choose", "in a situation without enough time", "very experienced"] },
{ idiom: "paint yourself into a corner", sentence: "He painted himself into a corner.", correct: "create a situation with no good options", wrong: ["make a decision that other people dislike", "choose a goal that takes too long", "get support"] },
{ idiom: "read the room", sentence: "You need to read the room.", correct: "understand people’s reactions", wrong: ["understand the practical instructions", "identify who has formal authority", "ignore others"] },
{ idiom: "ride it out", sentence: "We’ll ride it out and see what happens.", correct: "wait until a problem passes", wrong: ["solve the problem immediately", "move the problem to another team", "panic"] },
{ idiom: "rule the day", sentence: "Practical concerns ruled the day.", correct: "be the most important factor", wrong: ["be the first factor discussed", "be the factor most easily changed", "be temporary"] },
{ idiom: "see the writing on the wall", sentence: "He saw the writing on the wall and resigned.", correct: "realise something bad is coming", wrong: ["realise others disagree", "discover the reason for a past failure", "get promoted"] },

{ idiom: "sit on the fence", sentence: "He’s sitting on the fence.", correct: "avoid making a decision", wrong: ["refuse to discuss a decision", "support both sides publicly", "take action"] },
{ idiom: "sweep it under the rug", sentence: "They tried to sweep the issue under the rug.", correct: "hide a problem", wrong: ["deal with a problem privately", "postpone a problem openly", "celebrate"] },
{ idiom: "take the bait", sentence: "Don’t take the bait.", correct: "react to provocation", wrong: ["accept help reluctantly", "believe an unlikely promise", "change your mind"] },
{ idiom: "the ballpark figure", sentence: "Can you give me a ballpark figure?", correct: "a rough estimate", wrong: ["a final agreed price", "a maximum permitted cost", "legal limit"] },
{ idiom: "throw caution to the wind", sentence: "She threw caution to the wind.", correct: "act without worrying about risks", wrong: ["act after considering every risk", "act while warning others of risks", "wait patiently"] },
{ idiom: "toe the line", sentence: "Employees must toe the line.", correct: "follow rules", wrong: ["defend existing rules publicly", "explain rules to other people", "lead a group"] },
{ idiom: "under your belt", sentence: "He has several projects under his belt.", correct: "completed successfully", wrong: ["planned for the future", "funded by someone else", "ignored"] },
{ idiom: "walk on eggshells", sentence: "Everyone is walking on eggshells around her.", correct: "act very carefully", wrong: ["act without expressing an opinion", "act according to formal instructions", "take risks"] },
{ idiom: "wash your hands of", sentence: "He washed his hands of the matter.", correct: "refuse further responsibility", wrong: ["admit earlier responsibility", "explain someone else's responsibility", "apologise"] },
{ idiom: "wear many hats", sentence: "She wears many hats at work.", correct: "have many roles", wrong: ["work in several locations", "change jobs frequently", "work slowly"] },

{ idiom: "when push comes to shove", sentence: "When push comes to shove, we’ll adapt.", correct: "when action is finally required", wrong: ["when a disagreement first appears", "when planning has just begun", "in secret"] },
{ idiom: "with flying colours", sentence: "She passed with flying colours.", correct: "very successfully", wrong: ["with unexpected help", "after several unsuccessful attempts", "after failing"] },
{ idiom: "your hands are tied", sentence: "My hands are tied.", correct: "unable to act due to limits", wrong: ["unwilling to take the first step", "uncertain which action to choose", "very confused"] }

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
              <div>${highlightTerm(q.sentence, q.idiom)}</div>
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
