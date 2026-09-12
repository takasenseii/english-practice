import { essayMaterial, peelParagraph } from "./activity-builders.js";

export default essayMaterial({
  id: "expository",
  label: "Expository essay",
  title: "Common Mistakes When Starting a New Business",
  prompt: "Explain three common mistakes made when starting a business and how they can be avoided.",
  introduction: "Starting a new business can be both thrilling and daunting. Although many entrepreneurs aim for success, avoidable mistakes can create serious problems. This essay examines inadequate market analysis, ineffective financial planning and the failure to consider customer feedback.",
  paragraph: peelParagraph({
    point: "Ineffective financial planning is a frequent and potentially fatal mistake.",
    evidence: "For example, Webvan expanded rapidly and invested heavily in expensive warehouses before attracting enough customers.",
    explanation: "Its operating costs exceeded its income, showing how growth without realistic budgeting and sufficient demand can exhaust a company's funds.",
    link: "Careful budgeting and controlled expansion are therefore essential for keeping a new business viable."
  }),
  conclusion: "In summary, market research, responsible budgeting and attention to customer feedback can reduce avoidable business problems. Although no plan can remove every risk, informed decisions give a new company a stronger foundation for long-term success.",
  buildPrompt: "Write a PEEL paragraph explaining why customer feedback matters to a new business.",
  starters: ["One significant mistake is…", "For instance,…", "This demonstrates that…", "Consequently,…"]
});
