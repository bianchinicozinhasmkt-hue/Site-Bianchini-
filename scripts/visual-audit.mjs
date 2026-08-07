import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const endpoint = process.argv[2] ?? 'http://127.0.0.1:9222'
const outputDir = process.argv[3] ?? 'docs/home-correcao-final-20260803'
const targetUrl = process.argv[4] ?? 'http://localhost:3200/'

await mkdir(outputDir, { recursive: true })

const pages = await fetch(`${endpoint}/json/list`).then((response) => response.json())
const page = pages.find((item) => item.type === 'page')
if (!page) throw new Error('Nenhuma página disponível no navegador de validação.')

const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let nextId = 0
const pending = new Map()
const browserErrors = []

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
    browserErrors.push(message.params.entry.text)
  }
  if (message.method === 'Runtime.exceptionThrown') {
    browserErrors.push(message.params.exceptionDetails.text)
  }
})

function command(method, params = {}) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function evaluate(expression, awaitPromise = false) {
  const result = await command('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
  })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

await command('Page.enable')
await command('Runtime.enable')
await command('Log.enable')

const viewports = [
  { width: 390, height: 844, capture: 'depois-home-390x844.png' },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900, capture: 'depois-home-1440x900.png' },
  { width: 1586, height: 992 },
]

const results = []

for (const viewport of viewports) {
  console.error(`[audit] viewport ${viewport.width}x${viewport.height} starting`)
  await command('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 768,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  })
  await command('Page.navigate', { url: targetUrl })
  await pause(1800)

  await evaluate(`(async () => {
    const step = Math.max(360, Math.floor(innerHeight * 0.72));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 70));
    }
    scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 350));
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map(img => img.complete ? null : new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }))),
      new Promise(resolve => setTimeout(resolve, 25000)),
    ]);
  })()`, true)

  const audit = await evaluate(`(async () => {
    const selector = element => {
      if (element.id) return '#' + CSS.escape(element.id);
      const classes = [...element.classList].slice(0, 2).map(name => '.' + CSS.escape(name)).join('');
      return element.tagName.toLowerCase() + classes;
    };
    const overflowing = [...document.body.querySelectorAll('*')].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
    }).slice(0, 12).map(selector);
    const clippedText = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,figcaption,li')].filter(element => {
      if (!element.textContent?.trim()) return false;
      const style = getComputedStyle(element);
      const clips = ['hidden', 'clip'].includes(style.overflow) || ['hidden', 'clip'].includes(style.overflowX) || ['hidden', 'clip'].includes(style.overflowY);
      return clips && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
    }).slice(0, 12).map(selector);
    const deformedImages = [...document.images].filter(image => getComputedStyle(image).objectFit === 'fill').map(selector);
    const whatsapp = document.querySelector('.whatsapp-float')?.getBoundingClientRect();
    const tabs = [...document.querySelectorAll('#sintomas [role="tab"]')];
    const tabHeights = [];
    for (const tab of tabs) {
      tab.click();
      await new Promise(resolve => setTimeout(resolve, 300));
      const panel = document.querySelector('#sintomas [role="tabpanel"]');
      tabHeights.push(panel ? Math.round(panel.getBoundingClientRect().height) : null);
    }
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      overflowing,
      clippedText,
      deformedImages,
      tabHeights,
      whatsapp: whatsapp ? { left: Math.round(whatsapp.left), top: Math.round(whatsapp.top), right: Math.round(whatsapp.right), bottom: Math.round(whatsapp.bottom) } : null,
    };
  })()`, true)

  results.push(audit)
  console.error(`[audit] viewport ${viewport.width}x${viewport.height} done`)

  if (viewport.capture) {
    const metrics = await command('Page.getLayoutMetrics')
    const size = metrics.cssContentSize
    const screenshot = await command('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      fromSurface: true,
      clip: { x: 0, y: 0, width: viewport.width, height: Math.ceil(size.height), scale: 1 },
    })
    await writeFile(path.join(outputDir, viewport.capture), Buffer.from(screenshot.data, 'base64'))
  }
}

await writeFile(
  path.join(outputDir, 'validacao.json'),
  JSON.stringify({ targetUrl, results, browserErrors }, null, 2),
)

socket.close()
console.log(JSON.stringify({ results, browserErrors }, null, 2))
