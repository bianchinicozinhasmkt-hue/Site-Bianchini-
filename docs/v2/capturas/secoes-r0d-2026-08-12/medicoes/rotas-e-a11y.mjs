/**
 * R0-D — as 9 rotas internas, acessibilidade e o regression check dos congelados.
 *
 * `FinalCtaSection` veste a Home **e nove rotas internas** (doc 03, ficha 13: "alterar
 * este componente afeta 9 rotas internas — qualquer mudança de composição precisa ser
 * validada nelas também"). S-31 mexe no componente compartilhado, então a conta de
 * amarelo e a integridade do bloco são medidas em todas elas, não só na Home.
 *
 * Também mede, na Home:
 *   · foco visível e ordem de teclado nas três seções da rodada;
 *   · alvo de toque ≥44px nas ações das três seções;
 *   · `prefers-reduced-motion`: nada invisível, nenhuma máscara presa;
 *   · regression check de Header, Hero e sistema de botões — verificação, não auditoria.
 */
import { writeFile } from 'node:fs/promises'

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3210'
const out = process.argv[3]
const endpoint = 'http://127.0.0.1:9222'

const list = await fetch(`${endpoint}/json/list`).then((r) => r.json())
const target = list.find((i) => i.type === 'page')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res) => socket.addEventListener('open', res, { once: true }))

let nextId = 0
const pending = new Map()
const waiters = []
let consoleErrors = []
let httpFailures = []
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
  if (m.method === 'Runtime.exceptionThrown')
    consoleErrors.push(m.params.exceptionDetails.text ?? 'exception')
  if (m.method === 'Network.responseReceived' && m.params.response.status >= 400)
    httpFailures.push(`${m.params.response.status} ${m.params.response.url}`)
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
    setTimeout(resolve, 12000)
  })
const evaluate = async (expression) => {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
  return r.result.value
}

await cmd('Log.enable')
await cmd('Runtime.enable')
await cmd('Network.enable')
await cmd('Page.enable')
await cmd('Emulation.setFocusEmulationEnabled', { enabled: true })

async function goto(url) {
  consoleErrors = []
  httpFailures = []
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(
    `(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));
           document.querySelectorAll('img[loading="lazy"]').forEach(e=>{e.loading='eager'});return 1})()`,
  )
  await pause(500)
}

/* ---------- amarelo e integridade do bloco de fechamento, em qualquer rota ---------- */
const FECHAMENTO = `(() => {
  const sec = document.querySelector('section[aria-labelledby="cta-final-titulo"]');
  if (!sec) return null;
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const amarelo = (c) => {
    const m = /rgba?\\((\\d+), ?(\\d+), ?(\\d+)(?:, ?([\\d.]+))?\\)/.exec(c || '');
    if (!m) return false;
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    const a = m[4] === undefined ? 1 : +m[4];
    return a >= 0.35 && r > 150 && g > 120 && b < 140 && r - b > 60 && g - b > 40;
  };
  const amarelos = [];
  for (const el of sec.querySelectorAll('*')) {
    if (!vis(el)) continue;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const proprio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (amarelo(c.backgroundColor))
      amarelos.push({ via: 'fundo', area: Math.round(r.width * r.height), cls: (el.className || '').toString().slice(0, 50) });
    if (amarelo(c.color) && proprio)
      amarelos.push({ via: 'texto', area: Math.round(r.width * r.height), txt: el.innerText.trim().slice(0, 24) });
    for (const s of ['Top', 'Right', 'Bottom', 'Left'])
      if (parseFloat(c['border' + s + 'Width']) > 0 && c['border' + s + 'Style'] !== 'none' && amarelo(c['border' + s + 'Color']))
        amarelos.push({ via: 'borda', area: 0, cls: (el.className || '').toString().slice(0, 50) });
  }
  const acoes = [...sec.querySelectorAll('a')].filter(vis).map((a) => {
    const r = a.getBoundingClientRect();
    const c = getComputedStyle(a);
    return { txt: a.innerText.replace(/\\s+/g, ' ').trim().slice(0, 45), href: a.getAttribute('href'),
             w: +r.width.toFixed(1), h: +r.height.toFixed(1), bg: c.backgroundColor };
  });
  const rect = sec.getBoundingClientRect();
  return {
    h: Math.round(rect.height),
    nAmarelos: amarelos.length,
    amarelos,
    titulo: sec.querySelector('h2')?.innerText.trim().slice(0, 60),
    etiqueta: sec.querySelector('span,p')?.innerText.trim().slice(0, 30),
    corEtiqueta: (() => { const e = [...sec.querySelectorAll('span')].find((s) => /inline-flex/.test(s.className) && s.innerText.trim()); return e ? getComputedStyle(e).color : null; })(),
    acoes,
    auxiliar: [...sec.querySelectorAll('span')].map((s) => s.innerText.trim()).filter((t) => /RETORNO|Retorno/.test(t))[0]?.slice(0, 90) ?? null,
  };
})()`

const ROTAS = [
  '/',
  '/sobre',
  '/projetos',
  '/solucoes',
  '/solucoes/arquitetura',
  '/solucoes/cozinhas-industriais',
  '/solucoes/consultoria-para-restaurantes',
  '/solucoes/consultoria-para-fabricantes',
  '/linhas-de-produtos',
  '/leonardo-bianchini',
]

const resultado = { rotas: {}, a11y: {}, regressao: {} }

await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
for (const rota of ROTAS) {
  await goto(`${baseUrl}${rota}`)
  const f = await evaluate(FECHAMENTO)
  resultado.rotas[rota] = { ...f, consoleErrors: [...consoleErrors], httpFailures: [...httpFailures] }
  console.log(
    `${rota.padEnd(42)} amarelos=${f?.nAmarelos ?? '—'}  h=${f?.h ?? '—'}  acoes=${f?.acoes.length ?? '—'}  etiqueta=${f?.corEtiqueta ?? '—'}  console=${consoleErrors.length}`,
  )
}

/* ================= acessibilidade, na Home ================= */
await goto(`${baseUrl}/`)

/* foco visível: o anel/preenchimento tem de mudar algo computado ao focar */
resultado.a11y.foco = await evaluate(`(() => {
  const alvos = [];
  const secoes = { pilares: document.getElementById('pilares'),
                   transicao: document.getElementById('transicao'),
                   fechamento: document.querySelector('section[aria-labelledby="cta-final-titulo"]') };
  for (const [nome, sec] of Object.entries(secoes)) {
    for (const a of sec.querySelectorAll('a, button')) {
      const r = a.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const antes = { outline: getComputedStyle(a).outlineWidth, sombra: getComputedStyle(a).boxShadow,
                      fill: getComputedStyle(a, '::before').transform };
      a.focus();
      const cs = getComputedStyle(a);
      const depois = { outline: cs.outlineWidth, sombra: cs.boxShadow, fill: getComputedStyle(a, '::before').transform };
      const mudou = antes.outline !== depois.outline || antes.sombra !== depois.sombra || antes.fill !== depois.fill;
      alvos.push({ secao: nome, txt: a.innerText.replace(/\\s+/g, ' ').trim().slice(0, 34),
                   focoVisivel: mudou, outline: depois.outline, sombra: depois.sombra !== 'none',
                   w: +r.width.toFixed(1), h: +r.height.toFixed(1) });
      a.blur();
    }
  }
  return alvos;
})()`)

/* alvo de toque em 390 */
await cmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await goto(`${baseUrl}/`)
resultado.a11y.toque = await evaluate(`(() => {
  const secoes = { pilares: document.getElementById('pilares'),
                   transicao: document.getElementById('transicao'),
                   fechamento: document.querySelector('section[aria-labelledby="cta-final-titulo"]') };
  const out = [];
  for (const [nome, sec] of Object.entries(secoes))
    for (const a of sec.querySelectorAll('a, button')) {
      const r = a.getBoundingClientRect();
      if (r.width < 4) continue;
      out.push({ secao: nome, txt: a.innerText.replace(/\\s+/g, ' ').trim().slice(0, 34),
                 w: +r.width.toFixed(1), h: +r.height.toFixed(1), ok: r.height >= 44 });
    }
  return out;
})()`)

/* reduced motion: nada invisível, nenhuma máscara presa */
await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
const loaded = waitFor('Page.loadEventFired')
await cmd('Page.navigate', { url: `${baseUrl}/` })
await loaded
await pause(1400)
resultado.a11y.reducedMotion = await evaluate(`(() => {
  const secoes = { pilares: document.getElementById('pilares'),
                   transicao: document.getElementById('transicao'),
                   fechamento: document.querySelector('section[aria-labelledby="cta-final-titulo"]') };
  const invisiveis = [];
  for (const [nome, sec] of Object.entries(secoes))
    for (const el of sec.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const temTexto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!temTexto && el.tagName !== 'IMG') continue;
      if (parseFloat(cs.opacity) < 0.05 || cs.visibility === 'hidden' ||
          (cs.clipPath !== 'none' && /inset\\(.*100%/.test(cs.clipPath)) || r.height === 0)
        invisiveis.push({ secao: nome, tag: el.tagName.toLowerCase(),
                          txt: (el.innerText || el.getAttribute('alt') || '').trim().slice(0, 34),
                          opacity: cs.opacity, clip: cs.clipPath, h: +r.height.toFixed(1) });
    }
  return invisiveis;
})()`)
await cmd('Emulation.setEmulatedMedia', { features: [] })

/* ================= regression check dos congelados ================= */
await goto(`${baseUrl}/`)
resultado.regressao = await evaluate(`(() => {
  const cta = document.querySelector('header a[href*="contato"]');
  const marca = document.querySelector('header a[href="/"]');
  const h1 = document.querySelector('#hero-titulo');
  const cs = cta ? getComputedStyle(cta) : null;
  /* botões do sistema: reconhecidos por construção (::before de preenchimento) */
  const botoes = [];
  for (const el of document.querySelectorAll('a, button')) {
    const b = getComputedStyle(el, '::before');
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    if (!(b.content !== 'none' && b.position === 'absolute' && parseFloat(b.zIndex) < 0)) continue;
    botoes.push({ txt: el.innerText.replace(/\\s+/g, ' ').trim().slice(0, 30),
                  raio: c.borderTopLeftRadius, sombra: c.boxShadow,
                  origem: b.transformOrigin, transform: b.transform });
  }
  const foraDaNorma = botoes.filter((b) => b.raio !== '2px' || b.sombra !== 'none');
  return {
    header: { ctaLabel: cta?.innerText.trim(), ctaHref: cta?.getAttribute('href'),
              raio: cs?.borderTopLeftRadius, sombra: cs?.boxShadow,
              alturaFaixa: Math.round(document.querySelector('header').getBoundingClientRect().height) },
    guia: { xMarca: marca ? +marca.getBoundingClientRect().left.toFixed(1) : null,
            xH1: h1 ? +h1.getBoundingClientRect().left.toFixed(1) : null },
    hero: { h1: h1?.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60),
            portas: document.querySelectorAll('[class*="door"], [data-porta]').length,
            alturaDobra: Math.round((document.querySelector('.hero-fold, [class*="stage"]') ?? document.body).getBoundingClientRect().height) },
    botoes: { total: botoes.length, foraDaNorma: foraDaNorma.length, exemplos: foraDaNorma.slice(0, 4) },
  };
})()`)

console.log('\n=== A11Y ===')
console.log('foco sem sinal visível:', resultado.a11y.foco.filter((f) => !f.focoVisivel).length, '/', resultado.a11y.foco.length)
console.log('toque <44px em 390   :', resultado.a11y.toque.filter((t) => !t.ok).map((t) => `${t.secao}:${t.txt}=${t.h}`).join(', ') || 'nenhum')
console.log('invisível c/ reduced :', resultado.a11y.reducedMotion.length)
console.log('\n=== REGRESSÃO ===')
console.log('header CTA :', resultado.regressao.header.ctaLabel, '→', resultado.regressao.header.ctaHref, '| raio', resultado.regressao.header.raio, '| sombra', resultado.regressao.header.sombra)
console.log('guia       : marca x=' + resultado.regressao.guia.xMarca + '  h1 x=' + resultado.regressao.guia.xH1)
console.log('hero h1    :', resultado.regressao.hero.h1)
console.log('botões     :', resultado.regressao.botoes.total, 'renderizados,', resultado.regressao.botoes.foraDaNorma, 'fora da norma')
if (resultado.regressao.botoes.exemplos.length) console.log(resultado.regressao.botoes.exemplos)

if (out) await writeFile(out, JSON.stringify(resultado, null, 1))
socket.close()
