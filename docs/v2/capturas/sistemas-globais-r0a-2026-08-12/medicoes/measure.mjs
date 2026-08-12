/**
 * R0-A — harness de medição.
 *
 * Uso: node measure.mjs <outDir> <baseUrl> [--shots] [--contrast]
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
const SHOT_VIEWPORTS = [1920, 1440, 1024, 390]
const CONTRAST_VIEWPORTS = [1024, 1366, 1440, 1600, 1920]

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

/*
  Todo comando CDP tem prazo. Sem isto, uma chamada que nunca responde (o
  `document.fonts.ready` e o `captureScreenshot` já fizeram isso aqui) trava a
  execução inteira sem erro e sem saída — foi o que consumiu duas rodadas de
  captura antes de o prazo entrar.
*/
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
  /*
    `html` tem `scroll-smooth`: sem desligar, `scrollTo` anima e a captura sai
    no meio do percurso — foi assim que a primeira leva de capturas saiu na
    seção de Projetos em vez da dobra.
  */
  await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';return 1})()`)
  // dispara os IntersectionObserver de revelação
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(900)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(700)
  const y = await evaluate(`window.scrollY`)
  if (y !== 0) throw new Error(`scroll não voltou ao topo: ${y}`)
}

/* ================= layout ================= */
const MEASURE = `(() => {
  const px = (v) => (v ? parseFloat(v) : null);
  const de = document.documentElement;
  const main = document.querySelector('main');

  const readVar = (el, name) => {
    const v = getComputedStyle(el).getPropertyValue(name).trim();
    return v || null;
  };

  const firstChild = main.firstElementChild;
  const gutter = readVar(de, '--gutter');
  const guia = firstChild ? readVar(firstChild, '--guia') : null;

  // a casca de conteúdo: primeiro elemento com a casca padrão dentro de main
  let cont = null;
  for (const c of main.querySelectorAll('.container-shell, [class*="max-w-container"]')) {
    const r = c.getBoundingClientRect();
    if (r.width > 0) { cont = c; break; }
  }
  const cr = cont ? cont.getBoundingClientRect() : null;
  const ccs = cont ? getComputedStyle(cont) : null;

  const h1 = document.querySelector('main h1');
  const h1r = h1 ? h1.getBoundingClientRect() : null;

  const brand = document.querySelector('header a img, header img, header svg');
  const br = brand ? brand.getBoundingClientRect() : null;
  const hInner = document.querySelector('header > div');
  const hr = hInner ? hInner.getBoundingClientRect() : null;
  const hcs = hInner ? getComputedStyle(hInner) : null;

  // overflow horizontal real (body tem overflow-x hidden; medimos os dois)
  const overflowDoc = Math.max(0, de.scrollWidth - de.clientWidth);
  const overflowBody = Math.max(0, document.body.scrollWidth - de.clientWidth);
  let worst = null;
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.right > de.clientWidth + 1) {
      if (!worst || r.right > worst.right) {
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString();
        worst = { right: +r.right.toFixed(1), tag: el.tagName, cls: cls.slice(0, 100) };
      }
    }
  }

  // par de CTAs da dobra: razão de largura
  const ctaY = document.querySelector('[data-hero-cta]');
  const ctaW = document.querySelector('[data-hero-cta-wa]');
  const ctaPair = ctaY && ctaW ? {
    primary: +ctaY.getBoundingClientRect().width.toFixed(1),
    whatsapp: +ctaW.getBoundingClientRect().width.toFixed(1),
    ratio: +(ctaY.getBoundingClientRect().width / ctaW.getBoundingClientRect().width).toFixed(3),
    primaryH: +ctaY.getBoundingClientRect().height.toFixed(1),
    whatsappH: +ctaW.getBoundingClientRect().height.toFixed(1),
    whatsappBg: getComputedStyle(ctaW).backgroundColor,
    whatsappBorder: getComputedStyle(ctaW).borderTopColor,
  } : null;

  // âncoras e hrefs vazios
  const emptyHref = [...document.querySelectorAll('a')].filter(a => {
    const h = a.getAttribute('href');
    return !h || h === '#' || h.trim() === '';
  }).length;
  const brokenAnchors = [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')]
    .map(a => a.getAttribute('href').replace(/^\\//, ''))
    .filter(h => h.length > 1)
    .filter(h => !document.querySelector('[id="' + CSS.escape(h.slice(1)) + '"]'));

  const brokenImgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).length;

  return {
    rootW: de.clientWidth,
    innerW: window.innerWidth,
    scrollbar: window.innerWidth - de.clientWidth,
    gutter, guia,
    containerW: cr ? +cr.width.toFixed(1) : null,
    containerX: cr ? +cr.left.toFixed(1) : null,
    padL: ccs ? px(ccs.paddingLeft) : null,
    padR: ccs ? px(ccs.paddingRight) : null,
    contentGuide: cr && ccs ? +(cr.left + px(ccs.paddingLeft)).toFixed(1) : null,
    heroGuide: h1r ? +h1r.left.toFixed(1) : null,
    headerShellX: hr && hcs ? +(hr.left + px(hcs.paddingLeft)).toFixed(1) : null,
    headerBrandX: br ? +br.left.toFixed(1) : null,
    overflowDoc, overflowBody, worst,
    ctaPair, emptyHref, brokenAnchors: [...new Set(brokenAnchors)], brokenImgs,
  };
})()`

/* ================= contraste ================= */
/**
 * Rasteriza a cena com a coluna de conteúdo escondida, e amostra o pior pixel
 * real sob cada caixa de texto. Metodologia da documentação: fundo composto
 * (fotografia + scrim), não a cor declarada do gradiente.
 */
const CONTRAST_SETUP = `
/*
  Alvos: só **texto sobre fotografia** (plano 3 sobre plano 1). Ficam de fora,
  de propósito, os rótulos dos dois CTAs — botão é massa opaca com superfície
  própria e não depende do scrim (doc 01 §15.3) — e os nomes das portas, que
  têm superfície translúcida própria. Entram etiqueta, h1, intenção e a
  instrução acima das portas.
*/
window.__caixas = () => {
  const h1 = document.querySelector('h1#hero-titulo');
  if (!h1) return null;
  const shell = h1.closest('.container-shell') || h1.parentElement;
  const alvos = [];
  const push = (el, nome) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width < 2 || r.height < 2) return;
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return;
    alvos.push({ el, nome, r, cs });
  };
  // etiqueta: o <p> imediatamente antes do h1
  push(h1.previousElementSibling, 'etiqueta');
  push(h1, 'h1');
  // intenção: o primeiro <p> depois do h1 que não esteja dentro de um CTA
  let p = h1.nextElementSibling;
  while (p && !(p.tagName === 'P' || p.querySelector('p'))) p = p.nextElementSibling;
  if (p) push(p.tagName === 'P' ? p : p.querySelector('p'), 'intencao');
  /*
    A instrucao: descer ate o no que pinta o texto. O wrapper herdava
    color rgb(16,16,16) (o ink padrao da pagina) e media 1400px de largura --
    amostrar por ele dava razao 1,00 contra o proprio grafite do fundo, que e
    artefato de medicao, nao contraste real.
  */
  const cabeca = [...document.querySelectorAll('[class*="decisionHead"]')][0];
  if (cabeca) {
    const pinta = [cabeca, ...cabeca.querySelectorAll('*')].filter((el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3),
    );
    push(pinta[pinta.length - 1] ?? cabeca, 'instrucao');
  }

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
/*
  Esconde **só o texto medido**, não a coluna inteira: o scrim, a plataforma e
  as superfícies das portas precisam continuar pintados, porque é exatamente o
  fundo composto sob cada caixa que se quer amostrar.
*/
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
      const lt = lum(m[0], m[1], m[2]);
      let pior = Infinity, piorPx = null;
      for (let p = 0; p < d.length; p += 4) {
        const lb = lum(d[p], d[p + 1], d[p + 2]);
        const r = ratio(lt, lb);
        if (r < pior) { pior = r; piorPx = [d[p], d[p + 1], d[p + 2]]; }
      }
      out.push({ ...cx, pior: +pior.toFixed(2), piorPx });
    }
    resolve(out);
  };
  img.onerror = () => resolve([]);
  img.src = dataUrl;
});
1`

/* Só as portas da hero — `[role="tab"]` solto pegava as abas do diagnóstico. */
const PORTAS = `[aria-label="Frentes da Bianchini"] [role="tab"]`

async function medirContraste(vw) {
  const estados = await evaluate(
    `[...document.querySelectorAll('${PORTAS}')].map(b => (b.querySelector('[class*="doorName"]')?.textContent ?? b.textContent).trim().slice(0,24))`,
  )
  const resultado = []
  const nTabs = Math.max(1, estados.length)
  for (let i = 0; i < nTabs; i++) {
    if (i > 0) {
      await evaluate(
        `(()=>{const b=[...document.querySelectorAll('${PORTAS}')][${i}]; if(b) b.click(); return 1})()`,
      )
      await pause(1100)
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
    resultado.push({ viewport: vw, estado: estados[i] ?? `estado-${i}`, textos: JSON.parse(amostras) })
  }
  return resultado
}

/* ================= execução ================= */
const rows = []
const notes = { console: [], http: [] }

const pularLayout = process.argv.includes('--no-layout')
for (const vp of pularLayout ? [] : VIEWPORTS) {
  await setViewport(vp.w, vp.h)
  await goto(baseUrl + '/')
  const m = await evaluate(MEASURE)
  rows.push({ viewport: vp.w, ...m })
  for (const e of consoleErrors) notes.console.push(`${vp.w}: ${e}`)
  for (const e of httpFailures) notes.http.push(`${vp.w}: ${e}`)
  console.log(
    `${vp.w} | sb ${m.scrollbar} | gut ${m.gutter} | guia ${m.guia} | contW ${m.containerW} @ ${m.containerX} | pad ${m.padL} | C ${m.contentGuide} | hdr ${m.headerShellX} | h1 ${m.heroGuide} | ovf ${m.overflowDoc}/${m.overflowBody}`,
  )
}
/* Sem esta guarda, uma passada `--no-layout` gravava um layout.json vazio por cima. */
if (!pularLayout)
  await writeFile(path.join(outDir, 'layout.json'), JSON.stringify({ rows, notes }, null, 2))

if (wantContrast) {
  const todos = []
  for (const vw of CONTRAST_VIEWPORTS) {
    const vp = VIEWPORTS.find((v) => v.w === vw)
    await setViewport(vp.w, vp.h)
    await goto(baseUrl + '/')
    const r = await medirContraste(vw)
    todos.push(...r)
    for (const est of r) {
      const linha = est.textos
        .filter((t) => t.pior != null)
        .map((t) => `${t.nome} ${t.pior}`)
        .join(' · ')
      const pior = est.textos.filter((t) => t.pior != null).sort((a, b) => a.pior - b.pior)[0]
      console.log(
        `${vw} ${est.estado.padEnd(14)} | ${linha} | PIOR ${pior?.pior} ${pior?.pior >= 4.5 ? 'PASSA' : 'REPROVA'}`,
      )
    }
  }
  await writeFile(path.join(outDir, 'contraste.json'), JSON.stringify(todos, null, 2))
}

if (wantShots) {
  for (const w of SHOT_VIEWPORTS) {
    const vp = VIEWPORTS.find((v) => v.w === w)
    await setViewport(vp.w, vp.h)
    await goto(baseUrl + '/')
    const dobra = await cmd('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(outDir, `${w}-header-hero.png`), Buffer.from(dobra.data, 'base64'))

    /*
      A home tem ~14.500px em 1920 e ~22.000px em 390. Um raster 1:1 dessa
      altura estoura o limite de textura do Chromium e o `captureScreenshot`
      trava sem erro. `clip.scale` rasteriza em escala reduzida sem tocar no
      layout (que continua em CSS px), que é exatamente o que uma captura de
      página inteira serve para julgar: composição, ritmo e emendas.
    */
    const altura = await evaluate(`document.documentElement.scrollHeight`)
    const escala = Math.min(0.28, 14000 / altura)
    const full = await cmd(
      'Page.captureScreenshot',
      {
        format: 'png',
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: vp.w, height: altura, scale: escala },
      },
      90000,
    )
    await writeFile(path.join(outDir, `${w}-home-completa.png`), Buffer.from(full.data, 'base64'))
    console.log('captura', w, `(${altura}px @ ${escala.toFixed(3)}x)`)
  }
}

console.log('console errors:', notes.console.length)
console.log('http >=400:', [...new Set(notes.http)].length)
if (notes.console.length) console.log(notes.console.slice(0, 6))
if (notes.http.length) console.log([...new Set(notes.http)].slice(0, 6))
socket.close()
