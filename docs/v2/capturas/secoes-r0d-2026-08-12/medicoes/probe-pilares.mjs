/**
 * R0-D — sonda de altura de `#pilares`.
 *
 * O briefing §8 exige investigar quando o texto cai e a altura não acompanha. Esta sonda
 * responde à pergunta certa: **qual elemento dita a altura da linha**, e quantas linhas
 * cada bloco ocupa antes e depois do corte. Sem isso não dá para distinguir
 * "altura artificial" (que a rodada pode corrigir) de "o corte não removeu linha nesta
 * largura" (que é resultado, não defeito).
 */
import { writeFile } from 'node:fs/promises'

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3210'
const out = process.argv[3]
const endpoint = 'http://127.0.0.1:9222'

const list = await fetch(`${endpoint}/json/list`).then((r) => r.json())
const target = list.find((i) => i.type === 'page')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res) => socket.addEventListener('open', res, { once: true }))

let nextId = 0
const pending = new Map()
const waiters = []
socket.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id) {
    const w = pending.get(m.id)
    if (!w) return
    pending.delete(m.id)
    m.error ? w.reject(new Error(m.error.message)) : w.resolve(m.result)
    return
  }
  for (let i = waiters.length - 1; i >= 0; i--)
    if (waiters[i].method === m.method) {
      waiters[i].resolve(m.params)
      waiters.splice(i, 1)
    }
})
const cmd = (method, params = {}) => {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
const waitFor = (method) =>
  new Promise((resolve) => {
    waiters.push({ method, resolve })
    setTimeout(resolve, 12000)
  })
const evaluate = async (expression) => {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text)
  return r.result.value
}

await cmd('Runtime.enable')
await cmd('Page.enable')

const SONDA = `(() => {
  const r2 = (n) => +n.toFixed(1);
  const sec = document.getElementById('pilares');
  const linhas = (el) => {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
    return Math.round(el.getBoundingClientRect().height / lh);
  };
  const cab = sec.querySelector('.grid');
  const titulo = sec.querySelector('h2');
  const apoio = cab.querySelector('p');
  const ul = sec.querySelector('ul');
  const itens = [...ul.children].map((li) => {
    const rot = li.querySelector('p');
    const perg = li.querySelector('h3');
    const desc = li.querySelectorAll('p')[1];
    const acao = li.lastElementChild;
    return {
      nome: rot.innerText.trim(),
      hLi: r2(li.getBoundingClientRect().height),
      hPergunta: r2(perg.getBoundingClientRect().height),
      linhasPergunta: linhas(perg),
      hDescricao: r2(desc.getBoundingClientRect().height),
      linhasDescricao: linhas(desc),
      /* o vão que o mt-auto abre entre a descrição e a ação = folga da coluna */
      folgaAteAcao: r2(acao.getBoundingClientRect().top - desc.getBoundingClientRect().bottom),
      hAcao: r2(acao.getBoundingClientRect().height),
      minHeight: getComputedStyle(li).minHeight,
    };
  });
  return {
    hSecao: r2(sec.getBoundingClientRect().height),
    padding: getComputedStyle(sec).paddingTop + ' / ' + getComputedStyle(sec).paddingBottom,
    hCabecalho: r2(cab.getBoundingClientRect().height),
    linhasTitulo: linhas(titulo),
    hApoio: r2(apoio.getBoundingClientRect().height),
    linhasApoio: linhas(apoio),
    hUl: r2(ul.getBoundingClientRect().height),
    vaoCabecalhoLista: r2(ul.getBoundingClientRect().top - cab.getBoundingClientRect().bottom),
    itens,
    /* quem dita a linha */
    maisAlto: itens.reduce((a, b) => (b.hLi > a.hLi ? b : a)).nome,
  };
})()`

const VPS = [
  [390, 844],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
]
const res = {}
for (const [w, h] of VPS) {
  await cmd('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: false,
  })
  const loaded = waitFor('Page.loadEventFired')
  await cmd('Page.navigate', { url: `${baseUrl}/` })
  await loaded
  await pause(600)
  await evaluate(`document.fonts.ready`)
  await evaluate(
    `(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));return 1})()`,
  )
  await pause(400)
  res[`${w}x${h}`] = await evaluate(SONDA)
  const s = res[`${w}x${h}`]
  console.log(
    `${w}x${h}  secao=${s.hSecao}  cab=${s.hCabecalho} (titulo ${s.linhasTitulo}L, apoio ${s.linhasApoio}L)  ul=${s.hUl}  dita=${s.maisAlto}`,
  )
  for (const i of s.itens)
    console.log(
      `   ${i.nome.padEnd(13)} li=${String(i.hLi).padStart(6)}  pergunta ${i.linhasPergunta}L  descricao ${i.linhasDescricao}L (${i.hDescricao})  folga→acao=${i.folgaAteAcao}  minH=${i.minHeight}`,
    )
}
if (out) await writeFile(out, JSON.stringify(res, null, 1))
socket.close()
