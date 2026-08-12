/**
 * R0-D — harness de conformidade de `#pilares`, `#transicao` e `#fechamento`.
 *
 * Uso: node measure-r0d.mjs <outDir> [baseUrl] [--shots]
 *
 * Mede o que os três deltas da rodada exigem (doc 06: S-08, S-15, S-31) e o que o
 * briefing pede para provar que a redução é real:
 *
 *   · densidade — caracteres e blocos de texto por seção;
 *   · caixa — altura, y, fundo, padding, área vazia e distância até a vizinha;
 *   · cards — reconhecidos por **construção**, não por classe;
 *   · regiões amarelas — inventário elemento a elemento, com área e classificação;
 *   · overflow horizontal varrendo a página em passos de 60% da janela;
 *   · console, HTTP e imagens quebradas.
 *
 * ---------- POR QUE O CONTADOR DE TEXTO É `p` + `h1..h6` ----------
 *
 * A auditoria global de 2026-08-10 publicou `blocosTexto`/`caracteres` por seção e é
 * contra esses números que a matriz de deltas cobra os tetos. Reproduzir o teto exige
 * reproduzir o contador: `#transicao` (3 blocos / 326 caracteres) e `#fechamento`
 * (2 / 182) só fecham se o conjunto medido for **`p` e `h1..h6` visíveis** — etiqueta
 * (`span`), rótulo de ação (`a`) e legenda de figura (`figcaption`) ficam de fora.
 * Confirmado nas duas seções antes de qualquer edição desta rodada.
 *
 * ---------- POR QUE O RECONHECIMENTO DE CARD É POR CONSTRUÇÃO ----------
 *
 * Card é caixa: superfície própria (fundo diferente do ancestral pintado) **ou** borda
 * fechada, com conteúdo dentro. Procurar por nome de classe deixaria passar qualquer
 * caixa montada com utilitário arbitrário, que é justamente o caso residual que S-15
 * cobra.
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

/*
  A folha de estilo é conferida, não presumida — lição registrada em R0-C.1: um
  `next start` sobrevivente serve HTML de um build e CSS de outro, e a medição sai
  inteira e errada.
*/
async function goto(url) {
  consoleErrors = []
  httpFailures = []
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';return 1})()`)
  /* Revela tudo e promove lazy → eager, conforme o protocolo de captura (doc 04 §5). */
  await evaluate(`(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
    return 1;
  })()`)
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(900)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(700)
  const estilado = await evaluate(
    `(() => { const el = document.querySelector('header a, main a, main button');
      return el ? /Oswald|Manrope/i.test(getComputedStyle(el).fontFamily) : true; })()`,
  )
  if (!estilado) throw new Error(`CSS não aplicado em ${url} — build servido está dessincronizado`)
}

/* ==========================================================================
   INVENTÁRIO POR SEÇÃO
   ========================================================================== */
const INVENTARIO = `(() => {
  const round = (n) => (n == null ? null : +n.toFixed(1));
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  /* Fundo pintado mais próximo — o que um card teria de contrariar para virar caixa. */
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
    /* faixa do amarelo do sistema: yellow #F5C64B, yellow-bright #FFE379, yellow-deep */
    if (r > 150 && g > 120 && b < 140 && r - b > 60 && g - b > 40) return { r, g, b, a };
    return null;
  };

  const SECOES = ['pilares', 'transicao', 'cta-final'];
  const alvo = (id) =>
    id === 'cta-final'
      ? document.querySelector('section[aria-labelledby="cta-final-titulo"]')
      : document.getElementById(id);

  const out = {};
  const docH = document.documentElement.scrollHeight;

  for (const id of SECOES) {
    const sec = alvo(id);
    if (!sec) { out[id] = null; continue; }
    const rect = sec.getBoundingClientRect();
    const y = Math.round(rect.top + window.scrollY);
    const h = Math.round(rect.height);
    const cs = getComputedStyle(sec);
    const secBg = cs.backgroundColor;

    /* ---------- densidade: p + h1..h6 visíveis (contador da auditoria 2026-08-10) ---------- */
    const blocos = [...sec.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].filter(vis);
    const textos = blocos.map((el) => (el.innerText || '').replace(/\\s+/g, ' ').trim()).filter(Boolean);
    const caracteres = textos.reduce((s, t) => s + t.length, 0);

    /* ---------- cards: superfície própria ou borda fechada, com conteúdo ---------- */
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
      if (el.closest('header') || el.tagName === 'SECTION' || el === sec) continue;
      cards.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') || '').slice(0, 110),
        w: round(r.width), h: round(r.height),
        bg, paiBg: pai, bordas: bordas.length, raio: c.borderTopLeftRadius,
        motivo: temSuperficie ? 'superficie' : fechada ? 'borda-fechada' : 'raio+borda',
      });
    }

    /* ---------- hairlines: réguas de 1–3px ---------- */
    let hairlines = 0;
    for (const el of sec.querySelectorAll('*')) {
      if (!vis(el)) continue;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
        const w = parseFloat(c['border' + s + 'Width']);
        if (w > 0 && w <= 3 && c['border' + s + 'Style'] !== 'none') { hairlines++; break; }
      }
      if ((r.height <= 3 || r.width <= 3) && (r.width > 12 || r.height > 12)) {
        const bg = c.backgroundColor;
        if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') hairlines++;
      }
    }

    /* ---------- regiões amarelas: elemento a elemento, com área ---------- */
    const amarelos = [];
    for (const el of sec.querySelectorAll('*')) {
      if (!vis(el)) continue;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const bgA = amareloDe(c.backgroundColor);
      const fgA = amareloDe(c.color);
      /* cor de texto só conta onde há texto próprio */
      const textoProprio = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
      );
      if (bgA) {
        amarelos.push({
          via: 'fundo', tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute('class') || '').slice(0, 90),
          w: round(r.width), h: round(r.height), area: Math.round(r.width * r.height),
          cor: c.backgroundColor,
        });
      }
      if (fgA && textoProprio) {
        amarelos.push({
          via: 'texto', tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute('class') || '').slice(0, 90),
          w: round(r.width), h: round(r.height), area: Math.round(r.width * r.height),
          cor: c.color, txt: (el.innerText || '').trim().slice(0, 40),
        });
      }
      /* bordas amarelas (keyline de legenda, régua de destaque) */
      for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
        const bw = parseFloat(c['border' + s + 'Width']);
        if (bw > 0 && c['border' + s + 'Style'] !== 'none') {
          const ba = amareloDe(c['border' + s + 'Color']);
          if (ba) {
            const lado = s === 'Top' || s === 'Bottom' ? r.width : r.height;
            amarelos.push({
              via: 'borda-' + s.toLowerCase(), tag: el.tagName.toLowerCase(),
              cls: (el.getAttribute('class') || '').slice(0, 90),
              w: round(s === 'Top' || s === 'Bottom' ? r.width : bw),
              h: round(s === 'Top' || s === 'Bottom' ? bw : r.height),
              area: Math.round(lado * bw), cor: c['border' + s + 'Color'],
            });
          }
        }
      }
    }

    /* ---------- imagens ---------- */
    const imagens = [...sec.querySelectorAll('img')].filter(vis).map((img) => {
      const r = img.getBoundingClientRect();
      return {
        src: (img.currentSrc || img.src).split('/').pop().split('?')[0].slice(0, 60),
        w: round(r.width), h: round(r.height),
        natural: img.naturalWidth + 'x' + img.naturalHeight,
        completo: img.complete && img.naturalWidth > 0,
        area: Math.round(r.width * r.height),
      };
    });
    const areaSecao = rect.width * rect.height;
    const areaImagemPct = round(
      (imagens.reduce((s, i) => s + i.area, 0) / Math.max(areaSecao, 1)) * 100,
    );

    /* ---------- ações ---------- */
    const acoes = [...sec.querySelectorAll('a, button')].filter(vis).map((el) => {
      const r = el.getBoundingClientRect();
      const c = getComputedStyle(el);
      return {
        txt: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 50),
        href: el.getAttribute('href'),
        w: round(r.width), h: round(r.height),
        bg: c.backgroundColor,
        borda: c.borderTopWidth + ' ' + c.borderTopColor,
        cor: c.color,
      };
    });

    /* ---------- área vazia sob o último elemento com tinta ---------- */
    let maxBottom = -Infinity;
    for (const el of sec.querySelectorAll('*')) {
      if (!vis(el)) continue;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const pinta =
        (el.childNodes.length &&
          [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) ||
        el.tagName === 'IMG' ||
        el.tagName === 'SVG' ||
        (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') ||
        parseFloat(c.borderBottomWidth) > 0;
      if (pinta) maxBottom = Math.max(maxBottom, r.bottom + window.scrollY);
    }
    const vazioBase = maxBottom === -Infinity ? null : Math.round(y + h - maxBottom);

    out[id] = {
      y, h, bg: secBg,
      padding: cs.paddingTop + ' / ' + cs.paddingBottom,
      blocosTexto: textos.length,
      caracteres,
      textos,
      cards,
      nCards: cards.length,
      hairlines,
      amarelos,
      nAmarelos: amarelos.length,
      imagens,
      areaImagemPct,
      acoes,
      vazioBase,
    };
  }

  /* distância entre seções vizinhas relevantes */
  const yDe = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
  };

  return {
    doc: { h: docH, w: document.documentElement.scrollWidth, vw: window.innerWidth },
    secoes: out,
    vizinhas: {
      projetos: yDe('#projetos'),
      pilares: yDe('#pilares'),
      sintomas: yDe('#sintomas'),
      diagnostico: yDe('#diagnostico'),
      transicao: yDe('#transicao'),
      inox: yDe('#industria-do-inox'),
      credibilidade: yDe('#credibilidade'),
      fechamento: yDe('section[aria-labelledby="cta-final-titulo"]'),
      footer: yDe('footer'),
    },
  };
})()`

/* ---------- varredura de overflow em passos de 60% da janela ---------- */
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
          culpados.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.getAttribute('class') || '').slice(0, 80),
            left: +r.left.toFixed(1), right: +r.right.toFixed(1),
          });
        }
      }
      vazamentos.push({ y, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, culpados: culpados.slice(0, 6) });
    }
  }
  window.scrollTo(0, 0);
  return vazamentos;
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

const resultado = { baseUrl, quando: new Date().toISOString(), viewports: {} }

for (const [w, h] of VIEWPORTS) {
  await setViewport(w, h)
  await goto(`${baseUrl}/`)
  const inv = await evaluate(INVENTARIO)
  const ovf = await evaluate(OVERFLOW, 90000)
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

  resultado.viewports[`${w}x${h}`] = {
    ...inv,
    overflow: ovf,
    imgsQuebradas,
    hrefsVazios,
    ancorasQuebradas,
    consoleErrors: [...consoleErrors],
    httpFailures: [...httpFailures],
  }
  console.log(
    `${w}x${h}  pilares ${inv.secoes.pilares?.caracteres}c/${inv.secoes.pilares?.blocosTexto}b/${inv.secoes.pilares?.h}px` +
      `  transicao cards=${inv.secoes.transicao?.nCards}/${inv.secoes.transicao?.h}px` +
      `  fechamento amarelos=${inv.secoes['cta-final']?.nAmarelos}/${inv.secoes['cta-final']?.h}px` +
      `  ovf=${ovf.length}`,
  )
}

/* ---------- capturas ---------- */
if (wantShots) {
  const shot = async (nome) => {
    const { data } = await cmd('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(outDir, 'shots', `${nome}.png`), Buffer.from(data, 'base64'))
  }
  const rolarPara = async (y) => {
    await evaluate(`(()=>{window.scrollTo(0,${Math.max(0, Math.round(y))});return 1})()`)
    await pause(450)
  }

  const PLANO = [
    { vw: [1440, 900], secoes: ['pilares', 'transicao', 'cta-final'], momentos: true },
    { vw: [390, 844], secoes: ['pilares', 'transicao', 'cta-final'], momentos: false },
    { vw: [1920, 1080], secoes: ['pilares', 'transicao', 'cta-final'], momentos: false },
  ]

  for (const p of PLANO) {
    const [w, h] = p.vw
    await setViewport(w, h)
    await goto(`${baseUrl}/`)
    const inv = await evaluate(INVENTARIO)
    for (const id of p.secoes) {
      const s = inv.secoes[id]
      if (!s) continue
      const nome = id === 'cta-final' ? 'fechamento' : id
      if (p.momentos) {
        /* ENTRANDO: topo da seção no rodapé da janela */
        await rolarPara(s.y - h * 0.82)
        await shot(`${w}-${nome}-entrando`)
        /* CENTRALIZADA */
        await rolarPara(s.y + s.h / 2 - h / 2)
        await shot(`${w}-${nome}-centro`)
        /* SAINDO: base da seção no topo da janela */
        await rolarPara(s.y + s.h - h * 0.18)
        await shot(`${w}-${nome}-saindo`)
      } else {
        await rolarPara(s.y + s.h / 2 - h / 2)
        await shot(`${w}-${nome}`)
      }
    }
    /* fechamento + rodapé, nas duas larguras que o briefing pede */
    if (w === 1440 || w === 390) {
      const f = inv.secoes['cta-final']
      await rolarPara(f.y + f.h - h * 0.45)
      await shot(`${w}-fechamento-footer`)
    }
    /* passagens entre vizinhas, só em 1440 */
    if (w === 1440) {
      const v = inv.vizinhas
      const par = [
        ['T-projetos-pilares', v.pilares.y],
        ['T-pilares-sintomas', v.sintomas.y],
        ['T-diagnostico-transicao', v.transicao.y],
        ['T-transicao-inox', v.inox.y],
        ['T-credibilidade-fechamento', v.fechamento.y],
      ]
      for (const [nome, y] of par) {
        await rolarPara(y - h / 2)
        await shot(`${w}-${nome}`)
      }
    }
  }
}

await writeFile(path.join(outDir, 'medicao.json'), JSON.stringify(resultado, null, 1))
console.log('\nGravado em', path.join(outDir, 'medicao.json'))
socket.close()
