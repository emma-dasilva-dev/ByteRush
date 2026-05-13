const ByteRushProjects = (function () {
  function getItem(key, fallback = "") {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("localStorage is not available.");
    }
  }

  function getXP() {
    const xp = parseInt(getItem("xp", "0"), 10);
    return Number.isNaN(xp) ? 0 : xp;
  }

  function setXP(value) {
    setItem("xp", String(value));
  }

  function getPlayerName() {
    return getItem("playerName", "Code Explorer") || "Code Explorer";
  }

  function getStatus(projectId) {
    return getItem(projectId + "-status", "not-started");
  }

  function setStatus(projectId, status) {
    setItem(projectId + "-status", status);
  }

  function niceStatus(status) {
    if (status === "completed") return "Completed";
    if (status === "in-progress") return "In Progress";
    return "Not Started";
  }

  function initDashboard() {
    const xpDisplay = document.getElementById("xpDisplay");
    const playerNameDisplay = document.getElementById("playerNameDisplay");

    if (xpDisplay) xpDisplay.textContent = getXP();
    if (playerNameDisplay) playerNameDisplay.textContent = getPlayerName();

    const projectCards = document.querySelectorAll("[data-project-card]");
    projectCards.forEach(function (card) {
      const projectId = card.getAttribute("data-project-card");
      const status = getStatus(projectId);
      card.classList.remove("not-started", "in-progress", "completed");
      card.classList.add(status);

      const label = document.querySelector('[data-status-label="' + projectId + '"]');
      if (label) {
        label.textContent = niceStatus(status);
        label.classList.remove("not-started", "in-progress", "completed");
        label.classList.add(status);
      }
    });
  }

  function addXPOnce(projectId, amount) {
    const key = projectId + "-xp-claimed";

    if (getItem(key, "false") === "true") {
      return false;
    }

    const currentXP = getXP();
    setXP(currentXP + amount);
    setItem(key, "true");
    return true;
  }

  function createBasePage(config) {
    const body = document.body;

    body.innerHTML = `
      <main class="project-shell">
        <header class="topbar">
          <div>
            <p class="eyebrow">BYTE RUSH PROJECT BUILD</p>
            <h2>${config.title}</h2>
          </div>

          <div class="topbar-stats">
            <div class="stat-box">
              <span>DIFFICULTY</span>
              <strong>${config.difficulty}</strong>
            </div>

            <div class="stat-box">
              <span>XP REWARD</span>
              <strong>+${config.xp}</strong>
            </div>

            <div class="stat-box">
              <span>STATUS</span>
              <strong id="projectStatusDisplay">In Progress</strong>
            </div>

            <div class="stat-box">
              <span>PLAYER</span>
              <strong id="playerNameDisplay">${getPlayerName()}</strong>
            </div>
          </div>
        </header>

        <section class="project-layout">
          <aside class="guide-panel">
            <span class="step-count" id="stepCount">MISSION STEP 1 / 1</span>
            <h1 class="step-title" id="stepTitle">Step Title</h1>

            <div class="info-block">
              <h3>WHAT YOU ARE DOING</h3>
              <p id="stepObjective"></p>
            </div>

            <div class="info-block">
              <h3>WHY IT MATTERS</h3>
              <p id="stepWhy"></p>
            </div>

            <div class="info-block">
              <h3>TYPE THIS</h3>
              <pre class="code-sample" id="stepCode"></pre>
            </div>

            <div class="info-block">
              <h3>PREVIEW CHECK</h3>
              <p id="stepPreview"></p>
            </div>

            <div class="step-actions">
              <button class="secondary-btn" id="prevStepBtn">Previous Step</button>
              <button class="primary-btn" id="checkStepBtn">Check Step</button>
              <button class="secondary-btn" id="nextStepBtn">Next Step</button>
              <button class="primary-btn" id="completeProjectBtn">Complete Project</button>
            </div>

            <div class="completed-list" id="stepDots"></div>
          </aside>

          <section class="preview-panel">
            <span class="game-label">LIVE BUILD STATION</span>

            <div class="editor-grid">
              <div class="editor-box">
                <label for="htmlCode">HTML</label>
                <textarea id="htmlCode" spellcheck="false"></textarea>
              </div>

              <div class="editor-box">
                <label for="cssCode">CSS</label>
                <textarea id="cssCode" spellcheck="false"></textarea>
              </div>

              <div class="editor-box">
                <label for="jsCode">JAVASCRIPT</label>
                <textarea id="jsCode" spellcheck="false"></textarea>
              </div>
            </div>

            <div class="preview-stage">
              <span class="game-label">PROJECT OUTPUT</span>
              <div class="preview-window" id="previewWindow"></div>
            </div>
          </section>
        </section>

        <section class="feedback-row">
          <div class="feedback-console" id="feedbackConsole">
            <h3>FEEDBACK CONSOLE</h3>
            <p id="feedbackText">SYSTEM READY: Start the first mission step.</p>
          </div>

          <div class="hint-panel">
            <h3>HINT AREA</h3>
            <p id="hintText">Follow the current step. Keep your code small and clear.</p>
          </div>
        </section>

        <footer class="bottom-actions">
          <a href="../projects.html" class="secondary-btn">← RETURN TO PROJECT LAB</a>
        </footer>
      </main>

      <div class="modal-backdrop" id="completionModal">
        <div class="completion-modal">
          <p class="eyebrow">BUILD COMPLETE</p>
          <h2 id="modalTitle">${config.completeTitle}</h2>
          <p id="modalMessage">${config.completeMessage}</p>
          <p class="xp-reward">+${config.xp} XP</p>
          <a href="../projects.html" class="primary-btn">Return to Project Lab</a>
        </div>
      </div>
    `;
  }

  function createProjectPage(config) {
    createBasePage(config);

    const projectId = config.projectId;

    if (getStatus(projectId) !== "completed") {
      setStatus(projectId, "in-progress");
    }

    const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const jsCode = document.getElementById("jsCode");
    const previewWindow = document.getElementById("previewWindow");

    const stepCount = document.getElementById("stepCount");
    const stepTitle = document.getElementById("stepTitle");
    const stepObjective = document.getElementById("stepObjective");
    const stepWhy = document.getElementById("stepWhy");
    const stepCode = document.getElementById("stepCode");
    const stepPreview = document.getElementById("stepPreview");
    const hintText = document.getElementById("hintText");
    const feedbackText = document.getElementById("feedbackText");
    const feedbackConsole = document.getElementById("feedbackConsole");
    const projectStatusDisplay = document.getElementById("projectStatusDisplay");
    const completionModal = document.getElementById("completionModal");

    const prevStepBtn = document.getElementById("prevStepBtn");
    const nextStepBtn = document.getElementById("nextStepBtn");
    const checkStepBtn = document.getElementById("checkStepBtn");
    const completeProjectBtn = document.getElementById("completeProjectBtn");
    const stepDots = document.getElementById("stepDots");

    let currentStep = 0;
    let checkedSteps = loadCheckedSteps();

    htmlCode.value = getItem(projectId + "-html", config.startHTML || "");
    cssCode.value = getItem(projectId + "-css", config.startCSS || "");
    jsCode.value = getItem(projectId + "-js", config.startJS || "");

    function loadCheckedSteps() {
      const saved = getItem(projectId + "-checked-steps", "");
      if (!saved) return [];
      return saved.split(",").filter(Boolean).map(Number);
    }

    function saveCheckedSteps() {
      setItem(projectId + "-checked-steps", checkedSteps.join(","));
    }

    function isStepChecked(index) {
      return checkedSteps.includes(index);
    }

    function markStepChecked(index) {
      if (!isStepChecked(index)) {
        checkedSteps.push(index);
        saveCheckedSteps();
      }
    }

    function normalize(value) {
      return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
    }

    function setFeedback(type, message) {
      feedbackConsole.classList.remove("success", "error");

      if (type === "success") {
        feedbackConsole.classList.add("success");
      }

      if (type === "error") {
        feedbackConsole.classList.add("error");
      }

      feedbackText.textContent = message;
    }

    function updateProjectStatus() {
      const status = getStatus(projectId);
      projectStatusDisplay.textContent = niceStatus(status);
    }

    function saveCode() {
      setItem(projectId + "-html", htmlCode.value);
      setItem(projectId + "-css", cssCode.value);
      setItem(projectId + "-js", jsCode.value);
    }

    function runPreview() {
      saveCode();

      previewWindow.innerHTML = "";

      const style = document.createElement("style");
      style.textContent = cssCode.value;

      const output = document.createElement("div");
      output.innerHTML = htmlCode.value;

      previewWindow.appendChild(style);
      previewWindow.appendChild(output);

      if (jsCode.value.trim()) {
        try {
          const runUserCode = new Function("preview", `
            const document = preview;
            ${jsCode.value}
          `);
          runUserCode(previewWindow);
        } catch (error) {
          setFeedback("error", "SYSTEM CHECK FAILED: JavaScript has an error. Look for missing brackets, quotes, or spelling mistakes.");
        }
      }
    }

    function renderStep() {
      const step = config.steps[currentStep];

      stepCount.textContent = "MISSION STEP " + (currentStep + 1) + " / " + config.steps.length;
      stepTitle.textContent = step.title;
      stepObjective.textContent = step.objective;
      stepWhy.textContent = step.why;
      stepCode.textContent = step.code || "";
      stepPreview.textContent = step.preview;
      hintText.textContent = step.hint || "Read the current mission carefully and check the preview.";

      prevStepBtn.disabled = currentStep === 0;
      nextStepBtn.disabled = currentStep === config.steps.length - 1;

      renderDots();
      updateProjectStatus();
      runPreview();
    }

    function renderDots() {
      stepDots.innerHTML = "";

      config.steps.forEach(function (_, index) {
        const dot = document.createElement("span");
        dot.className = "step-dot" + (isStepChecked(index) ? " done" : "");
        dot.textContent = index + 1;
        stepDots.appendChild(dot);
      });
    }

    function checkCurrentStep() {
      runPreview();

      const step = config.steps[currentStep];

      const api = {
        html: htmlCode.value,
        css: cssCode.value,
        js: jsCode.value,
        preview: previewWindow,
        normalize: normalize,
        has: function (area, text) {
          return normalize(area).includes(normalize(text));
        }
      };

      const result = step.check(api);

      if (result.pass) {
        markStepChecked(currentStep);
        setFeedback("success", result.message || "STEP ONLINE: Good work. The preview has been updated.");
        renderDots();
      } else {
        setFeedback("error", result.message || "SYSTEM CHECK FAILED: Check the mission instructions and try again.");
      }
    }

    function completeProject() {
      const allChecked = config.steps.every(function (_, index) {
        return isStepChecked(index);
      });

      if (!allChecked) {
        setFeedback("error", "SYSTEM CHECK FAILED: Complete and check every mission step before finishing the project.");
        return;
      }

      setStatus(projectId, "completed");
      addXPOnce(projectId, config.xp);
      updateProjectStatus();
      completionModal.classList.add("show");
    }

    htmlCode.addEventListener("input", runPreview);
    cssCode.addEventListener("input", runPreview);
    jsCode.addEventListener("input", runPreview);

    prevStepBtn.addEventListener("click", function () {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    });

    nextStepBtn.addEventListener("click", function () {
      if (currentStep < config.steps.length - 1) {
        currentStep++;
        renderStep();
      }
    });

    checkStepBtn.addEventListener("click", checkCurrentStep);
    completeProjectBtn.addEventListener("click", completeProject);

    renderStep();
  }

  return {
    initDashboard: initDashboard,
    createProjectPage: createProjectPage,
    getItem: getItem,
    setItem: setItem
  };
})();