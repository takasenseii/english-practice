import { essayMaterial, peelParagraph } from "./activity-builders.js";

export default essayMaterial({
  id: "expository",
  label: "Expository essay",
  title: "Common Mistakes When Starting a New Business",
  purpose: "An expository essay explains or informs. It presents a topic logically and supports its explanation with relevant facts and examples, without trying primarily to persuade the reader to accept a disputed position.",
  traits: [
    "Uses a clear, focused thesis that previews what will be explained",
    "Organises information into logical categories, causes, effects or stages",
    "Supports explanations with relevant facts and examples",
    "Maintains an objective and informative tone"
  ],
  prompt: "Explain three common mistakes made when starting a business and how they can be avoided.",
  introduction: "Starting a new business can be both thrilling and daunting. Although many entrepreneurs aim for success, avoidable mistakes can create serious problems. This essay examines inadequate market analysis, ineffective financial planning and the failure to consider customer feedback.",
  paragraph: peelParagraph({
    point: "Ineffective financial planning is a frequent and potentially fatal mistake.",
    evidence: "For example, Webvan expanded rapidly and invested heavily in expensive warehouses before attracting enough customers.",
    explanation: "Its operating costs exceeded its income, showing how growth without realistic budgeting and sufficient demand can exhaust a company's funds.",
    link: "Careful budgeting and controlled expansion are therefore essential for keeping a new business viable."
  }),
  orderingExercises: [
    peelParagraph({
      point: "Insufficient market research can cause a new business to misunderstand its customers.",
      evidence: "For example, founders may develop a product before checking whether enough people need it or will pay for it.",
      explanation: "Without evidence of demand, the company risks spending time and money on an unsuitable offer.",
      link: "Thorough market research can therefore reduce costly assumptions."
    }),
    peelParagraph({
      point: "Poor cash-flow planning can threaten an otherwise promising company.",
      evidence: "A business may have future orders but still lack enough available money to pay wages, rent and suppliers.",
      explanation: "This gap between expected income and immediate expenses can interrupt daily operations.",
      link: "Monitoring when money enters and leaves the business is consequently essential."
    }),
    peelParagraph({
      point: "Ignoring customer feedback can prevent a product from improving.",
      evidence: "Repeated complaints may reveal that an app is difficult to navigate or lacks an important feature.",
      explanation: "Responding to such patterns helps a company adapt its product to genuine customer needs.",
      link: "Customer feedback should therefore be treated as useful evidence rather than unwanted criticism."
    })
  ],
  conclusion: "In summary, market research, responsible budgeting and attention to customer feedback can reduce avoidable business problems. Although no plan can remove every risk, informed decisions give a new company a stronger foundation for long-term success.",
  buildPrompt: "Write a PEEL paragraph explaining why customer feedback matters to a new business.",
  starters: ["One significant mistake is…", "For instance,…", "This demonstrates that…", "Consequently,…"]
});
