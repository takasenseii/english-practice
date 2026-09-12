import { speakingMaterialsById } from "./speaking-materials.js";

const STORE="epso_oral_ibc_v1";
const material=speakingMaterialsById["oral-ibc"];
function esc(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);}

const speaking={render(root){let saved="";try{saved=localStorage.getItem(STORE)||"";}catch{}
  const phrases=material.signposts.flatMap(group=>group.phrases);
  const expected=material.signposts.flatMap(group=>group.phrases.map(()=>group.section));
  root.innerHTML=`<div class="container learning-shell"><header class="learning-heading"><div><div class="pill">Speaking</div><h1>${material.title}</h1><p>${material.introduction}</p></div></header>
  <section class="learning-panel"><h2>1. IBC in speech</h2><div class="structure-grid">${material.structure.map(([part,title,text])=>`<article><h3>${part} · ${title}</h3><p>${text}</p></article>`).join("")}</div><p class="learning-note">${material.note}</p></section>
  <section class="learning-panel"><h2>2. Match signposts to IBC</h2><div class="signpost-list">${phrases.map((p,i)=>`<label><span>${p}</span><select data-sign="${i}"><option value="">Choose…</option><option value="I">Introduction</option><option value="B">Body</option><option value="C">Conclusion</option></select></label>`).join("")}</div><button class="btn primary-btn" id="checkSigns">Check answers</button><div id="signFeedback"></div></section>
  <section class="learning-panel"><h2>3. Improve an opening</h2><p class="weak-model">${material.weakOpening}</p><p>Which opening helps the audience most?</p><div class="learning-options">${material.openingOptions.map((x,i)=>`<label><input type="radio" name="opening" value="${i}"> ${x}</label>`).join("")}</div><button class="btn primary-btn" id="checkOpening">Check answer</button><div id="openingFeedback"></div></section>
  <section class="learning-panel"><h2>4. Plan a two-minute presentation</h2><p><strong>Topic:</strong> ${material.planningTopic}</p><textarea id="oralPlan" class="learning-textarea" rows="12" placeholder="INTRODUCTION — topic, relevance and preview\n\nBODY — point 1, example and explanation\nBODY — point 2, example and explanation\n\nCONCLUSION — summary and final message">${esc(saved)}</textarea><div class="draft-row"><span>Use notes and keywords—not a complete essay.</span><button class="btn" id="savePlan">Save plan</button></div><details><summary>Rehearsal checklist</summary><ul><li>I previewed the main points.</li><li>I used clear spoken signposts.</li><li>Each point included an example or explanation.</li><li>I signalled the conclusion.</li><li>I looked up regularly instead of reading every sentence.</li></ul></details></section></div>`;
  root.querySelector("#checkSigns").onclick=()=>{const values=[...root.querySelectorAll("[data-sign]")].map(x=>x.value),score=values.filter((v,i)=>v===expected[i]).length;root.querySelector("#signFeedback").innerHTML=`<div class="feedback ${score===expected.length?"success-feedback":"hint-feedback"}">${score} of ${expected.length} correct. ${score===expected.length?"Well done.":"Opening phrases orient, body phrases develop or move, and closing phrases finish."}</div>`;};
  root.querySelector("#checkOpening").onclick=()=>{const ok=root.querySelector('input[name="opening"]:checked')?.value==="0";root.querySelector("#openingFeedback").innerHTML=ok?'<div class="feedback success-feedback">Correct. It gives a precise topic and preview.</div>':'<div class="feedback error-feedback">Choose the opening that tells listeners exactly what to expect.</div>';};
  root.querySelector("#savePlan").onclick=()=>{localStorage.setItem(STORE,root.querySelector("#oralPlan").value);root.querySelector("#savePlan").textContent="Saved ✓";};
}};
export default speaking;
