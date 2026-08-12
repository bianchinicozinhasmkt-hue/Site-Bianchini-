/**
 * Close dos quatro estados de um PRIMARY de seção, em 1440.
 *
 * Vive fora do harness principal porque as duas coordenadas envolvidas são de sistemas
 * diferentes — o recorte da captura é em **coordenadas de página** e o ponteiro em
 * **coordenadas de viewport** — e misturá-las produz captura vazia ou clique fora do
 * alvo. Aqui o alvo é trazido à vista uma vez e os dois valores são lidos depois disso.
 *
 * Uso: node estados-close.mjs <outDir> <baseUrl>
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = process.argv[2]
const baseUrl = process.argv[3] ?? 'http://127.0.0.1:3210'
await mkdir(outDir, { recursive: true })

const list = await fetch('http://127.0.0.1:9222/json/list').then((r) => r.json())
const s = new WebSocket(list.find((i) => i.type === 'page').webSocketDebuggerUrl)
await new Promise((res, rej) => {
  s.addEventListener('open', res, { once: true })
  s.addEventListener('error', rej, { once: true })
})
let id = 0
const pend = new Map()
s.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pend.has(m.id)) {
    const w = pend.get(m.id)
    pend.delete(m.id)
    m.error ? w.reject(new Error(`${m.error.message} ${JSON.stringify(m.error.data ?? '')}`)) : w.resolve(m.result)
  }
})
const cmd = (m, p = {}) => {
  const i = ++id
  s.send(JSON.stringify({ id: i, method: m, params: p }))
  return new Promise((res, rej) => pend.set(i, { resolve: res, reject: rej }))
}
const ev = async (x) => {
  const r = await cmd('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + (r.exceptionDetails.exception?.description ?? ''))
  return r.result.value
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))

await cmd('Page.enable')
await cmd('Runtime.enable')
await cmd('Emulation.setFocusEmulationEnabled', { enabled: true })
await cmd('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

/*
  `/obrigado` é curta e tem um PRIMARY de seção logo abaixo da dobra.

  O alvo é achado **por construção**, não por `href`: um `a` cujo `::before` é a camada
  de preenchimento. Um seletor por destino pegava o link de texto que aponta para a
  mesma rota — 161 × 17px em vez de 243 × 50 —, e aí `:hover` e `:active` aplicavam
  corretamente num elemento que simplesmente não tem `transform` de pressão. O sintoma
  parecia "a pressão não funciona"; era o alvo errado.
*/
const ROTA = '/obrigado'
/*
  `.isolate` é da base do botão e nenhum link de texto a carrega — é o discriminador
  barato entre o `LinkButton` e o `ArrowLink` que aponta para a mesma rota.
*/
const SEL = 'main a.isolate'

/*
  ---------- A FOLHA DE ESTILO PRECISA SER CONFERIDA, NÃO PRESUMIDA ----------

  Este headless, depois de muitas navegações, às vezes entrega o HTML **sem aplicar o
  CSS**: o `<link>` está no `head`, o `document.styleSheets` conta as folhas, e mesmo
  assim o botão renderiza `display: inline`, `padding: 0` e Times New Roman. Medido
  assim, um `LinkButton` de 243 × 50 sai como 161 × 17 e a pressão parece não existir —
  conclusão falsa sobre o produto, causada pelo instrumento.

  O sinal barato de "CSS aplicado" é a família: o rótulo do botão é Oswald. Enquanto não
  for, recarrega.
*/
async function carregar() {
  for (let tentativa = 1; tentativa <= 4; tentativa++) {
    await cmd('Page.navigate', { url: baseUrl + ROTA })
    await pause(2600)
    await ev('document.fonts.ready')
    await ev(`(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.body.scrollHeight);return 1})()`)
    await pause(900)
    await ev(`(()=>{window.scrollTo(0,0);return 1})()`)
    await pause(700)
    /*
      O critério é **só a família**. Checar `display === 'inline-flex'` junto parecia mais
      seguro e era o contrário: neste botão a utilidade de largura o resolve como `flex`,
      então o guard reprovava uma página perfeitamente estilada.
    */
    const ok = await ev(
      `(() => { const a = document.querySelector('${SEL}');
        return a ? /Oswald/i.test(getComputedStyle(a).fontFamily) : false; })()`,
    )
    if (ok) return tentativa
    console.log(`  (tentativa ${tentativa}: CSS não aplicado, recarregando)`)
    await pause(800)
  }
  throw new Error('CSS não aplicou depois de 4 tentativas — instrumento, não produto')
}
console.log('carregado na tentativa', await carregar())
await ev(`(()=>{document.querySelector('${SEL}').scrollIntoView({block:'center'});return 1})()`)
await pause(800)

const geo = JSON.parse(
  await ev(`(() => {
    const r = document.querySelector('${SEL}').getBoundingClientRect();
    return JSON.stringify({
      clip: { x: Math.max(0, r.x + window.scrollX - 26), y: Math.max(0, r.y + window.scrollY - 26),
              width: r.width + 52, height: r.height + 52 },
      ponto: { x: r.x + r.width / 2, y: r.y + r.height / 2 },
      texto: document.querySelector('${SEL}').textContent.trim() });
  })()`),
)
console.log('alvo:', geo.texto, '| clip', JSON.stringify(geo.clip), '| ponto', JSON.stringify(geo.ponto))

const snap = async (nome) => {
  const shot = await cmd('Page.captureScreenshot', { format: 'png', clip: { ...geo.clip, scale: 3 } })
  await writeFile(path.join(outDir, `1440-primary-${nome}.png`), Buffer.from(shot.data, 'base64'))
  console.log('  ', nome)
}

const { x, y } = geo.ponto
await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 0 })
await pause(500)
await snap('default')

await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 })
await pause(700)
await snap('hover')

await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 0 })
await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', text: '\t', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 })
await pause(150)
await ev(`(()=>{document.querySelector('${SEL}').focus();return 1})()`)
await pause(600)
console.log('   focus-visible?', await ev(`document.querySelector('${SEL}').matches(':focus-visible')`))
await snap('focus')

await ev(`(()=>{document.querySelector('${SEL}').blur();return 1})()`)
/*
  O ponteiro é recalculado aqui: `focus()` rola o elemento para a vista por conta
  própria, então a posição de viewport lida antes do foco já não vale. O recorte da
  captura não precisa disso — ele é em coordenadas de página, que a rolagem não muda.
*/
const p2 = JSON.parse(
  await ev(`(() => { const r = document.querySelector('${SEL}').getBoundingClientRect();
    return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 }); })()`),
)
await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p2.x, y: p2.y, buttons: 0 })
await pause(300)
await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: p2.x, y: p2.y, button: 'left', clickCount: 1, buttons: 1 })
await pause(320)
console.log('   transform na pressão:', await ev(`getComputedStyle(document.querySelector('${SEL}')).transform`))
await snap('active')
/* release longe do alvo: pressionar e soltar no mesmo elemento dispararia navegação */
await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3, buttons: 1 })
await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 3, y: 3, button: 'left', clickCount: 1, buttons: 0 })

s.close()
