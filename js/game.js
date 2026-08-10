/* ============================================================
   GAME.JS
   ============================================================ */

(function () {
  "use strict";

  var overlay, canvas, ctx, closeBtn;
  var raf = null;
  var state = null;
  var W = 480, H = 220;
  var GROUND_Y = H - 34;
  var PLAYER_W = 16, PLAYER_H = 16, PLAYER_X = 44;
  var REST_Y = GROUND_Y - PLAYER_H;

  var SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var buffer = [];

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function openGame() {
    if (!overlay) return;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    resetGame();
    document.addEventListener("keydown", onGameKey);
    canvas.addEventListener("pointerdown", jump);
    loop();
  }

  function closeGame() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onGameKey);
    canvas.removeEventListener("pointerdown", jump);
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function resetGame() {
    state = {
      y: REST_Y,
      vy: 0,
      onGround: true,
      obstacles: [],
      spawnIn: 60,
      speed: 4.2,
      score: 0,
      dead: false,
      colors: {
        bg: cssVar("--bg-alt", "#201A3A"),
        ground: cssVar("--text-dim", "#B8ADE0"),
        player: cssVar("--green", "#4CFF6E"),
        obstacle: cssVar("--pink", "#FF2E88"),
        text: cssVar("--text", "#F5F0FF")
      }
    };
  }

  function jump() {
    if (!state) return;
    if (state.dead) { resetGame(); return; }
    if (state.onGround) {
      state.vy = -7.4;
      state.onGround = false;
    }
  }

  function onGameKey(e) {
    if (e.key === "Escape") { closeGame(); return; }
    if (e.key === " " || e.key === "ArrowUp" || e.key === "Spacebar") {
      e.preventDefault();
      jump();
    }
  }

  function step() {
    var s = state;

    if (!s.dead) {
      s.vy += 0.42;
      s.y += s.vy;
      if (s.y >= REST_Y) {
        s.y = REST_Y;
        s.vy = 0;
        s.onGround = true;
      }

      s.spawnIn--;
      if (s.spawnIn <= 0) {
        s.obstacles.push({ x: W + 10, w: 12 + Math.random() * 14, h: 18 + Math.random() * 22 });
        s.spawnIn = Math.max(28, 50 + Math.random() * 55 - Math.min(s.speed * 3, 40));
      }
      s.speed += 0.0025;
      s.score += 1;

      s.obstacles.forEach(function (o) { o.x -= s.speed; });
      s.obstacles = s.obstacles.filter(function (o) { return o.x + o.w > -10; });

      s.obstacles.forEach(function (o) {
        var oy = GROUND_Y - o.h;
        if (PLAYER_X < o.x + o.w && PLAYER_X + PLAYER_W > o.x && s.y < oy + o.h && s.y + PLAYER_H > oy) {
          s.dead = true;
        }
      });
    }

    draw(s);
    raf = requestAnimationFrame(step);
  }

  function loop() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
  }

  function draw(s) {
    ctx.fillStyle = s.colors.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = s.colors.ground;
    ctx.fillRect(0, GROUND_Y, W, 3);

    ctx.fillStyle = s.colors.player;
    ctx.fillRect(PLAYER_X, s.y, PLAYER_W, PLAYER_H);

    ctx.fillStyle = s.colors.obstacle;
    s.obstacles.forEach(function (o) {
      ctx.fillRect(o.x, GROUND_Y - o.h, o.w, o.h);
    });

    ctx.fillStyle = s.colors.text;
    ctx.font = "16px 'VT323', monospace";
    ctx.textAlign = "left";
    ctx.fillText("SCORE " + s.score, 10, 22);

    if (s.dead) {
      ctx.textAlign = "center";
      ctx.font = "20px 'VT323', monospace";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 6);
      ctx.font = "14px 'VT323', monospace";
      ctx.fillText("press space or tap to restart", W / 2, H / 2 + 18);
    }
  }

  function onSequenceKey(e) {
    var k = e.key;
    buffer.push(k.length === 1 ? k.toLowerCase() : k);
    if (buffer.length > SEQUENCE.length) buffer.shift();
    if (buffer.length === SEQUENCE.length && buffer.every(function (v, i) { return v === SEQUENCE[i]; })) {
      buffer = [];
      openGame();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    overlay = document.getElementById("gameOverlay");
    canvas = document.getElementById("gameCanvas");
    closeBtn = document.getElementById("gameClose");
    if (!overlay || !canvas) return;

    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d");

    document.addEventListener("keydown", onSequenceKey);
    closeBtn.addEventListener("click", closeGame);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeGame(); });

    var easterBtn = document.querySelector(".easter-hint__q");
    if (easterBtn) {
      var count = 0, timer = null;
      easterBtn.addEventListener("click", function () {
        count++;
        clearTimeout(timer);
        timer = setTimeout(function () { count = 0; }, 1800);
        if (count >= 5) { count = 0; openGame(); }
      });
    }
  });
})();