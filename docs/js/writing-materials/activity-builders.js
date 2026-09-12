export function peelParagraph({ point, evidence, explanation, link }) {
  return [
    ["P", point],
    ["E", evidence],
    ["E", explanation],
    ["L", link]
  ];
}

export function essayMaterial(material) {
  return material;
}
