(function () {
  function patch() {
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage || stage.dataset.phonePatch) return;
    stage.dataset.phonePatch = "1";

    var col = stage.parentNode;
    var appDiv = col.parentNode;
    var root = appDiv.parentNode;

    // Inject stylesheet — forces dark background everywhere, fixes #root sizing
    var styleEl = document.createElement("style");
    styleEl.textContent = [
      "html { margin:0!important; padding:0!important; background:#1A1A18!important; }",
      "body { margin:0!important; padding:0!important; background:#1A1A18!important; }",
      "#root { margin:0!important; padding:0!important; width:100%!important; min-height:100vh!important; background:#1A1A18!important; display:flex!important; align-items:center!important; justify-content:center!important; }",
      "#ov-shell > div { min-height:0!important; height:100%!important; overflow:hidden!important; }"
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
