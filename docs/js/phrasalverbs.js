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
  { phrase: "carry out", sentence: "The researchers carried out a study on sleep habits.", correct: "perform (a task or study)", wrong: ["plan before beginning", "publish the results of", "hide"] },
  { phrase: "break down", sentence: "The report breaks down the data into categories.", correct: "divide into smaller parts", wrong: ["summarise the main findings", "compare with an earlier version", "forget"] },
  { phrase: "draw on", sentence: "The writer draws on previous research.", correct: "use as a source", wrong: ["refer critically to", "develop independently of", "laugh at"] },
  { phrase: "set out to", sentence: "This essay sets out to explain the causes of climate change.", correct: "aim to do", wrong: ["finish doing", "be required to do", "be forced to do"] },
  { phrase: "give it a shot", sentence: "I’ve never done karaoke, but I’ll give it a shot.", correct: "try it", wrong: ["watch someone try it", "practise something already familiar", "criticise it"] },
  { phrase: "take into account", sentence: "Age and experience must be taken into account.", correct: "consider", wrong: ["measure separately", "give priority to", "translate"] },
  { phrase: "play a key role", sentence: "Education plays a key role in social development.", correct: "be very important", wrong: ["be directly responsible", "be the only cause", "be confusing"] },
  { phrase: "point out", sentence: "The teacher pointed out several mistakes.", correct: "mention and draw attention to", wrong: ["explain how to correct", "check for further examples of", "celebrate"] },
  { phrase: "figure out", sentence: "I can’t figure out how this works.", correct: "understand/solve", wrong: ["remember accurately", "operate successfully", "destroy"] },
  { phrase: "find out", sentence: "I found out the results this morning.", correct: "discover/learn", wrong: ["confirm an earlier prediction", "receive permission to share", "lose"] },

  { phrase: "look after", sentence: "Can you look after my dog this weekend?", correct: "take care of", wrong: ["search for", "train for a competition", "copy"] },
  { phrase: "look for", sentence: "I’m looking for my keys.", correct: "try to find", wrong: ["describe from memory", "check the condition of", "describe"] },
  { phrase: "look forward to", sentence: "I’m looking forward to the holidays.", correct: "feel excited about (future)", wrong: ["plan carefully for", "feel uncertain about", "forget"] },
  { phrase: "get along", sentence: "Do you get along with your classmates?", correct: "have a good relationship", wrong: ["work in the same group", "share the same opinions", "avoid"] },
  { phrase: "run into", sentence: "I ran into my old teacher yesterday.", correct: "meet unexpectedly", wrong: ["arrange to meet", "mistake for someone else", "invite"] },
  { phrase: "put off", sentence: "Let’s put off the meeting until Friday.", correct: "delay/postpone", wrong: ["shorten the duration of", "change the location of", "summarise"] },
  { phrase: "turn down", sentence: "She turned down the job offer.", correct: "refuse", wrong: ["ask for more details", "negotiate better terms", "write"] },
  { phrase: "turn up", sentence: "He turned up late to class.", correct: "appear/arrive", wrong: ["leave", "receive an invitation", "win"] },
  { phrase: "pick up", sentence: "Can you pick up some milk on the way home?", correct: "collect/buy and bring", wrong: ["pay for in advance", "order for delivery", "explain"] },
  { phrase: "drop off", sentence: "I’ll drop you off at the station.", correct: "take someone somewhere and leave them there", wrong: ["meet someone after their arrival", "travel with someone for the whole journey", "argue with someone"] },

  { phrase: "give up", sentence: "He gave up after two attempts.", correct: "stop trying", wrong: ["pause before another attempt", "change to an easier method", "help"] },
  { phrase: "keep up with", sentence: "It’s hard to keep up with the homework.", correct: "not fall behind", wrong: ["finish ahead of schedule", "check whether work is correct", "laugh at"] },
  { phrase: "catch up", sentence: "I need to catch up on sleep.", correct: "recover", wrong: ["prepare in advance", "reduce the need for", "slow down"] },
  { phrase: "calm down", sentence: "Please calm down and listen.", correct: "compose oneself", wrong: ["speak more quietly without relaxing", "stop speaking but remain upset", "celebrate"] },
  { phrase: "get rid of", sentence: "We need to get rid of these old files.", correct: "remove/throw away", wrong: ["sort into groups", "move to temporary storage", "protect"] },
  { phrase: "set up", sentence: "They set up a new system for bookings.", correct: "create/arrange", wrong: ["test an existing system", "replace one part of a system", "delay"] },
  { phrase: "take part in", sentence: "Many students took part in the project.", correct: "participate in", wrong: ["organise", "observe without joining", "complain about"] },
  { phrase: "come up with", sentence: "She came up with a great idea.", correct: "think of (an idea)", wrong: ["choose between existing ideas", "explain someone else's idea", "steal"] },
  { phrase: "deal with", sentence: "We need to deal with this problem now.", correct: "handle", wrong: ["describe in detail", "postpone until later", "hide"] },
  { phrase: "focus on", sentence: "Focus on the main idea.", correct: "concentrate on", wrong: ["summarise", "compare with another idea", "forget"] },

  { phrase: "make sure", sentence: "Make sure you lock the door.", correct: "check/ensure", wrong: ["make a plan", "ask for permission", "deny"] },
  { phrase: "depend on", sentence: "It depends on the weather.", correct: "be decided by", wrong: ["be similar to", "be postponed until", "be funny"] },
  { phrase: "result in", sentence: "This can result in serious problems.", correct: "lead to", wrong: ["be caused by", "be associated with without causing", "describe"] },
  { phrase: "lead to", sentence: "Smoking can lead to health issues.", correct: "cause", wrong: ["be caused by", "prevent", "decorate"] },
  { phrase: "agree on", sentence: "They agreed on a new plan.", correct: "reach the same decision", wrong: ["discuss without deciding", "agree to postpone a decision", "hide"] },
  { phrase: "argue that", sentence: "Some researchers argue that sleep affects learning.", correct: "claim (with reasons)", wrong: ["report without interpretation", "ask whether something is true", "translate"] },
  { phrase: "point to", sentence: "The evidence points to a clear trend.", correct: "indicate/suggest", wrong: ["provide an alternative explanation for", "question the reliability of", "laugh"] },
  { phrase: "refer to", sentence: "The report refers to several earlier studies.", correct: "mention", wrong: ["evaluate in detail", "be written for", "celebrate"] },
  { phrase: "consist of", sentence: "The course consists of five modules.", correct: "be made up of", wrong: ["be compared with", "be divided between owners", "explain"] },
  { phrase: "be based on", sentence: "The film is based on a true story.", correct: "use as the foundation", wrong: ["be set in the same location as", "be written by the person in", "be shorter than"] },

  { phrase: "take place", sentence: "The event will take place on Saturday.", correct: "happen", wrong: ["be announced", "be organised", "be paid"] },
  { phrase: "hand in", sentence: "Please hand in your assignment by 3 pm.", correct: "submit", wrong: ["revise", "collect from the teacher", "explain"] },
  { phrase: "fill out", sentence: "Fill out this form, please.", correct: "complete (a form)", wrong: ["check without changing", "submit without completing", "cancel"] },
  { phrase: "sign up for", sentence: "I signed up for a coding course.", correct: "register for", wrong: ["ask for information about", "apply to teach", "postpone"] },
  { phrase: "show up", sentence: "Only five people showed up.", correct: "arrive/appear", wrong: ["register in advance", "send an apology", "cancel"] },
  { phrase: "work out", sentence: "We need to work out a solution.", correct: "develop/figure out", wrong: ["test an existing solution", "explain why a solution failed", "break"] },
  { phrase: "sort out", sentence: "Let’s sort out the schedule.", correct: "organise/resolve", wrong: ["postpone reviewing", "describe without changing", "celebrate"] },
  { phrase: "bring up", sentence: "She brought up an important point.", correct: "mention", wrong: ["explain how to solve", "reject after considering", "cancel"] },
  { phrase: "set aside", sentence: "Set aside some time for revision.", correct: "reserve", wrong: ["estimate how much is needed", "spend more time than planned", "borrow"] },
  { phrase: "follow up", sentence: "I’ll follow up with an email tomorrow.", correct: "contact again to continue", wrong: ["send an initial invitation", "end a discussion in writing", "celebrate"] },

  { phrase: "go on", sentence: "Please go on with your presentation.", correct: "continue", wrong: ["return to the beginning", "move to a different subject", "argue"] },
  { phrase: "carry on", sentence: "Even when it rains, we carry on.", correct: "continue", wrong: ["start again from the beginning", "change what we are doing", "repeat"] },
  { phrase: "set off", sentence: "We set off early in the morning.", correct: "start a journey", wrong: ["reach a destination", "prepare the equipment", "forget"] },
  { phrase: "put on", sentence: "He put on his jacket.", correct: "dress/wear", wrong: ["carry", "fasten", "lose"] },
  { phrase: "take off", sentence: "Please take off your shoes.", correct: "remove", wrong: ["clean", "change into another pair of", "wash"] },
  { phrase: "get on", sentence: "She got on the bus.", correct: "enter (a vehicle)", wrong: ["wait beside", "travel next to", "pay"] },
  { phrase: "get off", sentence: "We got off at the next stop.", correct: "leave (a vehicle)", wrong: ["change seats", "wait for", "forget"] },
  { phrase: "check in", sentence: "We checked in at the hotel.", correct: "register on arrival", wrong: ["reserve a room before travelling", "ask about room prices", "pay back"] },
  { phrase: "check out", sentence: "We checked out at 11 am.", correct: "leave and pay at the end", wrong: ["inspect the room before paying", "reserve another night's stay", "refuse"] },
  { phrase: "look up", sentence: "Look up the word in a dictionary.", correct: "search for information", wrong: ["guess the meaning of", "copy the definition of", "hide"] },

  { phrase: "bring about", sentence: "The new policy brought about major changes.", correct: "cause", wrong: ["draw attention to", "respond to", "forget"] },
  { phrase: "rule out", sentence: "We can’t rule out delays.", correct: "say something is impossible (exclude)", wrong: ["confirm that something is likely", "remove an existing delay", "repeat"] },
  { phrase: "carry on with", sentence: "Let’s carry on with question two.", correct: "continue", wrong: ["check the answer to", "skip", "hide"] },
  { phrase: "pay attention", sentence: "Pay attention to the instructions.", correct: "listen/watch carefully", wrong: ["remember word for word", "repeat aloud", "celebrate"] },
  { phrase: "take notes", sentence: "Take notes during the lecture.", correct: "write key points", wrong: ["copy the full text", "mark unfamiliar words", "forget"] },
  { phrase: "make progress", sentence: "She is making progress in English.", correct: "improve", wrong: ["finish the course", "spend more time studying", "complain"] },
  { phrase: "make a decision", sentence: "We need to make a decision today.", correct: "decide", wrong: ["discuss the alternatives", "announce an earlier decision", "forget"] },
  { phrase: "reach an agreement", sentence: "They reached an agreement quickly.", correct: "agree", wrong: ["start formal negotiations", "accept different responsibilities", "delay"] },
  { phrase: "raise awareness", sentence: "The campaign aims to raise awareness of mental health.", correct: "increase public understanding", wrong: ["collect private medical information", "increase the number of available treatments", "change the law"] },
  { phrase: "take responsibility", sentence: "He took responsibility for the mistake.", correct: "accept blame and duty", wrong: ["explain the mistake without accepting it", "assign the task of correcting it", "celebrate it"] },

  { phrase: "make an effort", sentence: "Make an effort to speak English in class.", correct: "try hard", wrong: ["follow the usual routine", "set an easy target", "rest"] },
  { phrase: "come across", sentence: "I came across an interesting article.", correct: "find by chance", wrong: ["search systematically for", "receive from a known source", "destroy"] },
  { phrase: "set a goal", sentence: "Set a goal for this week.", correct: "decide on a target", wrong: ["choose a method", "review an earlier target", "copy"] },
  { phrase: "meet a deadline", sentence: "We must meet the deadline.", correct: "finish on time", wrong: ["agree on a final date", "request more time", "forget"] },
  { phrase: "miss a deadline", sentence: "He missed the deadline by two days.", correct: "fail to finish on time", wrong: ["forget which date was agreed", "complete the work earlier than planned", "get promoted"] },
  { phrase: "take a break", sentence: "Let’s take a break for ten minutes.", correct: "rest briefly", wrong: ["change to a different task", "end the work for the day", "argue"] },
  { phrase: "make a mistake", sentence: "Everyone makes mistakes sometimes.", correct: "do something wrong", wrong: ["take a calculated risk", "receive an unexpected result", "teach"] },
  { phrase: "learn from", sentence: "Try to learn from your mistakes.", correct: "use experience to improve", wrong: ["explain the causes of", "remember without changing behaviour", "hide"] },
  { phrase: "improve on", sentence: "You can improve on your first draft.", correct: "make it better", wrong: ["add length without changing quality", "compare it with another draft", "copy it"] },
  { phrase: "come to a conclusion", sentence: "The study came to a clear conclusion.", correct: "reach a final idea", wrong: ["begin with an assumption", "collect a final set of figures", "delay"] },

  { phrase: "take action", sentence: "We must take action to reduce waste.", correct: "do something (not just talk)", wrong: ["agree on what should be done", "make a formal complaint", "celebrate"] },
  { phrase: "make a difference", sentence: "Small changes can make a difference.", correct: "have an effect", wrong: ["attract public attention", "reduce the amount of effort needed", "be funny"] },
  { phrase: "have an impact on", sentence: "Social media can have an impact on sleep.", correct: "affect", wrong: ["be influenced by", "be used to measure", "summarise"] },
  { phrase: "be involved in", sentence: "She is involved in several projects.", correct: "take part in", wrong: ["be responsible for every part of", "be informed about without participating", "forget"] },
  { phrase: "take advantage of", sentence: "Take advantage of free practice materials.", correct: "use an opportunity", wrong: ["wait for a better opportunity", "create a new opportunity", "hide"] },
  { phrase: "make use of", sentence: "Make use of the examples.", correct: "use", wrong: ["refer to without applying", "improve the quality of", "replace"] },
  { phrase: "keep track of", sentence: "Keep track of your homework.", correct: "monitor/record", wrong: ["complete ahead of time", "decide which task matters most", "hide"] },
  { phrase: "stick to", sentence: "Try to stick to your plan.", correct: "follow consistently", wrong: ["revise repeatedly", "explain to other people", "cancel"] },
  { phrase: "put together", sentence: "She put together a presentation in one day.", correct: "assemble/create", wrong: ["rehearse an existing presentation", "summarise someone else's presentation", "delay"] },
  { phrase: "take over", sentence: "The new manager took over last month.", correct: "assume control", wrong: ["begin assisting", "transfer control to someone else", "explain"] },

  { phrase: "carry on", sentence: "Carry on; you’re doing well.", correct: "continue", wrong: ["begin a different task", "return to an earlier point", "argue"] },
  { phrase: "back up", sentence: "Back up your files regularly.", correct: "make a safety copy", wrong: ["move to a new folder", "remove older versions", "ignore"] },
  { phrase: "log in", sentence: "Log in with your school account.", correct: "enter a system using credentials", wrong: ["create a new account", "change an account's password", "send email"] },
  { phrase: "log out", sentence: "Remember to log out on shared computers.", correct: "exit an account/session", wrong: ["close the computer screen without ending a session", "remove an account permanently", "reset"] },
  { phrase: "set out", sentence: "The report sets out the main findings.", correct: "present clearly", wrong: ["collect for later analysis", "question the accuracy of", "guess"] },
  { phrase: "sum up", sentence: "To sum up, we need better planning.", correct: "summarise", wrong: ["add another example", "draw a new conclusion from", "argue"] },
  { phrase: "bring in", sentence: "They brought in an expert to help.", correct: "introduce someone for help", wrong: ["consult without involving", "replace with an internal employee", "criticise"] },
  { phrase: "phase out", sentence: "They will phase out the old system.", correct: "remove gradually", wrong: ["replace immediately", "update without removing", "celebrate"] },
  { phrase: "set a limit", sentence: "Set a limit for screen time.", correct: "decide a maximum", wrong: ["estimate an average", "choose a target to exceed", "copy"] },
  { phrase: "keep in touch", sentence: "We still keep in touch after graduation.", correct: "stay in contact", wrong: ["arrange regular meetings", "share the same interests", "compete"] },

  { phrase: "pay off", sentence: "All that practice paid off.", correct: "produce good results", wrong: ["reduce the effort needed", "attract public attention", "be stolen"] },
  { phrase: "come up", sentence: "Something urgent came up.", correct: "happen unexpectedly", wrong: ["be scheduled in advance", "become less urgent", "be solved"] },
  { phrase: "hold on", sentence: "Hold on a second, please.", correct: "wait", wrong: ["continue speaking", "repeat the request", "leave"] },
  { phrase: "make up for", sentence: "I’ll make up for being late.", correct: "compensate", wrong: ["explain the reason for", "ask to be excused from", "ignore"] },
  { phrase: "look into", sentence: "We will look into the complaint.", correct: "investigate", wrong: ["respond without checking", "record without investigating", "publish"] },
  { phrase: "come to terms with", sentence: "He came to terms with the decision.", correct: "accept (a difficult situation)", wrong: ["negotiate different conditions", "forget the decision entirely", "celebrate"] },
  { phrase: "set a deadline", sentence: "They set a deadline for the project.", correct: "choose a final date", wrong: ["request an extension", "announce the completion date", "hide"] },
  { phrase: "miss out on", sentence: "Don’t miss out on this opportunity.", correct: "fail to experience/get", wrong: ["decline after experiencing", "receive only part of", "repeat"] },
  { phrase: "get used to", sentence: "You’ll get used to the routine.", correct: "become accustomed to", wrong: ["agree that something is correct", "learn how to change something", "change"] },
  { phrase: "go through", sentence: "Let’s go through the instructions again.", correct: "review step by step", wrong: ["follow without checking", "rewrite in simpler language", "celebrate"] },

  // Keep adding until 100:
  { phrase: "take care of", sentence: "I’ll take care of the emails.", correct: "handle", wrong: ["check the number of", "delegate to someone else", "translate"] },
  { phrase: "come back to", sentence: "Let’s come back to this question later.", correct: "return to a topic", wrong: ["change the wording of", "discuss a different question", "publish"] },
  { phrase: "work on", sentence: "She is working on her pronunciation.", correct: "try to improve", wrong: ["assess without practising", "teach someone else", "forget"] },
  { phrase: "give up on", sentence: "Don’t give up on this course.", correct: "stop believing/trying", wrong: ["take a short break from", "ask someone else to complete", "translate"] },
  { phrase: "keep up", sentence: "Keep up the good work.", correct: "continue at the same level", wrong: ["increase the pace of", "repeat from the beginning", "hide"] },
  { phrase: "fall behind", sentence: "He fell behind in math.", correct: "fail to keep up", wrong: ["lose interest in", "move to a lower class", "be promoted"] },
  { phrase: "catch on", sentence: "She caught on quickly.", correct: "understand/learn", wrong: ["copy accurately", "agree reluctantly", "delay"] },
  { phrase: "hand out", sentence: "The teacher handed out worksheets.", correct: "distribute", wrong: ["collect", "explain", "hide"] },
  { phrase: "take turns", sentence: "Take turns answering the questions.", correct: "alternate", wrong: ["answer together", "decide who answers first every time", "copy"] },
  { phrase: "make a complaint", sentence: "He made a complaint to customer service.", correct: "express dissatisfaction formally", wrong: ["ask for more information", "request a discount without expressing dissatisfaction", "give permission"] },

  { phrase: "raise a question", sentence: "This raises an important question.", correct: "cause a question to be asked", wrong: ["answer an existing question", "make a final judgement", "prove false"] },
  { phrase: "reach a decision", sentence: "They reached a decision after an hour.", correct: "decide", wrong: ["announce a plan to discuss", "postpone a judgement", "hide"] },
  { phrase: "take a look", sentence: "Take a look at my draft.", correct: "look briefly", wrong: ["review every detail", "make a written correction", "deny"] },
  { phrase: "make a change", sentence: "We need to make a change to the plan.", correct: "alter", wrong: ["explain", "approve without alteration", "cancel"] },
  { phrase: "come to an end", sentence: "The lesson came to an end.", correct: "finish", wrong: ["reach a new topic", "pause temporarily", "expand"] },
  { phrase: "set a reminder", sentence: "Set a reminder for tomorrow.", correct: "create an alert", wrong: ["postpone a task", "record a task as completed", "hide"] },
  { phrase: "take a risk", sentence: "Starting a business is taking a risk.", correct: "do something with possible negative results", wrong: ["choose the most likely outcome", "avoid uncertainty by delaying", "copy"] },
  { phrase: "make a promise", sentence: "He made a promise to help.", correct: "promise", wrong: ["offer an informal possibility", "ask someone else for help", "forget"] },
  { phrase: "keep a promise", sentence: "She kept her promise.", correct: "do what she promised", wrong: ["repeated what she promised", "remembered what she promised", "hide it"] },
  { phrase: "break a promise", sentence: "He broke his promise again.", correct: "fail promise", wrong: ["changed the wording without changing the commitment", "delayed discussing a new commitment", "celebrate promise"] },

  { phrase: "take a stand", sentence: "She took a stand against bullying.", correct: "oppose", wrong: ["observe without joining", "reach an agreement with", "avoid people"] },
  { phrase: "make a claim", sentence: "The article makes a strong claim.", correct: "state something as true", wrong: ["ask whether something is true", "provide evidence that disproves something", "deny something"] },
  { phrase: "support a claim", sentence: "Use evidence to support your claim.", correct: "back up with", wrong: ["summarise the wording of", "question the meaning of", "cancel"] },
  { phrase: "raise an issue", sentence: "He raised an issue about safety.", correct: "bring up an issue", wrong: ["solve an issue", "postpone discussion of an issue", "laugh at it"] },
  { phrase: "address a problem", sentence: "We must address the problem immediately.", correct: "deal with it", wrong: ["describe its effects", "agree that it exists", "celebrate it"] },
  { phrase: "meet requirements", sentence: "This does not meet the requirements.", correct: "satisfy conditions", wrong: ["identify conditions", "negotiate new conditions", "guess"] },
  { phrase: "set priorities", sentence: "We need to set priorities.", correct: "decide what is most important", wrong: ["choose the quickest tasks", "share tasks equally", "deny"] },
  { phrase: "make a suggestion", sentence: "Can I make a suggestion?", correct: "propose an idea", wrong: ["ask for a final decision", "repeat an instruction", "forget"] },
  { phrase: "take a suggestion", sentence: "I’ll take your suggestion.", correct: "accept", wrong: ["consider without accepting", "ask for further suggestions", "delete"] },
  { phrase: "reach a goal", sentence: "He reached his goal this month.", correct: "achieve", wrong: ["set", "revise", "forget"] },

  { phrase: "put up with", sentence: "I can’t put up with the noise anymore.", correct: "tolerate", wrong: ["avoid", "understand", "measure"] },
{ phrase: "run out of", sentence: "We ran out of milk this morning.", correct: "have none left", wrong: ["use less", "buy too much", "hide"] },
{ phrase: "get by", sentence: "On a student budget, you learn to get by.", correct: "manage with what you have", wrong: ["save for a future purchase", "earn more than is needed", "travel abroad"] },
{ phrase: "get over", sentence: "It took her weeks to get over the flu.", correct: "recover from", wrong: ["become ill with", "protect someone else from", "postpone"] },
{ phrase: "get away with", sentence: "He thought he could get away with cheating.", correct: "avoid punishment", wrong: ["hide evidence without avoiding a penalty", "receive permission in advance", "improve skills"] },
{ phrase: "look out", sentence: "Look out! There’s a car coming.", correct: "be careful", wrong: ["look ahead to the future", "search for a missing object", "be early"] },
{ phrase: "look out for", sentence: "Look out for spelling mistakes.", correct: "watch for", wrong: ["correct without checking", "ask someone else about", "guess"] },
{ phrase: "look down on", sentence: "It’s wrong to look down on people.", correct: "disrespect", wrong: ["disagree with", "feel concerned about", "copy"] },
{ phrase: "look up to", sentence: "Many students look up to their coach.", correct: "admire", wrong: ["depend financially on", "try to resemble", "compete with"] },
{ phrase: "look back on", sentence: "She looks back on her school years with pride.", correct: "think about the past", wrong: ["compare future possibilities", "plan to repeat the past", "complain about something"] },

{ phrase: "look around", sentence: "Let’s look around before we decide.", correct: "explore", wrong: ["search for one specific item", "return to a familiar place", "hide"] },
{ phrase: "look over", sentence: "Can you look over my essay?", correct: "review", wrong: ["rewrite", "read aloud", "shout"] },
{ phrase: "look through", sentence: "I looked through my notes for the answer.", correct: "search", wrong: ["organise into categories", "learn by heart", "celebrate"] },
{ phrase: "come across as", sentence: "He comes across as confident in interviews.", correct: "seem", wrong: ["claim to be", "intend to become", "be injured"] },
{ phrase: "come down with", sentence: "I came down with a cold.", correct: "become ill with", wrong: ["recover from", "pass an illness to someone else", "pay for"] },
{ phrase: "come around", sentence: "She came around after a few minutes.", correct: "regain consciousness", wrong: ["return to the same location", "change her opinion", "leave early"] },
{ phrase: "come along", sentence: "Come along—we’re leaving now.", correct: "go with", wrong: ["walk ahead of", "wait behind", "hide from"] },
{ phrase: "come in handy", sentence: "These phrases will come in handy during the exam.", correct: "be useful", wrong: ["be easy to remember", "be available in writing", "be illegal"] },
{ phrase: "come up against", sentence: "We came up against some serious problems.", correct: "encounter", wrong: ["create", "prepare for", "solve instantly"] },

{ phrase: "go over", sentence: "Let’s go over the instructions again.", correct: "review", wrong: ["follow without checking", "put into a different order", "invent"] },
{ phrase: "go off", sentence: "The alarm went off at 6 a.m.", correct: "start ringing", wrong: ["stop ringing", "display the wrong time", "get lost"] },
{ phrase: "go out", sentence: "The lights went out during the storm.", correct: "stop working", wrong: ["became brighter", "were switched to another setting", "get sold"] },
{ phrase: "go through with", sentence: "She decided to go through with the plan.", correct: "do it as planned", wrong: ["revise before beginning", "ask someone else to carry out", "delay forever"] },
{ phrase: "go back on", sentence: "He went back on his promise.", correct: "break a promise", wrong: ["forgot the exact wording of his promise", "delayed making a new promise", "write a promise"] },
{ phrase: "go ahead", sentence: "Go ahead and start without me.", correct: "proceed", wrong: ["prepare without starting", "return to an earlier stage", "hide"] },
{ phrase: "go for", sentence: "I’ll go for the cheaper option.", correct: "choose", wrong: ["ask about", "recommend to someone else", "wait"] },
{ phrase: "go with", sentence: "Let’s go with your idea.", correct: "choose", wrong: ["adapt", "compare with another idea", "delay"] },
{ phrase: "go without", sentence: "We can’t go without water.", correct: "manage without having", wrong: ["wait patiently", "pay extra", "measure"] },
{ phrase: "go out of", sentence: "He went out of his way to help.", correct: "make extra effort", wrong: ["change his route accidentally", "avoid asking anyone for help", "forget effort"] },

{ phrase: "take on", sentence: "She took on more work than she should.", correct: "accept responsibility for", wrong: ["delegate", "finish ahead of schedule", "complain quietly"] },
{ phrase: "take in", sentence: "I couldn’t take in all the information.", correct: "understand/absorb", wrong: ["remember from earlier study", "repeat without understanding", "forget"] },
{ phrase: "take back", sentence: "I take back what I said.", correct: "admit it was wrong and withdraw it", wrong: ["explain it in different words", "ask someone else to confirm it", "shout it"] },
{ phrase: "take out", sentence: "Please take out the trash.", correct: "remove", wrong: ["sort", "recycle without moving", "translate"] },
{ phrase: "take over from", sentence: "Sara will take over from Erik next week.", correct: "replace in a role", wrong: ["work alongside", "report directly to", "ignore"] },
{ phrase: "take up", sentence: "He took up running last year.", correct: "start a new hobby/activity", wrong: ["return to a previous hobby", "teach a familiar activity", "forget"] },
{ phrase: "take down", sentence: "Take down the notes from the board.", correct: "write/record", wrong: ["summarise from memory", "remove from the board", "argue"] },
{ phrase: "take apart", sentence: "He took the machine apart to fix it.", correct: "separate into pieces", wrong: ["inspect without opening", "put back together", "hide"] },
{ phrase: "take in stride", sentence: "She took the criticism in stride.", correct: "handle calmly", wrong: ["ignored the criticism without considering it", "agreed with every point of criticism", "celebrate"] },
{ phrase: "take to", sentence: "The kids took to the new teacher quickly.", correct: "begin to like", wrong: ["became accustomed to disliking", "copied the behaviour of", "begin to ignore"] },

{ phrase: "put away", sentence: "Put away your phone during class.", correct: "store/tidy", wrong: ["pass to someone else", "switch to another application", "translate"] },
{ phrase: "put back", sentence: "Please put the books back on the shelf.", correct: "return to the original place", wrong: ["move to a new location", "put into a different order", "lose"] },
{ phrase: "put on hold", sentence: "The project is on hold for now.", correct: "paused temporarily", wrong: ["completed but awaiting publication", "continuing at a slower pace", "ignored forever"] },
{ phrase: "put through", sentence: "They put me through to the manager.", correct: "connect by phone", wrong: ["asked me to leave a message for", "asked me to call the manager later", "translate"] },
{ phrase: "put out", sentence: "Firefighters put out the fire quickly.", correct: "extinguish", wrong: ["brought under control without extinguishing", "moved away from nearby buildings", "decorate"] },
{ phrase: "put up", sentence: "They put up a poster in the hallway.", correct: "attach/display", wrong: ["design", "take down for replacement", "lose"] },
{ phrase: "put down", sentence: "Please don’t put others down.", correct: "insult/criticise", wrong: ["disagree respectfully with", "give instructions to", "invite"] },
{ phrase: "put together", sentence: "He put together a short report.", correct: "create/assemble", wrong: ["shorten an existing report", "copy a report without changing it", "delay"] },
{ phrase: "put off until", sentence: "We put it off until next week.", correct: "postpone", wrong: ["brought it forward to this week", "spread it across several weeks", "copy"] },
{ phrase: "put up to", sentence: "Who put you up to this prank?", correct: "persuade someone to do something", wrong: ["helped you explain the prank", "found out who organised the prank", "reward"] },

{ phrase: "turn out", sentence: "It turned out better than expected.", correct: "end up / happen in the end", wrong: ["was planned from the start", "was described afterwards", "be cancelled"] },
{ phrase: "turn into", sentence: "The discussion turned into an argument.", correct: "change into", wrong: ["caused a separate argument", "prevented an argument", "improve"] },
{ phrase: "turn over", sentence: "Turn over the paper and start.", correct: "flip to the other side", wrong: ["pass to another person", "move to a different desk", "translate"] },
{ phrase: "turn back", sentence: "We turned back because of the snow.", correct: "return the way you came", wrong: ["changed to a different route forward", "waited until the snow stopped", "celebrate"] },
{ phrase: "turn around", sentence: "The company turned around its results.", correct: "improve a bad situation", wrong: ["explained the poor results", "predicted a change in results", "ignore"] },
{ phrase: "turn on", sentence: "Turn on the lights, please.", correct: "switch on", wrong: ["make brighter", "check whether they work", "hide"] },
{ phrase: "turn off", sentence: "Turn off your microphone.", correct: "switch off", wrong: ["make quieter", "disconnect from the computer", "sell"] },
{ phrase: "turn to", sentence: "She turned to her friend for advice.", correct: "ask for help", wrong: ["talk about without asking", "repeat advice already received from", "compete"] },
{ phrase: "turn up at", sentence: "He turned up at the office unexpectedly.", correct: "arrive", wrong: ["left", "sent a message", "borrow"] },
{ phrase: "turn down", sentence: "He turned down the invitation.", correct: "refuse", wrong: ["delayed replying to", "asked for details about", "repair"] },

{ phrase: "break out", sentence: "A fire broke out in the kitchen.", correct: "start suddenly (bad event)", wrong: ["spread from another room", "was discovered after ending", "be repaired"] },
{ phrase: "break into", sentence: "Someone broke into the house.", correct: "enter by force illegally", wrong: ["entered after receiving permission", "forced someone else to leave", "decorate"] },
{ phrase: "break up", sentence: "They broke up after two years.", correct: "end a relationship", wrong: ["stopped seeing each other temporarily", "started living in separate cities without separating", "move in"] },
{ phrase: "break down", sentence: "My car broke down on the highway.", correct: "stop working", wrong: ["ran out of fuel", "slowed down because of traffic", "get sold"] },
{ phrase: "break in", sentence: "It took time to break in the new shoes.", correct: "make comfortable by using", wrong: ["repair damage to", "make larger before wearing", "repair"] },
{ phrase: "break off", sentence: "They broke off the negotiations.", correct: "end suddenly", wrong: ["paused the negotiations until an agreed date", "changed the subject of the negotiations", "agree"] },
{ phrase: "break away", sentence: "One group broke away from the organisation.", correct: "separate/leave", wrong: ["changed its internal leadership", "formed a partnership with", "celebrate"] },
{ phrase: "break through", sentence: "The team broke through the defence.", correct: "succeed past an obstacle", wrong: ["avoided the defence entirely", "strengthened their own defence", "hide"] },
{ phrase: "break even", sentence: "We only broke even this month.", correct: "have no profit or loss", wrong: ["earned a small profit", "recovered half of the costs", "forget to pay"] },
{ phrase: "break the habit", sentence: "He’s trying to break the habit of smoking.", correct: "stop a repeated behaviour", wrong: ["reduce a behaviour without trying to stop it", "change when a behaviour takes place", "teach a habit"] },

{ phrase: "call off", sentence: "They called off the match because of rain.", correct: "cancel", wrong: ["shortened", "moved indoors", "announce"] },
{ phrase: "call back", sentence: "I’ll call you back in five minutes.", correct: "return a phone call", wrong: ["send a written reply", "ask you to phone later", "complain"] },
{ phrase: "call up", sentence: "She called up her old friend.", correct: "phone", wrong: ["visited unexpectedly", "invited in writing", "punish"] },
{ phrase: "call on", sentence: "The teacher called on me to answer.", correct: "choose someone to speak", wrong: ["asked me to leave the room", "asked another student to help me", "copy"] },
{ phrase: "call for", sentence: "This situation calls for quick action.", correct: "require", wrong: ["delays", "suggests reviewing earlier action", "decorate"] },
{ phrase: "call in", sentence: "They called in a specialist.", correct: "ask someone to come to help", wrong: ["replaced", "asked a specialist to report remotely", "pay back"] },
{ phrase: "call it off", sentence: "Let’s call it off if it gets worse.", correct: "cancel", wrong: ["delay it until a fixed later date", "continue with a smaller version", "publish"] },
{ phrase: "call out", sentence: "He called out the unfair rule.", correct: "criticise publicly", wrong: ["explained the unfair rule privately", "enforced the unfair rule more strictly", "copy"] },
{ phrase: "call for help", sentence: "She called for help immediately.", correct: "ask for assistance", wrong: ["offered assistance", "explained why help had been refused", "delay"] },
{ phrase: "call it a day", sentence: "We called it a day after eight hours.", correct: "stop working", wrong: ["completed the entire project", "changed to another task", "travel"] },

{ phrase: "back down", sentence: "He refused to back down.", correct: "stop defending your position", wrong: ["change the way you explain your position", "ask someone else to support your position", "leave silently"] },
{ phrase: "back out", sentence: "She backed out of the deal.", correct: "withdraw", wrong: ["renegotiated the deal while remaining committed", "postponed signing the same deal", "repeat"] },
{ phrase: "back up", sentence: "Back up your photos regularly.", correct: "make a safety copy", wrong: ["move photos to a public folder", "delete earlier photo versions", "forget"] },
{ phrase: "hold back", sentence: "Don’t hold back—tell us your opinion.", correct: "keep from expressing", wrong: ["express indirectly", "wait before asking a question", "celebrate"] },
{ phrase: "hold onto", sentence: "Hold onto your ticket.", correct: "keep", wrong: ["check the details of", "show to an official", "translate"] },
{ phrase: "hold off", sentence: "Let’s hold off on making a decision.", correct: "delay", wrong: ["make a temporary decision", "change an earlier decision", "copy"] },
{ phrase: "hold up", sentence: "Sorry, traffic held me up.", correct: "delay", wrong: ["made me change my destination", "made me leave earlier", "help"] },
{ phrase: "hold out", sentence: "They held out for a better offer.", correct: "wait/stick to a demand", wrong: ["accepted the offer provisionally", "withdrew from further negotiations", "forget"] },
{ phrase: "hold on to", sentence: "Hold on to that thought.", correct: "keep in mind", wrong: ["explain in more detail", "ask someone else to continue", "avoid"] },
{ phrase: "hold it against", sentence: "I won’t hold it against you.", correct: "blame someone for something", wrong: ["remind someone of something", "disagree with someone about something", "copy someone"] }

];

// The full bank is available for random selection.
if (PHRASES.length < 100) {
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
