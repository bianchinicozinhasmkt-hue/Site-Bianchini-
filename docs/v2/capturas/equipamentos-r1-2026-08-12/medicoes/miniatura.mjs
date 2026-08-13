/**
 * Teste da miniatura — briefing §29 / documento 03, critério de aprovação.
 *
 * Renderiza `#equipamentos` em 1440 e produz a captura reduzida a ~200px de
 * largura. A redução é feita pelo **compositor**, via `scale` do
 * `Page.captureScreenshot`, não por reamostragem posterior: o que se avalia é a
 * silhueta da seção, e ela tem de sobreviver ao tamanho de um cartão de
 * galeria.
 *
 * Perguntas do critério, respondidas na captura:
 *   1. a fotografia domina?
 *   2. cozinha/equipamento são reconhecíveis?
 *   3. existe um protagonista?
 *   4. parece seção de site ou catálogo?
 *   5. o CTA não virou o maior objeto?
 *
 * Uso: node miniatura.mjs <outDir> [baseUrl] [larguraAlvo]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const alvoPx = Number(process.argv[4] ?? 200)
const endpoint = 'http://127.0.0.1:9222'
await mkdir(outDir, { recursive: true })

const list = await fetch(`${endpoint}/json/list`).then((r) => r.json())
const target = list.find((i) => i.type === 'page')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => {
  socket.addEventListener('open', res, { once: true })
  socket.addEventListener('error', rej, { once: true })
})
let nextId = 0
const pending = new Map()
socket.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (!m.id) return
  const w = pending.get(m.id)
  if (!w) return
  pending.delete(m.id)
  m.error ? w.reject(new Error(m.error.message)) : w.resolve(m.result)
})
const cmd = (method, params = {}) => {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
const evaluate = async (expression) => {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
  return r.result.value
}

for (const largura of [1440]) {
  await cmd('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: false })
  await cmd('Page.navigate', { url: `${baseUrl}/` })
  await pause(2400)
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
    window.scrollTo(0, document.body.scrollHeight); return 1; })()`)
  await pause(1600)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(600)

  const r = await evaluate(`(() => {
    const s = document.getElementById('equipamentos');
    const b = s.getBoundingClientRect();
    return { x: Math.round(b.left + window.scrollX), y: Math.round(b.top + window.scrollY),
             w: Math.round(b.width), h: Math.round(b.height) };
  })()`)

  const escala = alvoPx / r.w
  const { data } = await cmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: escala },
  })
  const nome = `${largura}-miniatura-${alvoPx}px.png`
  await writeFile(path.join(outDir, nome), Buffer.from(data, 'base64'))
  console.log(
    `${nome}  — seção ${r.w}x${r.h} reduzida a ${Math.round(r.w * escala)}x${Math.round(r.h * escala)} (escala ${escala.toFixed(3)})`,
  )
}
socket.close()
