(function () {
  const isProjectPage = window.location.pathname.includes("/project-files/");
  const audioBase = isProjectPage ? "../project-audio/" : "project-audio/";

  const sounds = {
    hover: audioBase + "project-hover.wav",
    select: audioBase + "project-select.wav",
    open: audioBase + "project-open.wav",
    unlock: audioBase + "project-unlock.wav",
    complete: audioBase + "project-complete.wav",
    locked: audioBase + "project-locked.wav",
    boss: audioBase + "project-boss-intro.wav",
    ambient: audioBase + "project-ambient.mp3"
  };

  const audioCache = {};
  let ambientAudio = null;

  function safeGet(key, fallback = "") {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function getAudioOn() {
    return safeGet("project-audio-on", "on") !== "off";
  }

  function setAudioOn(value) {
    safeSet("project-audio-on", value ? "on" : "off");
    updateAudioButton();
    if (!value && ambientAudio) ambientAudio.pause();
  }

  function playSound(name, volume = 0.28) {
    if (!getAudioOn()) return;

    const src = sounds[name];
    if (!src) return;

    try {
      if (!audioCache[name]) {
        audioCache[name] = new Audio(src);
      }

      const audio = audioCache[name];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {}
  }

  function startAmbient() {
    if (!getAudioOn()) return;

    try {
      ambientAudio = new Audio(sounds.ambient);
      ambientAudio.loop = true;
      ambientAudio.volume = 0.08;
      ambientAudio.play().catch(() => {});
    } catch (e) {}
  }

  function getXP() {
    return Number(safeGet("xp", "0")) || 0;
  }

  function setXP(value) {
    safeSet("xp", String(value));
    const xpValue = document.getElementById("xpValue");
    if (xpValue) xpValue.textContent = value;
  }

  function addXPOnce(projectId, amount) {
    const claimKey = `project-${projectId}-xp-claimed`;

    if (safeGet(claimKey, "no") === "yes") {
      return false;
    }

    const nextXP = getXP() + amount;
    setXP(nextXP);
    safeSet(claimKey, "yes");
    return true;
  }

  function getPlayerName() {
    const name = safeGet("player-name", "Builder");
    return name && name.trim() ? name.trim() : "Builder";
  }

  function setProjectStatus(projectId, status) {
    safeSet(`project-${projectId}-status`, status);
  }

  function getProjectStatus(projectId) {
    return safeGet(`project-${projectId}-status`, "not-started");
  }

  function prettyStatus(status) {
    if (status === "completed") return "Completed";
    if (status === "in-progress") return "In Progress";
    return "Not Started";
  }

  function updateAudioButton() {
    const btn = document.getElementById("audioToggle");
    if (!btn) return;
    btn.textContent = getAudioOn() ? "PROJECT AUDIO: ON" : "PROJECT AUDIO: OFF";
  }

  function setupAudioToggle() {
    updateAudioButton();

    const btn = document.getElementById("audioToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      setAudioOn(!getAudioOn());
      playSound("select", 0.22);
    });
  }

  function setupDashboard() {
    const playerName = document.getElementById("playerName");
    const xpValue = document.getElementById("xpValue");

    if (playerName) playerName.textContent = getPlayerName();
    if (xpValue) xpValue.textContent = getXP();

    for (let i = 1; i <= 6; i++) {
      const label = document.getElementById(`project-${i}-status-label`);
      const status = getProjectStatus(i);

      if (label) {
        label.textContent = prettyStatus(status);
        label.className = `project-status ${status}`;
      }
    }

    document.querySelectorAll("[data-project-link]").forEach(card => {
      card.addEventListener("mouseenter", () => playSound("hover", 0.13));
      card.addEventListener("click", () => playSound("open", 0.3));
    });

    setupAudioToggle();
  }

  function initProjectPage(config) {
    if (!config) return;

    const projectId = config.id;

    if (getProjectStatus(projectId) !== "completed") {
      setProjectStatus(projectId, "in-progress");
    }

    const playerName = document.getElementById("playerName");
    const xpValue = document.getElementById("xpValue");
    const statusLabel = document.getElementById("projectStatus");

    if (playerName) playerName.textContent = getPlayerName();
    if (xpValue) xpValue.textContent = getXP();
    if (statusLabel) statusLabel.textContent = prettyStatus(getProjectStatus(projectId));

    if (projectId === 6) playSound("boss", 0.2);

    let currentStep = 0;
    const completedSteps = new Set();

    const stepCounter = document.getElementById("stepCounter");
    const stepTitle = document.getElementById("stepTitle");
    const stepExplain = document.getElementById("stepExplain");
    const stepTask = document.getElementById("stepTask");
    const stepHint = document.getElementById("stepHint");
    const stepDots = document.getElementById("stepDots");
    const feedback = document.getElementById("feedbackText");
    const preview = document.getElementById("projectPreview");

    const prevBtn = document.getElementById("prevStepBtn");
    const nextBtn = document.getElementById("nextStepBtn");
    const checkBtn = document.getElementById("checkStepBtn");
    const completeBtn = document.getElementById("completeProjectBtn");

    function renderStepDots() {
      if (!stepDots) return;

      stepDots.innerHTML = config.steps.map((step, index) => {
        const done = completedSteps.has(index) ? "done" : "";
        return `<div class="step-dot ${done}">Step ${index + 1}: ${done ? "Online" : "Waiting"}</div>`;
      }).join("");
    }

    function renderPreview() {
      if (!preview || typeof config.renderPreview !== "function") return;
      preview.innerHTML = config.renderPreview();
      if (typeof config.afterRender === "function") {
        config.afterRender();
      }
    }

    function setFeedback(message, type = "normal") {
      if (!feedback) return;

      const prefix = type === "success" ? "SYSTEM ONLINE:" : type === "error" ? "REPAIR NEEDED:" : "SYSTEM VOICE:";
      feedback.innerHTML = `<strong>${prefix}</strong> ${message}`;
    }

    function renderStep() {
      const step = config.steps[currentStep];

      stepCounter.textContent = `STEP ${currentStep + 1} / ${config.steps.length}`;
      stepTitle.textContent = step.title;
      stepExplain.textContent = step.explain;
      stepTask.innerHTML = step.task;
      stepHint.textContent = step.hint;

      prevBtn.disabled = currentStep === 0;
      nextBtn.disabled = currentStep === config.steps.length - 1;

      renderStepDots();
      renderPreview();

      setFeedback(step.console || "Follow the current step, then check it when ready.");
    }

    function checkCurrentStep() {
      const step = config.steps[currentStep];
      const result = typeof step.validate === "function" ? step.validate() : { ok: true };

      if (result.ok) {
        completedSteps.add(currentStep);
        playSound("unlock", 0.25);
        setFeedback(result.message || "Step repaired. The build is getting stronger.", "success");
        renderStepDots();
        renderPreview();
      } else {
        playSound("locked", 0.22);
        setFeedback(result.message || "Something is missing in this step.", "error");
      }
    }

    function completeProject() {
      if (completedSteps.size < config.steps.length) {
        playSound("locked", 0.2);
        setFeedback(`Complete all ${config.steps.length} steps before finishing the build.`, "error");
        return;
      }

      setProjectStatus(projectId, "completed");
      const claimed = addXPOnce(projectId, config.xp);

      playSound("complete", 0.42);

      const modal = document.getElementById("completeModal");
      const modalTitle = document.getElementById("completeTitle");
      const modalReward = document.getElementById("completeReward");
      const modalMessage = document.getElementById("completeMessage");

      modalTitle.textContent = config.completeTitle || `${config.name} Online`;
      modalReward.textContent = claimed ? `+${config.xp} XP` : `XP already claimed`;
      modalMessage.textContent = config.completeMessage || "You built something real with code.";

      if (statusLabel) statusLabel.textContent = "Completed";
      if (xpValue) xpValue.textContent = getXP();

      modal.classList.add("show");
    }

    document.querySelectorAll("input, textarea, select").forEach(input => {
      input.addEventListener("input", renderPreview);
      input.addEventListener("change", renderPreview);
    });

    document.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("mouseenter", () => playSound("hover", 0.11));
    });

    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        playSound("select", 0.2);
        renderStep();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentStep < config.steps.length - 1) {
        currentStep++;
        playSound("select", 0.2);
        renderStep();
      }
    });

    checkBtn.addEventListener("click", checkCurrentStep);
    completeBtn.addEventListener("click", completeProject);

    const returnBtn = document.getElementById("returnLabBtn");
    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        playSound("open", 0.25);
        window.location.href = "../projects.html";
      });
    }

    const modalReturn = document.getElementById("modalReturnBtn");
    if (modalReturn) {
      modalReturn.addEventListener("click", () => {
        window.location.href = "../projects.html";
      });
    }

    setupAudioToggle();
    renderStep();
  }

  window.BRProjects = {
    safeGet,
    safeSet,
    getXP,
    setXP,
    getPlayerName,
    playSound,
    getProjectStatus,
    setProjectStatus,
    initProjectPage
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "dashboard") {
      setupDashboard();
    }

    if (window.BRProjectConfig) {
      initProjectPage(window.BRProjectConfig);
    }
  });
})();