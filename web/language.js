let currentLanguage =
  localStorage.getItem("byteRushLanguage") || "en";

function t(key) {
  return translations[currentLanguage][key] || key;
}

function applyLanguage(language) {
  currentLanguage = language;

  localStorage.setItem(
    "byteRushLanguage",
    language
  );

  document.documentElement.lang = language;

  document
    .querySelectorAll("[data-key]")
    .forEach((element) => {

      const key =
        element.getAttribute("data-key");

      if (
        translations[language] &&
        translations[language][key]
      ) {
        element.textContent =
          translations[language][key];
      }
    });

  const toggle =
    document.getElementById("language-toggle");

  if (toggle) {
    toggle.textContent =
      language === "en" ? "FR" : "EN";
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    applyLanguage(currentLanguage);

    const toggle =
      document.getElementById("language-toggle");

    if (toggle) {

      toggle.addEventListener(
        "click",
        () => {

          const nextLanguage =
            currentLanguage === "en"
              ? "fr"
              : "en";

          applyLanguage(nextLanguage);
        }
      );
    }
  }
);