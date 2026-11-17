// Genera los paneles SVG del perfil de GitHub de santiagop14.
// Sin dependencias: corre con Node 20+ (fetch nativo).
// En GitHub Actions usa GITHUB_TOKEN para leer estadísticas reales.
import { mkdir, writeFile } from "node:fs/promises";

const USER = process.env.PROFILE_USER || "santiagop14";
const OUT = process.env.OUT_DIR || "assets";
const TOKEN = process.env.GITHUB_TOKEN || "";
const OFFLINE = process.env.OFFLINE === "1";

// ---------- Contenido ----------
const PROFILE = {
  short: "SANTIAGO",
  full: "Néstor Santiago Pinto Roa",
  role: "INGENIERÍA DE SISTEMAS E INFORMÁTICA",
  place: "Piedecuesta · Bucaramanga, Colombia",
  prompt: "santiago@portafolio",
};

const ABOUT = [
  "Soy estudiante de sexto semestre de Ingeniería de Sistemas e Informática en la UPB Bucaramanga. Me gusta construir software real: que se despliegue, que tenga pruebas y que alguien lo use.",
  "Desarrollé solo ZOU Athletics, un e-commerce full-stack en producción con React, TypeScript, Node.js y PostgreSQL, y trabajé en equipo con Scrum en una plataforma de microservicios con Java y Spring Boot.",
  "Me enfoco en buenas prácticas: arquitectura limpia, pruebas automatizadas, revisión de código y CI/CD. Uso herramientas de IA como apoyo, sin dejar de lado el criterio técnico.",
  "Fuera del código me encanta el baloncesto, soy hincha del Atlético Bucaramanga y me interesa mucho el mundo de la inteligencia artificial.",
];

const FOCUS = [
  ["01", "CONSTRUIR", "Aplicaciones web full-stack de punta a punta, del diseño al despliegue"],
  ["02", "NUBE", "Infraestructura y despliegue en AWS (AWS Academy Cloud Foundations)"],
  ["03", "CALIDAD", "Pruebas automatizadas, revisión de código y pipelines de CI/CD"],
  ["04", "IA", "Aprender y construir soluciones con inteligencia artificial"],
  ["05", "CRECER", "Trabajo en equipo, nuevos retos y aprendizaje continuo"],
];

const SKILLS = [
  ["01 // LENGUAJES", "Java · TypeScript · JavaScript · Python · SQL", "#22d3ee"],
  ["02 // FRONTEND", "React · Vite · Tailwind CSS · shadcn/ui · HTML · CSS", "#2dd4bf"],
  ["03 // BACKEND Y DATOS", "Node.js · Express · Spring Boot · Sequelize · PostgreSQL", "#3b82f6"],
  ["04 // DEVOPS Y NUBE", "Docker · GitHub Actions · AWS · Vercel · Render · SonarQube", "#8b5cf6"],
  ["05 // PRUEBAS", "Vitest · Supertest · JUnit 5 · Mockito · JaCoCo", "#22d3ee"],
  ["06 // INFRAESTRUCTURA", "Windows Server · Active Directory · VirtualBox · Nagios", "#2dd4bf"],
];

const PROJECTS = [
  {
    id: "zou",
    name: "ZOU Athletics",
    tags: ["PROPIO", "EN PRODUCCIÓN"],
    stack: "React · TypeScript · Node.js · Express · PostgreSQL",
    desc: "Diseñé, construí y desplegué solo una plataforma de comercio electrónico para una tienda de ropa deportiva: tienda en línea, panel de administración, API REST con arquitectura limpia e inventario con movimientos auditables. Tiene más de 287 pruebas automatizadas, CI con GitHub Actions y está desplegada en Vercel, Render y Neon bajo un dominio propio.",
  },
  {
    id: "nexus",
    name: "The Nexus Battles VI",
    tags: ["EQUIPO", "SCRUM"],
    stack: "Java · Spring Boot · Docker · GitHub Actions · AWS",
    desc: "Trabajé como desarrollador en un equipo de más de 20 estudiantes bajo el marco Scrum, en el que entregamos por sprints una plataforma de videojuego con arquitectura de microservicios desplegada en AWS (Proyecto Integrador II, UPB). Participé en historias de usuario del backend, pruebas, revisión de código y CI/CD.",
  },
];

const CONTACTS = [
  ["github", "GH", "GitHub", "#e6edf3"],
  ["linkedin", "IN", "LinkedIn", "#3b82f6"],
  ["gmail", "GM", "Gmail", "#f87171"],
  ["portafolio", "WB", "Portafolio", "#2dd4bf"],
];

const TYPING = [
  "Desarrollador full-stack en formación",
  "React · TypeScript · Node.js · Spring Boot",
  "Pruebas, CI/CD y despliegues en la nube",
  "Interesado en la inteligencia artificial",
];

const TERMINAL = [
  ["build --full-stack", "#22d3ee"],
  ["test --coverage", "#2dd4bf"],
  ["deploy --cloud", "#3b82f6"],
  ["learn --ai", "#8b5cf6"],
  ["keep --growing", "#2dd4bf"],
];

// ---------- Utilidades SVG ----------
const MONO = "Consolas, 'SFMono-Regular', Menlo, 'Liberation Mono', monospace";
const SANS = "'Segoe UI', Helvetica, Arial, sans-serif";
const C = {
  text: "#e6f1ff", muted: "#8fa3ba", dim: "#5f7590", line: "#315474",
  cyan: "#22d3ee", teal: "#2dd4bf", blue: "#3b82f6", violet: "#8b5cf6",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(text, max) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
    else cur += " " + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

function defs(w, h, uid) {
  return `<defs>
<linearGradient id="bg${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#050914"/><stop offset="54%" stop-color="#081421"/><stop offset="100%" stop-color="#102238"/></linearGradient>
<linearGradient id="edge${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.cyan}"/><stop offset="48%" stop-color="${C.teal}"/><stop offset="78%" stop-color="${C.blue}"/><stop offset="100%" stop-color="${C.violet}"/></linearGradient>
<linearGradient id="scan${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.cyan}" stop-opacity="0"/><stop offset="50%" stop-color="${C.cyan}" stop-opacity="0.10"/><stop offset="100%" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>
<pattern id="grid${uid}" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#27415e" stroke-width="1" opacity="0.34"/></pattern>
<clipPath id="clip${uid}"><rect width="${w}" height="${h}" rx="20"/></clipPath>
<filter id="glow${uid}" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`;
}

// Marco común de panel tipo terminal
function panel({ w = 1200, h, uid, title, cmd, right, titleColor = C.teal, body, label }) {
  const head = title ? `
<circle cx="52" cy="56" r="4.5" fill="${titleColor}" filter="url(#glow${uid})"><animate attributeName="opacity" values="0.45;1;0.45" dur="2.8s" repeatCount="indefinite"/></circle>
<text x="68" y="62" fill="${titleColor}" font-size="16" font-weight="800" font-family="${MONO}">${esc(title)}</text>
<text x="52" y="88" fill="${C.muted}" font-size="13" font-family="${MONO}">${esc(PROFILE.prompt)}:~$ ${esc(cmd)}</text>
<text x="${w - 52}" y="62" fill="${C.dim}" font-size="12" text-anchor="end" font-family="${MONO}">${esc(right)}</text>
<line x1="52" y1="105" x2="${w - 52}" y2="105" stroke="${C.line}"/>
<line x1="52" y1="105" x2="210" y2="105" stroke="url(#edge${uid})" stroke-width="2"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label || title)}">
${defs(w, h, uid)}
<rect width="${w}" height="${h}" rx="20" fill="url(#bg${uid})"/>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="19" fill="url(#grid${uid})" opacity="0.2"/>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="19" fill="none" stroke="#345778" stroke-width="2"/>
<rect x="28" y="24" width="${w - 56}" height="${h - 48}" rx="17" fill="#060d17" fill-opacity="0.64" stroke="#2f648b" stroke-width="1.4"/>
<g clip-path="url(#clip${uid})"><rect x="0" y="-72" width="${w}" height="72" fill="url(#scan${uid})"><animateTransform attributeName="transform" type="translate" values="0 0;0 ${h + 72}" dur="11s" repeatCount="indefinite"/></rect></g>
<rect x="28" y="${h - 27}" width="${w - 56}" height="3" rx="1.5" fill="url(#edge${uid})" opacity="0.5"/>
${head}
${body}
</svg>`;
}

// ---------- Paneles ----------
function header(avatar) {
  const w = 1200, h = 340, u = "hd";
  const photo = avatar
    ? `<image href="${avatar}" x="842" y="56" width="228" height="228" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo${u})"/>`
    : `<rect x="842" y="56" width="228" height="228" rx="16" fill="#0b1a2c"/><text x="956" y="190" text-anchor="middle" fill="${C.cyan}" font-size="84" font-weight="800" font-family="${SANS}">SP</text>`;
  const corners = [[828, 42, 1, 1], [1084, 42, -1, 1], [828, 298, 1, -1], [1084, 298, -1, -1]]
    .map(([x, y, sx, sy]) => `<path d="M${x} ${y + 22 * sy}V${y}H${x + 22 * sx}" fill="none" stroke="${C.cyan}" stroke-width="3" filter="url(#glow${u})"/>`).join("");
  const body = `
<defs><clipPath id="photo${u}"><rect x="842" y="56" width="228" height="228" rx="16"/></clipPath></defs>
<rect x="64" y="64" width="232" height="30" rx="15" fill="#0b2233" stroke="${C.teal}" stroke-opacity="0.7"/>
<circle cx="84" cy="79" r="4" fill="${C.teal}" filter="url(#glow${u})"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite"/></circle>
<text x="96" y="84" fill="${C.teal}" font-size="13" font-weight="800" letter-spacing="1.5" font-family="${MONO}">PERFIL // ESTUDIANTE</text>
<text x="62" y="170" fill="#f8fbff" font-size="78" font-weight="900" letter-spacing="2" font-family="${SANS}">${esc(PROFILE.short)}</text>
<rect x="66" y="186" width="420" height="5" rx="2.5" fill="url(#edge${u})" filter="url(#glow${u})"/>
<rect x="66" y="186" width="80" height="5" rx="2.5" fill="#ffffff" opacity="0.85"><animate attributeName="x" values="66;406;66" dur="6s" repeatCount="indefinite"/></rect>
<text x="66" y="226" fill="${C.cyan}" font-size="20" font-weight="800" letter-spacing="1" font-family="${SANS}">${esc(PROFILE.role)}</text>
<text x="66" y="256" fill="${C.text}" font-size="17" font-weight="600" font-family="${SANS}">${esc(PROFILE.full)}</text>
<text x="66" y="282" fill="${C.muted}" font-size="15" font-family="${SANS}">${esc(PROFILE.place)}</text>
<g stroke="${C.teal}" stroke-opacity="0.6" stroke-width="1.5"><path d="M720 92h22M731 81v22"/><path d="M720 252h22M731 241v22"/></g>
<text x="796" y="180" fill="${C.dim}" font-size="11" letter-spacing="2" font-family="${MONO}" transform="rotate(-90 796 180)">PORTAFOLIO // 01</text>
<rect x="836" y="50" width="240" height="240" rx="20" fill="none" stroke="${C.cyan}" stroke-opacity="0.35" stroke-width="2"/>
${photo}
<rect x="842" y="56" width="228" height="228" rx="16" fill="none" stroke="url(#edge${u})" stroke-width="3"/>
${corners}
<circle cx="1068" cy="306" r="4" fill="#4ade80" filter="url(#glow${u})"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/></circle>
<text x="1058" y="310" fill="${C.dim}" font-size="11" letter-spacing="1.5" text-anchor="end" font-family="${MONO}">PERFIL EN LÍNEA</text>`;
  return panel({ w, h, uid: u, body, label: `Banner de perfil de ${PROFILE.full}` });
}

function divider() {
  const w = 1200, h = 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="dv" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.cyan}" stop-opacity="0"/><stop offset="30%" stop-color="${C.cyan}"/><stop offset="50%" stop-color="${C.teal}"/><stop offset="75%" stop-color="${C.violet}"/><stop offset="100%" stop-color="${C.violet}" stop-opacity="0"/></linearGradient>
<filter id="dg" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<line x1="40" y1="12" x2="1160" y2="12" stroke="url(#dv)" stroke-width="1.6"/>
<circle cx="420" cy="12" r="2.5" fill="${C.cyan}"/><circle cx="600" cy="12" r="4.5" fill="${C.teal}" filter="url(#dg)"/><circle cx="780" cy="12" r="2.5" fill="${C.violet}"/>
<circle cy="12" r="3" fill="#ffffff" filter="url(#dg)"><animate attributeName="cx" values="200;1000;200" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" dur="7s" repeatCount="indefinite"/></circle>
</svg>`;
}

// Texto que se "escribe" solo, una línea a la vez
function typingSvg() {
  const w = 900, h = 50, n = TYPING.length, total = n * 4, cw = 13.2;
  const clips = [], texts = [];
  TYPING.forEach((t, i) => {
    const s = i / n, e = (i + 1) / n, tw = Math.ceil(t.length * cw) + 4, x0 = (w - tw) / 2;
    const kt = [0], vals = [0];
    if (s > 0) { kt.push(s); vals.push(0); }
    kt.push(s + (e - s) * 0.45); vals.push(tw);
    if (e < 1) { kt.push(e - 0.002); vals.push(tw); kt.push(e); vals.push(0); kt.push(1); vals.push(0); }
    else { kt.push(1); vals.push(tw); }
    clips.push(`<clipPath id="tc${i}"><rect x="${x0}" y="0" height="${h}" width="0"><animate attributeName="width" dur="${total}s" repeatCount="indefinite" keyTimes="${kt.map((v) => v.toFixed(4)).join(";")}" values="${vals.join(";")}"/></rect></clipPath>`);
    texts.push(`<g clip-path="url(#tc${i})"><text x="${w / 2}" y="33" text-anchor="middle" fill="${C.cyan}" font-size="22" font-weight="700" font-family="${MONO}">${esc(t)}</text></g>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(TYPING.join(" · "))}">
<defs>${clips.join("")}</defs>
${texts.join("\n")}
</svg>`;
}

function about() {
  const w = 1200, u = "ab";
  const colors = [C.teal, C.cyan, C.blue, C.violet];
  let y = 140; const parts = [];
  ABOUT.forEach((p, i) => {
    const lines = wrap(p, 78);
    const top = y - 16;
    parts.push(`<rect x="60" y="${top}" width="3" height="${lines.length * 21 + 8}" rx="1.5" fill="${colors[i]}"/>`);
    lines.forEach((l) => { parts.push(`<text x="78" y="${y}" fill="${C.text}" font-size="15" font-family="${SANS}">${esc(l)}</text>`); y += 21; });
    y += 22;
  });
  const h = Math.max(y + 20, 420);
  // Ventana de código animada (derecha)
  const bx = 760, by = 128, bw = 384, bh = 236;
  const code = [
    [`const`, C.violet, ` dev = {`, C.text],
    [`  nombre:`, C.muted, ` "Santiago",`, "#fbbf24"],
    [`  stack:`, C.muted, ` ["React", "Node", "Java"],`, C.teal],
    [`  nube:`, C.muted, ` "AWS",`, "#fbbf24"],
    [`  aprendiendo:`, C.muted, ` "IA",`, "#fbbf24"],
    [`};`, C.text, ``, C.text],
    [`deploy`, C.cyan, `(dev); // ✓ listo`, C.dim],
  ];
  const lines = code.map(([a, ca, b, cb], i) => {
    const ly = by + 70 + i * 22;
    const d = (0.5 + i * 0.55).toFixed(2);
    return `<text x="${bx + 22}" y="${ly}" font-size="13.5" font-family="${MONO}" opacity="0"><tspan fill="${ca}">${esc(a)}</tspan><tspan fill="${cb}">${esc(b)}</tspan><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(d / 9).toFixed(3)};${((+d + 0.2) / 9).toFixed(3)};0.93;1" dur="9s" repeatCount="indefinite"/></text>`;
  }).join("\n");
  const body = `
${parts.join("\n")}
<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="#07111d" stroke="${C.cyan}" stroke-opacity="0.55" stroke-width="1.5"/>
<rect x="${bx}" y="${by}" width="${bw}" height="34" rx="12" fill="#0b1b2d"/>
<circle cx="${bx + 20}" cy="${by + 17}" r="5" fill="#f87171"/><circle cx="${bx + 38}" cy="${by + 17}" r="5" fill="#fbbf24"/><circle cx="${bx + 56}" cy="${by + 17}" r="5" fill="#4ade80"/>
<text x="${bx + bw - 16}" y="${by + 22}" fill="${C.dim}" font-size="11" text-anchor="end" font-family="${MONO}">CÓDIGO // EN VIVO</text>
${lines}
<rect x="${bx + 22}" y="${by + 70 + 7 * 22 - 13}" width="9" height="16" fill="${C.teal}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>`;
  return panel({ w, h, uid: u, title: "SOBRE MÍ / PERFIL.INFO", cmd: "cat perfil.info", right: "PERFIL // ACTIVO", body, label: "Sobre mí: " + ABOUT.join(" ") });
}

function focus() {
  const w = 1200, u = "fc", h = 140 + FOCUS.length * 50 + 40;
  const cols = [C.cyan, C.teal, C.blue, C.violet, C.teal];
  const rows = FOCUS.map(([n, k, d], i) => {
    const y = 130 + i * 50;
    return `<line x1="72" y1="${y + 18}" x2="72" y2="${y + 50}" stroke="${C.line}" stroke-dasharray="3 4"/>
<circle cx="72" cy="${y + 18}" r="10" fill="none" stroke="${cols[i]}" stroke-width="2"/><circle cx="72" cy="${y + 18}" r="4" fill="${cols[i]}" filter="url(#glow${u})"><animate attributeName="opacity" values="0.35;1;0.35" dur="2.4s" begin="${(i * 0.4).toFixed(1)}s" repeatCount="indefinite"/></circle>
<rect x="100" y="${y}" width="1046" height="36" rx="8" fill="#0a1626" stroke="#244663"/>
<text x="122" y="${y + 23}" fill="${cols[i]}" font-size="14" font-weight="800" font-family="${MONO}">${n}</text>
<text x="170" y="${y + 23}" fill="#f8fbff" font-size="14" font-weight="800" letter-spacing="1" font-family="${MONO}">${esc(k)}</text>
<text x="330" y="${y + 23}" fill="${C.text}" font-size="14.5" font-family="${SANS}">${esc(d)}</text>
<rect x="1100" y="${y + 16}" width="28" height="4" rx="2" fill="${cols[i]}" opacity="0.8"><animate attributeName="width" values="10;28;10" dur="3s" begin="${(i * 0.3).toFixed(1)}s" repeatCount="indefinite"/></rect>`;
  }).join("\n");
  return panel({ w, h, uid: u, title: "ENFOQUE ACTUAL // PIPELINE ACTIVO", cmd: "run enfoque --activo", right: `${FOCUS.length} NODOS // EN EJECUCIÓN`, body: rows, label: "Enfoque actual: " + FOCUS.map((f) => `${f[1]}: ${f[2]}`).join(". ") });
}

function skills() {
  const w = 1200, u = "sk";
  const rowsN = Math.ceil(SKILLS.length / 2), h = 130 + rowsN * 76 + 40;
  const cards = SKILLS.map(([t, d, col], i) => {
    const x = i % 2 === 0 ? 60 : 610, y = 128 + Math.floor(i / 2) * 76;
    return `<rect x="${x}" y="${y}" width="530" height="62" rx="8" fill="#0a1626" stroke="#244663"/>
<rect x="${x}" y="${y}" width="3" height="62" rx="1.5" fill="${col}"/>
<circle cx="${x + 22}" cy="${y + 22}" r="3.5" fill="${col}" filter="url(#glow${u})"/>
<text x="${x + 34}" y="${y + 27}" fill="${col}" font-size="13" font-weight="800" font-family="${MONO}">${esc(t)}</text>
<text x="${x + 22}" y="${y + 49}" fill="${C.text}" font-size="13.5" font-family="${SANS}">${esc(d)}</text>`;
  }).join("\n");
  return panel({ w, h, uid: u, titleColor: C.blue, title: "STACK TÉCNICO // CAJA DE HERRAMIENTAS", cmd: "scan toolkit --declarado", right: `${SKILLS.length} CATEGORÍAS`, body: cards, label: "Stack técnico: " + SKILLS.map((s) => s[0] + ": " + s[1]).join(". ") });
}

function projectsList() {
  const w = 1200, u = "pl", h = 130 + PROJECTS.length * 44 + 40;
  const cols = [C.cyan, C.teal, C.blue, C.violet];
  const rows = PROJECTS.map((p, i) => {
    const y = 128 + i * 44;
    return `<rect x="60" y="${y}" width="1080" height="34" rx="6" fill="#0a1626" stroke="#244663"/>
<circle cx="80" cy="${y + 17}" r="4" fill="${cols[i]}" filter="url(#glow${u})"/>
<text x="96" y="${y + 22}" fill="${cols[i]}" font-size="13" font-weight="800" font-family="${MONO}">[0${i + 1}]</text>
<text x="150" y="${y + 22}" fill="#f8fbff" font-size="14.5" font-weight="700" font-family="${SANS}">${esc(p.name)}</text>
<text x="1124" y="${y + 22}" fill="${C.dim}" font-size="12" text-anchor="end" font-family="${MONO}">proyecto.${p.id}</text>`;
  }).join("\n");
  return panel({ w, h, uid: u, titleColor: C.violet, title: "PROYECTOS.LIST", cmd: "./proyectos.sh --todos", right: `${PROJECTS.length} PROYECTOS // CARGADOS`, body: rows, label: "Lista de proyectos: " + PROJECTS.map((p) => p.name).join(", ") });
}

function projectCard(p, i) {
  const w = 1200, u = "pc" + i;
  const lines = wrap(p.desc, 112);
  const h = 264 + lines.length * 21 + 56;
  let tx = 1124;
  const tags = [...p.tags].reverse().map((t) => {
    const tw = t.length * 8 + 28; tx -= tw;
    const r = `<rect x="${tx}" y="160" width="${tw}" height="26" rx="13" fill="#0b2233" stroke="${C.teal}" stroke-opacity="0.75"/><text x="${tx + tw / 2}" y="177" fill="${C.teal}" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="1" font-family="${MONO}">${esc(t)}</text>`;
    tx -= 10; return r;
  }).join("");
  const body = `
<text x="62" y="140" fill="${C.dim}" font-size="11" letter-spacing="1.5" font-family="${MONO}">PROYECTO 0${i + 1} // VERIFICADO</text>
<text x="60" y="182" fill="#f8fbff" font-size="32" font-weight="900" font-family="${SANS}">${esc(p.name)}</text>
${tags}
<text x="62" y="214" fill="${C.cyan}" font-size="12.5" font-weight="700" font-family="${MONO}">STACK: ${esc(p.stack)}</text>
<text x="62" y="240" fill="#4ade80" font-size="11" font-weight="800" letter-spacing="1" font-family="${MONO}">DESCRIPCIÓN.LOG</text>
${lines.map((l, k) => `<text x="62" y="${264 + k * 21}" fill="${C.text}" font-size="14.5" font-family="${SANS}">${esc(l)}</text>`).join("\n")}
<text x="${w - 64}" y="${h - 40}" fill="${C.dim}" font-size="10.5" text-anchor="end" letter-spacing="1" font-family="${MONO}">ENLACES // ABAJO</text>`;
  return panel({ w, h, uid: u, titleColor: [C.cyan, C.teal][i % 2], title: `[0${i + 1}] proyecto.${p.id}`, cmd: `inspect proyecto.${p.id}`, right: "PROYECTO // LISTO", body, label: `${p.name}: ${p.desc}` });
}

function contactTile([id, abbr, name, col]) {
  const w = 260, h = 68;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(name)}">
<defs><linearGradient id="tb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a1626"/><stop offset="100%" stop-color="#10223a"/></linearGradient>
<filter id="tg" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="url(#tb)" stroke="#2f648b" stroke-width="1.5"/>
<circle cx="38" cy="34" r="16" fill="none" stroke="${col}" stroke-width="1.6"/>
<text x="38" y="38.5" text-anchor="middle" fill="${col}" font-size="11" font-weight="800" font-family="${MONO}">${abbr}</text>
<text x="66" y="40" fill="#f8fbff" font-size="17" font-weight="700" font-family="${SANS}">${esc(name)}</text>
<circle cx="${w - 18}" cy="16" r="3.5" fill="${col}" filter="url(#tg)"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite"/></circle>
<rect x="14" y="${h - 9}" width="${w - 28}" height="2" rx="1" fill="${col}" opacity="0.6"/>
</svg>`;
}

function connectPanel() {
  return panel({ w: 1200, h: 140, uid: "cn", title: "CONTACTO // DISPONIBLE", cmd: "open contactos", right: `${CONTACTS.length} CANALES // LISTOS`, body: "", label: "Canales de contacto" });
}

function fmt(n) { return Number(n || 0).toLocaleString("es-CO"); }

function statsPanel(s) {
  const w = 1200, u = "st", h = 230;
  const boxes = [
    ["CONTRIBUCIONES", fmt(s.contributions), "ÚLTIMO AÑO", C.cyan],
    ["COMMITS", fmt(s.commits), "ÚLTIMO AÑO", C.teal],
    ["PULL REQUESTS", fmt(s.prs), "ÚLTIMO AÑO", C.blue],
    ["REPOS PÚBLICOS", fmt(s.repos), "PROPIOS", C.violet],
  ].map(([t, v, sub, col], i) => {
    const x = 60 + i * 272;
    return `<rect x="${x}" y="124" width="256" height="72" rx="8" fill="#0a1626" stroke="#244663"/>
<text x="${x + 16}" y="153" fill="${col}" font-size="22" font-weight="900" font-family="${MONO}">${esc(v)}</text>
<text x="${x + 16}" y="173" fill="${C.text}" font-size="11" font-weight="700" letter-spacing="1" font-family="${MONO}">${esc(t)}</text>
<text x="${x + 240}" y="153" fill="${C.dim}" font-size="9.5" text-anchor="end" font-family="${MONO}">${esc(sub)}</text>
<rect x="${x + 16}" y="182" width="224" height="3" rx="1.5" fill="#1b3048"/><rect x="${x + 16}" y="182" width="${60 + i * 40}" height="3" rx="1.5" fill="${col}"><animate attributeName="width" values="20;${100 + i * 30};20" dur="${4 + i}s" repeatCount="indefinite"/></rect>`;
  }).join("\n");
  return panel({ w, h, uid: u, titleColor: C.blue, title: "SEÑAL DEL PERFIL // DATOS EN VIVO", cmd: "read perfil.signal --live", right: `ACTUALIZADO ${s.updated}`, body: boxes, label: "Estadísticas de GitHub" });
}

function card(w, h, title, inner, uid) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<defs><linearGradient id="cb${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a1322"/><stop offset="100%" stop-color="#101d33"/></linearGradient>
<linearGradient id="ce${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.cyan}"/><stop offset="100%" stop-color="${C.violet}"/></linearGradient></defs>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="url(#cb${uid})" stroke="#2a3f5c" stroke-width="1.5"/>
<text x="24" y="38" fill="#7cc4ff" font-size="18" font-weight="700" font-family="${SANS}">${esc(title)}</text>
<line x1="24" y1="52" x2="${w - 24}" y2="52" stroke="url(#ce${uid})" stroke-opacity="0.6"/>
${inner}
</svg>`;
}

function statsCard(s) {
  const items = [
    ["Estrellas", fmt(s.stars), C.violet], ["Repositorios", fmt(s.repos), C.blue], ["Seguidores", fmt(s.followers), C.teal],
    ["Forks", fmt(s.forks), "#fbbf24"], ["Contribuciones", fmt(s.contributions), "#f87171"], ["Repos a los que aporté", fmt(s.contributedTo), C.cyan],
  ];
  const inner = items.map(([k, v, col], i) => {
    const x = 28 + (i % 3) * 176, y = 86 + Math.floor(i / 3) * 62;
    return `<circle cx="${x + 4}" cy="${y - 5}" r="4" fill="${col}"/><text x="${x + 16}" y="${y}" fill="${C.muted}" font-size="12.5" font-family="${SANS}">${esc(k)}</text>
<text x="${x + 16}" y="${y + 28}" fill="#f8fbff" font-size="24" font-weight="800" font-family="${SANS}">${esc(v)}</text>`;
  }).join("\n");
  return card(580, 230, `Estadísticas de ${USER}`, inner, "s");
}

function langsCard(s) {
  const langs = s.langs.slice(0, 6);
  const total = langs.reduce((a, l) => a + l.size, 0) || 1;
  let x = 24; const barW = 532;
  const bar = langs.map((l) => { const lw = (l.size / total) * barW; const r = `<rect x="${x.toFixed(1)}" y="72" width="${Math.max(lw, 1).toFixed(1)}" height="10" fill="${l.color || C.cyan}"/>`; x += lw; return r; }).join("");
  const legend = langs.map((l, i) => {
    const lx = 28 + (i % 2) * 270, ly = 116 + Math.floor(i / 2) * 32;
    return `<circle cx="${lx + 5}" cy="${ly - 5}" r="5" fill="${l.color || C.cyan}"/><text x="${lx + 18}" y="${ly}" fill="${C.text}" font-size="14" font-family="${SANS}">${esc(l.name)} <tspan fill="${C.muted}">${((l.size / total) * 100).toFixed(1)}%</tspan></text>`;
  }).join("\n");
  const inner = `<clipPath id="lbclip"><rect x="24" y="72" width="${barW}" height="10" rx="5"/></clipPath><g clip-path="url(#lbclip)">${bar}</g>\n${legend}`;
  return card(580, 230, "Lenguajes más usados", inner, "l");
}

function terminal() {
  const w = 1200, u = "tm", h = 150 + TERMINAL.length * 26 + 60;
  const lines = TERMINAL.map(([c, col], i) => {
    const y = 140 + i * 26;
    return `<text x="70" y="${y}" font-size="15" font-weight="700" font-family="${MONO}" opacity="0"><tspan fill="${C.text}">&gt; </tspan><tspan fill="${col}">${esc(c)}</tspan><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(i * 0.12).toFixed(2)};${(i * 0.12 + 0.05).toFixed(2)};0.92;1" dur="10s" repeatCount="indefinite"/></text>
<rect x="980" y="${y - 8}" width="120" height="3" rx="1.5" fill="${col}" opacity="0.5"/>`;
  }).join("\n");
  const sy = 140 + TERMINAL.length * 26 + 18;
  const body = `${lines}
<text x="70" y="${sy}" fill="${C.dim}" font-size="12" font-family="${MONO}">estado: siempre aprendiendo...</text>
<rect x="290" y="${sy - 12}" width="9" height="15" fill="${C.teal}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>`;
  return panel({ w, h, uid: u, titleColor: C.teal, title: "SESIÓN // ACTIVA", cmd: "./loop.sh", right: "SIN FIN // EJECUTANDO", body, label: "Terminal: " + TERMINAL.map((t) => t[0]).join(", ") });
}

// ---------- Datos ----------
async function gql(query, variables) {
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": USER },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

async function getStats() {
  const updated = new Date().toISOString().slice(0, 10);
  if (OFFLINE || !TOKEN) {
    return { updated, contributions: 251, commits: 180, prs: 12, repos: 9, stars: 0, forks: 0, followers: 0, contributedTo: 4,
      langs: [{ name: "TypeScript", size: 60, color: "#3178c6" }, { name: "Java", size: 25, color: "#b07219" }, { name: "JavaScript", size: 8, color: "#f1e05a" }, { name: "CSS", size: 4, color: "#663399" }, { name: "HTML", size: 3, color: "#e34c26" }] };
  }
  const d = await gql(`query($login:String!){ user(login:$login){
    followers{ totalCount }
    repositories(ownerAffiliations:OWNER, isFork:false, first:100, privacy:PUBLIC){ totalCount nodes{ name stargazerCount forkCount
      languages(first:10, orderBy:{field:SIZE, direction:DESC}){ edges{ size node{ name color } } } } }
    repositoriesContributedTo(first:1, contributionTypes:[COMMIT, PULL_REQUEST], includeUserRepositories:false){ totalCount }
    contributionsCollection{ totalCommitContributions totalPullRequestContributions restrictedContributionsCount contributionCalendar{ totalContributions } }
  } }`, { login: USER });
  const u = d.user;
  const map = new Map();
  for (const repo of u.repositories.nodes) {
    if (repo.name.toLowerCase() === USER.toLowerCase()) continue; // excluir el repo del perfil
    for (const e of repo.languages.edges) {
      const cur = map.get(e.node.name) || { name: e.node.name, size: 0, color: e.node.color };
      cur.size += e.size; map.set(e.node.name, cur);
    }
  }
  const cc = u.contributionsCollection;
  return {
    updated,
    contributions: cc.contributionCalendar.totalContributions,
    commits: cc.totalCommitContributions + cc.restrictedContributionsCount,
    prs: cc.totalPullRequestContributions,
    repos: u.repositories.totalCount,
    stars: u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0),
    forks: u.repositories.nodes.reduce((a, r) => a + r.forkCount, 0),
    followers: u.followers.totalCount,
    contributedTo: u.repositoriesContributedTo.totalCount,
    langs: [...map.values()].sort((a, b) => b.size - a.size),
  };
}

async function getAvatar() {
  if (OFFLINE) return null;
  try {
    const r = await fetch(`https://github.com/${USER}.png?size=460`);
    if (!r.ok) return null;
    const type = r.headers.get("content-type") || "image/png";
    const buf = Buffer.from(await r.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch { return null; }
}

// ---------- Main ----------
const [stats, avatar] = await Promise.all([getStats(), getAvatar()]);
await mkdir(OUT, { recursive: true });
const files = {
  "header.svg": header(avatar),
  "divider.svg": divider(),
  "typing.svg": typingSvg(),
  "about.svg": about(),
  "focus.svg": focus(),
  "skills.svg": skills(),
  "projects.svg": projectsList(),
  "connect.svg": connectPanel(),
  "stats-panel.svg": statsPanel(stats),
  "stats.svg": statsCard(stats),
  "langs.svg": langsCard(stats),
  "terminal.svg": terminal(),
};
PROJECTS.forEach((p, i) => { files[`project-${p.id}.svg`] = projectCard(p, i); });
CONTACTS.forEach((c) => { files[`contact-${c[0]}.svg`] = contactTile(c); });
for (const [name, svg] of Object.entries(files)) await writeFile(`${OUT}/${name}`, svg);
console.log(`Generados ${Object.keys(files).length} SVG en ${OUT}/ (avatar: ${avatar ? "sí" : "no"})`);
