/* ============================================================
   MAIN.JS
   Legge CONFIG (config.js) e popola la pagina, gestisce boot
   screen, navigazione, reveal-on-scroll, theme switcher e la
   sezione contatti. Le icone sono disegnate a mano su griglie
   pixel: nessuna immagine esterna necessaria.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Icone pixel (griglie 0/1, 1 = pixel acceso) ---------- */
  var ICONS = {
    target: [
      "11111111", "10000001", "10111101", "10100101",
      "10100101", "10111101", "10000001", "11111111"
    ],
    chat: [
      "01111100", "11111110", "11111110", "11111110",
      "11111100", "00110000", "00011000", "00000000"
    ],
    play: [
      "00000000", "11000000", "11110000", "11111100",
      "11111100", "11110000", "11000000", "00000000"
    ],
    link: [
      "01100110", "10011001", "10011001", "01100110",
      "01100110", "10011001", "10011001", "01100110"
    ],
    joystick: [
      "00011000", "00011000", "00011000", "00111100",
      "01111110", "01111110", "01111110", "00000000"
    ],
    robot: [
      "000011000000", "000011000000", "000111100000", "011111111110",
      "111111111111", "111111111111", "110011110011", "110011110011",
      "111111111111", "111111111111", "011011110110", "001111111100"
    ]
  };

  function pixelIconSVG(key) {
    var bitmap = ICONS[key];
    if (!bitmap) return "";
    var rows = bitmap.length, cols = bitmap[0].length;
    var rects = "";
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        if (bitmap[y][x] === "1") {
          rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
        }
      }
    }
    return '<svg viewBox="0 0 ' + cols + ' ' + rows + '" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + rects + '</svg>';
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---------- BOOT SCREEN ---------- */
  function runBoot() {
    var boot = document.getElementById("boot");
    var linesBox = document.getElementById("bootLines");
    if (!boot || !linesBox) return;

    var alreadyBooted = false;
    try { alreadyBooted = sessionStorage.getItem("sonia_booted") === "1"; } catch (e) { alreadyBooted = false; }

    var lines = (window.CONFIG && CONFIG.bootLines) || ["PRONTO."];

    function hide() {
      boot.classList.add("is-hidden");
      try { sessionStorage.setItem("sonia_booted", "1"); } catch (e) {}
      window.removeEventListener("keydown", hide);
      boot.removeEventListener("click", hide);
      setTimeout(function () { boot.style.display = "none"; }, 550);
    }

    if (alreadyBooted || reduceMotion) {
      lines.forEach(function (t) { linesBox.appendChild(el("div", "boot-line shown", t)); });
      linesBox.appendChild(el("div", "boot-skip", "premi un tasto per continuare"));
      window.addEventListener("keydown", hide, { once: true });
      boot.addEventListener("click", hide, { once: true });
      if (alreadyBooted) hide();
      return;
    }

    lines.forEach(function (text, i) {
      var line = el("div", "boot-line", text);
      linesBox.appendChild(line);
      setTimeout(function () { line.classList.add("shown"); }, 300 * i);
    });

    var skip = el("div", "boot-skip", "premi un tasto per continuare");
    linesBox.appendChild(skip);

    window.addEventListener("keydown", hide, { once: true });
    boot.addEventListener("click", hide, { once: true });
    setTimeout(hide, 300 * lines.length + 1400);
  }

  /* ---------- HERO ---------- */
  function renderHero() {
    var p = CONFIG.player;
    document.getElementById("heroName").textContent = p.name;
    document.getElementById("heroRole").textContent = "// " + p.role + " @ " + p.base;
    document.getElementById("heroTagline").textContent = p.tagline;
    document.getElementById("heroSprite").innerHTML = pixelIconSVG("robot");
    document.getElementById("hudNameText").textContent = p.name.toUpperCase();

    var stars = document.getElementById("heroStars");
    if (stars && !reduceMotion) {
      for (var i = 0; i < 26; i++) {
        var s = document.createElement("span");
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = (Math.random() * 6) + "s";
        s.style.animationDuration = (4 + Math.random() * 4) + "s";
        s.style.opacity = String(0.35 + Math.random() * 0.65);
        stars.appendChild(s);
      }
    }
  }

  /* ---------- ABOUT ---------- */
  function renderAbout() {
    var p = CONFIG.player;
    var initials = p.name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
    document.getElementById("aboutPortrait").textContent = initials;

    var stats = document.getElementById("aboutStats");
    stats.innerHTML =
      '<li><b>RUOLO</b> ' + p.role + '</li>' +
      '<li><b>BASE</b> ' + p.base + '</li>' +
      '<li><b>HANDLE</b> @' + p.handle + '</li>';

    var bio = document.getElementById("aboutBio");
    bio.innerHTML = p.bio.map(function (t) { return "<p>" + t + "</p>"; }).join("");
  }

  /* ---------- SKILLS / INVENTORY ---------- */
  function renderSkills() {
    var box = document.getElementById("inventory");
    box.innerHTML = "";
    CONFIG.skills.forEach(function (group) {
      var wrap = el("div", "reveal");
      var label = el("span", "inventory__group-label", group.group.toUpperCase());
      var grid = el("div", "inventory__grid");
      group.items.forEach(function (item) {
        grid.appendChild(el("span", "slot", item));
      });
      wrap.appendChild(label);
      wrap.appendChild(grid);
      box.appendChild(wrap);
    });
  }

  /* ---------- PROJECTS / CARTRIDGE SHELF ---------- */
  function renderProjects() {
    var box = document.getElementById("shelf");
    box.innerHTML = "";
    CONFIG.projects.forEach(function (proj) {
      var card = document.createElement("a");
      card.className = "cart reveal";
      card.href = CONFIG.socials.github.replace(/\/$/, "") + "/" + proj.repo;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("data-color", proj.color || "cyan");

      card.innerHTML =
        '<span class="cart__icon">' + pixelIconSVG(proj.icon) + '</span>' +
        '<span class="cart__title">' + proj.title + '</span>' +
        '<p class="cart__desc">' + proj.desc + '</p>' +
        '<div class="cart__tags">' + proj.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("") + '</div>' +
        '<span class="cart__link">APRI REPO ›</span>';

      box.appendChild(card);
    });
  }

  /* ---------- TIMELINE / MAPPA ---------- */
  function renderTimeline() {
    var box = document.getElementById("mapList");
    box.innerHTML = "";
    CONFIG.timeline.forEach(function (node) {
      var li = el("li", "map__node reveal");
      li.innerHTML =
        '<span class="map__year">' + node.year + '</span>' +
        '<span class="map__title">' + node.title + '</span>' +
        '<p class="map__text">' + node.text + '</p>';
      box.appendChild(li);
    });
  }

  /* ---------- CONTATTI / SAVE SCREEN ---------- */
  function renderContact() {
    var box = document.getElementById("save");
    box.innerHTML = "";
    var s = CONFIG.socials;

    function padBtn(glyph, label, href, copyValue) {
      var node;
      if (copyValue) {
        node = document.createElement("button");
        node.type = "button";
        node.addEventListener("click", function () { copyToClipboard(copyValue); });
      } else {
        node = document.createElement("a");
        node.href = href;
        node.target = "_blank";
        node.rel = "noopener noreferrer";
      }
      node.className = "pad-btn reveal";
      node.innerHTML = '<span class="pad-btn__glyph">' + glyph + '</span><span>' + label + '</span>';
      box.appendChild(node);
    }

    padBtn("&#9670;", "GITHUB", s.github);
    padBtn("&#9673;", "LINKEDIN", s.linkedin);
    if (s.email) padBtn("&#9671;", "EMAIL", null, s.email);
  }

  function copyToClipboard(text) {
    var toast = document.getElementById("copyToast");
    function show(msg) {
      toast.textContent = msg;
      toast.classList.add("is-shown");
      setTimeout(function () { toast.classList.remove("is-shown"); }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { show("COPIATO: " + text); })
        .catch(function () { show(text); });
    } else {
      show(text);
    }
  }

  /* ---------- FOOTER ---------- */
  function renderFooter() {
    var p = CONFIG.player;
    var year = new Date().getFullYear();
    document.getElementById("footerName").textContent =
      p.name + " · @" + p.handle + " · " + year;
    document.getElementById("easterIcon").innerHTML = pixelIconSVG("joystick");
  }

  /* ---------- NAV: HUD attivo + burger mobile ---------- */
  function initNav() {
    var burger = document.getElementById("burgerBtn");
    var list = document.getElementById("hudList");
    if (burger && list) {
      burger.addEventListener("click", function () {
        list.classList.toggle("is-open");
      });
      list.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { list.classList.remove("is-open"); });
      });
    }

    var links = document.querySelectorAll(".hud__list a");
    var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
    if (!sections.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (t) { obs.observe(t); });
  }

  /* ---------- THEME SWITCHER ---------- */
  function initTheme() {
    var dots = document.querySelectorAll(".theme-dot");
    var saved = "arcade";
    try { saved = localStorage.getItem("sonia_theme") || "arcade"; } catch (e) {}
    applyTheme(saved);

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var t = dot.getAttribute("data-t");
        applyTheme(t);
        try { localStorage.setItem("sonia_theme", t); } catch (e) {}
      });
    });

    function applyTheme(t) {
      if (t === "arcade") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", t);
      }
      dots.forEach(function (d) {
        var active = d.getAttribute("data-t") === t;
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-pressed", String(active));
      });
    }
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderTimeline();
    renderContact();
    renderFooter();
    initNav();
    initTheme();
    initReveal();
    runBoot();
  });
})();
