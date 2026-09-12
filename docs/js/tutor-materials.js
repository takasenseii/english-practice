export const tutorMaterials = [
  {
    id: "rosa-parks-01",
    title: "Rosa Parks: More Than One Moment",
    topic: "Civil rights in the USA",
    levels: ["B1", "B2"],
    source: {
      label: "U.S. National Park Service: Rosa Parks",
      url: "https://www.nps.gov/people/rosa-parks.htm"
    },
    introduction:
      "Read the adapted text. The questions focus on vocabulary, comprehension, inference and extended writing.",
    text: [
      "Rosa Parks is often remembered for one act of protest. On 1 December 1955, she refused to give up her seat to a white passenger on a segregated bus in Montgomery, Alabama. She was arrested. Her arrest helped start the Montgomery Bus Boycott, in which around 17,000 Black citizens refused to use the city's buses.",
      "However, Parks's action was not simply a sudden decision by a tired passenger. She had worked for the local NAACP for many years. She helped young people become involved in civil-rights work and gathered information from people who had experienced racial violence and discrimination. She had also challenged bus segregation before 1955.",
      "The boycott lasted for more than a year. Because thousands of passengers stopped using and paying for the buses, the bus system faced declining revenues. This economic pressure, together with a Supreme Court decision, led to the desegregation of Montgomery's buses. Parks faced serious consequences: she lost her job, received death threats and eventually moved to Detroit. She nevertheless continued working for equality and helping other people.",
      "Her story shows how an individual action can become part of a much larger movement. It also demonstrates that famous moments of protest are often supported by years of preparation, organisation and collective action."
    ],
    activities: [
      {
        id: "vm1",
        type: "matching",
        category: "Vocabulary matching",
        level: "B1",
        prompt: "Match each word with the correct meaning.",
        hint: "Use the surrounding sentences in the text. Look for examples of separation, protest and organised action.",
        pairs: [
          { term: "segregation", definition: "the enforced separation of different racial groups" },
          { term: "equality", definition: "the state of having the same rights and opportunities" },
          { term: "boycott", definition: "an organised refusal to buy or use something" },
          { term: "resistance", definition: "opposition to a rule, system or force" },
          { term: "discrimination", definition: "unfair treatment based on a person's group or identity" },
          { term: "activist", definition: "a person who works to bring about political or social change" }
        ],
        explanation: "These six words are central to understanding both Rosa Parks's actions and the wider civil-rights movement."
      },
      {
        id: "v1",
        type: "multiple-choice",
        category: "Vocabulary",
        level: "B1",
        prompt: "What does segregated mean in the first paragraph?",
        options: [
          "Separated by race",
          "Owned by the government",
          "Free for all passengers",
          "Temporarily closed"
        ],
        answer: 0,
        hint: "Look at who was expected to give up the seat.",
        explanation: "Segregated means that people were separated and treated differently because of race."
      },
      {
        id: "v2",
        type: "multiple-choice",
        category: "Vocabulary",
        level: "B1",
        prompt: "Which phrase is closest in meaning to boycott?",
        options: [
          "A refusal to buy or use something as a protest",
          "A public election",
          "A violent argument",
          "A journey to another city"
        ],
        answer: 0,
        hint: "What did thousands of people refuse to use?",
        explanation: "A boycott is an organised refusal to buy or use something in order to create change."
      },
      {
        id: "c1",
        type: "multiple-choice",
        category: "Comprehension",
        level: "B1",
        prompt: "Which statement best describes Rosa Parks before December 1955?",
        options: [
          "She had already been involved in civil-rights work for years.",
          "She had never challenged segregation before.",
          "She worked for the Supreme Court.",
          "She organised the boycott alone."
        ],
        answer: 0,
        hint: "Re-read the second paragraph.",
        explanation: "Parks had worked for the NAACP, supported young people and documented discrimination before 1955."
      },
      {
        id: "c2",
        type: "multiple-choice",
        category: "Cause and effect",
        level: "B1",
        prompt: "Why did the bus system face declining revenues during the boycott?",
        options: [
          "Thousands of passengers stopped using and paying for the buses.",
          "It increased the price of buses.",
          "It stopped the Supreme Court from meeting.",
          "It made more people move to Detroit."
        ],
        answer: 0,
        hint: "Think about what happens when thousands of customers stop paying for a service.",
        explanation: "Thousands of passengers stopped using and paying for the buses, so the bus system received less money. Its revenues declined."
      },
      {
        id: "o1",
        type: "ordering",
        category: "Chronology",
        level: "B1",
        prompt: "Put the events in chronological order, from 1 (first) to 4 (last).",
        hint: "Parks's organised work began before the famous bus protest. The move to Detroit happened after the boycott.",
        items: [
          "Parks worked for the local NAACP.",
          "Parks refused to give up her bus seat and was arrested.",
          "The Montgomery Bus Boycott put pressure on the bus system.",
          "Parks and her family moved to Detroit."
        ],
        explanation: "Parks's earlier activism came first, followed by her arrest, the boycott and her family's move to Detroit."
      },
      {
        id: "tf1",
        type: "true-false",
        category: "True or false",
        level: "B1",
        prompt: "Decide whether each statement is true or false. Correct the false statements.",
        hint: "Check the number of participants, Parks's earlier activism and the consequences she faced.",
        statements: [
          {
            text: "Rosa Parks first became involved in civil-rights work after her arrest.",
            answer: false,
            correction: "Rosa Parks had been involved in civil-rights work for many years before her arrest."
          },
          {
            text: "Around 17,000 Black citizens participated in the Montgomery Bus Boycott.",
            answer: true
          },
          {
            text: "Parks experienced no serious personal consequences after the boycott.",
            answer: false,
            correction: "Parks lost her job, received death threats and eventually moved to Detroit."
          }
        ],
        explanation: "The text presents Parks as an experienced activist and also describes both collective participation and personal consequences."
      },
      {
        id: "s1",
        type: "short-answer",
        category: "Evidence",
        level: "B1",
        prompt: "Give two examples from the text showing that Parks was an activist before her arrest.",
        hint: "The examples are in the second paragraph.",
        checklist: [
          "I included two separate examples.",
          "Both examples come from the text.",
          "I answered in complete sentences."
        ],
        modelPoints: [
          "She worked for the local NAACP for many years.",
          "She involved young people in civil-rights work.",
          "She gathered information about racial violence and discrimination.",
          "She had challenged bus segregation before 1955."
        ]
      },
      {
        id: "s2",
        type: "short-answer",
        category: "Inference",
        level: "B2",
        prompt: "Why does the text challenge the idea that Parks's protest was only a spontaneous individual action? Use evidence.",
        hint: "Connect her earlier work with the organised boycott that followed.",
        checklist: [
          "I explained the word spontaneous in this context.",
          "I used at least two details from the text.",
          "I connected individual and collective action."
        ],
        modelPoints: [
          "Parks had a long history of organised activism before 1955.",
          "The boycott involved approximately 17,000 people.",
          "The event depended on preparation, organisation and collective action."
        ]
      },
      {
        id: "e1",
        type: "extended-answer",
        category: "Extended writing",
        level: "B1",
        prompt: "To what extent can the actions of one person create social change? Write 150–250 words and use Rosa Parks as evidence.",
        hint: "Consider both the importance of an individual action and the people or organisations needed to turn it into lasting change.",
        checklist: [
          "I stated a clear main idea.",
          "I used specific evidence from the text.",
          "I considered both individual and collective action.",
          "I organised my answer into paragraphs.",
          "I wrote 150–250 words."
        ],
        modelPoints: [
          "A visible individual action can inspire or focus public attention.",
          "Long-term change normally requires organisation and collective participation.",
          "Parks's action mattered, but it was connected to earlier activism, the boycott and a legal decision."
        ]
      }
    ]
  }
];
