import { signpostGroup, speakingMaterial } from "./activity-builders.js";

export default speakingMaterial({
  id: "oral-ibc",
  title: "IBC for Oral Presentations",
  introduction: "Give listeners a clear beginning, a developed middle and a memorable ending.",
  structure: [
    ["I", "Orient the audience", "Introduce the topic, establish its relevance and preview the main points."],
    ["B", "Guide the audience", "Develop one point at a time using explanation, examples and spoken transitions."],
    ["C", "Complete the message", "Signal the ending, summarise the main ideas and leave a final thought."]
  ],
  note: "A presentation is not an essay read aloud. Sentences are usually shorter, and listeners need clearer verbal signposts.",
  signposts: [
    signpostGroup("I", ["Today I am going to talk aboutâ€¦", "My presentation has three main partsâ€¦"]),
    signpostGroup("B", ["First, let us considerâ€¦", "For example,â€¦", "This matters becauseâ€¦", "Moving on to my next pointâ€¦"]),
    signpostGroup("C", ["To sum up,â€¦", "The main point I would like you to remember isâ€¦", "Thank you for listening."])
  ],
  weakOpening: "Hello. I have to do a presentation. My topic is countries. There are many things about them.",
  openingOptions: [
    "Today I will compare Lumeria and Norland in three areas: law, religion and gender equality.",
    "Countries are interesting and I will say different things about them.",
    "I did not know how to begin, so I will start with the body."
  ],
  planningTopic: "Compare two countries, businesses, products or ways of solving a problem.",
  model: {
    introduction: "In a 2001 Gallup poll, 40% of U.S. adults said they were afraid of speaking in front of an audience. If you feel nervous before a presentation, you are not alone. Today I will share three ways to feel more confident: prepare your ideas, manage your nerves and connect with your audience.",
    source: "https://news.gallup.com/poll/1891/snakes-top-list-americans-fears.aspx",
    body: [
      "First, prepare your ideas. Practising aloud helps you notice where you need a clearer explanation. For example, you could rehearse once with a friend and ask which point was difficult to follow. This makes your message easier to deliver.",
      "Next, manage your nerves. A short pause and a few slow breaths can help you begin at a comfortable pace. For example, pause before your first sentence instead of rushing into it.",
      "Finally, connect with your audience. Look around the room and use a simple question or visual to support your point. This helps listeners follow your message."
    ],
    conclusion: "To sum up, preparation, a calm start and a connection with your audience can make a presentation easier to follow. Choose one strategy to try in your next presentation. Thank you for listening."
  },
  bodyParts: [
    {text:"Practising aloud helps you notice where you need a clearer explanation.",role:"Elaboration"},
    {text:"First, prepare your ideas.",role:"Point"},
    {text:"This makes your message easier to deliver.",role:"Link"},
    {text:"For example, rehearse once with a friend and ask which point was difficult to follow.",role:"Example"}
  ],
  strategies: [
    {situation:"You have written every word and keep looking down at your script.",choices:["Put keywords on cue cards and practise speaking from them.","Add more sentences to the script.","Read the script faster."],answer:0,why:"Short notes help you speak more naturally while keeping your main points."},
    {situation:"You speak quickly when you are nervous, and listeners miss your ideas.",choices:["Avoid all pauses.","Pause between points and slow your pace.","Speak more quietly."],answer:1,why:"Pauses give you and your listeners time to process each point."},
    {situation:"You worry about presenting to the whole class.",choices:["Practise with a friend or small group first.","Skip all rehearsal.","Try to memorise every word overnight."],answer:0,why:"A smaller practice audience can help you rehearse before presenting to the class."},
    {situation:"A slide contains several paragraphs that you plan to read aloud.",choices:["Add even more text.","Face the screen while reading.","Use a simple visual or a few keywords to support your point."],answer:2,why:"Slides should help listeners follow you, while you explain the ideas."}
  ]
});
