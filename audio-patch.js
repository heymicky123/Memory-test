(function () {
  var BAR_COUNT = 60;
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
  var externalBtn = null;

  function startPlayback() {
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

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      if (e.target === externalBtn) return;
      startPlayback();
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
      "#root{margin:0!important;padding:0!important;width:100%!important;min-height:100vh!important;background:#1A1A18!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:32px!important}",
      "#ov-shell>div{min-height:0!important;height:100%!important;overflow:hidden!important;padding-top:0!important;padding-bottom:80px!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;align-items:center!important}",
      "#ov-shell button{display:none!important}"
    ].join("");
    document.head.appendChild(styleEl);

    externalBtn = document.createElement("button");
    externalBtn.textContent = "Demo";
    externalBtn.style.cssText = "font-family:Georgia,serif;font-size:13px;letter-spacing:0.05em;cursor:pointer;background:transparent;border:none;color:#7B7B74;padding:0;transition:opacity 0.15s;";
    externalBtn.addEventListener("click", function () {
      if (externalBtn.disabled) return;
      externalBtn.disabled = true;
      externalBtn.style.opacity = "0.4";
      externalBtn.style.cursor = "not-allowed";
      startPlayback();
      var innerBtn = appDiv.querySelector("button");
      if (innerBtn) innerBtn.click();
      audio.addEventListener("ended", function onEnd() {
        externalBtn.disabled = false;
        externalBtn.style.opacity = "1";
        externalBtn.style.cursor = "pointer";
        audio.removeEventListener("ended", onEnd);
      });
    });
    root.insertBefore(externalBtn, appDiv);

    var shell = document.createElement("div");
    shell.id = "ov-shell";
    shell.style.cssText = "width:390px;height:844px;border-radius:50px;background-color:#1C1C1A;box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.06);flex-shrink:0;position:relative;overflow:hidden;";
    root.insertBefore(shell, appDiv);
    shell.appendChild(appDiv);

    // Nav bar — in-flow, prepended to appDiv as first flex child
    var navBar = document.createElement("div");
    navBar.style.cssText = "width:100%;flex-shrink:0;margin-top:40px;height:44px;display:grid;grid-template-columns:40px 1fr 40px;align-items:center;padding:0 20px;box-sizing:border-box;position:relative;z-index:3;font-family:Georgia,serif;";

    var leftCol = document.createElement("div");
    leftCol.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3A3530" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="11,3 5,9 11,15"/></svg>';
    navBar.appendChild(leftCol);

    var titleCol = document.createElement("div");
    titleCol.style.cssText = "text-align:center;font-size:18px;font-weight:400;color:#3A3530;font-family:Georgia,serif;";
    titleCol.textContent = "Moving to Kirribilli";
    navBar.appendChild(titleCol);

    var rightCol = document.createElement("div");
    rightCol.style.cssText = "display:flex;justify-content:flex-end;";
    rightCol.innerHTML = '<div style="width:38px;height:38px;border-radius:50%;background:white;box-shadow:0 1px 6px rgba(0,0,0,0.10);display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="#3A3530" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2.5L11.5 4.5L4.5 11.5H2.5V9.5L9.5 2.5Z"/><line x1="8" y1="4" x2="10" y2="6"/></svg></div>';
    navBar.appendChild(rightCol);

    appDiv.insertBefore(navBar, appDiv.firstChild);

    col.style.marginTop = "auto";
    col.style.marginBottom = "auto";
    col.style.paddingTop = "50px";

    // Waveform
    var waveform = document.createElement("div");
    waveform.style.cssText = "position:absolute;bottom:40px;left:24px;right:24px;height:32px;display:flex;align-items:center;justify-content:center;z-index:5;";
    var inner = document.createElement("div");
    inner.style.cssText = "position:relative;width:297px;height:32px;";
    waveform.appendChild(inner);
    for (var i = 0; i < BAR_COUNT; i++) {
      var bar = document.createElement("div");
      bar.style.cssText = "position:absolute;left:" + (i * 5) + "px;top:50%;transform:translateY(-50%);width:2px;height:" + BAR_HEIGHTS[i] + "px;background-color:#DDD8D0;border-radius:1px;";
      inner.appendChild(bar);
      bars.push(bar);
    }
    appDiv.appendChild(waveform);
  }

  setTimeout(patch, 300);
})();
