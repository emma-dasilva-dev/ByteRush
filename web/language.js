let currentLanguage = localStorage.getItem("byteRushLanguage") || "en";


function translateElement(element, language) {
  const key = element.getAttribute("data-key");
  if (!key) return;
  // Fallback automatique sur l'anglais
  const value = (translations[language] && translations[language][key])
    || (translations['en'] && translations['en'][key])
    || '';

  // Si l'élément est un input, textarea ou select, on traduit les attributs pertinents
  if (element.placeholder !== undefined) {
    if (element.hasAttribute('data-placeholder')) {
      const phKey = element.getAttribute('data-placeholder');
      element.placeholder = (translations[language] && translations[language][phKey])
        || (translations['en'] && translations['en'][phKey])
        || '';
    }
  }
  if (element.title !== undefined) {
    if (element.hasAttribute('data-title')) {
      const tKey = element.getAttribute('data-title');
      element.title = (translations[language] && translations[language][tKey])
        || (translations['en'] && translations['en'][tKey])
        || '';
    }
  }
  if (element.hasAttribute('data-alt')) {
    const altKey = element.getAttribute('data-alt');
    element.alt = (translations[language] && translations[language][altKey])
      || (translations['en'] && translations['en'][altKey])
      || '';
  }
  if (element.hasAttribute('data-aria-label')) {
    const ariaKey = element.getAttribute('data-aria-label');
    element.setAttribute('aria-label', (translations[language] && translations[language][ariaKey])
      || (translations['en'] && translations['en'][ariaKey])
      || '');
  }
  if (element.hasAttribute('data-value')) {
    const valueKey = element.getAttribute('data-value');
    element.value = (translations[language] && translations[language][valueKey])
      || (translations['en'] && translations['en'][valueKey])
      || '';
  }
  // Texte par défaut
  if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
    element.textContent = value;
  }
}

function applyLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("byteRushLanguage", language);
  document.documentElement.lang = language;

  document.querySelectorAll("[data-key]").forEach((element) => {
    translateElement(element, language);
  });

  const toggle = document.getElementById("language-toggle");
  if (toggle) {
    toggle.textContent = language === "en" ? "FR" : "EN";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLanguage);

  const toggle = document.getElementById("language-toggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const nextLanguage = currentLanguage === "en" ? "fr" : "en";
      applyLanguage(nextLanguage);
    });
  }
});