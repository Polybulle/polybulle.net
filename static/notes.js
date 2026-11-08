// Footnotes as sidenotes (wide screens) or popovers (narrow screens).
//
// Without this script, the page keeps Zola's bottom footnotes: [n] links down
// to the note, ↩ links back to the reference. Reader modes keep that version
// too: they drop <aside> elements, and the bottom list is hidden only by a
// stylesheet class, which they ignore.
//
// Which mode applies is decided by style.css alone: a floated aside is a
// sidenote, an absolutely positioned one is a popover.
(function () {
  var article = document.querySelector("article");
  if (!article) return;
  var refs = article.querySelectorAll("sup.footnote-reference > a");
  if (!refs.length) return;

  var canHover = window.matchMedia("(hover: hover)");
  var notes = {};      // footnote id -> aside
  var current = null;  // open popover
  var hideTimer = null;

  function isPopover(aside) {
    return getComputedStyle(aside).position === "absolute";
  }

  function build(li, n) {
    var aside = document.createElement("aside");
    aside.className = "sidenote";
    aside.id = "sn-" + li.id;
    aside.setAttribute("role", "note");
    var num = document.createElement("span");
    num.className = "sn-n";
    num.textContent = n;
    aside.appendChild(num);
    li.childNodes.forEach(function (c) { aside.appendChild(c.cloneNode(true)); });
    // Drop the ↩ backlinks and the space before each.
    aside.querySelectorAll("a").forEach(function (b) {
      if (!/^#fr-/.test(b.hash)) return;
      var prev = b.previousSibling;
      if (prev && prev.nodeType === 3) prev.textContent = prev.textContent.replace(/\s+$/, "");
      b.remove();
    });
    return aside;
  }

  function show(aside, ref, pinned) {
    clearTimeout(hideTimer);
    if (current && current !== aside) hide(current);
    var r = ref.getBoundingClientRect();
    var box = article.getBoundingClientRect();
    aside.style.top = (r.bottom - box.top + 6) + "px";
    aside.style.left = "0px"; // measure at full available width first
    aside.classList.add("open");
    // Start the popover just left of the reference, shifted back inside the column if it overflows.
    var left = r.left - box.left - 12;
    var max = box.width - aside.offsetWidth;
    aside.style.left = Math.max(0, Math.min(left, max)) + "px";
    ref.setAttribute("aria-expanded", "true");
    aside._ref = ref;
    aside._pinned = pinned;
    current = aside;
  }

  function hide(aside) {
    aside.classList.remove("open");
    if (aside._ref) aside._ref.setAttribute("aria-expanded", "false");
    if (current === aside) current = null;
  }

  function hideSoon(aside) {
    if (aside._pinned) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { hide(aside); }, 250);
  }

  function flash(aside) {
    aside.classList.remove("flash");
    void aside.offsetWidth; // restart the animation
    aside.classList.add("flash");
  }

  refs.forEach(function (ref) {
    var id = decodeURIComponent(ref.hash.slice(1));
    var li = document.getElementById(id);
    if (!li) return;
    var n = ref.textContent.replace(/[\[\]]/g, "");
    ref.textContent = n;

    var aside = notes[id];
    if (!aside) {
      // The note sits right after its first reference; later references reuse it.
      aside = notes[id] = build(li, n);
      ref.parentNode.after(aside);
      aside.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
      aside.addEventListener("mouseleave", function () { hideSoon(aside); });
    }
    ref.setAttribute("aria-controls", aside.id);

    ref.addEventListener("click", function (e) {
      e.preventDefault();
      if (!isPopover(aside)) { flash(aside); return; }
      if (current === aside && aside._ref === ref && aside._pinned) hide(aside);
      else show(aside, ref, true);
    });
    ref.addEventListener("mouseenter", function () {
      if (canHover.matches && isPopover(aside) && !(current === aside && aside._pinned)) show(aside, ref, false);
    });
    ref.addEventListener("mouseleave", function () {
      if (current === aside) hideSoon(aside);
    });
  });

  document.addEventListener("click", function (e) {
    if (current && !current.contains(e.target) && !e.target.closest(".footnote-reference")) hide(current);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && current) hide(current);
  });
  window.addEventListener("resize", function () { if (current) hide(current); });

  document.documentElement.classList.add("sn");
})();
