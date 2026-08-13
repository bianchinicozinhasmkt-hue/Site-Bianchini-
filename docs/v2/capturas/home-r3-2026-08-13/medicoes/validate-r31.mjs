import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3212'
const endpoint = process.argv[4] ?? 'http://127.0.0.1:9222'
if (!outDir) throw new Error('Uso: node validate-r31.mjs <saida> [baseUrl] [endpoint]')

const shotsDir = path.join(outDir, 'shots')
await mkdir(shotsDir, { recursive: true })

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
const responseStatuses = new Map()

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
  if (message.method === 'Network.responseReceived') {
    const { status, url } = message.params.response
    responseStatuses.set(url, status)
    if (status >= 400) httpFailures.push(`${status} ${url}`)
  }
  if (message.method === 'Network.loadingFailed') {
    const { errorText, canceled, requestId } = message.params
    if (!canceled) httpFailures.push(`FAILED ${requestId} ${errorText}`)
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
  const result = await command('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  }, timeout)
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
  }
  return result.result.value
}

await command('Log.enable')
await command('Runtime.enable')
await command('Network.enable')
await command('Page.enable')

const setViewport = (width, height) => command('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
})

async function gotoHome(reduced = false) {
  consoleErrors = []
  httpFailures = []
  responseStatuses.clear()
  await command('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }],
  })
  const loaded = waitFor('Page.loadEventFired')
  await command('Page.navigate', { url: `${baseUrl}/` })
  await loaded
  await pause(700)
  await evaluate('document.fonts.ready')
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => { image.loading = 'eager' })
    return true
  })()`)
  await evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
  await pause(1200)
  await evaluate('window.scrollTo(0, 0)')
  await pause(350)
}

const auditExpression = `(() => {
  const selectors = {
    header: 'header', hero: 'section[aria-labelledby="hero-titulo"]', equipamentos: '#equipamentos', projetos: '#projetos',
    pilares: '#pilares', sintomas: '#sintomas', diagnostico: '#diagnostico',
    transicao: '#transicao', industria: '#industria-do-inox', metodo: '#metodo',
    leonardo: '#leonardo', 'quem-conduz': '#quem-conduz', credibilidade: '#credibilidade',
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
          via, tag: element.tagName.toLowerCase(), cls: (element.getAttribute('class') ?? '').slice(0, 130),
          text: ownText ? element.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60) : '',
          width: round(width), height: round(height), area, meaningful,
          relevant: area >= 400 || meaningful, color,
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
    sections[name] = {
      y: Math.round(rect.top + scrollY), x: Math.round(rect.left + scrollX),
      width: Math.round(rect.width), height: Math.round(rect.height),
      yellowTotal: yellowRegions.length,
      yellowRelevant: yellowRegions.filter((region) => region.relevant).length,
      yellowRegions,
      images: [...section.querySelectorAll('img')].filter(visible).map((image) => ({
        alt: image.alt, complete: image.complete && image.naturalWidth > 0,
        natural: image.naturalWidth + 'x' + image.naturalHeight,
      })),
      actions: [...section.querySelectorAll('a,button')].filter(visible).map((element) => ({
        tag: element.tagName.toLowerCase(), text: element.innerText.replace(/\\s+/g, ' ').trim(),
        href: element.getAttribute('href'), height: round(element.getBoundingClientRect().height),
      })),
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
  const brokenAnchors = [...document.querySelectorAll('a[href^="#"],a[href^="/#"]')]
    .map((anchor) => anchor.getAttribute('href').replace(/^\\//, ''))
    .filter((href) => href.length > 1 && !document.getElementById(href.slice(1)))
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, height: document.documentElement.scrollHeight },
    sections, infiniteAnimations, brokenAnchors,
    brokenAria: [...document.querySelectorAll('[aria-controls]')].map((element) => element.getAttribute('aria-controls')).filter((id) => !document.getElementById(id)),
    emptyLinks: document.querySelectorAll('a[href="#"],a[href=""],a:not([href])').length,
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
    hydrationErrors: [...document.querySelectorAll('nextjs-portal')].length,
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

const heroMotionExpression = `(() => {
  const hero = document.querySelector('section[aria-labelledby="hero-titulo"]')
  const css = [...hero.querySelectorAll('*')].flatMap((element) => {
    const style = getComputedStyle(element)
    const names = style.animationName.split(',').map((item) => item.trim())
    const durations = style.animationDuration.split(',').map((item) => item.trim())
    const iterations = style.animationIterationCount.split(',').map((item) => item.trim())
    return names.map((name, index) => ({
      name, duration: durations[index] ?? durations[0], iterationCount: iterations[index] ?? iterations[0],
      tag: element.tagName.toLowerCase(), cls: (element.className ?? '').toString().slice(0, 140),
    })).filter((item) => item.name !== 'none')
  })
  const web = hero.getAnimations({ subtree: true }).map((animation) => {
    const timing = animation.effect?.getComputedTiming?.() ?? {}
    const configured = animation.effect?.getTiming?.() ?? {}
    const target = animation.effect?.target
    return {
      playState: animation.playState, currentTime: animation.currentTime,
      duration: timing.duration, iterations: configured.iterations,
      animationName: animation.animationName ?? null,
      tag: target?.tagName?.toLowerCase() ?? null,
      cls: (target?.className ?? '').toString().slice(0, 140),
    }
  })
  return {
    selected: hero.querySelector('[role="tab"][aria-selected="true"]')?.id ?? null,
    panelText: hero.querySelector('[role="tabpanel"]')?.innerText.replace(/\\s+/g, ' ').trim().slice(0, 180) ?? '',
    css, web,
    infinite: [
      ...css.filter((item) => item.iterationCount === 'infinite').map((item) => ({ source: 'css', ...item })),
      ...web.filter((item) => item.iterations === Infinity).map((item) => ({ source: 'waapi', ...item })),
    ],
  }
})()`

async function clickHeroState(id) {
  await evaluate(`document.querySelector('#hero-aba-${id}').click()`)
  await pause(1150)
}

async function heroSamples(id, click = true) {
  if (click) await clickHeroState(id)
  const samples = {}
  const checkpoints = [[1, 1000], [5, 4000], [10, 5000]]
  for (const [second, wait] of checkpoints) {
    await pause(wait)
    samples[`${second}s`] = await evaluate(heroMotionExpression)
  }
  return samples
}

async function screenshotClip(name, selector) {
  const clip = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)})
    const rect = element.getBoundingClientRect()
    return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height }
  })()`)
  const { data } = await command('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 },
  }, 90000)
  await writeFile(path.join(shotsDir, `${name}.png`), Buffer.from(data, 'base64'))
}

async function screenshotViewport(name) {
  const { data } = await command('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile(path.join(shotsDir, `${name}.png`), Buffer.from(data, 'base64'))
}

async function checkAssets() {
  return evaluate(`(async () => {
    const urls = [...new Set([
      ...[...document.querySelectorAll('link[rel="stylesheet"][href]')].map((item) => item.href),
      ...[...document.querySelectorAll('script[src]')].map((item) => item.src),
    ])]
    const results = []
    for (const url of urls) {
      try {
        const response = await fetch(url, { cache: 'no-store' })
        results.push({ url, status: response.status, ok: response.ok })
      } catch (error) {
        results.push({ url, status: 0, ok: false, error: String(error) })
      }
    }
    return results
  })()`, 90000)
}

async function keyboardAndFocusTest() {
  await evaluate(`document.querySelector('#hero-aba-equipamentos').focus()`)
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
  await pause(1150)
  const afterArrow = await evaluate(`({
    selected: document.querySelector('section[aria-labelledby="hero-titulo"] [role="tab"][aria-selected="true"]')?.id,
    focused: document.activeElement?.id,
    focusVisible: document.activeElement?.matches(':focus-visible') ?? false,
    outline: getComputedStyle(document.activeElement).outlineStyle,
  })`)
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 })
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 })
  await pause(1150)
  const afterEnd = await evaluate(`({ selected: document.querySelector('section[aria-labelledby="hero-titulo"] [role="tab"][aria-selected="true"]')?.id, focused: document.activeElement?.id })`)
  return { afterArrow, afterEnd }
}

async function touchTest() {
  await command('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
  const point = await evaluate(`(() => { const r = document.querySelector('#hero-aba-projetos').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`)
  await command('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: point.x, y: point.y, radiusX: 2, radiusY: 2, force: 1, id: 1 }] })
  await command('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await pause(1150)
  const selected = await evaluate(`document.querySelector('section[aria-labelledby="hero-titulo"] [role="tab"][aria-selected="true"]')?.id`)
  await command('Emulation.setTouchEmulationEnabled', { enabled: false })
  return { selected }
}

async function credibilityKeyboardTest() {
  return evaluate(`(async () => {
    const region = document.querySelector('#credibilidade [role="region"]')
    region.focus()
    const before = region.scrollLeft
    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    region.scrollBy({ left: 120, behavior: 'instant' })
    await new Promise((resolve) => requestAnimationFrame(resolve))
    return {
      focusable: document.activeElement === region,
      focusVisible: region.matches(':focus-visible'),
      clientWidth: region.clientWidth, scrollWidth: region.scrollWidth,
      overflow: getComputedStyle(region).overflowX,
      before, after: region.scrollLeft,
      logoCount: region.querySelectorAll('li').length,
      uniqueLogoCount: new Set([...region.querySelectorAll('img')].map((image) => image.alt)).size,
    }
  })()`)
}

const viewports = [
  [320, 568], [390, 844], [768, 1024], [1024, 768],
  [1366, 768], [1440, 900], [1600, 900], [1920, 1080],
]

if (process.argv.includes('--focus-only')) {
  await setViewport(390, 844)
  await gotoHome(false)
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  const focus = await evaluate(`(() => {
    const region = document.querySelector('#credibilidade [role="region"]')
    region.focus()
    const style = getComputedStyle(region)
    return {
      focused: document.activeElement === region,
      focusVisible: region.matches(':focus-visible'),
      outline: style.outlineStyle,
      ringWidth: style.getPropertyValue('--tw-ring-offset-width'),
      overflow: style.overflowX,
      clientWidth: region.clientWidth,
      scrollWidth: region.scrollWidth,
    }
  })()`)
  await writeFile(path.join(outDir, 'foco-teclado-r31.json'), JSON.stringify({ measuredAt: new Date().toISOString(), viewport: '390x844', focus }, null, 2))
  console.log('FOCUS=', JSON.stringify(focus))
  socket.close()
  process.exit(0)
}

const result = {
  baseUrl, measuredAt: new Date().toISOString(), dpr: 1,
  viewports: {}, heroMotion: {}, interaction: {}, reducedMotion: {}, assets: [],
}

for (const [width, height] of viewports) {
  await setViewport(width, height)
  await gotoHome(false)
  const audit = await evaluate(auditExpression)
  audit.overflow = await evaluate(overflowExpression, 90000)
  audit.consoleErrors = [...consoleErrors]
  audit.httpFailures = [...httpFailures]
  result.viewports[`${width}x${height}`] = audit

  if (width === 1440) result.assets = await checkAssets()

  if (width === 390 || width === 1440) {
    for (const [name, selector] of [
      ['sintomas', '#sintomas'], ['industria', '#industria-do-inox'],
      ['quem-conduz', '#quem-conduz'], ['credibilidade', '#credibilidade'],
    ]) {
      await screenshotClip(`${width}-${name}`, selector)
    }
    for (const id of ['equipamentos', 'projetos', 'consultoria']) {
      await clickHeroState(id)
      await screenshotClip(`${width}-hero-${id}`, 'section[aria-labelledby="hero-titulo"]')
    }
    await evaluate(`window.scrollTo(0, Math.max(0, document.querySelector('#sintomas').getBoundingClientRect().top + scrollY - innerHeight * 0.65))`)
    await pause(250)
    await screenshotViewport(`${width}-contexto-sintomas-entrada`)
    await evaluate(`window.scrollTo(0, document.querySelector('#credibilidade').getBoundingClientRect().bottom + scrollY - innerHeight * 0.35)`)
    await pause(250)
    await screenshotViewport(`${width}-contexto-credibilidade-saida`)
  }

  console.log(`${width}x${height}: amarelos`, {
    sintomas: audit.sections.sintomas?.yellowRelevant,
    industria: audit.sections.industria?.yellowRelevant,
    quemConduz: audit.sections['quem-conduz']?.yellowRelevant,
    credibilidade: audit.sections.credibilidade?.yellowRelevant,
  }, `loops=${audit.infiniteAnimations.length}`, `overflow=${audit.overflow.length}`)
}

await setViewport(1440, 900)
await gotoHome(false)
result.heroMotion.default = await heroSamples('equipamentos', false)
for (const id of ['equipamentos', 'projetos', 'consultoria']) {
  result.heroMotion[id] = await heroSamples(id)
}
result.interaction.keyboard = await keyboardAndFocusTest()
result.interaction.touch = await touchTest()
result.interaction.credibility = await credibilityKeyboardTest()

await gotoHome(true)
result.reducedMotion.mediaMatches = await evaluate(`matchMedia('(prefers-reduced-motion: reduce)').matches`)
result.reducedMotion.states = {}
for (const id of ['equipamentos', 'projetos', 'consultoria']) {
  await clickHeroState(id)
  result.reducedMotion.states[id] = await evaluate(`(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-titulo"]')
    const active = hero.querySelector('[role="tab"][aria-selected="true"]')
    const panel = hero.querySelector('[role="tabpanel"]')
    const motion = ${heroMotionExpression}
    return {
      selected: active?.id, panelVisible: !!panel && getComputedStyle(panel).visibility !== 'hidden' && Number(getComputedStyle(panel).opacity) > 0,
      panelTextLength: panel?.innerText.trim().length ?? 0, infinite: motion.infinite,
      runningAnimations: motion.web.filter((item) => item.playState === 'running'),
    }
  })()`)
}
result.reducedMotion.consoleErrors = [...consoleErrors]
result.reducedMotion.httpFailures = [...httpFailures]

result.summary = {
  infiniteAnimationsInHero: Object.values(result.heroMotion).flatMap((state) => Object.values(state)).reduce((sum, sample) => sum + sample.infinite.length, 0),
  pageInfiniteAnimationNames: [...new Set(Object.values(result.viewports).flatMap((item) => item.infiniteAnimations.map((animation) => animation.name)))],
  consoleErrors: [...new Set(Object.values(result.viewports).flatMap((item) => item.consoleErrors))],
  httpFailures: [...new Set(Object.values(result.viewports).flatMap((item) => item.httpFailures))],
  overflowLeaks: Object.entries(result.viewports).filter(([, item]) => item.overflow.length).map(([viewport]) => viewport),
  brokenImages: Object.entries(result.viewports).filter(([, item]) => item.brokenImages.length).map(([viewport, item]) => ({ viewport, images: item.brokenImages })),
  emptyLinks: Object.entries(result.viewports).filter(([, item]) => item.emptyLinks).map(([viewport, item]) => ({ viewport, count: item.emptyLinks })),
  brokenAnchors: Object.entries(result.viewports).filter(([, item]) => item.brokenAnchors.length || item.brokenAria.length).map(([viewport, item]) => ({ viewport, anchors: item.brokenAnchors, aria: item.brokenAria })),
  assetFailures: result.assets.filter((item) => !item.ok),
}

await writeFile(path.join(outDir, 'validacao-r31.json'), JSON.stringify(result, null, 2))
console.log('INFINITE_ANIMATIONS_IN_HERO=', result.summary.infiniteAnimationsInHero)
console.log('SUMMARY=', JSON.stringify(result.summary))
socket.close()
