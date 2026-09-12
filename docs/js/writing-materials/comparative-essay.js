import { essayMaterial, peelParagraph } from "./activity-builders.js";

export default essayMaterial({
  id: "comparative",
  label: "Comparative essay",
  title: "Lumeria and Norland",
  purpose: "A comparative essay examines meaningful similarities and differences between two subjects. It uses the same points of comparison for both subjects instead of describing each one separately.",
  traits: [
    "Uses clear points of comparison that apply to both subjects",
    "Discusses similarities as well as differences",
    "Uses comparative linking words such as similarly, whereas and in contrast",
    "Explains the significance of each comparison rather than merely listing facts"
  ],
  prompt: "Compare the legal systems, religion and gender equality of Lumeria and Norland.",
  introduction: "Lumeria and Norland are two modern countries with different systems in society and politics. Both are democracies and respect human rights. However, they differ in their legal systems, religion and gender equality. This essay compares these three areas.",
  paragraph: peelParagraph({
    point: "The legal systems in Lumeria and Norland work in different ways.",
    evidence: "In Lumeria, judges follow clear written rules, while judges in Norland often use earlier court cases.",
    explanation: "This makes Lumeria's system predictable, whereas Norland's system can be more flexible.",
    link: "Both countries aim for fairness, but they organise their legal systems differently."
  }),
  orderingExercises: [
    peelParagraph({
      point: "Religion has a different public role in the two countries.",
      evidence: "Lumeria separates religion from government, whereas Norland allows religious traditions to influence some public ceremonies.",
      explanation: "Consequently, religion is more visible in Norland's public institutions than in Lumeria's.",
      link: "The countries therefore differ in how closely they connect religion and the state."
    }),
    peelParagraph({
      point: "Both countries have improved gender equality, but they have progressed at different rates.",
      evidence: "Lumeria introduced equal-pay legislation earlier, while Norland adopted similar reforms more gradually.",
      explanation: "This suggests that the two countries share a goal but have used different timelines to pursue it.",
      link: "Their approaches to gender equality are thus similar in direction but different in pace."
    }),
    peelParagraph({
      point: "The countries also differ in the way judges make legal decisions.",
      evidence: "Judges in Lumeria rely mainly on written codes, whereas Norland's judges frequently consult earlier cases.",
      explanation: "Written codes can make decisions more predictable, while precedents allow greater interpretation.",
      link: "Each legal system therefore balances consistency and flexibility differently."
    })
  ],
  conclusion: "In conclusion, Lumeria and Norland share democratic values, but they organise society differently. Lumeria focuses on clear laws and separation between religion and the state, while Norland gives more importance to interpretation, tradition and gradual social change.",
  buildPrompt: "Write a PEEL paragraph comparing the role of religion in Lumeria and Norland.",
  starters: ["Religion has a different role in…", "For example,…", "This means that…", "Therefore,…"]
});
