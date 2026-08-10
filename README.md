# 🕹️ Sonia Sapia — Personal Portfolio & Interactive Arcade

Welcome to the repository of my personal portfolio. Designed and built from scratch with a classic 8-bit/16-bit retro arcade theme, combining my background in Artificial Intelligence, Data Ethics, and Computer Science.

🌐 **Live Demo:** [so-907.github.io](https://so-907.github.io)

---

## 💡 About The Project

This project serves as an interactive showcase of my academic path, publications, NLP/AI projects, and technical skills. Rather than relying on heavy frameworks, it is built entirely using **Vanilla Web Technologies** to ensure instant load times, high performance, and full control over animations and visual effects.

### Key Highlights
- **Custom CRT & Retro UI**: Scanline overlays, CRT vignette, dynamic themes, and pixel art iconography built with pure CSS and embedded SVGs.
- **Konami Code Easter Egg**: Features a hidden HTML5 Canvas runner minigame unlocked via key sequence (`↑ ↑ ↓ ↓ ← → ← → B A`) or interactive triggers.
- **Zero Dependencies**: Lightweight architecture running on standard HTML5, CSS3, and ES6 JavaScript without external libraries or build steps.
- **Accessible & Responsive**: Designed with `prefers-reduced-motion` support, screen-reader friendly HUD navigation, and full mobile adaptability.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Variables, Flexbox, Grid)
- **Scripting**: Vanilla JavaScript (ES6+)
- **Graphics & Minigame**: HTML5 Canvas API, Inline Pixel SVGs
- **Typography**: Google Fonts (*Press Start 2P*, *VT323*)

---

## 📁 Repository Structure

```text
.
├── assets/
│   └── favicon.svg       # Custom pixel favicon
├── css/
│   └── style.css         # Styling, CRT effects, and color themes
├── js/
│   ├── config.js        # Portfolio content (Projects, Timeline, Skills)
│   ├── game.js          # Canvas minigame logic & easter egg triggers
│   └── main.js          # DOM rendering, theme engine, and interactions
├── index.html           # Main entry point
└── README.md
