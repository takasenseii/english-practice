// EPSO: original teaching examples, informed by Penn State and Howard CC.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const examples=[
 {title:'1. Studying vocabulary',source:'Morgan, 2024',original:'Students who review new vocabulary in several short sessions often remember more words than students who study the same vocabulary in one long session.',poor:'Learners who revise new vocabulary in several brief sessions often recall more words than learners who study the same vocabulary in one lengthy session (Morgan, 2024).',good:'Spreading vocabulary practice across shorter study periods can improve recall compared with doing all the practice at once (Morgan, 2024).',problem:'This is patchwriting: most of the sentence structure and wording remain. Changing students to learners and long to lengthy is not enough, even with a citation.',strength:'The idea is expressed through a different sentence structure. It keeps the comparison and the cautious claim: can improve, rather than always improves.'},
 {title:'2. Planning a journey',source:'Patel, 2023',original:'When a bus service runs only once an hour, passengers may need to plan their journeys carefully to avoid long waits at the bus stop.',poor:'An hourly bus service always makes passengers wait for a long time, even when they plan their journeys carefully (Patel, 2023).',good:'Careful planning can help people avoid spending a long time waiting for a bus that arrives just once every hour (Patel, 2023).',problem:'The meaning changes. The original describes a possible wait and explains how planning may help; this version says long waits are inevitable.',strength:'The wording and structure change while the relationship between planning, an hourly service and possible waiting time remains.'},
 {title:'3. School gardens',source:'Chen, 2022',original:'School gardens can give students practical opportunities to learn how plants grow, but maintaining these spaces requires regular work from staff and students.',poor:'Although pupils can study plant growth by gardening at school, both teachers and learners must regularly care for the garden.',good:'A garden offers hands-on learning about plant development at school, while also creating an ongoing responsibility for both employees and pupils (Chen, 2022).',problem:'This version changes the wording and preserves the meaning reasonably well, but it does not credit the source. A paraphrase still needs a citation.',strength:'It includes both the learning opportunity and the maintenance responsibility, reorganises the wording, and acknowledges the source.'}
];
const q=(prompt,correct,wrong,explanation,example=null)=>({prompt,options:[{text:correct,correct:true},...wrong.map(text=>({text,correct:false}))],explanation,example});
export const questions=[
  {
    "prompt": "What is the main aim of paraphrasing?",
    "options": [
      {
        "text": "Express a source’s meaning accurately in your own wording and structure.",
        "correct": true
      },
      {
        "text": "Express the conclusion in stronger terms using your own sentence structure.",
        "correct": false
      },
      {
        "text": "Preserve the original sentence structure while replacing its key words.",
        "correct": false
      },
      {
        "text": "Change the source’s conclusion to match your opinion.",
        "correct": false
      }
    ],
    "explanation": "A paraphrase presents the source’s idea accurately through a fresh formulation.",
    "example": null
  },
  {
    "prompt": "What should you do before writing a paraphrase?",
    "options": [
      {
        "text": "Read until you understand the idea.",
        "correct": true
      },
      {
        "text": "Identify words to replace before establishing the main idea.",
        "correct": false
      },
      {
        "text": "Choose the source's strongest sentence before reading its surrounding context.",
        "correct": false
      },
      {
        "text": "Copy the first sentence and shorten it.",
        "correct": false
      }
    ],
    "explanation": "Understanding comes before rewording.",
    "example": null
  },
  {
    "prompt": "Which method helps you avoid following the original too closely?",
    "options": [
      {
        "text": "Put the source aside, write from your understanding, then compare.",
        "correct": true
      },
      {
        "text": "Follow the source sentence by sentence while changing each main verb.",
        "correct": false
      },
      {
        "text": "Retain the source's structure but replace all technical terms.",
        "correct": false
      },
      {
        "text": "Remove the author’s name and publication year.",
        "correct": false
      }
    ],
    "explanation": "Writing with the source temporarily out of view can help you build your own sentence. Afterwards, check accuracy and citation.",
    "example": null
  },
  {
    "prompt": "Does a paraphrase need a citation?",
    "options": [
      {
        "text": "Yes, because the idea still comes from the source.",
        "correct": true
      },
      {
        "text": "No, if every word is different.",
        "correct": false
      },
      {
        "text": "Only when it contains a quotation.",
        "correct": false
      },
      {
        "text": "Only when the source is a book.",
        "correct": false
      }
    ],
    "explanation": "A new formulation does not make a borrowed idea your own.",
    "example": null
  },
  {
    "prompt": "How does paraphrasing differ from summarising?",
    "options": [
      {
        "text": "A paraphrase restates a specific passage; a summary condenses its main points.",
        "correct": true
      },
      {
        "text": "A paraphrase changes only the wording; a summary changes the author's argument.",
        "correct": false
      },
      {
        "text": "A paraphrase combines several authors; a summary discusses only one source.",
        "correct": false
      },
      {
        "text": "There is no difference in purpose or detail.",
        "correct": false
      }
    ],
    "explanation": "Both require accurate meaning and source acknowledgement. A summary generally covers the main points more briefly.",
    "example": null
  },
  {
    "prompt": "What is the main weakness of the poor vocabulary paraphrase?",
    "options": [
      {
        "text": "It follows the original structure and replaces only a few words.",
        "correct": true
      },
      {
        "text": "It omits the source citation.",
        "correct": false
      },
      {
        "text": "It changes often into always.",
        "correct": false
      },
      {
        "text": "It introduces a new topic.",
        "correct": false
      }
    ],
    "explanation": "This is patchwriting: most of the sentence structure and wording remain. Changing students to learners and long to lengthy is not enough, even with a citation.",
    "example": 0
  },
  {
    "prompt": "Why is the good vocabulary paraphrase stronger?",
    "options": [
      {
        "text": "It reorganises the idea while preserving the comparison.",
        "correct": true
      },
      {
        "text": "It turns a cautious comparison into a definite promise about learning.",
        "correct": false
      },
      {
        "text": "It removes the comparison between short sessions and one long session.",
        "correct": false
      },
      {
        "text": "It keeps every phrase in the same order.",
        "correct": false
      }
    ],
    "explanation": "The idea is expressed through a different sentence structure. It keeps the comparison and the cautious claim: can improve, rather than always improves.",
    "example": 0
  },
  {
    "prompt": "Which claim would distort the vocabulary original?",
    "options": [
      {
        "text": "Short sessions guarantee that every student remembers every word.",
        "correct": true
      },
      {
        "text": "Spreading study out guarantees better recall than a single session.",
        "correct": false
      },
      {
        "text": "Every student learns more from a short session than from any long session.",
        "correct": false
      },
      {
        "text": "The passage compares distributed study with one long session.",
        "correct": false
      }
    ],
    "explanation": "Guarantee, every student and every word introduce certainty and scope that the original does not claim.",
    "example": 0
  },
  {
    "prompt": "What is the main weakness of the poor bus paraphrase?",
    "options": [
      {
        "text": "It makes a possible problem sound unavoidable.",
        "correct": true
      },
      {
        "text": "It uses a different sentence structure.",
        "correct": false
      },
      {
        "text": "It credits the source.",
        "correct": false
      },
      {
        "text": "It retains the hourly frequency.",
        "correct": false
      }
    ],
    "explanation": "The meaning changes. The original describes a possible wait and explains how planning may help; this version says long waits are inevitable.",
    "example": 1
  },
  {
    "prompt": "Which detail must an accurate bus paraphrase preserve?",
    "options": [
      {
        "text": "Planning may reduce the risk of long waits.",
        "correct": true
      },
      {
        "text": "Planning removes the need to check when an hourly bus runs.",
        "correct": false
      },
      {
        "text": "Hourly services cause long waits regardless of careful planning.",
        "correct": false
      },
      {
        "text": "Hourly buses always arrive late.",
        "correct": false
      }
    ],
    "explanation": "The original connects careful planning to avoiding a possible long wait.",
    "example": 1
  },
  {
    "prompt": "Why can you keep the word bus in a paraphrase?",
    "options": [
      {
        "text": "Necessary everyday or technical terms do not all need replacing.",
        "correct": true
      },
      {
        "text": "Everyday terms may be retained provided the original sentence order is also retained.",
        "correct": false
      },
      {
        "text": "An unchanged everyday term needs quotation marks even within a new formulation.",
        "correct": false
      },
      {
        "text": "You must keep the whole sentence whenever you keep a noun.",
        "correct": false
      }
    ],
    "explanation": "The goal is independent expression of meaning, not replacing every word.",
    "example": 1
  },
  {
    "prompt": "What is missing from the poor school-garden paraphrase?",
    "options": [
      {
        "text": "A citation acknowledging the source.",
        "correct": true
      },
      {
        "text": "A statement about maintaining the garden.",
        "correct": false
      },
      {
        "text": "A reference to learning about plants.",
        "correct": false
      },
      {
        "text": "Different wording from the original.",
        "correct": false
      }
    ],
    "explanation": "This version changes the wording and preserves the meaning reasonably well, but it does not credit the source. A paraphrase still needs a citation.",
    "example": 2
  },
  {
    "prompt": "Which paraphrase best preserves both sides of the school-garden original?",
    "options": [
      {
        "text": "Gardens can support practical learning but require ongoing care.",
        "correct": true
      },
      {
        "text": "Gardens support practical learning once staff take over all maintenance.",
        "correct": false
      },
      {
        "text": "Gardens can support plant learning without regular work from students.",
        "correct": false
      },
      {
        "text": "Only staff benefit from school gardens.",
        "correct": false
      }
    ],
    "explanation": "The original balances an educational benefit with a maintenance responsibility.",
    "example": 2
  },
  {
    "prompt": "You want to include an author’s exact distinctive phrase. What should you do?",
    "options": [
      {
        "text": "Mark it as a quotation and cite it with the required locator.",
        "correct": true
      },
      {
        "text": "Change one word and present it as your own sentence.",
        "correct": false
      },
      {
        "text": "Keep it unchanged and cite only in the reference list.",
        "correct": false
      },
      {
        "text": "Remove quotation marks so it looks like a paraphrase.",
        "correct": false
      }
    ],
    "explanation": "Exact borrowed wording requires quotation formatting as well as source acknowledgement.",
    "example": null
  },
  {
    "prompt": "Which is the best final check for a paraphrase?",
    "options": [
      {
        "text": "Check accuracy, independent wording and structure, and the citation.",
        "correct": true
      },
      {
        "text": "Check the citation and vocabulary without comparing the meaning.",
        "correct": false
      },
      {
        "text": "Check the meaning while retaining the original clause structure.",
        "correct": false
      },
      {
        "text": "Remove all words that appear in the source.",
        "correct": false
      }
    ],
    "explanation": "A successful paraphrase must be accurate, independently expressed and credited.",
    "example": null
  }
];
const css=`.para-space{max-width:1000px;margin:auto;padding:20px;line-height:1.65}.para-space .card{margin:18px 0;padding:22px}.para-space .para-original{padding:14px;border-left:3px solid #98b9f0;background:rgba(130,160,200,.1)}.para-space .para-poor{border-left:3px solid #ffc078;padding-left:14px}.para-space .para-good{border-left:3px solid #7bdca4;padding-left:14px}.para-space iframe{width:100%;aspect-ratio:16/9;border:0}.para-space a{color:#a6ccff}.para-space button{cursor:pointer;padding:9px 14px}.para-space .para-actions{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.para-space label{display:flex;gap:10px;align-items:flex-start;padding:12px;margin:8px 0;border:1px solid #8291a8;border-radius:8px;cursor:pointer;overflow-wrap:anywhere}.para-space input{margin-top:7px;flex-shrink:0}.para-space fieldset{border:0;padding:0;min-width:0}.para-space legend{font-weight:bold;font-size:1.15em;margin-bottom:10px}.para-space .para-feedback{padding:12px}.para-space .para-correct{border-color:#7bdca4}.para-space .para-wrong{border-color:#ffc078}.para-space summary{cursor:pointer;font-weight:bold}`;
function exampleHTML(e){return `<article class="card"><h3>${esc(e.title)}</h3><p class="para-original"><strong>Original:</strong> ${esc(e.original)}</p><div class="para-poor"><h4>Poor paraphrase</h4><p>${esc(e.poor)}</p><p><strong>Why it is weak:</strong> ${esc(e.problem)}</p></div><div class="para-good"><h4>Good paraphrase</h4><p>${esc(e.good)}</p><p><strong>Why it works:</strong> ${esc(e.strength)}</p></div></article>`;}
export default {render(root){
 let states=questions.map(()=>({selected:null,checked:false,revealed:false,solved:false,attempted:new Set()}));let orders=questions.map(x=>shuffle(x.options));
 root.innerHTML=`<style>${css}</style><section class="container para-space"><h1>Paraphrasing</h1><div class="card"><h2>Express the idea in your own words</h2><p>Paraphrasing means restating a passage accurately through your own wording and sentence structure. Swapping a few words usually leaves you too close to the original. You also need a citation.</p><p>Keep the source’s meaning and level of certainty. Do not turn “may” into “always”, add unsupported claims, or present your own opinion as the author’s.</p><h3>A useful process</h3><ol><li>Read the passage and identify its meaning.</li><li>Put it aside and explain the idea in your own words.</li><li>Compare your version with the original.</li><li>Revise wording, structure or meaning where needed.</li><li>Add the citation and the corresponding reference-list entry.</li></ol><p>A summary is usually more condensed and selects the main points. A quotation uses exact wording and needs quotation formatting.</p><h3>Watch: How to Paraphrase in 5 Easy Steps</h3><iframe loading="lazy" title="How to Paraphrase in 5 Easy Steps — Scribbr" src="https://www.youtube-nocookie.com/embed/oiM0x0ApVL8" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><p><a target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=oiM0x0ApVL8">Watch on YouTube</a></p><h3>Further reading</h3><p><a target="_blank" rel="noopener" href="https://integrity.psu.edu/paraphrasing">Penn State: Paraphrasing</a> · <a target="_blank" rel="noopener" href="https://pressbooks.howardcc.edu/engl021handbook/chapter/what-is-paraphrasing/">Howard Community College: What is Paraphrasing?</a></p><p><a href="#/referencing">Practise citations and reference lists →</a></p></div><h2>Three originals: poor and good paraphrases</h2><p>All passages below were written for this exercise. The author names and dates are fictional examples of APA citations, not real sources.</p>${examples.map(exampleHTML).join('')}<h2>Practice: 15 questions</h2><p>The answer options are shuffled. Select an answer, then check it. Each question includes an explanation after checking.</p><div class="global-stats" data-ex="paraphrasing"></div><p id="para-score" role="status"></p><div class="para-actions"><button id="para-check">Check answers</button><button id="para-show">Show answers</button><button id="para-retry">Try again</button></div><div id="para-quiz"></div></section>`;
 function draw(){root.querySelector('#para-quiz').innerHTML=questions.map((x,i)=>{const s=states[i];return `<article class="card"><fieldset><legend>${i+1}. ${esc(x.prompt)}</legend>${x.example!==null?`<p class="para-original"><strong>Original:</strong> ${esc(examples[x.example].original)}</p>${[5,8,11].includes(i)?`<p><strong>Poor paraphrase:</strong> ${esc(examples[x.example].poor)}</p>`:''}`:''}${orders[i].map((o,j)=>`<label class="${s.checked&&o.correct?'para-correct':s.checked&&s.selected===o&&!o.correct?'para-wrong':''}"><input type="radio" name="para-${i}" value="${j}" data-question="${i}" ${s.selected===o?'checked':''}>${esc(o.text)}</label>`).join('')}</fieldset>${s.checked?`<p class="para-feedback" role="status">${s.revealed?'Model answer shown.':s.selected?.correct?'✔ Correct.':s.selected?'✖ Review your answer.':'Choose an answer first.'} ${s.selected||s.revealed?esc(x.explanation):''}</p>`:''}</article>`;}).join('');root.querySelector('#para-score').textContent=`Completed independently: ${states.filter(s=>s.solved).length}/${questions.length}.`;window.updateGlobalStatsUI?.();}
 root.querySelector('#para-quiz').addEventListener('change',e=>{if(!e.target.matches('input[data-question]'))return;const i=Number(e.target.dataset.question);states[i].selected=orders[i][Number(e.target.value)];states[i].checked=false;});
 root.querySelector('#para-check').onclick=()=>{let attempted=0,correct=0;states.forEach(s=>{s.checked=true;if(s.selected&&!s.solved&&!s.revealed&&!s.attempted.has(s.selected)){attempted++;s.attempted.add(s.selected);if(s.selected.correct){correct++;s.solved=true;}}});if(attempted)window.recordExerciseResult?.('paraphrasing',attempted,correct);draw();};
 root.querySelector('#para-show').onclick=()=>{states.forEach(s=>{s.checked=true;s.revealed=true;});draw();};
 root.querySelector('#para-retry').onclick=()=>{states.forEach(s=>{s.selected=null;s.checked=false;});orders=questions.map(x=>shuffle(x.options));draw();};draw();
}};
