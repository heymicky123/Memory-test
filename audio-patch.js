(function () {
  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  });

  // Hide Export button whenever it appears
  var observer = new MutationObserver(function () {
    var btns = document.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim() === "Export \u2192") {
        btns[i].style.display = "none";
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function patch() {
    // Remove Overstory header wrapper
    var all = document.querySelectorAll("div");
    for (var i = 0; i < all.length; i++) {
      if (all[i].children.length === 0 && all[i].textContent.trim() === "Overstory") {
        var wrapper = all[i].parentNode;
        if (wrapper) wrapper.parentNode.removeChild(wrapper);
        break;
      }
    }

    // Find stage
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage || stage.dataset.gifPatched) return;
    stage.dataset.gifPatched = "1";

    var col = stage.parentNode;
    var appDiv = col.parentNode;
    var root = appDiv.parentNode;

    // Inject stylesheet to force appDiv height (overrides compiled bundle's min-height:100vh)
    var styleEl = document.createElement("style");
    styleEl.textContent = "html,body{margin:0;padding:0}body{background:#1A1A18!important;min-height:100vh;display:flex!important;align-items:center!important;justify-content:center!important;padding:40px 24px;box-sizing:border-box}#root{display:flex;align-items:center;justify-content:center}#ov-shell>div{min-height:0!important;height:100%!important;overflow:hidden!important}";
    document.head.appendChild(styleEl);

    // Create phone shell
    var shell = document.createElement("div");
    shell.id = "ov-shell";
    shell.style.cssText = "width:390px;height:844px;border-radius:50px;background-color:#1C1C1A;box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.06);flex-shrink:0;position:relative;overflow:hidden;";

    // Wrap appDiv in shell
    root.insertBefore(shell, appDiv);
    shell.appendChild(appDiv);

    // 32px horizontal padding on content column
    col.style.paddingLeft = "32px";
    col.style.paddingRight = "32px";
    col.style.boxSizing = "border-box";

    // Inject gif
    var wrap = document.createElement("div");
    wrap.style.cssText = "margin-bottom:40px;background-color:#F2E7DA;padding:16px";
    var img = document.createElement("img");
    img.src = "https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Memory_test_ferry.gif";
    img.style.cssText = "width:100%;display:block";
    wrap.appendChild(img);
    col.insertBefore(wrap, stage);

    // Patch text size to 17px
    var textDiv = stage.querySelector('[style*="line-height: 1.75"]') ||
                  stage.querySelector('[style*="line-height:1.75"]');
    if (textDiv) textDiv.style.fontSize = "17px";

    var placeholder = stage.querySelector('[style*="italic"]');
    if (placeholder) placeholder.style.fontSize = "17px";
  }

  setTimeout(patch, 200);
})();
