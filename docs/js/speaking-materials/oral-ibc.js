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
    signpostGroup("I", ["Today I am going to talk about…", "My presentation has three main parts…"]),
    signpostGroup("B", ["First, let us consider…", "For example,…", "This matters because…", "Moving on to my next point…"]),
    signpostGroup("C", ["To sum up,…", "The main point I would like you to remember is…", "Thank you for listening."])
  ],
  weakOpening: "Hello. I have to do a presentation. My topic is countries. There are many things about them.",
  openingOptions: [
    "Today I will compare Lumeria and Norland in three areas: law, religion and gender equality.",
    "Countries are interesting and I will say different things about them.",
    "I did not know how to begin, so I will start with the body."
  ],
  planningTopic: "Compare two countries, businesses, products or ways of solving a problem."
});
