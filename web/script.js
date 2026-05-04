document.addEventListener("DOMContentLoaded", function () {

  const startButton = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");
  const homeScreen = document.getElementById("home-screen");

  const htmlCard = document.getElementById("html-arena-card");
  const cssCard = document.getElementById("css-card");
  const jsCard = document.getElementById("js-card");

  const xpDisplay = document.getElementById("xp-value");
  const cssLock = document.getElementById("css-lock");
  const jsLock = document.getElementById("js-lock");

  // START BUTTON
  if (startButton) {
    startButton.addEventListener("click", function () {
      startScreen.style.display = "none";
      homeScreen.style.display = "block";
    });
  }

  // HTML ARENA
  if (htmlCard) {
    htmlCard.addEventListener("click", function () {
      window.location.href = "html-map.html";
    });
  }

  // CSS CIRCUIT (UNLOCK AFTER HTML BOSS)
  if (cssCard) {
    cssCard.addEventListener("click", function () {
      const htmlLevel = parseInt(localStorage.getItem("html-level")) || 1;

      if (htmlLevel >= 8) {
        window.location.href = "css-map.html";
      } else {
        alert("Finish all HTML missions and Boss Mode first!");
      }
    });
  }

  // JS CORE (LOCKED FOR NOW)
  if (jsCard) {
    jsCard.addEventListener("click", function () {
      alert("JS Core is locked. Complete HTML and CSS first!");
    });
  }

  // XP DISPLAY
  const xp = parseInt(localStorage.getItem("xp")) || 0;

  if (xpDisplay) {
    xpDisplay.innerText = xp;
  }

  // LOCK STATUS
  const htmlLevel = parseInt(localStorage.getItem("html-level")) || 1;

  if (cssLock) {
    cssLock.innerText = htmlLevel >= 8 ? "✅ Unlocked" : "🔒 Locked";
  }

  if (jsLock) {
    jsLock.innerText = "🔒 Locked";
  }

  // NAV ACTIVE STATE
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();

      navItems.forEach(function (nav) {
        nav.classList.remove("active");
      });

      item.classList.add("active");
    });
  });

  // PARTICLES EFFECT
  const particlesContainer = document.getElementById("particles");

  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement("div");
      dot.className = "particle";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.animationDuration = 6 + Math.random() * 10 + "s";
      dot.style.animationDelay = Math.random() * 10 + "s";
      dot.style.width = 1 + Math.random() * 2 + "px";
      dot.style.height = dot.style.width;

      particlesContainer.appendChild(dot);
    }
  }

});