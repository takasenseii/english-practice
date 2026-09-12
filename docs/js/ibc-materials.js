// Each introduction uses four teaching moves; a move can contain more than one sentence.
export const introductionModels = {
  comparative: {
    beginner: ["Countries can be similar and different.", "Lumeria and Norland are two countries with different ways of organising society.", "They have some things in common, but they are not the same.", "This essay compares their laws, religion and gender equality."],
    intermediate: ["Countries may share values while organising society in different ways.", "Lumeria and Norland are both democracies, but their institutions have developed differently.", "Although both aim for fairness, they differ in important areas.", "This essay compares their legal systems, the role of religion and progress towards gender equality."],
    advanced: ["Shared democratic ideals do not necessarily produce identical societies.", "Lumeria and Norland illustrate how two countries can pursue similar goals through different institutions and traditions.", "Their differences reveal the tension between legal consistency, public tradition and social reform.", "By comparing their legal systems, the place of religion and approaches to gender equality, this essay examines what these choices mean for each society."]
  },
  expository: {
    beginner: ["Starting a business is exciting, but it can be difficult.", "New owners often have to make decisions with limited time and money.", "Some common mistakes can create serious problems.", "This essay explains mistakes in market research, budgeting and listening to customers."],
    intermediate: ["A promising business idea is not enough to guarantee success.", "New companies must understand their customers, manage their money and respond to problems.", "Mistakes in these areas can weaken even a good product.", "This essay explains how poor market research, weak financial planning and ignored feedback can harm a new business."],
    advanced: ["The failure of a new business rarely results from a single dramatic error.", "More often, founders make a series of avoidable decisions as they test demand, allocate resources and develop their products.", "Examining these decisions helps explain why an initially promising venture may struggle.", "This essay explores inadequate market analysis, unsustainable financial planning and a failure to act on customer feedback."]
  },
  argumentative: {
    beginner: ["Many people want to exercise more.", "There are many ways to stay active, but some cost money or need special equipment.", "Walking is a good choice for many people.", "This essay argues that walking is useful because it is easy to do and can help people feel better."],
    intermediate: ["Regular exercise matters, but choosing an activity that fits daily life can be difficult.", "Some sports require equipment, facilities or a fixed schedule.", "Despite certain limitations, walking is one of the most practical forms of exercise.", "Its accessibility and potential mental benefits make it an activity worth considering."],
    advanced: ["The most effective exercise is not necessarily the most demanding; it may be the one people can sustain.", "Unlike activities that require facilities or expensive equipment, walking can often be built into ordinary routines.", "Although weather and individual mobility may limit its suitability, walking remains a strong option for many people.", "Its accessibility and potential contribution to mental well-being make a persuasive case for its place in a balanced exercise routine."]
  }
};

// Three moves per conclusion: restate direction, synthesise body points, final thought.
export const essayPlans = {
  comparative: {
    body: ["Legal systems: written codes in Lumeria and earlier cases in Norland", "Religion: separate from government in Lumeria and more visible in Norland's public traditions", "Gender equality: progress in both countries, but at different rates"],
    counter: null,
    conclusions: {
      beginner: ["Lumeria and Norland have some things in common, but they are also different.", "They organise laws and religion differently, and they have made progress towards gender equality at different speeds.", "Comparing both countries helps us understand different ways to organise a society."],
      intermediate: ["Overall, Lumeria and Norland share democratic values but differ in how they put them into practice.", "Their legal systems, the public role of religion and the pace of gender-equality reforms show these differences.", "These comparisons suggest that shared goals can lead to different approaches."],
      advanced: ["Ultimately, shared democratic ideals do not erase the institutional differences between Lumeria and Norland.", "Their approaches to legal decisions, public tradition and gender reform reveal distinct balances between consistency, continuity and change.", "The comparison shows that societies can pursue similar principles through markedly different arrangements."]
    }
  },
  expository: {
    body: ["Market research: check whether customers need the product", "Financial planning: track costs, income and cash flow", "Customer feedback: use repeated comments to improve the offer"],
    counter: null,
    conclusions: {
      beginner: ["Starting a business is difficult, but some mistakes can be avoided.", "Owners should study their market, plan their money and listen to customers.", "These steps can help a new company make better decisions."],
      intermediate: ["In summary, several common mistakes can weaken a new business before it finds its footing.", "Market research, careful budgeting and attention to customer feedback help founders reduce avoidable risks.", "No method guarantees success, but informed decisions provide a stronger starting point."],
      advanced: ["The challenges facing a new venture are varied, yet many early setbacks follow recognisable patterns.", "Inadequate analysis of demand, unsustainable financial decisions and neglected customer feedback each limit a company's ability to adapt.", "Recognising these risks does not eliminate uncertainty, but it allows founders to respond more deliberately."]
    }
  },
  argumentative: {
    body: ["Accessibility: walking needs little equipment or planning", "Mental well-being: walking can provide a useful break", "Counterargument and response: weather or mobility can limit walking; adapt when possible and recognise that it will not suit everyone"],
    counter: "The last body paragraph should present a credible objection and respond to it fairly, without pretending the objection does not matter.",
    conclusions: {
      beginner: ["Walking is a good way for many people to exercise.", "It is easy to include in daily life and can help people feel better, although it is not suitable for everyone.", "For these reasons, many people should consider walking regularly."],
      intermediate: ["Walking remains a practical exercise choice despite its limitations.", "Its accessibility and possible mental benefits outweigh problems such as bad weather for many people, though individual needs vary.", "It is therefore worth considering as part of a sustainable routine."],
      advanced: ["Walking may not answer every person's exercise needs, but its strengths make it difficult to dismiss.", "Ease of access and potential mental benefits provide substantial advantages, while weather and mobility concerns warrant realistic adaptations rather than blanket claims.", "A persuasive case for walking rests not on calling it universally best, but on recognising how well it fits many everyday lives."]
    }
  }
};

// Short body examples show increasing precision while preserving the same essay plan.
export const bodyModels = {
  comparative: {
    beginner: ["The countries have different laws. Lumeria uses written rules, but Norland also looks at earlier cases. Both try to be fair.","Religion plays different roles. Lumeria keeps it separate from government, while Norland includes some religious traditions in public ceremonies.","Both countries want equality. Lumeria changed its equal-pay rules earlier; Norland made changes more slowly."],
    intermediate: ["The legal systems differ in how judges reach decisions: Lumeria uses written codes, whereas Norland often considers earlier cases. This can make one system more predictable and the other more flexible.","Religion is less visible in Lumeria's public institutions than in Norland's ceremonies. Their different arrangements show how democratic states can treat tradition differently.","Both countries have improved gender equality, but Lumeria introduced equal-pay legislation earlier than Norland. The shared aim has therefore developed at a different pace."],
    advanced: ["Lumeria's reliance on written codes contrasts with Norland's greater use of precedent. The former can support consistency, whereas the latter permits interpretation; neither feature alone guarantees fairness.","The separation of religion from Lumeria's government differs from Norland's continued use of religious traditions in public ceremonies. The contrast concerns public visibility rather than a simple presence or absence of belief.","Although both countries have pursued gender-equality reforms, their timelines have differed. Lumeria's earlier equal-pay legislation and Norland's more gradual changes illustrate how similar goals can produce different paths."]
  },
  expository: {
    beginner: ["A business should check what customers want. If nobody needs a product, the company may lose money.","A new company needs a budget. It must pay for rent, wages and supplies, even before it makes enough sales.","Customers can tell a business what is wrong. Their comments can help it improve a product."],
    intermediate: ["Insufficient market research can lead founders to create products without checking demand. Testing the idea with potential customers can reduce this risk.","Poor financial planning can leave a business unable to cover immediate expenses. Comparing expected income with wages, rent and supplier costs helps owners manage cash flow.","Repeated customer complaints may reveal that a product is hard to use. Analysing that feedback helps a company identify changes worth making."],
    advanced: ["Market research tests assumptions about demand before substantial resources are committed. Without it, a promising concept can develop into a product for which few customers will pay.","Financial planning must address not only eventual profitability but also the timing of payments. A company can hold future orders yet lack the cash needed for wages, rent or suppliers today.","Customer feedback is especially useful when recurring comments reveal a pattern rather than a single preference. Responding to that pattern allows founders to adjust an offer to demonstrated needs."]
  },
  argumentative: {
    beginner: ["Walking is easy for many people. It does not need special equipment, so it can be part of daily life.","A walk can also help someone take a break. Being away from work or screens may help people relax.","Some people cannot walk outside easily because of bad weather or mobility needs. Walking is therefore not best for everyone, but indoor walks or shorter routes can help some people."],
    intermediate: ["Walking requires little equipment or preparation, unlike many organised sports. These fewer barriers can make it easier to exercise regularly.","Walking may also support mental well-being by providing a break from daily pressures. A manageable activity can be easier to repeat than a demanding routine.","Critics rightly note that weather and mobility can restrict walking. Indoor routes and adapted distances help in some cases, but alternatives remain necessary for others."],
    advanced: ["Because walking often fits existing journeys and demands little specialised equipment, it lowers practical barriers to regular activity. Its strength lies partly in how consistently people can maintain it.","The potential psychological value of walking extends beyond physical movement: a break from routine can offer time to decompress. Such benefits are not guaranteed, but they strengthen the case for an accessible habit.","Walking cannot be presented as universally suitable: unsafe conditions and mobility restrictions are serious objections. Adaptations may address some barriers, while recognising that other forms of exercise will serve some individuals better."]
  }
};
