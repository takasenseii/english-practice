const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const criteria=[['Currency','Is the date suitable for your question?'],['Relevance','Does the source address your research question?'],['Authority','Can you identify the author and relevant expertise?'],['Accuracy','Can you trace and check the supporting evidence?'],['Purpose','Why was this published, and who benefits?']];
const cases=[
 {title:'Current transport information',question:'What are the current bus fares in a town?',a:'The transport operator’s current fare page, with a valid-from date and full ticket conditions.',b:'A traveller’s blog from 2018 describing the prices paid during a holiday.',judgement:'Start with A for current fares. Check the date and ticket conditions. B may be useful for historical travel experiences, but it does not establish today’s prices.'},
 {title:'A claim about learning',question:'Does a study app improve vocabulary recall?',a:'The app seller’s advert promises “double your vocabulary”, but provides no study or method.',b:'A published study describes participants, testing and limitations. A named author has relevant research experience.',judgement:'B is a stronger starting point for evidence. Check whether its participants and app match your question. A shows what the seller claims, but the claim still needs independent support.'},
 {title:'Perspectives on a school policy',question:'How did students respond to a proposed uniform policy?',a:'A student’s dated opinion article describes their own objections to the proposal.',b:'A school survey report gives the questions, respondent numbers and a range of responses.',judgement:'A can illustrate one student’s perspective. B may support a broader account, but check how students were selected and how many responded. Neither automatically represents every student.'}
];
const q=(prompt,right,wrong,why)=>({prompt,choices:[{text:right,correct:true},...wrong.map(text=>({text,correct:false}))],why});
export const questions=[
  {
    "prompt": "What does Currency ask you to examine?",
    "choices": [
      {
        "text": "Whether the information is recent enough for the topic.",
        "correct": true
      },
      {
        "text": "Whether the publication date is the same as the access date.",
        "correct": false
      },
      {
        "text": "Whether the author has recently gained a new qualification.",
        "correct": false
      },
      {
        "text": "Whether the source has been widely shared this week.",
        "correct": false
      }
    ],
    "why": "The date matters in relation to your research question."
  },
  {
    "prompt": "What does Relevance ask you to examine?",
    "choices": [
      {
        "text": "Whether the information helps answer your research question.",
        "correct": true
      },
      {
        "text": "Whether the source supports the position you intend to argue.",
        "correct": false
      },
      {
        "text": "Whether the source covers the topic in the greatest detail.",
        "correct": false
      },
      {
        "text": "Whether the publication date makes it newer than other sources.",
        "correct": false
      }
    ],
    "why": "A credible source can still be unsuitable for your particular task."
  },
  {
    "prompt": "Which question checks Authority?",
    "choices": [
      {
        "text": "Does the author have expertise related to this topic?",
        "correct": true
      },
      {
        "text": "Can the author explain the claim in an accessible style?",
        "correct": false
      },
      {
        "text": "Has the article appeared in more than one publication?",
        "correct": false
      },
      {
        "text": "Does the author cite a large number of different sources?",
        "correct": false
      }
    ],
    "why": "Authority involves the source’s identity and relevant knowledge."
  },
  {
    "prompt": "Which action checks Accuracy?",
    "choices": [
      {
        "text": "Trace a claim to its evidence and inspect that evidence.",
        "correct": true
      },
      {
        "text": "Check whether the author is qualified, without inspecting the evidence.",
        "correct": false
      },
      {
        "text": "Check whether the date is recent, without tracing the claim.",
        "correct": false
      },
      {
        "text": "Compare how often the headline appears in search results.",
        "correct": false
      }
    ],
    "why": "Claims need support that can be examined."
  },
  {
    "prompt": "Which question checks Purpose?",
    "choices": [
      {
        "text": "Is the source trying to inform, sell, entertain or persuade?",
        "correct": true
      },
      {
        "text": "Does the source address the exact topic of the assignment?",
        "correct": false
      },
      {
        "text": "Can the source be traced to a named specialist author?",
        "correct": false
      },
      {
        "text": "Does the source provide evidence that can be independently checked?",
        "correct": false
      }
    ],
    "why": "Purpose can influence what the source emphasises or leaves out."
  },
  {
    "prompt": "Which source is the best starting point for current bus fares?",
    "choices": [
      {
        "text": "A current operator fare page with dates and ticket conditions.",
        "correct": true
      },
      {
        "text": "A recent travel guide giving typical fares but no valid-from date.",
        "correct": false
      },
      {
        "text": "A current passenger forum discussing fares paid on several routes.",
        "correct": false
      },
      {
        "text": "A city tourism page showing an older fare table without ticket conditions.",
        "correct": false
      }
    ],
    "why": "Use an appropriate current source, then verify its conditions."
  },
  {
    "prompt": "Is an older source always unsuitable?",
    "choices": [
      {
        "text": "No; it may be appropriate for a historical question.",
        "correct": true
      },
      {
        "text": "No; an older source is suitable whenever it has been cited by a newer article.",
        "correct": false
      },
      {
        "text": "Yes; historical questions should use only recent explanations.",
        "correct": false
      },
      {
        "text": "No; an older source is suitable whenever its author is a recognised expert.",
        "correct": false
      }
    ],
    "why": "Currency is topic-dependent. An older document may also be valuable evidence from its own period."
  },
  {
    "prompt": "An expert in astronomy gives advice on language teaching. What should you check?",
    "choices": [
      {
        "text": "Whether they also have relevant expertise in language teaching.",
        "correct": true
      },
      {
        "text": "Whether their astronomy research has been peer reviewed.",
        "correct": false
      },
      {
        "text": "Whether their university has a good general reputation.",
        "correct": false
      },
      {
        "text": "Whether their article has attracted positive comments from teachers.",
        "correct": false
      }
    ],
    "why": "Expertise in one area does not automatically transfer to another."
  },
  {
    "prompt": "A website ends in .org. What can you conclude?",
    "choices": [
      {
        "text": "The ending alone does not establish the reliability of its claims.",
        "correct": true
      },
      {
        "text": "The source is likely reliable because it is not a commercial domain.",
        "correct": false
      },
      {
        "text": "The source can be treated as independent of political interests.",
        "correct": false
      },
      {
        "text": "The source has passed an accuracy review before registering the domain.",
        "correct": false
      }
    ],
    "why": "Investigate authorship, evidence and purpose rather than relying on a domain ending."
  },
  {
    "prompt": "A page has professional design and no spelling errors. What next?",
    "choices": [
      {
        "text": "Check authorship, evidence and independent coverage.",
        "correct": true
      },
      {
        "text": "Treat the editing quality as evidence that its claims were checked.",
        "correct": false
      },
      {
        "text": "Use the design to judge whether the author is qualified.",
        "correct": false
      },
      {
        "text": "Check the conclusion only against other pages by the same publisher.",
        "correct": false
      }
    ],
    "why": "Presentation quality is not proof of content accuracy."
  },
  {
    "prompt": "Several websites repeat the same claim. Is that enough independent support?",
    "choices": [
      {
        "text": "No; they may all be copying a single source.",
        "correct": true
      },
      {
        "text": "Yes; different website names establish that the evidence is independent.",
        "correct": false
      },
      {
        "text": "Yes; repeated coverage is sufficient if the wording differs.",
        "correct": false
      },
      {
        "text": "No; repeated coverage cannot contribute evidence even when based on separate investigations.",
        "correct": false
      }
    ],
    "why": "Trace the sources to see whether the evidence is genuinely independent."
  },
  {
    "prompt": "A seller says its app improves learning but provides no evidence. What should you do?",
    "choices": [
      {
        "text": "Look for independent research supporting the claim.",
        "correct": true
      },
      {
        "text": "Use detailed customer testimonials as evidence of the average learning gain.",
        "correct": false
      },
      {
        "text": "Check whether the seller explains its teaching method instead of checking outcomes.",
        "correct": false
      },
      {
        "text": "Treat the lack of evidence as sufficient proof that the product cannot help.",
        "correct": false
      }
    ],
    "why": "Commercial purpose is a reason to investigate claims, not automatic proof that they are false."
  },
  {
    "prompt": "Can an opinion article be useful?",
    "choices": [
      {
        "text": "Yes, as evidence of a viewpoint, with its limits made clear.",
        "correct": true
      },
      {
        "text": "Yes, as evidence of the typical opinion of everyone the author mentions.",
        "correct": false
      },
      {
        "text": "Yes, as factual support whenever the author has personal experience.",
        "correct": false
      },
      {
        "text": "No, unless the article gives equal space to every opposing position.",
        "correct": false
      }
    ],
    "why": "Use the source for an appropriate claim: one viewpoint is not a population-wide finding."
  },
  {
    "prompt": "A student describes disliking uniforms. Which claim does this directly support?",
    "choices": [
      {
        "text": "This student expressed opposition to uniforms.",
        "correct": true
      },
      {
        "text": "Students at the school generally oppose uniforms.",
        "correct": false
      },
      {
        "text": "The uniform policy caused a decline in student attendance.",
        "correct": false
      },
      {
        "text": "The school's student survey showed opposition to uniforms.",
        "correct": false
      }
    ],
    "why": "Do not generalise beyond what the source supports."
  },
  {
    "prompt": "A school survey reports 80% agreement. What should you examine?",
    "choices": [
      {
        "text": "The questions, sample size, selection and response rate.",
        "correct": true
      },
      {
        "text": "Whether the survey's main result is presented in a readable chart.",
        "correct": false
      },
      {
        "text": "Whether the school has repeated the percentage in other publications.",
        "correct": false
      },
      {
        "text": "Whether the survey's conclusion agrees with the school's stated values.",
        "correct": false
      }
    ],
    "why": "Methods affect how well the result supports a wider claim."
  },
  {
    "prompt": "Two credible sources disagree. What is a useful response?",
    "choices": [
      {
        "text": "Compare their evidence, dates, methods and scope.",
        "correct": true
      },
      {
        "text": "Prefer the newer source without comparing the populations studied.",
        "correct": false
      },
      {
        "text": "Prefer the source with the longer bibliography without reading its evidence.",
        "correct": false
      },
      {
        "text": "Combine the results before checking whether they address the same question.",
        "correct": false
      }
    ],
    "why": "Different populations, definitions or dates may help explain disagreement."
  },
  {
    "prompt": "What is lateral reading?",
    "choices": [
      {
        "text": "Leaving a page to investigate its source and claims elsewhere.",
        "correct": true
      },
      {
        "text": "Comparing different paragraphs within the same article.",
        "correct": false
      },
      {
        "text": "Following the source's own links without checking independent coverage.",
        "correct": false
      },
      {
        "text": "Reading several articles from the same publisher in publication order.",
        "correct": false
      }
    ],
    "why": "Independent coverage can reveal information that a source does not disclose about itself."
  },
  {
    "prompt": "A screenshot shows a striking claim without a date or link. What first?",
    "choices": [
      {
        "text": "Find the original publication and its context.",
        "correct": true
      },
      {
        "text": "Compare the screenshot with reposts that repeat its wording.",
        "correct": false
      },
      {
        "text": "Judge the claim by the reputation of the person who shared it.",
        "correct": false
      },
      {
        "text": "Check the image's visual quality before using its headline as evidence.",
        "correct": false
      }
    ],
    "why": "A screenshot may omit dates, qualifications or surrounding material."
  },
  {
    "prompt": "Does passing a checklist guarantee a source is correct?",
    "choices": [
      {
        "text": "No; the criteria guide a judgement rather than guarantee truth.",
        "correct": true
      },
      {
        "text": "Yes; a positive result establishes that the conclusion is correct.",
        "correct": false
      },
      {
        "text": "No; only author qualifications can establish that a claim is correct.",
        "correct": false
      },
      {
        "text": "Yes; provided the checklist was completed by someone other than the author.",
        "correct": false
      }
    ],
    "why": "Evaluate the particular information you intend to use and explain your decision."
  },
  {
    "prompt": "What should a brief source evaluation contain?",
    "choices": [
      {
        "text": "Specific evidence, limitations and a judgement about its use.",
        "correct": true
      },
      {
        "text": "A summary of the article and a judgement based mainly on its professional appearance.",
        "correct": false
      },
      {
        "text": "The author's qualifications and a judgement without examining the relevant claim.",
        "correct": false
      },
      {
        "text": "A publication date and a statement that a recent source is suitable for any task.",
        "correct": false
      }
    ],
    "why": "Explain what you checked, what remains uncertain and which claims the source can support."
  }
];
const css=`.se-space{max-width:1000px;margin:auto;padding:20px;line-height:1.65}.se-space .card{margin:18px 0;padding:22px}.se-space .se-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}.se-space .se-box{padding:16px;border:1px solid #7b8ba3;border-radius:10px}.se-space a{color:#a7ceff}.se-space iframe{width:100%;aspect-ratio:16/9;border:0}.se-space label{display:flex;gap:10px;padding:12px;margin:8px 0;border:1px solid #7b8ba3;border-radius:8px;cursor:pointer}.se-space input{flex-shrink:0;margin-top:7px}.se-space fieldset{min-width:0;border:0;padding:0}.se-space legend{font-weight:bold}.se-space button{cursor:pointer;padding:10px 14px}.se-space .se-actions{display:flex;flex-wrap:wrap;gap:10px}.se-space .se-ok{border-color:#7cdfa2}.se-space .se-bad{border-color:#ffbf7f}.se-space textarea{box-sizing:border-box;width:100%;min-height:150px;background:#101c2c;color:#fff;padding:12px;font:inherit;border:1px solid #8495b0;border-radius:8px}`;
export default {render(root){let state=questions.map(()=>({selected:null,checked:false,solved:false,revealed:false,attempted:new Set()})),orders=questions.map(x=>shuffle(x.choices));let draft='';try{draft=localStorage.getItem('epso_source_evaluation_draft_v1')||'';}catch{}
 root.innerHTML=`<style>${css}</style><section class="container se-space"><h1>Source Evaluation</h1><p>Before using a source, decide what its information can support and whether it suits your task.</p><div class="card"><h2>1. Watch: The CRAAP Test</h2><iframe loading="lazy" title="The CRAAP Test — Peirce College Library" src="https://www.youtube-nocookie.com/embed/ikTdoe7s1qI" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><p><a href="https://www.youtubeeducation.com/watch?v=ikTdoe7s1qI" target="_blank" rel="noopener">Open your education video link</a> · <a href="https://www.youtube.com/watch?v=ikTdoe7s1qI" target="_blank" rel="noopener">Watch on YouTube</a></p><p>The CRAAP framework helps you consider five aspects of a source. Their importance depends on the task.</p><div class="se-grid">${criteria.map(([name,text])=>`<div class="se-box"><h3>${name}</h3><p>${text}</p></div>`).join('')}</div><p>Use these questions to explain a judgement. A date, author qualification or website ending is not a guarantee. Check the specific claim and recognise limitations.</p><p><a href="https://library.csuchico.edu/sites/default/files/craap-test.pdf" target="_blank" rel="noopener">CRAAP checklist — Meriam Library, California State University, Chico</a></p></div><div class="card"><h2>2. Compare sources</h2><p>These are fictional teaching scenarios.</p>${cases.map(c=>`<article><h3>${esc(c.title)}</h3><p><strong>Research question:</strong> ${esc(c.question)}</p><div class="se-grid"><p class="se-box"><strong>Source A:</strong> ${esc(c.a)}</p><p class="se-box"><strong>Source B:</strong> ${esc(c.b)}</p></div><p><strong>Evaluation:</strong> ${esc(c.judgement)}</p></article>`).join('')}<h3>Check beyond the page</h3><p>Investigate who is behind the source, trace important claims to original evidence, and compare independent coverage. This is often called lateral reading. Repeated claims may all come from the same original source.</p></div><div class="card"><h2>3. Practice: 20 questions</h2><p>Options are shuffled. Choose answers, then check for explanations.</p><div class="global-stats" data-ex="source-evaluation"></div><p id="se-score" role="status"></p><div class="se-actions"><button id="se-check">Check answers</button><button id="se-show">Show answers</button><button id="se-retry">Try again</button></div><div id="se-quiz"></div></div><div class="card"><h2>4. Evaluate a source of your own</h2><p>Choose a source for an assignment. Record its title, URL and your research question. Explain what you checked under the five criteria, any limitations, and what you would use it for.</p><label for="se-draft">Your source evaluation</label><textarea id="se-draft">${esc(draft)}</textarea><button id="se-save">Save draft</button><p id="se-save-status" role="status"></p><p>Drafts are saved in this browser. This writing task is for self-review or teacher feedback; it is not automatically graded.</p><details><summary>Example evaluation</summary><p>For current bus fares, I would begin with the operator’s fare page. Its valid-from date and ticket conditions help establish whether it is current and relevant. The operator is responsible for its fares, but it also has a commercial purpose. I would check that I am using the correct route and ticket type. A 2018 travel blog could provide historical context, but I would not use it to state today’s prices.</p></details><p>Once you have chosen a source: <a href="#/paraphrasing">practise paraphrasing</a> or <a href="#/referencing">practise citations and reference lists</a>.</p></div></section>`;
 function draw(){root.querySelector('#se-quiz').innerHTML=questions.map((q,i)=>{const s=state[i];return `<article class="card"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend>${orders[i].map((o,j)=>`<label class="${s.checked&&o.correct?'se-ok':s.checked&&s.selected===o?'se-bad':''}"><input type="radio" name="se-${i}" data-question="${i}" value="${j}" ${s.selected===o?'checked':''}>${esc(o.text)}</label>`).join('')}</fieldset>${s.checked?`<p role="status">${s.revealed?'Answer shown.':s.selected?.correct?'✔ Correct.':s.selected?'✖ Review your answer.':'Choose an answer first.'} ${s.selected||s.revealed?esc(q.why):''}</p>`:''}</article>`;}).join('');root.querySelector('#se-score').textContent=`Completed independently: ${state.filter(s=>s.solved).length}/20.`;window.updateGlobalStatsUI?.();}
 root.querySelector('#se-quiz').onchange=e=>{if(!e.target.matches('input[data-question]'))return;const i=Number(e.target.dataset.question);state[i].selected=orders[i][Number(e.target.value)];state[i].checked=false;};
 root.querySelector('#se-check').onclick=()=>{let attempts=0,correct=0;state.forEach(s=>{s.checked=true;if(s.selected&&!s.solved&&!s.revealed&&!s.attempted.has(s.selected)){attempts++;s.attempted.add(s.selected);if(s.selected.correct){correct++;s.solved=true;}}});if(attempts)window.recordExerciseResult?.('source-evaluation',attempts,correct);draw();};
 root.querySelector('#se-show').onclick=()=>{state.forEach(s=>{s.checked=true;s.revealed=true;});draw();};root.querySelector('#se-retry').onclick=()=>{state.forEach(s=>{s.selected=null;s.checked=false;});orders=questions.map(q=>shuffle(q.choices));draw();};
 root.querySelector('#se-save').onclick=()=>{try{localStorage.setItem('epso_source_evaluation_draft_v1',root.querySelector('#se-draft').value);root.querySelector('#se-save-status').textContent='Draft saved.';}catch{root.querySelector('#se-save-status').textContent='Could not save in this browser.';}};draw();
}};
