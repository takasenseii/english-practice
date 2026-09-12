import oralIbc from "./speaking-materials/oral-ibc.js";

export const speakingMaterials = [oralIbc];
export const speakingMaterialsById = Object.fromEntries(
  speakingMaterials.map((material) => [material.id, material])
);
