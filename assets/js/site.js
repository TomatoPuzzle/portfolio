/* Shared site script — index + case study pages. Zero dependencies. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme toggle (same localStorage key across all pages) */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var html = document.documentElement;
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* Typed effect */
  var typedEl = document.getElementById("typed");
  if (typedEl) {
    var items = typedEl.getAttribute("data-typed-items").split(",");
    if (reduced) {
      typedEl.textContent = items[0];
    } else {
      var i = 0, pos = 0, deleting = false;
      (function tick() {
        var word = items[i];
        typedEl.textContent = word.slice(0, pos);
        var delay = deleting ? 40 : 90;
        if (!deleting && pos === word.length) { deleting = true; delay = 2000; }
        else if (deleting && pos === 0) { deleting = false; i = (i + 1) % items.length; delay = 400; }
        else { pos += deleting ? -1 : 1; }
        setTimeout(tick, delay);
      })();
    }
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* KPI counters */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduced) { el.textContent = target; return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window && !reduced) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* Project filters with live counts */
  var filterBox = document.getElementById("filters");
  if (filterBox) {
    var projectItems = document.querySelectorAll(".project-item");

    filterBox.querySelectorAll("button").forEach(function (btn) {
      var f = btn.getAttribute("data-filter");
      var n = f === "all" ? projectItems.length :
        document.querySelectorAll('.project-item[data-cat="' + f + '"]').length;
      var c = document.createElement("span");
      c.className = "count";
      c.textContent = n;
      btn.appendChild(c);
    });

    filterBox.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      filterBox.querySelector(".active").classList.remove("active");
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      projectItems.forEach(function (item) {
        var show = f === "all" || item.getAttribute("data-cat") === f;
        item.classList.toggle("hide", !show);
        if (show) item.classList.add("in");
      });
    });
  }

  /* Card spotlight */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* Image modal (certificate / document previews) */
  var modal = document.getElementById("imageModal");
  if (modal) {
    var modalImg = document.getElementById("modalImg");
    var modalCaption = document.getElementById("modalCaption");

    document.querySelectorAll(".preview-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        modalImg.src = link.getAttribute("href");
        modalCaption.textContent = link.getAttribute("title") || "";
        modal.classList.add("open");
      });
    });

    var closeModal = function () { modal.classList.remove("open"); };
    modal.querySelector(".close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  /* Scroll-to-top visibility */
  var scrollBtn = document.getElementById("scrollTop");
  if (scrollBtn) {
    var onScroll = function () { scrollBtn.classList.toggle("show", window.scrollY > 300); };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Contact form opens a prefilled email (no backend needed) */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      var subject = encodeURIComponent(f.subject.value);
      var body = encodeURIComponent(f.message.value + "\n\n" + f.name.value + " (" + f.email.value + ")");
      window.location.href = "mailto:miraj.ahmed.works@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
})();
