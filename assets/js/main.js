/* ============================================================
   Anushka Khadatkar — portfolio interactions
   ============================================================ */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const links = $("#nav-links");
  const toggle = $("#nav-toggle");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", links).forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // active link highlighting
  const sections = $$("main section[id]");
  const navAnchors = $$("a", links);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- scroll reveal ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObs.observe(el);
  });

  /* ---------- counters ---------- */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      reduceMotion ? (el.textContent = target.toLocaleString()) : requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  });
  $$("[data-count]").forEach((el) => countObs.observe(el));

  /* ---------- typing effect (hero role) ---------- */
  const phrases = [
    "LLM applications",
    "RAG systems",
    "LangGraph agents",
    "production ML services",
    "data platforms that scale",
  ];
  const typedEl = $("#typed");
  if (reduceMotion) {
    typedEl.textContent = phrases[0];
  } else {
    let pi = 0, ci = 0, deleting = false;
    const step = () => {
      const phrase = phrases[pi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = phrase.slice(0, ci);
      let delay = deleting ? 38 : 70;
      if (!deleting && ci === phrase.length) { delay = 1800; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(step, delay);
    };
    setTimeout(step, 900);
  }

  /* ---------- terminal card ---------- */
  const termBody = $("#terminal-body");
  const script = [
    { t: "cmd", text: "whoami" },
    { t: "out", html: `<span class="t-key">anushka</span> <span class="t-dim">— AI Engineer · San José, CA</span>` },
    { t: "cmd", text: "cat stack.yaml" },
    { t: "out", html:
`<span class="t-key">llms</span>:     <span class="t-str">[LangGraph, LangChain, RAG, MCP, HF Transformers]</span>
<span class="t-key">ml</span>:       <span class="t-str">[PyTorch, fine-tuning, causal inference]</span>
<span class="t-key">data</span>:     <span class="t-str">[Kafka, PySpark, Snowflake, dbt, Airflow]</span>
<span class="t-key">platform</span>: <span class="t-str">[FastAPI, KServe, Docker, K8s, AWS, Terraform]</span>` },
    { t: "cmd", text: "python -m platform.stats" },
    { t: "out", html:
`<span class="t-ok">✔</span> production AI systems ........ <span class="t-num">6</span>
<span class="t-ok">✔</span> automated tests .............. <span class="t-num">416</span>
<span class="t-ok">✔</span> RAG latency ..... <span class="t-num">45s</span> <span class="t-dim">→</span> <span class="t-num">3s</span>
<span class="t-ok">✔</span> proposal turnaround <span class="t-num">4h</span> <span class="t-dim">→</span> <span class="t-num">10min</span>` },
    { t: "cmd", text: "./status --hiring" },
    { t: "out", html: `<span class="t-ok">●</span> open to <span class="t-key">AI Engineer</span> / <span class="t-key">ML Engineer</span> roles` },
  ];

  const PROMPT = `<span class="t-prompt">➜</span> <span class="t-key">~</span> `;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function runTerminal() {
    if (reduceMotion) {
      termBody.innerHTML = script
        .map((l) => (l.t === "cmd" ? `${PROMPT}<span class="t-cmd">${l.text}</span>` : l.html))
        .join("\n");
      return;
    }
    termBody.innerHTML = "";
    for (const line of script) {
      if (line.t === "cmd") {
        const span = document.createElement("span");
        termBody.insertAdjacentHTML("beforeend", PROMPT);
        span.className = "t-cmd";
        termBody.appendChild(span);
        const caret = document.createElement("span");
        caret.className = "t-caret";
        termBody.appendChild(caret);
        for (const ch of line.text) {
          span.textContent += ch;
          await sleep(28 + Math.random() * 40);
        }
        await sleep(260);
        caret.remove();
        termBody.insertAdjacentHTML("beforeend", "\n");
      } else {
        termBody.insertAdjacentHTML("beforeend", line.html + "\n");
        await sleep(380);
      }
    }
    termBody.insertAdjacentHTML("beforeend", `${PROMPT}<span class="t-caret"></span>`);
  }

  const termObs = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      termObs.disconnect();
      runTerminal();
    }
  }, { threshold: 0.3 });
  termObs.observe($("#terminal"));

  /* ---------- cursor glow + project tilt ---------- */
  const glow = $(".cursor-glow");
  if (window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });

    $$(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- neural network background ---------- */
  const canvas = $("#neural-bg");
  const ctx = canvas.getContext("2d");
  let W, H, nodes = [], raf;
  const COLORS = ["0,240,255", "255,43,214", "57,255,20"];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(110, Math.floor((innerWidth * innerHeight) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.6,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const LINK = 140;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > innerWidth) a.vx *= -1;
      if (a.y < 0 || a.y > innerHeight) a.vy *= -1;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${a.c},${(1 - d / LINK) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${n.c},0.9)`;
      ctx.shadowColor = `rgb(${n.c})`;
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) {
    draw(); cancelAnimationFrame(raf);
  } else {
    draw();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf); else draw();
    });
  }
})();
