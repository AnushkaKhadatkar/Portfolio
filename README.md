# Anushka Khadatkar — Portfolio

Personal portfolio of an AI Engineer: LLM applications, RAG systems, LangGraph agents, and the data platforms underneath them.

**Live:** https://anushkakhadatkar.github.io/Portfolio/

## Design

Dark, neon "terminal + bento" theme built for an AI/ML profile:

- Animated neural-network particle background (canvas) with cyan / magenta / green nodes
- Terminal-style hero card that types out `whoami`, the stack and key metrics
- Typing effect for the role line, hover glitch on the name
- Bento grid for about, animated metric counters, "currently" and publication
- Glowing timeline for experience, 3D-tilt project cards, skill chips
- Scroll-triggered reveals, active-section nav, responsive mobile menu
- Respects `prefers-reduced-motion`

## Stack

Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies beyond Google Fonts.

```
index.html
assets/css/style.css
assets/js/main.js
assets/images/photo.png
```

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

GitHub Pages serves the `main` branch from the repository root. Merge to `main` and push; Pages rebuilds automatically.
