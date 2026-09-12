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
  },
  {
    id: "entrepreneur-video-01",
    title: "What Is an Entrepreneur?",
    topic: "Entrepreneurship and personal qualities",
    levels: ["B1", "B2"],
    mediaType: "youtube",
    videoId: "rRpMrAMesbA",
    source: {
      label: "GCFGlobal: What Is an Entrepreneur?",
      url: "https://www.youtube.com/watch?v=rRpMrAMesbA"
    },
    introduction:
      "Watch the video once without opening the transcript. Focus on the main idea. Then watch it again and listen for details.",
    transcriptLabel: "Transcript support",
    text: [
      "What exactly is an entrepreneur? An entrepreneur is a person with an idea for a product or service. They decide to start a business which brings this idea to life.",
      "Maybe they have always dreamed of opening their own boutique, or maybe they want to create an app which millions of people will use. The dream of an entrepreneur can be big or small, but most successful entrepreneurs share a number of characteristics. They are passionate, motivated, independent and creative.",
      "Entrepreneurs love thinking outside the box. They are always looking to expand their knowledge, break out of their comfort zone and find new opportunities in the marketplace. They do not just accept things as they are.",
      "They also believe that their ideas have value and that they have something special to bring to the table. So, what do you think? Could you be an entrepreneur?"
    ],
    activities: [
      {
        id: "ent-gist-1",
        type: "multiple-choice",
        category: "First viewing: main idea",
        level: "B1",
        prompt: "What is the main purpose of the video?",
        options: [
          "To explain what entrepreneurs do and describe common qualities they have",
          "To teach viewers how to design a mobile app",
          "To compare large companies with small boutiques",
          "To warn viewers about the financial risks of business"
        ],
        answer: 0,
        hint: "Think about what information appears throughout the whole video.",
        explanation: "The video defines an entrepreneur and describes characteristics often shared by successful entrepreneurs."
      },
      {
        id: "ent-vocab-1",
        type: "matching",
        category: "Vocabulary in context",
        level: "B1",
        prompt: "Match each expression from the video with its meaning.",
        hint: "Think about how each expression is used in the transcript, not only its literal meaning.",
        pairs: [
          { term: "bring an idea to life", definition: "turn an idea into something real" },
          { term: "boutique", definition: "a small shop, especially one selling fashionable goods" },
          { term: "think outside the box", definition: "develop ideas in an original or unusual way" },
          { term: "comfort zone", definition: "a familiar situation in which someone feels safe" },
          { term: "marketplace", definition: "the commercial environment in which things are bought and sold" },
          { term: "bring something to the table", definition: "offer a useful quality, skill or idea" }
        ],
        explanation: "Several expressions in the video are figurative and describe creativity, confidence and business activity."
      },
      {
        id: "ent-detail-1",
        type: "multiple-choice",
        category: "Listening for detail",
        level: "B1",
        prompt: "Which four characteristics does the video explicitly mention?",
        options: [
          "Passionate, motivated, independent and creative",
          "Patient, wealthy, competitive and careful",
          "Experienced, educated, organised and famous",
          "Confident, sociable, practical and generous"
        ],
        answer: 0,
        hint: "Listen again to the section after the examples of a boutique and an app.",
        explanation: "The speaker describes successful entrepreneurs as passionate, motivated, independent and creative."
      },
      {
        id: "ent-tf-1",
        type: "true-false",
        category: "True or false",
        level: "B1",
        prompt: "Decide whether each statement agrees with the video. Correct the false statements.",
        hint: "Pay attention to whether the speaker limits entrepreneurship to technology or large ambitions.",
        statements: [
          {
            text: "An entrepreneur must create a product rather than a service.",
            answer: false,
            correction: "An entrepreneur can have an idea for either a product or a service."
          },
          {
            text: "An entrepreneur's dream can be big or small.",
            answer: true
          },
          {
            text: "Entrepreneurs simply accept things as they are.",
            answer: false,
            correction: "Entrepreneurs do not simply accept things as they are; they look for knowledge and new opportunities."
          }
        ],
        explanation: "The video gives a broad definition of entrepreneurship and emphasises active efforts to find or create opportunities."
      },
      {
        id: "ent-short-1",
        type: "short-answer",
        category: "Evidence",
        level: "B1",
        prompt: "Give three actions from the video that show entrepreneurs are willing to develop and challenge themselves.",
        hint: "Listen to the section beginning with ‘They are always looking to…’",
        checklist: [
          "I included three different actions.",
          "My examples come directly from the video.",
          "I answered in complete sentences."
        ],
        modelPoints: [
          "They expand their knowledge.",
          "They break out of their comfort zone.",
          "They look for new opportunities in the marketplace.",
          "They think outside the box rather than simply accepting things as they are."
        ]
      },
      {
        id: "ent-interpret-1",
        type: "short-answer",
        category: "Interpretation",
        level: "B2",
        prompt: "Does the video present entrepreneurship mainly as a profession or as a mindset? Explain your interpretation using details from the video.",
        hint: "Compare the definition at the beginning with the personal qualities described later.",
        checklist: [
          "I gave a clear interpretation.",
          "I supported it with at least two details.",
          "I considered both business activity and personal qualities."
        ],
        modelPoints: [
          "The opening definition connects entrepreneurship to starting a business.",
          "Much of the video focuses on a mindset: creativity, motivation, independence and willingness to leave one's comfort zone.",
          "A strong answer may argue that the video presents it as both a profession and a mindset."
        ]
      },
      {
        id: "ent-extended-1",
        type: "extended-answer",
        category: "Personal response",
        level: "B1",
        prompt: "Could you be an entrepreneur? Write 120–180 words. Refer to at least three characteristics or actions from the video and give concrete examples from your own experience or ideas.",
        hint: "You do not have to answer yes. Explain which qualities fit you and which might be challenging.",
        checklist: [
          "I answered the main question clearly.",
          "I referred to at least three ideas from the video.",
          "I included concrete personal examples.",
          "I organised my answer into paragraphs.",
          "I wrote 120–180 words."
        ],
        modelPoints: [
          "Connect personal qualities to the characteristics in the video.",
          "Support claims with examples rather than only listing adjectives.",
          "Recognise strengths as well as areas for development."
        ]
      }
    ]
  }
];
