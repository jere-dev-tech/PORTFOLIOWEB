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
    "Express ",
    "EJS/Plantillas ",
    "REST ",
  ],
  projects: [
    {
      title: "Tentazione — Alfajores artesanales",
      desc: "Sitio multipágina con catálogo, formulario de pedidos, WhatsApp y mapa. UI con Tailwind y slider en JS.",
      link: "https://jere-dev-tech.github.io/tentazione-web/",
      tags: ["HTML", "CSS", "Tailwind", "JavaScript"],
      cover: "./imagenes/Tentazionelog.png"
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
    player.stop?.();
    player.seek?.(0);
    player.pause?.();
  } catch (e) { /* noop */ }
  player.classList.add("is-playing");
  player.play?.();
}

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
   TEMA (matrix/cyberpunk/oceanic)
======================= */
function initThemeToggle(){
  const buttons = document.querySelectorAll('.icon-btn[data-theme]');
  const allThemes = ['matrix','cyberpunk','oceanic'];
  let current = localStorage.getItem('theme') || 'matrix';

  applyTheme(current);
  reflectActive(current);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.theme;
      if(!t || t === current) return;
      current = t;
      applyTheme(current);
      reflectActive(current);
    });
  });

  function applyTheme(t){
    document.documentElement.classList.remove(...allThemes);
    document.documentElement.classList.add(t);
    localStorage.setItem('theme', t);
  }
  function reflectActive(t){
    buttons.forEach(b => b.dataset.active = String(b.dataset.theme === t));
  }
}



/* =======================
   MENÚ MÓVIL (☰ → ✕ con 3 spans)
======================= */
function initMobileMenu(){
  const btn = document.getElementById("menuBtn");
  const list = document.getElementById("menuList");
  if(!btn || !list) return;

  // toggle normal (abre/cierra)
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // que no se dispare el click global
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    btn.classList.toggle("open", !expanded);
  });

  // cerrar al hacer clic en un link del menú
  list.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("open");
    });
  });

  // cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    const clickInside = btn.contains(e.target) || list.contains(e.target);
    if (!clickInside) {
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("open");
    }
  });
}


/* =======================
   FORMULARIO (DEMO)
======================= */
function initContactForm(){
  const form = document.getElementById("contactForm");
  const msg  = document.getElementById("formMsg");
  if(!form || !msg) return;

  // ⚠️ PONÉ TU NÚMERO AQUÍ: con código de país y sin + ni 0, ni guiones
  // Ej: Argentina (Catamarca) → 549XXXXXXXXXX (54 país + 9 móvil + número)
  const WHATSAPP_NUMBER = "5493834991628";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const { nombre, email, mensaje } = data;

    // Validación mínima
    if(!nombre || !email || !mensaje){
      msg.textContent = "Completá tu nombre, email y mensaje.";
      return;
    }

    // Armamos el texto
    const text =
`¡Hola Jeremías! 👋
Quiero contarte mi idea:

• Nombre: ${nombre}
• Email: ${email}

Mensaje:
${mensaje}

(Enviado desde tu portfolio)`;

    // Encode para URL
    const encoded = encodeURIComponent(text);
    const waURL   = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    // Intento abrir WhatsApp en nueva pestaña
    const win = window.open(waURL, "_blank", "noopener");
    msg.textContent = "Abriendo WhatsApp…";

    // Fallback: si el popup bloquea o no se abrió, ofrecemos email
    setTimeout(() => {
      if (!win || win.closed || typeof win.closed === "undefined") {
        const mailto = `mailto:tu-email@dominio.com?subject=${encodeURIComponent("Nuevo contacto desde el portfolio")}&body=${encoded}`;
        window.location.href = mailto;
        msg.textContent = "Si no tenés WhatsApp, se abrirá tu email.";
      }
    }, 400);

    // Limpio el form
    form.reset();
  });
}

/* =======================
   Splash de carga con memoria (mini/fast/full)
   (ÚNICA versión)
======================= */
async function initSplashLoader(){
  const splash = document.getElementById("splash");
  if(!splash){ finalizeBoot(); return; }

  const MINI_MS = 5 * 60 * 1000;     // <5 min: mini
  const FAST_MS = 30 * 60 * 1000;    // <30 min: fast

  const now  = Date.now();
  const last = Number(localStorage.getItem("splashSeenAt") || 0);
  const since = now - last;

  let mode = "full";
  if (since < MINI_MS)      mode = "mini";
  else if (since < FAST_MS) mode = "fast";

  const nav = performance.getEntriesByType?.("navigation")?.[0];
  if (nav && nav.type === "back_forward" && mode === "full") mode = "fast";

  document.body.classList.add("splashing");

  const cmdSpan   = document.getElementById("cmdSplash");
  const status    = document.getElementById("statusSplash");
  const statusTxt = document.getElementById("statusTextSplash");
  const cells     = document.getElementById("cellsSplash");
  const pctEl     = document.getElementById("pctSplash");
  const boot      = document.getElementById("bootSplash");
  const title     = splash.querySelector(".term-title");

  if(!cmdSpan || !status || !statusTxt || !cells){
    closeSplash(true); finalizeBoot(); return;
  }

  buildCells(cells, 10);

  // reduce motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    status.classList.remove("hide");
    statusTxt.textContent = "Listo ✅";
    title?.classList.add("title-accent");
    setCells(cells, 100, pctEl);
    await wait(250);
    closeSplash(true);
    finalizeBoot();
    return;
  }

  // MINI
  if (mode === "mini"){
    cmdSpan.textContent = "npm run dev";
    title?.classList.add("title-accent");
    status.classList.remove("hide");
    statusTxt.textContent = "Cargando…";
    setCells(cells, 0, pctEl);
    await animateCellsTo(cells, pctEl, 60, 350);
    await animateCellsTo(cells, pctEl, 100, 450);
    statusTxt.textContent = "Listo ✅";
    await wait(300);
    closeSplash();
    finalizeBoot();
    return;
  }

  // FAST
  if (mode === "fast"){
    cmdSpan.textContent = "";
    await typeText(cmdSpan, "npm run dev", 28);
    title?.classList.add("title-accent");
    status.classList.remove("hide");
    statusTxt.textContent = "Cargando…";
    setCells(cells, 0, pctEl);
    await animateCellsTo(cells, pctEl, 100, 700);
    statusTxt.textContent = "Listo ✅";
    await wait(350);
    closeSplash();
    finalizeBoot();
    return;
  }

  // FULL
  const firstCmd   = "npm install portfolio";
  const eraseCount = "install portfolio".length;
  const secondTail = "run dev";
  const statuses   = ["Instalando dependencias...", "Compilando...", "Listo ✅"];
  const speed = 60, eraseSpeed = 40;

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

  function closeSplash(immediate=false){
    localStorage.setItem("splashSeenAt", String(Date.now()));
    splash.classList.add("hide");
    document.body.classList.remove("splashing");
    if(!immediate){
      document.querySelector("main")?.scrollIntoView({ behavior:"smooth", block:"start" });
    }
  }
}

/* =======================
   Estrellas del hero (opcional)
======================= */
function initHeroStars(n = 60){
  const layer = document.querySelector(".hero.hero-neon .hero-stars");
  if(!layer) return;
  const frag = document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const s = document.createElement("span");
    s.className = "star";
    const x = Math.random()*100;
    const y = Math.random()*100;
    const d = 1 + Math.random()*2;
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

/* =======================
   Badge y finalización
======================= */
function startBadgeHand(){
  const badge = document.getElementById("heroBadge");
  if (!badge) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  badge.classList.remove("play");
  void badge.offsetWidth; // reflow
  badge.classList.add("play");
}

function finalizeBoot(){
  startHeroAnimation?.();
  startBadgeHand?.();
}

/* =======================
   BOOT
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
  initHeroStars(70);

  initSplashLoader().then(() => {
    // si agregás una terminal en el hero, se animará en loop
    initConsoleAnimation?.();
  });
});
function initCertsDisclosure(){
  const btn = document.querySelector('[data-open-cert]');
  const details = document.getElementById('certsToggle');
  if(!btn || !details) return;

  // Al hacer clic en "Ver certificados": abrir y scrollear
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!details.open) details.open = true;
    document.getElementById('certificados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // actualizar hash (opcional)
    history.replaceState(null, '', '#certificados');
  });

  // Si el usuario entra con #certificados en la URL, abrirlo
  if(location.hash === '#certificados'){
    details.open = true;
    // aseguramos scroll correcto tras el load
    setTimeout(() => {
      document.getElementById('certificados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}

// Llamalo en tu DOMContentLoaded existente:
document.addEventListener('DOMContentLoaded', () => {
  /* ...lo que ya tenés... */
  initCertsDisclosure();
});
