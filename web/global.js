const languageToggle = document.getElementById("language-toggle");

let currentLanguage = localStorage.getItem("byteRushLanguage") || "en";

function applyGlobalLanguage() {
  document.documentElement.lang = currentLanguage;

  if (languageToggle) {
    languageToggle.textContent = currentLanguage === "en" ? "FR" : "EN";
  }

  document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
    element.textContent =
      currentLanguage === "en"
        ? element.getAttribute("data-en")
        : element.getAttribute("data-fr");
  });
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "fr" : "en";
    localStorage.setItem("byteRushLanguage", currentLanguage);
    applyGlobalLanguage();
    playClickSound();
  });
}

applyGlobalLanguage();

const sounds = {
  click: new Audio("sounds/click.mp3"),
  success: new Audio("sounds/success.mp3"),
  error: new Audio("sounds/error.mp3"),
  hover: new Audio("sounds/hover.mp3"),
  start: new Audio("sounds/start.mp3")
};

Object.values(sounds).forEach((sound) => {
  sound.volume = 0.35;
});

function playSound(name) {
  if (!sounds[name]) return;

  sounds[name].currentTime = 0;
  sounds[name].play().catch(() => {});
}

function playClickSound() {
  playSound("click");
}

function playSuccessSound() {
  playSound("success");
}

function playErrorSound() {
  playSound("error");
}

function playStartSound() {
  playSound("start");
}

document.querySelectorAll("button, a, .mode-card, .arena-card, .mission-card").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    playSound("hover");
  });

  item.addEventListener("click", () => {
    playSound("click");
  });
});