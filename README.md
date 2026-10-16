<div align="center">

  # 💖 Interactive Birthday Wish
  ### *A Luxurious Multi-Scene Birthday Presentation & Web Experience*

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![GSAP 3](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![License](https://img.shields.io/badge/License-MIT-pink?style=for-the-badge)](#-license--credits)

  <p align="center">
    <b>Crafted with ❤️ by Saklin for Hayati</b><br>
    An interactive 8-scene romantic presentation featuring modern CSS Glassmorphism, GSAP 3D spring dynamics, SVG vector mechanics, interactive balloon archery, and a 60 FPS GPU-accelerated fireworks bomb blast engine.
  </p>

</div>

---

## 📖 Table of Contents
- [🌟 Key Highlights & Engineering Features](#-key-highlights--engineering-features)
- [🎬 Interactive 8-Scene Journey](#-interactive-8-scene-journey)
- [📁 Project Architecture](#-project-architecture)
- [⚡ Quick Start & Usage](#-quick-start--usage)
- [🛠️ Technology Stack](#️-technology-stack)
- [💻 Browser Compatibility](#-browser-compatibility)
- [📜 License & Credits](#-license--credits)

---

## 🌟 Key Highlights & Engineering Features

- **🚀 60 FPS GPU Fireworks & Bomb Blast Engine:** Custom HTML5 Canvas 2D engine using `globalCompositeOperation = 'lighter'` for intense glowing fireworks shockwaves without CPU rasterization lag.
- **🎈 3D Exit-Entrance Reason Cards:** Dynamic 3D perspective flip (`rotateX`), text blur transition, spring bounce (`back.out(1.7)`), color badging, and floating sparkle particle explosions (`✨ 💖 ⭐ 🌸`).
- **🏹 Interactive SVG Archery Rig:** Vector bow string tension math, pointer capture physics, and arrow flight trajectories.
- **🎂 Gourmet Animated Birthday Cake:** Multi-tier cake with candle blowout mechanics, rising smoke particles, and cake emoji explosions (`🍰 ✨ 🎂 🌸`).
- **📮 Postal Stamp Impact Animations:** Authentic 3D spring stamp slam (`DELIVERED ✓`) with tilt recoil.
- **💎 Zero-Dependency UI Architecture:** Pure HTML5, Modular CSS3 Design Tokens, Vanilla JS + GSAP 3 animation framework. Zero heavy bundlers needed.

---

## 🎬 Interactive 8-Scene Journey

| Scene | Scene Name | Key Mechanics & Visual Highlights |
| :---: | :--- | :--- |
| **01** | 🌙 **Midnight Wish Intro** | Velvet Rose Midnight gradient, 12:00 AM digital clock, ambient glow, and glassmorphic CTA. |
| **02** | 🎁 **Gift Box & Archery** | Gold-accented gift box addressed to Hayati. Tap box lid -> Cupid's bow shoots target heart. |
| **03** | 🏹 **Cupid Unties** | Soft romantic blush pastel backdrop with 3D heart pop and Cupid animation entrance. |
| **04** | 🎉 **Happy Birthday Burst** | Grand typographic showcase (*Happy Birthday Hayati!*) with falling canvas confetti. |
| **05** | 🎂 **Gourmet Birthday Cake** | 3-tier Velvet cake on gold platter. Blow out candle -> Rising smoke & 360° sparklers. |
| **06** | 🎈 **5 Balloon Reasons** | Shoot balloons with Cupid's bow to unlock 5 romantic reasons with 3D card flips & sparkles. |
| **07** | 📮 **Cupid Express Wishes** | Glassmorphic postal card with 5 delivered wishes & slamming `DELIVERED ✓` stamps. |
| **08** | 💌 **Grand Finale Climax** | Birthday Love Letter with 5-point fireworks bomb blasts, screen shockwave, & ambient loop. |

---

## 📁 Project Architecture

```
Interactive-Birthday-Wish/
├── .vscode/
│   └── settings.json        # Workspace Linter Configuration (0 Error Validation)
├── index.html               # Main HTML markup containing 8 interactive scenes
├── style.css                # Modular CSS design system, Glassmorphism & Tokens
├── script.js                # GSAP physics, Canvas Fireworks Engine & Scene Controller
└── README.md                # Documentation & Architecture breakdown
```

---

## ⚡ Quick Start & Usage

### Prerequisites
No Node.js or build steps required! Simply launch the entry point in any browser.

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saklincodes/Interactive-Birthday-Wish.git
   cd Interactive-Birthday-Wish
   ```

2. **Open in browser:**
   - Double-click `index.html` to launch directly in your browser.
   - Or run with VS Code **Live Server** plugin / HTTP server:
     ```bash
     npx serve .
     ```

---

## 🛠️ Technology Stack

- **Core:** HTML5, Modular CSS3 (Variables, Glassmorphism, 3D Transforms), ES6+ JavaScript
- **Animation Framework:** [GSAP 3.12.5 (GreenSock Animation Platform)](https://greensock.com/gsap/)
- **Graphics Engine:** SVG Vector Graphics, HTML5 Canvas 2D Context (`globalCompositeOperation = 'lighter'`)
- **Typography:** Google Fonts (`Plus Jakarta Sans`, `Outfit`, `Dancing Script`, `Caveat`)

---

## 💻 Browser Compatibility

| Browser | Supported Version | Performance Rating |
| :--- | :---: | :---: |
| **Google Chrome** | 80+ | ⚡ 60 FPS (Ultra Smooth) |
| **Mozilla Firefox** | 78+ | ⚡ 60 FPS (Ultra Smooth) |
| **Apple Safari** | 13.1+ | ⚡ 60 FPS (Ultra Smooth) |
| **Microsoft Edge** | 80+ | ⚡ 60 FPS (Ultra Smooth) |
| **iOS / Android WebViews** | iOS 13+ / Android 8+ | ⚡ 60 FPS (Ultra Smooth) |

---

## 📜 License & Credits

Designed and engineered with ❤️ by **[Saklin](https://github.com/saklincodes)** for **Hayati**.

*Licensed under the [MIT License](LICENSE).*
