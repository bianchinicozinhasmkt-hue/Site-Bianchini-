/**
 * Reteste isolado de duas medições que a primeira passada contaminou.
 *
 * 1. **focus-visible por Tab.** A passada anterior media `active` antes dele — e
 *    soltar o botão sobre o CTA é um clique real: a página navegava e a varredura por
 *    `Tab` recomeçava noutra rota. Aqui o foco é medido primeiro, numa carga limpa,
 *    só com teclado.
 * 2. **backdrop no telefone.** O ponto de clique era "fundo do painel + 30px", que em
 *    320 × 568 cai **dentro** do painel. Aqui o ponto vem da área de backdrop
 *    realmente exposta; se não houver nenhuma, isso é registrado como fato
 *    geométrico do viewport, não como falha do menu.
 */
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
    m.error ? w.reject(new Error(m.error.message)) : w.resolve(m.result)
  }
})
const cmd = (m, p = {}) => {
  const i = ++id
  s.send(JSON.stringify({ id: i, method: m, params: p }))
  return new Promise((res, rej) => pend.set(i, { resolve: res, reject: rej }))
}
const ev = async (x) => {
  const r = await cmd('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.text + ' :: ' + (r.exceptionDetails.exception?.description ?? ''))
  return r.result.value
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
/**
 * `rawKeyDown` **não** executa a ação padrão do navegador — foi por isso que a
 * primeira tentativa deu 24 `Tab` sem mover o foco. Para travessia de foco é preciso
 * `keyDown` (com `text`), que é o que o Chrome trata como tecla real.
 */
const tecla = async (key, code, vk, text) => {
  await cmd('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key,
    code,
    windowsVirtualKeyCode: vk,
    nativeVirtualKeyCode: vk,
    ...(text ? { text } : {}),
  })
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk })
  await pause(120)
}
const clicar = async (x, y) => {
  await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1, buttons: 1 })
  await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1, buttons: 0 })
  await pause(700)
}
await cmd('Page.enable')
await cmd('Runtime.enable')
/*
  Sem `setFocusEmulationEnabled` o Chromium headless trata a página como não-focada e
  **descarta a travessia de foco do `Tab`** — o evento chega ao DOM, mas a ação padrão
  do navegador não roda. Foi isso, e não o produto, que produziu "24 Tabs sem sair do
  BODY" na primeira tentativa.
*/
await cmd('Emulation.setFocusEmulationEnabled', { enabled: true })

const CTA = 'header a[href*="/contato"]'
const GATILHO = 'header button[aria-expanded]'

const carregar = async (w, h) => {
  await cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false })
  await cmd('Page.navigate', { url: 'http://127.0.0.1:3210/' })
  await pause(2600)
  await ev('document.fonts.ready')
  await ev('(()=>{window.scrollTo(0,0);return 1})()')
  /*
    O gatilho do menu só responde depois da hidratação: `MobileMenu` monta o portal
    num `useEffect`, e antes disso o clique cai num botão sem manipulador. Esperar o
    `aria-controls` apontar para um painel existente é o sinal barato de que o
    componente está vivo — sem isso, a primeira tentativa media um painel fechado e
    concluía, errado, que o backdrop não fechava.
  */
  for (let i = 0; i < 40; i++) {
    const pronto = await ev(`(() => {
      const g = document.querySelector('${GATILHO}');
      return !!(g && g.getAttribute('aria-controls') && document.getElementById(g.getAttribute('aria-controls')));
    })()`)
    if (pronto) break
    await pause(150)
  }
  await pause(300)
}

/** Aciona o gatilho e confirma o estado pedido, com uma tentativa de repique. */
const alternarMenu = async (esperado) => {
  const p = JSON.parse(
    await ev(`(()=>{const r=document.querySelector('${GATILHO}').getBoundingClientRect();
      return JSON.stringify({x:r.x+r.width/2,y:r.y+r.height/2});})()`),
  )
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    await clicar(p.x, p.y)
    const atual = await ev(`document.querySelector('${GATILHO}').getAttribute('aria-expanded')`)
    if (atual === esperado) return true
    await pause(400)
  }
  return false
}

const AMOSTRADOR = `
window.__el = document.querySelector('${CTA}');
window.__caixa = (() => {
  const no = [...window.__el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  const rg = document.createRange(); rg.selectNode(no);
  const r = rg.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, color: getComputedStyle(window.__el).color };
})();
window.__am = (u, c) => new Promise(res => {
  const i = new Image();
  i.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = i.width; cv.height = i.height;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.drawImage(i, 0, 0);
    const sg = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    const L = (r, gg, b) => 0.2126 * sg(r) + 0.7152 * sg(gg) + 0.0722 * sg(b);
    const d = g.getImageData(Math.floor(c.x), Math.floor(c.y), Math.ceil(c.w), Math.ceil(c.h)).data;
    const m = c.color.match(/[0-9.]+/g).map(Number);
    const lt = L(m[0], m[1], m[2]);
    let p = Infinity, px = null;
    for (let q = 0; q < d.length; q += 4) {
      const lb = L(d[q], d[q+1], d[q+2]);
      const rr = (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05);
      if (rr < p) { p = rr; px = [d[q], d[q+1], d[q+2]]; }
    }
    res({ pior: +p.toFixed(2), px });
  };
  i.onerror = () => res(null);
  i.src = u;
});
1`

/* ---------- 1. focus-visible, só por teclado ---------- */
console.log('=== FOCUS-VISIBLE (1440, carga limpa, só teclado) ===')
await carregar(1440, 900)
let n = 0
let achou = false
const ordem = []
while (n < 24 && !achou) {
  await tecla('Tab', 'Tab', 9, '\t')
  n++
  ordem.push(
    await ev(
      `(()=>{const a=document.activeElement;return (a.tagName||'')+':'+((a.textContent||'').trim().slice(0,22));})()`,
    ),
  )
  achou = await ev(`document.activeElement === document.querySelector('${CTA}')`)
}
await pause(600)
console.log('ordem de tabulação até o CTA:', ordem.join(' → '))
console.log(
  await ev(`(() => {
    const e = document.querySelector('${CTA}');
    const c = getComputedStyle(e), b = getComputedStyle(e, '::before');
    const r = e.getBoundingClientRect();
    return JSON.stringify({ tabs: ${n}, alcancado: ${achou},
      focusVisible: e.matches(':focus-visible'),
      fill: b.transform, fillBg: b.backgroundColor,
      sombra: c.boxShadow, transform: c.transform,
      outline: c.outlineStyle + ' ' + c.outlineWidth,
      caixa: r.width.toFixed(1) + 'x' + r.height.toFixed(1) + ' @' + r.x.toFixed(1) + ',' + r.y.toFixed(1) }, null, 1);
  })()`),
)
await ev(AMOSTRADOR)
await ev("(()=>{window.__el.style.color='transparent';return 1})()")
await pause(180)
const shot = await cmd('Page.captureScreenshot', { format: 'png' })
await ev("(()=>{window.__el.style.color='';return 1})()")
console.log(
  'contraste do rótulo em focus-visible:',
  await ev(`window.__am('data:image/png;base64,${shot.data}', window.__caixa).then(r => JSON.stringify(r))`),
)

/* ---------- 2. backdrop e CTA no telefone ---------- */
for (const [w, h] of [[390, 844], [320, 568]]) {
  console.log(`\n=== TELEFONE ${w}x${h} ===`)
  await carregar(w, h)
  const p = JSON.parse(
    await ev(`(()=>{const r=document.querySelector('${GATILHO}').getBoundingClientRect();
      return JSON.stringify({x:r.x+r.width/2,y:r.y+r.height/2});})()`),
  )
  console.log('abriu pelo botão:', await alternarMenu('true'))

  const geo = JSON.parse(
    await ev(`(() => {
      const g = document.querySelector('${GATILHO}');
      const painel = document.getElementById(g.getAttribute('aria-controls'));
      const pr = painel.getBoundingClientRect();
      const bd = [...document.querySelectorAll('div[aria-hidden="true"]')]
        .find(d => getComputedStyle(d).position === 'fixed' && getComputedStyle(d).zIndex === '40');
      const br = bd ? bd.getBoundingClientRect() : null;
      return JSON.stringify({ painelBottom: +pr.bottom.toFixed(1), painelH: +pr.height.toFixed(1),
        viewportH: window.innerHeight,
        backdropTop: br ? +br.top.toFixed(1) : null, backdropOpacity: bd ? getComputedStyle(bd).opacity : null,
        areaExposta: +(window.innerHeight - pr.bottom).toFixed(1),
        painelRolavel: painel.scrollHeight > painel.clientHeight });
    })()`),
  )
  console.log('geometria do painel:', JSON.stringify(geo))

  if (geo.areaExposta > 6) {
    const y = geo.painelBottom + Math.min(20, geo.areaExposta / 2)
    await clicar(w / 2, y)
    console.log(
      `clique no backdrop em y=${y.toFixed(0)} →`,
      await ev(`JSON.stringify({expanded:document.querySelector('${GATILHO}').getAttribute('aria-expanded'),
        overflow:document.body.style.overflow})`),
    )
  } else {
    console.log('SEM área de backdrop exposta: o painel preenche a janela (rolável). Não há o que clicar.')
    await alternarMenu('false')
  }

  /* reabre e mede o CTA do painel com ele visível */
  console.log('reabriu:', await alternarMenu('true'))
  console.log(
    'CTA do painel:',
    await ev(`(() => {
      const g = document.querySelector('${GATILHO}');
      const painel = document.getElementById(g.getAttribute('aria-controls'));
      const a = painel.querySelector('a[href*="/contato"]');
      const r = a.getBoundingClientRect(); const c = getComputedStyle(a);
      return JSON.stringify({ texto: a.textContent.trim(), href: a.getAttribute('href'),
        alvo: r.width.toFixed(1) + 'x' + r.height.toFixed(1), raio: c.borderRadius, sombra: c.boxShadow });
    })()`),
  )

  const cp = JSON.parse(
    await ev(`(() => {
      const g = document.querySelector('${GATILHO}');
      const painel = document.getElementById(g.getAttribute('aria-controls'));
      const a = painel.querySelector('a[href*="/contato"]');
      a.scrollIntoView({ block: 'center' });
      const r = a.getBoundingClientRect();
      return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
    })()`),
  )
  await clicar(cp.x, cp.y)
  await pause(1400)
  console.log(
    'após clicar no CTA do painel:',
    await ev(`JSON.stringify({ rota: location.pathname + location.search,
      overflowPreso: document.body.style.overflow,
      classePresa: document.documentElement.classList.contains('mobile-menu-open'),
      necessidadePreSelecionada: (document.querySelector('#necessidade,[name="necessidade"]') || {}).value ?? null })`),
  )
}
s.close()
