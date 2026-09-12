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

const tutor = {
  render(root, materialId) {
    const material = tutorMaterials.find(item => item.id === materialId) || tutorMaterials[0];
    const user = getAnonymousUser();
    const allProgress = loadProgress();
    const saved = allProgress[user.id]?.[material.id] || {};
    let level = saved.level || "B1";
    let activities = material.activities.filter(item => item.level === "both" || item.level === level);
    let index = Math.min(saved.currentIndex || 0, Math.max(activities.length - 1, 0));
    let responses = saved.responses || {};

    root.innerHTML = `
      <div class="container tutor-shell">
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
          <p class="tutor-muted">Your progress is saved on this device. A future version can connect it to your school Google account.</p>
        </section>

        ${material.mediaType === "youtube" ? `
          <section class="tutor-panel video-panel">
            <div class="video-frame">
              <iframe id="tutorVideo" src="https://www.youtube-nocookie.com/embed/${material.videoId}${material.videoSections ? `?start=${material.videoSections[0].start}&end=${material.videoSections[0].end}` : ""}" title="${material.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            ${material.videoSections ? `<div class="video-sections">${material.videoSections.map((section, sectionIndex) => `<button class="btn video-section-btn ${sectionIndex === 0 ? "active" : ""}" data-video-section="${section.id}" data-start="${section.start}" data-end="${section.end}">${section.title}</button>`).join("")}</div>` : ""}
            <p class="tutor-muted">First viewing: keep the transcript closed and listen for the main idea.</p>
          </section>` : ""}

        ${material.hideTranscript ? "" : `<details class="tutor-panel reading-panel" ${material.mediaType === "youtube" ? "" : "open"}>
          <summary>${material.transcriptLabel || "Reading"}: ${material.title}</summary>
          <div class="reading-text">${material.text.map(paragraph => `<p>${paragraph}</p>`).join("")}</div>
          <p class="source-line">${material.mediaType === "youtube" ? "Transcript cleaned and punctuated from" : "Adapted from"} <a href="${material.source.url}" target="_blank" rel="noopener">${material.source.label}</a>.</p>
        </details>`}

        <section class="tutor-panel" aria-live="polite">
          <div class="progress-row">
            <span id="tutorCategory"></span>
            <span id="tutorProgress"></span>
          </div>
          <div class="progress-track"><div id="tutorProgressBar"></div></div>
          <div id="tutorQuestion"></div>
        </section>
      </div>
    `;

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
        responses,
        updatedAt: new Date().toISOString()
      };
      saveProgress(allProgress);
    }

    function renderSummary() {
      const completed = activities.filter(item => responses[item.id]?.completed).length;
      const correct = activities.filter(item => responses[item.id]?.correct === true).length;
      root.querySelector("#tutorCategory").textContent = "Session complete";
      root.querySelector("#tutorProgress").textContent = `${completed}/${activities.length} activities`;
      root.querySelector("#tutorProgressBar").style.width = "100%";
      root.querySelector("#tutorQuestion").innerHTML = `
        <div class="tutor-summary">
          <h2>Well done</h2>
          <p>You completed ${completed} of ${activities.length} activities.</p>
          <p>Automatically checked questions correct: ${correct}.</p>
          <p>Your written responses have been saved for later review.</p>
          <button class="btn" id="reviewTutor">Review from the beginning</button>
        </div>`;
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
      root.querySelector("#tutorProgress").textContent = `Question ${index + 1} of ${activities.length}`;
      root.querySelector("#tutorProgressBar").style.width = `${percent}%`;

      let answerArea;
      if (activity.type === "multiple-choice") {
        const displayedOptions = shuffledOptions(activity, user.id);
        answerArea = `<div class="tutor-options">${displayedOptions.map(option => `
          <label class="tutor-option">
            <input type="radio" name="tutorAnswer" value="${option.originalIndex}" ${Number(response.answer) === option.originalIndex ? "checked" : ""}>
            <span>${option.label}</span>
          </label>`).join("")}</div>`;
      } else if (activity.type === "matching") {
        const definitions = shuffledOptions(
          { id: activity.id, options: activity.pairs.map(pair => pair.definition) },
          user.id
        );
        answerArea = `<div class="matching-list">${activity.pairs.map((pair, pairIndex) => `
          <label class="matching-row">
            <strong>${pair.term}</strong>
            <select data-match="${pairIndex}">
              <option value="">Choose a meaning…</option>
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

      root.querySelector("#tutorQuestion").innerHTML = `
        <h2 class="question-title">${activity.prompt}</h2>
        ${answerArea}
        <div class="tutor-actions">
          <button class="btn" id="tutorHint">Hint</button>
          <button class="btn primary-btn" id="tutorCheck">${["multiple-choice", "matching", "ordering", "true-false"].includes(activity.type) ? "Check answer" : "Save and review"}</button>
        </div>
        <div id="tutorFeedback"></div>
        <div class="tutor-navigation">
          <button class="btn" id="tutorPrevious" ${index === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn" id="tutorNext">${index === activities.length - 1 ? "Finish" : "Next →"}</button>
        </div>`;

      const written = root.querySelector("#tutorWrittenAnswer");
      if (written) {
        written.addEventListener("input", () => {
          root.querySelector("#tutorWordCount").textContent = `${wordCount(written.value)} words`;
          responses[activity.id] = { ...responses[activity.id], answer: written.value };
          persist();
        });
      }

      root.querySelector("#tutorHint").onclick = () => {
        const feedback = root.querySelector("#tutorFeedback");
        feedback.innerHTML = `<div class="feedback hint-feedback"><strong>Hint:</strong> ${activity.hint}</div>`;
        responses[activity.id] = { ...responses[activity.id], hintUsed: true };
        persist();
      };

      root.querySelector("#tutorCheck").onclick = () => {
        const feedback = root.querySelector("#tutorFeedback");
        if (activity.type === "multiple-choice") {
          const selected = root.querySelector('input[name="tutorAnswer"]:checked');
          if (!selected) {
            feedback.innerHTML = `<div class="feedback error-feedback">Choose an answer first.</div>`;
            return;
          }
          const answer = Number(selected.value);
          const correct = answer === activity.answer;
          responses[activity.id] = { answer, correct, completed: true, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = `<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correct ? "Correct." : "Not quite."}</strong> ${activity.explanation}</div>`;
        } else if (activity.type === "matching") {
          const selects = [...root.querySelectorAll("[data-match]")];
          if (selects.some(select => select.value === "")) {
            feedback.innerHTML = `<div class="feedback error-feedback">Match every word before checking.</div>`;
            return;
          }
          const answer = Object.fromEntries(selects.map(select => [select.dataset.match, Number(select.value)]));
          const correctCount = activity.pairs.filter((_, pairIndex) => answer[pairIndex] === pairIndex).length;
          const correct = correctCount === activity.pairs.length;
          responses[activity.id] = { answer, correct, completed: true, correctCount, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = `<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correct ? "All matches are correct." : `${correctCount} of ${activity.pairs.length} matches are correct.`}</strong> ${activity.explanation}</div>`;
        } else if (activity.type === "ordering") {
          const selects = [...root.querySelectorAll("[data-order]")];
          if (selects.some(select => select.value === "")) {
            feedback.innerHTML = `<div class="feedback error-feedback">Give every event a position before checking.</div>`;
            return;
          }
          const positions = selects.map(select => Number(select.value));
          if (new Set(positions).size !== positions.length) {
            feedback.innerHTML = `<div class="feedback error-feedback">Use each position only once.</div>`;
            return;
          }
          const answer = Object.fromEntries(selects.map(select => [select.dataset.order, Number(select.value)]));
          const correctCount = activity.items.filter((_, itemIndex) => answer[itemIndex] === itemIndex + 1).length;
          const correct = correctCount === activity.items.length;
          responses[activity.id] = { answer, correct, completed: true, correctCount, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          feedback.innerHTML = `<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correct ? "Correct order." : `${correctCount} of ${activity.items.length} positions are correct.`}</strong> ${activity.explanation}</div>`;
        } else if (activity.type === "true-false") {
          const statementBlocks = [...root.querySelectorAll("[data-statement]")];
          const unanswered = statementBlocks.some((block, statementIndex) => !block.querySelector(`input[name="tf-${statementIndex}"]:checked`));
          if (unanswered) {
            feedback.innerHTML = `<div class="feedback error-feedback">Answer every statement before checking.</div>`;
            return;
          }
          const answer = statementBlocks.map((block, statementIndex) => ({
            value: block.querySelector(`input[name="tf-${statementIndex}"]:checked`).value === "true",
            correction: block.querySelector(".tf-correction").value.trim()
          }));
          const missingCorrections = activity.statements.some((statement, statementIndex) => statement.answer === false && answer[statementIndex].value === false && !answer[statementIndex].correction);
          if (missingCorrections) {
            feedback.innerHTML = `<div class="feedback error-feedback">Correct each statement that you marked false.</div>`;
            return;
          }
          const correctCount = activity.statements.filter((statement, statementIndex) => answer[statementIndex].value === statement.answer).length;
          const correct = correctCount === activity.statements.length;
          responses[activity.id] = { answer, correct, completed: true, correctCount, checkedAt: new Date().toISOString(), hintUsed: responses[activity.id]?.hintUsed || false };
          const corrections = activity.statements.filter(statement => statement.answer === false).map(statement => `<li>${statement.correction}</li>`).join("");
          feedback.innerHTML = `<div class="feedback ${correct ? "correct-feedback" : "error-feedback"}"><strong>${correctCount} of ${activity.statements.length} true/false choices are correct.</strong> ${activity.explanation}<details><summary>Show corrections</summary><ul>${corrections}</ul></details></div>`;
        } else {
          const answer = written.value.trim();
          if (!answer) {
            feedback.innerHTML = `<div class="feedback error-feedback">Write an answer before reviewing it.</div>`;
            return;
          }
          responses[activity.id] = { ...responses[activity.id], answer, completed: true, submittedAt: new Date().toISOString() };
          feedback.innerHTML = `
            <div class="feedback review-feedback">
              <strong>Review your response</strong>
              <p>Check that your answer includes the following:</p>
              <ul>${activity.checklist.map(item => `<li>${item}</li>`).join("")}</ul>
              <details><summary>Show useful content points</summary><ul>${activity.modelPoints.map(item => `<li>${item}</li>`).join("")}</ul></details>
            </div>`;
        }
        persist();
      };

      root.querySelector("#tutorPrevious").onclick = () => { if (index > 0) { index--; persist(); renderQuestion(); } };
      root.querySelector("#tutorNext").onclick = () => { index++; persist(); renderQuestion(); };
    }

    levelSelect.onchange = () => {
      level = levelSelect.value;
      activities = material.activities.filter(item => item.level === "both" || item.level === level);
      index = 0;
      persist();
      renderQuestion();
    };

    renderQuestion();
  }
};

export default tutor;
