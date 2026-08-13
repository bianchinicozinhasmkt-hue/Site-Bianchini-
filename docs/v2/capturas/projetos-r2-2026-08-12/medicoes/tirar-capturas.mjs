/**
 * R2 — capturas de `#projetos`.
 *
 * Separado de `measure-r2.mjs` pelo mesmo motivo que a corrida foi fatiada: uma conexão
 * CDP longa atravessando dezenas de navegações enforca o socket. Aqui cada invocação faz
 * um modo e uma largura.
 *
 * Uso: node tirar-capturas.mjs <outDir> <baseUrl> --modo=<inteira|momentos|dossie> --vp=<W>
 *
 * `inteira`  — a seção inteira, sem cortar: a janela ganha a altura da seção. A posição é
 *              medida **depois** do redimensionamento; a hero é dimensionada em `svh`, e
 *              crescer a janela cresce a hero e empurra `#projetos` para baixo.
 * `momentos` — entrando · centro · saindo, mais as duas passagens (equipamentos→projetos
 *              e projetos→pilares), na janela real da largura.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
const modo = (process.argv.find((a) => a.startsWith('--modo=')) ?? '--modo=inteira').slice(7)
const vp = Number((process.argv.find((a) => a.startsWith('--vp=')) ?? '--vp=1440').slice(5))
const alturaJanela = { 320: 568, 390: 844, 768: 1024, 1024: 768, 1366: 768, 1440: 900, 1600: 900, 1920: 1080 }

const shotsDir = path.join(outDir, 'shots')
await mkdir(shotsDir, { recursive: true })

const endpoint = 'http://127.0.0.1:9222'
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
})
function cmd(method, params = {}, ms = 180000) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return Promise.race([
    new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
    new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout CDP ${method}`)), ms)),
  ])
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
function waitFor(method, timeout = 20000) {
  return new Promise((resolve) => {
    const w = { method, resolve }
    waiters.push(w)
    setTimeout(() => {
      const i = waiters.indexOf(w)
      if (i >= 0) { waiters.splice(i, 1); resolve(null) }
    }, timeout)
  })
}
async function evaluate(expression, ms = 120000) {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, ms)
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text ?? 'erro')
  return r.result.value
}
await cmd('Runtime.enable')
await cmd('Page.enable')

const setViewport = (w, h) =>
  cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false })

async function goto(url) {
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url })
  await loaded
  await pause(500)
  await evaluate(`document.fonts.ready`)
  await evaluate(`(()=>{document.documentElement.style.scrollBehavior='auto';return 1})()`)
  /* `.photo-mask`/`.line-mask` junto com `.reveal` — o recorte fechado do contêiner zera a
     interseção da `<img>` e o lazy loading nativo nunca dispara. Ver a nota longa em
     `measure-r2.mjs`. */
  await evaluate(`(() => {
    document.querySelectorAll('.reveal, .photo-mask, .line-mask').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
    return 1;
  })()`)
  await evaluate(`(()=>{window.scrollTo(0,document.body.scrollHeight);return 1})()`)
  await pause(1100)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(700)
  await esperarImagens()
}

/**
 * Barreira de decodificação. Promover `loading="lazy"` a `eager` só **inicia** o
 * carregamento; sem esperar por ele a frisa sai com as caixas vazias — o leito claro no
 * lugar da fotografia. Precisa ser rechamada depois de cada mudança de viewport: crescer a
 * janela troca o `sizes` resolvido e o Next serve outro arquivo, que nasce não decodificado.
 */
async function esperarImagens() {
  const pendentes = await evaluate(
    `(async () => {
      const imgs = [...document.images];
      await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth > 0)
        ? Promise.resolve()
        : new Promise((r) => {
            i.addEventListener('load', r, { once: true });
            i.addEventListener('error', r, { once: true });
            setTimeout(r, 20000);
          })));
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      return imgs.filter((i) => !(i.complete && i.naturalWidth > 0))
        .map((i) => (i.currentSrc || i.src).slice(-70));
    })()`,
    30000,
  )
  if (pendentes.length) console.warn('  ! imagens não carregadas:', pendentes)
  await pause(300)
  return pendentes
}

const shot = async (nome) => {
  const { data } = await cmd('Page.captureScreenshot', { format: 'png' })
  await writeFile(path.join(shotsDir, `${nome}.png`), Buffer.from(data, 'base64'))
  console.log('  ·', nome)
}
const rolarPara = async (y) => {
  await evaluate(`(()=>{window.scrollTo(0,${Math.max(0, Math.round(y))});return 1})()`)
  await pause(500)
}
const medir = (id) =>
  evaluate(`(() => { const el = document.getElementById('${id}');
    if (!el) return null; const r = el.getBoundingClientRect();
    return { y: Math.round(r.top + window.scrollY), h: Math.round(r.height) }; })()`)

if (modo === 'inteira' || modo === 'dossie') {
  const url = modo === 'dossie' ? `${baseUrl}/solucoes/cozinhas-industriais` : `${baseUrl}/`
  const nome = modo === 'dossie' ? `${vp}-dossier-cozinhas-industriais` : `${vp}-projetos-inteira`
  await setViewport(vp, 900)
  await goto(url)
  const primeira = await medir('projetos')
  await setViewport(vp, Math.min(primeira.h + 48, 12000))
  await pause(600)
  const alvo = await medir('projetos')
  if (Math.abs(alvo.h - primeira.h) > 2) {
    await setViewport(vp, Math.min(alvo.h + 48, 12000))
    await pause(500)
  }
  const final = await medir('projetos')
  await rolarPara(final.y - 24)
  await esperarImagens()
  await pause(400)
  await shot(nome)
  console.log(`${vp} inteira: h=${final.h}px`)
}

if (modo === 'momentos') {
  const h = alturaJanela[vp] ?? 900
  await setViewport(vp, h)
  await goto(`${baseUrl}/`)
  const p = await medir('projetos')
  const pil = await medir('pilares')
  await rolarPara(p.y - h * 0.82)
  await shot(`${vp}-projetos-entrando`)
  await rolarPara(p.y + p.h / 2 - h / 2)
  await shot(`${vp}-projetos-centro`)
  await rolarPara(p.y + p.h - h * 0.18)
  await shot(`${vp}-projetos-saindo`)
  await rolarPara(p.y - h / 2)
  await shot(`${vp}-T-equipamentos-projetos`)
  if (pil) {
    await rolarPara(pil.y - h / 2)
    await shot(`${vp}-T-projetos-pilares`)
  }
  console.log(`${vp} momentos: y=${p.y} h=${p.h}`)
}

/* saída explícita: o handle do WebSocket mantém o processo vivo e o runner só o mataria
   no `timeout` — ver a nota equivalente em `measure-r2.mjs`. */
socket.close()
process.exit(0)
