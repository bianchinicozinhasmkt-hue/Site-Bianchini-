/**
 * R1 — acessibilidade de `#equipamentos` e regression check dos congelados.
 *
 * Mesmos mecanismos de `secoes-r0d-2026-08-12/medicoes/rotas-e-a11y.mjs`:
 * `Emulation.setFocusEmulationEnabled` para que `:focus-visible` responda em
 * headless, e comparação de estilo computado antes/depois do foco — um alvo só
 * passa se **alguma** propriedade de sinal mudar (anel, sombra ou o
 * preenchimento do `::before`).
 *
 * O regression check não reaudita os congelados: confere as invariantes que R0
 * registrou ao selá-los, e nada mais.
 *
 * Uso: node a11y-e-regressao.mjs <saida.json> [baseUrl]
 */
import { writeFile } from 'node:fs/promises'

const saida = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const endpoint = 'http://127.0.0.1:9222'

const list = await fetch(`${endpoint}/json/list`).then((r) => r.json())
const target = list.find((i) => i.type === 'page')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => {
  socket.addEventListener('open', res, { once: true })
  socket.addEventListener('error', rej, { once: true })
})
let nextId = 0
const pending = new Map()
let consoleErrors = []
const waiters = []
socket.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id) {
    const w = pending.get(m.id)
    if (!w) return
    pending.delete(m.id)
    m.error ? w.reject(new Error(m.error.message)) : w.resolve(m.result)
    return
  }
  for (let i = waiters.length - 1; i >= 0; i--)
    if (waiters[i].method === m.method) {
      waiters[i].resolve(m.params)
      waiters.splice(i, 1)
    }
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error')
    consoleErrors.push(m.params.entry.text)
})
const cmd = (method, params = {}) => {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
const waitFor = (method) =>
  new Promise((resolve) => {
    waiters.push({ method, resolve })
    setTimeout(resolve, 15000)
  })
const evaluate = async (expression) => {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
  return r.result.value
}

await cmd('Log.enable')
await cmd('Runtime.enable')
await cmd('Page.enable')
await cmd('Emulation.setFocusEmulationEnabled', { enabled: true })

async function goto(url) {
  consoleErrors = []
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((e) => { e.loading = 'eager'; });
    return 1; })()`)
  await pause(600)
}

const resultado = { a11y: {}, regressao: {}, reducedMotion: {} }

/* ================= acessibilidade em #equipamentos ================= */
await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await goto(`${baseUrl}/`)

resultado.a11y.foco = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  const alvos = [];
  for (const a of sec.querySelectorAll('a, button')) {
    const r = a.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const antes = { outline: getComputedStyle(a).outlineWidth, sombra: getComputedStyle(a).boxShadow,
                    fill: getComputedStyle(a, '::before').transform };
    a.focus();
    const cs = getComputedStyle(a);
    const depois = { outline: cs.outlineWidth, sombra: cs.boxShadow, fill: getComputedStyle(a, '::before').transform };
    alvos.push({
      txt: (a.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40),
      href: a.getAttribute('href'),
      focoVisivel: antes.outline !== depois.outline || antes.sombra !== depois.sombra || antes.fill !== depois.fill,
      outline: depois.outline, preenchimento: depois.fill !== antes.fill,
    });
    a.blur();
  }
  return alvos;
})()`)

/* ordem de tabulação: a seção não pode inserir alvo focável invisível */
resultado.a11y.tabulaveis = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  return [...sec.querySelectorAll('a, button, input, select, textarea, [tabindex]')]
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { tag: el.tagName.toLowerCase(), txt: (el.innerText || '').trim().slice(0, 36),
               visivel: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none',
               tabindex: el.getAttribute('tabindex') };
    });
})()`)

/* estrutura semântica: heading, figure/figcaption, alt */
resultado.a11y.semantica = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  return {
    rotulada: sec.getAttribute('aria-labelledby'),
    tituloExiste: !!document.getElementById(sec.getAttribute('aria-labelledby')),
    headings: [...sec.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName + ': ' + h.innerText.trim().slice(0, 40)),
    figuras: [...sec.querySelectorAll('figure')].length,
    figcaptions: [...sec.querySelectorAll('figcaption')].length,
    imagensSemAlt: [...sec.querySelectorAll('img')].filter((i) => !i.getAttribute('alt')).length,
    alts: [...sec.querySelectorAll('img')].map((i) => i.getAttribute('alt').slice(0, 50)),
    gradientesOcultos: [...sec.querySelectorAll('[aria-hidden="true"]')].length,
  };
})()`)

/* alvo de toque em 390 */
await cmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await goto(`${baseUrl}/`)
resultado.a11y.toque = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  return [...sec.querySelectorAll('a, button')].map((a) => {
    const r = a.getBoundingClientRect();
    return { txt: (a.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40),
             w: +r.width.toFixed(1), h: +r.height.toFixed(1), ok: r.height >= 44 && r.width >= 44 };
  });
})()`)

/* ================= prefers-reduced-motion ================= */
await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
consoleErrors = []
const loaded = waitFor('Page.loadEventFired')
await cmd('Page.navigate', { url: `${baseUrl}/` })
await loaded
await pause(1400)
/* aqui NÃO se força `is-visible`: o teste é justamente se o conteúdo nasce visível */
resultado.reducedMotion = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  const invisiveis = [];
  for (const el of sec.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const op = parseFloat(cs.opacity);
    const clip = cs.clipPath;
    if (op < 0.9 && !el.hasAttribute('aria-hidden'))
      invisiveis.push({ motivo: 'opacidade ' + op, cls: (el.getAttribute('class') || '').slice(0, 70) });
    if (clip && clip !== 'none' && /inset\\((0px )?(100%|9[0-9]%)/.test(clip))
      invisiveis.push({ motivo: 'clip preso ' + clip, cls: (el.getAttribute('class') || '').slice(0, 70) });
  }
  const imgs = [...sec.querySelectorAll('img')];
  return {
    invisiveis,
    nInvisiveis: invisiveis.length,
    imagensCarregadas: imgs.filter((i) => i.complete && i.naturalWidth > 0).length + '/' + imgs.length,
    textosVisiveis: [...sec.querySelectorAll('p, h2, h3')].filter((e) => {
      const cs = getComputedStyle(e); return cs.display !== 'none' && parseFloat(cs.opacity) > 0.9;
    }).length,
    consoleErros: 0,
  };
})()`)
resultado.reducedMotion.consoleErros = consoleErrors.length
await cmd('Emulation.setEmulatedMedia', { features: [] })

/* ================= regression check dos congelados ================= */
await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await goto(`${baseUrl}/`)
resultado.regressao = await evaluate(`(() => {
  const out = {};
  const txt = (el) => (el ? (el.innerText || '').replace(/\\s+/g, ' ').trim() : null);

  /* HEADER — rótulo, destino, raio, sombra, altura da faixa (selo R0-C) */
  const header = document.querySelector('header');
  const cta = header?.querySelector('a[href*="intencao=equipamentos"]');
  const marca = header?.querySelector('a[href="/"], a[href="#top"]');
  out.header = {
    altura: header ? Math.round(header.getBoundingClientRect().height) : null,
    ctaRotulo: txt(cta),
    ctaDestino: cta?.getAttribute('href') ?? null,
    ctaRaio: cta ? getComputedStyle(cta).borderTopLeftRadius : null,
    ctaSombra: cta ? getComputedStyle(cta).boxShadow : null,
    marcaX: marca ? Math.round(marca.getBoundingClientRect().left) : null,
  };

  /* G-1b — a marca do cabeçalho no mesmo eixo do h1 da hero */
  const h1 = document.querySelector('h1');
  out.g1b = { marcaX: out.header.marcaX, h1X: h1 ? Math.round(h1.getBoundingClientRect().left) : null };
  out.g1b.alinhado = out.g1b.marcaX === out.g1b.h1X;

  /* HERO — h1, as três portas, altura da dobra */
  const hero = document.querySelector('main > *');
  out.hero = {
    h1: txt(h1),
    portas: [...document.querySelectorAll('a[href*="intencao="]')]
      .filter((a) => !a.closest('header'))
      .map((a) => txt(a).slice(0, 22))
      .slice(0, 3),
    alturaDobra: hero ? Math.round(hero.getBoundingClientRect().height) : null,
  };

  /* BUTTON SYSTEM (G-6) — nenhum botão fora da norma: raio 2px, sem sombra */
  const botoes = [...document.querySelectorAll('a[class*="inline-flex"], button[class*="inline-flex"]')]
    .filter((b) => { const r = b.getBoundingClientRect(); return r.width > 40 && r.height > 24; });
  out.botoes = {
    total: botoes.length,
    foraDaNorma: botoes.filter((b) => {
      const cs = getComputedStyle(b);
      const raio = parseFloat(cs.borderTopLeftRadius);
      return raio > 2.5 || (cs.boxShadow !== 'none' && !/inset/.test(cs.boxShadow));
    }).map((b) => ({ txt: txt(b).slice(0, 30), raio: getComputedStyle(b).borderTopLeftRadius, sombra: getComputedStyle(b).boxShadow })),
  };

  /* PILARES · TRANSIÇÃO · FECHAMENTO — as contas seladas em R0-D */
  const conta = (sec) => {
    if (!sec) return null;
    const vis = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0 && r.width > 0 && r.height > 0; };
    const blocos = [...sec.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].filter(vis)
      .map((e) => (e.innerText || '').replace(/\\s+/g, ' ').trim()).filter(Boolean);
    const amarelo = (c) => { const m = /rgba?\\((\\d+), ?(\\d+), ?(\\d+)(?:, ?([\\d.]+))?\\)/.exec(c || '');
      if (!m) return false; const [r, g, b] = [+m[1], +m[2], +m[3]]; const a = m[4] === undefined ? 1 : +m[4];
      return a >= 0.35 && r > 150 && g > 120 && b < 140 && r - b > 60 && g - b > 40; };
    let nAmarelos = 0;
    for (const el of sec.querySelectorAll('*')) {
      if (!vis(el)) continue;
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const proprio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (amarelo(cs.backgroundColor)) nAmarelos++;
      if (amarelo(cs.color) && proprio) nAmarelos++;
      for (const s of ['Top', 'Right', 'Bottom', 'Left'])
        if (parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none' && amarelo(cs['border' + s + 'Color'])) nAmarelos++;
    }
    return { h: Math.round(sec.getBoundingClientRect().height), blocos: blocos.length,
             caracteres: blocos.reduce((s, t) => s + t.length, 0), nAmarelos };
  };
  out.pilares = conta(document.getElementById('pilares'));
  out.transicao = conta(document.getElementById('transicao'));
  out.fechamento = conta(document.querySelector('section[aria-labelledby="cta-final-titulo"]'));

  return out;
})()`)
resultado.regressao.consoleErros = consoleErrors.length

/* ---------- relatório ---------- */
const f = resultado.a11y.foco
console.log('\n=== FOCO VISÍVEL em #equipamentos ===')
for (const a of f) console.log(`  ${a.focoVisivel ? 'PASS' : 'FAIL'}  "${a.txt}" → ${a.href}  outline=${a.outline}`)
console.log(`  ${f.filter((x) => x.focoVisivel).length}/${f.length} alvos com sinal computado`)

console.log('\n=== ALVO DE TOQUE em 390 ===')
for (const t of resultado.a11y.toque) console.log(`  ${t.ok ? 'PASS' : 'FAIL'}  "${t.txt}" ${t.w}x${t.h}`)

console.log('\n=== SEMÂNTICA ===')
console.log(' ', JSON.stringify(resultado.a11y.semantica, null, 1))

console.log('\n=== TABULÁVEIS (nenhum invisível pode existir) ===')
for (const t of resultado.a11y.tabulaveis)
  console.log(`  ${t.visivel ? 'visível' : 'INVISÍVEL'}  <${t.tag}> "${t.txt}" tabindex=${t.tabindex}`)

console.log('\n=== prefers-reduced-motion: reduce ===')
console.log(
  `  elementos invisíveis/presos: ${resultado.reducedMotion.nInvisiveis}  ` +
    `imagens ${resultado.reducedMotion.imagensCarregadas}  blocos de texto visíveis ${resultado.reducedMotion.textosVisiveis}  ` +
    `console=${resultado.reducedMotion.consoleErros}`,
)
if (resultado.reducedMotion.nInvisiveis) console.log('  ', resultado.reducedMotion.invisiveis)

console.log('\n=== REGRESSION CHECK DOS CONGELADOS ===')
const r = resultado.regressao
console.log(`  HEADER      altura=${r.header.altura} cta="${r.header.ctaRotulo}" → ${r.header.ctaDestino} raio=${r.header.ctaRaio} sombra=${r.header.ctaSombra}`)
console.log(`  G-1b        marca x=${r.g1b.marcaX} · h1 x=${r.g1b.h1X} → ${r.g1b.alinhado ? 'PASS' : 'FAIL'}`)
console.log(`  HERO        h1="${(r.hero.h1 || '').slice(0, 54)}" dobra=${r.hero.alturaDobra}px portas=${JSON.stringify(r.hero.portas)}`)
console.log(`  BUTTON      ${r.botoes.total} botões · fora da norma: ${r.botoes.foraDaNorma.length}`)
if (r.botoes.foraDaNorma.length) console.log('   ', r.botoes.foraDaNorma)
console.log(`  PILARES     ${r.pilares.caracteres}c / ${r.pilares.blocos}b · ${r.pilares.nAmarelos} amarelos · ${r.pilares.h}px`)
console.log(`  TRANSIÇÃO   ${r.transicao.caracteres}c / ${r.transicao.blocos}b · ${r.transicao.nAmarelos} amarelos · ${r.transicao.h}px`)
console.log(`  FECHAMENTO  ${r.fechamento.caracteres}c / ${r.fechamento.blocos}b · ${r.fechamento.nAmarelos} amarelos · ${r.fechamento.h}px`)
console.log(`  console na Home: ${r.consoleErros}`)

await writeFile(saida, JSON.stringify(resultado, null, 1))
console.log('\nGravado em', saida)
socket.close()
