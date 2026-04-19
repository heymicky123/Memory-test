(function () {
  function patch() {
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage || stage.dataset.phonePatch) return;
    stage.dataset.phonePatch = "1";

    var col = stage.parentNode;
    var appDiv = col.parentNode;
    var root = appDiv.parentNode;

    // Inject stylesheet — overrides compiled bundle's min-height:100vh
    var styleEl = document.createElement("style");
    styleEl.textContent = [
      "html,body{margin:0;padding:0}",
      "body{background:#1A1A18!important;min-height:100vh;display:flex!important;align-items:center!important;justify-content:center!important;padding:40px 24px;box-sizing:border-box}",
      "#root{display:flex;align-items:center;justify-content:center;min-height:unset}",
      "#ov-shell>div{min-height:0!important;height:100%!important;overflow:hidden!important}"
    ].join("");
    document.head.appendChild(styleEl);

    // Create phone shell
    var shell = document.createElement("div");
    shell.id = "ov-shell";
    shell.style.cssText = "width:390px;height:844px;border-radius:50px;background-color:#1C1C1A;box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.06);flex-shrink:0;position:relative;overflow:hidden;";

    root.insertBefore(shell, appDiv);
    shell.appendChild(appDiv);
  }

  setTimeout(patch, 300);
})();
