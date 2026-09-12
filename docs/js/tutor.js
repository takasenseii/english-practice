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
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
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
  const options = activity.options.map((label, originalIndex) => ({
    label,
    originalIndex
  }));

  let seed = hashString(`${userId}:${activity.id}`);

  for (let i = options.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}

export default {
  render(root) {
    const material = tutorMaterials[0];
    const user = getAnonymousUser();
    const allProgress = loadProgress();
    const saved = allProgress[user.id]?.[material.id] || {};

    let level = saved.level || "B1";
    let activities = material.activities.filter(
      item => item.level === "B1" || item.level === level
    );

    let index = Math.min(
      saved.currentIndex || 0,
      Math.max(activities.length - 1, 0)
    );

    let responses = saved.responses || {};

    root.innerHTML = `
      <div class="container tutor-shell">
        <header class="tutor-heading">
          <div>
            <div class="pill tutor-pill">AI Tutor prototype</div>
            <h1>${material.title}</h1>
            <p class="tutor-muted">${material.topic}</p>
          </div>

          <label class="level-picker">
            Level
            <select id="tutorLevel">
              ${material.levels.map(item =>
                `<option ${item === level ? "selected" : ""}>${item}</option>`
              ).join("")}
            </select>
          </label>
        </header>

        <section class="tutor-panel">
          <h2>Before you begin</h2>
          <p>${material.introduction}</p>
          <p class="tutor-muted">
            Your progress is saved on this device. A future version can
            connect it to your school Google account.
          </p>
        </section>

        <details class="tutor-panel reading-panel" open>
          <summary>Reading: ${material.title}</summary>

          <div class="reading-text">
            ${material.text.map(paragraph =>
              `<p>${paragraph}</p>`
            ).join("")}
          </div>

          <p class="source-line">
            Adapted from
            <a
              href="${material.source.url}"
              target="_blank"
              rel="noopener"
            >
              ${material.source.label}
            </a>.
          </p>
        </details>

        <section class="tutor-panel" aria-live="polite">
          <div class="progress-row">
            <span id="tutorCategory"></span>
            <span id="tutorProgress"></span>
          </div>

          <div class="progress-track">
            <div id="tutorProgressBar"></div>
          </div>

          <div id="tutorQuestion"></div>
        </section>
      </div>
    `;

    const levelSelect = root.querySelector("#tutorLevel");

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
      const completed = activities.filter(
        item => responses[item.id]?.completed
      ).length;

      const correct = activities.filter(
        item => responses[item.id]?.correct === true
      ).length;

      root.querySelector("#tutorCategory").textContent =
        "Session complete";

      root.querySelector("#tutorProgress").textContent =
        `${completed}/${activities.length} activities`;

      root.querySelector("#tutorProgressBar").style.width = "100%";

      root.querySelector("#tutorQuestion").innerHTML = `
        <div class="tutor-summary">
          <h2>Well done</h2>

          <p>
            You completed ${completed} of ${activities.length} activities.
          </p>

          <p>
            Automatically checked questions correct: ${correct}.
          </p>

          <p>
            Your written responses have been saved for later review.
          </p>

          <button class="btn" id="reviewTutor">
            Review from the beginning
          </button>
        </div>
      `;

      root.querySelector("#reviewTutor").onclick = () => {
        index = 0;
        persist();
        renderQuestion();
      };
    }

    function renderQuestion() {
      if (index >= activities.length) {
        renderSummary();
        return;
      }

      const activity = activities[index];
      const response = responses[activity.id] || {};
      const percent = Math.round(
        ((index + 1) / activities.length) * 100
      );

      root.querySelector("#tutorCategory").textContent =
        activity.category;

      root.querySelector("#tutorProgress").textContent =
        `Question ${index + 1} of ${activities.length}`;

      root.querySelector("#tutorProgressBar").style.width =
        `${percent}%`;

      let answerArea;

      if (activity.type === "multiple-choice") {
        const displayedOptions = shuffledOptions(
          activity,
          user.id
        );

        answerArea = `
          <div class="tutor-options">
            ${displayedOptions.map(option => `
              <label class="tutor-option">
                <input
                  type="radio"
                  name="tutorAnswer"
                  value="${option.originalIndex}"
                  ${
                    Number(response.answer) === option.originalIndex
                      ? "checked"
                      : ""
                  }
                >

                <span>${option.label}</span>
              </label>
            `).join("")}
          </div>
        `;
      } else {
        answerArea = `
          <textarea
            id="tutorWrittenAnswer"
            class="tutor-textarea"
            rows="${activity.type === "extended-answer" ? 10 : 5}"
            placeholder="Write your answer here…"
          >${escapeHtml(response.answer || "")}</textarea>

          <div class="word-count" id="tutorWordCount">
            ${wordCount(response.answer || "")} words
          </div>
        `;
      }

      root.querySelector("#tutorQuestion").innerHTML = `
        <h2 class="question-title">
          ${activity.prompt}
        </h2>

        ${answerArea}

        <div class="tutor-actions">
          <button class="btn" id="tutorHint">
            Hint
          </button>

          <button class="btn primary-btn" id="tutorCheck">
            ${
              activity.type === "multiple-choice"
                ? "Check answer"
                : "Save and review"
            }
          </button>
        </div>

        <div id="tutorFeedback"></div>

        <div class="tutor-navigation">
          <button
            class="btn"
            id="tutorPrevious"
            ${index === 0 ? "disabled" : ""}
          >
            ← Previous
          </button>

          <button class="btn" id="tutorNext">
            ${
              index === activities.length - 1
                ? "Finish"
                : "Next →"
            }
          </button>
        </div>
      `;

      const written = root.querySelector(
        "#tutorWrittenAnswer"
      );

      if (written) {
        written.addEventListener("input", () => {
          root.querySelector("#tutorWordCount").textContent =
            `${wordCount(written.value)} words`;

          responses[activity.id] = {
            ...responses[activity.id],
            answer: written.value
          };

          persist();
        });
      }

      root.querySelector("#tutorHint").onclick = () => {
        const feedback = root.querySelector("#tutorFeedback");

        feedback.innerHTML = `
          <div class="feedback hint-feedback">
            <strong>Hint:</strong> ${activity.hint}
          </div>
        `;

        responses[activity.id] = {
          ...responses[activity.id],
          hintUsed: true
        };

        persist();
      };

      root.querySelector("#tutorCheck").onclick = () => {
        const feedback = root.querySelector("#tutorFeedback");

        if (activity.type === "multiple-choice") {
          const selected = root.querySelector(
            'input[name="tutorAnswer"]:checked'
          );

          if (!selected) {
            feedback.innerHTML = `
              <div class="feedback error-feedback">
                Choose an answer first.
              </div>
            `;

            return;
          }

          const answer = Number(selected.value);
          const correct = answer === activity.answer;

          responses[activity.id] = {
            answer,
            correct,
            completed: true,
            checkedAt: new Date().toISOString(),
            hintUsed: response.hintUsed || false
          };

          feedback.innerHTML = `
            <div class="feedback ${
              correct
                ? "correct-feedback"
                : "error-feedback"
            }">
              <strong>
                ${correct ? "Correct." : "Not quite."}
              </strong>

              ${activity.explanation}
            </div>
          `;
        } else {
          const answer = written.value.trim();

          if (!answer) {
            feedback.innerHTML = `
              <div class="feedback error-feedback">
                Write an answer before reviewing it.
              </div>
            `;

            return;
          }

          responses[activity.id] = {
            ...responses[activity.id],
            answer,
            completed: true,
            submittedAt: new Date().toISOString()
          };

          feedback.innerHTML = `
            <div class="feedback review-feedback">
              <strong>Review your response</strong>

              <p>
                Check that your answer includes the following:
              </p>

              <ul>
                ${activity.checklist.map(item =>
                  `<li>${item}</li>`
                ).join("")}
              </ul>

              <details>
                <summary>Show useful content points</summary>

                <ul>
                  ${activity.modelPoints.map(item =>
                    `<li>${item}</li>`
                  ).join("")}
                </ul>
              </details>
            </div>
          `;
        }

        persist();
      };

      root.querySelector("#tutorPrevious").onclick = () => {
        if (index > 0) {
          index--;
          persist();
          renderQuestion();
        }
      };

      root.querySelector("#tutorNext").onclick = () => {
        index++;
        persist();
        renderQuestion();
      };
    }

    levelSelect.onchange = () => {
      level = levelSelect.value;

      activities = material.activities.filter(
        item => item.level === "B1" || item.level === level
      );

      index = 0;
      persist();
      renderQuestion();
    };

    renderQuestion();
  }
};
