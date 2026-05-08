const bgMusic = document.getElementById("bg-music");

if (bgMusic) {
  const savedVolume = parseFloat(localStorage.getItem("music-volume"));
  const savedTime = parseFloat(localStorage.getItem("bg-music-time"));
  const musicEnabled = localStorage.getItem("music-enabled") !== "false";

  bgMusic.volume = isNaN(savedVolume) ? 0.6 : savedVolume;

  if (!isNaN(savedTime)) {
    bgMusic.currentTime = savedTime;
  }

  function playMusic() {
    if (!musicEnabled) return;

    bgMusic.play().catch(() => {});
  }

  if (musicEnabled) {
    playMusic();
  } else {
    bgMusic.pause();
  }

  document.addEventListener("click", playMusic, { once: true });
  document.addEventListener("keydown", playMusic, { once: true });

  setInterval(() => {
    if (!bgMusic.paused) {
      localStorage.setItem("bg-music-time", bgMusic.currentTime);
    }
  }, 500);

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("bg-music-time", bgMusic.currentTime);
  });
}