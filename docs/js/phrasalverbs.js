// phrasalverbs.js
// Phrasal verb exercise – 10 questions, 4 options each, mixed A1–C1
// Same behavior as idioms.js:
// - Attempts: counts how many questions were answered on each Check
// - Correct: counts ONLY newly-correct answers per question within the current quiz
// - Re-checking already-correct answers adds attempts but does not add correct

"use strict";

const EX_ID = "phrasalverbs";
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

// Highlights first occurrence of phrase in sentence
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

// 200 common phrasal verbs (collocations / phrasal verbs / academic phrases)
const PHRASES = [
  { phrase: "carry out", sentence: "The researchers carried out a study on sleep habits.", correct: "perform (a task or study)", wrong: ["cancel", "explain", "hide"] },
  { phrase: "break down", sentence: "The report breaks down the data into categories.", correct: "divide into smaller parts", wrong: ["increase quickly", "remove completely", "forget"] },
  { phrase: "draw on", sentence: "The writer draws on previous research.", correct: "use as a source", wrong: ["argue against", "copy by hand", "laugh at"] },
  { phrase: "set out to", sentence: "This essay sets out to explain the causes of climate change.", correct: "aim to do", wrong: ["refuse to do", "forget to do", "be forced to do"] },
  { phrase: "give it a shot", sentence: "I’ve never done karaoke, but I’ll give it a shot.", correct: "try it", wrong: ["avoid it", "sell it", "criticise it"] },
  { phrase: "take into account", sentence: "Age and experience must be taken into account.", correct: "consider", wrong: ["ignore", "repeat", "translate"] },
  { phrase: "play a key role", sentence: "Education plays a key role in social development.", correct: "be very important", wrong: ["be unnecessary", "be illegal", "be confusing"] },
  { phrase: "point out", sentence: "The teacher pointed out several mistakes.", correct: "mention and draw attention to", wrong: ["hide", "create", "celebrate"] },
  { phrase: "figure out", sentence: "I can’t figure out how this works.", correct: "understand/solve", wrong: ["forget", "invent", "destroy"] },
  { phrase: "find out", sentence: "I found out the results this morning.", correct: "discover/learn", wrong: ["guess", "deny", "lose"] },

  { phrase: "look after", sentence: "Can you look after my dog this weekend?", correct: "take care of", wrong: ["search for", "argue with", "copy"] },
  { phrase: "look for", sentence: "I’m looking for my keys.", correct: "try to find", wrong: ["throw away", "repair", "describe"] },
  { phrase: "look forward to", sentence: "I’m looking forward to the holidays.", correct: "feel excited about (future)", wrong: ["be afraid of", "regret", "forget"] },
  { phrase: "get along", sentence: "Do you get along with your classmates?", correct: "have a good relationship", wrong: ["travel together", "compete", "avoid"] },
  { phrase: "run into", sentence: "I ran into my old teacher yesterday.", correct: "meet unexpectedly", wrong: ["call on the phone", "ignore", "invite"] },
  { phrase: "put off", sentence: "Let’s put off the meeting until Friday.", correct: "delay/postpone", wrong: ["start", "cancel forever", "summarise"] },
  { phrase: "turn down", sentence: "She turned down the job offer.", correct: "refuse", wrong: ["accept", "forget", "write"] },
  { phrase: "turn up", sentence: "He turned up late to class.", correct: "appear/arrive", wrong: ["refuse", "sleep", "win"] },
  { phrase: "pick up", sentence: "Can you pick up some milk on the way home?", correct: "collect/buy and bring", wrong: ["throw away", "pay back", "explain"] },
  { phrase: "drop off", sentence: "I’ll drop you off at the station.", correct: "take someone somewhere and leave them there", wrong: ["invite someone in", "meet someone", "argue with someone"] },

  { phrase: "give up", sentence: "He gave up after two attempts.", correct: "stop trying", wrong: ["start again", "win", "help"] },
  { phrase: "keep up with", sentence: "It’s hard to keep up with the homework.", correct: "not fall behind", wrong: ["cancel", "copy", "laugh at"] },
  { phrase: "catch up", sentence: "I need to catch up on sleep.", correct: "recover", wrong: ["fall behind", "give away", "slow down"] },
  { phrase: "calm down", sentence: "Please calm down and listen.", correct: "compose oneself", wrong: ["become angry", "leave", "celebrate"] },
  { phrase: "get rid of", sentence: "We need to get rid of these old files.", correct: "remove/throw away", wrong: ["collect", "translate", "protect"] },
  { phrase: "set up", sentence: "They set up a new system for bookings.", correct: "create/arrange", wrong: ["destroy", "avoid", "delay"] },
  { phrase: "take part in", sentence: "Many students took part in the project.", correct: "participate in", wrong: ["refuse", "forget", "complain about"] },
  { phrase: "come up with", sentence: "She came up with a great idea.", correct: "think of (an idea)", wrong: ["delete", "repeat", "steal"] },
  { phrase: "deal with", sentence: "We need to deal with this problem now.", correct: "handle", wrong: ["ignore", "celebrate", "hide"] },
  { phrase: "focus on", sentence: "Focus on the main idea.", correct: "concentrate on", wrong: ["avoid", "copy", "forget"] },

  { phrase: "make sure", sentence: "Make sure you lock the door.", correct: "check/ensure", wrong: ["hope", "forget", "deny"] },
  { phrase: "depend on", sentence: "It depends on the weather.", correct: "be decided by", wrong: ["be impossible", "be guaranteed", "be funny"] },
  { phrase: "result in", sentence: "This can result in serious problems.", correct: "lead to", wrong: ["prevent", "replace", "describe"] },
  { phrase: "lead to", sentence: "Smoking can lead to health issues.", correct: "cause", wrong: ["solve", "ignore", "decorate"] },
  { phrase: "agree on", sentence: "They agreed on a new plan.", correct: "reach the same decision", wrong: ["argue", "forget", "hide"] },
  { phrase: "argue that", sentence: "Some researchers argue that sleep affects learning.", correct: "claim (with reasons)", wrong: ["guess randomly", "deny completely", "translate"] },
  { phrase: "point to", sentence: "The evidence points to a clear trend.", correct: "indicate/suggest", wrong: ["hide", "cancel", "laugh"] },
  { phrase: "refer to", sentence: "The report refers to several earlier studies.", correct: "mention", wrong: ["ignore", "destroy", "celebrate"] },
  { phrase: "consist of", sentence: "The course consists of five modules.", correct: "be made up of", wrong: ["remove", "delay", "explain"] },
  { phrase: "be based on", sentence: "The film is based on a true story.", correct: "use as the foundation", wrong: ["be against", "be unrelated to", "be shorter than"] },

  { phrase: "take place", sentence: "The event will take place on Saturday.", correct: "happen", wrong: ["be cancelled", "be written", "be paid"] },
  { phrase: "hand in", sentence: "Please hand in your assignment by 3 pm.", correct: "submit", wrong: ["copy", "lose", "explain"] },
  { phrase: "fill out", sentence: "Fill out this form, please.", correct: "complete (a form)", wrong: ["throw away", "translate", "cancel"] },
  { phrase: "sign up for", sentence: "I signed up for a coding course.", correct: "register for", wrong: ["refuse", "teach", "postpone"] },
  { phrase: "show up", sentence: "Only five people showed up.", correct: "arrive/appear", wrong: ["refuse", "sleep", "cancel"] },
  { phrase: "work out", sentence: "We need to work out a solution.", correct: "develop/figure out", wrong: ["avoid", "forget", "break"] },
  { phrase: "sort out", sentence: "Let’s sort out the schedule.", correct: "organise/resolve", wrong: ["damage", "ignore", "celebrate"] },
  { phrase: "bring up", sentence: "She brought up an important point.", correct: "mention", wrong: ["hide", "forget", "cancel"] },
  { phrase: "set aside", sentence: "Set aside some time for revision.", correct: "reserve", wrong: ["waste", "cancel", "borrow"] },
  { phrase: "follow up", sentence: "I’ll follow up with an email tomorrow.", correct: "contact again to continue", wrong: ["stop permanently", "argue", "celebrate"] },

  { phrase: "go on", sentence: "Please go on with your presentation.", correct: "continue", wrong: ["stop", "forget", "argue"] },
  { phrase: "carry on", sentence: "Even when it rains, we carry on.", correct: "continue", wrong: ["cancel", "hide", "repeat"] },
  { phrase: "set off", sentence: "We set off early in the morning.", correct: "start a journey", wrong: ["end a journey", "postpone", "forget"] },
  { phrase: "put on", sentence: "He put on his jacket.", correct: "dress/wear", wrong: ["remove", "buy", "lose"] },
  { phrase: "take off", sentence: "Please take off your shoes.", correct: "remove", wrong: ["repair", "buy", "wash"] },
  { phrase: "get on", sentence: "She got on the bus.", correct: "enter (a vehicle)", wrong: ["leave", "sleep", "pay"] },
  { phrase: "get off", sentence: "We got off at the next stop.", correct: "leave (a vehicle)", wrong: ["enter", "buy", "forget"] },
  { phrase: "check in", sentence: "We checked in at the hotel.", correct: "register on arrival", wrong: ["leave", "complain", "pay back"] },
  { phrase: "check out", sentence: "We checked out at 11 am.", correct: "leave and pay at the end", wrong: ["arrive", "sleep", "refuse"] },
  { phrase: "look up", sentence: "Look up the word in a dictionary.", correct: "search for information", wrong: ["erase", "guess", "hide"] },

  { phrase: "bring about", sentence: "The new policy brought about major changes.", correct: "cause", wrong: ["prevent", "copy", "forget"] },
  { phrase: "rule out", sentence: "We can’t rule out delays.", correct: "say something is impossible (exclude)", wrong: ["confirm", "invite", "repeat"] },
  { phrase: "carry on with", sentence: "Let’s carry on with question two.", correct: "continue", wrong: ["cancel", "argue", "hide"] },
  { phrase: "pay attention", sentence: "Pay attention to the instructions.", correct: "listen/watch carefully", wrong: ["ignore", "leave", "celebrate"] },
  { phrase: "take notes", sentence: "Take notes during the lecture.", correct: "write key points", wrong: ["sleep", "argue", "forget"] },
  { phrase: "make progress", sentence: "She is making progress in English.", correct: "improve", wrong: ["fail", "stop", "complain"] },
  { phrase: "make a decision", sentence: "We need to make a decision today.", correct: "decide", wrong: ["postpone", "argue", "forget"] },
  { phrase: "reach an agreement", sentence: "They reached an agreement quickly.", correct: "agree", wrong: ["fight", "forget", "delay"] },
  { phrase: "raise awareness", sentence: "The campaign aims to raise awareness of mental health.", correct: "increase public understanding", wrong: ["reduce costs", "hide facts", "change the law"] },
  { phrase: "take responsibility", sentence: "He took responsibility for the mistake.", correct: "accept blame and duty", wrong: ["deny it", "ignore it", "celebrate it"] },

  { phrase: "make an effort", sentence: "Make an effort to speak English in class.", correct: "try hard", wrong: ["give up", "complain", "rest"] },
  { phrase: "come across", sentence: "I came across an interesting article.", correct: "find by chance", wrong: ["forget", "argue", "destroy"] },
  { phrase: "set a goal", sentence: "Set a goal for this week.", correct: "decide on a target", wrong: ["avoid planning", "cancel", "copy"] },
  { phrase: "meet a deadline", sentence: "We must meet the deadline.", correct: "finish on time", wrong: ["finish late", "cancel", "forget"] },
  { phrase: "miss a deadline", sentence: "He missed the deadline by two days.", correct: "fail to finish on time", wrong: ["finish early", "avoid work", "get promoted"] },
  { phrase: "take a break", sentence: "Let’s take a break for ten minutes.", correct: "rest briefly", wrong: ["work faster", "leave forever", "argue"] },
  { phrase: "make a mistake", sentence: "Everyone makes mistakes sometimes.", correct: "do something wrong", wrong: ["do something perfect", "win", "teach"] },
  { phrase: "learn from", sentence: "Try to learn from your mistakes.", correct: "use experience to improve", wrong: ["repeat the same", "ignore", "hide"] },
  { phrase: "improve on", sentence: "You can improve on your first draft.", correct: "make it better", wrong: ["make it worse", "lose it", "copy it"] },
  { phrase: "come to a conclusion", sentence: "The study came to a clear conclusion.", correct: "reach a final idea", wrong: ["start an argument", "forget", "delay"] },

  { phrase: "take action", sentence: "We must take action to reduce waste.", correct: "do something (not just talk)", wrong: ["wait", "deny", "celebrate"] },
  { phrase: "make a difference", sentence: "Small changes can make a difference.", correct: "have an effect", wrong: ["have no effect", "be illegal", "be funny"] },
  { phrase: "have an impact on", sentence: "Social media can have an impact on sleep.", correct: "affect", wrong: ["ignore", "replace", "summarise"] },
  { phrase: "be involved in", sentence: "She is involved in several projects.", correct: "take part in", wrong: ["avoid", "cancel", "forget"] },
  { phrase: "take advantage of", sentence: "Take advantage of free practice materials.", correct: "use an opportunity", wrong: ["waste time", "refuse help", "hide"] },
  { phrase: "make use of", sentence: "Make use of the examples.", correct: "use", wrong: ["destroy", "avoid", "replace"] },
  { phrase: "keep track of", sentence: "Keep track of your homework.", correct: "monitor/record", wrong: ["ignore", "forget", "hide"] },
  { phrase: "stick to", sentence: "Try to stick to your plan.", correct: "follow consistently", wrong: ["change daily", "forget", "cancel"] },
  { phrase: "put together", sentence: "She put together a presentation in one day.", correct: "assemble/create", wrong: ["destroy", "copy", "delay"] },
  { phrase: "take over", sentence: "The new manager took over last month.", correct: "assume control", wrong: ["quit", "refuse", "explain"] },

  { phrase: "carry on", sentence: "Carry on; you’re doing well.", correct: "continue", wrong: ["stop", "forget", "argue"] },
  { phrase: "back up", sentence: "Back up your files regularly.", correct: "make a safety copy", wrong: ["delete", "share publicly", "ignore"] },
  { phrase: "log in", sentence: "Log in with your school account.", correct: "enter a system using credentials", wrong: ["log out", "delete account", "send email"] },
  { phrase: "log out", sentence: "Remember to log out on shared computers.", correct: "exit an account/session", wrong: ["sign up", "download", "reset"] },
  { phrase: "set out", sentence: "The report sets out the main findings.", correct: "present clearly", wrong: ["hide", "cancel", "guess"] },
  { phrase: "sum up", sentence: "To sum up, we need better planning.", correct: "summarise", wrong: ["add details", "deny", "argue"] },
  { phrase: "bring in", sentence: "They brought in an expert to help.", correct: "introduce someone for help", wrong: ["send away", "ignore", "criticise"] },
  { phrase: "phase out", sentence: "They will phase out the old system.", correct: "remove gradually", wrong: ["add quickly", "repair", "celebrate"] },
  { phrase: "set a limit", sentence: "Set a limit for screen time.", correct: "decide a maximum", wrong: ["remove rules", "forget", "copy"] },
  { phrase: "keep in touch", sentence: "We still keep in touch after graduation.", correct: "stay in contact", wrong: ["avoid contact", "argue", "compete"] },

  { phrase: "pay off", sentence: "All that practice paid off.", correct: "produce good results", wrong: ["fail badly", "be cancelled", "be stolen"] },
  { phrase: "come up", sentence: "Something urgent came up.", correct: "happen unexpectedly", wrong: ["be planned", "be cancelled", "be solved"] },
  { phrase: "hold on", sentence: "Hold on a second, please.", correct: "wait", wrong: ["run", "forget", "leave"] },
  { phrase: "make up for", sentence: "I’ll make up for being late.", correct: "compensate", wrong: ["repeat", "deny", "ignore"] },
  { phrase: "look into", sentence: "We will look into the complaint.", correct: "investigate", wrong: ["celebrate", "ignore", "publish"] },
  { phrase: "come to terms with", sentence: "He came to terms with the decision.", correct: "accept (a difficult situation)", wrong: ["deny", "forget", "celebrate"] },
  { phrase: "set a deadline", sentence: "They set a deadline for the project.", correct: "choose a final date", wrong: ["remove the plan", "guess", "hide"] },
  { phrase: "miss out on", sentence: "Don’t miss out on this opportunity.", correct: "fail to experience/get", wrong: ["get easily", "cancel", "repeat"] },
  { phrase: "get used to", sentence: "You’ll get used to the routine.", correct: "become accustomed to", wrong: ["forget", "refuse", "change"] },
  { phrase: "go through", sentence: "Let’s go through the instructions again.", correct: "review step by step", wrong: ["ignore", "destroy", "celebrate"] },

  // Keep adding until 100:
  { phrase: "take care of", sentence: "I’ll take care of the emails.", correct: "handle", wrong: ["cancel", "hide", "translate"] },
  { phrase: "come back to", sentence: "Let’s come back to this question later.", correct: "return to a topic", wrong: ["forget", "argue", "publish"] },
  { phrase: "work on", sentence: "She is working on her pronunciation.", correct: "try to improve", wrong: ["avoid", "refuse", "forget"] },
  { phrase: "give up on", sentence: "Don’t give up on this course.", correct: "stop believing/trying", wrong: ["continue strongly", "celebrate", "translate"] },
  { phrase: "keep up", sentence: "Keep up the good work.", correct: "continue at the same level", wrong: ["stop", "deny", "hide"] },
  { phrase: "fall behind", sentence: "He fell behind in math.", correct: "fail to keep up", wrong: ["be ahead", "be finished", "be promoted"] },
  { phrase: "catch on", sentence: "She caught on quickly.", correct: "understand/learn", wrong: ["forget", "refuse", "delay"] },
  { phrase: "hand out", sentence: "The teacher handed out worksheets.", correct: "distribute", wrong: ["collect", "delete", "hide"] },
  { phrase: "take turns", sentence: "Take turns answering the questions.", correct: "alternate", wrong: ["compete", "stop", "copy"] },
  { phrase: "make a complaint", sentence: "He made a complaint to customer service.", correct: "express dissatisfaction formally", wrong: ["offer praise", "make a joke", "give permission"] },

  { phrase: "raise a question", sentence: "This raises an important question.", correct: "cause a question to be asked", wrong: ["answer clearly", "cancel", "prove false"] },
  { phrase: "reach a decision", sentence: "They reached a decision after an hour.", correct: "decide", wrong: ["argue forever", "forget", "hide"] },
  { phrase: "take a look", sentence: "Take a look at my draft.", correct: "look briefly", wrong: ["throw away", "copy", "deny"] },
  { phrase: "make a change", sentence: "We need to make a change to the plan.", correct: "alter", wrong: ["repeat", "ignore", "cancel"] },
  { phrase: "come to an end", sentence: "The lesson came to an end.", correct: "finish", wrong: ["start", "pause", "expand"] },
  { phrase: "set a reminder", sentence: "Set a reminder for tomorrow.", correct: "create an alert", wrong: ["delete", "forget", "hide"] },
  { phrase: "take a risk", sentence: "Starting a business is taking a risk.", correct: "do something with possible negative results", wrong: ["avoid danger", "guarantee success", "copy"] },
  { phrase: "make a promise", sentence: "He made a promise to help.", correct: "promise", wrong: ["deny", "complain", "forget"] },
  { phrase: "keep a promise", sentence: "She kept her promise.", correct: "do what she promised", wrong: ["break it", "forget it", "hide it"] },
  { phrase: "break a promise", sentence: "He broke his promise again.", correct: "fail promise", wrong: ["keep promise", "rewrite promise", "celebrate promise"] },

  { phrase: "take a stand", sentence: "She took a stand against bullying.", correct: "oppose", wrong: ["stay silent", "change topic", "avoid people"] },
  { phrase: "make a claim", sentence: "The article makes a strong claim.", correct: "state something as true", wrong: ["ask a question", "tell a joke", "deny something"] },
  { phrase: "support a claim", sentence: "Use evidence to support your claim.", correct: "back up with", wrong: ["hide", "ignore", "cancel"] },
  { phrase: "raise an issue", sentence: "He raised an issue about safety.", correct: "bring up an issue", wrong: ["solve it fully", "ignore it", "laugh at it"] },
  { phrase: "address a problem", sentence: "We must address the problem immediately.", correct: "deal with it", wrong: ["hide it", "deny it", "celebrate it"] },
  { phrase: "meet requirements", sentence: "This does not meet the requirements.", correct: "satisfy conditions", wrong: ["break rules", "change nothing", "guess"] },
  { phrase: "set priorities", sentence: "We need to set priorities.", correct: "decide what is most important", wrong: ["avoid decisions", "copy", "deny"] },
  { phrase: "make a suggestion", sentence: "Can I make a suggestion?", correct: "propose an idea", wrong: ["refuse", "complain", "forget"] },
  { phrase: "take a suggestion", sentence: "I’ll take your suggestion.", correct: "accept", wrong: ["ignore", "deny", "delete"] },
  { phrase: "reach a goal", sentence: "He reached his goal this month.", correct: "achieve", wrong: ["fail completely", "postpone", "forget"] },

  { phrase: "put up with", sentence: "I can’t put up with the noise anymore.", correct: "tolerate", wrong: ["increase", "forget", "measure"] },
{ phrase: "run out of", sentence: "We ran out of milk this morning.", correct: "have none left", wrong: ["buy extra", "spill", "hide"] },
{ phrase: "get by", sentence: "On a student budget, you learn to get by.", correct: "manage with what you have", wrong: ["get promoted", "argue loudly", "travel abroad"] },
{ phrase: "get over", sentence: "It took her weeks to get over the flu.", correct: "recover from", wrong: ["catch", "explain", "postpone"] },
{ phrase: "get away with", sentence: "He thought he could get away with cheating.", correct: "avoid punishment", wrong: ["apologise immediately", "get permission", "improve skills"] },
{ phrase: "look out", sentence: "Look out! There’s a car coming.", correct: "be careful", wrong: ["be quiet", "be proud", "be early"] },
{ phrase: "look out for", sentence: "Look out for spelling mistakes.", correct: "watch for", wrong: ["remove", "translate", "guess"] },
{ phrase: "look down on", sentence: "It’s wrong to look down on people.", correct: "disrespect", wrong: ["admire", "help", "copy"] },
{ phrase: "look up to", sentence: "Many students look up to their coach.", correct: "admire", wrong: ["ignore", "argue with", "compete with"] },
{ phrase: "look back on", sentence: "She looks back on her school years with pride.", correct: "think about the past", wrong: ["predict the future", "deny a mistake", "complain about something"] },

{ phrase: "look around", sentence: "Let’s look around before we decide.", correct: "explore", wrong: ["leave", "forget", "hide"] },
{ phrase: "look over", sentence: "Can you look over my essay?", correct: "review", wrong: ["throw away", "copy", "shout"] },
{ phrase: "look through", sentence: "I looked through my notes for the answer.", correct: "search", wrong: ["burn", "summarise", "celebrate"] },
{ phrase: "come across as", sentence: "He comes across as confident in interviews.", correct: "seem", wrong: ["arrive late", "change clothes", "be injured"] },
{ phrase: "come down with", sentence: "I came down with a cold.", correct: "become ill with", wrong: ["recover from", "argue about", "pay for"] },
{ phrase: "come around", sentence: "She came around after a few minutes.", correct: "regain consciousness", wrong: ["fall asleep", "get angry", "leave early"] },
{ phrase: "come along", sentence: "Come along—we’re leaving now.", correct: "go with", wrong: ["stop", "forget", "hide from"] },
{ phrase: "come in handy", sentence: "These phrases will come in handy during the exam.", correct: "be useful", wrong: ["be harmful", "be expensive", "be illegal"] },
{ phrase: "come up against", sentence: "We came up against some serious problems.", correct: "encounter", wrong: ["avoid", "celebrate", "solve instantly"] },

{ phrase: "go over", sentence: "Let’s go over the instructions again.", correct: "review", wrong: ["ignore", "cancel", "invent"] },
{ phrase: "go off", sentence: "The alarm went off at 6 a.m.", correct: "start ringing", wrong: ["stop working", "get repaired", "get lost"] },
{ phrase: "go out", sentence: "The lights went out during the storm.", correct: "stop working", wrong: ["get brighter", "get painted", "get sold"] },
{ phrase: "go through with", sentence: "She decided to go through with the plan.", correct: "do it as planned", wrong: ["cancel it", "forget it", "delay forever"] },
{ phrase: "go back on", sentence: "He went back on his promise.", correct: "break a promise", wrong: ["keep a promise", "explain a promise", "write a promise"] },
{ phrase: "go ahead", sentence: "Go ahead and start without me.", correct: "proceed", wrong: ["stop", "argue", "hide"] },
{ phrase: "go for", sentence: "I’ll go for the cheaper option.", correct: "choose", wrong: ["destroy", "forget", "wait"] },
{ phrase: "go with", sentence: "Let’s go with your idea.", correct: "choose", wrong: ["reject", "erase", "delay"] },
{ phrase: "go without", sentence: "We can’t go without water.", correct: "survive", wrong: ["waste", "replace", "measure"] },
{ phrase: "go out of", sentence: "He went out of his way to help.", correct: "make extra effort", wrong: ["avoid effort", "hide effort", "forget effort"] },

{ phrase: "take on", sentence: "She took on more work than she should.", correct: "accept responsibility for", wrong: ["refuse", "finish early", "complain quietly"] },
{ phrase: "take in", sentence: "I couldn’t take in all the information.", correct: "understand/absorb", wrong: ["throw away", "write down", "forget"] },
{ phrase: "take back", sentence: "I take back what I said.", correct: "admit it was wrong and withdraw it", wrong: ["repeat it", "prove it", "shout it"] },
{ phrase: "take out", sentence: "Please take out the trash.", correct: "remove", wrong: ["repair", "decorate", "translate"] },
{ phrase: "take over from", sentence: "Sara will take over from Erik next week.", correct: "replace in a role", wrong: ["support briefly", "compete with", "ignore"] },
{ phrase: "take up", sentence: "He took up running last year.", correct: "start a new hobby/activity", wrong: ["stop", "refuse", "forget"] },
{ phrase: "take down", sentence: "Take down the notes from the board.", correct: "write/record", wrong: ["erase permanently", "ignore", "argue"] },
{ phrase: "take apart", sentence: "He took the machine apart to fix it.", correct: "separate into pieces", wrong: ["paint", "sell", "hide"] },
{ phrase: "take in stride", sentence: "She took the criticism in stride.", correct: "handle calmly", wrong: ["panic", "deny", "celebrate"] },
{ phrase: "take to", sentence: "The kids took to the new teacher quickly.", correct: "begin to like", wrong: ["begin to hate", "begin to fear", "begin to ignore"] },

{ phrase: "put away", sentence: "Put away your phone during class.", correct: "store/tidy", wrong: ["buy", "borrow", "translate"] },
{ phrase: "put back", sentence: "Please put the books back on the shelf.", correct: "return to the original place", wrong: ["throw away", "copy", "lose"] },
{ phrase: "put on hold", sentence: "The project is on hold for now.", correct: "paused temporarily", wrong: ["finished", "approved", "ignored forever"] },
{ phrase: "put through", sentence: "They put me through to the manager.", correct: "connect by phone", wrong: ["reject", "interrupt", "translate"] },
{ phrase: "put out", sentence: "Firefighters put out the fire quickly.", correct: "extinguish", wrong: ["start", "increase", "decorate"] },
{ phrase: "put up", sentence: "They put up a poster in the hallway.", correct: "attach/display", wrong: ["remove", "copy", "lose"] },
{ phrase: "put down", sentence: "Please don’t put others down.", correct: "insult/criticise", wrong: ["praise", "teach", "invite"] },
{ phrase: "put together", sentence: "He put together a short report.", correct: "create/assemble", wrong: ["destroy", "forget", "delay"] },
{ phrase: "put off until", sentence: "We put it off until next week.", correct: "postpone", wrong: ["finish early", "ignore forever", "copy"] },
{ phrase: "put up to", sentence: "Who put you up to this prank?", correct: "persuade someone to do something", wrong: ["forbid", "punish", "reward"] },

{ phrase: "turn out", sentence: "It turned out better than expected.", correct: "end up / happen in the end", wrong: ["start", "disappear", "be cancelled"] },
{ phrase: "turn into", sentence: "The discussion turned into an argument.", correct: "change into", wrong: ["end", "repeat", "improve"] },
{ phrase: "turn over", sentence: "Turn over the paper and start.", correct: "flip to the other side", wrong: ["tear", "hide", "translate"] },
{ phrase: "turn back", sentence: "We turned back because of the snow.", correct: "return the way you came", wrong: ["continue forward", "arrive", "celebrate"] },
{ phrase: "turn around", sentence: "The company turned around its results.", correct: "improve a bad situation", wrong: ["make worse", "cancel", "ignore"] },
{ phrase: "turn on", sentence: "Turn on the lights, please.", correct: "switch on", wrong: ["switch off", "break", "hide"] },
{ phrase: "turn off", sentence: "Turn off your microphone.", correct: "switch off", wrong: ["switch on", "repair", "sell"] },
{ phrase: "turn to", sentence: "She turned to her friend for advice.", correct: "ask for help", wrong: ["avoid", "punish", "compete"] },
{ phrase: "turn up at", sentence: "He turned up at the office unexpectedly.", correct: "arrive", wrong: ["leave", "forget", "borrow"] },
{ phrase: "turn down", sentence: "He turned down the invitation.", correct: "refuse", wrong: ["accept", "publish", "repair"] },

{ phrase: "break out", sentence: "A fire broke out in the kitchen.", correct: "start suddenly (bad event)", wrong: ["end suddenly", "be planned", "be repaired"] },
{ phrase: "break into", sentence: "Someone broke into the house.", correct: "enter by force illegally", wrong: ["enter politely", "leave quietly", "decorate"] },
{ phrase: "break up", sentence: "They broke up after two years.", correct: "end a relationship", wrong: ["get engaged", "become friends", "move in"] },
{ phrase: "break down", sentence: "My car broke down on the highway.", correct: "stop working", wrong: ["speed up", "get painted", "get sold"] },
{ phrase: "break in", sentence: "It took time to break in the new shoes.", correct: "make comfortable by using", wrong: ["throw away", "clean", "repair"] },
{ phrase: "break off", sentence: "They broke off the negotiations.", correct: "end suddenly", wrong: ["start", "continue", "agree"] },
{ phrase: "break away", sentence: "One group broke away from the organisation.", correct: "separate/leave", wrong: ["join", "copy", "celebrate"] },
{ phrase: "break through", sentence: "The team broke through the defence.", correct: "succeed past an obstacle", wrong: ["fail completely", "wait", "hide"] },
{ phrase: "break even", sentence: "We only broke even this month.", correct: "have no profit or loss", wrong: ["make big profit", "lose everything", "forget to pay"] },
{ phrase: "break the habit", sentence: "He’s trying to break the habit of smoking.", correct: "stop a repeated behaviour", wrong: ["start a habit", "hide a habit", "teach a habit"] },

{ phrase: "call off", sentence: "They called off the match because of rain.", correct: "cancel", wrong: ["start", "delay", "announce"] },
{ phrase: "call back", sentence: "I’ll call you back in five minutes.", correct: "return a phone call", wrong: ["ignore", "text only", "complain"] },
{ phrase: "call up", sentence: "She called up her old friend.", correct: "phone", wrong: ["email", "avoid", "punish"] },
{ phrase: "call on", sentence: "The teacher called on me to answer.", correct: "choose someone to speak", wrong: ["ignore", "reward", "copy"] },
{ phrase: "call for", sentence: "This situation calls for quick action.", correct: "require", wrong: ["prevent", "cancel", "decorate"] },
{ phrase: "call in", sentence: "They called in a specialist.", correct: "ask someone to come to help", wrong: ["send away", "ignore", "pay back"] },
{ phrase: "call it off", sentence: "Let’s call it off if it gets worse.", correct: "cancel", wrong: ["continue", "celebrate", "publish"] },
{ phrase: "call out", sentence: "He called out the unfair rule.", correct: "criticise publicly", wrong: ["support quietly", "forget", "copy"] },
{ phrase: "call for help", sentence: "She called for help immediately.", correct: "ask for assistance", wrong: ["refuse help", "hide", "delay"] },
{ phrase: "call it a day", sentence: "We called it a day after eight hours.", correct: "stop working", wrong: ["start working", "argue", "travel"] },

{ phrase: "back down", sentence: "He refused to back down.", correct: "stop defending your position", wrong: ["agree quickly", "shout louder", "leave silently"] },
{ phrase: "back out", sentence: "She backed out of the deal.", correct: "withdraw", wrong: ["sign", "celebrate", "repeat"] },
{ phrase: "back up", sentence: "Back up your photos regularly.", correct: "make a safety copy", wrong: ["delete", "share publicly", "forget"] },
{ phrase: "hold back", sentence: "Don’t hold back—tell us your opinion.", correct: "keep from expressing", wrong: ["invent", "repeat", "celebrate"] },
{ phrase: "hold onto", sentence: "Hold onto your ticket.", correct: "keep", wrong: ["throw away", "sell", "translate"] },
{ phrase: "hold off", sentence: "Let’s hold off on making a decision.", correct: "delay", wrong: ["rush", "cancel forever", "copy"] },
{ phrase: "hold up", sentence: "Sorry, traffic held me up.", correct: "delay", wrong: ["speed up", "forget", "help"] },
{ phrase: "hold out", sentence: "They held out for a better offer.", correct: "wait/stick to a demand", wrong: ["accept immediately", "refuse to talk", "forget"] },
{ phrase: "hold on to", sentence: "Hold on to that thought.", correct: "keep in mind", wrong: ["forget", "deny", "avoid"] },
{ phrase: "hold it against", sentence: "I won’t hold it against you.", correct: "blame someone for something", wrong: ["praise someone", "teach someone", "copy someone"] }

];

// Ensure we have exactly 100
if (PHRASES.length !== 100) {
  // Do not throw; keep runtime stable. The quiz still works with any size pool.
}

function buildQuestions(count) {
  return pickN(PHRASES, count).map((it, idx) => {
    const options = shuffle([it.correct, ...it.wrong]).map(String);
    const correctIndex = options.indexOf(it.correct);
    return {
      n: idx + 1,
      phrase: it.phrase,
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
        <div class="brand">Phrasal Verbs</div>
        <div class="global-stats" data-ex="${EX_ID}"></div>
      </div>

      <div class="card">
        <div class="pill">Vocabulary</div>
        <h3>Phrasal Verbs (10 questions)</h3>
        <p>Choose the best meaning of the phrasal verb in the sentence.</p>

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
    const html = state.questions.map((q, qi) => {
      const name = `q_${qi}`;
      const opts = q.options.map((opt, oi) => {
        return `
          <label class="choice" style="display:flex; gap:10px; align-items:flex-start; padding:8px 0;">
            <input type="radio" name="${name}" value="${oi}" ${state.checked ? "disabled" : ""} />
            <span>${escapeHtml(opt)}</span>
            <span class="mark" data-mark="${qi}_${oi}" style="margin-left:auto;"></span>
          </label>
        `;
      }).join("");

      return `
        <div class="q" data-q="${qi}" style="padding:12px 0; border-top: 1px solid rgba(255,255,255,0.08);">
          <div class="prompt" style="margin-bottom:8px;">
            <div style="opacity:0.85; font-size: 13px; margin-bottom:6px;">
              ${q.n}) Phrase: <strong>${escapeHtml(q.phrase)}</strong>
            </div>
            <div>${highlightTerm(q.sentence, q.phrase)}</div>
          </div>
          <div class="choices">${opts}</div>
        </div>
      `;
    }).join("");

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
    let correctNow = 0;

    state.questions.forEach((q, qi) => {
      const a = picked[qi];

      if (a !== null) attemptedThisCheck++;

      const isCorrect = a === q.correctIndex;
      if (isCorrect) correctNow++;

      if (a !== null) {
        const markEl = root.querySelector(`[data-mark="${qi}_${a}"]`);
        if (markEl) {
          markEl.textContent = isCorrect ? "✔" : "✖";
          markEl.style.color = isCorrect ? "#3ddc84" : "#ff6b6b";
          markEl.style.fontWeight = "700";
        }
      }

      const correctMarkEl = root.querySelector(`[data-mark="${qi}_${q.correctIndex}"]`);
      if (correctMarkEl && a !== q.correctIndex) {
        correctMarkEl.textContent = "✔";
        correctMarkEl.style.color = "#3ddc84";
        correctMarkEl.style.fontWeight = "700";
      }

      if (isCorrect && !state.awardedCorrect[qi]) {
        state.awardedCorrect[qi] = true;
        newlyCorrectThisCheck++;
      }
    });

    state.lastScoreText = `Score: ${correctNow}/${state.questions.length}`;
    scoreEl.textContent = state.lastScoreText;

    if (typeof window.recordExerciseResult === "function" && attemptedThisCheck > 0) {
      window.recordExerciseResult(EX_ID, attemptedThisCheck, newlyCorrectThisCheck);
    }
  }

  checkBtn.addEventListener("click", () => {
    state.lastAnswers = getUserAnswers(); // read while enabled
    state.checked = true;
    renderList();                         // rebuild + disable
    markResults(state.lastAnswers);       // mark on new DOM
  });

  newBtn.addEventListener("click", () => {
    state.questions = buildQuestions(QUESTIONS_PER_QUIZ_DEFAULT);
    state.checked = false;
    state.lastScoreText = "";
    state.awardedCorrect = new Array(state.questions.length).fill(false);
    state.lastAnswers = null;
    renderList();
    clearMarks();
  });

  renderList();

  if (typeof window.updateGlobalStatsUI === "function") {
    window.updateGlobalStatsUI();
  }

  return function unmount() {};
}

export default { id: EX_ID, title: "Phrasal verbs", render };
