/**
 * R0-C — harness de medição do cabeçalho (deltas H-1 a H-4).
 *
 * Uso: node measure-r0c.mjs <outDir> <baseUrl> [--shots]
 *
 * Deriva do harness de R0-B: mesma conexão CDP crua, `deviceScaleFactor: 1`,
 * `--hide-scrollbars`, e a mesma metodologia de contraste — pior pixel real sob a caixa
 * do texto, com **só** o texto medido escondido, e alpha do texto composto sobre o fundo
 * antes da razão.
 *
 * O que é novo aqui: os estados do CTA são medidos **um a um** (default, hover,
 * focus-visible, active), porque H-3 troca o mecanismo de preenchimento e H-4 remove a
 * sombra — e nenhuma das duas coisas pode derrubar o contraste do rótulo.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const wantShots = process.argv.includes('--shots')
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
/*
  Sem isto o Chromium headless trata a página como não-focada e descarta a **ação
  padrão** do `Tab` — o evento chega ao DOM, mas o foco não anda. O sintoma é uma
  varredura que nunca alcança o CTA e uma conclusão falsa de "focus-visible
  inalcançável por teclado".
*/
await cmd('Emulation.setFocusEmulationEnabled', { enabled: true })

const setViewport = (w, h) =>
  cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false })

async function goto(url) {
  consoleErrors = []
  httpFailures = []
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';return 1})()`)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(400)
}

/* O CTA persistente: o do cabeçalho no desktop, o do painel no telefone. */
const CTA_DESKTOP = `header a[href*="/contato"]`
const CTA_MENU = `[id] a[href*="/contato"]`

/* ================= layout do cabeçalho ================= */
const MEASURE = `(() => {
  const px = (v) => (v ? parseFloat(v) : null);
  const de = document.documentElement;
  const round = (n) => (n == null ? null : +n.toFixed(1));

  const header = document.querySelector('header');
  const shell = header.querySelector('.container-shell');
  const marca = header.querySelector('img, svg');
  const nav = header.querySelector('nav[aria-label="Menu principal"]');
  const links = nav ? [...nav.querySelectorAll('a')] : [];
  const cta = document.querySelector('${CTA_DESKTOP}');
  const gatilho = header.querySelector('button[aria-expanded]');
  const h1 = document.querySelector('main h1');

  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect();
    return { x: round(b.x), y: round(b.y), w: round(b.width), h: round(b.height), right: round(b.right), bottom: round(b.bottom) }; };

  const ctaCs = cta ? getComputedStyle(cta) : null;
  const ctaBefore = cta ? getComputedStyle(cta, '::before') : null;

  /* quebra de linha do rótulo: scrollWidth > clientWidth = comprimido/cortado */
  const rotulo = cta ? [...cta.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()) : null;

  const overflowDoc = Math.max(0, de.scrollWidth - de.clientWidth);
  const overflowBody = Math.max(0, document.body.scrollWidth - de.clientWidth);
  let worst = null;
  for (const el of document.querySelectorAll('body *')) {
    const b = el.getBoundingClientRect();
    if (b.width > 0 && b.height > 0 && b.right > de.clientWidth + 1) {
      if (!worst || b.right > worst.right) {
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString();
        worst = { right: round(b.right), tag: el.tagName, cls: cls.slice(0, 90) };
      }
    }
  }

  /* sobreposição entre navegação e CTA — o teste de §14 do briefing */
  const navR = nav ? nav.getBoundingClientRect() : null;
  const ctaR = cta ? cta.getBoundingClientRect() : null;
  const vaoNavCta = navR && ctaR && navR.width > 0 && ctaR.width > 0 ? round(ctaR.left - navR.right) : null;

  const brokenImgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).length;
  const emptyHref = [...document.querySelectorAll('a')].filter(a => {
    const h = a.getAttribute('href'); return !h || h === '#' || h.trim() === '';
  }).length;
  const brokenAnchors = [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')]
    .map(a => a.getAttribute('href').replace(/^\\//, ''))
    .filter(h => h.length > 1)
    .filter(h => !document.querySelector('[id="' + CSS.escape(h.slice(1)) + '"]'));

  return {
    rootW: de.clientWidth,
    headerH: round(header.getBoundingClientRect().height),
    headerHeightToken: getComputedStyle(de).getPropertyValue('--header-height').trim(),
    shell: r(shell),
    guiaCabecalho: shell ? round(shell.getBoundingClientRect().left + px(getComputedStyle(shell).paddingLeft)) : null,
    h1x: h1 ? round(h1.getBoundingClientRect().left) : null,
    marca: r(marca),
    nav: r(nav),
    navLinks: links.length,
    navLinhas: links.length ? new Set(links.map(a => Math.round(a.getBoundingClientRect().y))).size : 0,
    cta: r(cta),
    ctaHref: cta ? cta.getAttribute('href') : null,
    ctaTexto: cta ? cta.textContent.trim() : null,
    ctaRadius: ctaCs ? ctaCs.borderRadius : null,
    ctaBg: ctaCs ? ctaCs.backgroundColor : null,
    ctaColor: ctaCs ? ctaCs.color : null,
    ctaShadow: ctaCs ? ctaCs.boxShadow : null,
    ctaTransform: ctaCs ? ctaCs.transform : null,
    ctaPadX: ctaCs ? px(ctaCs.paddingLeft) : null,
    ctaFont: ctaCs ? ctaCs.fontSize + ' ' + ctaCs.fontWeight + ' ' + ctaCs.fontFamily.split(',')[0] : null,
    ctaWhiteSpace: ctaCs ? ctaCs.whiteSpace : null,
    ctaLinhas: cta && rotulo ? Math.round(cta.getBoundingClientRect().height) : null,
    fillTransform: ctaBefore ? ctaBefore.transform : null,
    fillOrigin: ctaBefore ? ctaBefore.transformOrigin : null,
    fillTransition: ctaBefore ? ctaBefore.transitionDuration + ' ' + ctaBefore.transitionTimingFunction : null,
    fillBg: ctaBefore ? ctaBefore.backgroundColor : null,
    gatilhoMobile: r(gatilho),
    vaoNavCta,
    overflowDoc, overflowBody, worst, brokenImgs, emptyHref,
    brokenAnchors: [...new Set(brokenAnchors)],
  };
})()`

/* ================= contraste do rótulo, por estado ================= */
const CONTRAST_SETUP = `
window.__alvo = (sel) => {
  const cta = document.querySelector(sel);
  if (!cta) return null;
  /* o nó de texto do rótulo, não a caixa inteira: a seta não é texto medido */
  const r = cta.getBoundingClientRect();
  const cs = getComputedStyle(cta);
  const range = document.createRange();
  const no = [...cta.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  if (no) range.selectNode(no);
  const rr = no ? range.getBoundingClientRect() : r;
  window.__el = cta;
  return { x:+rr.x.toFixed(1), y:+rr.y.toFixed(1), w:+rr.width.toFixed(1), h:+rr.height.toFixed(1), color: cs.color };
};
window.__esconder = () => { window.__el.style.color = 'transparent'; return 1; };
window.__mostrar = () => { window.__el.style.color = ''; return 1; };
window.__amostrar = (dataUrl, caixa) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const x0 = Math.max(0, Math.floor(caixa.x)), y0 = Math.max(0, Math.floor(caixa.y));
    const x1 = Math.min(cv.width, Math.ceil(caixa.x + caixa.w)), y1 = Math.min(cv.height, Math.ceil(caixa.y + caixa.h));
    if (x1 <= x0 || y1 <= y0) return resolve(null);
    const d = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
    const m = caixa.color.match(/[\\d.]+/g).map(Number);
    const alpha = m.length > 3 ? m[3] : 1;
    let pior = Infinity, piorPx = null;
    for (let p = 0; p < d.length; p += 4) {
      const bg = [d[p], d[p+1], d[p+2]];
      const fg = alpha < 1
        ? [alpha*m[0]+(1-alpha)*bg[0], alpha*m[1]+(1-alpha)*bg[1], alpha*m[2]+(1-alpha)*bg[2]]
        : [m[0], m[1], m[2]];
      const r = ratio(lum(fg[0],fg[1],fg[2]), lum(bg[0], bg[1], bg[2]));
      if (r < pior) { pior = r; piorPx = bg; }
    }
    resolve({ pior: +pior.toFixed(2), piorPx });
  };
  img.onerror = () => resolve(null);
  img.src = dataUrl;
});
1`

async function pontoDo(sel) {
  const box = await evaluate(
    `(()=>{const e=document.querySelector('${sel}');const r=e.getBoundingClientRect();
      return JSON.stringify({x:r.x+r.width/2,y:r.y+r.height/2});})()`,
  )
  return JSON.parse(box)
}

async function medirEstados(sel, vw) {
  const out = []
  await evaluate(CONTRAST_SETUP)
  const { x, y } = await pontoDo(sel)

  const amostrar = async (nome) => {
    const caixa = await evaluate(`JSON.stringify(window.__alvo('${sel}'))`)
    if (!caixa) return
    await evaluate(`window.__esconder()`)
    await pause(160)
    const shot = await cmd('Page.captureScreenshot', { format: 'png' })
    await evaluate(`window.__mostrar()`)
    const a = await evaluate(
      `window.__amostrar('data:image/png;base64,${shot.data}', ${caixa}).then(r=>JSON.stringify(r))`,
    )
    const estado = await evaluate(
      `(()=>{const e=document.querySelector('${sel}');const b=getComputedStyle(e,'::before');const c=getComputedStyle(e);
        const r=e.getBoundingClientRect();
        return JSON.stringify({fill:b.transform, shadow:c.boxShadow, transform:c.transform, outline:c.outlineWidth,
          w:+r.width.toFixed(1), h:+r.height.toFixed(1), x:+r.x.toFixed(1), y:+r.y.toFixed(1)});})()`,
    )
    out.push({ viewport: vw, estado: nome, ...JSON.parse(a ?? '{}'), ...JSON.parse(estado) })
  }

  /*
    ---------- A ORDEM DOS ESTADOS NÃO É LIVRE ----------

    `active` vem **por último**, e o motivo é que soltar o botão sobre o CTA é um
    clique de verdade: a página navega. Medir a pressão antes do foco fazia a
    varredura por `Tab` recomeçar noutra rota e concluir, errado, que o
    `focus-visible` era inalcançável por teclado.
  */

  /* default */
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 400, buttons: 0 })
  await pause(500)
  await amostrar('default')

  /* hover */
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await pause(600)
  await amostrar('hover')

  /* focus-visible por teclado — Tab até o CTA, sem ponteiro nenhum envolvido */
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 400, buttons: 0 })
  await evaluate(`(()=>{document.querySelector('${sel}').blur();window.scrollTo(0,0);return 1})()`)
  await pause(300)
  let achou = false
  const ordem = []
  for (let i = 0; i < 24 && !achou; i++) {
    /* `keyDown` com `text`, não `rawKeyDown`: só o primeiro executa a ação padrão. */
    await cmd('Input.dispatchKeyEvent', {
      type: 'keyDown', key: 'Tab', code: 'Tab', text: '\t',
      windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9,
    })
    await cmd('Input.dispatchKeyEvent', {
      type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9,
    })
    await pause(120)
    ordem.push(
      await evaluate(
        `(()=>{const a=document.activeElement;return (a.tagName||'')+':'+((a.textContent||'').trim().slice(0,22));})()`,
      ),
    )
    achou = await evaluate(`document.activeElement === document.querySelector('${sel}')`)
  }
  if (achou) {
    await pause(500)
    await amostrar('focus-visible')
    const ultimo = out[out.length - 1]
    ultimo.alcancadoPorTab = ordem.length
    ultimo.ordemDeTabulacao = ordem
    ultimo.focusVisible = await evaluate(`document.querySelector('${sel}').matches(':focus-visible')`)
    ultimo.ring = await evaluate(
      `(()=>{const c=getComputedStyle(document.querySelector('${sel}'));
        return c.boxShadow + ' | outline: ' + c.outline;})()`,
    )
  } else {
    out.push({ viewport: vw, estado: 'focus-visible', erro: 'não alcançado por Tab', ordemDeTabulacao: ordem })
  }
  await evaluate(`(()=>{document.activeElement.blur&&document.activeElement.blur();return 1})()`)

  /* active (pressionado) — por último: o release navega */
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await pause(400)
  await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1, buttons: 1 })
  await pause(320)
  await amostrar('active')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1, buttons: 0 })
  await pause(200)
  return out
}

/* ================= menu mobile ================= */
async function medirMenu(vw) {
  const passos = []
  const ler = () =>
    evaluate(`(()=>{const g=document.querySelector('header button[aria-expanded]');
      const id=g.getAttribute('aria-controls');
      const p=document.getElementById(id);
      const bd=[...document.querySelectorAll('div[aria-hidden="true"]')].find(d=>getComputedStyle(d).position==='fixed');
      const cta=p?p.querySelector('a[href*="/contato"]'):null;
      return JSON.stringify({expanded:g.getAttribute('aria-expanded'), hidden:p?p.hasAttribute('hidden'):null,
        bodyOverflow:document.body.style.overflow,
        foco:document.activeElement===g?'gatilho':(p&&p.contains(document.activeElement)?'painel':'outro'),
        focoTag:document.activeElement.tagName+':'+(document.activeElement.textContent||'').trim().slice(0,24),
        ctaTexto:cta?cta.textContent.trim():null, ctaHref:cta?cta.getAttribute('href'):null,
        ctaAlvo:cta?+cta.getBoundingClientRect().height.toFixed(1):null,
        backdropVisivel:bd?getComputedStyle(bd).opacity:null});})()`)
  const clicarGatilho = async () => {
    const p = await pontoDo('header button[aria-expanded]')
    await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1, buttons: 1 })
    await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1, buttons: 0 })
    await pause(600)
  }
  const tecla = async (key, code, vk) => {
    for (const type of ['rawKeyDown', 'keyUp'])
      await cmd('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk })
    await pause(450)
  }

  passos.push({ passo: 'fechado', ...JSON.parse(await ler()) })
  await clicarGatilho()
  passos.push({ passo: 'aberto (clique)', ...JSON.parse(await ler()) })
  await tecla('Escape', 'Escape', 27)
  passos.push({ passo: 'Escape', ...JSON.parse(await ler()) })
  await clicarGatilho()
  passos.push({ passo: 'reaberto', ...JSON.parse(await ler()) })
  await clicarGatilho()
  passos.push({ passo: 'fechado pelo botão', ...JSON.parse(await ler()) })
  await clicarGatilho()
  /* ----------
     O BACKDROP SÓ PODE SER CLICADO ONDE ELE ESTÁ EXPOSTO

     O ponto anterior era "fundo do painel + 30px", e em 320 × 568 isso cai **dentro**
     do painel: o clique acertava a própria navegação e o teste concluía, errado, que o
     backdrop não fechava. Agora a área exposta é medida antes; quando ela é zero — o
     painel preenche a janela e rola por dentro — isso é registrado como geometria do
     viewport, não como falha.
     ---------- */
  const geo = JSON.parse(
    await evaluate(`(() => {
      const g = document.querySelector('header button[aria-expanded]');
      const p = document.getElementById(g.getAttribute('aria-controls'));
      const r = p.getBoundingClientRect();
      return JSON.stringify({ painelBottom: +r.bottom.toFixed(1), painelH: +r.height.toFixed(1),
        viewportH: window.innerHeight, areaExposta: +(window.innerHeight - r.bottom).toFixed(1),
        painelRolavel: p.scrollHeight > p.clientHeight });
    })()`),
  )
  if (geo.areaExposta > 6) {
    const yBackdrop = geo.painelBottom + Math.min(20, geo.areaExposta / 2)
    await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: vw / 2, y: yBackdrop, button: 'left', clickCount: 1, buttons: 1 })
    await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: vw / 2, y: yBackdrop, button: 'left', clickCount: 1, buttons: 0 })
    await pause(600)
    passos.push({ passo: 'fechado pelo backdrop', backdrop: geo, ...JSON.parse(await ler()) })
  } else {
    passos.push({
      passo: 'backdrop não aplicável',
      backdrop: geo,
      nota: 'o painel preenche a janela e rola por dentro; não há área de backdrop exposta',
      ...JSON.parse(await ler()),
    })
    await clicarGatilho()
  }
  /* teclado dentro do painel + clique no CTA */
  await clicarGatilho()
  await tecla('Tab', 'Tab', 9)
  passos.push({ passo: 'aberto + Tab', ...JSON.parse(await ler()) })
  const antes = await evaluate(`location.pathname + location.search`)
  const ctaPonto = await evaluate(
    `(()=>{const g=document.querySelector('header button[aria-expanded]');
      const p=document.getElementById(g.getAttribute('aria-controls'));
      const a=p.querySelector('a[href*="/contato"]'); a.scrollIntoView({block:'center'});
      const r=a.getBoundingClientRect(); return JSON.stringify({x:r.x+r.width/2,y:r.y+r.height/2});})()`,
  )
  const cp = JSON.parse(ctaPonto)
  await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: cp.x, y: cp.y, button: 'left', clickCount: 1, buttons: 1 })
  await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cp.x, y: cp.y, button: 'left', clickCount: 1, buttons: 0 })
  await pause(1600)
  const depois = await evaluate(`location.pathname + location.search`)
  const estadoPreso = await evaluate(
    `JSON.stringify({bodyOverflow:document.body.style.overflow,
      classe:document.documentElement.classList.contains('mobile-menu-open'),
      intencaoSelecionada:(document.querySelector('#necessidade,[name="necessidade"]')||{}).value ?? null})`,
  )
  passos.push({ passo: 'clique no CTA', de: antes, para: depois, ...JSON.parse(estadoPreso) })
  return passos
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
    `${String(vp.w).padStart(4)} | h ${m.headerH} | marca x${m.marca?.x} | h1 x${m.h1x} | guia ${m.guiaCabecalho} | ` +
      `nav ${m.navLinks}/${m.navLinhas}L | cta ${m.cta ? m.cta.w + '×' + m.cta.h + ' @' + m.cta.x : '—'} | ` +
      `vão ${m.vaoNavCta} | raio ${m.ctaRadius} | sombra ${m.ctaShadow} | ovf ${m.overflowDoc}/${m.overflowBody}`,
  )
}
await writeFile(path.join(outDir, 'layout.json'), JSON.stringify({ rows, notes }, null, 2))

/* estados do CTA — desktop (1440) e menu (390) */
const estados = []
await setViewport(1440, 900)
await goto(baseUrl + '/')
estados.push(...(await medirEstados(CTA_DESKTOP, 1440)))
for (const e of estados)
  console.log(
    `1440 ${e.estado.padEnd(14)} | contraste ${e.pior} | fill ${e.fill} | sombra ${e.shadow} | ` +
      `transform ${e.transform} | caixa ${e.w}×${e.h} @${e.x},${e.y}${e.ring ? ' | anel ' + e.ring : ''}`,
  )
await writeFile(path.join(outDir, 'estados.json'), JSON.stringify(estados, null, 2))

/* menu mobile */
const menus = {}
for (const vw of [390, 320]) {
  const vp = VIEWPORTS.find((v) => v.w === vw)
  await setViewport(vp.w, vp.h)
  await goto(baseUrl + '/')
  menus[vw] = await medirMenu(vw)
  console.log(
    `menu ${vw}:`,
    menus[vw].map((p) => `${p.passo}=${p.expanded ?? ''}${p.hidden === false ? '/aberto' : p.hidden === true ? '/oculto' : ''}`).join(' · '),
  )
  const cta = menus[vw].find((p) => p.ctaTexto && p.hidden === false)
  if (cta) console.log(`  CTA do painel: "${cta.ctaTexto}" → ${cta.ctaHref} (alvo ${cta.ctaAlvo}px)`)
  const clique = menus[vw].find((p) => p.passo === 'clique no CTA')
  if (clique) console.log(`  clique: ${clique.de} → ${clique.para} | overflow preso: "${clique.bodyOverflow}" | classe: ${clique.classe} | intenção: ${clique.intencaoSelecionada}`)
}
await writeFile(path.join(outDir, 'menu.json'), JSON.stringify(menus, null, 2))

/* reduced-motion */
await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await setViewport(1440, 900)
await goto(baseUrl + '/')
const reduzido = await evaluate(
  `(()=>{const e=document.querySelector('${CTA_DESKTOP}');const c=getComputedStyle(e);
    return JSON.stringify({transition:c.transitionProperty+' '+c.transitionDuration,
      fillTransition:getComputedStyle(e,'::before').transitionDuration,
      visivel:c.visibility+' '+c.opacity});})()`,
)
await cmd('Emulation.setEmulatedMedia', { features: [] })
console.log('reduced-motion:', reduzido)
await writeFile(path.join(outDir, 'reduced-motion.json'), reduzido)

if (wantShots) {
  /* Header + começo da hero */
  for (const w of [1920, 1440, 1024]) {
    const vp = VIEWPORTS.find((v) => v.w === w)
    await setViewport(vp.w, vp.h)
    await goto(baseUrl + '/')
    const shot = await cmd('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.w, height: Math.min(vp.h, 420), scale: 1 },
    })
    await writeFile(path.join(outDir, '..', `${w}-header-hero.png`), Buffer.from(shot.data, 'base64'))
  }
  /* close do CTA nos três estados, em 1440 */
  await setViewport(1440, 900)
  await goto(baseUrl + '/')
  await evaluate(CONTRAST_SETUP)
  const { x, y } = await pontoDo(CTA_DESKTOP)
  const clip = async () => {
    const c = await evaluate(
      `(()=>{const r=document.querySelector('${CTA_DESKTOP}').getBoundingClientRect();
        return JSON.stringify({x:Math.max(0,r.x-22),y:Math.max(0,r.y-22),width:r.width+44,height:r.height+44});})()`,
    )
    return JSON.parse(c)
  }
  const tirar = async (nome) => {
    const shot = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...(await clip()), scale: 3 } })
    await writeFile(path.join(outDir, '..', `1440-cta-${nome}.png`), Buffer.from(shot.data, 'base64'))
  }
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 400, buttons: 0 })
  await pause(500)
  await tirar('default')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
  await pause(700)
  await tirar('hover')
  await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 400, buttons: 0 })
  await evaluate(`(()=>{document.querySelector('${CTA_DESKTOP}').blur();return 1})()`)
  await pause(200)
  for (let i = 0; i < 22; i++) {
    for (const type of ['rawKeyDown', 'keyUp'])
      await cmd('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
    await pause(90)
    if (await evaluate(`document.activeElement === document.querySelector('${CTA_DESKTOP}')`)) break
  }
  await pause(600)
  await tirar('focus')

  /* telefone: header fechado e menu aberto */
  for (const w of [390, 320]) {
    const vp = VIEWPORTS.find((v) => v.w === w)
    await setViewport(vp.w, vp.h)
    await goto(baseUrl + '/')
    if (w === 390) {
      const shot = await cmd('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: vp.w, height: 220, scale: 2 },
      })
      await writeFile(path.join(outDir, '..', `390-header-fechado.png`), Buffer.from(shot.data, 'base64'))
    }
    const p = await pontoDo('header button[aria-expanded]')
    await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1, buttons: 1 })
    await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1, buttons: 0 })
    await pause(800)
    const shot = await cmd('Page.captureScreenshot', { format: 'png' })
    await writeFile(path.join(outDir, '..', `${w}-menu-aberto.png`), Buffer.from(shot.data, 'base64'))
  }
  console.log('capturas geradas')
}

console.log('console errors:', notes.console.length)
console.log('http >=400:', [...new Set(notes.http)].length)
if (notes.console.length) console.log(notes.console.slice(0, 6))
if (notes.http.length) console.log([...new Set(notes.http)].slice(0, 6))
socket.close()
