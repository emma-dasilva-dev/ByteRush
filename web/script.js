document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.querySelector(".btn-start");
  const startScreen = document.getElementById("start-screen");
  const dashboard = document.getElementById("dashboard");

  if (startButton && startScreen && dashboard) {
    startButton.addEventListener("click", function () {
      startScreen.style.display = "none";
      dashboard.style.display = "block";
    });
  }
});
