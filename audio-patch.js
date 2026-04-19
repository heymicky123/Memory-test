(function () {
  var BAR_COUNT = Math.floor((390 - 80 + 1.5) / 3.5); // 89 bars @ 2px wide, 1.5px gap, 40px padding each side
  var BAR_HEIGHTS = (function () {
    var seed = 42;
    var rand = function () {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };
    var result = [];
    for (var i = 0; i < BAR_COUNT; i++) {
      var t = i / BAR_COUNT;
      var slow = (Math.sin(t * Math.PI * 4) + 1) / 2;
      var fast = (Math.sin(t * Math.PI * 18) + 1) / 2;
      var noise = rand();
      result.push(Math.round(4 + (slow * 0.3 + fast * 0.3 + noise * 0.4) * 24));
    }
    return result;
  })();

  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");
  var bars = [];
  var rafId = null;

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
      for (var i = 0; i < bars.length; i++) bars[i].style.backgroundColor = "#DDD8D0";
      if (rafId) cancelAnimationFrame(rafId);
      var loop = function () {
        if (audio.paused || audio.ended) { rafId = null; return; }
        var progress = audio.currentTime / (audio.duration || 1);
        for (var i = 0; i < bars.length; i++) {
          bars[i].style.backgroundColor = (i / BAR_COUNT < progress) ? "#6B5E4E" : "#DDD8D0";
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }
  });

  var observer = new MutationObserver(function () {
    var btns = document.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim() === "Export \u2192") btns[i].style.display = "none";
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function patch() {
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage || stage.dataset.phonePatch) return;
    stage.dataset.phonePatch = "1";

    var col = stage.parentNode;
    var appDiv = col.parentNode;
    var root = appDiv.parentNode;

    var styleEl = document.createElement("style");
    styleEl.textContent = [
      "html{margin:0!important;padding:0!important;background:#1A1A18!important}",
      "body{margin:0!important;padding:0!important;background:#1A1A18!important}",
      "#root{margin:0!important;padding:0!important;width:100%!important;min-height:100vh!important;background:#1A1A18!important;display:flex!important;align-items:center!important;justify-content:center!important}",
      "#ov-shell>div{min-height:0!important;height:100%!important;overflow:hidden!important;padding-bottom:80px!important}"
    ].join("");
    document.head.appendChild(styleEl);

    var shell = document.createElement("div");
    shell.id = "ov-shell";
    shell.style.cssText = "width:390px;height:844px;border-radius:50px;background-color:#1C1C1A;box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.06);flex-shrink:0;position:relative;overflow:hidden;";
    root.insertBefore(shell, appDiv);
    shell.appendChild(appDiv);

    var waveform = document.createElement("div");
    waveform.style.cssText = "position:absolute;bottom:40px;left:40px;right:40px;height:32px;display:flex;align-items:center;gap:1.5px;z-index:5;";
    for (var i = 0; i < BAR_COUNT; i++) {
      var bar = document.createElement("div");
      bar.style.cssText = "width:2px;height:" + BAR_HEIGHTS[i] + "px;background-color:#DDD8D0;border-radius:1px;";
      waveform.appendChild(bar);
      bars.push(bar);
    }
    appDiv.appendChild(waveform);
  }

  setTimeout(patch, 300);
})();
