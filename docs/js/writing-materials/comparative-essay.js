import { essayMaterial, peelParagraph } from "./activity-builders.js";

export default essayMaterial({
  id: "comparative",
  label: "Comparative essay",
  title: "Lumeria and Norland",
  prompt: "Compare the legal systems, religion and gender equality of Lumeria and Norland.",
  introduction: "Lumeria and Norland are two modern countries with different systems in society and politics. Both are democracies and respect human rights. However, they differ in their legal systems, religion and gender equality. This essay compares these three areas.",
  paragraph: peelParagraph({
    point: "The legal systems in Lumeria and Norland work in different ways.",
    evidence: "In Lumeria, judges follow clear written rules, while judges in Norland often use earlier court cases.",
    explanation: "This makes Lumeria's system predictable, whereas Norland's system can be more flexible.",
    link: "Both countries aim for fairness, but they organise their legal systems differently."
  }),
  conclusion: "In conclusion, Lumeria and Norland share democratic values, but they organise society differently. Lumeria focuses on clear laws and separation between religion and the state, while Norland gives more importance to interpretation, tradition and gradual social change.",
  buildPrompt: "Write a PEEL paragraph comparing the role of religion in Lumeria and Norland.",
  starters: ["Religion has a different role in…", "For example,…", "This means that…", "Therefore,…"]
});
