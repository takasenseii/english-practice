import { vocabularyActivities } from "./activity-builders.js";

const mc = (prompt, options, answer, hint, explanation) => ({ prompt, options, answer, hint, explanation });

const matchingSets = [
  [
    ["segregation", "the enforced separation of different racial groups"],
    ["equality", "the state of having the same rights and opportunities"],
    ["boycott", "an organised refusal to buy or use something"],
    ["resistance", "opposition to a rule, system or force"],
    ["discrimination", "unfair treatment based on a person's group or identity"],
    ["activist", "a person who works to bring about political or social change"]
  ],
  [
    ["declining revenues", "a decreasing amount of money received"],
    ["desegregation", "the ending of enforced racial separation"],
    ["collective action", "people working together to achieve a shared goal"],
    ["economic pressure", "financial influence used to encourage change"],
    ["death threat", "a statement that someone intends to kill another person"],
    ["Supreme Court", "the highest court in the United States"]
  ]
].map(set => set.map(([term, definition]) => ({ term, definition })));

const vocabularyChoices = [
  mc("What does refused mean in the first paragraph?", ["Said or showed that she would not do something", "Forgot that she had to do something", "Asked permission to do something", "Agreed to follow an instruction"], 0, "Consider Parks's response when she was told to give up her seat.", "To refuse means to say or show that you will not do something."),
  mc("Which phrase is closest in meaning to boycott?", ["A refusal to use a service as a protest", "A public election", "A violent argument", "A journey to another city"], 0, "What did thousands of people stop using?", "A boycott is an organised refusal to buy or use something in order to create change."),
  mc("What does segregated mean in the first paragraph?", ["Separated by race", "Owned by the government", "Free for all passengers", "Temporarily closed"], 0, "Look at who was expected to give up the seat.", "Segregated means separated and treated differently because of race."),
  mc("What does challenged mean in the second paragraph?", ["Acted against or questioned", "Explained in detail", "Accepted without protest", "Forgot completely"], 0, "Parks did not simply accept bus segregation.", "Here, challenged means that Parks acted against or questioned the system."),
  mc("Which phrase is closest in meaning to gathered information?", ["Collected facts", "Destroyed records", "Shared rumours", "Changed the rules"], 0, "Think about interviewing or recording people's experiences.", "To gather information means to collect facts or details."),
  mc("What does consequences mean in the third paragraph?", ["Results of an action, often serious or unpleasant", "Plans made before an action", "Opinions about an action", "Rules for joining an organisation"], 0, "The following examples include losing a job and receiving threats.", "Consequences are results or effects of an action."),
  mc("What does nevertheless show in the sentence about Parks continuing her work?", ["A contrast with the difficulties just mentioned", "A reason for leaving Montgomery", "A list of similar events", "Uncertainty about what happened"], 0, "She continued despite serious difficulties.", "Nevertheless introduces a contrast and means despite what has just been mentioned."),
  mc("Which phrase is closest in meaning to lasting change?", ["Change that continues for a long time", "Change that happens accidentally", "Change affecting one person only", "Change that is quickly reversed"], 0, "Focus on the word lasting.", "Lasting change continues and has effects over time.")
];

const rosaParks = {
  id: "rosa-parks-01",
  title: "Rosa Parks: More Than One Moment",
  topic: "Civil rights in the USA",
  levels: ["B1", "B2"],
  source: { label: "U.S. National Park Service: Rosa Parks", url: "https://www.nps.gov/people/rosa-parks.htm" },
  introduction: "Read the text once for its main idea. Then work through vocabulary, comprehension and written interpretation.",
  text: [
    "Rosa Parks is often remembered for one act of protest. On 1 December 1955, she refused to give up her seat to a white passenger on a segregated bus in Montgomery, Alabama. She was arrested. Her arrest helped start the Montgomery Bus Boycott, in which around 17,000 Black citizens refused to use the city's buses.",
    "However, Parks's action was not simply a sudden decision by a tired passenger. She had worked for the local NAACP for many years. She helped young people become involved in civil-rights work and gathered information from people who had experienced racial violence and discrimination. She had also challenged bus segregation before 1955.",
    "The boycott lasted for more than a year. Because thousands of passengers stopped using and paying for the buses, the bus system faced declining revenues. This economic pressure, together with a Supreme Court decision, led to the desegregation of Montgomery's buses. Parks faced serious consequences: she lost her job, received death threats and eventually moved to Detroit. She nevertheless continued working for equality and helping other people.",
    "Her story shows how an individual action can become part of a much larger movement. It also demonstrates that famous moments of protest are often supported by years of preparation, organisation and collective action."
  ],
  activities: [
    { id:"rosa-gist", type:"multiple-choice", category:"Main purpose", level:"both", ...mc("What is the main purpose of the text?", ["To explain Parks's protest in the context of her earlier activism and a wider movement", "To describe how bus services operated in Detroit", "To argue that court decisions never create change", "To give instructions for organising a boycott"], 0, "Choose the answer that covers all four paragraphs.", "The text connects Parks's famous action with earlier activism, collective protest and lasting change.") },
    ...vocabularyActivities("rosa", matchingSets, vocabularyChoices),
    { id:"rosa-comp-1", type:"multiple-choice", category:"Detailed comprehension", level:"both", ...mc("What directly followed Parks's refusal to give up her seat?", ["She was arrested.", "She moved to Detroit.", "The Supreme Court met.", "She received an award."], 0, "Return to the first paragraph.", "Parks was arrested after refusing to give up her seat.") },
    { id:"rosa-comp-2", type:"multiple-choice", category:"Detailed comprehension", level:"both", ...mc("Which activity was part of Parks's earlier civil-rights work?", ["Gathering information about discrimination and racial violence", "Working as a Supreme Court judge", "Owning the Montgomery bus system", "Running for political office"], 0, "Look at the second paragraph.", "Parks gathered accounts from people affected by discrimination and racial violence.") },
    { id:"rosa-comp-3", type:"multiple-choice", category:"Detailed comprehension", level:"both", ...mc("Why did the bus system face declining revenues?", ["Thousands of passengers stopped using and paying for the buses.", "The city increased ticket prices.", "The Supreme Court stopped operating.", "Bus drivers moved to Detroit."], 0, "Think about what a boycott removes from a business.", "The boycott reduced the money received from passengers.") },
    { id:"rosa-comp-4", type:"multiple-choice", category:"Detailed comprehension", level:"both", ...mc("Which was a personal consequence for Parks?", ["She lost her job and received death threats.", "She became the owner of the buses.", "She stopped supporting equality.", "She became a Supreme Court judge."], 0, "Look near the end of the third paragraph.", "Parks lost her job, received threats and later moved to Detroit.") },
    { id:"rosa-order", type:"ordering", category:"Chronology", level:"both", prompt:"Put the events in chronological order, from 1 (first) to 4 (last).", hint:"Her NAACP work began before the bus protest.", items:["Parks worked for the local NAACP.","Parks refused to give up her seat and was arrested.","The boycott placed pressure on the bus system.","Parks and her family moved to Detroit."], explanation:"Earlier activism came first, followed by the arrest, boycott and move." },
    { id:"rosa-tf", type:"true-false", category:"Fact checking", level:"both", prompt:"Decide whether each statement is true or false. Correct the false statements.", hint:"Check the size of the boycott and Parks's earlier experience.", statements:[{text:"Parks first became an activist after her arrest.",answer:false,correction:"Parks had worked for civil rights for years before her arrest."},{text:"Around 17,000 Black citizens participated in the boycott.",answer:true},{text:"Parks experienced no serious personal consequences.",answer:false,correction:"Parks lost her job, received death threats and moved to Detroit."}], explanation:"The text presents experienced activism, collective participation and serious consequences." },
    { id:"rosa-short-b1", type:"short-answer", category:"Written evidence", level:"B1", prompt:"Give two examples showing that Parks was an activist before her arrest. Write 50–100 words.", hint:"Use the second paragraph.", checklist:["I included two examples.","Both examples come from the text.","I wrote 50–100 words."], modelPoints:["NAACP work","Work involving young people","Gathering information about discrimination","Earlier challenges to segregation"] },
    { id:"rosa-short-b2", type:"short-answer", category:"Interpretation", level:"B2", prompt:"How does the text challenge the simplified story of one spontaneous protest? Write 100–150 words and use evidence.", hint:"Connect earlier activism, the boycott and the court decision.", checklist:["I presented an interpretation.","I used at least three details.","I explained individual and collective action.","I wrote 100–150 words."], modelPoints:["Long-term activism before 1955","Participation by 17,000 citizens","Economic pressure and legal action","The relationship between an individual symbol and organised action"] },
    { id:"rosa-final-b1", type:"extended-answer", category:"Final response", level:"B1", prompt:"Can one person's actions create social change? Use Rosa Parks as evidence. Write 50–150 words.", hint:"Mention both Parks and the people who joined the boycott.", checklist:["I answered clearly.","I used evidence.","I considered individual and collective action.","I wrote 50–150 words."], modelPoints:["An action can attract attention","Collective action helps create pressure","Organisations and courts can contribute to change"] },
    { id:"rosa-final-b2", type:"extended-answer", category:"Final response", level:"B2", prompt:"To what extent can one person's actions create lasting social change? Evaluate the role of Rosa Parks alongside collective and legal action. Write 100–200 words.", hint:"A balanced response can recognise both symbolic leadership and organised support.", checklist:["I stated a nuanced position.","I evaluated different causes.","I used precise evidence.","I wrote 100–200 words."], modelPoints:["Symbolic individual action","Years of preparation","Mass participation","Economic and legal pressure"] }
  ]
};

export default rosaParks;

