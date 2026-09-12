import { essayMaterial, peelParagraph } from "./activity-builders.js";

export default essayMaterial({
  id: "argumentative",
  label: "Argumentative essay",
  title: "The Best Exercise",
  purpose: "An argumentative essay takes a clear position on a debatable issue. It supports that position with reasons and evidence, considers a credible opposing view and responds to it fairly.",
  traits: [
    "States a clear thesis or position on a debatable question",
    "Supports claims with relevant reasons and evidence",
    "Includes a counterargument paragraph presenting an opposing view",
    "Responds to the counterargument by conceding a valid point or explaining its limitations"
  ],
  prompt: "Argue whether walking is one of the best forms of exercise.",
  introduction: "People need exercise to stay healthy, but many activities can be inconvenient or expensive. Although walking may be difficult in certain weather, it is one of the best forms of exercise because it is easy and convenient.",
  paragraph: peelParagraph({
    point: "Walking is a particularly convenient form of exercise.",
    evidence: "For example, swimming requires a pool and weight training requires equipment, whereas walking can be done in many places without special preparation.",
    explanation: "This accessibility makes it easier for people to include regular exercise in their daily lives.",
    link: "Walking is therefore a practical choice for people who want a sustainable exercise routine."
  }),
  counterParagraph: peelParagraph({
    point: "Admittedly, walking is not always the most practical form of exercise.",
    evidence: "Bad weather, unsafe surroundings or limited mobility can make outdoor walking difficult for some people.",
    explanation: "These concerns are valid; however, indoor routes, walking aids and adapted distances can make the activity accessible in many situations.",
    link: "Although walking is not suitable in every circumstance, these limitations do not outweigh its general convenience."
  }),
  orderingExercises: [
    peelParagraph({
      point: "Walking is one of the most accessible ways to exercise regularly.",
      evidence: "It requires no membership or specialist equipment and can often be included in an ordinary journey.",
      explanation: "Removing financial and practical barriers makes it easier for more people to maintain the habit.",
      link: "Its accessibility therefore makes walking a strong choice for everyday exercise."
    }),
    peelParagraph({
      point: "Regular walking can also support mental well-being.",
      evidence: "A walk can provide a break from screens, work and other sources of stress.",
      explanation: "This change of pace may help people relax and return to their responsibilities with greater focus.",
      link: "Walking can consequently benefit the mind as well as the body."
    }),
    peelParagraph({
      point: "Some people argue that walking is too gentle to be worthwhile exercise.",
      evidence: "Compared with running or competitive sport, an ordinary walk usually raises the heart rate less.",
      explanation: "This criticism has some merit, but pace, distance and hills can increase the intensity, while a moderate activity is easier for many people to sustain.",
      link: "Walking may not be the most intense exercise, but its adaptability still makes it valuable."
    })
  ],
  conclusion: "In conclusion, poor weather can sometimes make walking difficult, but walking remains easier and more convenient than many alternatives. It can also support both physical and mental health. For these reasons, people seeking regular exercise should consider making walking part of their routine.",
  buildPrompt: "Write a PEEL paragraph arguing for or against another form of exercise.",
  starters: ["One important reason is…", "For example,…", "This shows that…", "Therefore,…"],
  note: "The counterargument paragraph presents a genuine limitation before responding to it. This makes the argument more balanced and credible."
});
