document.addEventListener("DOMContentLoaded", function () {

  const startButton = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");
  const homeScreen = document.getElementById("home-screen");

  const cssCard = document.getElementById("css-card");
  const jsCard = document.getElementById("js-card");

  const xpDisplay = document.getElementById("xp-value");
  const streakDisplay = document.getElementById("streak-value");
  const rankDisplay = document.getElementById("player-rank");

  const cssLock = document.getElementById("css-lock");
  const jsLock = document.getElementById("js-lock");

  const htmlStatus = document.getElementById("html-status");
  const cssStatus = document.getElementById("css-status");

  // START BUTTON
  if (startButton) {
    startButton.addEventListener("click", function () {
      startScreen.style.display = "none";
      homeScreen.style.display = "block";
    });
  }

  // DATA
  const xp = parseInt(localStorage.getItem("xp")) || 0;
  const streak = parseInt(localStorage.getItem("streak")) || 0;
  const htmlLevel = parseInt(localStorage.getItem("html-level")) || 1;
  const cssLevel = parseInt(localStorage.getItem("css-level")) || 0;

  // DISPLAY XP + STREAK
  if (xpDisplay) xpDisplay.innerText = xp;
  if (streakDisplay) streakDisplay.innerText = streak;

  // RANK SYSTEM
  function getRank(xp) {
    if (xp < 50) return "Rookie Coder";
    if (xp < 150) return "Syntax Apprentice";
    if (xp < 300) return "Code Builder";
    if (xp < 600) return "System Hacker";
    return "ByteRush Master";
  }

  if (rankDisplay) {
    rankDisplay.innerText = getRank(xp);
  }

  // HTML PROGRESS
  if (htmlStatus) {
    htmlStatus.innerText = "Mission " + htmlLevel;
  }

  // CSS LOCK / STATUS
  if (cssLock) {
    cssLock.innerText = htmlLevel >= 7 ? "✅ Unlocked" : "🔒 Locked";
  }

  if (cssStatus) {
    cssStatus.innerText = htmlLevel >= 7 ? "Mission " + (cssLevel || 1) : "Locked";
  }

  // JS LOCK
  if (jsLock) {
    jsLock.innerText = cssLevel >= 7 ? "✅ Unlocked" : "🔒 Locked";
  }

  // CLICK HANDLERS
  if (cssCard) {
    cssCard.addEventListener("click", function () {
      if (htmlLevel >= 7) {
        window.location.href = "css-map.html";
      } else {
        alert("Finish HTML Arena first!");
      }
    });
  }

  if (jsCard) {
    jsCard.addEventListener("click", function () {
      if (cssLevel >= 7) {
        alert("JS Core coming next!");
      } else {
        alert("Complete CSS Circuit first!");
      }
    });
  }

  // SIDEBAR ACTIVE STATE
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // PARTICLES
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