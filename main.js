/* =======================
   CONFIGURACIÓN RÁPIDA
======================= */
const CONFIG = {
  github: "https://github.com/tu-usuario",
  stack: ["HTML", "CSS", "JavaScript", "Node.js", "Git", "GitHub", "Responsive", "SEO básico"],
  skills: [
    "Maquetación semántica",
    "Flexbox y Grid",
    "Fetch API",
    "Express (básico)",
    "EJS/Plantillas (básico)",
    "REST (básico)",
  ],
  projects: [
    {
      title: "Tentazione — Alfajores artesanales",
      desc: "Landing page con catálogo simple, formulario y mapa.",
      link: "#",
      repo: "#",
      tags: ["HTML", "CSS", "JS"],
      cover: ""
    },
    {
      title: "Mini API con Node.js",
      desc: "API REST básica en Express para contacto.",
      link: "#",
      repo: "#",
      tags: ["Node.js", "Express"],
      cover: ""
    },
    {
      title: "Componentes UI vanilla",
      desc: "Modal, tabs y toast con JavaScript puro.",
      link: "#",
      repo: "#",
      tags: ["JavaScript"],
      cover: ""
    }
  ]
};

/* =======================
   UTILIDADES
======================= */
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

function typeText(el, text, speed, { append = false } = {}){
  return new Promise(async resolve => {
    if(!append) el.textContent = "";
    for(let i=0;i<text.length;i++){
      el.textContent += text[i];
      await wait(speed);
    }
    resolve();
  });
}

function eraseChars(el, count, speed){
  return new Promise(async resolve => {
    for(let i=0;i<count;i++){
      el.textContent = el.textContent.slice(0,-1);
      await wait(speed);
    }
    resolve();
  });
}

/* barra continua (se usa si pones terminal en el hero) */
function animateProgressTo(barEl, targetPct, duration=1000){
  return new Promise(resolve => {
    const start = performance.now();
    const from = parseFloat(barEl.style.width) || 0;
    const to = Math.max(0, Math.min(100, targetPct));
    function step(now){
      const t = Math.min(1, (now - start) / duration);
      const value = from + (to - from) * t;
      barEl.style.width = value.toFixed(2) + "%";
      if(t < 1) requestAnimationFrame(step); else resolve();
    }
    requestAnimationFrame(step);
  });
}

/* cuadritos del splash */
function buildCells(container, n = 24){
  container.innerHTML = "";
  for(let i=0;i<n;i++){
    const span = document.createElement("span");
    span.className = "cell";
    container.appendChild(span);
  }
  container.style.setProperty("--cells", n);
  container.dataset.pct = "0";
  return Array.from(container.children);
}

function setCells(container, pct, pctEl){
  const cells = Array.from(container.children);
  const k = Math.round((Math.max(0, Math.min(100, pct)) / 100) * cells.length);
  cells.forEach((c, i) => c.classList.toggle("on", i < k));
  container.setAttribute("aria-valuenow", Math.round(pct));
  container.dataset.pct = String(pct);
  if(pctEl) pctEl.textContent = Math.round(pct) + "%";
}

function animateCellsTo(container, pctEl, targetPct, duration=1000){
  return new Promise(resolve => {
    const start = performance.now();
    const from = parseFloat(container.dataset.pct || "0");
    const to = Math.max(0, Math.min(100, targetPct));
    function step(now){
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * t;
      setCells(container, v, pctEl);
      if(t < 1) requestAnimationFrame(step); else resolve();
    }
    requestAnimationFrame(step);
  });
}
function startHeroAnimation(){
  const player = document.getElementById("heroAnim");
  if (!player) return;
  try {
    // nos aseguramos de estar al inicio y pausado antes de mostrar
    player.stop?.();
    player.seek?.(0);
    player.pause?.();
  } catch (e) { /* noop */ }
  // mostrar y reproducir
  player.classList.add("is-playing");
  player.play?.();
}

/* =======================
   INICIALIZACIÓN
======================= */
document.addEventListener("DOMContentLoaded", () => {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  const gh = $("#githubLink");
  if (gh) {
    if (CONFIG.github && CONFIG.github !== "#") {
      gh.href = CONFIG.github;
      gh.setAttribute("rel", "noopener noreferrer");
    } else {
      gh.remove();
    }
  }

  renderChips("#stackChips", CONFIG.stack);
  renderChips("#skillsChips", CONFIG.skills);
  renderProjects("#projectsGrid", CONFIG.projects);

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior:"smooth", block:"start" }); }
    });
  });

  initThemeToggle();
  initMobileMenu();
  initContactForm();

  initSplashLoader().then(() => {
    // si agregás una terminal en el hero, se animará en loop
    initConsoleAnimation();
  });
});

/* =======================
   RENDERIZADOS
======================= */
function renderChips(containerSel, items){
  const wrap = $(containerSel);
  if(!wrap) return;
  const frag = document.createDocumentFragment();
  items.forEach(t => {
    const s = document.createElement("span");
    s.className = "chip";
    s.textContent = t;
    frag.appendChild(s);
  });
  wrap.appendChild(frag);
}

function renderProjects(containerSel, items){
  const grid = $(containerSel);
  if(!grid) return;

  const frag = document.createDocumentFragment();
  items.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    const coverStyle = p.cover
      ? `style="background-image:url('${p.cover}'); background-size:cover; background-position:center"`
      : "";

    const hasDemo = p.link && p.link !== "#";
    const hasRepo = p.repo && p.repo !== "#";
    const actions = [
      hasDemo ? `<a class="btn" target="_blank" rel="noopener noreferrer" href="${p.link}">Demo</a>` : "",
      hasRepo ? `<a class="btn" target="_blank" rel="noopener noreferrer" href="${p.repo}">Código</a>` : ""
    ].filter(Boolean).join("");

    card.innerHTML = `
      <div class="thumb" ${coverStyle}></div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="actions">${actions}</div>
      </div>`;
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

/* =======================
   TEMA
======================= */
function initThemeToggle(){
  const btn = $("#themeBtn");
  const stored = localStorage.getItem("theme");
  if (stored) document.documentElement.classList.toggle("light", stored === "light");
  btn?.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    const isLight = document.documentElement.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

/* =======================
   MENÚ MÓVIL
======================= */
function initMobileMenu(){
  const btn = $("#menuBtn");
  const list = $("#menuList");
  if(!btn || !list) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
  });

  list.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => btn.setAttribute("aria-expanded", "false"));
  });
}

/* =======================
   FORMULARIO (DEMO)
======================= */
function initContactForm(){
  const form = $("#contactForm");
  const msg  = $("#formMsg");
  if(!form || !msg) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if(!data.nombre || !data.email || !data.mensaje){
      msg.textContent = "Completá todos los campos.";
      return;
    }
    msg.textContent = "Enviando...";

    try{
      // await fetch("https://formspree.io/f/xxxxxxx", {...});
      await new Promise(r => setTimeout(r, 900));
      msg.textContent = "¡Gracias! Te respondo pronto.";
      form.reset();
      // await fetch("http://localhost:3000/contact", {...});
    }catch(err){
      console.error(err);
      msg.textContent = "Ups, hubo un error. Probá otra vez o escribime a tu-email@dominio.com";
    }
  });
}

/* =======================
   Splash de carga (cuadritos)
======================= */
async function initSplashLoader(){
  const splash = document.getElementById("splash");

  // Si no hay splash, arrancamos de una
  if(!splash){
    finalizeBoot();
    return;
  }

  document.body.classList.add("splashing");

  const cmdSpan   = document.getElementById("cmdSplash");
  const status    = document.getElementById("statusSplash");
  const statusTxt = document.getElementById("statusTextSplash");
  const cells     = document.getElementById("cellsSplash");
  const pctEl     = document.getElementById("pctSplash");
  const boot      = document.getElementById("bootSplash");
  const title     = splash.querySelector(".term-title");

  // Si faltan nodos del splash, lo cerramos y disparamos el hero
  if(!cmdSpan || !status || !statusTxt || !cells){
    closeSplash();
    finalizeBoot();
    return;
  }

  buildCells(cells, 10);

  const firstCmd   = "npm install portfolio";
  const eraseCount = "install portfolio".length;
  const secondTail = "run dev";
  const statuses   = ["Instalando dependencias...", "Compilando...", "Listo ✅"];

  const speed = 60, eraseSpeed = 40;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if(reduced){
    cmdSpan.textContent = firstCmd;
    status.classList.remove("hide");
    statusTxt.textContent = statuses[2];
    title?.classList.add("title-accent");
    setCells(cells, 100, pctEl);
    await wait(300);
    closeSplash();
    finalizeBoot();
    return;
  }

  // Animación detallada
  cmdSpan.textContent = "";
  status.classList.add("hide");
  statusTxt.textContent = statuses[0];
  setCells(cells, 0, pctEl);
  boot?.classList.remove("hide");

  await typeText(cmdSpan, firstCmd, speed);
  title?.classList.add("title-accent");
  await wait(400);

  status.classList.remove("hide");
  statusTxt.textContent = statuses[0];
  await animateCellsTo(cells, pctEl, 70, 1100);

  statusTxt.textContent = statuses[1];
  await animateCellsTo(cells, pctEl, 100, 800);

  boot?.classList.add("hide");
  await wait(250);

  await eraseChars(cmdSpan, eraseCount, eraseSpeed);
  await typeText(cmdSpan, secondTail, speed, { append:true });

  statusTxt.textContent = statuses[2];
  await wait(650);

  closeSplash();
  finalizeBoot();

  function closeSplash(){
    splash.classList.add("hide");
    document.body.classList.remove("splashing");
    const firstSection = document.querySelector("main");
    firstSection?.scrollIntoView({ behavior:"smooth", block:"start" });
  }
}



/* =======================
   Terminal en el HERO (loop)
======================= */
function initConsoleAnimation(){
  const term = document.querySelector(".hero .terminal.animated");
  if(!term) return;

  const cmdSpan   = term.querySelector("#cmd");
  const status    = term.querySelector("#status");
  const statusTxt = term.querySelector("#statusText");
  const bar       = document.getElementById("bar");
  const boot      = document.getElementById("boot");
  const title     = term.querySelector(".term-title");            // ← FIX

  if(!cmdSpan || !status || !statusTxt || !bar) return;

  const firstCmd   = "npm install portfolio";
  const eraseCount = "install portfolio".length;
  const secondTail = "run build";
  const statuses   = ["Instalando dependencias...", "Compilando...", "Listo ✅"];

  const speed = 60, eraseSpeed = 40;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if(reduced){
    cmdSpan.textContent = firstCmd;
    status.classList.remove("hide");
    statusTxt.textContent = statuses[0];
    title?.classList.add("title-accent");                         // azul también en modo reducido
    bar.style.width = "100%";
    return;
  }

  async function cycle(){
    title?.classList.remove("title-accent");                      // ← NUEVO (reinicio)
    cmdSpan.textContent = "";
    status.classList.add("hide");
    statusTxt.textContent = statuses[0];
    bar.style.width = "0%";
    boot?.classList.remove("hide");

    await typeText(cmdSpan, firstCmd, speed);
    title?.classList.add("title-accent");                         // ← NUEVO (al terminar primer comando)
    await wait(500);

    status.classList.remove("hide");
    statusTxt.textContent = statuses[0];
    await animateProgressTo(bar, 70, 1200);

    statusTxt.textContent = statuses[1];
    await animateProgressTo(bar, 100, 900);

    boot?.classList.add("hide");
    await wait(300);

    await eraseChars(cmdSpan, eraseCount, eraseSpeed);
    await typeText(cmdSpan, secondTail, speed, { append:true });

    statusTxt.textContent = statuses[2];
    await wait(1200);
    cycle();
  }
  cycle();
}


// ===== Estrellas en el hero (opcional) =====
function initHeroStars(n = 60){
  const layer = document.querySelector(".hero.hero-neon .hero-stars");
  if(!layer) return;
  const rect = layer.getBoundingClientRect();
  const frag = document.createDocumentFragment();

  for(let i=0;i<n;i++){
    const s = document.createElement("span");
    s.className = "star";
    const x = Math.random()*100;          // %
    const y = Math.random()*100;          // %
    const d = 1 + Math.random()*2;        // tamaño 1–3px
    const delay = (Math.random()*2).toFixed(2);
    s.style.left = x + "%";
    s.style.top  = y + "%";
    s.style.width  = d + "px";
    s.style.height = d + "px";
    s.style.animationDelay = delay + "s";
    frag.appendChild(s);
  }
  layer.appendChild(frag);
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroStars(70); // cantidad de estrellas
});
function startBadgeHand(){
  const badge = document.getElementById("heroBadge");
  if (!badge) return;

  // Respeta reduce motion
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  // Reinicio por si recargás durante diseño
  badge.classList.remove("play");
  // Forzar reflow para reiniciar los keyframes del CSS
  void badge.offsetWidth;
  // ¡A jugar!
  badge.classList.add("play");
}
function finalizeBoot(){
  // Lottie del programador
  startHeroAnimation?.();
  // Mano ✌🏽 del badge
  startBadgeHand?.();
}
