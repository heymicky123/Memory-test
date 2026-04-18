(function () {
  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  });

  // When done: replace the fixed stage with a scrollable full-text view
  var patched = false;
  var observer = new MutationObserver(function () {
    // "Export →" button appears only when mode === "done"
    var exportBtn = Array.from(document.querySelectorAll("button")).find(
      function (b) { return b.textContent.trim() === "Export →"; }
    );
    if (!exportBtn) { patched = false; return; }
    if (patched) return;
    patched = true;

    // Find the 160px stage
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage) return;

    // Collect all word spans from the stage
    var spans = stage.querySelectorAll("span[style*='inline-block']");
    var words = Array.from(spans).map(function (s) { return s.textContent; });
    if (!words.length) return;

    // Build scrollable replacement
    var scroll = document.createElement("div");
    scroll.style.cssText = [
      "max-height:280px",
      "overflow-y:auto",
      "margin-bottom:56px",
      "font-size:19px",
      "color:#000",
      "line-height:1.75",
      "word-break:keep-all",
      "overflow-wrap:break-word",
      "padding:4px 0 24px",
      "animation:fadeUp 0.4s ease-out",
    ].join(";");

    words.forEach(function (w) {
      var sp = document.createElement("span");
      sp.style.cssText = "display:inline-block;margin-right:0.28em";
      sp.textContent = w;
      scroll.appendChild(sp);
    });

    stage.replaceWith(scroll);
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
})();
