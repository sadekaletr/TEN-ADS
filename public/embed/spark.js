(function () {
  var script = document.currentScript;
  if (!script) return;
  var campaignId = script.getAttribute("data-campaign-id");
  if (!campaignId) return;
  var base = script.getAttribute("data-base") || "";
  var host = document.createElement("div");
  host.id = "tenegta-spark-embed";
  host.style.cssText = "all:initial;font-family:system-ui,sans-serif;";
  var shadow = host.attachShadow({ mode: "open" });
  var frame = document.createElement("iframe");
  frame.src = base + "/embed/" + encodeURIComponent(campaignId);
  frame.style.cssText = "width:100%;min-height:420px;border:0;border-radius:16px;";
  frame.setAttribute("title", "TENEGTA Spark");
  shadow.appendChild(frame);
  script.parentNode.insertBefore(host, script.nextSibling);
})();
