import comparativeEssay from "./writing-materials/comparative-essay.js";
import expositoryEssay from "./writing-materials/expository-essay.js";
import argumentativeEssay from "./writing-materials/argumentative-essay.js";

export const writingMaterials = [
  comparativeEssay,
  expositoryEssay,
  argumentativeEssay
];

export const writingMaterialsById = Object.fromEntries(
  writingMaterials.map((material) => [material.id, material])
);
