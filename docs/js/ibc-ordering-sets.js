import { introductionModels, essayPlans, bodyModels } from "./ibc-materials.js";

// Each set consists of cards in their correct order; the activity changes the displayed order.
// Set 1 revisits the displayed model; sets 2–3 practise fresh examples at the chosen level.
const alternatives = {
  comparative: {
    beginner: {
      intro: [
        ["People can live in different ways.","Lumeria and Norland both have governments and courts.","The two countries solve some problems differently.","This essay looks at their laws, religion and equality."],
        ["Countries sometimes share goals.","Lumeria and Norland both want to be fair to their citizens.","They do not always use the same methods.","I will compare their courts, public traditions and progress on equality."]
      ],
      ending: [
        ["Lumeria and Norland are alike in some ways but not all.","Their laws, religious traditions and equality reforms are different.","We can learn about societies by comparing how they work."],
        ["Both countries want a fair society, but they take different paths.","Their courts, public traditions and changes towards equality show this.","The comparison helps explain why shared goals do not always mean shared methods."]
      ]
    },
    intermediate: {
      intro: [
        ["Similar values do not always produce similar institutions.","Lumeria and Norland are democracies with different approaches to public life.","Their shared goals are reflected in contrasting systems.","This essay considers courts, religion and gender-equality reforms."],
        ["Two societies can address the same questions differently.","Both Lumeria and Norland must decide how law and tradition fit into public life.","Their answers reveal important contrasts despite their democratic aims.","The comparison focuses on legal decisions, religious traditions and equality reforms."]
      ],
      ending: [
        ["The two countries pursue similar ideals through different arrangements.","Their courts, public traditions and equality reforms show where these approaches diverge.","Comparing them reveals that fairness can be pursued in more than one way."],
        ["Lumeria and Norland share aims without sharing every policy.","Legal rules, the public place of religion and the pace of reform distinguish them.","Understanding these differences offers a more careful picture of both societies."]
      ]
    },
    advanced: {
      intro: [
        ["A commitment to democracy leaves room for contrasting institutions.","Lumeria and Norland embody distinct responses to questions of law, tradition and social change.","Their differences complicate any assumption that shared values require identical policies.","This essay compares legal practice, the public role of religion and the development of gender equality."],
        ["Comparison can illuminate choices that otherwise appear inevitable.","The political arrangements of Lumeria and Norland expose different balances between consistency and adaptation.","Their contrasting approaches reflect institutional priorities rather than a simple divide between right and wrong.","The discussion examines courts, public tradition and gender-equality reform."],
      ],
      ending: [
        ["Democratic aims coexist with markedly different institutional choices in the two countries.","Contrasts in law, public tradition and gender reform reveal how these choices shape social change.","The comparison underscores the value of examining implementation as well as ideals."],
        ["The shared principles of Lumeria and Norland do not make their systems interchangeable.","Their legal practices, religious traditions and reform timelines embody distinctive priorities.","Attending to these differences produces a more nuanced account of how societies pursue equality."],
      ]
    }
  },
  expository: {
    beginner: {
      intro: [
        ["A new business needs more than an idea.","Owners must learn about buyers and their costs.","Small mistakes can make it difficult to succeed.","This essay explains problems with research, money and feedback."],
        ["Many people dream of opening a business.","To start one, they need customers and enough money.","Some common errors can put their plans at risk.","I will explain market research, budgeting and customer comments."]
      ],
      ending: [
        ["Business owners can avoid some common errors.","Researching customers, planning costs and listening to feedback all help.","Good preparation gives a new business a better chance."],
        ["Starting a company brings challenges.","Market research, a budget and customer comments can guide decisions.","Learning from these areas is useful when plans change."]
      ]
    },
    intermediate: {
      intro: [
        ["Launching a business involves more than developing a product.","Founders must find customers and manage limited resources.","Overlooking these responsibilities can create avoidable difficulties.","This essay explains research, financial planning and the use of feedback."],
        ["Early decisions can shape a company's prospects.","Demand, available funds and customer experiences are closely connected.","Ignoring any of these areas may weaken a promising idea.","The discussion covers market analysis, budgeting and customer responses."],
      ],
      ending: [
        ["Many early business problems result from decisions that can be improved.","Research, financial planning and customer feedback each provide information that founders need.","Using that information helps a company adapt more effectively."],
        ["A good idea needs practical support to become a viable business.","Understanding demand, controlling expenses and responding to users reduce common risks.","None guarantees success, but together they improve decision-making."],
      ]
    },
    advanced: {
      intro: [
        ["Entrepreneurial ambition does not remove the need for evidence.","A new venture must test demand while allocating scarce resources and refining its offer.","Neglect in any of these areas can magnify uncertainty and cost.","This essay examines market validation, financial discipline and systematic customer feedback."],
        ["An innovative concept can still fail through ordinary operational errors.","The early stages of a venture require careful judgments about customers, expenditure and product development.","Weak information in one area can undermine progress in another.","The discussion addresses insufficient market analysis, fragile cash-flow planning and ignored feedback."],
      ],
      ending: [
        ["Common startup errors often arise from inadequate information or unrealistic assumptions.","Demand testing, financial discipline and feedback analysis reduce the uncertainty surrounding key decisions.","Although risk remains unavoidable, these practices support a more adaptable venture."],
        ["Early business setbacks seldom have a single cause.","Weak demand analysis, poorly timed expenses and neglected customer signals can reinforce one another.","Treating these issues as connected decisions encourages more resilient planning."],
      ]
    }
  },
  argumentative: {
    beginner: {
      intro: [
        ["Exercise is important to many people.","Not everyone has time or money for sports clubs.","Walking is a useful way for many people to move more.","It is easy to start and may help people relax."],
        ["People can choose many kinds of exercise.","Some activities need equipment or special places.","Walking is one of the easiest choices for many people.","This essay looks at convenience and mental well-being."],
      ],
      ending: [
        ["Walking is a useful kind of exercise for many people.","It is easy to do and may help people relax, even if it does not suit everyone.","People should consider whether it fits their own lives."],
        ["There are good reasons to choose walking.","It costs little and can offer a break, although some people need other options.","The best routine is one a person can keep doing."],
      ]
    },
    intermediate: {
      intro: [
        ["The best exercise is often one a person can do regularly.","Many organised activities demand time, money or equipment.","Walking is a strong option for many people, despite some limitations.","Its convenience and potential mental benefits support this argument."],
        ["An exercise routine must fit into everyday life.","Cost and access can prevent people from joining some activities.","For many individuals, walking offers a realistic alternative.","This essay considers accessibility, well-being and objections to walking."],
      ],
      ending: [
        ["Walking offers a practical option for many people seeking regular exercise.","Its convenience and possible mental benefits are valuable, though weather and mobility can limit access.","A realistic exercise plan should account for those individual needs."],
        ["The case for walking rests partly on its ability to fit ordinary routines.","Easy access and a break from daily pressures may outweigh its limitations for many people.","It deserves consideration without being presented as a universal solution."],
      ]
    },
    advanced: {
      intro: [
        ["An exercise programme is useful only if it remains sustainable.","Facilities, expense and scheduling can hinder participation in more structured activities.","For many people, walking offers a persuasive alternative without claiming to meet every need.","Its accessibility, potential psychological value and limitations will be considered."],
        ["Intensity alone is a poor measure of an exercise habit's value.","An accessible activity may be easier to maintain than a demanding but impractical routine.","Walking deserves a central place in many people's plans, subject to individual circumstances.","The argument weighs its convenience and mental benefits against credible objections."],
      ],
      ending: [
        ["Walking remains a compelling exercise choice without being universally suitable.","Accessibility and potential mental benefits strengthen its case, while weather and mobility impose real limits.","A balanced judgment therefore considers both the activity's strengths and the individual's circumstances."],
        ["The merits of walking lie as much in sustainability as in physical effort.","Practical access and possible psychological benefits favour it, although genuine barriers require alternatives.","Recognising those barriers makes the argument for walking more credible rather than less."],
      ]
    }
  }
};

export function getOrderingSets(essay, level) {
  const plan = essayPlans[essay];
  const extra = alternatives[essay][level];
  return {
    intro: [introductionModels[essay][level], ...extra.intro],
    body: [plan.body, bodyModels[essay][level], bodyModels[essay][level].map((paragraph, i) =>
      `${plan.body[i].split(":")[0]}: ${paragraph.split(". ")[0]}.`)],
    conclusion: [plan.conclusions[level], ...extra.ending]
  };
}
