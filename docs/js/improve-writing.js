import { indexedOptions } from './mcq-review.js';
const KEY="epso_improve_writing_v1";
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);}
function read(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return {};}}

const tasks=[
  {
    "title": "Choose useful evidence",
    "example": "Walking is the best exercise because it is good.",
    "question": "Which addition gives a specific example rather than simply repeating the claim?",
    "options": [
      "Walking can improve wellbeing in several different ways.",
      "For example, someone can walk part of the way to school without buying equipment.",
      "Walking is suitable because many people consider it useful.",
      "Walking should be preferred because it is a better exercise."
    ],
    "correct": 1,
    "reason": "A concrete situation helps the reader see how walking fits daily life. An example is not automatically proof that walking is best for everyone."
  },
  {
    "title": "Make a statistic meaningful",
    "example": "A survey found that 60% of respondents preferred walking.",
    "question": "What should the writer do before using this figure as evidence?",
    "options": [
      "Use the percentage to describe all students without checking who responded.",
      "Check who was surveyed, when and how; explain what the result can and cannot show.",
      "Use the preference figure as evidence that walking improves physical health.",
      "Describe the figure as typical because more than half agreed."
    ],
    "correct": 1,
    "reason": "A statistic needs a trustworthy source, context and a clear connection to the point. A preference survey cannot establish that walking is best for all people."
  },
  {
    "title": "Fix a run-on sentence",
    "example": "Walking costs little it can be part of a daily journey.",
    "question": "Which revision correctly joins these two ideas as related points without making one the cause of the other?",
    "options": [
      "Walking costs little, it can be part of a daily journey.",
      "Walking costs little, and it can be part of a daily journey.",
      "Walking costs little it can be part of a daily journey.",
      "Walking costs little, because it can be part of a daily journey."
    ],
    "correct": 1,
    "reason": "Two complete clauses need correct punctuation and a coordinating conjunction, a semicolon or a full stop; a comma alone is not enough."
  },
  {
    "title": "Choose a logical transition",
    "example": "Walking is inexpensive. ___, bad weather can make it difficult for some people.",
    "question": "Which word signals the contrast?",
    "options": [
      "However",
      "Therefore",
      "Similarly",
      "For example"
    ],
    "correct": 0,
    "reason": "However introduces a genuine contrast. Use a transition only when it expresses the actual relationship between the ideas."
  },
  {
    "title": "Explain the evidence",
    "example": "Some businesses read customer reviews. Customer feedback is important.",
    "question": "Which sentence explains why the example matters?",
    "options": [
      "Positive reviews show that a business should keep its current approach.",
      "Repeated complaints can reveal a problem that a company needs to fix.",
      "Customer reviews reveal how many products a company sold last month.",
      "Reading reviews makes further investigation of complaints unnecessary."
    ],
    "correct": 1,
    "reason": "The explanation connects the example to a practical consequence; it does not merely repeat the point."
  }
];

const improveWriting={render(root){const state=read();root.innerHTML=`<div class="container learning-shell"><header class="learning-heading"><div><div class="pill">Writing</div><h1>Improve Your Writing</h1><p>After learning IBC and PEEL, practise making sentences clearer and evidence more useful.</p></div></header>
  ${tasks.map((task,i)=>`<section class="learning-panel"><h2>${i+1}. ${task.title}</h2><p class="weak-model">${escapeHtml(task.example)}</p><p>${escapeHtml(task.question)}</p><div class="learning-options">${indexedOptions(task.options).map(({label:option,index})=>`<label><input type="radio" name="improve${i}" value="${index}"> ${escapeHtml(option)}</label>`).join("")}</div><button type="button" class="btn primary-btn" data-check="${i}">Check answer</button><div class="learning-feedback" data-feedback="${i}"></div></section>`).join("")}
  <section class="learning-panel"><h2>6. Revise a paragraph</h2><p class="weak-model">Walking is good, it is cheap. Many people do it. It helps. However, it is good.</p><p>Rewrite it with correct sentence boundaries, one specific example, an explanation and a linking sentence. Use a transition only if it helps the meaning.</p><textarea id="revision" class="learning-textarea" rows="7" placeholder="Write your revised paragraph here…">${escapeHtml(state.revision||"")}</textarea><div class="draft-row"><span>Review your own work using the checklist below.</span><button type="button" class="btn" id="saveRevision">Save revision</button></div><details><summary>Review checklist and sample response</summary><ul><li>Are complete sentences correctly separated?</li><li>Does an example support the point?</li><li>Does the explanation tell the reader why the example matters?</li><li>Do transitions express a real connection rather than fill space?</li></ul><p>Sample: Walking is an accessible form of exercise because it requires little equipment. For example, a person might walk part of the way to school instead of paying for a gym membership. This makes it easier to build activity into an ordinary day. Walking can therefore be a practical choice for some people.</p></details></section></div>`;
  root.querySelectorAll("[data-check]").forEach(button=>button.onclick=()=>{const i=Number(button.dataset.check),answer=root.querySelector(`input[name="improve${i}"]:checked`),ok=answer&&Number(answer.value)===tasks[i].correct;root.querySelector(`[data-feedback="${i}"]`).innerHTML=`<div class="feedback ${ok?"success-feedback":"error-feedback"}">${answer?(ok?"Correct. ":"Not yet. "):"Choose an answer first. "}${answer?escapeHtml(tasks[i].reason):""}</div>`;});
  root.querySelector("#saveRevision").onclick=()=>{state.revision=root.querySelector("#revision").value;localStorage.setItem(KEY,JSON.stringify(state));root.querySelector("#saveRevision").textContent="Saved ✓";};
}};
export default improveWriting;
