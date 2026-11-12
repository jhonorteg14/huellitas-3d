/* Huellitas 3D · v2 — contenido desde data/*.json (editable en /admin) */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => "$" + Number(n).toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num2 = n => Number(n).toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const asset = p => !p ? "" : (/^(https?:)?\/\//.test(p) ? p : p.replace(/^\//, ""));
  let WA = "593992642244";
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  const seed = (() => { try { return JSON.parse($("#seed")?.textContent || "{}"); } catch (e) { return {}; } })();
  async function load(name) {
    try { const r = await fetch(`data/${name}.json`, { cache: "no-cache" }); if (!r.ok) throw 0; return await r.json(); }
    catch (e) { return seed[name] || {}; }
  }

  /* ---------- Render ---------- */
  let S = {}, T = [], R = {};
  function renderSite() {
    WA = (S.contacto?.whatsapp || WA).replace(/\D/g, "");
    $$(".js-wa").forEach(a => a.href = waLink(a.dataset.msg || "Hola Huellitas 3D"));
    // aviso
    const av = $("#aviso");
    if (S.aviso?.activo && S.aviso.texto) { av.innerHTML = S.aviso.enlace ? `<a href="${esc(S.aviso.enlace)}">${esc(S.aviso.texto)}</a>` : esc(S.aviso.texto); av.hidden = false; }
    // eslogan: última palabra en verde
    if (S.eslogan) {
      const w = S.eslogan.trim().split(/\s+/);
      $("#eslogan").innerHTML = w.map((x, i) => `<span class="w${i === w.length - 1 ? " g" : ""}">${esc(x)}</span>`).join(" ");
    }
    if (S.hero_subtitulo) $("#heroSub").textContent = S.hero_subtitulo;
    const p = Number(S.precio_hora || 1.25);
    $("#stPrice").textContent = money(p);
    $("#precioTxt").textContent = `Con tu archivo o diseño 3D calculamos cuántas horas tarda la impresión. Cada hora cuesta ${money(p)}${S.material_incluido !== false ? " y el material ya está incluido" : ""}. La cotización es gratis y sin compromiso.`;
    // marquee
    const items = ["Figuras personalizadas", "Retratos de mascotas", "Litofanías", "Lienzos", "Funkos", "Maquetas", "Piezas mecánicas", "Prototipos", "Electrónica", "Robótica"];
    const one = items.map(t => `${esc(t)}<i>✦</i>`).join("");
    $("#strip").innerHTML = `<span>${one}</span><span>${one}</span>`;
    // servicios
    $("#svc").innerHTML = (S.servicios || []).map(s => `
      <article class="s ${s.imagen ? "" : "circuit"} reveal">
        <div class="media">${s.imagen ? `<img src="${esc(asset(s.imagen))}" alt="${esc(s.titulo)}" loading="lazy">` : circuitSVG()}</div>
        <div class="txt"><h3>${esc(s.titulo)}</h3><p>${esc(s.descripcion)}</p>
          ${s.etiquetas?.length ? `<div class="tags">${s.etiquetas.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
          ${s.precio_texto ? `<div class="price">${esc(s.precio_texto)}</div>` : ""}</div>
      </article>`).join("");
    // faq
    $("#faq").innerHTML = (S.faq || []).map(f => `<details><summary>${esc(f.pregunta)}</summary><p>${esc(f.respuesta)}</p></details>`).join("");
    // nosotros
    $("#nosTxt").innerHTML = (S.nosotros || []).map(t => `<p>${esc(typeof t === "string" ? t : t.parrafo)}</p>`).join("");
    // contacto
    const c = S.contacto || {};
    $("#contacto").innerHTML = `
      <div><h3>WhatsApp</h3><p><a href="${waLink("Hola Huellitas 3D")}" target="_blank" rel="noopener">${esc(c.whatsapp_visible || c.whatsapp)}</a></p></div>
      <div><h3>Correo</h3><p>${esc(c.correo)}</p></div>
      <div><h3>Dirección</h3><p>${esc(c.direccion)}${c.maps ? `<br><a href="${esc(c.maps)}" target="_blank" rel="noopener">Ver en Google Maps</a>` : ""}</p></div>
      <div><h3>Horario</h3><p>${(c.horario || []).map(esc).join("<br>")}</p></div>`;
    $("#social").innerHTML = [c.facebook && `<a href="${esc(c.facebook)}" target="_blank" rel="noopener">Facebook</a>`, c.tiktok && `<a href="${esc(c.tiktok)}" target="_blank" rel="noopener">TikTok</a>`].filter(Boolean).join(" · ").replace(/^/, "Síguenos: ");
  }
  function renderReviews() {
    const rating = R.calificacion || "5,0";
    $("#stRating").textContent = rating;
    $("#rvKicker").textContent = `Reseñas en ${R.fuente || "Google Maps"} · ${rating} ★`;
    $("#reviews").innerHTML = (R.resenas || []).map(r => `
      <figure class="rv reveal"><div class="stars" aria-label="${r.estrellas || 5} de 5 estrellas">${"★".repeat(r.estrellas || 5)}</div>
        <blockquote>“${esc(r.texto)}”</blockquote><figcaption><i aria-hidden="true">${esc((r.nombre || "?").trim().charAt(0))}</i>${esc(r.nombre)}</figcaption></figure>`).join("");
  }
  function circuitSVG() {
    return `<svg viewBox="0 0 520 240" role="img" aria-label="Ilustración de una placa electrónica con microcontrolador, sensores y motor">
      <g fill="none" stroke="#2E5A3B" stroke-width="2"><rect x="190" y="70" width="140" height="100" rx="10"/><rect x="40" y="40" width="80" height="50" rx="8"/><rect x="40" y="150" width="80" height="50" rx="8"/><circle cx="440" cy="120" r="42"/><circle cx="440" cy="120" r="12"/></g>
      <g fill="#2E5A3B">${[205, 225, 245, 265, 285, 305].map(x => `<rect x="${x}" y="60" width="6" height="10"/><rect x="${x}" y="170" width="6" height="10"/>`).join("")}</g>
      <g fill="none" stroke="#00FA4B" stroke-width="2.4" stroke-linecap="round" class="trace"><path d="M120 65H160V100H190"/><path d="M120 175H160V140H190"/><path d="M330 120H398"/></g>
      <g font-family="IBM Plex Mono, monospace" font-size="13" fill="#9CC9A8"><text x="80" y="70" text-anchor="middle">SENSOR</text><text x="80" y="180" text-anchor="middle">ENTRADA</text><text x="260" y="125" text-anchor="middle" fill="#E6EEE8">MCU</text><text x="440" y="186" text-anchor="middle">MOTOR</text></g></svg>`;
  }

  /* ---------- Galería ---------- */
  let filter = "Todos", list = [];
  function visibleWorks() {
    const v = T.filter(t => t.visible !== false && t.imagen);
    return [...v.filter(t => t.destacado), ...v.filter(t => !t.destacado)];
  }
  function renderFilters() {
    const v = visibleWorks(); const cats = {};
    v.forEach(t => cats[t.categoria || "Otros"] = (cats[t.categoria || "Otros"] || 0) + 1);
    const all = [["Todos", v.length], ...Object.entries(cats)];
    $("#filters").innerHTML = all.map(([c, n]) => `<button type="button" class="chip" aria-pressed="${c === filter}" data-cat="${esc(c)}">${esc(c)} <small>${n}</small></button>`).join("");
    const st = $("#stWorks"); st.dataset.to = v.length; st.textContent = v.length;
  }
  function renderGrid() {
    const v = visibleWorks();
    list = filter === "Todos" ? v : v.filter(t => (t.categoria || "Otros") === filter);
    $("#grid").innerHTML = list.length ? list.map((t, i) => `
      <button type="button" class="work" data-i="${i}" aria-label="Ver ${esc(t.titulo)} en grande">
        <img src="${esc(asset(t.imagen))}" alt="${esc(t.titulo)}: ${esc(t.descripcion || t.categoria)}" loading="lazy">
        ${t.destacado ? `<span class="badge">Destacado</span>` : ""}${t.modelo3d ? `<span class="badge d3">3D</span>` : ""}
        <span class="meta"><b>${esc(t.titulo)}</b><span>${esc(t.categoria || "")}</span></span>
      </button>`).join("") : `<p class="empty">Aún no hay trabajos en esta categoría.</p>`;
    if (window.gsap && !reduce) gsap.fromTo("#grid .work", { y: 24, opacity: .2 }, { y: 0, opacity: 1, duration: .5, stagger: .04, ease: "power2.out" });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  $("#filters").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; filter = b.dataset.cat; renderFilters(); renderGrid(); });
  $("#grid").addEventListener("click", e => { const b = e.target.closest(".work"); if (b) openLB(+b.dataset.i); });
  // tilt
  if (!coarse && !reduce) {
    $("#grid").addEventListener("pointermove", e => { const w = e.target.closest(".work"); if (!w) return; const r = w.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; w.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`; });
    $("#grid").addEventListener("pointerout", e => { const w = e.target.closest(".work"); if (w && !w.contains(e.relatedTarget)) w.style.transform = ""; });
  }

  /* ---------- Lightbox con zoom ---------- */
  const lb = $("#lb"), img = $("#lbImg");
  let cur = 0, pics = [], pi = 0, zoom = false, pan = { x: 0, y: 0 }, lastFocus = null, lbViewer = null;
  function openLB(i) { lastFocus = document.activeElement; lb.hidden = false; document.documentElement.style.overflow = "hidden"; window.__lenis?.stop(); showLB(i); $("#lbClose").focus(); }
  function closeLB() { lb.hidden = true; document.documentElement.style.overflow = ""; window.__lenis?.start(); destroyLBViewer(); lastFocus?.focus(); }
  function showLB(i) {
    cur = (i + list.length) % list.length; const t = list[cur];
    pics = [t.imagen, ...(t.imagenes || []).map(x => typeof x === "string" ? x : x.foto)].filter(Boolean);
    $("#lbCat").textContent = t.categoria || ""; $("#lbTitle").textContent = t.titulo; $("#lbDesc").textContent = t.descripcion || "";
    $("#lbCta").href = waLink(`Hola Huellitas 3D, vi el trabajo "${t.titulo}" en su web y quiero algo así.`);
    $("#lbViews").innerHTML = t.modelo3d ? `<button type="button" class="chip" aria-pressed="false" id="lbPhoto">Fotos</button><button type="button" class="chip" aria-pressed="false" id="lb3d">Ver en 3D</button>` : "";
    destroyLBViewer(); setPic(0);
  }
  function setPic(k) {
    pi = (k + pics.length) % pics.length; zoom = false; pan = { x: 0, y: 0 }; applyZoom();
    img.hidden = false; img.src = asset(pics[pi]); img.alt = `${list[cur].titulo}, foto ${pi + 1} de ${pics.length}`;
    $("#lbThumbs").innerHTML = pics.length > 1 ? pics.map((p, j) => `<button type="button" data-p="${j}" aria-label="Foto ${j + 1}" aria-current="${j === pi}"><img src="${esc(asset(p))}" alt=""></button>`).join("") : "";
    $("#lbPhoto")?.setAttribute("aria-pressed", "true"); $("#lb3d")?.setAttribute("aria-pressed", "false");
  }
  function applyZoom() { img.classList.toggle("z", zoom); img.style.transform = zoom ? `translate(${pan.x}px,${pan.y}px) scale(2.2)` : ""; }
  img.addEventListener("click", e => { if (moved) return; zoom = !zoom; if (zoom) { const r = img.getBoundingClientRect(); pan = { x: (r.left + r.width / 2 - e.clientX) * 1.2, y: (r.top + r.height / 2 - e.clientY) * 1.2 }; } else pan = { x: 0, y: 0 }; applyZoom(); });
  let drag = null, moved = false, swipeX = null;
  img.addEventListener("pointerdown", e => { moved = false; if (zoom) { drag = { x: e.clientX - pan.x, y: e.clientY - pan.y }; img.setPointerCapture(e.pointerId); } else swipeX = e.clientX; });
  img.addEventListener("pointermove", e => { if (drag) { pan = { x: e.clientX - drag.x, y: e.clientY - drag.y }; moved = true; img.style.transition = "none"; applyZoom(); } });
  img.addEventListener("pointerup", e => { if (drag) { drag = null; img.style.transition = ""; setTimeout(() => moved = false, 0); } else if (swipeX !== null) { const dx = e.clientX - swipeX; swipeX = null; if (Math.abs(dx) > 50) { moved = true; dx < 0 ? next() : prev(); setTimeout(() => moved = false, 0); } } });
  const next = () => pics.length > 1 && pi < pics.length - 1 ? setPic(pi + 1) : showLB(cur + 1);
  const prev = () => pics.length > 1 && pi > 0 ? setPic(pi - 1) : showLB(cur - 1);
  $("#lbNext").onclick = () => showLB(cur + 1); $("#lbPrev").onclick = () => showLB(cur - 1); $("#lbClose").onclick = closeLB;
  $("#lbThumbs").addEventListener("click", e => { const b = e.target.closest("[data-p]"); if (b) setPic(+b.dataset.p); });
  $("#lbViews").addEventListener("click", e => {
    if (e.target.id === "lbPhoto") { destroyLBViewer(); setPic(pi); }
    if (e.target.id === "lb3d") { e.target.setAttribute("aria-pressed", "true"); $("#lbPhoto").setAttribute("aria-pressed", "false"); img.hidden = true; lbViewer = createViewer($("#lbStage"), { stl: asset(list[cur].modelo3d), print: false, interactive: true }); }
  });
  function destroyLBViewer() { if (lbViewer) { lbViewer.destroy(); lbViewer = null; } img.hidden = false; }
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLB(); else if (e.key === "ArrowRight") next(); else if (e.key === "ArrowLeft") prev();
    else if (e.key === "Tab") { const f = $$("button,a", lb).filter(x => !x.hidden && x.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });

  /* ---------- Calculadora ---------- */
  const ch = $("#ch"), cm = $("#cm"), cr = $("#cr");
  function calc(from) {
    let h, m;
    if (from === "range") { const t = +cr.value; h = Math.floor(t / 60); m = t % 60; ch.value = h; cm.value = m; }
    else { h = Math.max(0, Math.min(200, parseInt(ch.value || "0", 10) || 0)); m = Math.max(0, Math.min(59, parseInt(cm.value || "0", 10) || 0)); cr.value = Math.min(2880, h * 60 + m); }
    const rate = Number(S.precio_hora || 1.25), hd = h + m / 60, p = Math.round(hd * rate * 100) / 100;
    $("#cdec").textContent = `${num2(hd)} h × ${money(rate)}`; $("#cout").textContent = money(p);
    $("#ccta").href = waLink(`Hola Huellitas 3D, quiero cotizar una impresión de unas ${h} h ${m} min (estimado ${money(p)}).`);
  }
  ch.addEventListener("input", () => calc()); cm.addEventListener("input", () => calc()); cr.addEventListener("input", () => calc("range"));
  $$("[data-step]").forEach(b => b.addEventListener("click", () => { const [k, d] = b.dataset.step.split(","); const el = k === "h" ? ch : cm; let v = (parseInt(el.value || "0", 10) || 0) + +d; if (k === "m") { if (v > 59) { v = 0; ch.value = +ch.value + 1; } if (v < 0) { v = 55; ch.value = Math.max(0, +ch.value - 1); } } el.value = Math.max(0, v); calc(); }));
  $$(".presets button").forEach(b => b.addEventListener("click", () => { cr.value = b.dataset.min; calc("range"); }));

  /* ---------- Proceso (pasos que cambian la imagen fijada) ---------- */
  const steps = $$(".process .step"), frames = $$(".process .frame");
  function setStep(i) { steps.forEach(s => s.classList.toggle("on", +s.dataset.i === i)); frames.forEach(f => f.classList.toggle("on", +f.dataset.i === i)); $("#procNum").textContent = `0${i + 1} / 0${steps.length}`; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) setStep(+en.target.dataset.i); }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(s => io.observe(s));


  /* ---------- Secuencias de fotogramas controladas por scroll ---------- */
  function seqPlayer(o) {
    const sec = $(o.section), cv = $(o.canvas), ctx = cv.getContext("2d"), imgs = new Array(o.count), pad = n => String(n).padStart(3, "0");
    let cur = -1, want = 0, ready = 0;
    const src = i => `${o.dir}/${pad(i + 1)}.webp`;
    const load = i => new Promise(res => { const im = new Image(); im.decoding = "async"; im.onload = () => { imgs[i] = im; ready++; res(); }; im.onerror = res; im.src = src(i); });
    function size() { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); cur = -1; draw(); }
    function nearest(i) { for (let k = 0; k < o.count; k++) { if (imgs[i - k]) return imgs[i - k]; if (imgs[i + k]) return imgs[i + k]; } return null; }
    function draw() {
      const i = Math.max(0, Math.min(o.count - 1, Math.round(want))); if (i === cur) return;
      const im = imgs[i] || nearest(i); if (!im) return; cur = imgs[i] ? i : -1;
      const cw = cv.width, ch = cv.height, mob = innerWidth <= 860;
      const f = mob ? o.mobile : o.desktop; let w, h, dx, dy;
      if (f.width) { // ancho fijo relativo a la pantalla (deja espacio para el texto)
        const sc = Math.min(f.width * cw / im.width, (f.maxH || 1) * ch / im.height); w = im.width * sc; h = im.height * sc; dx = f.x * cw; dy = (ch - h) / 2;
      } else {
        const sc = Math.max(cw / im.width, ch / im.height) * (f.zoom || 1); w = im.width * sc; h = im.height * sc;
        dx = f.anchor * cw - f.focus * w; dx = Math.min(0, Math.max(cw - w, dx));
        dy = (ch - h) / 2 + (f.dy || 0) * ch; dy = Math.min(0, Math.max(ch - h, dy));
      }
      ctx.clearRect(0, 0, cw, ch); ctx.drawImage(im, dx, dy, w, h);
    }
    function progress() { const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight; return Math.max(0, Math.min(1, -r.top / (span || 1))); }
    function update() { const p = progress(); want = p * (o.count - 1); draw(); o.onProgress?.(p); }
    // primero el fotograma 1 (archivo suelto), luego el paquete con todos
    async function loadPack() {
      try {
        const pack = await (await fetch(`${o.dir}.json`)).json();
        pack.frames.forEach((b64, i) => { const im = new Image(); im.onload = () => { imgs[i] = im; if (Math.abs(i - want) < 2) { cur = -1; draw(); } }; im.src = `data:${pack.type};base64,${b64}`; });
      } catch (e) { for (let i = 1; i < o.count; i++) load(i); }
    }
    load(0).then(() => { size(); update(); });
    const io2 = new IntersectionObserver(es => { if (es[0].isIntersecting) { io2.disconnect(); loadPack(); } }, { rootMargin: "100% 0px" }); io2.observe(sec);
    addEventListener("resize", size); addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    return { update };
  }

  /* ---------- Visor 3D (Three.js) ---------- */
  const THREE_URLS = ["https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js", "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js", "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/STLLoader.js"];
  let threeP = null;
  function loadThree() {
    if (threeP) return threeP;
    threeP = THREE_URLS.reduce((p, u) => p.then(() => new Promise((ok, ko) => { const s = document.createElement("script"); s.src = u; s.onload = ok; s.onerror = ko; document.head.appendChild(s); })), Promise.resolve());
    return threeP;
  }
  function pawGeometry(THREE) {
    const k = 1, sh = [];
    const toe = (x, y, r) => { const s = new THREE.Shape(); s.absarc((x - 32) * k, -(y - 36) * k, r * k, 0, Math.PI * 2, false); return s; };
    sh.push(toe(13, 25, 6.2), toe(24, 14, 6.6), toe(40, 14, 6.6), toe(51, 25, 6.2));
    const p = new THREE.Shape(); const P = (x, y) => [(x - 32) * k, -(y - 36) * k];
    p.moveTo(...P(32, 30)); p.bezierCurveTo(...P(23, 30), ...P(14, 39), ...P(14, 47)); p.bezierCurveTo(...P(14, 53), ...P(19, 56), ...P(24, 55));
    p.bezierCurveTo(...P(27, 54.4), ...P(29, 53), ...P(32, 53)); p.bezierCurveTo(...P(35, 53), ...P(37, 54.4), ...P(40, 55));
    p.bezierCurveTo(...P(45, 56), ...P(50, 53), ...P(50, 47)); p.bezierCurveTo(...P(50, 39), ...P(41, 30), ...P(32, 30));
    sh.push(p);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 7, bevelEnabled: true, bevelThickness: 1, bevelSize: .8, bevelSegments: 4, curveSegments: 48 });
    g.center(); return g;
  }
  function createViewer(host, opt) {
    let alive = true, raf = 0, renderer, ro, onVis;
    const api = { destroy() { alive = false; cancelAnimationFrame(raf); ro?.disconnect(); onVis?.disconnect(); renderer?.dispose(); renderer?.domElement.remove(); } };
    loadThree().then(() => {
      if (!alive) return;
      const THREE = window.THREE;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.localClippingEnabled = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      host.appendChild(renderer.domElement); host.querySelector(".fallback")?.remove();
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(34, 1, .1, 1000); cam.position.set(0, 20, 128);
      scene.add(new THREE.HemisphereLight(0xdfffe8, 0x0a120c, .5));
      const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(40, 60, 80); scene.add(key);
      const rim = new THREE.DirectionalLight(0x00fa4b, .9); rim.position.set(-60, 20, -60); scene.add(rim);
      const cut = { value: 999 };
      const mat = new THREE.MeshStandardMaterial({ color: 0x00d845, roughness: .42, metalness: .05, side: THREE.DoubleSide });
      const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 999); mat.clippingPlanes = [plane];
      mat.onBeforeCompile = sh => {
        sh.uniforms.uCut = cut;
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vW;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvW = (modelMatrix * vec4(transformed,1.0)).xyz;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vW;\nuniform float uCut;")
          .replace("#include <color_fragment>", "#include <color_fragment>\nfloat ln = fract(vW.y/0.55); diffuseColor.rgb *= mix(0.72,1.0,smoothstep(0.0,0.45,ln)); if(!gl_FrontFacing) diffuseColor.rgb*=0.35;")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\nfloat e = 1.0 - smoothstep(0.0, 1.6, uCut - vW.y); totalEmissiveRadiance += vec3(0.0,0.98,0.29) * e * 1.4;");
      };
      const group = new THREE.Group(); scene.add(group);
      // cama de impresión
      const bed = new THREE.Mesh(new THREE.BoxGeometry(96, 2, 64), new THREE.MeshBasicMaterial({ color: 0x080c09 }));
      const grid = new THREE.GridHelper(96, 24, 0x1f5a33, 0x15301d); grid.scale.z = 64 / 96;
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(2.4, 6, 24), new THREE.MeshStandardMaterial({ color: 0xc9cfc9, metalness: .7, roughness: .3 })); nozzle.rotation.x = Math.PI;
      const glow = new THREE.PointLight(0x00fa4b, 2, 40);
      let mesh, minY = 0, maxY = 1;
      function place(geo) {
        geo.computeBoundingBox(); const b = geo.boundingBox, size = new THREE.Vector3(); b.getSize(size);
        const s = 46 / Math.max(size.x, size.y, size.z); geo.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); geo.scale(s, s, s);
        mesh = new THREE.Mesh(geo, mat); mesh.position.y = -30; group.add(mesh);
        bed.position.y = -31; grid.position.y = -29.9; group.add(bed, grid);
        geo.computeBoundingBox(); minY = geo.boundingBox.min.y - 30; maxY = geo.boundingBox.max.y - 30;
      }
      if (opt.stl) {
        new THREE.STLLoader().load(opt.stl, g => { g.rotateX(-Math.PI / 2); g.computeVertexNormals(); place(g); start(); }, undefined, () => { place(pawGeometry(THREE)); start(); });
      } else { place(pawGeometry(THREE)); start(); }
      function start() {
        let controls = null;
        if (THREE.OrbitControls) {
          controls = new THREE.OrbitControls(cam, renderer.domElement);
          controls.enableZoom = !!opt.zoom; controls.enablePan = false; controls.enableDamping = true; controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.6;
          controls.minPolarAngle = .5; controls.maxPolarAngle = 1.75; controls.target.set(0, -8, 0);
          if (coarse && !opt.interactive) { controls.enabled = false; renderer.domElement.style.touchAction = "pan-y"; host.addEventListener("click", () => { controls.enabled = !controls.enabled; renderer.domElement.style.touchAction = controls.enabled ? "none" : "pan-y"; opt.onHint?.(controls.enabled ? "Girando · toca de nuevo para soltar" : "Toca para girarla"); }); opt.onHint?.("Toca para girarla"); }
        }
        const LAYERS = 120; let t0 = performance.now(), printing = !!opt.print && !reduce, visible = true;
        if (printing) { group.add(nozzle); scene.add(glow); }
        onVis = new IntersectionObserver(es => visible = es[0].isIntersecting); onVis.observe(host);
        const size = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
        ro = new ResizeObserver(size); ro.observe(host); size();
        const tick = now => {
          if (!alive) return; raf = requestAnimationFrame(tick); if (!visible) return;
          if (printing) {
            const p = Math.min(1, (now - t0) / 4200), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, y = minY + (maxY - minY + 1) * e;
            plane.constant = y; cut.value = y; nozzle.position.set(Math.sin(now / 90) * 22, y + 4.5, Math.cos(now / 130) * 3); glow.position.copy(nozzle.position);
            opt.onProgress?.(Math.round(e * LAYERS), LAYERS);
            if (p >= 1) { printing = false; plane.constant = 999; cut.value = 999; group.remove(nozzle); scene.remove(glow); opt.onDone?.(); }
          }
          controls?.update(); renderer.render(scene, cam);
        };
        raf = requestAnimationFrame(tick);
      }
    }).catch(() => { /* sin 3D: queda la huella SVG */ });
    return api;
  }

  /* ---------- Animación y scroll ---------- */
  function motion() {
    const nav = $("#nav"), bar = $("#progress");
    const onScroll = () => { nav.classList.toggle("solid", scrollY > 20); const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    // menú activo
    const links = $$("nav.links a"); const secs = links.map(a => $(a.getAttribute("href")));
    const navIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(s => s && navIO.observe(s));
    // luz que sigue al mouse en servicios
    $("#svc").addEventListener("pointermove", e => { const c = e.target.closest(".s"); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); });
    if (reduce || !window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) { try { const l = new Lenis({ lerp: .1 }); window.__lenis = l; l.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => { const el = $(a.getAttribute("href")); if (!el) return; e.preventDefault(); if (el.tagName === "DETAILS") el.open = true; l.scrollTo(el, { offset: -76 }); })); } catch (e) {} }
    gsap.fromTo("#eslogan .w", { yPercent: 40, opacity: .3 }, { yPercent: 0, opacity: 1, duration: .9, stagger: .08, ease: "power3.out" });
    // marquee que acelera con el scroll
    const track = $("#strip"); let x = 0, v = 1;
    gsap.ticker.add(() => { x -= v; const w = track.scrollWidth / 2; if (-x >= w) x += w; track.style.transform = `translateX(${x}px)`; v += (1 - v) * .05; });
    ScrollTrigger.create({ onUpdate: s => v = 1 + Math.min(8, Math.abs(s.getVelocity()) / 300) });
    gsap.utils.toArray(".reveal").forEach(el => gsap.fromTo(el, { y: 40, opacity: .25 }, { y: 0, opacity: 1, duration: .8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
    gsap.utils.toArray("section h2").forEach(el => gsap.fromTo(el, { y: 30, opacity: .35 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
    gsap.fromTo(".final .big", { scale: .92, opacity: .3 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: ".final", start: "top 85%", end: "top 30%", scrub: true } });
    gsap.to("#procBar", { width: "100%", ease: "none", scrollTrigger: { trigger: ".process .steps", start: "top 60%", end: "bottom 60%", scrub: true } });
    $$("video").forEach(vd => ScrollTrigger.create({ trigger: vd, onToggle: s => s.isActive ? vd.play().catch(() => {}) : vd.pause() }));
    // botones magnéticos
    if (!coarse) $$(".btn.primary").forEach(b => { b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .25, duration: .3 }); }); b.addEventListener("pointerleave", () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: "elastic.out(1,.4)" })); });
    // contador
    const st = $("#stWorks"); const to = +st.dataset.to || 0; const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", delay: .4, onUpdate: () => st.textContent = Math.round(o.v) });
  }

  /* ---------- Inicio ---------- */
  (async () => {
    [S, T, R] = await Promise.all([load("sitio"), load("trabajos").then(d => d.trabajos || []), load("resenas")]);
    renderSite(); renderReviews(); renderFilters(); renderGrid(); calc();
    motion();
    const stages = $$("#heroSeq .stage"), meterB = $("#meterBaily"), hintB = $("#hintBaily");
    seqPlayer({ section: "#heroSeq", canvas: "#cvBaily", dir: "seq/baily", count: 120,
      desktop: { width: .9, x: -.01, maxH: 1.05 }, mobile: { focus: .42, anchor: .5, zoom: 1.05 },
      onProgress: p => { const st = p < .3 ? 0 : p < .72 ? 1 : 2; stages.forEach(x => x.classList.toggle("on", +x.dataset.s === st)); meterB.style.width = (p * 100) + "%"; hintB.style.opacity = p > .04 ? 0 : 1; } });
    const parts = $$("#partsPlc li"), meterP = $("#meterPlc");
    seqPlayer({ section: "#electronica", canvas: "#cvPlc", dir: "seq/plc", count: 120,
      desktop: { width: .8, x: .27, maxH: 1.1 }, mobile: { focus: .5, anchor: .5, zoom: 1.15 },
      onProgress: p => { parts.forEach(li => li.classList.toggle("on", p >= +li.dataset.at)); meterP.style.width = (p * 100) + "%"; } });
    if (location.hostname.endsWith("claudeusercontent.com") || location.hostname.endsWith("claude.ai")) $("#adminLink")?.remove();
  })();
})();
