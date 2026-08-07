import { writeFile } from 'node:fs/promises'

const endpoint = process.argv[2] ?? 'http://127.0.0.1:9222'
const targetUrl = process.argv[3] ?? 'http://localhost:3200/'
const outFile = process.argv[4] ?? 'docs/site-audit/screenshots/before/responsive-audit.json'

const pages = await fetch(`${endpoint}/json/list`).then((r) => r.json())
const page = pages.find((item) => item.type === 'page')
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let nextId = 0
const pending = new Map()
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const waiter = pending.get(message.id)
    if (!waiter) return
    pending.delete(message.id)
    if (message.error) waiter.reject(new Error(message.error.message)); else waiter.resolve(message.result)
  }
})
function command(method, params = {}) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
async function evaluate(expression, awaitPromise = false) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise, returnByValue: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

await command('Page.enable')
await command('Runtime.enable')

const widths = [320, 360, 390, 430, 768, 1024, 1280, 1366, 1440, 1586]
const results = []

for (const width of widths) {
  await command('Emulation.setDeviceMetricsOverride', {
    width, height: 900, deviceScaleFactor: 1, mobile: width < 768, screenWidth: width, screenHeight: 900,
  })
  await command('Page.navigate', { url: targetUrl })
  await pause(1200)

  await evaluate(`(async () => {
    const step = Math.max(360, Math.floor(innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map(img => img.complete ? null : new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true });
      }))),
      new Promise(resolve => setTimeout(resolve, 12000)),
    ]);
  })()`, true)

  const audit = await evaluate(`(() => {
    const selector = element => {
      if (element.id) return '#' + CSS.escape(element.id);
      const classes = [...element.classList].slice(0, 2).map(name => '.' + CSS.escape(name)).join('');
      return element.tagName.toLowerCase() + classes;
    };
    const overflowing = [...document.body.querySelectorAll('*')].filter(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (style.position === 'fixed') return false;
      return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
    }).slice(0, 15).map(el => ({ sel: selector(el), right: Math.round(el.getBoundingClientRect().right), left: Math.round(el.getBoundingClientRect().left) }));
    const clippedText = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,figcaption,li,dt,dd')].filter(element => {
      if (!element.textContent?.trim()) return false;
      const style = getComputedStyle(element);
      const clips = ['hidden', 'clip'].includes(style.overflow) || ['hidden', 'clip'].includes(style.overflowX) || ['hidden', 'clip'].includes(style.overflowY);
      return clips && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
    }).slice(0, 15).map(selector);
    const deformedImages = [...document.images].filter(image => getComputedStyle(image).objectFit === 'fill').map(selector);
    const whatsapp = document.querySelector('.whatsapp-float')?.getBoundingClientRect();
    const bodyWidth = document.documentElement.scrollWidth;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentScrollWidth: bodyWidth,
      horizontalOverflowPx: bodyWidth - innerWidth,
      overflowingElements: overflowing,
      clippedText,
      deformedImages,
      whatsapp: whatsapp ? { left: Math.round(whatsapp.left), top: Math.round(whatsapp.top), right: Math.round(whatsapp.right), bottom: Math.round(whatsapp.bottom) } : null,
    };
  })()`, true)

  results.push({ width, ...audit })
  console.error(`[responsive] ${width}px — overflowPx=${audit.horizontalOverflowPx} overflowingEls=${audit.overflowingElements.length} clippedText=${audit.clippedText.length}`)
}

await writeFile(outFile, JSON.stringify(results, null, 2))
socket.close()
console.log('done')
