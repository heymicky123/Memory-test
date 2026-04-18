(function () {
  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  });

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

    // Add 40px horizontal padding to the content column
    var col = stage.parentNode;
    col.style.paddingLeft = "40px";
    col.style.paddingRight = "40px";
    col.style.boxSizing = "border-box";

    var wrap = document.createElement("div");
    wrap.style.cssText = "margin-bottom:40px;background-color:#F2E7DA;padding:16px";
    var img = document.createElement("img");
    img.src = "https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Memory_test_ferry.gif";
    img.style.cssText = "width:100%;display:block";
    wrap.appendChild(img);
    col.insertBefore(wrap, stage);

    // Pagination indicator — fixed bottom, tick marks
    if (!document.getElementById("ov-pagination")) {
      var pages = [0, 1, 2];
      var currentPage = 0;
      var outer = document.createElement("div");
      outer.id = "ov-pagination";
      outer.style.cssText = "position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;pointer-events:none;z-index:10";
      var inner = document.createElement("div");
      inner.style.cssText = "width:100%;max-width:420px;padding:0 40px 20px;box-sizing:border-box;display:flex;justify-content:space-between;align-items:flex-end";
      pages.forEach(function(_, i) {
        var tick = document.createElement("div");
        tick.style.cssText = "width:1.5px;flex-shrink:0;" +
          "height:" + (i === currentPage ? "20px" : "10px") + ";" +
          "background-color:" + (i === currentPage ? "#000000" : "#D4CCC2");
        inner.appendChild(tick);
      });
      outer.appendChild(inner);
      document.body.appendChild(outer);
    }
  }

  setTimeout(patch, 200);
})();
