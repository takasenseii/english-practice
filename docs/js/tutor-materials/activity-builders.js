export function vocabularyActivities(prefix, matchingSets, multipleChoice) {
  const matching = matchingSets.map((set, index) => ({
    id: `${prefix}-vocab-match-${index + 1}`,
    type: "matching",
    category: `Vocabulary matching ${index + 1} of 2`,
    level: "both",
    prompt: "Match each word or expression with the correct meaning.",
    hint: "Return to the material and use the surrounding sentence as a clue.",
    pairs: set,
    explanation: "Review the words in their original context before continuing."
  }));

  const choices = multipleChoice.map((question, index) => ({
    id: `${prefix}-vocab-choice-${index + 1}`,
    type: "multiple-choice",
    category: `Vocabulary multiple choice ${index + 1} of 8`,
    level: "both",
    ...question
  }));

  return [...matching, ...choices];
}

