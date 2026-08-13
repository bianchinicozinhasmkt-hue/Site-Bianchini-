/**
 * R1 — harness de recomposição de `#equipamentos`.
 *
 * Uso: node measure-r1.mjs <outDir> [baseUrl] [--shots]
 *
 * Derivado de `secoes-r0d-2026-08-12/medicoes/measure-r0d.mjs` — mesmo contador de
 * densidade (`p` + `h1..h6` visíveis, validado contra a auditoria de 2026-08-10), mesmo
 * reconhecimento de card **por construção** e mesmo inventário de amarelo. O que muda é
 * o alvo (`#equipamentos`) e três medidas que a ficha 2 do documento 03 cobra e a R0-D
 * não precisava:
 *
 *   · SANGRIA — quanto a mídia rompe a guia de conteúdo, à direita e à esquerda;
 *   · MASSA — largura da coluna de texto contra a da fotografia protagonista, para
 *     provar 65/35 e não 50/50;
 *   · ÁREA FOTOGRÁFICA — soma da área renderizada das imagens sobre a área da seção,
 *     com a protagonista separada das demais.
 *
 * A rota interna `/solucoes/cozinhas-industriais` é medida no mesmo passo, com um
 * resumo estrutural (assinatura de DOM) suficiente para provar regressão zero na
 * composição `dossier`.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3]?.startsWith('http') ? process.argv[3] : 'http://127.0.0.1:3210'
const wantShots = process.argv.includes('--shots')
const endpoint = 'http://127.0.0.1:9222'

await mkdir(outDir, { recursive: true })
if (wantShots) await mkdir(path.join(outDir, 'shots'), { recursive: true })

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
function waitFor(method, timeout = 20000) {
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
  const r = await cmd(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true },
    ms,
  )
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

const setViewport = (w, h) =>
  cmd('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: false,
  })

async function goto(url) {
  consoleErrors = []
  httpFailures = []
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';return 1})()`)
  await evaluate(`(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
    return 1;
  })()`)
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(1100)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(700)
  const estilado = await evaluate(
    `(() => { const el = document.querySelector('header a, main a, main button');
      return el ? /Oswald|Manrope/i.test(getComputedStyle(el).fontFamily) : true; })()`,
  )
  if (!estilado) throw new Error(`CSS não aplicado em ${url} — build servido está dessincronizado`)
}

/* ==========================================================================
   INVENTÁRIO — `#equipamentos` e vizinhas
   ========================================================================== */
const INVENTARIO = `(() => {
  const round = (n) => (n == null ? null : +n.toFixed(1));
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const fundoAncestral = (el) => {
    let p = el.parentElement;
    while (p) {
      const bg = getComputedStyle(p).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
      p = p.parentElement;
    }
    return 'rgb(255, 255, 255)';
  };

  const amareloDe = (c) => {
    const m = /rgba?\\((\\d+), ?(\\d+), ?(\\d+)(?:, ?([\\d.]+))?\\)/.exec(c || '');
    if (!m) return null;
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    const a = m[4] === undefined ? 1 : +m[4];
    if (a < 0.35) return null;
    if (r > 150 && g > 120 && b < 140 && r - b > 60 && g - b > 40) return { r, g, b, a };
    return null;
  };

  const sec = document.getElementById('equipamentos');
  if (!sec) return { erro: 'secao ausente' };

  const rect = sec.getBoundingClientRect();
  const y = Math.round(rect.top + window.scrollY);
  const h = Math.round(rect.height);
  const cs = getComputedStyle(sec);

  /* ---------- densidade ---------- */
  const blocos = [...sec.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].filter(vis);
  const textos = blocos.map((el) => ({
    tag: el.tagName.toLowerCase(),
    txt: (el.innerText || '').replace(/\\s+/g, ' ').trim(),
  })).filter((t) => t.txt);
  const caracteres = textos.reduce((s, t) => s + t.txt.length, 0);

  /* ---------- cards por construção ---------- */
  const cards = [];
  for (const el of sec.querySelectorAll('*')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 80 || r.height < 60) continue;
    const c = getComputedStyle(el);
    const bg = c.backgroundColor;
    const pai = fundoAncestral(el);
    const temSuperficie = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== pai;
    const bordas = ['Top', 'Right', 'Bottom', 'Left'].filter(
      (s) => parseFloat(c['border' + s + 'Width']) > 0 && c['border' + s + 'Style'] !== 'none',
    );
    const fechada = bordas.length >= 3;
    const raio = parseFloat(c.borderTopLeftRadius) > 0;
    if (!(temSuperficie || fechada || (raio && bordas.length > 0))) continue;
    if (el.tagName === 'SECTION' || el === sec) continue;
    cards.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class') || '').slice(0, 120),
      w: round(r.width), h: round(r.height),
      bg, paiBg: pai, bordas: bordas.length, raio: c.borderTopLeftRadius,
      motivo: temSuperficie ? 'superficie' : fechada ? 'borda-fechada' : 'raio+borda',
    });
  }

  /* ---------- hairlines ---------- */
  const hairDet = [];
  for (const el of sec.querySelectorAll('*')) {
    if (!vis(el)) continue;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(c['border' + s + 'Width']);
      if (w > 0 && w <= 3 && c['border' + s + 'Style'] !== 'none') {
        hairDet.push({ via: 'border-' + s.toLowerCase(), tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,70), w: round(r.width) });
        break;
      }
    }
    if ((r.height <= 3 || r.width <= 3) && (r.width > 12 || r.height > 12)) {
      const bg = c.backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent')
        hairDet.push({ via: 'barra', tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,70), w: round(r.width), h: round(r.height) });
    }
  }

  /* ---------- amarelos ---------- */
  const amarelos = [];
  for (const el of sec.querySelectorAll('*')) {
    if (!vis(el)) continue;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const bgA = amareloDe(c.backgroundColor);
    const fgA = amareloDe(c.color);
    const textoProprio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (bgA) amarelos.push({ via: 'fundo', tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,90), w: round(r.width), h: round(r.height), area: Math.round(r.width*r.height), cor: c.backgroundColor });
    if (fgA && textoProprio) amarelos.push({ via: 'texto', tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,90), w: round(r.width), h: round(r.height), area: Math.round(r.width*r.height), cor: c.color, txt: (el.innerText||'').trim().slice(0,40) });
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
      const bw = parseFloat(c['border' + s + 'Width']);
      if (bw > 0 && c['border' + s + 'Style'] !== 'none') {
        const ba = amareloDe(c['border' + s + 'Color']);
        if (ba) {
          const lado = s === 'Top' || s === 'Bottom' ? r.width : r.height;
          amarelos.push({ via: 'borda-' + s.toLowerCase(), tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,90), area: Math.round(lado*bw), cor: c['border'+s+'Color'] });
        }
      }
    }
    /* decoração de sublinhado amarela (link da nota) */
    if (c.textDecorationLine !== 'none' && amareloDe(c.textDecorationColor)) {
      amarelos.push({ via: 'underline', tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,90), area: Math.round(r.width * 2), cor: c.textDecorationColor, txt: (el.innerText||'').trim().slice(0,40) });
    }
  }

  /* ---------- imagens: protagonista × demais ---------- */
  const imagens = [...sec.querySelectorAll('img')].filter(vis).map((img) => {
    const r = img.getBoundingClientRect();
    return {
      src: (img.currentSrc || img.src).split('/').pop().split('?')[0].slice(0, 70),
      w: round(r.width), h: round(r.height),
      x: round(r.left), right: round(r.right),
      natural: img.naturalWidth + 'x' + img.naturalHeight,
      completo: img.complete && img.naturalWidth > 0,
      area: Math.round(r.width * r.height),
      sizes: img.getAttribute('sizes'),
    };
  });
  imagens.sort((a, b) => b.area - a.area);
  const areaSecao = rect.width * rect.height;
  const areaImagemPct = round((imagens.reduce((s, i) => s + i.area, 0) / Math.max(areaSecao, 1)) * 100);
  const areaProtagonistaPct = imagens[0] ? round((imagens[0].area / Math.max(areaSecao,1)) * 100) : null;
  const razaoProtagonista = imagens[0] && imagens[1] ? round(imagens[0].area / imagens[1].area) : null;

  /* ---------- sangria: mídia contra a guia de conteúdo ---------- */
  const guiaEl = sec.querySelector('[class*="max-w-"], .container') || sec;
  const guia = (() => {
    /* a guia real é o container de conteúdo mais largo que NÃO sangra */
    let melhor = null;
    for (const el of sec.querySelectorAll('div')) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width > window.innerWidth - 4) continue;
      if (!melhor || r.width > melhor.w) melhor = { w: round(r.width), left: round(r.left), right: round(r.right) };
    }
    return melhor;
  })();
  const sangria = imagens[0] && guia
    ? { direita: round(imagens[0].right - guia.right), esquerda: round(guia.left - imagens[0].x) }
    : null;

  /* ---------- massa: coluna de texto × fotografia ---------- */
  const h2 = sec.querySelector('h2');
  const colunaTexto = h2 ? (() => {
    let p = h2.parentElement, best = null;
    while (p && p !== sec) {
      const r = p.getBoundingClientRect();
      if (r.width > 0) best = round(r.width);
      if (r.width > (imagens[0]?.w ?? 0) * 0.2 && best) break;
      p = p.parentElement;
    }
    return best;
  })() : null;
  const massa = colunaTexto && imagens[0]
    ? { texto: colunaTexto, foto: imagens[0].w, pctFoto: round((imagens[0].w / (colunaTexto + imagens[0].w)) * 100) }
    : null;

  /* ---------- ações ---------- */
  const acoes = [...sec.querySelectorAll('a, button')].filter(vis).map((el) => {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      txt: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 60),
      href: el.getAttribute('href'),
      w: round(r.width), h: round(r.height),
      bg: c.backgroundColor, cor: c.color,
      papel: /rgb\\(245, 198, 75\\)|rgb\\(255, 227, 121\\)/.test(c.backgroundColor) ? 'primary' : (el.tagName === 'A' && c.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'textual' : 'outro'),
    };
  });

  /* ---------- vazio na base ---------- */
  let maxBottom = -Infinity;
  for (const el of sec.querySelectorAll('*')) {
    if (!vis(el)) continue;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const pinta =
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
      el.tagName === 'IMG' || el.tagName === 'SVG' ||
      (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') ||
      parseFloat(c.borderBottomWidth) > 0;
    if (pinta) maxBottom = Math.max(maxBottom, r.bottom + window.scrollY);
  }

  const yDe = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height), bg: getComputedStyle(el).backgroundColor };
  };

  return {
    doc: { h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, vw: window.innerWidth },
    equipamentos: {
      y, h, bg: cs.backgroundColor,
      padding: cs.paddingTop + ' / ' + cs.paddingBottom,
      blocosTexto: textos.length, caracteres, textos,
      nCards: cards.length, cards,
      nHairlines: hairDet.length, hairlines: hairDet,
      nAmarelos: amarelos.length, amarelos,
      nImagens: imagens.length, imagens,
      areaImagemPct, areaProtagonistaPct, razaoProtagonista,
      guia, sangria, massa,
      acoes, nAcoes: acoes.length,
      vazioBase: maxBottom === -Infinity ? null : Math.round(y + h - maxBottom),
    },
    vizinhas: {
      hero: yDe('#hero, section[data-hero], main > section:first-of-type'),
      equipamentos: yDe('#equipamentos'),
      projetos: yDe('#projetos'),
    },
  };
})()`

const OVERFLOW = `(async () => {
  const passo = Math.round(window.innerHeight * 0.6);
  const total = document.documentElement.scrollHeight;
  const vazamentos = [];
  for (let y = 0; y <= total; y += passo) {
    window.scrollTo(0, y);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const de = document.documentElement;
    if (de.scrollWidth > de.clientWidth + 1) {
      const culpados = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed') continue;
          culpados.push({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 80), left: +r.left.toFixed(1), right: +r.right.toFixed(1) });
        }
      }
      vazamentos.push({ y, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, culpados: culpados.slice(0, 6) });
    }
  }
  window.scrollTo(0, 0);
  return vazamentos;
})()`

/* ==========================================================================
   DOSSIÊ — assinatura estrutural de `/solucoes/cozinhas-industriais`
   ========================================================================== */
const DOSSIE = `(() => {
  const sec = document.getElementById('equipamentos');
  if (!sec) return { erro: 'secao ausente' };
  const round = (n) => (n == null ? null : +n.toFixed(1));
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const r = sec.getBoundingClientRect();

  /* assinatura de árvore: tag + classe, na ordem do documento */
  const arvore = [...sec.querySelectorAll('*')].map((el) =>
    el.tagName.toLowerCase() + '|' + (el.getAttribute('class') || ''),
  );

  const textos = [...sec.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a')]
    .filter(vis)
    .map((el) => (el.innerText || '').replace(/\\s+/g, ' ').trim())
    .filter(Boolean);

  const imagens = [...sec.querySelectorAll('img')].map((img) => ({
    src: (img.currentSrc || img.src).split('/').pop().split('?')[0],
    w: round(img.getBoundingClientRect().width),
    h: round(img.getBoundingClientRect().height),
    sizes: img.getAttribute('sizes'),
    alt: img.getAttribute('alt'),
  }));

  const acoes = [...sec.querySelectorAll('a, button')].filter(vis).map((el) => ({
    txt: (el.innerText || '').replace(/\\s+/g, ' ').trim(),
    href: el.getAttribute('href'),
    w: round(el.getBoundingClientRect().width),
    h: round(el.getBoundingClientRect().height),
  }));

  return {
    y: Math.round(r.top + window.scrollY),
    h: Math.round(r.height),
    w: round(r.width),
    bg: getComputedStyle(sec).backgroundColor,
    padding: getComputedStyle(sec).paddingTop + ' / ' + getComputedStyle(sec).paddingBottom,
    nNos: arvore.length,
    arvore,
    textos,
    nTextos: textos.length,
    caracteres: textos.reduce((s, t) => s + t.length, 0),
    imagens,
    acoes,
    html: sec.outerHTML.length,
    docH: document.documentElement.scrollHeight,
  };
})()`

const VIEWPORTS = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1440, 900],
  [1600, 900],
  [1920, 1080],
]

const resultado = { baseUrl, quando: new Date().toISOString(), home: {}, dossie: {} }

for (const [w, h] of VIEWPORTS) {
  await setViewport(w, h)
  await goto(`${baseUrl}/`)
  const inv = await evaluate(INVENTARIO)
  const ovf = await evaluate(OVERFLOW, 120000)
  const imgsQuebradas = await evaluate(
    `[...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)`,
  )
  const hrefsVazios = await evaluate(
    `[...document.querySelectorAll('a[href="#"], a[href=""], a:not([href])')].map((a)=>a.outerHTML.slice(0,120))`,
  )
  const ancorasQuebradas = await evaluate(`(() => {
    const alvos = [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')];
    return alvos
      .map((a) => a.getAttribute('href').replace(/^\\//, ''))
      .filter((hrf) => hrf.length > 1)
      .filter((hrf) => !document.querySelector('[id="' + hrf.slice(1) + '"]'));
  })()`)

  resultado.home[`${w}x${h}`] = {
    ...inv,
    overflow: ovf,
    imgsQuebradas,
    hrefsVazios,
    ancorasQuebradas,
    consoleErrors: [...consoleErrors],
    httpFailures: [...httpFailures],
  }
  const e = inv.equipamentos
  console.log(
    `${w}x${h}  eq ${e?.caracteres}c/${e?.blocosTexto}b  cards=${e?.nCards}  amar=${e?.nAmarelos}  hair=${e?.nHairlines}  h=${e?.h}px  img%=${e?.areaImagemPct}  ovf=${ovf.length}`,
  )
}

/* ---------- dossiê: rota interna ---------- */
for (const [w, h] of [
  [390, 844],
  [1440, 900],
]) {
  await setViewport(w, h)
  await goto(`${baseUrl}/solucoes/cozinhas-industriais`)
  const d = await evaluate(DOSSIE)
  resultado.dossie[`${w}x${h}`] = {
    ...d,
    consoleErrors: [...consoleErrors],
    httpFailures: [...httpFailures],
  }
  console.log(`DOSSIE ${w}x${h}  h=${d.h}px  nos=${d.nNos}  textos=${d.nTextos}  chars=${d.caracteres}  imgs=${d.imagens.length}`)
}

/* ---------- capturas ---------- */
if (wantShots) {
  const shot = async (nome) => {
    const { data } = await cmd('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(outDir, 'shots', `${nome}.png`), Buffer.from(data, 'base64'))
  }
  const rolarPara = async (y) => {
    await evaluate(`(()=>{window.scrollTo(0,${Math.max(0, Math.round(y))});return 1})()`)
    await pause(500)
  }
  /* ----------
     Seção inteira, sem cortar: a janela ganha a altura da seção.

     A posição é medida **depois** do redimensionamento, nunca antes. A primeira
     dobra é dimensionada em `svh`, então crescer a janela cresce a hero e empurra
     `#equipamentos` para baixo — medir `y` na janela de 900 e rolar até lá com a
     janela já alta corta a faixa fora do quadro. Duas medições: a primeira só
     para saber que altura pedir, a segunda para saber onde rolar.
     ---------- */
  const shotSecaoInteira = async (w, nome, url) => {
    await setViewport(w, 900)
    await goto(url)
    const primeira = await evaluate(
      `(() => { const r = document.getElementById('equipamentos').getBoundingClientRect();
        return { h: Math.round(r.height) }; })()`,
    )
    await setViewport(w, Math.min(primeira.h + 48, 12000))
    await pause(500)
    const alvo = await evaluate(
      `(() => { const r = document.getElementById('equipamentos').getBoundingClientRect();
        return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) }; })()`,
    )
    /* a altura pode ter mudado com a janela; refaz a janela se mudou */
    if (Math.abs(alvo.h - primeira.h) > 2) {
      await setViewport(w, Math.min(alvo.h + 48, 12000))
      await pause(400)
    }
    const final = await evaluate(
      `(() => { const r = document.getElementById('equipamentos').getBoundingClientRect();
        return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) }; })()`,
    )
    await evaluate(`(()=>{window.scrollTo(0,${Math.max(0, final.y - 24)});return 1})()`)
    await pause(700)
    await shot(nome)
    await setViewport(w, 900)
  }

  for (const w of [320, 390, 768, 1024, 1440, 1920]) {
    await shotSecaoInteira(w, `${w}-equipamentos-inteira`, `${baseUrl}/`)
  }

  /* momentos e passagens */
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
    [1920, 1080],
  ]) {
    await setViewport(w, h)
    await goto(`${baseUrl}/`)
    const inv = await evaluate(INVENTARIO)
    const e = inv.equipamentos
    const p = inv.vizinhas.projetos
    await rolarPara(e.y - h * 0.82)
    await shot(`${w}-equipamentos-entrando`)
    await rolarPara(e.y + e.h / 2 - h / 2)
    await shot(`${w}-equipamentos-centro`)
    await rolarPara(e.y + e.h - h * 0.18)
    await shot(`${w}-equipamentos-saindo`)
    /* passagem hero → equipamentos */
    await rolarPara(e.y - h / 2)
    await shot(`${w}-T-hero-equipamentos`)
    /* passagem equipamentos → projetos */
    if (p) {
      await rolarPara(p.y - h / 2)
      await shot(`${w}-T-equipamentos-projetos`)
    }
  }

  /* dossiê */
  for (const w of [390, 1440]) {
    await shotSecaoInteira(w, `${w}-dossier-cozinhas-industriais`, `${baseUrl}/solucoes/cozinhas-industriais`)
  }
}

await writeFile(path.join(outDir, 'medicao.json'), JSON.stringify(resultado, null, 1))
console.log('\nGravado em', path.join(outDir, 'medicao.json'))
socket.close()
