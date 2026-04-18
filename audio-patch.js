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
    // Remove Overstory header wrapper — match only the leaf text node
    var all = document.querySelectorAll("div");
    for (var i = 0; i < all.length; i++) {
      if (all[i].children.length === 0 && all[i].textContent.trim() === "Overstory") {
        var wrapper = all[i].parentNode;
        if (wrapper) wrapper.parentNode.removeChild(wrapper);
        break;
      }
    }

    // Insert gif before the stage
    var stage = document.querySelector('[style*="height: 160px"]') ||
                document.querySelector('[style*="height:160px"]');
    if (!stage || stage.dataset.gifPatched) return;
    stage.dataset.gifPatched = "1";

    // 32px horizontal padding on the content column
    var col = stage.parentNode;
    col.style.paddingLeft = "32px";
    col.style.paddingRight = "32px";
    col.style.boxSizing = "border-box";

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

    // Patch placeholder text size
    var placeholder = stage.querySelector('[style*="italic"]');
    if (placeholder) placeholder.style.fontSize = "17px";

    // Pagination indicator — 12 ticks, active at index 4
    if (!document.getElementById("ov-pagination")) {
      var pageCount = 12;
      var currentPage = 4;
      var outer = document.createElement("div");
      outer.id = "ov-pagination";
      outer.style.cssText = "position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;pointer-events:none;z-index:10";
      var inner = document.createElement("div");
      inner.style.cssText = "width:100%;max-width:420px;padding:0 32px 20px;box-sizing:border-box;display:flex;justify-content:space-between;align-items:flex-end";
      for (var j = 0; j < pageCount; j++) {
        var tick = document.createElement("div");
        tick.style.cssText = "width:1.5px;flex-shrink:0;" +
          "height:" + (j === currentPage ? "20px" : "10px") + ";" +
          "background-color:" + (j === currentPage ? "#000000" : "#D4CCC2");
        inner.appendChild(tick);
      }
      outer.appendChild(inner);
      document.body.appendChild(outer);
    }
  }

  setTimeout(patch, 200);
})();
