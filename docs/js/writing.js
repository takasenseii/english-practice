const STORE = "epso_ibc_peel_v1";

const models = {
  "comparative": {
    label: "Comparative essay",
    title: "Lumeria and Norland",
    prompt: "Compare the legal systems, religion and gender equality of Lumeria and Norland.",
    introduction: "Lumeria and Norland are two modern countries with different systems in society and politics. Both are democracies and respect human rights. However, they differ in their legal systems, religion and gender equality. This essay compares these three areas.",
    paragraph: [
      ["P", "The legal systems in Lumeria and Norland work in different ways."],
      ["E", "In Lumeria, judges follow clear written rules, while judges in Norland often use earlier court cases."],
      ["E", "This makes Lumeria's system predictable, whereas Norland's system can be more flexible."],
      ["L", "Both countries aim for fairness, but they organise their legal systems differently."]
    ],
    conclusion: "In conclusion, Lumeria and Norland share democratic values, but they organise society differently. Lumeria focuses on clear laws and separation between religion and the state, while Norland gives more importance to interpretation, tradition and gradual social change.",
    buildPrompt: "Write a PEEL paragraph comparing the role of religion in Lumeria and Norland.",
    starters: ["Religion has a different role in…", "For example,…", "This means that…", "Therefore,…"]
  },
  "expository": {
    label: "Expository essay",
    title: "Common Mistakes When Starting a New Business",
    prompt: "Explain three common mistakes made when starting a business and how they can be avoided.",
    introduction: "Starting a new business can be both thrilling and daunting. Although many entrepreneurs aim for success, avoidable mistakes can create serious problems. This essay examines inadequate market analysis, ineffective financial planning and the failure to consider customer feedback.",
    paragraph: [
      ["P", "Ineffective financial planning is a frequent and potentially fatal mistake."],
      ["E", "For example, Webvan expanded rapidly and invested heavily in expensive warehouses before attracting enough customers."],
      ["E", "Its operating costs exceeded its income, showing how growth without realistic budgeting and sufficient demand can exhaust a company's funds."],
      ["L", "Careful budgeting and controlled expansion are therefore essential for keeping a new business viable."]
    ],
    conclusion: "In summary, market research, responsible budgeting and attention to customer feedback can reduce avoidable business problems. Although no plan can remove every risk, informed decisions give a new company a stronger foundation for long-term success.",
    buildPrompt: "Write a PEEL paragraph explaining why customer feedback matters to a new business.",
    starters: ["One significant mistake is…", "For instance,…", "This demonstrates that…", "Consequently,…"]
  },
  "argumentative": {
    label: "Argumentative essay",
    title: "The Best Exercise",
    prompt: "Argue whether walking is one of the best forms of exercise.",
    introduction: "People need exercise to stay healthy, but many activities can be inconvenient or expensive. Although walking may be difficult in certain weather, it is one of the best forms of exercise because it is easy and convenient.",
    paragraph: [
      ["P", "Walking is a particularly convenient form of exercise."],
      ["E", "For example, swimming requires a pool and weight training requires equipment, whereas walking can be done in many places without special preparation."],
      ["E", "This accessibility makes it easier for people to include regular exercise in their daily lives."],
      ["L", "Walking is therefore a practical choice for people who want a sustainable exercise routine."]
    ],
    conclusion: "In conclusion, poor weather can sometimes make walking difficult, but walking remains easier and more convenient than many alternatives. It can also support both physical and mental health. For these reasons, people seeking regular exercise should consider making walking part of their routine.",
    buildPrompt: "Write a PEEL paragraph arguing for or against another form of exercise.",
    starters: ["One important reason is…", "For example,…", "This shows that…", "Therefore,…"],
    note: "Argumentative essays also address opposing views. The original model acknowledges bad weather as a counterargument and then responds that people can adapt and may benefit from being outdoors."
  }
};

function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } }
function save(data) { localStorage.setItem(STORE, JSON.stringify(data)); }
function esc(s="") { return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
function words(s) { return s.trim() ? s.trim().split(/\s+/).length : 0; }

const writing = {
  render(root) {
    let state = load();
    let level = state.essayType || (state.level === "english-2" ? "expository" : "comparative");

    const draw = () => {
      const m = models[level];
      const orderItems = [m.paragraph[2], m.paragraph[0], m.paragraph[3], m.paragraph[1]];
      root.innerHTML = `<div class="container learning-shell">
        <header class="learning-heading"><div><div class="pill">Writing</div><h1>Structuring Your Writing with IBC and PEEL</h1><p>IBC organises the whole text. PEEL develops each body paragraph.</p></div>
          <label>Essay type <select id="writingLevel">${Object.entries(models).map(([id,x])=>`<option value="${id}" ${id===level?"selected":""}>${x.label}</option>`).join("")}</select></label>
        </header>

        <section class="learning-panel"><h2>1. Two structures working together</h2>
          <div class="structure-grid">
            <article><h3>IBC · Whole text</h3><p><strong>I — Introduction:</strong> introduce the topic and direction.</p><p><strong>B — Body:</strong> develop the main ideas.</p><p><strong>C — Conclusion:</strong> bring the ideas together without adding a new argument.</p></article>
            <article><h3>PEEL · Body paragraph</h3><p><strong>P — Point:</strong> state the paragraph's main idea.</p><p><strong>E — Evidence or Example:</strong> support the point.</p><p><strong>E — Explanation:</strong> show why the support matters.</p><p><strong>L — Link:</strong> connect back to the question or main argument.</p></article>
          </div>
        </section>

        <section class="learning-panel"><h2>2. Recognise the purpose</h2><p>Which description best explains the relationship between IBC and PEEL?</p>
          <div class="learning-options" id="relationOptions">${["IBC structures the complete text, while PEEL structures its body paragraphs.","IBC and PEEL are two names for exactly the same structure.","PEEL structures the conclusion, while IBC structures individual sentences."].map((x,i)=>`<label><input type="radio" name="relation" value="${i}"> ${x}</label>`).join("")}</div>
          <button class="btn primary-btn" id="checkRelation">Check answer</button><div class="learning-feedback" id="relationFeedback"></div>
        </section>

        <section class="learning-panel"><div class="pill">${m.label}</div><h2>3. Model essay</h2><p class="task-line"><strong>Task:</strong> ${m.prompt}</p>
          <div class="model-text"><p data-part="I"><span>I</span>${m.introduction}</p>${m.paragraph.map(([part,text])=>`<p data-part="${part}"><span>${part}</span>${text}</p>`).join("")}<p data-part="C"><span>C</span>${m.conclusion}</p></div>
          <p class="learning-note">The two E sentences have different jobs: the first supplies evidence or an example; the second explains its significance.</p>
          ${m.note ? `<p class="learning-note"><strong>Argumentative extension:</strong> ${m.note}</p>` : ""}
        </section>

        <section class="learning-panel"><h2>4. Rebuild the PEEL paragraph</h2><p>Give each sentence its correct position from 1 to 4.</p>
          <div class="order-builder">${orderItems.map(([part,text],i)=>`<label><select data-order="${i}"><option value="">–</option>${[1,2,3,4].map(n=>`<option>${n}</option>`).join("")}</select><span>${text}</span></label>`).join("")}</div>
          <button class="btn primary-btn" id="checkOrder">Check order</button><div class="learning-feedback" id="orderFeedback"></div>
        </section>

        <section class="learning-panel"><h2>5. Identify a weak paragraph</h2>
          <p class="weak-model">Customer feedback is important. Businesses have customers. Some people write reviews online. Feedback is useful. Therefore, businesses should be successful.</p>
          <p>What is the main weakness?</p><select id="weakAnswer"><option value="">Choose…</option><option value="0">It contains too many statistics.</option><option value="1">It makes claims but does not give a concrete example or explain the connection.</option><option value="2">It contains a detailed counterargument.</option></select>
          <button class="btn primary-btn" id="checkWeak">Check answer</button><div class="learning-feedback" id="weakFeedback"></div>
        </section>

        <section class="learning-panel"><h2>6. Build your own PEEL paragraph</h2><p>${m.buildPrompt}</p><p class="learning-note">Optional starters: ${m.starters.join(" · ")}</p>
          <textarea id="peelDraft" class="learning-textarea" rows="9" placeholder="P — Point\nE — Evidence or example\nE — Explanation\nL — Link">${esc(state[level]?.draft || "")}</textarea>
          <div class="draft-row"><span id="draftWords">${words(state[level]?.draft || "")} words</span><button class="btn" id="saveDraft">Save draft</button></div>
          <details><summary>Review checklist</summary><ul><li>Does the paragraph have one clear point?</li><li>Is the point supported by specific evidence or an example?</li><li>Does the explanation show why the support matters?</li><li>Does the final sentence link to the task or central idea?</li></ul></details>
        </section>
      </div>`;

      root.querySelector("#writingLevel").onchange=e=>{level=e.target.value;state.essayType=level;save(state);draw();};
      root.querySelector("#checkRelation").onclick=()=>{const v=root.querySelector('input[name="relation"]:checked')?.value;root.querySelector("#relationFeedback").innerHTML=v==="0"?'<div class="feedback success-feedback">Correct. IBC is the overall structure; PEEL works inside the body.</div>':'<div class="feedback error-feedback">Try again. Think about whole text versus individual body paragraphs.</div>';};
      root.querySelector("#checkOrder").onclick=()=>{const expected=[3,1,4,2];const values=[...root.querySelectorAll("[data-order]")].map(x=>Number(x.value));const ok=values.every((v,i)=>v===expected[i]);root.querySelector("#orderFeedback").innerHTML=ok?'<div class="feedback success-feedback">Correct: Point → Evidence → Explanation → Link.</div>':'<div class="feedback error-feedback">Not yet. First state the point, then support it, explain it and link it.</div>';};
      root.querySelector("#checkWeak").onclick=()=>{const ok=root.querySelector("#weakAnswer").value==="1";root.querySelector("#weakFeedback").innerHTML=ok?'<div class="feedback success-feedback">Correct. The paragraph needs specific support and reasoning.</div>':'<div class="feedback error-feedback">Look for both concrete support and an explanation.</div>';};
      const draft=root.querySelector("#peelDraft");draft.oninput=()=>root.querySelector("#draftWords").textContent=`${words(draft.value)} words`;
      root.querySelector("#saveDraft").onclick=()=>{state[level]={...(state[level]||{}),draft:draft.value};save(state);root.querySelector("#saveDraft").textContent="Saved ✓";};
    };
    draw();
  }
};

export default writing;
