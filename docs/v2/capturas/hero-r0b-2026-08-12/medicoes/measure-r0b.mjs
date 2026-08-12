/**
 * R0-B — harness de medição da hero (deltas D-1, D-2, D-4).
 *
 * Uso: node measure-r0b.mjs <outDir> <baseUrl> [--shots] [--contrast]
 *
 * Deriva do harness de R0-A (`sistemas-globais-r0a-2026-08-12/medicoes/measure.mjs`):
 * mesma conexão CDP crua, mesmo `deviceScaleFactor: 1`, mesmo `--hide-scrollbars` e a
 * mesma metodologia de contraste (pior pixel real sob a caixa do texto, com **só** o
 * texto medido escondido). O que é novo aqui é a medição das portas: proporção, cor
 * composta da superfície por estado, cromaticidade (o teste de cáqui/oliva), luminância
 * em escala de cinza e ausência de bisel.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const wantShots = process.argv.includes('--shots')
const wantContrast = process.argv.includes('--contrast')
const endpoint = 'http://127.0.0.1:9222'

await mkdir(outDir, { recursive: true })

const VIEWPORTS = [
  { w: 320, h: 568 },
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1366, h: 768 },
  { w: 1440, h: 900 },
  { w: 1600, h: 900 },
  { w: 1920, h: 1080 },
]
const CONTRAST_VIEWPORTS = [1024, 1366, 1440, 1600, 1920]
const SURFACE_VIEWPORTS = [390, 768, 1024, 1366, 1440, 1920]

const list = await fetch(`${endpoint}/json/list`).then((r) => r.json())
let target = list.find((i) => i.type === 'page')
if (!target)
  target = await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' }).then((r) => r.json())

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => {
  socket.addEventListener('open', res, { once: true })
  socket.addEventListener('error', rej, { once: true })
})

let nextId = 0
const pending = new Map()
let consoleErrors = []
let httpFailures = []
const waiters = []

socket.addEventListener('message', (event) => {
  const m = JSON.parse(event.data)
  if (m.id) {
    const w = pending.get(m.id)
    if (!w) return
    pending.delete(m.id)
    if (m.error) w.reject(new Error(m.error.message))
    else w.resolve(m.result)
    return
  }
  for (let i = waiters.length - 1; i >= 0; i--) {
    if (waiters[i].method === m.method) {
      waiters[i].resolve(m.params)
      waiters.splice(i, 1)
    }
  }
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error')
    consoleErrors.push(m.params.entry.text)
  if (m.method === 'Runtime.exceptionThrown')
    consoleErrors.push(m.params.exceptionDetails.text ?? 'exception')
  if (m.method === 'Network.responseReceived' && m.params.response.status >= 400)
    httpFailures.push(`${m.params.response.status} ${m.params.response.url}`)
})

function cmd(method, params = {}, ms = 60000) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return Promise.race([
    new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
    new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout CDP ${method}`)), ms)),
  ])
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
function waitFor(method, timeout = 15000) {
  return new Promise((resolve) => {
    const w = { method, resolve }
    waiters.push(w)
    setTimeout(() => {
      const i = waiters.indexOf(w)
      if (i >= 0) {
        waiters.splice(i, 1)
        resolve(null)
      }
    }, timeout)
  })
}
async function evaluate(expression, ms = 30000) {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, ms)
  if (r.exceptionDetails)
    throw new Error(
      (r.exceptionDetails.text ?? '') + ' :: ' + (r.exceptionDetails.exception?.description ?? ''),
    )
  return r.result.value
}

await cmd('Log.enable')
await cmd('Runtime.enable')
await cmd('Network.enable')
await cmd('Page.enable')

async function setViewport(w, h) {
  await cmd('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: false,
  })
}

async function goto(url) {
  consoleErrors = []
  httpFailures = []
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';return 1})()`)
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(900)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(700)
  const y = await evaluate(`window.scrollY`)
  if (y !== 0) throw new Error(`scroll não voltou ao topo: ${y}`)
}

const PORTAS = `[aria-label="Frentes da Bianchini"] [role="tab"]`

/* ================= layout + portas ================= */
const MEASURE = `(() => {
  const px = (v) => (v ? parseFloat(v) : null);
  const de = document.documentElement;
  const round = (n) => (n == null ? null : +n.toFixed(1));

  const portas = [...document.querySelectorAll('${PORTAS}')];
  const fila = portas[0] ? portas[0].parentElement : null;
  const filaCs = fila ? getComputedStyle(fila) : null;

  const dados = portas.map((b) => {
    const r = b.getBoundingClientRect();
    const antes = getComputedStyle(b, '::before');
    const inner = b.querySelector('span');
    const nome = inner ? inner.querySelector('span span') : null;
    const linhas = [...b.querySelectorAll('span')].filter(
      (s) => [...s.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    );
    const nomeEl = linhas[0] ?? null;
    const cueEl = linhas[1] ?? null;
    const alturaLinha = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight);
      const h = el.getBoundingClientRect().height;
      return { h: round(h), lineHeight: round(lh), linhas: lh ? Math.round(h / lh) : null,
               fontSize: round(parseFloat(cs.fontSize)), fontWeight: cs.fontWeight, color: cs.color,
               scrollW: round(el.scrollWidth), clientW: round(el.clientWidth) };
    };
    const cs = getComputedStyle(b);
    return {
      id: b.id,
      selected: b.getAttribute('aria-selected') === 'true',
      x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height),
      padL: px(cs.paddingLeft), padT: px(cs.paddingTop), padB: px(cs.paddingBottom),
      util: round(r.width - px(cs.paddingLeft) - px(cs.paddingRight)),
      transform: cs.transform,
      /* D-4: bisel. Tem de ser 'none' nos dois estados. */
      beforeBoxShadow: antes.boxShadow,
      beforeBorderTop: antes.borderTopWidth + ' ' + antes.borderTopStyle + ' ' + antes.borderTopColor,
      beforeBorderRest: [antes.borderRightWidth, antes.borderBottomWidth, antes.borderLeftWidth].join('/'),
      beforeBg: antes.backgroundImage.slice(0, 240),
      borderRadius: cs.borderRadius,
      nome: alturaLinha(nomeEl),
      cue: alturaLinha(cueEl),
      nomeTexto: nomeEl ? nomeEl.textContent.trim() : null,
      seta: (() => { const s = b.querySelector('svg'); if (!s) return null;
        const sr = s.getBoundingClientRect();
        return sr.width ? { w: round(sr.width), color: getComputedStyle(s).color } : 'oculta'; })(),
    };
  });

  const larguras = dados.map((d) => d.w);
  const razao = larguras[1] ? +(larguras[0] / larguras[1]).toFixed(3) : null;
  const gap = filaCs ? px(filaCs.columnGap) : null;

  /* overflow horizontal real */
  const overflowDoc = Math.max(0, de.scrollWidth - de.clientWidth);
  const overflowBody = Math.max(0, document.body.scrollWidth - de.clientWidth);
  let worst = null;
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.right > de.clientWidth + 1) {
      if (!worst || r.right > worst.right) {
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString();
        worst = { right: round(r.right), tag: el.tagName, cls: cls.slice(0, 90) };
      }
    }
  }

  const ctaY = document.querySelector('[data-hero-cta]');
  const ctaW = document.querySelector('[data-hero-cta-wa]');
  const rY = ctaY ? ctaY.getBoundingClientRect() : null;
  const rW = ctaW ? ctaW.getBoundingClientRect() : null;
  const ctaPair = rY && rW ? {
    primary: round(rY.width), whatsapp: round(rW.width),
    razao: +(rY.width / rW.width).toFixed(3),
    primaryH: round(rY.height), whatsappH: round(rW.height),
    empilhados: Math.abs(rY.y - rW.y) > 4,
    primaryBg: getComputedStyle(ctaY).backgroundColor,
    whatsappBg: getComputedStyle(ctaW).backgroundColor,
    whatsappBorder: getComputedStyle(ctaW).borderTopColor,
  } : null;

  const h1 = document.querySelector('main h1');
  const deck = document.querySelector('[class*="deck"]');
  const dr = deck ? deck.getBoundingClientRect() : null;

  const brokenImgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).length;
  const emptyHref = [...document.querySelectorAll('a')].filter(a => {
    const h = a.getAttribute('href'); return !h || h === '#' || h.trim() === '';
  }).length;
  const brokenAnchors = [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')]
    .map(a => a.getAttribute('href').replace(/^\\//, ''))
    .filter(h => h.length > 1)
    .filter(h => !document.querySelector('[id="' + CSS.escape(h.slice(1)) + '"]'));

  return {
    rootW: de.clientWidth, scrollbar: window.innerWidth - de.clientWidth,
    guia: getComputedStyle(document.querySelector('main').firstElementChild).getPropertyValue('--guia').trim(),
    h1x: h1 ? round(h1.getBoundingClientRect().left) : null,
    porta0x: dados[0] ? round(dados[0].x + dados[0].padL) : null,
    portas: dados, larguras: larguras.map(round), razao, gap,
    filaBottom: dr ? round(dr.bottom) : null,
    heroBottom: (() => { const s = document.querySelector('section[aria-labelledby="hero-titulo"]');
      return s ? round(s.getBoundingClientRect().bottom) : null; })(),
    overflowDoc, overflowBody, worst, ctaPair,
    brokenImgs, emptyHref, brokenAnchors: [...new Set(brokenAnchors)],
    aria: (() => {
      const tl = document.querySelector('[aria-label="Frentes da Bianchini"]');
      const painel = document.querySelector('#hero-painel');
      return {
        tablistRole: tl ? tl.getAttribute('role') : null,
        describedby: tl ? tl.getAttribute('aria-describedby') : null,
        orientation: tl ? tl.getAttribute('aria-orientation') : null,
        instrucaoExiste: !!document.querySelector('#hero-seletor-instrucao'),
        painelRole: painel ? painel.getAttribute('role') : null,
        painelLabelledby: painel ? painel.getAttribute('aria-labelledby') : null,
        tabs: portas.map(b => ({ role: b.getAttribute('role'), sel: b.getAttribute('aria-selected'),
          controls: b.getAttribute('aria-controls'), tabindex: b.getAttribute('tabindex') })),
      };
    })(),
  };
})()`

/* ================= superfície das portas (D-1, D-4, grayscale) ================= */
/**
 * Amostra a **cor composta** da superfície de cada porta na captura — não a cor
 * declarada do gradiente. A superfície é translúcida sobre fotografia, então só o
 * pixel rasterizado responde pela pergunta "isto lê como cáqui?".
 *
 * Duas faixas por porta, ambas em região sem texto: logo abaixo da régua (recuo
 * superior) e logo acima da aresta inferior (recuo inferior). Mediana por canal, para
 * que um pico especular da cena atrás não desloque a leitura.
 */
const AMOSTRA_SUPERFICIE = `
window.__superficie = (dataUrl, caixas) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const mediana = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
    const faixa = (x0, x1, y) => {
      const d = ctx.getImageData(Math.max(0,Math.floor(x0)), Math.max(0,Math.floor(y)),
                                 Math.max(1,Math.floor(x1 - x0)), 1).data;
      const R = [], G = [], B = [];
      for (let p = 0; p < d.length; p += 4) { R.push(d[p]); G.push(d[p+1]); B.push(d[p+2]); }
      const r = mediana(R), g = mediana(G), b = mediana(B);
      return { rgb: [r, g, b],
               /* cinza perceptual, o mesmo do teste de escala de cinza */
               cinza: +(255 * Math.pow(lum(r, g, b), 1/2.2)).toFixed(1),
               /* cromaticidade: 0 = neutro puro. É o teste de cáqui/oliva. */
               croma: Math.max(r,g,b) - Math.min(r,g,b),
               /* deslocamento quente: >0 significa vermelho acima do azul */
               quente: r - b };
    };
    resolve(caixas.map((c) => ({
      id: c.id, selected: c.selected,
      topo: faixa(c.x + 4, c.x + c.w - 4, c.y + 9),
      base: faixa(c.x + 4, c.x + c.w - 4, c.y + c.h - 7),
      /* a régua: 1px logo abaixo da aresta superior */
      regua: faixa(c.x + 4, c.x + c.w - 4, c.y + 1),
    })));
  };
  img.onerror = () => resolve([]);
  img.src = dataUrl;
});
1`

async function medirSuperficie(vw, cinza = false) {
  const out = []
  const n = await evaluate(`document.querySelectorAll('${PORTAS}').length`)
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      await evaluate(`(()=>{[...document.querySelectorAll('${PORTAS}')][${i}].click();return 1})()`)
      await pause(1200)
    }
    if (cinza)
      await evaluate(`(()=>{document.documentElement.style.filter='grayscale(1)';return 1})()`)
    await evaluate(AMOSTRA_SUPERFICIE)
    const caixas = await evaluate(
      `JSON.stringify([...document.querySelectorAll('${PORTAS}')].map(b=>{const r=b.getBoundingClientRect();
        return {id:b.id,selected:b.getAttribute('aria-selected')==='true',
                x:r.x,y:r.y,w:r.width,h:r.height};}))`,
    )
    const shot = await cmd('Page.captureScreenshot', { format: 'png' })
    const amostras = await evaluate(
      `window.__superficie('data:image/png;base64,${shot.data}', ${caixas}).then(r=>JSON.stringify(r))`,
    )
    if (cinza)
      await evaluate(`(()=>{document.documentElement.style.filter='';return 1})()`)
    out.push({ viewport: vw, escolhido: i, cinza, portas: JSON.parse(amostras) })
  }
  return out
}

/* ================= contraste (metodologia de R0-A) ================= */
const CONTRAST_SETUP = `
window.__caixas = () => {
  const h1 = document.querySelector('h1#hero-titulo');
  if (!h1) return null;
  const alvos = [];
  const push = (el, nome) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width < 2 || r.height < 2) return;
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return;
    alvos.push({ el, nome, r, cs });
  };
  push(h1.previousElementSibling, 'etiqueta');
  push(h1, 'h1');
  let p = h1.nextElementSibling;
  while (p && !(p.tagName === 'P' || p.querySelector('p'))) p = p.nextElementSibling;
  if (p) push(p.tagName === 'P' ? p : p.querySelector('p'), 'intencao');
  const cabeca = [...document.querySelectorAll('[class*="decisionHead"]')][0];
  if (cabeca) {
    const pinta = [cabeca, ...cabeca.querySelectorAll('*')].filter((el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3),
    );
    push(pinta[pinta.length - 1] ?? cabeca, 'instrucao');
  }
  /*
    Novo em R0-B: os **nomes das portas**. Eles não dependem do scrim (a porta tem
    superfície própria), mas D-1 muda essa superfície nos dois estados — então o par
    nome × superfície precisa ser remedido, e é o pior caso que interessa.
  */
  [...document.querySelectorAll('${PORTAS}')].forEach((b, i) => {
    const linhas = [...b.querySelectorAll('span')].filter(
      (s) => [...s.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    );
    const ativo = b.getAttribute('aria-selected') === 'true' ? 'ativa' : 'inativa';
    if (linhas[0]) push(linhas[0], 'porta' + i + '-nome-' + ativo);
    if (linhas[1]) push(linhas[1], 'porta' + i + '-cue-' + ativo);
  });

  window.__alvos = alvos;
  return alvos.map((a, i) => ({
    i, nome: a.nome, tag: a.el.tagName,
    texto: a.el.textContent.trim().slice(0, 44),
    x: +a.r.x.toFixed(1), y: +a.r.y.toFixed(1),
    w: +a.r.width.toFixed(1), h: +a.r.height.toFixed(1),
    color: a.cs.color,
    fontSize: parseFloat(a.cs.fontSize),
    fontWeight: a.cs.fontWeight,
  }));
};
window.__esconder = () => { window.__alvos.forEach(a => a.el.style.visibility = 'hidden'); return 1; };
window.__mostrar = () => { window.__alvos.forEach(a => a.el.style.visibility = ''); return 1; };
window.__amostrar = (dataUrl, caixas) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const out = [];
    for (const cx of caixas) {
      const x0 = Math.max(0, Math.floor(cx.x)), y0 = Math.max(0, Math.floor(cx.y));
      const x1 = Math.min(cv.width, Math.ceil(cx.x + cx.w)), y1 = Math.min(cv.height, Math.ceil(cx.y + cx.h));
      if (x1 <= x0 || y1 <= y0) { out.push({ ...cx, pior: null }); continue; }
      const d = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
      const m = cx.color.match(/[\\d.]+/g).map(Number);
      const alpha = m.length > 3 ? m[3] : 1;
      let lt = lum(m[0], m[1], m[2]);
      let pior = Infinity, piorPx = null;
      for (let p = 0; p < d.length; p += 4) {
        const bg = [d[p], d[p + 1], d[p + 2]];
        /* texto com alpha compõe sobre o próprio fundo — é a cor que o olho vê */
        const fg = alpha < 1
          ? [alpha*m[0]+(1-alpha)*bg[0], alpha*m[1]+(1-alpha)*bg[1], alpha*m[2]+(1-alpha)*bg[2]]
          : [m[0], m[1], m[2]];
        const r = ratio(lum(fg[0],fg[1],fg[2]), lum(bg[0], bg[1], bg[2]));
        if (r < pior) { pior = r; piorPx = bg; }
      }
      out.push({ ...cx, pior: +pior.toFixed(2), piorPx });
    }
    resolve(out);
  };
  img.onerror = () => resolve([]);
  img.src = dataUrl;
});
1`

async function medirContraste(vw) {
  const estados = await evaluate(
    `[...document.querySelectorAll('${PORTAS}')].map(b => b.id.replace('hero-aba-',''))`,
  )
  const resultado = []
  for (let i = 0; i < estados.length; i++) {
    if (i > 0) {
      await evaluate(`(()=>{[...document.querySelectorAll('${PORTAS}')][${i}].click();return 1})()`)
      await pause(1200)
    }
    await evaluate(CONTRAST_SETUP)
    const caixas = await evaluate(`JSON.stringify(window.__caixas())`)
    if (!caixas) continue
    const boxes = JSON.parse(caixas)
    await evaluate(`window.__esconder()`)
    await pause(250)
    const shot = await cmd('Page.captureScreenshot', { format: 'png' })
    await evaluate(`window.__mostrar()`)
    const amostras = await evaluate(
      `window.__amostrar('data:image/png;base64,${shot.data}', ${JSON.stringify(boxes)}).then(r=>JSON.stringify(r))`,
    )
    resultado.push({ viewport: vw, estado: estados[i], textos: JSON.parse(amostras) })
  }
  return resultado
}

/* ================= teclado ================= */
async function tecla(key, code, vk) {
  for (const type of ['rawKeyDown', 'keyUp'])
    await cmd('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk })
  await pause(320)
}
const estadoTeclado = () =>
  evaluate(`(()=>{const p=[...document.querySelectorAll('${PORTAS}')];
    return {sel:p.findIndex(b=>b.getAttribute('aria-selected')==='true'),
            foco:p.findIndex(b=>b===document.activeElement),
            tabindex:p.map(b=>b.getAttribute('tabindex')).join(','),
            anel:getComputedStyle(p.find(b=>b===document.activeElement)||p[0],'::after').boxShadow};})()`)

async function medirTeclado() {
  await evaluate(`(()=>{[...document.querySelectorAll('${PORTAS}')][0].focus();return 1})()`)
  await pause(200)
  const passos = [{ nome: 'foco inicial', estado: await estadoTeclado() }]
  await tecla('ArrowRight', 'ArrowRight', 39)
  passos.push({ nome: 'ArrowRight', estado: await estadoTeclado() })
  await tecla('ArrowRight', 'ArrowRight', 39)
  passos.push({ nome: 'ArrowRight', estado: await estadoTeclado() })
  await tecla('ArrowRight', 'ArrowRight', 39)
  passos.push({ nome: 'ArrowRight (volta ao início)', estado: await estadoTeclado() })
  await tecla('End', 'End', 35)
  passos.push({ nome: 'End', estado: await estadoTeclado() })
  await tecla('ArrowLeft', 'ArrowLeft', 37)
  passos.push({ nome: 'ArrowLeft', estado: await estadoTeclado() })
  await tecla('Home', 'Home', 36)
  passos.push({ nome: 'Home', estado: await estadoTeclado() })
  return passos
}

/* ================= hover ================= */
async function medirHover() {
  const antes = await evaluate(
    `(()=>{const p=[...document.querySelectorAll('${PORTAS}')];
      return {sel:p.findIndex(b=>b.getAttribute('aria-selected')==='true'),
              cena:[...document.querySelectorAll('[class*="frame"]')].findIndex(f=>f.getAttribute('aria-hidden')!=='true')};})()`,
  )
  const box = await evaluate(
    `(()=>{const b=[...document.querySelectorAll('${PORTAS}')][1];const r=b.getBoundingClientRect();
      return JSON.stringify({x:r.x+r.width/2,y:r.y+r.height/2});})()`,
  )
  const { x, y } = JSON.parse(box)
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await pause(600)
  const durante = await evaluate(
    `(()=>{const p=[...document.querySelectorAll('${PORTAS}')];
      const ativo=p.find(b=>b.getAttribute('aria-selected')==='true');
      return {sel:p.findIndex(b=>b.getAttribute('aria-selected')==='true'),
              hoverTransform:getComputedStyle(p[1]).transform,
              hoverSurface:getComputedStyle(p[1],'::before').backgroundImage.slice(0,120),
              hoverShadow:getComputedStyle(p[1],'::before').boxShadow,
              ativoTransform:getComputedStyle(ativo).transform,
              alturaFila:p.map(b=>+b.getBoundingClientRect().height.toFixed(1)).join(','),
              yFila:p.map(b=>+b.getBoundingClientRect().y.toFixed(1)).join(',')};})()`,
  )
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5, buttons: 0 })
  await pause(400)
  return { antes, durante }
}

/* ================= execução ================= */
const rows = []
const notes = { console: [], http: [] }

for (const vp of VIEWPORTS) {
  await setViewport(vp.w, vp.h)
  await goto(baseUrl + '/')
  const m = await evaluate(MEASURE)
  rows.push({ viewport: vp.w, altura: vp.h, ...m })
  for (const e of consoleErrors) notes.console.push(`${vp.w}: ${e}`)
  for (const e of httpFailures) notes.http.push(`${vp.w}: ${e}`)
  console.log(
    `${String(vp.w).padStart(4)} | portas ${m.larguras.join(' / ')} | razão ${m.razao} | gap ${m.gap} | ` +
      `util ${m.portas.map((p) => p.util).join('/')} | ovf ${m.overflowDoc}/${m.overflowBody} | ` +
      `cta ${m.ctaPair?.razao} | shadow ${m.portas[0].beforeBoxShadow}`,
  )
}
await writeFile(path.join(outDir, 'layout.json'), JSON.stringify({ rows, notes }, null, 2))

/* superfícies em cor e em cinza */
const superficies = []
for (const vw of SURFACE_VIEWPORTS) {
  const vp = VIEWPORTS.find((v) => v.w === vw)
  await setViewport(vp.w, vp.h)
  await goto(baseUrl + '/')
  superficies.push(...(await medirSuperficie(vw, false)))
  await goto(baseUrl + '/')
  superficies.push(...(await medirSuperficie(vw, true)))
  const cor = superficies.filter((s) => s.viewport === vw && !s.cinza && s.escolhido === 0)[0]
  const cin = superficies.filter((s) => s.viewport === vw && s.cinza && s.escolhido === 0)[0]
  const at = cor.portas.find((p) => p.selected), ina = cor.portas.find((p) => !p.selected)
  const atC = cin.portas.find((p) => p.selected), inaC = cin.portas.find((p) => !p.selected)
  console.log(
    `${String(vw).padStart(4)} COR   ativo ${at.topo.rgb} croma ${at.topo.croma} quente ${at.topo.quente} | ` +
      `inativo ${ina.topo.rgb} croma ${ina.topo.croma} | Δcinza ${(at.topo.cinza - ina.topo.cinza).toFixed(1)}`,
  )
  console.log(
    `${String(vw).padStart(4)} CINZA ativo ${atC.topo.cinza} | inativo ${inaC.topo.cinza} | ` +
      `Δ ${(atC.topo.cinza - inaC.topo.cinza).toFixed(1)}`,
  )
}
await writeFile(path.join(outDir, 'superficies.json'), JSON.stringify(superficies, null, 2))

/* teclado, hover e reduced-motion em 1440 */
await setViewport(1440, 900)
await goto(baseUrl + '/')
const teclado = await medirTeclado()
await goto(baseUrl + '/')
const hover = await medirHover()
await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await goto(baseUrl + '/')
const reduzido = await evaluate(
  `(()=>{const p=[...document.querySelectorAll('${PORTAS}')];
    const ativo=p.find(b=>b.getAttribute('aria-selected')==='true');
    const cenas=[...document.querySelectorAll('[class*="frame"]')].map(f=>{const cs=getComputedStyle(f);
      return {opacity:cs.opacity,mask:cs.maskPosition||cs.webkitMaskPosition,transform:cs.transform,anim:cs.animationName};});
    const invisiveis=[...document.querySelectorAll('section[aria-labelledby="hero-titulo"] *')]
      .filter(el=>{const cs=getComputedStyle(el);const r=el.getBoundingClientRect();
        return r.width>4&&r.height>4&&parseFloat(cs.opacity)<0.05&&cs.visibility!=='hidden';}).length;
    return {ativoTransform:getComputedStyle(ativo).transform,
            ativoSuperficie:getComputedStyle(ativo,'::before').backgroundImage.slice(0,120),
            ativoRegua:getComputedStyle(ativo,'::before').borderTopColor+' '+getComputedStyle(ativo,'::before').borderTopWidth,
            ativoShadow:getComputedStyle(ativo,'::before').boxShadow,
            cenas, invisiveis};})()`,
)
await cmd('Emulation.setEmulatedMedia', { features: [] })
await writeFile(
  path.join(outDir, 'interacao.json'),
  JSON.stringify({ teclado, hover, reduzido }, null, 2),
)
console.log('teclado:', teclado.map((p) => `${p.nome}→sel${p.estado.sel}/foco${p.estado.foco}`).join(' | '))
console.log('hover: sel antes', hover.antes.sel, '→ durante', hover.durante.sel, '| y da fila', hover.durante.yFila)
console.log('reduced-motion: invisíveis', reduzido.invisiveis, '| transform ativo', reduzido.ativoTransform)

if (wantContrast) {
  const todos = []
  for (const vw of CONTRAST_VIEWPORTS) {
    const vp = VIEWPORTS.find((v) => v.w === vw)
    await setViewport(vp.w, vp.h)
    await goto(baseUrl + '/')
    const r = await medirContraste(vw)
    todos.push(...r)
    for (const est of r) {
      const pior = est.textos.filter((t) => t.pior != null).sort((a, b) => a.pior - b.pior)[0]
      const dobra = est.textos.filter((t) => t.pior != null && !t.nome.startsWith('porta'))
        .map((t) => `${t.nome} ${t.pior}`).join(' · ')
      const portas = est.textos.filter((t) => t.pior != null && t.nome.startsWith('porta'))
        .map((t) => `${t.nome} ${t.pior}`).join(' · ')
      console.log(`${vw} ${est.estado.padEnd(12)} | ${dobra}`)
      console.log(`${' '.repeat(4)} ${' '.repeat(12)} | ${portas} | PIOR ${pior?.pior} ${pior?.pior >= 4.5 ? 'PASSA' : 'REPROVA'}`)
    }
  }
  await writeFile(path.join(outDir, 'contraste.json'), JSON.stringify(todos, null, 2))
}

if (wantShots) {
  const plano = [
    { w: 1440, h: 900, estados: [0, 1, 2], close: true },
    { w: 1024, h: 768, estados: [0], close: true },
    { w: 390, h: 844, estados: [0, 1, 2], close: true },
    { w: 320, h: 568, estados: [0], close: false },
  ]
  const nomes = ['equipamentos', 'projetos', 'consultoria']
  for (const p of plano) {
    await setViewport(p.w, p.h)
    await goto(baseUrl + '/')
    for (const i of p.estados) {
      if (i > 0) {
        await evaluate(`(()=>{[...document.querySelectorAll('${PORTAS}')][${i}].click();return 1})()`)
        await pause(1400)
      }
      const shot = await cmd('Page.captureScreenshot', { format: 'png' })
      await writeFile(
        path.join(outDir, '..', `${p.w}-hero-${nomes[i]}.png`),
        Buffer.from(shot.data, 'base64'),
      )
    }
    if (p.close) {
      const clip = await evaluate(
        `(()=>{const p=[...document.querySelectorAll('${PORTAS}')];
          const a=p[0].getBoundingClientRect(), c=p[2].getBoundingClientRect();
          const head=document.querySelector('[class*="decisionHead"]').getBoundingClientRect();
          return JSON.stringify({x:Math.max(0,a.x-14),y:Math.max(0,head.y-16),
            width:Math.min(${p.w},c.right-a.x+28),height:(a.bottom-head.y)+34});})()`,
      )
      const c = JSON.parse(clip)
      const close = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 2 } })
      await writeFile(path.join(outDir, '..', `${p.w}-portas-close.png`), Buffer.from(close.data, 'base64'))
      await evaluate(`(()=>{document.documentElement.style.filter='grayscale(1)';return 1})()`)
      await pause(220)
      const cinza = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 2 } })
      await writeFile(path.join(outDir, '..', `${p.w}-portas-close-cinza.png`), Buffer.from(cinza.data, 'base64'))
      await evaluate(`(()=>{document.documentElement.style.filter='';return 1})()`)
    }
    console.log('capturas', p.w)
  }
}

console.log('console errors:', notes.console.length)
console.log('http >=400:', [...new Set(notes.http)].length)
if (notes.console.length) console.log(notes.console.slice(0, 6))
if (notes.http.length) console.log([...new Set(notes.http)].slice(0, 6))
socket.close()
