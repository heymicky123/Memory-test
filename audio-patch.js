(function () {
  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");
  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  });
})();
