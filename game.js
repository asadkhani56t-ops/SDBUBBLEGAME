document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("playNow");

  if (playButton) {
    playButton.addEventListener("click", () => {
      window.location.href = "game.html";
    });
  }
});
