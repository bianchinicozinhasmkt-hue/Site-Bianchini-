import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const endpoint = process.argv[2] ?? 'http://127.0.0.1:9222'
const outputDir = process.argv[3] ?? 'docs/site-audit/screenshots/before'
const targetUrl = process.argv[4] ?? 'http://localhost:3200/'
const label = process.argv[5] ?? 'before'

await mkdir(outputDir, { recursive: true })

const pages = await fetch(`${endpoint}/json/list`).then((r) => r.json())
let page = pages.find((item) => item.type === 'page')
if (!page) {
  const created = await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' }).then((r) => r.json())
  page = created
}

const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let nextId = 0
const pending = new Map()
const consoleErrors = []

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const waiter = pending.get(message.id)
    if (!waiter) return
    pending.delete(message.id)
    if (message.error) waiter.reject(new Error(message.error.message))
    else waiter.resolve(message.result)
    return
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    consoleErrors.push(message.params.entry.text)
  }
  if (message.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(message.params.exceptionDetails.text)
  }
})

function command(method, params = {}) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function evaluate(expression, awaitPromise = false) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise, returnByValue: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

async function setViewport(width, height) {
  await command('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
    screenWidth: width,
    screenHeight: height,
  })
}

async function settle() {
  // Rolagem progressiva: dispara os IntersectionObserver de `.reveal` em cada
  // seção antes de qualquer captura — um salto direto (scrollIntoView) não
  // garante que o observer já tenha marcado o elemento como visível, e a
  // seção fica com opacidade 0 no screenshot.
  await evaluate(`(async () => {
    const step = Math.max(360, Math.floor(innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 90));
    }
    scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 400));
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map(img => img.complete ? null : new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }))),
      new Promise(resolve => setTimeout(resolve, 15000)),
    ]);
  })()`, true)
  await pause(400)
}

async function screenshotFullPage(filename) {
  const metrics = await command('Page.getLayoutMetrics')
  const size = metrics.cssContentSize
  const shot = await command('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
    clip: { x: 0, y: 0, width: size.width, height: Math.ceil(size.height), scale: 1 },
  })
  await writeFile(path.join(outputDir, filename), Buffer.from(shot.data, 'base64'))
  console.error(`[capture] ${filename} (full ${size.width}x${Math.ceil(size.height)})`)
}

/*
 * Screenshots recortados por `clip` saem em branco quando a página já rolou
 * antes da captura — reproduzido em Edge headless 150.x tanto com quanto sem
 * `fromSurface`/`captureBeyondViewport`. `scrollIntoView` + captura de
 * viewport inteira (sem `clip`) é o caminho comprovado: ver
 * `docs/site-audit/01-auditoria-geral.md`, nota sobre a ferramenta de
 * captura. Não é um bug do site — o mesmo elemento capturado sem `clip`
 * renderiza perfeitamente.
 */
/*
 * `behavior: 'instant'` é obrigatório aqui: `html` tem `scroll-smooth`
 * global (`globals.css`), então um `scrollIntoView` sem isso anima por
 * cima da distância inteira da página — de `footer` (~16000px) de volta ao
 * topo do hero não termina dentro de uma pausa razoável, e a captura pega
 * um quadro no meio da rolagem. `instant` ignora o CSS e pula direto.
 */
async function screenshotElement(selector, filename, block = 'start') {
  const found = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    el.scrollIntoView({ block: ${JSON.stringify(block)}, behavior: 'instant' });
    return true;
  })()`)
  if (!found) {
    console.error(`[capture] SKIP ${filename} — selector not found: ${selector}`)
    return
  }
  await pause(500)
  await screenshotViewport(filename)
}

async function screenshotViewport(filename) {
  const shot = await command('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile(path.join(outputDir, filename), Buffer.from(shot.data, 'base64'))
  console.error(`[capture] ${filename} (viewport)`)
}

await command('Page.enable')
await command('Runtime.enable')
await command('Log.enable')

// ===== Desktop 1440x900 =====
await setViewport(1440, 900)
await command('Page.navigate', { url: targetUrl })
await pause(1500)
await settle()

await screenshotFullPage(`home-1440x900-${label}.png`)
await screenshotElement('header', `header-desktop-1440-${label}.png`)
await screenshotElement('#sintomas', `sintomas-1440-${label}.png`)
await screenshotElement('#diagnostico', `diagnostico-1440-${label}.png`)
await screenshotElement('#atuacao', `atuacao-1440-${label}.png`)
await screenshotElement('#pilares', `pilares-1440-${label}.png`)
await screenshotElement('#quem-conduz', `quem-conduz-1440-${label}.png`)
await screenshotElement('#industria-do-inox', `industria-inox-1440-${label}.png`)
await screenshotElement('#livro', `livro-1440-${label}.png`)
await screenshotElement('footer', `footer-1440-${label}.png`, 'end')

// Hero slides at 1440
for (let i = 0; i < 3; i++) {
  if (i > 0) {
    await evaluate(`(() => {
      const tabs = document.querySelectorAll('#sintomas ~ * [role="tab"]');
    })()`)
    await evaluate(`(() => {
      const tabs = [...document.querySelectorAll('[role="tab"][aria-controls]')].filter(t => t.id.includes('desktop'));
      if (tabs[${i}]) tabs[${i}].click();
    })()`)
    await pause(700)
  }
  await screenshotElement('.hero-root', `hero-1440-slide${i + 1}-${label}.png`)
}

// ===== Mobile 390x844 =====
await setViewport(390, 844)
await command('Page.navigate', { url: targetUrl })
await pause(1500)
await settle()
await screenshotFullPage(`home-390x844-${label}.png`)

// Hero slides at 390 (mobile nav uses separate tab refs)
for (let i = 0; i < 3; i++) {
  if (i > 0) {
    await evaluate(`(() => {
      const tabs = [...document.querySelectorAll('[role="tab"][aria-controls]')].filter(t => t.id.includes('mobile'));
      if (tabs[${i}]) tabs[${i}].click();
    })()`)
    await pause(700)
  }
  await screenshotElement('.hero-root', `hero-390-slide${i + 1}-${label}.png`)
}

// Mobile menu open
await evaluate(`(() => { window.scrollTo(0,0); })()`)
await pause(200)
await evaluate(`(() => {
  const btn = document.querySelector('button[aria-label="Abrir menu"]');
  if (btn) btn.click();
})()`)
await pause(500)
await screenshotViewport(`menu-mobile-390-${label}.png`)

await writeFile(
  path.join(outputDir, `console-errors-${label}.json`),
  JSON.stringify({ targetUrl, consoleErrors }, null, 2),
)

socket.close()
console.log(JSON.stringify({ consoleErrors }, null, 2))
