/* ============================================================
   MAIN.JS — REFACTORED
   Retro-arcade portfolio engine for Sonia Sapia
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 0. CONFIG & STATE ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch      = window.matchMedia("(pointer: coarse)").matches;
  const DOC          = document;
  const WIN          = window;

  // Achievement persistence
  const ACH = {
    unlocked: new Set(),
    seenSections: new Set(),
    themeSwitches: 0,
    easterClicks: 0,
    konamiTriggered: false
  };
  try {
    const raw = sessionStorage.getItem("ss_ach");
    if (raw) {
      const saved = JSON.parse(raw);
      saved.forEach(k => ACH.unlocked.add(k));
    }
  } catch (e) {}

  function saveAch() {
    try { sessionStorage.setItem("ss_ach", JSON.stringify([...ACH.unlocked])); } catch (e) {}
  }
  function unlock(key, msg) {
    if (ACH.unlocked.has(key)) return;
    ACH.unlocked.add(key);
    saveAch();
    showToast(msg || "ACHIEVEMENT UNLOCKED: " + key.toUpperCase(), 2200);
    blip(880, "square", 0.06);
    setTimeout(() => blip(1100, "square", 0.08), 80);
  }

  // Skill proficiency (inferred from CV depth)
  const SKILL_LEVELS = {
    "Python":0.92, "PyTorch":0.85, "HuggingFace":0.80,
    "Scikit-Learn":0.78, "Pandas":0.88, "SQL":0.75,
    "MATLAB":0.65, "C++":0.60,
    "Git":0.90, "Linux":0.85, "Docker":0.70,
    "LaTeX":0.80, "Jupyter":0.88,
    "Machine Learning":0.85, "Multilingual NLP":0.82,
    "Generative AI":0.80, "Computer Vision":0.75,
    "Data Ethics":0.90
  };

  /* ---------- 1. UTILITIES ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const throttle = (fn, wait) => {
    let t = 0;
    return (...args) => {
      const now = performance.now();
      if (now - t >= wait) { t = now; fn(...args); }
    };
  };

  function el(tag, cls, html) {
    const e = DOC.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---------- 2. AUDIO ENGINE (opt-in) ---------- */
  let audioCtx = null;
  let audioMuted = true;
  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (WIN.AudioContext || WIN.webkitAudioContext)();
    } catch (e) {}
  }
    function blip(freq = 520, type = "triangle", duration = 0.1) {
    if (audioMuted || !audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    /* Quick slide from higher to lower = pleasant "tock" instead of a buzz */
    o.frequency.setValueAtTime(freq + 150, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq, audioCtx.currentTime + duration);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);               // louder
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + duration);
  }

  /* ---------- 3. PIXEL ICONS (existing) ---------- */
  const ICONS = {
    target: [
      "11111111","10000001","10111101","10100101",
      "10100101","10111101","10000001","11111111"
    ],
    chat: [
      "01111100","11111110","11111110","11111110",
      "11111100","00110000","00011000","00000000"
    ],
    play: [
      "00000000","11000000","11110000","11111100",
      "11111100","11110000","11000000","00000000"
    ],
    link: [
      "01100110","10011001","10011001","01100110",
      "01100110","10011001","10011001","01100110"
    ],
    joystick: [
      "00011000","00011000","00011000","00111100",
      "01111110","01111110","01111110","00000000"
    ],
    robot: [
      "000011000000","000011000000","000111100000","011111111110",
      "111111111111","111111111111","110011110011","110011110011",
      "111111111111","111111111111","011011110110","001111111100"
    ],
    sound_on: [
      "00010000","00110000","01110000","11111111",
      "11111111","01110000","00110000","00010000"
    ],
    sound_off: [
      "00000000","00000000","00000000","00000000",
      "00000000","00000000","00000000","00000000"
    ]
  };

  function pixelIconSVG(key) {
    const bitmap = ICONS[key];
    if (!bitmap) return "";
    const rows = bitmap.length, cols = bitmap[0].length;
    let rects = "";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (bitmap[y][x] === "1") {
          rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
      }
    }
    return `<svg viewBox="0 0 ${cols} ${rows}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
  }

  /* ---------- 4. TOAST ---------- */
  function showToast(text, duration = 1800) {
    let toast = DOC.getElementById("copyToast");
    if (!toast) {
      toast = el("div", "copy-toast");
      toast.id = "copyToast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      DOC.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("is-shown");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("is-shown"), duration);
  }

  /* ---------- 5. CUSTOM CURSOR (desktop only) ---------- */
    function initCursor() {
    if (isTouch || reduceMotion) return;
    const c = el("div", "custom-cursor");
    c.innerHTML = pixelIconSVG("target");
    Object.assign(c.style, {
      position: "fixed", top: "0", left: "0",
      width: "22px", height: "22px",
      pointerEvents: "none", zIndex: "10000",
      color: "var(--yellow, #FFD23F)",
      mixBlendMode: "difference",
      display: "none"
      /* NOTE: no transition here — we drive it purely in rAF */
    });
    DOC.body.appendChild(c);
    let cx = 0, cy = 0, tx = 0, ty = 0;
    WIN.addEventListener("mousemove", e => {
      tx = e.clientX; ty = e.clientY;
      c.style.display = "block";
    });
    function loop() {
      cx = lerp(cx, tx, 0.6);   // <-- was 0.18
      cy = lerp(cy, ty, 0.6);   // <-- was 0.18
      c.style.transform = `translate(${cx - 11}px, ${cy - 11}px)`;
      requestAnimationFrame(loop);
    }
    loop();

    const targets = "a, button, .slot, .pad-btn, .cart, .theme-dot, input, textarea";
    DOC.addEventListener("mouseover", e => {
      if (e.target.closest(targets)) {
        c.style.transform = `translate(${cx - 11}px, ${cy - 11}px) scale(1.4)`;
        c.style.color = "var(--pink, #FF2E88)";
      }
    });
    DOC.addEventListener("mouseout", e => {
      if (e.target.closest(targets)) {
        c.style.transform = `translate(${cx - 11}px, ${cy - 11}px) scale(1)`;
        c.style.color = "var(--yellow, #FFD23F)";
      }
    });
  }

  /* ---------- 6. BOOT SCREEN ---------- */
  function runBoot() {
    const boot = DOC.getElementById("boot");
    const box  = DOC.getElementById("bootLines");
    if (!boot || !box) return;

    let already = false;
    try { already = sessionStorage.getItem("sonia_booted") === "1"; } catch (e) {}
    const lines = (WIN.CONFIG && CONFIG.bootLines) || ["SYSTEM READY."];

    function hide() {
      boot.classList.add("is-hidden");
      try { sessionStorage.setItem("sonia_booted", "1"); } catch (e) {}
      WIN.removeEventListener("keydown", hide);
      boot.removeEventListener("click", hide);
      setTimeout(() => { boot.style.display = "none"; }, 550);
    }

    if (already || reduceMotion) {
      lines.forEach(t => box.appendChild(el("div", "boot-line shown", t)));
      box.appendChild(el("div", "boot-skip", "Press any key to continue"));
      WIN.addEventListener("keydown", hide, { once: true });
      boot.addEventListener("click", hide, { once: true });
      if (already) hide();
      return;
    }

    lines.forEach((text, i) => {
      const line = el("div", "boot-line", text);
      box.appendChild(line);
      setTimeout(() => line.classList.add("shown"), 300 * i);
    });
    const skip = el("div", "boot-skip", "Press any key to continue");
    box.appendChild(skip);
    WIN.addEventListener("keydown", hide, { once: true });
    boot.addEventListener("click", hide, { once: true });
    setTimeout(hide, 300 * lines.length + 1400);
  }

  /* ---------- 7. HERO — Starfield + Glitch ---------- */
  function initStarfield() {
    const container = DOC.getElementById("heroStars");
    if (!container || reduceMotion) return;
    container.innerHTML = "";
    const canvas = el("canvas", "hero-canvas");
    Object.assign(canvas.style, { position:"absolute", inset:"0", zIndex:"0" });
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const stars = Array.from({length: 140}, () => ({
      x: Math.random(), y: Math.random(),
      z: 0.2 + Math.random() * 1.4,
      size: 1 + Math.random() * 2.2
    }));

    let mx = 0, my = 0, scrollSpeed = 0, lastScroll = 0;
    WIN.addEventListener("mousemove", e => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    });

    function draw() {
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      scrollSpeed = (WIN.scrollY - lastScroll) * 0.08;
      lastScroll = WIN.scrollY;

      stars.forEach(s => {
        let px = (s.x * w + mx * 40 * s.z + scrollSpeed * s.z * 6) % w;
        let py = (s.y * h + my * 25 * s.z) % h;
        if (px < 0) px += w; if (py < 0) py += h;
        ctx.fillStyle = `rgba(255, 210, 63, ${0.25 + s.z * 0.55})`;
        ctx.fillRect(px, py, s.size, s.size);
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initGlitch() {
    const title = DOC.getElementById("heroName");
    if (!title || reduceMotion) return;
    setInterval(() => {
      title.classList.add("glitching");
      blip(220, "sawtooth", 0.04);
      setTimeout(() => title.classList.remove("glitching"), 220);
    }, 7000 + Math.random() * 5000);
  }

  function renderHero() {
    const p = CONFIG.player;
    DOC.getElementById("heroName").textContent    = p.name;
    DOC.getElementById("heroRole").textContent      = "// " + p.role + " @ " + p.base;
    DOC.getElementById("heroTagline").textContent   = p.tagline;
    DOC.getElementById("heroSprite").innerHTML      = pixelIconSVG("robot");
    DOC.getElementById("hudNameText").textContent   = p.name.toUpperCase();
    initStarfield();
    initGlitch();
  }

  /* ---------- 8. ABOUT ---------- */
  function renderAbout() {
    const p = CONFIG.player;
    const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    DOC.getElementById("aboutPortrait").textContent = initials;

    const stats = DOC.getElementById("aboutStats");
    stats.innerHTML =
      `<li><b>ROLE</b> ${p.role}</li>` +
      `<li><b>BASE</b> ${p.base}</li>` +
      `<li><b>HANDLE</b> @${p.handle}</li>`;

    const bio = DOC.getElementById("aboutBio");
    bio.innerHTML = p.bio.map(t => `<p>${t}</p>`).join("");
  }

  /* ---------- 9. SKILLS — RPG bars ---------- */
  function renderSkills() {
    const box = DOC.getElementById("inventory");
    box.innerHTML = "";
    CONFIG.skills.forEach(group => {
      const wrap  = el("div", "reveal");
      const label = el("span", "inventory__group-label", group.group.toUpperCase());
      const grid  = el("div", "inventory__grid");

      group.items.forEach(item => {
        const lvl = SKILL_LEVELS[item] || 0.72;
        const slot = el("div", "slot");
        slot.innerHTML = `
          <span class="slot__name">${item}</span>
          <span class="slot__bar"><span class="slot__fill" style="width:${Math.round(lvl*100)}%"></span></span>
          <span class="slot__lvl">LV.${Math.round(lvl*10)}</span>
        `;
        // Hover sound
        slot.addEventListener("mouseenter", () => blip(330 + Math.random()*200, "square", 0.04));
        grid.appendChild(slot);
      });

      wrap.appendChild(label);
      wrap.appendChild(grid);
      box.appendChild(wrap);
    });
  }

  /* ---------- 10. PROJECTS — 3D tilt ---------- */
  function renderProjects() {
    const box = DOC.getElementById("shelf");
    box.innerHTML = "";
    CONFIG.projects.forEach(proj => {
      const card = el("a", "cart reveal");
      card.href = CONFIG.socials.github.replace(/\/$/, "") + "/" + proj.repo;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("data-color", proj.color || "cyan");

      card.innerHTML =
        `<span class="cart__icon">${pixelIconSVG(proj.icon)}</span>` +
        `<span class="cart__title">${proj.title}</span>` +
        `<p class="cart__desc">${proj.desc}</p>` +
        `<div class="cart__tags">${proj.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>` +
        `<span class="cart__link">OPEN REPO ›</span>`;

      // 3D tilt
      if (!reduceMotion && !isTouch) {
        card.addEventListener("mousemove", e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(8px)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
        card.addEventListener("mouseenter", () => blip(440, "square", 0.05));
      }

      box.appendChild(card);
    });
  }

  /* ---------- 11. TIMELINE ---------- */
  function renderTimeline() {
    const box = DOC.getElementById("mapList");
    box.innerHTML = "";
    CONFIG.timeline.forEach(node => {
      const li = el("li", "map__node reveal");
      li.innerHTML =
        `<span class="map__year">${node.year}</span>` +
        `<span class="map__title">${node.title}</span>` +
        `<p class="map__text">${node.text}</p>`;
      box.appendChild(li);
    });
  }

  /* ---------- 12. CONTACT + CV + Audio toggle ---------- */
  function renderContact() {
    const box = DOC.getElementById("save");
    box.innerHTML = "";
    const s = CONFIG.socials;

    function padBtn(glyph, label, href, copyValue, onClick) {
      const node = onClick ? el("button", "pad-btn reveal") : el("a", "pad-btn reveal");
      if (onClick) {
        node.type = "button";
        node.addEventListener("click", () => { blip(520, "square", 0.06); onClick(); });
      } else {
        node.href = href;
        node.target = "_blank";
        node.rel = "noopener noreferrer";
        node.addEventListener("click", () => blip(520, "square", 0.06));
      }
      node.innerHTML = `<span class="pad-btn__glyph">${glyph}</span><span>${label}</span>`;
      box.appendChild(node);
    }

    padBtn("&#9670;", "GITHUB", s.github);
    padBtn("&#9673;", "LINKEDIN", s.linkedin);
    if (s.email) padBtn("&#9671;", "EMAIL", null, s.email, () => copyToClipboard(s.email));

    // Audio toggle
    const muteBtn = el("button", "pad-btn reveal");
    muteBtn.type = "button";
    muteBtn.innerHTML = `<span class="pad-btn__glyph">${pixelIconSVG("sound_off")}</span><span>AUDIO OFF</span>`;
    muteBtn.addEventListener("click", () => {
      initAudio();
      audioMuted = !audioMuted;
      muteBtn.innerHTML = `<span class="pad-btn__glyph">${pixelIconSVG(audioMuted ? "sound_off" : "sound_on")}</span><span>AUDIO ${audioMuted ? "OFF" : "ON"}</span>`;
      if (!audioMuted) { blip(660, "square", 0.08); setTimeout(() => blip(880, "square", 0.10), 100); }
    });
    box.appendChild(muteBtn);
  }

  function copyToClipboard(text) {
    function show(msg) { showToast(msg); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => show("COPIED: " + text)).catch(() => show(text));
    } else {
      show(text);
    }
  }

  /* ---------- 13. NAVIGATION — Sidebar + Spy + Avatar ---------- */
  function initNav() {
    const burger = DOC.getElementById("burgerBtn");
    const list   = DOC.getElementById("hudList");
    if (burger && list) {
      burger.addEventListener("click", () => list.classList.toggle("is-open"));
      list.querySelectorAll("a").forEach(a => a.addEventListener("click", () => list.classList.remove("is-open")));
    }

    // Desktop sidebar class
    function checkLayout() {
      if (WIN.innerWidth >= 1100) DOC.body.classList.add("desktop-sidebar");
      else DOC.body.classList.remove("desktop-sidebar");
    }
    checkLayout();
    WIN.addEventListener("resize", throttle(checkLayout, 200));

    // Scroll avatar in HUD
    const hud = DOC.querySelector(".hud");
    if (hud && !isTouch) {
      const track = el("div", "hud__track");
      track.innerHTML = `<div class="hud__avatar">${pixelIconSVG("robot")}</div>`;
      Object.assign(track.style, {
        position:"absolute", right:"12px", top:"60px", bottom:"20px", width:"4px",
        background:"rgba(255,255,255,0.1)", borderRadius:"2px", display:"none"
      });
      hud.appendChild(track);
      const avatar = track.querySelector(".hud__avatar");
      Object.assign(avatar.style, {
        position:"absolute", left:"-10px", width:"24px", height:"24px",
        color:"var(--yellow)", transition:"top 0.3s ease"
      });

      WIN.addEventListener("scroll", throttle(() => {
        const docH = DOC.documentElement.scrollHeight - WIN.innerHeight;
        const pct = clamp(WIN.scrollY / docH, 0, 1);
        avatar.style.top = `calc(${pct * 100}% - 12px)`;
        track.style.display = WIN.innerWidth >= 1100 ? "block" : "none";
      }, 80));
    }

    // IntersectionObserver spy + achievements
    const links = DOC.querySelectorAll(".hud__list a");
    const sections = Array.from(DOC.querySelectorAll("main > section[id]"));
    if (!sections.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ACH.seenSections.add(entry.target.id);
          links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
          if (ACH.seenSections.size >= 5) unlock("explorer", "Explorer: All Levels Cleared");
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px" });
    sections.forEach(s => obs.observe(s));
  }

  /* ---------- 14. REVEAL ON SCROLL ---------- */
  function initReveal() {
    const targets = DOC.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in WIN) || reduceMotion) {
      targets.forEach(t => t.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(t => obs.observe(t));
  }

  /* ---------- 15. THEME SWITCHER ---------- */
  function initTheme() {
    const dots = DOC.querySelectorAll(".theme-dot");
    let saved = "arcade";
    try { saved = localStorage.getItem("sonia_theme") || "arcade"; } catch (e) {}
    applyTheme(saved);

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const t = dot.getAttribute("data-t");
        applyTheme(t);
        try { localStorage.setItem("sonia_theme", t); } catch (e) {}
        ACH.themeSwitches++;
        if (ACH.themeSwitches >= 3) unlock("palette", "Palette Swapper");
        blip(550, "square", 0.05);
      });
    });

    function applyTheme(t) {
      if (t === "arcade") DOC.documentElement.removeAttribute("data-theme");
      else DOC.documentElement.setAttribute("data-theme", t);
      dots.forEach(d => {
        const active = d.getAttribute("data-t") === t;
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-pressed", String(active));
      });
    }
  }

  /* ---------- 16. TERMINAL OVERLAY ---------- */
  function initTerminal() {
    const term = el("div", "terminal");
    term.id = "terminal";
    term.innerHTML = `
      <div class="terminal__header">
        <span>SONIA.EXE — COMMAND LINE</span>
        <button class="terminal__close" aria-label="Close terminal">×</button>
      </div>
      <div class="terminal__out"></div>
      <div class="terminal__in">
        <span class="terminal__prompt">></span>
        <input type="text" autocomplete="off" spellcheck="false" aria-label="Terminal input">
      </div>
    `;
    Object.assign(term.style, {
      position:"fixed", inset:"0", zIndex:"95", background:"rgba(5,3,12,0.96)",
      display:"none", flexDirection:"column", padding:"24px", fontFamily:"var(--font-body, 'VT323', monospace)",
      fontSize:"1.4rem", color:"var(--green, #4CFF6E)"
    });
    DOC.body.appendChild(term);

    const out = term.querySelector(".terminal__out");
    const inp = term.querySelector("input");
    const closeBtn = term.querySelector(".terminal__close");

    function print(text, color) {
      const line = el("div", "", text);
      if (color) line.style.color = color;
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;
    }
    function clear() { out.innerHTML = ""; }
    function open() {
      term.style.display = "flex";
      setTimeout(() => inp.focus(), 50);
      blip(600, "square", 0.06);
    }
    function close() {
      term.style.display = "none";
      clear();
    }

    closeBtn.addEventListener("click", close);
    DOC.addEventListener("keydown", e => {
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        term.style.display === "flex" ? close() : open();
      }
      if (e.key === "Escape" && term.style.display === "flex") close();
    });
    inp.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const cmd = inp.value.trim().toLowerCase();
      if (!cmd) return;
      print("> " + inp.value, "var(--yellow)");
      inp.value = "";

      const parts = cmd.split(/\s+/);
      switch (parts[0]) {
        case "help":
          print("COMMANDS: goto <section> | theme <arcade|gameboy|synthwave|terminal> | contact | clear | exit");
          break;
        case "goto":
          {
            const dest = parts[1];
            const target = DOC.getElementById(dest);
            if (target) { target.scrollIntoView({ behavior:"smooth" }); print("WARPING TO " + dest.toUpperCase() + "..."); }
            else print("SECTOR NOT FOUND: " + dest, "var(--pink)");
          }
          break;
        case "theme":
          {
            const t = parts[1];
            const dot = DOC.querySelector(`.theme-dot[data-t="${t}"]`);
            if (dot) { dot.click(); print("THEME SET: " + t.toUpperCase()); }
            else print("UNKNOWN THEME", "var(--pink)");
          }
          break;
        case "contact":
          DOC.getElementById("contact").scrollIntoView({ behavior:"smooth" });
          print("OPENING COMMUNICATION CHANNEL...");
          break;
        case "cv":
        case "download":
          {
            const a = el("a");
            a.href = "sonia_sapia_en.pdf"; a.download = "Sonia_Sapia_CV.pdf";
            DOC.body.appendChild(a); a.click(); a.remove();
            print("DOWNLOADING SAVE FILE...", "var(--cyan)");
            unlock("archivist", "Archivist: CV Downloaded");
          }
          break;
        case "clear":
          clear(); break;
        case "exit":
        case "quit":
          close(); break;
        default:
          print("UNKNOWN COMMAND. TYPE 'help'", "var(--pink)");
      }
      blip(480, "square", 0.04);
    });
  }

  /* ---------- 17. GAME / EASTER EGG ACHIEVEMENTS ---------- */
  function initGameHooks() {
    // Detect when the Konami game opens
    const overlay = DOC.getElementById("gameOverlay");
    if (overlay) {
      const mo = new MutationObserver(muts => {
        muts.forEach(m => {
          if (m.type === "attributes" && overlay.classList.contains("is-open")) {
            unlock("konami", "Cheat Code Activated");
          }
        });
      });
      mo.observe(overlay, { attributes: true });
    }

    // Easter egg hint clicks
    const easterBtn = DOC.getElementById("easterIcon");
    if (easterBtn) {
      easterBtn.addEventListener("click", () => {
        ACH.easterClicks++;
        if (ACH.easterClicks >= 5) unlock("curious", "Curious Mind");
      });
    }
  }

  /* ---------- 18. FOOTER ---------- */
  function renderFooter() {
    const p = CONFIG.player;
    const year = new Date().getFullYear();
    DOC.getElementById("footerName").textContent = `${p.name} · @${p.handle} · ${year}`;
    DOC.getElementById("easterIcon").innerHTML = pixelIconSVG("joystick");
  }

  /* ---------- 19. INIT ---------- */
  DOC.addEventListener("DOMContentLoaded", () => {
    // Unlock audio context on first interaction
    const wakeAudio = () => { initAudio(); WIN.removeEventListener("click", wakeAudio); WIN.removeEventListener("keydown", wakeAudio); };
    WIN.addEventListener("click", wakeAudio, { once: true });
    WIN.addEventListener("keydown", wakeAudio, { once: true });

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
    initCursor();
    initTerminal();
    initGameHooks();
    runBoot();
  });
})();
