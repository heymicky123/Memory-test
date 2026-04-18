(function () {
  var audio = new Audio("https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Ferry.m4a");

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Demo") {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  });

  function patch() {
    // Remove Overstory header wrapper
    var all = document.querySelectorAll("div");
    for (var i = 0; i < all.length; i++) {
      if (all[i].textContent.trim() === "Overstory") {
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

    var wrap = document.createElement("div");
    wrap.style.cssText = "margin-bottom:40px";
    var img = document.createElement("img");
    img.src = "https://raw.githubusercontent.com/heymicky123/Quick_test/claude/srt-subtitle-component-UzVua/Memory_test_ferry.gif";
    img.style.cssText = "width:100%;display:block";
    wrap.appendChild(img);
    stage.parentNode.insertBefore(wrap, stage);
  }

  // React renders after script runs — wait for DOM to settle
  setTimeout(patch, 200);
})();
