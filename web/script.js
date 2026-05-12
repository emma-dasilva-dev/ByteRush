document.addEventListener("DOMContentLoaded", function () {

  const startButton = document.getElementById("start-btn");

  const cssCard = document.getElementById("css-card");
  const jsCard = document.getElementById("js-card");

  const xpDisplay = document.getElementById("xp-value");
  const streakDisplay = document.getElementById("streak-value");
  const rankDisplay = document.getElementById("player-rank");

  const cssLock = document.getElementById("css-lock");
  const jsLock = document.getElementById("js-lock");

  const htmlStatus = document.getElementById("html-status");
  const cssStatus = document.getElementById("css-status");
  const jsStatus = document.getElementById("js-status");

  /*
    BYTE RUSH PROGRESSION SETTINGS

    Each world now has 10 missions.

    Mission completion should work like this:
    - HTML Mission 10 completed => html-level becomes 11
    - CSS Mission 10 completed => css-level becomes 11
    - JS Mission 10 completed => js-level becomes 11

    Level 11 means the world is fully completed.
  */
  const TOTAL_MISSIONS_PER_WORLD = 10;
  const COMPLETED_LEVEL = TOTAL_MISSIONS_PER_WORLD + 1;

  // START BUTTON
  if (startButton) {
    startButton.addEventListener("click", function () {
      window.location.href = "dashboard.html";
    });
  }

  // DATA
  const xp = parseInt(localStorage.getItem("xp")) || 0;
  const streak = parseInt(localStorage.getItem("streak")) || 0;

  const htmlLevel = parseInt(localStorage.getItem("html-level")) || 1;
  const cssLevel = parseInt(localStorage.getItem("css-level")) || 0;
  const jsLevel = parseInt(localStorage.getItem("js-level")) || 0;

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

  // HELPER: DISPLAY WORLD MISSION STATUS SAFELY
  function getMissionStatus(level) {
    if (level >= COMPLETED_LEVEL) {
      return "Completed";
    }

    if (level <= 0) {
      return "Locked";
    }

    return "Mission " + level;
  }

  // HTML PROGRESS
  if (htmlStatus) {
    htmlStatus.innerText = getMissionStatus(htmlLevel);
  }

  // CSS LOCK / STATUS
  const cssUnlocked = htmlLevel >= COMPLETED_LEVEL;

  if (cssLock) {
    cssLock.innerText = cssUnlocked ? "✅ Unlocked" : "🔒 Locked";
  }

  if (cssStatus) {
    cssStatus.innerText = cssUnlocked ? getMissionStatus(cssLevel || 1) : "Locked";
  }

  // JS LOCK / STATUS
  const jsUnlocked = cssLevel >= COMPLETED_LEVEL;

  if (jsLock) {
    jsLock.innerText = jsUnlocked ? "✅ Unlocked" : "🔒 Locked";
  }

  if (jsStatus) {
    jsStatus.innerText = jsUnlocked ? getMissionStatus(jsLevel || 1) : "Locked";
  }

  // CLICK HANDLERS
  if (cssCard) {
    cssCard.addEventListener("click", function () {
      if (cssUnlocked) {
        window.location.href = "css-map.html";
      } else {
        alert("Complete all 10 HTML missions first!");
      }
    });
  }

  if (jsCard) {
    jsCard.addEventListener("click", function () {
      if (jsUnlocked) {
        window.location.href = "js-map.html";
      } else {
        alert("Complete all 10 CSS missions first!");
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