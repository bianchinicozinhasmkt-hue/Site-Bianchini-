/**
 * R2 — harness de conformidade de `#projetos`.
 *
 * Uso: node measure-r2.mjs <outDir> [baseUrl] [--shots]
 *
 * Derivado de `equipamentos-r1-2026-08-12/medicoes/measure-r1.mjs` — mesmo contador de
 * densidade (`p` + `h1..h6` visíveis), mesmo reconhecimento de card **por construção**,
 * mesmo inventário de amarelo e hairline. O alvo muda para `#projetos` e entram três
 * medidas que a ficha 3 do documento 03 e o briefing da R2 cobram:
 *
 *   · MASSA PROTAGONISTA × APOIO (§4 e §26 do briefing) — a conta que reprovou
 *     `#equipamentos` em R1 (S-04b): a protagonista pode ser individualmente grande e
 *     ainda perder massa para a SOMA do apoio. Registra A, cada B, Btotal, A/maiorB,
 *     A/Btotal e A/área fotográfica total;
 *   · SANGRIA POR IMAGEM — quantas fotografias rompem a guia de conteúdo, e quanto;
 *   · ESTRUTURA CSS do mosaico — `display` real do contêiner das provas (grid/columns/
 *     flex), com `grid-template-columns` e `column-count`, para decidir §9 por evidência.
 *
 * A rota interna `/solucoes/cozinhas-industriais` (composição `dossier`) é medida no
 * mesmo passo, com assinatura de DOM suficiente para provar regressão zero.
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

function cmd(method, params = {}, ms = 180000) {
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
async function evaluate(expression, ms = 120000) {
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

const setViewport = (w, h) =>
  cmd('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: false,
  })

/**
 * Bloqueia até toda `<img>` da página ter decodificado.
 *
 * Promover `loading="lazy"` a `eager` só **inicia** o carregamento; não espera por ele. Sem
 * esta barreira, a medição de 320 registrou duas das três provas da frisa com
 * `naturalWidth === 0` e a captura saiu com as caixas vazias — o leito claro no lugar da
 * fotografia. Área e altura não dependiam disso (vêm da caixa), mas a evidência visual sim,
 * e é ela que decide a rodada.
 *
 * Devolve o que não carregou em 20s, para o defeito aparecer como dado em vez de virar uma
 * captura silenciosamente errada.
 */
async function esperarImagens(limiteMs = 15000) {
  const pendentes = await evaluate(
    `(async () => {
      const imgs = [...document.images];
      await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth > 0)
        ? Promise.resolve()
        : new Promise((r) => {
            i.addEventListener('load', r, { once: true });
            i.addEventListener('error', r, { once: true });
            setTimeout(r, ${limiteMs});
          })));
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      return imgs.filter((i) => !(i.complete && i.naturalWidth > 0))
        .map((i) => (i.currentSrc || i.src).slice(-70));
    })()`,
    limiteMs + 60000,
  )
  if (pendentes.length) console.warn('  ! imagens não carregadas:', pendentes)
  return pendentes
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
  /* `.photo-mask` e `.line-mask` entram junto com `.reveal`.
     `PhotoReveal` não usa `.reveal` — usa `.photo-mask`, que fica em
     `clip-path: inset(0 0 100% 0)` até o observador abrir. E o recorte do contêiner zera a
     interseção da própria `<img>`, então o lazy loading nativo nunca dispara enquanto a
     máscara está fechada: duas das três provas da frisa ficavam com `currentSrc` vazio e a
     captura saía com a caixa no lugar da fotografia. Abrir as máscaras antes de promover
     lazy→eager é o que torna a barreira de decodificação capaz de esperar por elas. */
  await evaluate(`(() => {
    document.querySelectorAll('.reveal, .photo-mask, .line-mask').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
    return 1;
  })()`)
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(1100)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(700)
  await esperarImagens()
  const estilado = await evaluate(
    `(() => { const el = document.querySelector('header a, main a, main button');
      return el ? /Oswald|Manrope/i.test(getComputedStyle(el).fontFamily) : true; })()`,
  )
  if (!estilado) throw new Error(`CSS não aplicado em ${url} — build servido está dessincronizado`)
}

/* ==========================================================================
   INVENTÁRIO — `#projetos` e vizinhas
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

  const sec = document.getElementById('projetos');
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
    /* uma caixa cujo fundo só existe como leito da fotografia que a preenche não é
       superfície autônoma — é o fundo do próprio quadro. */
    const soLeito = temSuperficie && el.querySelector(':scope > img') && !( [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) );
    cards.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class') || '').slice(0, 140),
      w: round(r.width), h: round(r.height),
      bg, paiBg: pai, bordas: bordas.length, raio: c.borderTopLeftRadius,
      motivo: temSuperficie ? 'superficie' : fechada ? 'borda-fechada' : 'raio+borda',
      leitoDeFoto: !!soLeito,
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
        hairDet.push({ via: 'border-' + s.toLowerCase(), tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,80), w: round(r.width), cor: c['border' + s + 'Color'] });
        break;
      }
    }
    if ((r.height <= 3 || r.width <= 3) && (r.width > 12 || r.height > 12)) {
      const bg = c.backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent')
        hairDet.push({ via: 'barra', tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,80), w: round(r.width), h: round(r.height), cor: bg });
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
    if (c.textDecorationLine !== 'none' && amareloDe(c.textDecorationColor)) {
      amarelos.push({ via: 'underline', tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,90), area: Math.round(r.width * 2), cor: c.textDecorationColor, txt: (el.innerText||'').trim().slice(0,40) });
    }
  }

  /* ---------- imagens ---------- */
  /* currentSrc é a URL do otimizador (/_next/image?url=...&w=...), então o nome do
     arquivo real vive no parâmetro "url" — sem isso toda imagem se chama "image".
     naturalWidth também é do arquivo OTIMIZADO, não do original: serve para medir
     ampliação de renderização, e não para auditar o acervo (isso é assets.mjs). */
  const arquivoDe = (u) => {
    try {
      const url = new URL(u, location.href);
      const alvo = url.searchParams.get('url') || url.pathname;
      return decodeURIComponent(alvo).split('/').pop().split('?')[0];
    } catch { return String(u).split('/').pop(); }
  };
  const imagens = [...sec.querySelectorAll('img')].filter(vis).map((img) => {
    const r = img.getBoundingClientRect();
    const fig = img.closest('figure');
    const cap = fig ? fig.querySelector('figcaption') : null;
    return {
      src: arquivoDe(img.currentSrc || img.src).slice(0, 70),
      entregue: (img.currentSrc || '').match(/[?&]w=(\\d+)/)?.[1] ?? null,
      w: round(r.width), h: round(r.height),
      x: round(r.left), right: round(r.right),
      natural: img.naturalWidth + 'x' + img.naturalHeight,
      proporcaoArquivo: img.naturalHeight ? round(img.naturalWidth / img.naturalHeight) : null,
      proporcaoRender: r.height ? round(r.width / r.height) : null,
      ampliacao: img.naturalWidth ? round(r.width / img.naturalWidth) : null,
      completo: img.complete && img.naturalWidth > 0,
      area: Math.round(r.width * r.height),
      sizes: img.getAttribute('sizes'),
      figId: fig ? fig.getAttribute('id') : null,
      legenda: cap ? (cap.innerText || '').replace(/\\s+/g,' ').trim().slice(0, 160) : null,
    };
  });
  imagens.sort((a, b) => b.area - a.area);

  const areaSecao = rect.width * rect.height;
  const areaFoto = imagens.reduce((s, i) => s + i.area, 0);
  const areaImagemPct = round((areaFoto / Math.max(areaSecao, 1)) * 100);

  /* ---------- MASSA: protagonista × apoio (§4 / §26) ---------- */
  const A = imagens[0] ? imagens[0].area : 0;
  const apoio = imagens.slice(1);
  const Btotal = apoio.reduce((s, i) => s + i.area, 0);
  const maiorB = apoio[0] ? apoio[0].area : 0;
  const massaFoto = {
    protagonista: imagens[0] ? { src: imagens[0].src, area: A, w: imagens[0].w, h: imagens[0].h } : null,
    apoio: apoio.map((i) => ({ src: i.src, area: i.area, w: i.w, h: i.h })),
    A, Btotal, maiorB,
    A_sobre_maiorB: maiorB ? round(A / maiorB) : null,
    A_sobre_Btotal: Btotal ? round(A / Btotal) : null,
    A_pct_da_area_fotografica: areaFoto ? round((A / areaFoto) * 100) : null,
    Btotal_pct_da_area_fotografica: areaFoto ? round((Btotal / areaFoto) * 100) : null,
    maiorB_pct_da_area_fotografica: areaFoto ? round((maiorB / areaFoto) * 100) : null,
    A_pct_da_secao: round((A / Math.max(areaSecao,1)) * 100),
    Btotal_pct_da_secao: round((Btotal / Math.max(areaSecao,1)) * 100),
  };

  /* ---------- guia e sangria por imagem ---------- */
  const guia = (() => {
    let melhor = null;
    for (const el of sec.querySelectorAll('div')) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width > window.innerWidth - 4) continue;
      if (!melhor || r.width > melhor.w) melhor = { w: round(r.width), left: round(r.left), right: round(r.right) };
    }
    return melhor;
  })();
  const sangriaPorImagem = guia ? imagens.map((i) => ({
    src: i.src,
    rompeDireita: round(i.right - guia.right),
    rompeEsquerda: round(guia.left - i.x),
    rompe: (i.right - guia.right) > 2 || (guia.left - i.x) > 2,
    fullBleed: i.x <= 1 && i.right >= window.innerWidth - 1,
  })) : null;
  const nRompem = sangriaPorImagem ? sangriaPorImagem.filter((s) => s.rompe).length : null;

  /* ---------- estrutura CSS do mosaico ---------- */
  const contentores = [...sec.querySelectorAll('ul, ol, div')].filter(vis).filter((el) => {
    return el.querySelectorAll('img').length >= 2;
  }).map((el) => {
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class') || '').slice(0, 140),
      display: c.display,
      gridTemplateColumns: c.gridTemplateColumns,
      columnCount: c.columnCount,
      gap: c.gap || (c.columnGap + ' / ' + c.rowGap),
      nImgs: el.querySelectorAll('img').length,
      w: round(r.width), h: round(r.height),
    };
  });

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

  /* ---------- legendas ---------- */
  const legendas = [...sec.querySelectorAll('figcaption')].filter(vis).map((el) => ({
    txt: (el.innerText || '').replace(/\\s+/g, ' ').trim(),
    dentroDaFoto: getComputedStyle(el).position === 'absolute',
  }));

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
    projetos: {
      y, h, bg: cs.backgroundColor,
      padding: cs.paddingTop + ' / ' + cs.paddingBottom,
      blocosTexto: textos.length, caracteres, textos,
      nCards: cards.length, cards,
      nHairlines: hairDet.length, hairlines: hairDet,
      nAmarelos: amarelos.length, amarelos,
      nImagens: imagens.length, imagens,
      areaImagemPct, massaFoto,
      guia, sangriaPorImagem, nRompem,
      contentores,
      acoes, nAcoes: acoes.length,
      legendas, nLegendas: legendas.length,
      vazioBase: maxBottom === -Infinity ? null : Math.round(y + h - maxBottom),
    },
    vizinhas: {
      equipamentos: yDe('#equipamentos'),
      projetos: yDe('#projetos'),
      pilares: yDe('#pilares'),
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
  const sec = document.getElementById('projetos');
  if (!sec) return { erro: 'secao ausente' };
  const round = (n) => (n == null ? null : +n.toFixed(1));
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const r = sec.getBoundingClientRect();

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

const TODAS = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1440, 900],
  [1600, 900],
  [1920, 1080],
]

/**
 * `--vp=768,1024` roda só essas larguras e grava `medicao-<larguras>.json`. Uma conexão
 * CDP longa atravessando as oito viewports com a varredura de overflow em cada uma
 * enforcava o socket; fatiar a corrida mantém cada invocação curta e o JSON é
 * consolidado depois por `juntar.mjs`.
 */
const filtro = process.argv.find((a) => a.startsWith('--vp='))
const larguras = filtro ? filtro.slice(5).split(',').map(Number) : null
const VIEWPORTS = larguras ? TODAS.filter(([w]) => larguras.includes(w)) : TODAS
const semDossie = process.argv.includes('--sem-dossie')
const arquivo = larguras ? `medicao-${larguras.join('-')}.json` : 'medicao.json'

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
  const p = inv.projetos
  console.log(
    `${w}x${h}  proj ${p?.caracteres}c/${p?.blocosTexto}b  cards=${p?.nCards}  amar=${p?.nAmarelos}  hair=${p?.nHairlines}  h=${p?.h}px  img%=${p?.areaImagemPct}  A/Btot=${p?.massaFoto?.A_sobre_Btotal}  rompem=${p?.nRompem}  ovf=${ovf.length}`,
  )
}

/* ---------- dossiê: rota interna ---------- */
for (const [w, h] of semDossie ? [] : [
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
  /* Seção inteira, sem cortar: a janela ganha a altura da seção. A posição é medida
     **depois** do redimensionamento — a hero é dimensionada em `svh` e empurra tudo. */
  const shotSecaoInteira = async (w, nome, url, id = 'projetos') => {
    await setViewport(w, 900)
    await goto(url)
    const primeira = await evaluate(
      `(() => { const r = document.getElementById('${id}').getBoundingClientRect();
        return { h: Math.round(r.height) }; })()`,
    )
    await setViewport(w, Math.min(primeira.h + 48, 12000))
    await pause(500)
    const alvo = await evaluate(
      `(() => { const r = document.getElementById('${id}').getBoundingClientRect();
        return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) }; })()`,
    )
    if (Math.abs(alvo.h - primeira.h) > 2) {
      await setViewport(w, Math.min(alvo.h + 48, 12000))
      await pause(400)
    }
    const final = await evaluate(
      `(() => { const r = document.getElementById('${id}').getBoundingClientRect();
        return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) }; })()`,
    )
    await evaluate(`(()=>{window.scrollTo(0,${Math.max(0, final.y - 24)});return 1})()`)
    await pause(700)
    await shot(nome)
    await setViewport(w, 900)
  }

  for (const w of [320, 390, 768, 1024, 1366, 1440, 1600, 1920]) {
    await shotSecaoInteira(w, `${w}-projetos-inteira`, `${baseUrl}/`)
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
    const p = inv.projetos
    const pil = inv.vizinhas.pilares
    await rolarPara(p.y - h * 0.82)
    await shot(`${w}-projetos-entrando`)
    await rolarPara(p.y + p.h / 2 - h / 2)
    await shot(`${w}-projetos-centro`)
    await rolarPara(p.y + p.h - h * 0.18)
    await shot(`${w}-projetos-saindo`)
    /* passagem equipamentos → projetos */
    await rolarPara(p.y - h / 2)
    await shot(`${w}-T-equipamentos-projetos`)
    /* passagem projetos → pilares */
    if (pil) {
      await rolarPara(pil.y - h / 2)
      await shot(`${w}-T-projetos-pilares`)
    }
  }

  /* dossiê */
  for (const w of [390, 1440]) {
    await shotSecaoInteira(w, `${w}-dossier-cozinhas-industriais`, `${baseUrl}/solucoes/cozinhas-industriais`)
  }
}

await writeFile(path.join(outDir, arquivo), JSON.stringify(resultado, null, 1))
console.log('\nGravado em', path.join(outDir, arquivo))
/* `socket.close()` sozinho não encerra o processo: o handle do WebSocket fica aberto e o
   node só morre no `timeout` do runner — 400s por viewport, contra os ~40s que a medição
   realmente leva. A saída é explícita. */
socket.close()
process.exit(0)
