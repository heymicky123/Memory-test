(function () {
  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  });

  // When done: swap stage for identical-looking but scrollable container
  var patched = false;
  var styleAdded = false;

  function addScrollbarStyle() {
    if (styleAdded) return;
    styleAdded = true;
    var s = document.createElement("style");
    s.textContent = ".done-scroll::-webkit-scrollbar{display:none}";
    document.head.appendChild(s);
  }

  new MutationObserver(function () {
    // Export button only exists in done mode
    var exportBtn = Array.from(document.querySelectorAll("button")).find(
      function (b) { return b.textContent.trim() === "Export \u2192"; }
    );
    if (!exportBtn) { patched = false; return; }
    if (patched) return;
    patched = true;

    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage) return;

    // Collect word spans (filter out gradient/cursor spans)
    var words = Array.from(stage.querySelectorAll("span"))
      .filter(function (s) { return s.textContent.trim().length > 0; })
      .map(function (s) { return s.textContent; });
    if (!words.length) return;

    addScrollbarStyle();

    // Build scrollable replacement — identical height and gradients
    var wrap = document.createElement("div");
    wrap.className = "done-scroll";
    wrap.style.cssText = stage.style.cssText +
      ";overflow-y:auto;scrollbar-width:none;position:relative";

    // Top gradient
    var gt = document.createElement("div");
    gt.style.cssText = "position:absolute;top:0;left:0;right:0;height:64px;" +
      "background:linear-gradient(to bottom,#FCFBF8 30%,transparent 100%);z-index:2;pointer-events:none";
    wrap.appendChild(gt);

    // Bottom gradient
    var gb = document.createElement("div");
    gb.style.cssText = "position:absolute;bottom:0;left:0;right:0;height:48px;" +
      "background:linear-gradient(to top,#FCFBF8 20%,transparent 100%);z-index:2;pointer-events:none";
    wrap.appendChild(gb);

    // Words
    var inner = document.createElement("div");
    inner.style.cssText = "font-size:19px;color:#000;line-height:1.75;" +
      "word-break:keep-all;overflow-wrap:break-word;padding-bottom:32px";
    words.forEach(function (w) {
      var sp = document.createElement("span");
      sp.style.cssText = "display:inline-block;margin-right:0.28em";
      sp.textContent = w;
      inner.appendChild(sp);
    });
    wrap.appendChild(inner);

    stage.replaceWith(wrap);

    // Scroll to bottom so latest words are visible (same as replay end)
    wrap.scrollTop = wrap.scrollHeight;
  }).observe(document.body, { childList: true, subtree: true });
})();
