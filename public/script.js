"use strict";
const paths = {
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4V4Z"/>',
  bulb: '<path d="M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3h.01"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sparkles:
    '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  sliders:
    '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="white"/><circle cx="15" cy="17" r="2" fill="white"/>',
  sort: '<path d="M8 4v16m-3-3 3 3 3-3M14 6h6m-6 5h4m-4 5h2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  "arrow-down": '<path d="M12 4v16m-6-6 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  heart: '<path d="M20 5c-3-3-7 0-8 2-1-2-5-5-8-2-5 5 8 15 8 15S25 10 20 5Z"/>',
  trend: '<path d="m3 17 6-6 4 3 8-10m-6 0h6v6"/>',
  play: '<path d="m9 5 11 7-11 7V5Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkles}</svg>`;
const socialPaths = {
  instagram:
    '<rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.9" r="1"/>',
  tiktok:
    '<path d="M14 3h3c0 3 2 4 4 4v3c-2 0-3-.5-4-1v8a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3Z"/>',
  x: '<path d="M4 3h4.5L20 21h-4.5L4 3Zm1 18 7-8.5M13 11l7-8" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  youtube:
    '<path d="M21.5 7.5a3 3 0 0 0-2-2C17.8 5 12 5 12 5s-5.8 0-7.5.5a3 3 0 0 0-2 2C2 9.2 2 12 2 12s0 2.8.5 4.5a3 3 0 0 0 2 2C6.2 19 12 19 12 19s5.8 0 7.5-.5a3 3 0 0 0 2-2C22 14.8 22 12 22 12s0-2.8-.5-4.5Z"/><path d="m10 9 5 3-5 3V9Z" fill="white"/>',
  facebook:
    '<path d="M14 22v-9h3l.5-4H14V7c0-1 .5-2 2-2h2V1.5S16.5 1 15 1c-3 0-5 2-5 5v3H7v4h3v9h4Z"/>',
};
const social = (key) =>
  key === "all"
    ? icon("grid")
    : `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${socialPaths[key] || socialPaths.x}</svg>`;
const platforms = {
  all: { name: "Todas as redes", color: "#7855e7", bg: "#f0eafa" },
  tiktok: { name: "TikTok", color: "#222232", bg: "#eaf8f7" },
  instagram: { name: "Instagram", color: "#df4c8b", bg: "#ffedf4" },
  x: { name: "X / Twitter", color: "#282835", bg: "#eeeef2" },
  youtube: { name: "YouTube", color: "#ef4a4d", bg: "#fff0f0" },
  facebook: { name: "Facebook", color: "#3485ef", bg: "#eef5ff" },
};
// Editorial guidance, not performance claims or collected platform statistics.
const platformPages = {
  tiktok: {
    title: "Sua próxima história começa no TikTok",
    description:
      "Referências para vídeos verticais, ganchos e histórias com a sua voz.",
    eyebrow: "ESTÚDIO TIKTOK",
    headline: "Uma boa história.\nNo seu ritmo.",
    intro:
      "Do primeiro gancho à última cena: organize uma ideia que você consegue gravar.",
    focus: "Vídeo vertical",
    formats: ["Vídeo curto", "Série", "Bastidores"],
    prompt: "Qual pergunta do seu público merece uma resposta em vídeo?",
    steps: [
      "Abra com a pergunta",
      "Mostre um exemplo",
      "Convide para a conversa",
    ],
    planTitle: "Vídeo curto: uma pergunta que meu público faz",
    metaColor: "#101014",
  },
  instagram: {
    title: "Dê forma às suas ideias no Instagram",
    description:
      "Explore composições, histórias e referências para o seu próximo conteúdo.",
    eyebrow: "ESTÚDIO INSTAGRAM",
    headline: "Sua identidade.\nEm cada detalhe.",
    intro:
      "Reúna referências visuais e transforme uma ideia em Reel, carrossel ou Stories.",
    focus: "Narrativa visual",
    formats: ["Reel", "Carrossel", "Stories"],
    prompt:
      "Uma ideia, três maneiras de contar: escolha o formato que combina com você.",
    steps: [
      "Defina uma mensagem",
      "Crie uma sequência visual",
      "Finalize com um convite",
    ],
    planTitle: "Carrossel: uma ideia em uma sequência visual",
    metaColor: "#c72b79",
  },
  x: {
    title: "Sua perspectiva tem espaço no X",
    description:
      "Encontre pontos de partida para opiniões, conversas e threads autorais.",
    eyebrow: "ESTÚDIO X",
    headline: "Uma ideia clara.\nUma conversa aberta.",
    intro:
      "Organize um argumento, acrescente contexto e deixe espaço para outros pontos de vista.",
    focus: "Texto e conversa",
    formats: ["Post", "Thread", "Pergunta"],
    prompt:
      "Que opinião sobre o seu nicho você consegue defender com um exemplo?",
    steps: [
      "Apresente seu ponto",
      "Acrescente um exemplo",
      "Abra uma pergunta",
    ],
    planTitle: "Thread: meu ponto de vista com um exemplo",
    metaColor: "#111111",
  },
  youtube: {
    title: "Sua próxima ideia merece um vídeo",
    description:
      "Pesquise referências e organize histórias para vídeos, séries e Shorts.",
    eyebrow: "ESTÚDIO YOUTUBE",
    headline: "Do clique\nà próxima história.",
    intro:
      "Comece pela promessa do vídeo. Depois, conecte título, miniatura e roteiro.",
    focus: "Vídeo e série",
    formats: ["Vídeo", "Short", "Série"],
    prompt: "Qual dúvida você consegue resolver do início ao fim em um vídeo?",
    steps: [
      "Escreva a promessa",
      "Divida em três partes",
      "Planeje título e miniatura",
    ],
    planTitle: "Vídeo: uma dúvida resolvida em três partes",
    metaColor: "#d91c24",
  },
  facebook: {
    title: "Crie conteúdo que aproxima pessoas",
    description:
      "Referências para histórias, vídeos e conversas com a sua comunidade.",
    eyebrow: "ESTÚDIO FACEBOOK",
    headline: "Mais histórias.\nMais conexão.",
    intro:
      "Compartilhe algo útil, conte uma experiência e convide sua comunidade a participar.",
    focus: "Comunidade",
    formats: ["Post", "Vídeo", "Conversa"],
    prompt: "Que experiência sua pode ajudar alguém da sua comunidade hoje?",
    steps: [
      "Conte uma situação",
      "Compartilhe o aprendizado",
      "Convide outras experiências",
    ],
    planTitle: "Post: uma experiência para compartilhar com a comunidade",
    metaColor: "#0866ff",
  },
};

const niches = {
  all: "Todos os nichos",
  tecnologia: "Tecnologia",
  fitness: "Fitness & Saúde",
  culinaria: "Gastronomia",
  marketing: "Marketing",
  viagem: "Viagem",
  moda: "Moda & Beleza",
  games: "Games",
  esportes: "Esportes",
  filmes: "Filmes & Séries",
  musica: "Música",
};
const nicheEmoji = {
  all: "✧",
  tecnologia: "💻",
  fitness: "💪",
  culinaria: "🍳",
  marketing: "↗",
  viagem: "✈",
  moda: "✦",
  games: "🎮",
  esportes: "⚽",
  filmes: "🎬",
  musica: "♫",
};
const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
const overviewHero = $(".hero-banner").innerHTML;
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function storageRead(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}
let saved = storageRead("socialtrends:saved", []).filter(
  (x) => x && typeof x.id === "string",
);
let plans = storageRead("socialtrends:plans", []).filter(
  (x) => x && typeof x.title === "string",
);
const state = {
  view: "trends",
  platform: Object.hasOwn(
    platforms,
    new URLSearchParams(location.search).get("platform"),
  )
    ? new URLSearchParams(location.search).get("platform")
    : "all",
  niche: "all",
  period: 7,
  sort: "views",
  query: "",
  limit: 6,
  items: [],
  source: "demo",
  loading: true,
};
const pageNames = {
  trends: [
    "Explorar tendências",
    "O próximo assunto começa aqui",
    "Descubra o que está em alta e transforme tendências em grandes ideias.",
  ],
  saved: [
    "Conteúdos salvos",
    "Boas referências merecem ficar",
    "Sua coleção de inspiração, salva neste navegador.",
  ],
  ideas: [
    "Ideias de conteúdo",
    "Do insight à próxima publicação",
    "Escolha um ponto de partida e dê o seu toque pessoal.",
  ],
  times: [
    "Melhores horários",
    "Um bom conteúdo, na hora certa",
    "Explore um exemplo de distribuição de atividade ao longo da semana.",
  ],
  planner: [
    "Meu planejamento",
    "Dê espaço às suas próximas ideias",
    "Organize suas pautas e mantenha sua criatividade em movimento.",
  ],
};
let requestNumber = 0,
  toastTimer;
function hydrateIcons(root = document) {
  root
    .querySelectorAll("[data-icon]")
    .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
}
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3000);
}
function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast("Armazenamento indisponível. As alterações valem nesta sessão.");
    return false;
  }
}
function fmt(n) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n || 0);
}
function brandStyle(p) {
  return `--brand-color:${platforms[p]?.color || "#7855e7"};--brand-bg:${platforms[p]?.bg || "#f0eafa"}`;
}
function syncSaved() {
  $$(".saved-count").forEach((x) => (x.textContent = saved.length));
}
function toggleSave(item) {
  const found = saved.some((x) => x.id === item.id);
  saved = found
    ? saved.filter((x) => x.id !== item.id)
    : [...saved, { ...item }];
  persist("socialtrends:saved", saved);
  syncSaved();
  renderCurrent();
  toast(
    found ? "Conteúdo removido da coleção." : "Conteúdo salvo na sua coleção.",
  );
  return !found;
}
function renderPlatforms() {
  $("#platform-tabs").innerHTML = Object.entries(platforms)
    .map(
      ([key, p]) =>
        `<button id="platform-tab-${key}" role="tab" aria-controls="platform-panel" aria-selected="${state.platform === key}" tabindex="${state.platform === key ? 0 : -1}" class="platform-tab ${state.platform === key ? "active" : ""}" data-platform="${key}" style="${brandStyle(key)}"><span>${social(key)}</span>${p.name}</button>`,
    )
    .join("");
}
function renderChips() {
  $("#niche-chips").innerHTML = Object.entries(niches)
    .slice(0, 8)
    .map(
      ([key, label]) =>
        `<button class="chip ${state.niche === key ? "active" : ""}" data-niche="${key}" aria-pressed="${state.niche === key}"><span>${nicheEmoji[key]}</span> ${key === "fitness" ? "Fitness" : key === "moda" ? "Moda & Beleza" : label}</button>`,
    )
    .join("");
  $("#niche").value = state.niche;
}
function contentCard(item, index) {
  const p = platforms[item.platform] || platforms.all,
    isSaved = saved.some((x) => x.id === item.id);
  return `<article class="content-card" data-id="${esc(item.id)}"><div class="card-visual"><img src="${esc(safeImage(item.image))}" alt="${esc(item.image_alt || niches[item.nicho])}" loading="lazy"><span class="card-platform" style="${brandStyle(item.platform)}">${social(item.platform)} ${p.name}</span><button class="save-button ${isSaved ? "saved" : ""}" data-save="${esc(item.id)}" aria-label="${isSaved ? "Remover dos salvos" : "Salvar conteúdo"}" aria-pressed="${isSaved}">${icon("bookmark")}</button><span class="card-rank"><span>↗</span> ${item.source === "live" ? "Imagem ilustrativa" : "#" + (index + 1) + " na seleção"}</span><span class="format-badge">${icon(item.platform === "x" ? "grid" : "play")} ${esc(item.format || "Conteúdo")}</span></div><div class="card-body"><span class="card-category">${esc(niches[item.nicho] || item.nicho)}</span><h3><button class="card-title-button" data-detail="${esc(item.id)}">${esc(item.titulo)}</button></h3><div class="creator"><span class="creator-avatar">${esc((item.creator || "ST").replace("@", "").slice(0, 2).toUpperCase())}</span>${esc(item.creator || "Criador de conteúdo")}<span class="verified" aria-hidden="true">✦</span></div><div class="card-metrics"><span title="Visualizações">${icon("eye")} ${fmt(item.views)}</span><span title="Curtidas">${icon("heart")} ${fmt(item.likes)}</span>${item.growth ? `<span class="growth" title="Crescimento ilustrativo">${icon("trend")} +${esc(item.growth)}%</span>` : ""}</div></div></article>`;
}
function safeImage(value) {
  try {
    const u = new URL(value, location.href);
    return u.origin === location.origin || u.protocol === "https:"
      ? value
      : "assets/tecnologia.jpg";
  } catch {
    return "assets/tecnologia.jpg";
  }
}
function getFiltered() {
  return state.items
    .filter(
      (x) =>
        (state.platform === "all" || x.platform === state.platform) &&
        (state.niche === "all" || x.nicho === state.niche) &&
        (x.age_days === undefined || x.age_days < state.period) &&
        normalize(
          `${x.titulo} ${x.creator || ""} ${niches[x.nicho] || ""} ${x.hashtags || ""}`,
        ).includes(normalize(state.query)),
    )
    .sort((a, b) => (b[state.sort] || 0) - (a[state.sort] || 0));
}
function renderGrid() {
  const items = getFiltered();
  const label =
    state.platform === "all"
      ? "todas as redes"
      : platforms[state.platform].name;
  $("#result-count").innerHTML =
    `<strong>${items.length} conteúdos</strong> em ${esc(label)}`;
  $("#content-grid").innerHTML = state.loading
    ? '<div class="empty-state"><p>Carregando sua próxima inspiração…</p></div>'
    : items.length
      ? items.slice(0, state.limit).map(contentCard).join("")
      : empty(
          "Nenhum conteúdo por aqui",
          "Tente outro nicho ou uma busca diferente.",
          "Limpar filtros",
          "reset",
        );
  $("#load-more").hidden = items.length <= state.limit;
  $("#results-subtitle").textContent =
    state.platform === "all"
      ? "Uma seleção para despertar suas próximas ideias."
      : `Explore conteúdos de ${platforms[state.platform].name} no seu nicho.`;
  bindCards($("#content-grid"));
}
function empty(title, description, action, view) {
  return `<div class="empty-state">${icon("compass")}<h3>${esc(title)}</h3><p>${esc(description)}</p>${action ? `<button class="secondary-button" data-action="${view}">${esc(action)}</button>` : ""}</div>`;
}
function findItem(id) {
  return state.items.find((x) => x.id === id) || saved.find((x) => x.id === id);
}
function bindCards(root) {
  root.querySelectorAll("[data-save]").forEach(
    (b) =>
      (b.onclick = () => {
        const item = findItem(b.dataset.save);
        if (item) toggleSave(item);
      }),
  );
  root
    .querySelectorAll("[data-detail]")
    .forEach((b) => (b.onclick = () => showDetail(findItem(b.dataset.detail))));
  root
    .querySelectorAll('[data-action="reset"]')
    .forEach((b) => (b.onclick = resetFilters));
  root
    .querySelectorAll('[data-action="explore"]')
    .forEach((b) => (b.onclick = () => setView("trends")));
}
function updateSource() {
  const isLive = state.source === "live";
  $('#sort option[value="growth"]').disabled = isLive;
  if (isLive && state.sort === "growth") {
    state.sort = "views";
    $("#sort").value = "views";
  }
  $(".demo-indicator").innerHTML =
    `<span></span> ${isLive ? "Fonte conectada" : "Modo demonstração"}`;
  $(".sample-label").innerHTML =
    `${icon("info")} ${isLive ? "Dados coletados • amostra por hashtags" : "Dados de exemplo • métricas ilustrativas"}`;
}
async function loadFeed() {
  const n = ++requestNumber;
  state.loading = true;
  renderGrid();
  try {
    const params = new URLSearchParams({
      platform: state.platform,
      nicho: state.niche,
      days: state.period,
    });
    const r = await fetch(`/api/trending?${params}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) throw new Error("API indisponível");
    const data = await r.json();
    if (!Array.isArray(data.items) || !data.source)
      throw new Error("Formato inválido");
    if (n !== requestNumber) return;
    state.items = data.items;
    state.source = data.source;
  } catch {
    try {
      const r = await fetch("demo-data.json");
      if (!r.ok) throw new Error();
      const data = await r.json();
      if (n !== requestNumber) return;
      state.items = data.items;
      state.source = "demo";
    } catch {
      if (n !== requestNumber) return;
      state.items = [];
      toast(
        "Não foi possível carregar os conteúdos. Tente recarregar a página.",
      );
    }
  } finally {
    if (n === requestNumber) {
      state.loading = false;
      updateSource();
      renderGrid();
    }
  }
}
function platformPreview(page, key) {
  const formats = page.formats
    .map((format) => `<span>${esc(format)}</span>`)
    .join("");
  const steps = page.steps
    .map((step, index) => `<li><span>0${index + 1}</span>${esc(step)}</li>`)
    .join("");
  return `<div class="platform-board board-${key}">
    <div class="board-top"><span class="board-network">${social(key)} ${esc(platforms[key].name)}</span><span class="board-label">GUIA DE CRIAÇÃO</span></div>
    <div class="board-formats">${formats}</div>
    <div class="board-content"><div class="board-symbol" aria-hidden="true">${icon(key === "x" ? "compass" : key === "facebook" ? "heart" : "play")}</div><p>${esc(page.prompt)}</p></div>
    <ol class="board-steps">${steps}</ol>
    <span class="board-caption">Ponto de partida editorial · adapte ao seu nicho</span>
  </div>`;
}
function applyPlatformTheme() {
  const key = state.platform;
  const page = platformPages[key];
  document.body.dataset.platform = key;
  document.title = `${state.view === "trends" ? (page ? platforms[key].name : "Explorar") : pageNames[state.view][0]} · Social Trends`;
  document.querySelector('meta[name="theme-color"]').content =
    page?.metaColor || "#7855e7";
  $("#platform-panel").setAttribute("aria-labelledby", `platform-tab-${key}`);
  if (state.view === "trends") {
    $("#page-title").innerHTML =
      `${esc(page?.title || pageNames.trends[1])}<span>.</span>`;
    $("#page-description").textContent =
      page?.description || pageNames.trends[2];
    $(".eyebrow").textContent = page?.eyebrow || "SEU RADAR DE CONTEÚDO";
    $("#breadcrumb-current").textContent = page
      ? `Explorar / ${platforms[key].name}`
      : "Explorar tendências";
  }
  if (!page) {
    $(".hero-banner").innerHTML = overviewHero;
    $$(".hero-banner [data-social]").forEach(
      (el) => (el.innerHTML = social(el.dataset.social)),
    );
  } else {
    $(".hero-banner").innerHTML =
      `<div class="hero-copy"><span class="hero-badge"><span></span> ${esc(page.focus.toUpperCase())}</span><h2>${page.headline.split("\n").map(esc).join("<br>")}</h2><p>${esc(page.intro)}</p><button id="platform-plan">${icon("calendar")} Criar uma pauta <span>↗</span></button><button class="hero-explore-link" id="explore-now">Explorar referências ${icon("arrow-down")}</button></div>${platformPreview(page, key)}`;
    $("#platform-plan").onclick = () => {
      const niche = state.niche === "all" ? "" : ` · ${niches[state.niche]}`;
      addPlan(page.planTitle + niche, key);
      setView("planner");
    };
  }
  $("#explore-now").onclick = () => {
    $(".discovery").scrollIntoView({ behavior: "smooth" });
    $("#search").focus({ preventScroll: true });
  };
  $("#discovery-title").innerHTML =
    `${page ? `Referências para ${esc(platforms[key].name)}` : "Explorar referências"} <span class="live-label"><span></span> SELEÇÃO</span>`;
}
function choosePlatform(key) {
  if (!Object.hasOwn(platforms, key)) return;
  state.platform = key;
  state.limit = 6;
  const url = new URL(location.href);
  if (key === "all") url.searchParams.delete("platform");
  else url.searchParams.set("platform", key);
  history.replaceState(null, "", url);
  renderPlatforms();
  applyPlatformTheme();
  loadFeed();
}
function resetFilters() {
  state.query = "";
  state.niche = "all";
  state.period = 7;
  state.limit = 6;
  $("#search").value = "";
  $("#period").value = "7";
  renderChips();
  loadFeed();
}
function setView(view) {
  if (!pageNames[view]) return;
  state.view = view;
  const [name, title, description] = pageNames[view];
  $("#breadcrumb-current").textContent = name;
  $("#page-title").innerHTML = `${esc(title)}<span>.</span>`;
  $("#page-description").textContent = description;
  $$(".nav-item").forEach((x) => {
    x.classList.toggle("active", x.dataset.view === view);
    if (x.dataset.view === view) x.setAttribute("aria-current", "page");
    else x.removeAttribute("aria-current");
  });
  $("#explore-section").hidden = view !== "trends";
  $("#secondary-section").hidden = view === "trends";
  $("#sidebar").classList.remove("open");
  $("#menu-toggle").setAttribute("aria-expanded", "false");
  applyPlatformTheme();
  renderCurrent();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderCurrent() {
  if (state.view === "trends") renderGrid();
  else if (state.view === "saved") {
    const root = $("#secondary-section");
    root.innerHTML = `<div class="results-line"><span><strong>${saved.length} referências</strong> na sua coleção</span><span>Salvas neste navegador</span></div><div class="content-grid">${saved.length ? saved.map(contentCard).join("") : empty("Sua coleção começa com uma ideia", "Toque no marcador de um conteúdo para guardar sua inspiração.", "Explorar tendências", "explore")}</div>`;
    bindCards(root);
  } else if (state.view === "ideas") renderIdeas();
  else if (state.view === "times") renderTimes();
  else if (state.view === "planner") renderPlanner();
}
function showModal(html) {
  $("#dialog-content").innerHTML = html;
  hydrateIcons($("#detail-dialog"));
  if (!$("#detail-dialog").open) $("#detail-dialog").showModal();
}
function showDetail(item) {
  if (!item) return;
  const demo = item.source !== "live";
  showModal(
    `<div class="dialog-eyebrow">${esc(platforms[item.platform]?.name)} · ${esc(niches[item.nicho])}</div><h2 class="dialog-title">${esc(item.titulo)}</h2><img class="detail-image" src="${esc(safeImage(item.image))}" alt="${esc(item.image_alt || niches[item.nicho])}"><p class="dialog-description">${demo ? "Uma referência demonstrativa para explorar formatos e encontrar novas abordagens para o seu conteúdo." : esc(item.description || "Conteúdo coletado a partir de hashtags do nicho selecionado. Esta seleção não representa um ranking global da plataforma.")}</p><div class="detail-metrics"><div><strong>${fmt(item.views)}</strong><span>Visualizações</span></div><div><strong>${fmt(item.likes)}</strong><span>Curtidas</span></div><div><strong>${esc(item.format || "Post")}</strong><span>Formato</span></div></div><div class="note-box">${demo ? "Conteúdo, criador e métricas são exemplos ilustrativos. Não representam publicações reais." : "Os dados refletem o momento da coleta e podem mudar na plataforma."}</div><div class="dialog-actions"><button class="primary-button" id="detail-save">${icon("bookmark")} ${saved.some((x) => x.id === item.id) ? "Remover dos salvos" : "Salvar referência"}</button><button class="secondary-button" id="detail-plan">${icon("calendar")} Planejar uma ideia</button>${safePostUrl(item.url) ? `<a class="secondary-button" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Ver publicação ↗</a>` : ""}</div>`,
  );
  $("#detail-save").onclick = () => {
    toggleSave(item);
    showDetail(item);
  };
  $("#detail-plan").onclick = () => {
    addPlan(item.titulo, item.platform);
    $("#detail-dialog").close();
    setView("planner");
  };
}
function safePostUrl(url) {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      [
        "tiktok.com",
        "instagram.com",
        "x.com",
        "twitter.com",
        "youtube.com",
        "facebook.com",
      ].some((d) => u.hostname === d || u.hostname.endsWith("." + d))
    );
  } catch {
    return false;
  }
}
const ideaTemplates = [
  [
    "01",
    "Mostre o que ninguém vê",
    "Compartilhe um bastidor do seu trabalho. Conte uma decisão, um erro e o que você aprendeu.",
    "Bastidores: o que aprendi no meu processo",
  ],
  [
    "02",
    "Ensine algo em 30 segundos",
    "Escolha uma dúvida do seu nicho. Comece com a pergunta e responda com três passos práticos.",
    "3 passos para resolver uma dúvida do meu público",
  ],
  [
    "03",
    "Traga seu ponto de vista",
    "Escolha um assunto do seu nicho e explique sua visão com um exemplo que você viveu.",
    "Minha perspectiva sobre uma tendência do meu nicho",
  ],
];
function renderIdeas() {
  $("#secondary-section").innerHTML =
    `<div class="panel"><h2>Sua voz faz a diferença</h2><p>Use tendências como ponto de partida. Estas sugestões são editoriais e não dependem de métricas de uma conta conectada.</p></div><div class="panel-grid">${ideaTemplates.map(([n, t, d]) => `<article class="idea-card"><span>${n}</span><h3>${t}</h3><p>${d}</p><button class="secondary-button" data-idea="${n}">Levar para o planejamento ↗</button></article>`).join("")}</div>`;
  $$("[data-idea]").forEach(
    (b) =>
      (b.onclick = () => {
        const idea = ideaTemplates.find((x) => x[0] === b.dataset.idea);
        addPlan(
          idea[3],
          state.platform === "all" ? "instagram" : state.platform,
        );
        setView("planner");
      }),
  );
}
function renderTimes() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    hours = [6, 9, 12, 15, 18, 21];
  let grid = "<span></span>" + hours.map((h) => `<span>${h}h</span>`).join("");
  days.forEach((d, i) => {
    grid +=
      `<span>${d}</span>` +
      hours
        .map((h, j) => {
          const score = ((i * 7 + j * 11) % 60) + 40;
          return `<span class="heat-cell" style="--heat:rgba(151,111,214,${score / 140})" title="${d}, ${h}h: índice ilustrativo ${score}">${score}</span>`;
        })
        .join("");
  });
  $("#secondary-section").innerHTML =
    `<div class="panel"><h2>Mapa de atividade · exemplo</h2><p>Uma simulação para ajudar a interpretar um mapa de horários. Os valores não são recomendações personalizadas. Valide seus melhores horários com os insights da sua própria conta.</p><div class="heatmap">${grid}</div><div class="time-legend"><span>Horário de Brasília · índice de atividade ilustrativo</span><span>Menor ◻ ▪ Maior</span></div></div>`;
}
function addPlan(title, platform, date = "") {
  plans.push({
    id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
    title,
    platform,
    date,
  });
  persist("socialtrends:plans", plans);
  toast("Ideia adicionada ao planejamento.");
}
function renderPlanner() {
  $("#secondary-section").innerHTML =
    `<div class="panel"><h2>O que vamos criar?</h2><p>Guarde suas pautas com uma plataforma e uma data. Este planejamento fica salvo no navegador.</p><form class="planner-form" id="planner-form"><input name="title" aria-label="Título da pauta" placeholder="Uma ideia que vale compartilhar…" maxlength="180" required><select name="platform" aria-label="Rede social">${Object.entries(
      platforms,
    )
      .filter(([k]) => k !== "all")
      .map(([k, p]) => `<option value="${k}">${p.name}</option>`)
      .join(
        "",
      )}</select><input name="date" type="date" aria-label="Data planejada"><button class="primary-button" type="submit">Adicionar ideia +</button></form></div><div id="plan-list">${
      plans.length
        ? [...plans]
            .sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"))
            .map(
              (p) =>
                `<article class="plan-row"><span style="color:${platforms[p.platform]?.color || "#7855e7"}">${social(p.platform)}</span><div><strong>${esc(p.title)}</strong><small>${esc(platforms[p.platform]?.name || p.platform)} · ${p.date ? esc(new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(p.date + "T12:00:00"))) : "Sem data definida"}</small></div><button data-remove-plan="${esc(p.id)}" aria-label="Excluir pauta">${icon("trash")}</button></article>`,
            )
            .join("")
        : empty(
            "Um espaço para suas próximas ideias",
            "Adicione uma pauta ou salve uma ideia ao explorar os conteúdos.",
            "",
            "",
          )
    }</div>`;
  $("#planner-form").onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    if (!data.get("title").trim()) return;
    addPlan(data.get("title").trim(), data.get("platform"), data.get("date"));
    renderPlanner();
  };
  $$("[data-remove-plan]").forEach(
    (b) =>
      (b.onclick = () => {
        plans = plans.filter((p) => p.id !== b.dataset.removePlan);
        persist("socialtrends:plans", plans);
        renderPlanner();
        toast("Pauta removida.");
      }),
  );
}
function showHelp() {
  showModal(
    '<div class="dialog-eyebrow">Bem-vindo ao Social Trends</div><h2 class="dialog-title">Seu radar de inspiração.</h2><p class="dialog-description">1. Escolha uma rede social.<br>2. Filtre pelo seu nicho e busque um assunto.<br>3. Compare conteúdos por visualizações ou curtidas.<br>4. Salve referências e leve suas ideias para o planejamento.</p><div class="note-box">Esta prévia utiliza dados demonstrativos. A integração existente com Apify pode fornecer amostras de TikTok e Instagram na Vercel quando configurada. X, YouTube e Facebook permanecem em demonstração até terem uma fonte de dados conectada. A seleção não representa um ranking global das redes.</div><p class="dialog-description">Seus salvos e pautas ficam neste navegador. Não é necessário criar uma conta.</p>',
  );
}
hydrateIcons();
$$("[data-social]").forEach((el) => (el.innerHTML = social(el.dataset.social)));
$("#niche").innerHTML = Object.entries(niches)
  .map(([k, n]) => `<option value="${k}">${n}</option>`)
  .join("");
renderPlatforms();
applyPlatformTheme();
renderChips();
syncSaved();
$("#platform-tabs").onclick = (e) => {
  const b = e.target.closest(".platform-tab[data-platform]");
  if (b) choosePlatform(b.dataset.platform);
};
$("#platform-tabs").onkeydown = (e) => {
  const keys = Object.keys(platforms);
  let i = keys.indexOf(state.platform);
  if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
    e.preventDefault();
    i =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? keys.length - 1
          : (i + (e.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    choosePlatform(keys[i]);
    $(`.platform-tab[data-platform="${keys[i]}"]`).focus();
  }
};
$("#niche-chips").onclick = (e) => {
  const b = e.target.closest("[data-niche]");
  if (b) {
    state.niche = b.dataset.niche;
    state.limit = 6;
    renderChips();
    loadFeed();
  }
};
$("#niche").onchange = (e) => {
  state.niche = e.target.value;
  state.limit = 6;
  renderChips();
  loadFeed();
};
$("#period").onchange = (e) => {
  state.period = Number(e.target.value);
  state.limit = 6;
  loadFeed();
};
$("#sort").onchange = (e) => {
  state.sort = e.target.value;
  state.limit = 6;
  renderGrid();
};
$("#search").oninput = (e) => {
  state.query = e.target.value;
  state.limit = 6;
  renderGrid();
};
$("#load-more").onclick = () => {
  state.limit += 6;
  renderGrid();
};
$$("[data-view]").forEach((b) => (b.onclick = () => setView(b.dataset.view)));
$("#menu-toggle").onclick = () => {
  const open = $("#sidebar").classList.toggle("open");
  $("#menu-toggle").setAttribute("aria-expanded", String(open));
};
document.addEventListener("click", (e) => {
  if (!e.target.closest("#sidebar") && !e.target.closest("#menu-toggle")) {
    $("#sidebar").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
  }
});
$("#inspiration").onclick = () => {
  const items = getFiltered();
  if (!items.length) {
    toast("Explore outro nicho para encontrar uma inspiração.");
    return;
  }
  showDetail(items[Math.floor(Math.random() * items.length)]);
};
$("#help").onclick = showHelp;
$("#about-workspace").onclick = showHelp;
$(".close-dialog").onclick = () => $("#detail-dialog").close();
$("#detail-dialog").onclick = (e) => {
  if (e.target === $("#detail-dialog")) {
    const r = e.target.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      e.target.close();
  }
};
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) &&
    !$("#detail-dialog").open
  ) {
    e.preventDefault();
    setView("trends");
    $("#search").focus();
  }
  if (e.key === "Escape") {
    $("#sidebar").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
  }
});
loadFeed();
