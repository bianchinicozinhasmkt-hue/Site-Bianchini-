/**
 * Recorte ampliado dos nomes de categoria, direto do compositor do navegador.
 *
 * A sonda de contraste calcula a média sobre a caixa do texto, e a caixa é
 * maior que os glifos — um pixel claro no canto dela não decide legibilidade.
 * Aqui não há reconstrução nenhuma: `Page.captureScreenshot` com `clip` e
 * `scale`, então o que aparece é exatamente o que o Chromium pintou.
 *
 * Uso: node zoom-nomes.mjs <outDir> [baseUrl] [largura]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const largura = Number(process.argv[4] ?? 1440)
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

await cmd('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: false })
await cmd('Page.navigate', { url: `${baseUrl}/` })
await pause(2400)
/* `scroll-smooth` está no `html` do projeto: sem desligar, a rolagem ainda está
   em curso quando as caixas são lidas e tudo cai fora da janela. */
await evaluate(`(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
  window.scrollTo(0, document.body.scrollHeight); return 1; })()`)
await pause(1500)

/* rola de modo que a faixa inteira esteja na janela, e devolve as caixas em coordenadas de página */
const alvo = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  const ul = sec.querySelector('ul');
  const r = ul.getBoundingClientRect();
  const y = Math.round(r.top + window.scrollY - 120);
  window.scrollTo(0, y);
  return { y };
})()`)
await pause(800)

/* ----------
   `clip` de `Page.captureScreenshot` é em coordenadas **de página**, não de
   janela: passar `getBoundingClientRect()` cru recorta um retângulo deslocado
   pelo scroll — no primeiro teste todos saíram no off-white do `body`. Daí o
   `+ window.scrollY / scrollX`.
   ---------- */
const caixas = await evaluate(`(() => {
  const sec = document.getElementById('equipamentos');
  return [...sec.querySelectorAll('figure')].map((f, i) => {
    const cap = f.querySelector('figcaption');
    const r = cap.getBoundingClientRect();
    return {
      i,
      nome: (cap.innerText || '').trim(),
      x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
    };
  });
})()`)

for (const c of caixas) {
  const { data } = await cmd('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: c.x, y: c.y, width: c.w, height: c.h, scale: 4 },
  })
  const nome = `${largura}-nome-${c.i}-${c.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '-')}.png`
  await writeFile(path.join(outDir, nome), Buffer.from(data, 'base64'))
  console.log(`  ${nome}  (${c.w}x${c.h} @4x)`)
}
socket.close()
