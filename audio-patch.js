(function () {
  function patch() {
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage || stage.dataset.phonePatch) return;
    stage.dataset.phonePatch = "1";

    var col = stage.parentNode;
    var appDiv = col.parentNode;
    var root = appDiv.parentNode;

    // Make #root a fixed full-viewport dark backdrop
    root.style.cssText = "position:fixed;inset:0;background:#1A1A18;display:flex;align-items:center;justify-content:center;";

    // Force html/body to match
    document.documentElement.style.background = "#1A1A18";
    document.body.style.cssText = "margin:0;padding:0;background:#1A1A18;";

    // Create phone shell
    var shell = document.createElement("div");
    shell.id = "ov-shell";
    shell.style.cssText = "width:390px;height:844px;border-radius:50px;background-color:#1C1C1A;box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.06);flex-shrink:0;position:relative;overflow:hidden;";

    // Inject stylesheet to override compiled bundle min-height
    var styleEl = document.createElement("style");
    styleEl.textContent = "#ov-shell>div{min-height:0!important;height:100%!important;overflow:hidden!important}";
    document.head.appendChild(styleEl);

    root.insertBefore(shell, appDiv);
    shell.appendChild(appDiv);
  }

  setTimeout(patch, 300);
})();
