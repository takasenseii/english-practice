import { tutorMaterials } from "./tutor-materials.js";

const PROGRESS_KEY = "english_tutor_progress_v1";
const USER_KEY = "english_tutor_anonymous_user_v1";

function makeId() {
  if (crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getAnonymousUser() {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = makeId();
    localStorage.setItem(USER_KEY, id);
  }
  return { id, provider: "anonymous" };
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function formatQuestionPrompt(activity) {
  const prompt = activity.prompt;
  if (!activity.id.includes("-vocab-choice-")) return prompt;

  const patterns = [
    [/^(Which phrase is closest in meaning to )(.+?)(\?)$/, "$1“$2”$3"],
    [/^(What does )(?!it mean\b|Lewis\b)(.+?)( mean| suggest| imply| emphasise| describe)(.*)$/, "$1“$2”$3$4"],
    [/^(What nuance does )(.+?)( add.*)$/, "$1“$2”$3"],
    [/^(Which interpretation best captures )(.+?)(\?)$/, "$1“$2”$3"]
  ];

  for (const [pattern, replacement] of patterns) {
    if (pattern.test(prompt)) return prompt.replace(pattern, replacement);
  }
  return prompt;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffledOptions(activity, userId) {
  const options = activity.options.map((label, originalIndex) => ({ label, originalIndex }));
  let seed = hashString(`${userId}:${activity.id}`);
  for (let i = options.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export function evaluateMultipleSelection(selected, correctAnswers) {
  const chosen = new Set(selected.map(Number));
  const expected = new Set(correctAnswers);
  const missing = [...expected].filter(index => !chosen.has(index));
  const extra = [...chosen].filter(index => !expected.has(index));
  return { correct: missing.length === 0 && extra.length === 0, missing, extra };
}

export function evaluateClassification(items, answer) {
  return items.map((item, index) => ({ correct: Number(answer[index]) === item.answer, index }));
}


// Swedish meanings are written for the vocabulary's meaning in these resources.
const SWEDISH_VOCABULARY = {
  "segregation": "segregering",
  "equality": "jämlikhet; lika rättigheter",
  "boycott": "bojkott",
  "resistance": "motstånd",
  "discrimination": "diskriminering",
  "activist": "aktivist",
  "declining revenues": "minskande intäkter",
  "desegregation": "avskaffande av rassegregering",
  "collective action": "gemensamt handlande",
  "economic pressure": "ekonomiska påtryckningar",
  "death threat": "dödshot",
  "Supreme Court": "USA:s högsta domstol",
  "act of protest": "protesthandling",
  "civil-rights work": "medborgarrättsarbete",
  "racial violence": "rasistiskt våld",
  "gather information": "samla information",
  "challenge segregation": "utmana; motarbeta segregering",
  "Supreme Court decision": "beslut från högsta domstolen",
  "serious consequences": "allvarliga konsekvenser",
  "individual action": "en enskild persons handling",
  "entrepreneur": "entreprenör; företagare",
  "product": "produkt",
  "service": "tjänst",
  "boutique": "liten specialbutik; modebutik",
  "passionate": "engagerad; med ett starkt intresse",
  "motivated": "motiverad",
  "bring an idea to life": "förverkliga en idé",
  "think outside the box": "tänka i nya banor",
  "comfort zone": "trygghetszon",
  "marketplace": "marknad",
  "bring something to the table": "bidra med något värdefullt",
  "expand your knowledge": "utöka dina kunskaper",
  "product or service": "produkt eller tjänst",
  "share characteristics": "ha gemensamma egenskaper",
  "independent": "självständig",
  "expand their knowledge": "utöka sina kunskaper",
  "break out of their comfort zone": "våga lämna sin trygghetszon",
  "new opportunities": "nya möjligheter",
  "aspiring": "blivande; som strävar efter att bli något",
  "sandbox": "skyddad miljö för att testa idéer",
  "mindset": "tankesätt",
  "opportunity": "möjlighet",
  "core competencies": "kärnkompetenser",
  "reinvent": "förnya i grunden",
  "target market": "målmarknad; avsedd kundgrupp",
  "cash": "likvida medel; tillgängliga pengar",
  "deposit": "förskottsbetalning; handpenning",
  "asset": "tillgång",
  "regulation": "regel; bestämmelse",
  "roadblock": "hinder",
  "counterconventional": "som går emot etablerade arbetssätt",
  "fly in the face of": "gå rakt emot",
  "mental inclination": "mental benägenhet; tendens i tankesättet",
  "predetermine": "förutbestämma",
  "stick to your knitting": "hålla sig till det man redan kan",
  "nurture": "stödja och utveckla",
  "move the needle": "åstadkomma en märkbar förändring",
  "lateral stability": "stabilitet i sidled",
  "cash is the lifeblood": "tillgängliga pengar är verksamhetens livsnerv",
  "ride the float": "använda kunders förskottsbetalningar före leverans",
  "return on investment": "avkastning på investerat kapital",
  "ambiguous": "tvetydig; öppen för flera tolkningar",
  "startup": "nystartat företag med tillväxtambitioner",
  "factor": "faktor",
  "succeed": "lyckas",
  "failure": "misslyckande",
  "team": "lag; arbetsgrupp",
  "execution": "genomförande",
  "adaptability": "anpassningsförmåga",
  "business model": "affärsmodell",
  "funding": "finansiering",
  "timing": "val av rätt tidpunkt",
  "competitor": "konkurrent",
  "revenue": "intäkter",
  "equity incentives": "aktiebaserade incitament; belöningar i form av ägarandelar",
  "unlock human potential": "frigöra människors potential",
  "systematic": "systematisk",
  "misperception": "missuppfattning",
  "differentiability": "möjlighet att särskiljas från alternativen",
  "definitive": "slutgiltig; avgörande",
  "underfunded": "underfinansierad",
  "gain traction": "få genomslag; börja få stöd eller kunder",
  "broadband penetration": "bredbandsutbredning",
  "cost-effective": "kostnadseffektiv",
  "assess timing": "bedöma om tidpunkten är rätt",
  "be in denial": "förneka verkligheten",
  "premise": "grundtanke; utgångspunkt",
  "competition": "tävling",
  "achievement": "prestation",
  "setback": "motgång; bakslag",
  "transformation": "genomgripande förändring",
  "trial": "prövning; försök",
  "bankruptcy": "konkurs",
  "dynamic": "föränderlig; dynamisk",
  "surrender": "ge upp kontrollen; acceptera det man inte kan styra",
  "advantage": "fördel",
  "mastery": "mycket hög skicklighet; mästerskap",
  "groundbreaking achievement": "banbrytande prestation",
  "sanitized story": "tillrättalagd berättelse",
  "potential failure": "möjligt misslyckande",
  "merit a signature": "vara värd en signatur",
  "near win": "att nästan vinna",
  "propulsion": "drivkraft",
  "rock bottom": "bottenläge; livets lägsta punkt",
  "solid foundation": "stabil grund",
  "requisite": "nödvändig förutsättning",
  "frame an experience": "beskriva eller tolka en upplevelse ur ett visst perspektiv",
  "force-fit": "tvinga in något i ett sammanhang där det inte passar",
  "embrace uncertainty": "acceptera och våga möta osäkerhet",
  "wear many hats": "ha många olika roller",
  "delegate": "delegera",
  "target audience": "målgrupp",
  "work-life balance": "balans mellan arbete och privatliv",
  "deadline": "sista tidsfrist",
  "blind spot": "blind fläck; svaghet man inte själv ser",
  "market research": "marknadsundersökning",
  "customer base": "kundbas",
  "side business": "sidoverksamhet",
  "accountability": "ansvarsskyldighet; att stå till svars",
  "cultural fit": "hur väl någon passar organisationens värderingar och arbetssätt",
  "solopreneur": "enmansföretagare",
  "cash infusion": "kapitaltillskott",
  "working capital": "rörelsekapital",
  "brand ambassador": "varumärkesambassadör",
  "overhead costs": "omkostnader",
  "cede control": "överlåta kontroll",
  "cast a wide net": "söka brett bland många alternativ",
  "built-in safety net": "inbyggt skyddsnät",
  "pick up the slack": "ta över arbete som andra inte har hunnit eller kunnat göra",
  "cut your losses": "avbryta för att begränsa förlusterna",
  "hard and soft skills": "tekniska färdigheter och mellanmänskliga förmågor",
  "pivot": "strategisk kursändring",
  "customer behaviour": "kundbeteende",
  "financial crisis": "finanskris; ekonomisk kris",
  "persistence": "uthållighet",
  "test failure": "misslyckat test",
  "contract": "avtal",
  "withdraw": "dra sig ur",
  "reputation": "rykte",
  "layoff": "uppsägning på grund av arbetsbrist",
  "workplace safety": "arbetsmiljösäkerhet",
  "course-correct": "korrigera kursen; justera planen",
  "product-market fit": "överensstämmelse mellan produkten och marknadens behov",
  "liquidity crisis": "likviditetskris; brist på pengar för omedelbara betalningar",
  "calculated risk": "kalkylerad risk",
  "iterative testing": "upprepade tester och förbättringar",
  "failure tolerance": "tolerans för misslyckade försök",
  "contractual obligation": "avtalsenlig skyldighet",
  "stakeholder confidence": "intressenternas förtroende",
  "overpromise": "lova mer än man kan hålla",
  "operational decision": "beslut om den löpande verksamheten",
  "ethical trade-off": "etisk avvägning",
  "colony": "koloni",
  "exploitation": "exploatering; utnyttjande",
  "settler": "bosättare",
  "displacement": "tvångsförflyttning; fördrivning",
  "prestige": "prestige; anseende",
  "Indigenous": "som tillhör ett urfolk",
  "dispossession": "berövande av mark eller egendom",
  "assimilation": "assimilering; anpassning till den dominerande kulturen",
  "reconciliation": "försoning",
  "First Nations peoples": "Australiens urfolk: aboriginska folk och Torres Strait Islander-folk",
  "acknowledge": "erkänna; uppmärksamma",
  "Aboriginal": "aboriginsk; som rör Australiens aboriginska folk",
  "overwhelmed": "överväldigad",
  "fatal": "dödlig",
  "maintain": "upprätthålla; bibehålla",
  "community": "gemenskap; lokalsamhälle",
  "forcibly remove": "tvångsomhänderta; föra bort med tvång",
  "assimilate": "assimileras; anpassa sig till en annan kultur",
  "abuse": "övergrepp; misshandel",
  "neglect": "försumma; försummelse",
  "disrupt": "störa; avbryta",
  "long-term": "långsiktig; långvarig",
  "post-traumatic stress disorder": "posttraumatiskt stressyndrom, PTSD",
  "appropriation": "övertagande; tillägnande",
  "prime land": "särskilt värdefull eller användbar mark",
  "livestock": "boskap",
  "less viable": "svårare att upprätthålla; mindre livskraftig",
  "decline": "minskning; nedgång",
  "census": "folkräkning",
  "ward of the state": "person som står under statens rättsliga vård eller förmyndarskap",
  "commemorate": "högtidlighålla minnet av",
  "mission": "missionsstation",
  "blanket": "filt",
  "orphanage": "barnhem",
  "foster family": "familjehem; fosterfamilj",
  "policy": "policy; riktlinje; politisk handlingsplan",
  "heritage": "kulturarv",
  "recognise": "erkänna; uppmärksamma",
  "descendant": "ättling",
  "reconnect": "återknyta kontakten",
  "out-of-home care": "vård utanför det egna hemmet",
  "forcibly": "med tvång",
  "traumatised": "traumatiserad",
  "compensate": "kompensera; ge ersättning",
  "centuries": "århundraden",
  "explorer": "upptäcktsresande",
  "anniversary": "årsdag",
  "set foot": "sätta sin fot; anlända",
  "soil": "jord; mark",
  "voyage": "sjöresa",
  "county": "administrativt område; ungefär län",
  "national holiday": "nationell helgdag",
  "wealth": "rikedom",
  "defy": "trotsa",
  "conventional": "vedertagen; traditionell",
  "inhabit": "bebo",
  "friar": "ordensbroder i en katolsk tiggarorden",
  "experience": "uppleva",
  "settlement": "bosättning",
  "slaughter": "massakrera; slakta",
  "keep out": "hålla utanför; utestänga",
  "independence": "självständighet",
  "iconic": "ikonisk; starkt symbolisk",
  "be cemented": "bli fast etablerad",
  "publish": "publicera",
  "biography": "biografi; levnadsteckning",
  "glorify": "förhärliga",
  "heroic": "hjältemodig",
  "genius": "geni",
  "mention": "nämna",
  "perpetual": "ständig; evig",
  "foreigner": "utlänning",
  "be restricted": "vara begränsad; vara hänvisad till",
  "manual labour": "kroppsarbete",
  "pledge": "lova högtidligt",
  "allegiance": "rohet; lojalitet",
  "brand": "framställa som; ge en offentlig etikett",
  "become embedded": "bli en bestående del av",
  "further": "ytterligare",
  "found": "grunda",
  "immigrant": "invandrare",
  "gain influence": "få ökat inflytande",
  "proclaim": "utropa",
  "federal holiday": "federal helgdag",
  "settlers": "bosättare",
  "token issue": "symbolfråga utan verklig förändring",
  "opt out": "välja att avstå",
  "a sense of unity": "en känsla av samhörighet",
  "belonging": "tillhörighet",
  "human nature": "människans natur",
  "discard": "förkasta; kasta bort",
  "persecution": "förföljelse",
  "controversy": "kontrovers; stark oenighet",
  "perspective": "perspektiv"
};
const normaliseVocabularyTerm = term => String(term || '').trim().toLocaleLowerCase('en').replace(/[’‘]/g, "'");
const SWEDISH_LOOKUP = new Map(Object.entries(SWEDISH_VOCABULARY).map(([term,meaning]) => [normaliseVocabularyTerm(term), meaning]));
export function swedishMeaning(item) {
  return item.swedish || item.translationSv || SWEDISH_LOOKUP.get(normaliseVocabularyTerm(item.term)) || '';
}
export function getMaterialVocabulary(material, level) {
  if (Array.isArray(material.vocabulary) && material.vocabulary.length) return material.vocabulary;
  if (Array.isArray(material.vocabularyList) && material.vocabularyList.length) return [];
  const seen = new Set();
  return (material.activities || []).filter(activity => activity.type === 'matching' &&
    (!level || activity.level === 'both' || activity.level === level) &&
    (/vocab/i.test(activity.id || '') || /vocab/i.test(activity.category || '')))
    .flatMap(activity => activity.pairs || []).filter(item => {
      const key = normaliseVocabularyTerm(item.term);
      if (!key || key.includes('___') || seen.has(key)) return false;
      seen.add(key); return true;
    });
}
export function renderVocabularyTable(items, isSwedish = false) {
  if (!items.length) return '';
  const hasExamples = items.some(item => item.example);
  const labels = isSwedish ? ['Begrepp', 'Svenska', 'Förklaring', 'Exempel'] : ['Word / phrase', 'Swedish', 'Simple English', 'Example'];
  const words = items.map(item => `<tr><td><strong>${escapeHtml(item.term || '')}</strong></td>${isSwedish ? '' : `<td lang="sv">${escapeHtml(swedishMeaning(item) || 'Translation not yet added')}</td>`}<td>${escapeHtml(item.definition || '')}</td>${hasExamples ? `<td>${escapeHtml(item.example || '—')}</td>` : ''}</tr>`).join('');
  return `<div class="tutor-vocab-scroll" tabindex="0" role="region" aria-label="${isSwedish ? 'Begreppslista' : 'Vocabulary list'}"><table class="tutor-vocab-table"><thead><tr><th scope="col">${labels[0]}</th>${isSwedish ? '' : `<th scope="col" lang="sv">${labels[1]}</th>`}<th scope="col">${labels[2]}</th>${hasExamples ? `<th scope="col">${labels[3]}</th>` : ''}</tr></thead><tbody>${words}</tbody></table></div>`;
}
const vocabularyTableStyle = `<style>
.tutor-shell .tutor-vocab-scroll{overflow-x:auto;margin:18px 0;border:1px solid #4c607b;border-radius:12px;background:#101b2c}
.tutor-shell .tutor-vocab-table{width:100%;border-collapse:collapse;min-width:560px;color:#eef2fa;line-height:1.6}
.tutor-shell .tutor-vocab-table th,.tutor-shell .tutor-vocab-table td{padding:13px 16px;text-align:left;vertical-align:top;border-bottom:1px solid #455871}
.tutor-shell .tutor-vocab-table th{color:#d9efb4;background:#172437;font-weight:700}
.tutor-shell .tutor-vocab-table tbody tr:last-child td{border-bottom:0}
.tutor-shell .tutor-vocab-table td[lang=sv]{color:#ffe6a5}
.tutor-shell .tutor-vocab-scroll:focus-visible{outline:3px solid #ffe166;outline-offset:3px}
@media(max-width:600px){.tutor-shell .tutor-vocab-table th,.tutor-shell .tutor-vocab-table td{padding:11px}}
</style>`;

const tutor = {
  render(root, materialId) {
    const material = tutorMaterials.find(item => item.id === materialId) || tutorMaterials[0];
    const isSwedish = material.language === "sv";
    const translations = {"Before you begin": "Innan du börjar", "Level": "Nivå", "Key vocabulary": "Viktiga begrepp", "Your progress is saved on this device. A future version can connect it to your school Google account.": "Dina svar och framsteg sparas på den här enheten.", "Watch and listen for the main idea. Use the transcript button below when you need support.": "Se filmen och lyssna efter huvudbudskapet. Använd materiallänkarna om du behöver stöd.", "Word list: simple English meanings and examples": "Begreppslista: enkla förklaringar och exempel", "Select an image to open the full-size version. Image-reflection questions follow the video questions.": "Välj en bild för att öppna den i full storlek. Bildfrågorna kommer efter filmfrågorna.", "Well done": "Bra arbetat", "Automatically checked questions correct:": "Rätt på automatiskt rättade frågor:", "Your written responses have been saved for later review.": "Dina skriftliga svar har sparats.", "Review from the beginning": "Gå igenom från början", "Choose a meaning…": "Välj en förklaring…", "Write your answer here…": "Skriv ditt svar här…", "Hint": "Ledtråd", "Check answer": "Kontrollera svaret", "Save and review": "Spara och granska", "← Previous": "← Föregående", "Next →": "Nästa →", "Finish": "Avsluta", "Choose an answer first.": "Välj ett svar först.", "Match every word before checking.": "Välj ett alternativ till varje rad innan du kontrollerar.", "All matches are correct.": "Alla svar är rätt.", "Correct.": "Rätt.", "Not quite.": "Inte riktigt.", "Give every event a position before checking.": "Ge varje händelse en plats innan du kontrollerar.", "Use each position only once.": "Använd varje position bara en gång.", "Correct order.": "Rätt ordning.", "Answer every statement before checking.": "Besvara varje påstående innan du kontrollerar.", "Correct each statement that you marked false.": "Rätta varje påstående som du markerat som falskt.", "Write an answer before reviewing it.": "Skriv ett svar innan du granskar det.", "Review your response": "Granska ditt svar", "Check that your answer includes the following:": "Kontrollera att ditt svar innehåller följande:", "Show useful content points": "Visa förslag på innehåll", "Show corrections": "Visa rättelser", "True": "Sant", "False": "Falskt", "If false, write a corrected statement…": "Om falskt, skriv ett rättat påstående…", "Your answer": "Ditt svar", "Study notes": "Stödtext", "Session complete": "Övningen är avslutad"};
    function translateText(value) {
      let text = value;
      for (const [english, swedish] of Object.entries(translations).sort((a,b) => b[0].length-a[0].length)) text = text.split(english).join(swedish);
      return text.replace(/Question (\d+) of (\d+)/g, "Fråga $1 av $2")
        .replace(/(\d+) of (\d+) matches are correct\./g, "$1 av $2 svar är rätt.")
        .replace(/(\d+) of (\d+) positions are correct\./g, "$1 av $2 positioner är rätt.")
        .replace(/(\d+) of (\d+) true\/false choices are correct\./g, "$1 av $2 sant/falskt-svar är rätt.")
        .replace(/You completed (\d+) of (\d+) activities\./g, "Du har slutfört $1 av $2 uppgifter.")
        .replace(/(\d+)\/(\d+) activities/g, "$1/$2 uppgifter")
        .replace(/(\d+)\/(\d+) completed/g, "$1/$2 klara")
        .replace(/(\d+) words/g, "$1 ord");
    }
    // Translate visible text and placeholders, never IDs, classes or data attributes.
    function localise(value) {
      if (!isSwedish) return value;
      if (!/<[a-z][^>]*>/i.test(value)) return translateText(value);
      const template = document.createElement("template");
      template.innerHTML = value;
      const walker = document.createTreeWalker(template.content, 4);
      let node;
      while ((node = walker.nextNode())) node.nodeValue = translateText(node.nodeValue);
      template.content.querySelectorAll("[placeholder]").forEach(element => {
        element.setAttribute("placeholder", translateText(element.getAttribute("placeholder")));
      });
      return template.innerHTML;
    }
    const user = getAnonymousUser();
    const allProgress = loadProgress();
    const saved = allProgress[user.id]?.[material.id] || {};
    let level = material.levels.includes(saved.level) ? saved.level : material.levels[0];
    const practiceSections = material.practiceSections || [];
    let practiceSection = practiceSections.some(section => section.id === saved.practiceSection) ? saved.practiceSection : practiceSections[0]?.id;
    const sectionIndices = { ...(saved.sectionIndices || {}) };
    function filteredActivities() {
      return material.activities.filter(item => (item.level === "both" || item.level === level) && (!practiceSections.length || item.practiceSection === practiceSection));
    }
    let activities = filteredActivities();
    let index = Math.min(practiceSections.length ? (sectionIndices[practiceSection] || 0) : (saved.currentIndex || 0), Math.max(activities.length - 1, 0));
    let responses = saved.responses || {};

    const isVideo = material.mediaType === "youtube";
    const hasSuppliedTranscript = Array.isArray(material.transcript) && material.transcript.length > 0;
    const readingContent = hasSuppliedTranscript ? material.transcript : (material.text || []);
    const readingLabel = isVideo ? (hasSuppliedTranscript ? "Transcript" : material.sourceLead ? "Study notes" : "Transcript") : (material.transcriptLabel || "Reading");

    root.innerHTML = vocabularyTableStyle + localise(`
      <div class="container tutor-shell" lang="${isSwedish ? "sv" : "en"}">
        <header class="tutor-heading">
          <div>
            <h1>${material.title}</h1>
            <p class="tutor-muted">${material.topic}</p>
          </div>
          <label class="level-picker">Level
            <select id="tutorLevel">
              ${material.levels.map(item => `<option ${item === level ? "selected" : ""}>${item}</option>`).join("")}
            </select>
          </label>
        </header>

        <section class="tutor-panel">
          <h2>Before you begin</h2>
          <p>${material.introduction}</p>
          <div id="tutorKeyVocabulary">${getMaterialVocabulary(material, level).length ? `<details><summary>${isSwedish ? 'Viktiga begrepp' : 'Key vocabulary · English and Swedish'}</summary>${renderVocabularyTable(getMaterialVocabulary(material, level), isSwedish)}</details>` : ""}</div>
          ${material.sourceLead ? `<p class="source-line">${escapeHtml(material.sourceLead)} <a href="${escapeHtml(material.source.url)}" target="_blank" rel="noopener">${escapeHtml(material.source.label)}</a></p>` : ""}
          ${material.additionalSources ? `<ul>${material.additionalSources.map(source => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a></li>`).join("")}</ul>` : ""}

          <p class="tutor-muted">Your progress is saved on this device. A future version can connect it to your school Google account.</p>
        </section>

        ${material.lessonNotes?.length ? `<section class="tutor-panel"><h2>Kort stödtext</h2>${material.lessonNotes.map(note => `<p>${escapeHtml(note)}</p>`).join("")}</section>` : ""}
        ${material.resourceGroups?.length ? `<section class="tutor-panel"><h2>Material</h2>${material.resourceGroups.map(group => `<h3>${escapeHtml(group.title)}</h3><ul>${group.items.map(item => `<li style="margin:10px 0"><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" style="color:#ffd54f">${escapeHtml(item.label)}</a></li>`).join("")}</ul>`).join("")}</section>` : ""}

        ${material.readingPassages?.length ? `<section class="tutor-panel"><h2>Läs texterna</h2>${material.readingPassages.map(passage => `<details open><summary>${escapeHtml(passage.title)}</summary><p class="tutor-muted">${escapeHtml(passage.sourceLabel)}</p>${passage.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}</details>`).join("")}</section>` : ""}

        ${material.mediaType === "youtube" ? `
          <section class="tutor-panel video-panel">
            <div class="video-frame">
              <iframe id="tutorVideo" src="https://www.youtube-nocookie.com/embed/${material.videoId}${material.videoSections ? `?start=${material.videoSections[0].start}&end=${material.videoSections[0].end}` : ""}" title="${material.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            ${material.videoSections ? `<div class="video-sections">${material.videoSections.map((section, sectionIndex) => `<button class="btn video-section-btn ${sectionIndex === 0 ? "active" : ""}" data-video-section="${section.id}" data-start="${section.start}" data-end="${section.end}">${section.title}</button>`).join("")}</div>` : ""}
            <p class="tutor-muted">${readingLabel === "Study notes" ? "Watch and listen for the main idea. The study notes below are an overview, not a transcript." : "Watch and listen for the main idea. Use the transcript button below when you need support."}</p>
          </section>` : ""}

        ${material.showReading !== false ? `        <section class="tutor-panel reading-panel">
          <h2>${readingLabel}: ${material.title}</h2>
          <button type="button" class="btn" id="tutorReadingToggle" aria-expanded="true" aria-controls="tutorReadingContent">Hide ${readingLabel.toLowerCase()}</button>
          <div id="tutorReadingContent">
            <div class="reading-text">${readingContent.length ? readingContent.map(paragraph => `<p>${paragraph}</p>`).join("") : "<p>No transcript has been supplied for this video yet.</p>"}</div>
            <p class="source-line">${hasSuppliedTranscript ? "Transcript supplied for" : material.sourceLead || (isVideo ? "Transcript cleaned and punctuated from" : "Adapted from")} <a href="${material.source.url}" target="_blank" rel="noopener">${material.source.label}</a>.</p>
          </div>
        </section>` : ""}


        ${material.images?.length ? `<section class="tutor-panel historical-images"><h2>Examine the historical images</h2><p>${escapeHtml(material.imageIntroduction || "Describe what you can see, then distinguish your observations from your interpretation.")}</p>${material.images.map(item => `<figure style="margin:24px 0"><h3>${escapeHtml(item.title)}</h3><a href="${escapeHtml(item.src)}" target="_blank" rel="noopener"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" style="display:block;width:100%;max-width:800px;height:auto;margin:0 auto"></a><figcaption style="margin-top:12px;line-height:1.6">${escapeHtml(item.caption)}</figcaption>${item.transcription ? `<div class="tutor-panel" style="margin-top:16px"><h4>Handwritten note: transcription</h4><blockquote style="margin:12px 0">${escapeHtml(item.transcription)}</blockquote><p class="tutor-muted">Transcription supplied by your teacher. This is wording from the historical document.</p></div>` : ""}</figure>`).join("")}<p class="tutor-muted">Select an image to open the full-size version. Image-reflection questions follow the video questions.</p></section>` : ""}

        ${material.learningCards?.length ? `<section class="tutor-panel"><h2>Stöd för ditt lärande</h2>${material.learningCards.map(card => `<details><summary>${escapeHtml(card.title)}</summary><p>${escapeHtml(card.body)}</p></details>`).join("")}</section>` : ""}

        ${practiceSections.length ? `<section class="tutor-panel"><nav aria-label="Practice sections" style="display:flex;flex-wrap:wrap;gap:12px">${practiceSections.map(section => `<button type="button" class="btn" data-practice-section="${section.id}" aria-pressed="${section.id === practiceSection}" style="text-align:left;flex:1;min-width:140px"><strong>${escapeHtml(section.title)}</strong><br><span data-section-progress="${section.id}"></span></button>`).join("")}</nav><p id="tutorSectionDescription"></p><div id="tutorVocabularyList" ${practiceSection === "vocabulary" ? "" : "hidden"}><details><summary>${isSwedish ? 'Begreppslista: förklaringar och exempel' : 'Word list · English meanings, Swedish translations and examples'}</summary>${renderVocabularyTable(material.vocabularyList || [], isSwedish)}</details></div></section>` : ""}

        <section class="tutor-panel" aria-live="polite">
          <div class="progress-row">
            <span id="tutorCategory"></span>
            <span id="tutorProgress"></span>
          </div>
          <div class="progress-track"><div id="tutorProgressBar"></div></div>
          <div id="tutorQuestion"></div>
        </section>
      </div>
    `);

    const readingToggle = root.querySelector("#tutorReadingToggle");
    if (readingToggle) readingToggle.onclick = () => {
      const content = root.querySelector("#tutorReadingContent");
      content.hidden = !content.hidden;
      readingToggle.setAttribute("aria-expanded", String(!content.hidden));
      readingToggle.textContent = localise(`${content.hidden ? "Show" : "Hide"} ${readingLabel.toLowerCase()}`);
    };

    const levelSelect = root.querySelector("#tutorLevel");
    const video = root.querySelector("#tutorVideo");

    function openVideoSection(sectionId) {
      if (!video || !material.videoSections) return;
      const section = material.videoSections.find(item => item.id === sectionId);
      if (!section) return;
      video.src = `https://www.youtube-nocookie.com/embed/${material.videoId}?start=${section.start}&end=${section.end}&autoplay=1`;
      root.querySelectorAll(".video-section-btn").forEach(button => button.classList.toggle("active", button.dataset.videoSection === sectionId));
    }

    root.querySelectorAll(".video-section-btn").forEach(button => {
      button.onclick = () => openVideoSection(button.dataset.videoSection);
    });

    function persist() {
      allProgress[user.id] ||= {};
      allProgress[user.id][material.id] = {
        materialId: material.id,
        userId: user.id,
        level,
        currentIndex: index,
        ...(practiceSections.length ? { practiceSection, sectionIndices: { ...sectionIndices, [practiceSection]: index } } : {}),
        responses,
        updatedAt: new Date().toISOString()
      };
      if (practiceSections.length) sectionIndices[practiceSection] = index;
      saveProgress(allProgress);
      updatePracticeSections();
    }

    function updatePracticeSections() {
      if (!practiceSections.length) return;
      root.querySelectorAll("[data-practice-section]").forEach(button => {
        const id = button.dataset.practiceSection;
        const items = material.activities.filter(item => item.practiceSection === id && (item.level === "both" || item.level === level));
        button.setAttribute("aria-pressed", String(id === practiceSection));
        button.classList.toggle("primary-btn", id === practiceSection);
        button.querySelector("[data-section-progress]").textContent = localise(`${items.filter(item => responses[item.id]?.completed).length}/${items.length} completed`);
      });
      root.querySelector("#tutorSectionDescription").textContent = practiceSections.find(section => section.id === practiceSection)?.description || "";
      root.querySelector("#tutorVocabularyList").hidden = practiceSection !== "vocabulary";
    }
    root.querySelectorAll("[data-practice-section]").forEach(button => {
      button.onclick = () => {
        sectionIndices[practiceSection] = index;
        practiceSection = button.dataset.practiceSection;
        activities = filteredActivities();
        index = Math.min(sectionIndices[practiceSection] || 0, Math.max(activities.length - 1, 0));
        persist();
        renderQuestion();
      };
    });

    function renderSummary() {
      const completed = activities.filter(item => responses[item.id]?.completed).length;
      const correct = activities.filter(item => responses[item.id]?.correct === true).length;
      root.querySelector("#tutorCategory").textContent = localise("Session complete");
      root.querySelector("#tutorProgress").textContent = localise(`${completed}/${activities.length} activities`);
      root.querySelector("#tutorProgressBar").style.width = "100%";
      root.querySelector("#tutorQuestion").innerHTML = localise(`
        <div class="tutor-summary">
          <h2>Well done</h2>
          <p>You completed ${completed} of ${activities.length} activities.</p>
          <p>Automatically checked questions correct: ${correct}.</p>
          <p>Your written responses have been saved for later review.</p>
          <button class="btn" id="reviewTutor">Review from the beginning</button>
        </div>`);
      root.querySelector("#reviewTutor").onclick = () => { index = 0; persist(); renderQuestion(); };
    }

    function renderQuestion() {
      if (index >= activities.length) {
        renderSummary();
        return;
      }

      const activity = activities[index];
      if (activity.sectionId) openVideoSection(activity.sectionId);
      const response = responses[activity.id] || {};
      const percent = Math.round(((index + 1) / activities.length) * 100);
      root.querySelector("#tutorCategory").textContent = activity.category;
      root.querySelector("#tutorProgress").textContent = localise(`Question ${index + 1} of ${activities.length}`);
      root.querySelector("#tutorProgressBar").style.width = `${percent}%`;

      let answerArea;
      if (activity.type === "multiple-choice" || activity.type === "multiple-select") {
        const displayedOptions = shuffledOptions(activity, user.id);
        answerArea = `<div class="tutor-options">${displayedOptions.map(option => `
          <label class="tutor-option">
            <input type="${activity.type === "multiple-select" ? "checkbox" : "radio"}" name="tutorAnswer" value="${option.originalIndex}" ${activity.type === "multiple-select" ? (Array.isArray(response.answer) && response.answer.includes(option.originalIndex) ? "checked" : "") : (Number(response.answer) === option.originalIndex ? "checked" : "")}>
            <span>${option.label}</span>
          </label>`).join("")}</div>`;
      } else if (activity.type === "classification") {
        answerArea = `<div class="matching-list">${activity.items.map((item, itemIndex) => `<label class="matching-row"><span>${escapeHtml(item.text)}</span><select data-classify="${itemIndex}"><option value="">${isSwedish ? "Välj kategori…" : "Choose a category…"}</option>${activity.categories.map((category, categoryIndex) => `<option value="${categoryIndex}" ${response.answer?.[itemIndex] !== undefined && Number(response.answer[itemIndex]) === categoryIndex ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select></label>`).join("")}</div>`;
      } else if (activity.type === "matching") {
        const definitions = shuffledOptions(
          { id: activity.id, options: activity.pairs.map(pair => pair.definition) },
          user.id
        );
        answerArea = `<div class="matching-list">${activity.pairs.map((pair, pairIndex) => `
          <label class="matching-row">
            <strong>${pair.term}</strong>
            <select data-match="${pairIndex}">
              <option value="">${escapeHtml(activity.choiceLabel || "Choose a meaning…")}</option>
              ${definitions.map(option => `<option value="${option.originalIndex}" ${Number(response.answer?.[pairIndex]) === option.originalIndex ? "selected" : ""}>${option.label}</option>`).join("")}
            </select>
          </label>`).join("")}</div>`;
      } else if (activity.type === "ordering") {
        const displayedItems = shuffledOptions(
          { id: activity.id, options: activity.items },
          user.id
        );
        answerArea = `<div class="ordering-list">${displayedItems.map(item => `
          <label class="ordering-row">
            <select data-order="${item.originalIndex}">
              <option value="">–</option>
              ${activity.items.map((_, position) => `<option value="${position + 1}" ${Number(response.answer?.[item.originalIndex]) === position + 1 ? "selected" : ""}>${position + 1}</option>`).join("")}
            </select>
            <span>${item.label}</span>
          </label>`).join("")}</div>`;
      } else if (activity.type === "true-false") {
        answerArea = `<div class="true-false-list">${activity.statements.map((statement, statementIndex) => `
          <fieldset class="true-false-item" data-statement="${statementIndex}">
            <legend>${statementIndex + 1}. ${statement.text}</legend>
            <label><input type="radio" name="tf-${statementIndex}" value="true" ${response.answer?.[statementIndex]?.value === true ? "checked" : ""}> True</label>
            <label><input type="radio" name="tf-${statementIndex}" value="false" ${response.answer?.[statementIndex]?.value === false ? "checked" : ""}> False</label>
            <textarea class="tf-correction" rows="2" placeholder="If false, write a corrected statement…">${escapeHtml(response.answer?.[statementIndex]?.correction || "")}</textarea>
          </fieldset>`).join("")}</div>`;
      } else {
        answerArea = `
          <textarea id="tutorWrittenAnswer" class="tutor-textarea" rows="${activity.type === "extended-answer" ? 10 : 5}" placeholder="Write your answer here…">${escapeHtml(response.answer || "")}</textarea>
          <div class="word-count" id="tutorWordCount">${wordCount(response.answer || "")} words</div>`;
      }

      root.querySelector("#tutorQuestion").innerHTML = localise(`
        <h2 class="question-title">${formatQuestionPrompt(activity)}</h2>
        ${answerArea}
        <div class="tutor-actions">
          <button class="btn" id="tutorHint">Hint</button>
          <button class="btn primary-btn" id="tutorCheck">${["multiple-choice", "multiple-select", "classification", "matching", "ordering", "true-false"].includes(activity.type) ? "Check answer" : "Save and review"}</button>
        </div>
        <div id="tutorFeedback"></div>
        <div class="tutor-navigation">
          <button class="btn" id="tutorPrevious" ${index === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn" id="tutorNext">${index === activities.length - 1 ? "Finish" : "Next →"}</button>
        </div>`);

      const written = root.querySelector("#tutorWrittenAnswer");
      if (written) {
        written.addEventListener("input", () => {
          root.querySelector("#tutorWordCount").textContent = localise(`${wordCount(written.value)} words`);
          responses[activity.id] = { ...responses[activity.id], answer: written.value };
          persist();
        });
      }

      root.querySelector("#tutorHint").onclick = () => {
        const feedback = root.querySelector("#tutorFeedback");
        feedback.innerHTML = localise(`<div class="feedback hint-feedback"><strong>Hint:</strong> ${activity.hint}</div>`);
        responses[activity.id] = { ...responses[activity.id], hintUsed: true };
        persist();
      };

      root.querySelector("#tutorCheck").onclick = () => {
        const feedback = root.querySelector("#tutorFeedback");
        if (activity.type === "multiple-choice") {
          const selected = root.querySelector('input[name="tutorAnswer"]:checked');
          if (!selected) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Choose an answer first.</div>`);
            return;
          }
          const answer = Number(selected.value);
          const correct = answer === activity.answer;
          responses[activity.id] = { answer, correct, completed: true, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = localise(`<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correct ? "Correct." : "Not quite."}</strong> ${activity.explanation}</div>`);
        } else if (activity.type === "multiple-select") {
          const answer = [...root.querySelectorAll('input[name="tutorAnswer"]:checked')].map(input => Number(input.value));
          if (!answer.length) { feedback.innerHTML = `<div class="feedback error-feedback">${isSwedish ? "Välj minst ett alternativ först." : "Select an option first."}</div>`; return; }
          const result = evaluateMultipleSelection(answer, activity.answers);
          responses[activity.id] = { answer, correct: result.correct, completed: true, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = `<div class="feedback ${result.correct ? "correct-feedback" : "error-feedback"}"><strong>${result.correct ? "✔ Alla val är rätt." : `✖ ${result.missing.length} rätta alternativ saknas och ${result.extra.length} felaktiga alternativ är valda.`}</strong><p>${escapeHtml(activity.explanation)}</p></div>`;
        } else if (activity.type === "classification") {
          const selects = [...root.querySelectorAll("[data-classify]")];
          if (selects.some(select => select.value === "")) { feedback.innerHTML = `<div class="feedback error-feedback">Välj en kategori för varje påstående.</div>`; return; }
          const answer = Object.fromEntries(selects.map(select => [select.dataset.classify, Number(select.value)]));
          const checked = evaluateClassification(activity.items, answer);
          const correctCount = checked.filter(item => item.correct).length;
          const correct = correctCount === activity.items.length;
          responses[activity.id] = { answer, correct, correctCount, completed: true, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = `<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correctCount} av ${activity.items.length} kategorier är rätt.</strong><ul>${checked.map(item => `<li>${item.correct ? "✔" : "✖"} ${escapeHtml(activity.items[item.index].text)} <strong>${escapeHtml(activity.categories[activity.items[item.index].answer])}</strong> — ${escapeHtml(activity.items[item.index].explanation)}</li>`).join("")}</ul><p>${escapeHtml(activity.explanation)}</p></div>`;
        } else if (activity.type === "matching") {
          const selects = [...root.querySelectorAll("[data-match]")];
          if (selects.some(select => select.value === "")) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Match every word before checking.</div>`);
            return;
          }
          const answer = Object.fromEntries(selects.map(select => [select.dataset.match, Number(select.value)]));
          const correctCount = activity.pairs.filter((_, pairIndex) => answer[pairIndex] === pairIndex).length;
          const correct = correctCount === activity.pairs.length;
          responses[activity.id] = { answer, correct, completed: true, correctCount, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = localise(`<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correct ? "All matches are correct." : `${correctCount} of ${activity.pairs.length} matches are correct.`}</strong> ${activity.explanation}</div>`);
        } else if (activity.type === "ordering") {
          const selects = [...root.querySelectorAll("[data-order]")];
          if (selects.some(select => select.value === "")) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Give every event a position before checking.</div>`);
            return;
          }
          const positions = selects.map(select => Number(select.value));
          if (new Set(positions).size !== positions.length) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Use each position only once.</div>`);
            return;
          }
          const answer = Object.fromEntries(selects.map(select => [select.dataset.order, Number(select.value)]));
          const correctCount = activity.items.filter((_, itemIndex) => answer[itemIndex] === itemIndex + 1).length;
          const correct = correctCount === activity.items.length;
          responses[activity.id] = { answer, correct, completed: true, correctCount, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = localise(`<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correct ? "Correct order." : `${correctCount} of ${activity.items.length} positions are correct.`}</strong> ${activity.explanation}</div>`);
        } else if (activity.type === "true-false") {
          const statementBlocks = [...root.querySelectorAll("[data-statement]")];
          const unanswered = statementBlocks.some((block, statementIndex) => !block.querySelector(`input[name="tf-${statementIndex}"]:checked`));
          if (unanswered) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Answer every statement before checking.</div>`);
            return;
          }
          const answer = statementBlocks.map((block, statementIndex) => ({
            value: block.querySelector(`input[name="tf-${statementIndex}"]:checked`).value === "true",
            correction: block.querySelector(".tf-correction").value.trim()
          }));
          const missingCorrections = activity.statements.some((statement, statementIndex) => statement.answer === false && answer[statementIndex].value === false && !answer[statementIndex].correction);
          if (missingCorrections) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Correct each statement that you marked false.</div>`);
            return;
          }
          const correctCount = activity.statements.filter((statement, statementIndex) => answer[statementIndex].value === statement.answer).length;
          const correct = correctCount === activity.statements.length;
          responses[activity.id] = { answer, correct, completed: true, correctCount, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          const corrections = activity.statements.filter(statement => statement.answer === false).map(statement => `<li>${statement.correction}</li>`).join("");
          feedback.innerHTML = localise(`<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correctCount} of ${activity.statements.length} true/false choices are correct.</strong> ${activity.explanation}<details><summary>Show corrections</summary><ul>${corrections}</ul></details></div>`);
        } else {
          const answer = written.value.trim();
          if (!answer) {
            feedback.innerHTML = localise(`<div class="feedback error-feedback">Write an answer before reviewing it.</div>`);
            return;
          }
          responses[activity.id] = { ...responses[activity.id], answer, completed: true, submittedAt: new Date().toISOString() };
          feedback.innerHTML = localise(`
            <div class="feedback review-feedback">
              <strong>Review your response</strong>
              <p>Check that your answer includes the following:</p>
              <ul>${activity.checklist.map(item => `<li>${item}</li>`).join("")}</ul>
              <details><summary>Show useful content points</summary><ul>${activity.modelPoints.map(item => `<li>${item}</li>`).join("")}</ul></details>
            </div>`);
        }
        persist();
      };

      root.querySelector("#tutorPrevious").onclick = () => { if (index > 0) { index--; persist(); renderQuestion(); } };
      root.querySelector("#tutorNext").onclick = () => { index++; persist(); renderQuestion(); };
    }

    levelSelect.onchange = () => {
      level = levelSelect.value;
      const vocabularyRoot = root.querySelector("#tutorKeyVocabulary");
      const words = getMaterialVocabulary(material, level);
      vocabularyRoot.innerHTML = words.length ? `<details><summary>${isSwedish ? 'Viktiga begrepp' : 'Key vocabulary · English and Swedish'}</summary>${renderVocabularyTable(words, isSwedish)}</details>` : '';
      activities = filteredActivities();
      index = 0;
      persist();
      renderQuestion();
    };

    updatePracticeSections();
    renderQuestion();
  }
};

export default tutor;
