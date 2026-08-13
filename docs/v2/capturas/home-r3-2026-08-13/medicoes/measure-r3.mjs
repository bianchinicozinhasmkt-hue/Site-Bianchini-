import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3200'
const wantShots = process.argv.includes('--shots')
const endpoint = 'http://127.0.0.1:9222'

if (!outDir) throw new Error('Uso: node measure-r3.mjs <saida> [baseUrl] [--shots]')
await mkdir(outDir, { recursive: true })
if (wantShots) await mkdir(path.join(outDir, 'shots'), { recursive: true })

const targets = await fetch(`${endpoint}/json/list`).then((response) => response.json())
let target = targets.find((item) => item.type === 'page')
if (!target) {
  target = await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' }).then((response) => response.json())
}

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let nextId = 0
const pending = new Map()
const waiters = []
let consoleErrors = []
let httpFailures = []

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
  for (let index = waiters.length - 1; index >= 0; index -= 1) {
    if (waiters[index].method === message.method) {
      waiters[index].resolve(message.params)
      waiters.splice(index, 1)
    }
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    consoleErrors.push(message.params.entry.text)
  }
  if (message.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(message.params.exceptionDetails.text ?? 'Runtime exception')
  }
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
    httpFailures.push(`${message.params.response.status} ${message.params.response.url}`)
  }
})

function command(method, params = {}, timeout = 60000) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return Promise.race([
    new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout CDP: ${method}`)), timeout)),
  ])
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function waitFor(method, timeout = 15000) {
  return new Promise((resolve) => {
    const waiter = { method, resolve }
    waiters.push(waiter)
    setTimeout(() => {
      const index = waiters.indexOf(waiter)
      if (index >= 0) {
        waiters.splice(index, 1)
        resolve(null)
      }
    }, timeout)
  })
}

async function evaluate(expression, timeout = 60000) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, timeout)
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
  }
  return result.result.value
}

await command('Log.enable')
await command('Runtime.enable')
await command('Network.enable')
await command('Page.enable')

const setViewport = (width, height) =>
  command('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  })

async function gotoHome() {
  consoleErrors = []
  httpFailures = []
  const loaded = waitFor('Page.loadEventFired')
  await command('Page.navigate', { url: `${baseUrl}/` })
  await loaded
  await pause(500)
  await evaluate('document.fonts.ready')
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => { image.loading = 'eager' })
    return true
  })()`)
  await evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
  await pause(1000)
  await evaluate('window.scrollTo(0, 0)')
  await pause(500)
}

const inventoryExpression = `(() => {
  const selectors = {
    sintomas: '#sintomas',
    diagnostico: '#diagnostico',
    industria: '#industria-do-inox',
    leonardo: '#leonardo',
    'quem-conduz': '#quem-conduz',
    credibilidade: '#credibilidade',
    header: 'header',
    hero: '#hero',
    equipamentos: '#equipamentos',
    projetos: '#projetos',
    pilares: '#pilares',
    transicao: '#transicao',
    fechamento: 'section[aria-labelledby="cta-final-titulo"]',
  }
  const round = (value) => +value.toFixed(1)
  const visible = (element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0
  }
  const yellow = (color) => {
    const match = /rgba?\\((\\d+), ?(\\d+), ?(\\d+)(?:, ?([\\d.]+))?\\)/.exec(color ?? '')
    if (!match) return false
    const red = Number(match[1]); const green = Number(match[2]); const blue = Number(match[3])
    const alpha = match[4] === undefined ? 1 : Number(match[4])
    return alpha >= 0.35 && red > 150 && green > 120 && blue < 140 && red - blue > 60 && green - blue > 40
  }
  const sections = {}
  for (const [name, selector] of Object.entries(selectors)) {
    const section = document.querySelector(selector)
    if (!section) { sections[name] = null; continue }
    const rect = section.getBoundingClientRect()
    const blocks = [...section.querySelectorAll('p,h1,h2,h3,h4,h5,h6')].filter(visible)
    const texts = blocks.map((element) => element.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)
    const yellowRegions = []
    for (const element of section.querySelectorAll('*')) {
      if (!visible(element)) continue
      const style = getComputedStyle(element)
      const box = element.getBoundingClientRect()
      const ownText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      const add = (via, color, width, height, meaningful = false) => {
        if (!yellow(color)) return
        const area = Math.round(width * height)
        yellowRegions.push({
          via,
          tag: element.tagName.toLowerCase(),
          cls: (element.getAttribute('class') ?? '').slice(0, 130),
          text: ownText ? element.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60) : '',
          width: round(width),
          height: round(height),
          area,
          meaningful,
          relevant: area >= 400 || meaningful,
          color,
        })
      }
      add('background', style.backgroundColor, box.width, box.height, element.tagName === 'BUTTON')
      if (ownText) add('text', style.color, box.width, box.height, true)
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
        const width = Number.parseFloat(style['border' + side + 'Width'])
        if (width <= 0 || style['border' + side + 'Style'] === 'none') continue
        const horizontal = side === 'Top' || side === 'Bottom'
        add('border-' + side.toLowerCase(), style['border' + side + 'Color'], horizontal ? box.width : width, horizontal ? width : box.height, true)
      }
    }
    const images = [...section.querySelectorAll('img')].filter(visible).map((image) => ({
      alt: image.alt,
      complete: image.complete && image.naturalWidth > 0,
      natural: image.naturalWidth + 'x' + image.naturalHeight,
    }))
    const actions = [...section.querySelectorAll('a,button')].filter(visible).map((element) => ({
      tag: element.tagName.toLowerCase(),
      text: element.innerText.replace(/\\s+/g, ' ').trim(),
      href: element.getAttribute('href'),
      height: round(element.getBoundingClientRect().height),
    }))
    sections[name] = {
      y: Math.round(rect.top + window.scrollY),
      height: Math.round(rect.height),
      characters: texts.reduce((sum, text) => sum + text.length, 0),
      blocks: texts.length,
      yellowTotal: yellowRegions.length,
      yellowRelevant: yellowRegions.filter((region) => region.relevant).length,
      yellowRegions,
      images,
      actions,
      htmlLength: section.outerHTML.length,
    }
  }
  const infiniteAnimations = [...document.querySelectorAll('body *')].filter(visible).flatMap((element) => {
    const style = getComputedStyle(element)
    const names = style.animationName.split(',').map((item) => item.trim())
    const iterations = style.animationIterationCount.split(',').map((item) => item.trim())
    return names.map((name, index) => ({ name, iteration: iterations[index] ?? iterations[0], element }))
      .filter((item) => item.name !== 'none' && item.iteration === 'infinite')
      .map((item) => ({ name: item.name, tag: item.element.tagName.toLowerCase(), cls: (item.element.className ?? '').toString().slice(0, 150) }))
  })
  const brokenAria = [...document.querySelectorAll('[aria-controls]')].map((element) => element.getAttribute('aria-controls')).filter((id) => !document.getElementById(id))
  const brokenAnchors = [...document.querySelectorAll('a[href^="#"],a[href^="/#"]')]
    .map((anchor) => anchor.getAttribute('href').replace(/^\\//, ''))
    .filter((href) => href.length > 1 && !document.getElementById(href.slice(1)))
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, height: document.documentElement.scrollHeight },
    sections,
    infiniteAnimations,
    brokenAria,
    brokenAnchors,
    emptyLinks: document.querySelectorAll('a[href="#"],a[href=""],a:not([href])').length,
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
  }
})()`

const overflowExpression = `(async () => {
  const leaks = []
  const step = Math.round(innerHeight * 0.6)
  for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
    scrollTo(0, y)
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
      leaks.push({ y, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth })
    }
  }
  scrollTo(0, 0)
  return leaks
})()`

const viewports = [
  [320, 568], [390, 844], [768, 1024], [1024, 768],
  [1366, 768], [1440, 900], [1600, 900], [1920, 1080],
]
const result = { baseUrl, measuredAt: new Date().toISOString(), viewports: {} }

async function screenshot(name) {
  const { data } = await command('Page.captureScreenshot', { format: 'png' })
  await writeFile(path.join(outDir, 'shots', `${name}.png`), Buffer.from(data, 'base64'))
}

for (const [width, height] of viewports) {
  await setViewport(width, height)
  await gotoHome()
  const inventory = await evaluate(inventoryExpression)
  inventory.overflow = await evaluate(overflowExpression, 90000)
  inventory.consoleErrors = [...consoleErrors]
  inventory.httpFailures = [...httpFailures]
  result.viewports[`${width}x${height}`] = inventory

  if (wantShots && [390, 1440, 1920].includes(width)) {
    for (const sectionName of ['sintomas', 'diagnostico', 'industria', 'leonardo', 'quem-conduz', 'credibilidade']) {
      const section = inventory.sections[sectionName]
      if (!section) continue
      await evaluate(`window.scrollTo(0, ${Math.max(0, section.y + section.height / 2 - height / 2)})`)
      await pause(350)
      await screenshot(`${width}-${sectionName}`)
    }
  }

  console.log(`${width}x${height}`, Object.fromEntries(
    ['sintomas', 'diagnostico', 'industria', 'leonardo', 'quem-conduz', 'credibilidade'].map((name) => [name, inventory.sections[name]?.yellowTotal]),
  ), `loops=${inventory.infiniteAnimations.length}`, `overflow=${inventory.overflow.length}`)
}

await writeFile(path.join(outDir, 'medicao.json'), JSON.stringify(result, null, 2))
socket.close()
