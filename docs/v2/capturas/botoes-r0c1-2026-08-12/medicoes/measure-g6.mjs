/**
 * R0-C.1 — harness de conformidade do sistema global de botões (G-6).
 *
 * Uso: node measure-g6.mjs <outDir> <baseUrl> [--shots]
 *
 * Mede **todo botão renderizado** em cada rota da matriz representativa: raio,
 * mecanismo de preenchimento (transform, origem, duração, curva), sombra, transição de
 * pressão e as caixas em repouso × hover × active — a última é o teste de "não muda de
 * tamanho ao interagir".
 *
 * As lições de instrumento de R0-C valem aqui e estão aplicadas:
 *   · `Emulation.setFocusEmulationEnabled` — sem ela o `Tab` não move o foco em headless;
 *   · `keyDown` com `text`, não `rawKeyDown` — só o primeiro executa a ação padrão;
 *   · o `active` é medido **por último** em cada alvo, porque soltar o botão navega;
 *   · o CDP Input degrada depois de muitas navegações no mesmo processo — esta passada
 *     roda em navegador recém-aberto.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const wantShots = process.argv.includes('--shots')
const endpoint = 'http://127.0.0.1:9222'

await mkdir(outDir, { recursive: true })

/* A matriz representativa do briefing §14, mais as rotas que cobrem cada papel. */
const ROTAS = [
  { url: '/', nome: 'home' },
  { url: '/contato', nome: 'contato' },
  { url: '/solucoes/cozinhas-industriais', nome: 'solucoes-cozinhas' },
  { url: '/projetos', nome: 'projetos' },
  { url: '/linhas-de-produtos', nome: 'linhas' },
  { url: '/obrigado', nome: 'obrigado' },
]

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
    throw new Error((r.exceptionDetails.text ?? '') + ' :: ' + (r.exceptionDetails.exception?.description ?? ''))
  return r.result.value
}

await cmd('Log.enable')
await cmd('Runtime.enable')
await cmd('Network.enable')
await cmd('Page.enable')
await cmd('Emulation.setFocusEmulationEnabled', { enabled: true })

const setViewport = (w, h) =>
  cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false })

/*
  ---------- A FOLHA DE ESTILO É CONFERIDA, NÃO PRESUMIDA ----------

  Um `next start` que continua no ar depois de um `npm run build` passa a servir HTML de
  um build e assets de outro: o `<link>` do CSS responde **400** e a página renderiza sem
  estilo nenhum. `document.styleSheets` continua contando as folhas, então a checagem
  óbvia não pega. Medido assim, um botão de 243 × 50 sai como 161 × 17, a fonte cai para
  Times New Roman e a conclusão sobre o produto fica errada.

  O sinal barato de "CSS aplicado" é a família do rótulo, que no sistema é Oswald. Sem
  ela, a passada aborta em vez de gravar evidência inválida.
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
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(900)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(600)
  const estilado = await evaluate(
    `(() => { const el = document.querySelector('header a, main a.isolate, main button');
      return el ? /Oswald|Manrope/i.test(getComputedStyle(el).fontFamily) : true; })()`,
  )
  if (!estilado) throw new Error(`CSS não aplicado em ${url} — build servido está dessincronizado`)
}

/* ================= inventário renderizado ================= */
/**
 * Colhe todo botão do sistema presente na página. O reconhecimento é por
 * **construção**, não por classe: um `a`/`button` cujo `::before` é a camada de
 * preenchimento (`inset: 0`, `z-index` negativo) é um botão do sistema.
 */
const COLHER = `(() => {
  const round = (n) => (n == null ? null : +n.toFixed(1));
  const alvos = [];
  for (const el of document.querySelectorAll('a, button')) {
    const b = getComputedStyle(el, '::before');
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    const temFill = b.content !== 'none' && b.position === 'absolute' && parseFloat(b.zIndex) < 0;
    if (!temFill) continue;
    /* papel: derivado da superfície e da borda, não do nome da classe */
    const bg = cs.backgroundColor;
    const borda = cs.borderTopWidth !== '0px';
    const dentroHeader = !!el.closest('header');
    const temGlifo = !!el.querySelector('svg') && /whats/i.test(el.className + ' ' + el.innerHTML.slice(0, 400));
    let papel = 'PRIMARY';
    if (dentroHeader) papel = 'NAV CTA';
    else if (temGlifo) papel = 'WHATSAPP';
    else if (borda && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) papel = 'SECONDARY';
    alvos.push({
      papel,
      texto: (el.textContent || '').trim().slice(0, 34),
      tag: el.tagName,
      href: el.getAttribute('href'),
      x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height),
      raio: cs.borderRadius,
      sombra: cs.boxShadow,
      bg,
      cor: cs.color,
      borda: borda ? cs.borderTopWidth + ' ' + cs.borderTopColor : 'nenhuma',
      transicao: cs.transitionProperty + ' | ' + cs.transitionDuration + ' | ' + cs.transitionTimingFunction,
      /*
        A caixa do pseudo-elemento e a do botao nao sao a mesma: com inset 0, o
        preenchimento ocupa a caixa de recuo, isto e, altura menos as duas bordas.
        Comparar a origem do transform com a altura do getBoundingClientRect (que e
        border-box) acusa divergencia em todo botao contornado, e foi o que a primeira
        passada fez. O alvo correto e este.
      */
      alturaFill: round(r.height - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth)),
      fillTransform: b.transform,
      fillOrigem: b.transformOrigin,
      fillDuracao: b.transitionDuration,
      fillCurva: b.transitionTimingFunction,
      fillBg: b.backgroundColor,
    });
  }
  return alvos;
})()`

/* ================= estados de um alvo ================= */
async function medirEstados(indice) {
  const box = await evaluate(
    `(() => {
      const el = window.__alvos[${indice}];
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
    })()`,
  )
  const { x, y } = JSON.parse(box)
  const ler = (estado) =>
    evaluate(
      `(() => {
        const el = window.__alvos[${indice}];
        const cs = getComputedStyle(el), b = getComputedStyle(el, '::before');
        const r = el.getBoundingClientRect();
        return JSON.stringify({ estado: '${estado}',
          w: +r.width.toFixed(1), h: +r.height.toFixed(1),
          fill: b.transform, sombra: cs.boxShadow, transform: cs.transform,
          cor: cs.color, bg: cs.backgroundColor, borda: cs.borderTopColor });
      })()`,
    )

  const out = []
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 0 })
  await pause(420)
  out.push(JSON.parse(await ler('repouso')))

  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await pause(560)
  out.push(JSON.parse(await ler('hover')))

  /* foco por teclado: `.focus()` depois de uma tecla real, para valer `:focus-visible` */
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 0 })
  await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', text: '\t', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
  await pause(120)
  await evaluate(`(()=>{window.__alvos[${indice}].focus();return 1})()`)
  await pause(500)
  const foco = JSON.parse(await ler('focus-visible'))
  foco.focusVisible = await evaluate(`window.__alvos[${indice}].matches(':focus-visible')`)
  out.push(foco)
  await evaluate(`(()=>{window.__alvos[${indice}].blur();return 1})()`)

  /*
    ---------- A PRESSÃO NÃO PODE VIRAR CLIQUE ----------

    Soltar o botão **sobre o alvo** dispara um clique de verdade, e com `next/link` a
    navegação é do cliente: o contexto JS sobrevive, mas a árvore é trocada. Na primeira
    passada isso destacou todos os alvos seguintes da mesma rota — `window.__alvos`
    continuava apontando para nós órfãos e cada medição saía `0×0`. O sintoma parecia
    "botão sem caixa"; a causa era o próprio instrumento navegando.

    Um clique só existe se pressionar e soltar caírem no mesmo elemento. Aqui o release
    acontece longe do alvo, então a pressão é medida e nada é acionado.
  */
  /*
    O ponto é recalculado aqui, e não reaproveitado do começo: `.focus()` rola o
    elemento para a vista por conta própria, então o `y` medido antes do foco já não
    vale. Quando isso passou despercebido, a pressão caiu fora do alvo e o estado
    saiu sem `:active` — parecia botão sem pressão, era mira desatualizada.
  */
  const alvo = JSON.parse(
    await evaluate(
      `(() => { const r = window.__alvos[${indice}].getBoundingClientRect();
        return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 }); })()`,
    ),
  )
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: alvo.x, y: alvo.y, buttons: 0 })
  await pause(300)
  await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: alvo.x, y: alvo.y, button: 'left', clickCount: 1, buttons: 1 })
  await pause(300)
  out.push(JSON.parse(await ler('active')))
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 1 })
  await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 3, y: 3, button: 'left', clickCount: 1, buttons: 0 })
  await pause(200)
  const rota = await evaluate(`location.pathname + location.search`)
  out.push({ estado: 'rota após medir', rota })
  return out
}

/* ================= execução ================= */
const inventario = []
const estados = []
const notes = { console: [], http: [] }

for (const vw of [1440, 390]) {
  const h = vw === 1440 ? 900 : 844
  for (const rota of ROTAS) {
    await setViewport(vw, h)
    await goto(baseUrl + rota.url)
    const alvos = await evaluate(COLHER)
    await evaluate(
      `(() => {
        window.__alvos = [...document.querySelectorAll('a, button')].filter((el) => {
          const b = getComputedStyle(el, '::before');
          const r = el.getBoundingClientRect();
          return r.width >= 8 && r.height >= 8 && b.content !== 'none' &&
                 b.position === 'absolute' && parseFloat(b.zIndex) < 0;
        });
        return window.__alvos.length;
      })()`,
    )
    for (const a of alvos) inventario.push({ viewport: vw, rota: rota.nome, ...a })
    for (const e of consoleErrors) notes.console.push(`${rota.nome} ${vw}: ${e}`)
    for (const e of httpFailures) notes.http.push(`${rota.nome} ${vw}: ${e}`)

    const origemNaBase = (a) =>
      Math.abs(parseFloat(a.fillOrigem.split(' ')[1]) - a.alturaFill) < 0.06
    const fora = alvos.filter(
      (a) =>
        a.raio !== '2px' ||
        a.sombra !== 'none' ||
        !origemNaBase(a) ||
        a.fillDuracao !== '0.22s' ||
        a.fillCurva !== 'cubic-bezier(0.4, 0, 0.2, 1)' ||
        a.fillTransform !== 'matrix(1, 0, 0, 0, 0, 0)',
    )
    console.log(
      `${String(vw).padStart(4)} ${rota.nome.padEnd(18)} | ${alvos.length} botões | ` +
        `papéis ${[...new Set(alvos.map((a) => a.papel))].join(',')} | fora da norma: ${fora.length}`,
    )
    for (const f of fora)
      console.log(
        `      ⚠ "${f.texto}" raio ${f.raio} sombra ${f.sombra} origem ${f.fillOrigem} dur ${f.fillDuracao}`,
      )

    /* estados: só em 1440 e só um alvo por papel presente na rota */
    if (vw === 1440) {
      const vistos = new Set()
      for (let i = 0; i < alvos.length; i++) {
        if (vistos.has(alvos[i].papel)) continue
        vistos.add(alvos[i].papel)
        const s = await medirEstados(i)
        estados.push({ rota: rota.nome, papel: alvos[i].papel, texto: alvos[i].texto, estados: s })
        const rep = s.find((e) => e.estado === 'repouso')
        const hov = s.find((e) => e.estado === 'hover')
        const foc = s.find((e) => e.estado === 'focus-visible')
        const act = s.find((e) => e.estado === 'active')
        console.log(
          `      ${alvos[i].papel.padEnd(10)} "${alvos[i].texto.slice(0, 22)}" | ` +
            `caixa ${rep.w}×${rep.h} → hover ${hov.w}×${hov.h} (Δ ${(hov.w - rep.w).toFixed(1)}) | ` +
            `fill ${rep.fill} → ${hov.fill} | foco=hover? ${foc.fill === hov.fill} | ` +
            `fv ${foc.focusVisible} | press ${act.transform}`,
        )
      }
    }
  }
}

await writeFile(path.join(outDir, 'inventario.json'), JSON.stringify(inventario, null, 2))
await writeFile(path.join(outDir, 'estados.json'), JSON.stringify(estados, null, 2))

/* ================= regressão da hero congelada ================= */
await setViewport(1440, 900)
await goto(baseUrl + '/')
const hero = await evaluate(
  `(() => {
    const p = document.querySelector('[data-hero-cta]');
    const w = document.querySelector('[data-hero-cta-wa]');
    const portas = [...document.querySelectorAll('[aria-label="Frentes da Bianchini"] [role="tab"]')];
    const r = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      const bf = getComputedStyle(el, '::before');
      return { w: +b.width.toFixed(1), h: +b.height.toFixed(1), x: +b.x.toFixed(1), y: +b.y.toFixed(1),
        raio: cs.borderRadius, sombra: cs.boxShadow, bg: cs.backgroundColor,
        fill: bf.transform, fillOrigem: bf.transformOrigin, fillDur: bf.transitionDuration }; };
    return JSON.stringify({
      primario: r(p), whatsapp: r(w),
      razao: +(p.getBoundingClientRect().width / w.getBoundingClientRect().width).toFixed(3),
      portas: portas.map((b) => { const bb = b.getBoundingClientRect(); const bf = getComputedStyle(b, '::before');
        return { w: +bb.width.toFixed(1), h: +bb.height.toFixed(1), y: +bb.y.toFixed(1),
          sombra: bf.boxShadow, borderTop: bf.borderTopWidth + ' ' + bf.borderTopColor }; }),
      razaoPortas: +(portas[0].getBoundingClientRect().width / portas[1].getBoundingClientRect().width).toFixed(3),
    });
  })()`,
)
await writeFile(path.join(outDir, 'hero-regressao.json'), hero)
console.log('\nHERO (congelada):', hero)

/* ================= NAV CTA por viewport ================= */
const nav = []
for (const [w, h] of [[1024, 768], [1366, 768], [1440, 900], [1600, 900], [1920, 1080]]) {
  await setViewport(w, h)
  await goto(baseUrl + '/')
  nav.push(
    JSON.parse(
      await evaluate(
        `(() => {
          const el = document.querySelector('header a[href*="/contato"]');
          const r = el.getBoundingClientRect();
          const nav = document.querySelector('header nav[aria-label="Menu principal"]');
          const nr = nav.getBoundingClientRect();
          const marca = document.querySelector('header img, header svg');
          const h1 = document.querySelector('main h1');
          return JSON.stringify({ viewport: ${w},
            largura: +r.width.toFixed(1), altura: +r.height.toFixed(1), x: +r.x.toFixed(1),
            temIcone: !!el.querySelector('svg'),
            raio: getComputedStyle(el).borderRadius,
            vaoNavCta: +(r.left - nr.right).toFixed(1),
            faixa: +document.querySelector('header').getBoundingClientRect().height.toFixed(1),
            marcaX: +marca.getBoundingClientRect().left.toFixed(1),
            h1X: +h1.getBoundingClientRect().left.toFixed(1),
            folgaDireita: +(document.documentElement.clientWidth - r.right).toFixed(1),
            overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth) });
        })()`,
      ),
    ),
  )
}
await writeFile(path.join(outDir, 'nav-cta.json'), JSON.stringify(nav, null, 2))
console.log('\nNAV CTA:')
for (const n of nav)
  console.log(
    `  ${String(n.viewport).padStart(4)} | ${n.largura}×${n.altura} @x${n.x} | ícone ${n.temIcone} | raio ${n.raio} | ` +
      `vão nav↔cta ${n.vaoNavCta} | folga direita ${n.folgaDireita} | faixa ${n.faixa} | marca=h1 ${n.marcaX === n.h1X} | ovf ${n.overflow}`,
  )

/* ================= responsividade e saúde ================= */
const saude = []
for (const [w, h] of [[320, 568], [390, 844], [768, 1024], [1024, 768], [1366, 768], [1440, 900], [1600, 900], [1920, 1080]]) {
  await setViewport(w, h)
  await goto(baseUrl + '/')
  saude.push(
    JSON.parse(
      await evaluate(
        `(() => {
          const de = document.documentElement;
          return JSON.stringify({ viewport: ${w},
            overflow: Math.max(0, de.scrollWidth - de.clientWidth),
            imagens: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
            hrefVazio: [...document.querySelectorAll('a')].filter(a => { const x = a.getAttribute('href'); return !x || x === '#' || x.trim() === ''; }).length,
            ancoras: [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')]
              .map(a => a.getAttribute('href').replace(/^\\//, ''))
              .filter(x => x.length > 1)
              .filter(x => !document.querySelector('[id="' + CSS.escape(x.slice(1)) + '"]')).length });
        })()`,
      ),
    ),
  )
  for (const e of consoleErrors) notes.console.push(`home ${w}: ${e}`)
  for (const e of httpFailures) notes.http.push(`home ${w}: ${e}`)
}
await writeFile(path.join(outDir, 'saude.json'), JSON.stringify({ saude, notes }, null, 2))
console.log('\nSAÚDE:', saude.map((s) => `${s.viewport}:ovf${s.overflow}/img${s.imagens}/href${s.hrefVazio}/anc${s.ancoras}`).join(' '))

/* ================= reduced-motion ================= */
await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await setViewport(1440, 900)
await goto(baseUrl + '/')
const reduzido = await evaluate(
  `(() => {
    const alvos = [...document.querySelectorAll('a, button')].filter((el) => {
      const b = getComputedStyle(el, '::before'); const r = el.getBoundingClientRect();
      return r.width >= 8 && r.height >= 8 && b.content !== 'none' && b.position === 'absolute' && parseFloat(b.zIndex) < 0;
    });
    return JSON.stringify(alvos.slice(0, 4).map((el) => ({
      texto: (el.textContent || '').trim().slice(0, 26),
      transicao: getComputedStyle(el).transitionDuration,
      fill: getComputedStyle(el, '::before').transitionDuration,
      visivel: getComputedStyle(el).visibility + ' ' + getComputedStyle(el).opacity })));
  })()`,
)
await cmd('Emulation.setEmulatedMedia', { features: [] })
await writeFile(path.join(outDir, 'reduced-motion.json'), reduzido)
console.log('\nREDUCED-MOTION:', reduzido)

/* ================= capturas ================= */
if (wantShots) {
  const tirar = async (nome, w, h, seletor, margem = 26) => {
    await setViewport(w, h)
    await goto(baseUrl + (seletor.url ?? '/'))
    if (seletor.css) {
      /*
        O `clip` de `Page.captureScreenshot` é em coordenadas **de página**, e
        `getBoundingClientRect()` devolve coordenadas de viewport. Enquanto a página está
        no topo os dois coincidem — foi por isso que os recortes das rodadas anteriores
        funcionaram. Aqui há `scrollIntoView` antes, então a conversão é obrigatória; sem
        ela o recorte aponta para outro trecho do documento e a captura sai vazia.
      */
      const c = await evaluate(
        `(() => { const el = document.querySelector('${seletor.css}');
          if (!el) return 'null';
          el.scrollIntoView({ block: 'center' });
          const r = el.getBoundingClientRect();
          return JSON.stringify({ x: Math.max(0, r.x + window.scrollX - ${margem}),
            y: Math.max(0, r.y + window.scrollY - ${margem}),
            width: Math.min(${w}, r.width + ${margem * 2}), height: r.height + ${margem * 2} }); })()`,
      )
      if (c === 'null') return console.log('  (sem alvo)', nome)
      await pause(500)
      const shot = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...JSON.parse(c), scale: 2 } })
      await writeFile(path.join(outDir, '..', `${nome}.png`), Buffer.from(shot.data, 'base64'))
    } else {
      const shot = await cmd('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: w, height: Math.min(h, seletor.altura ?? h), scale: 1 },
      })
      await writeFile(path.join(outDir, '..', `${nome}.png`), Buffer.from(shot.data, 'base64'))
    }
    console.log('  captura', nome)
  }

  await tirar('1440-header', 1440, 900, { url: '/', altura: 300 })
  await tirar('1440-hero-ctas', 1440, 900, { url: '/', css: '[data-hero-cta]' }, 40)
  await tirar('1440-final-cta', 1440, 900, { url: '/', css: 'a[href*="intencao=equipamentos"][class*="isolate"]' }, 40)
  await tirar('1440-contato-botoes', 1440, 900, { url: '/contato', css: 'form button[type="submit"]' }, 40)
  await tirar('1440-solucoes-fechamento', 1440, 900, { url: '/solucoes/cozinhas-industriais', css: 'a[href*="intencao"]' }, 40)
  await tirar('390-header', 390, 844, { url: '/', altura: 200 })
  await tirar('390-hero-ctas', 390, 844, { url: '/', css: '[data-hero-cta]' }, 20)
  await tirar('390-final-cta', 390, 844, { url: '/', css: 'a[href*="intencao=equipamentos"][class*="isolate"]' }, 20)

  /* close dos quatro estados do PRIMARY de seção, em 1440 */
  await setViewport(1440, 900)
  await goto(baseUrl + '/contato')
  const alvoCss = 'form button[type="submit"]'
  /* Coordenadas de página, não de viewport — ver a nota em `tirar`, acima. */
  const clip = async () => {
    const c = await evaluate(
      `(() => { const el = document.querySelector('${alvoCss}');
        const r = el.getBoundingClientRect();
        return JSON.stringify({ x: Math.max(0, r.x + window.scrollX - 26), y: Math.max(0, r.y + window.scrollY - 26),
          width: r.width + 52, height: r.height + 52 }); })()`,
    )
    return JSON.parse(c)
  }
  const ponto = async () => {
    const c = await evaluate(
      `(() => { const r = document.querySelector('${alvoCss}').getBoundingClientRect();
        return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 }); })()`,
    )
    return JSON.parse(c)
  }
  const snap = async (nome) => {
    const shot = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...(await clip()), scale: 3 } })
    await writeFile(path.join(outDir, '..', `1440-primary-${nome}.png`), Buffer.from(shot.data, 'base64'))
  }
  await evaluate()
  await pause(600)
  /*
    Duas coordenadas diferentes para o mesmo botão, e confundi-las é o erro fácil:
    o **recorte** da captura é em coordenadas de página e o **ponteiro** em coordenadas
    de viewport. Por isso o alvo é trazido à vista uma vez, aqui, e só depois os dois
    são lidos — sem isso o clique caía fora da janela e a captura saía vazia.
  */
  await evaluate(
    `(()=>{document.querySelector('${alvoCss}').scrollIntoView({block:'center'});return 1})()`,
  )
  await pause(700)
  const { x, y } = await ponto()
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 0 })
  await pause(500)
  await snap('default')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await pause(700)
  await snap('hover')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 0 })
  await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', text: '\t', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
  await evaluate(`(()=>{document.querySelector('${alvoCss}').focus();return 1})()`)
  await pause(600)
  await snap('focus')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1, buttons: 1 })
  await pause(300)
  await snap('active')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1, buttons: 0 })
  console.log('  capturas de estado')
}

console.log('\nconsole errors:', notes.console.length)
console.log('http >=400:', [...new Set(notes.http)].length)
if (notes.console.length) console.log(notes.console.slice(0, 6))
if (notes.http.length) console.log([...new Set(notes.http)].slice(0, 6))
socket.close()
