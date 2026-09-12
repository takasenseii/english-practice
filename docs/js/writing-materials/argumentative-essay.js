import { essayMaterial, peelParagraph } from "./activity-builders.js";

export default essayMaterial({
  id: "argumentative",
  label: "Argumentative essay",
  title: "The Best Exercise",
  prompt: "Argue whether walking is one of the best forms of exercise.",
  introduction: "People need exercise to stay healthy, but many activities can be inconvenient or expensive. Although walking may be difficult in certain weather, it is one of the best forms of exercise because it is easy and convenient.",
  paragraph: peelParagraph({
    point: "Walking is a particularly convenient form of exercise.",
    evidence: "For example, swimming requires a pool and weight training requires equipment, whereas walking can be done in many places without special preparation.",
    explanation: "This accessibility makes it easier for people to include regular exercise in their daily lives.",
    link: "Walking is therefore a practical choice for people who want a sustainable exercise routine."
  }),
  conclusion: "In conclusion, poor weather can sometimes make walking difficult, but walking remains easier and more convenient than many alternatives. It can also support both physical and mental health. For these reasons, people seeking regular exercise should consider making walking part of their routine.",
  buildPrompt: "Write a PEEL paragraph arguing for or against another form of exercise.",
  starters: ["One important reason is…", "For example,…", "This shows that…", "Therefore,…"],
  note: "Argumentative essays also address opposing views. The original model acknowledges bad weather as a counterargument and then responds that people can adapt and may benefit from being outdoors."
});
