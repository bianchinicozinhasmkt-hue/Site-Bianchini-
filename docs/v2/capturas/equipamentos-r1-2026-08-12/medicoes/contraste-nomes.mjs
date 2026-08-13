/**
 * Contraste real dos nomes de categoria sobre a fotografia.
 *
 * Não estima: lê os pixels efetivamente pintados. Para cada `figcaption` da
 * vitrine, desenha a região correspondente da fotografia **já composta com o
 * gradiente** num canvas e calcula a luminância relativa do fundo atrás do
 * texto, faixa a faixa. O texto é `--canvas` (#EFEDEB), então o contraste é
 * calculado contra ele.
 *
 * O canvas lê a `<img>` diretamente (mesma origem, sem taint) e reaplica o
 * gradiente com os mesmos stops do CSS — é a única forma de obter o fundo
 * composto sem depender de captura de tela.
 *
 * Uso: node contraste-nomes.mjs [baseUrl] [larguras separadas por vírgula]
 */
const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3210'
const larguras = (process.argv[3] ?? '390,768,1440,1920').split(',').map(Number)
const endpoint = 'http://127.0.0.1:9222'

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
async function evaluate(expression) {
  const r = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
  return r.result.value
}

const SONDA = `(async () => {
  const lum = (r, g, b) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const CANVAS = lum(239, 237, 235); /* --canvas #EFEDEB */
  const razao = (l) => { const a = Math.max(CANVAS, l), b = Math.min(CANVAS, l); return +((a + 0.05) / (b + 0.05)).toFixed(2); };

  const out = [];
  const sec = document.getElementById('equipamentos');
  for (const fig of sec.querySelectorAll('figure')) {
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    const grad = fig.querySelector('[aria-hidden="true"]');
    if (!img || !cap) continue;

    const rf = fig.getBoundingClientRect();
    const rc = cap.getBoundingClientRect();
    const nome = (cap.innerText || '').trim();

    /* caixa de texto real: o figcaption tem padding, o texto é o filho */
    const alvo = cap.firstElementChild ?? cap;
    const rt = alvo.getBoundingClientRect();

    await img.decode().catch(() => {});
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(rf.width));
    cv.height = Math.max(1, Math.round(rf.height));
    const ctx = cv.getContext('2d', { willReadFrequently: true });

    /* replica object-fit: cover + object-position da imagem */
    const cs = getComputedStyle(img);
    const [px, py] = cs.objectPosition.split(' ');
    const fx = parseFloat(px) / 100 || 0.5;
    const fy = (py && py.includes('%') ? parseFloat(py) / 100 : 0.5);
    const escala = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
    const dw = img.naturalWidth * escala, dh = img.naturalHeight * escala;
    ctx.drawImage(img, (cv.width - dw) * fx, (cv.height - dh) * fy, dw, dh);

    /* ----------
       Reaplica o gradiente do overlay, lendo os stops do próprio CSS.

       O Chromium **omite** a posição dos stops quando ela é o default: o
       primeiro sai sem \`0%\` e o último sem \`100%\`. Casar só \`cor + posição\`
       perdia os dois extremos e o gradiente reconstruído começava em 38% —
       exatamente a faixa onde o nome é pintado ficava sem proteção, e a sonda
       reprovava um contraste que na tela existe. Aqui a posição é opcional e os
       implícitos são preenchidos: 0% no primeiro, 100% no último, distribuição
       uniforme entre stops posicionados.
       ---------- */
    let stops = null;
    if (grad) {
      const bg = getComputedStyle(grad).backgroundImage;
      const rg = grad.getBoundingClientRect();
      const m = [...bg.matchAll(/(rgba?\\([^)]+\\))(?:\\s+([\\d.]+)%)?/g)];
      if (m.length >= 2) {
        stops = m.map((x) => ({ cor: x[1], pos: x[2] === undefined ? null : parseFloat(x[2]) }));
        if (stops[0].pos === null) stops[0].pos = 0;
        if (stops[stops.length - 1].pos === null) stops[stops.length - 1].pos = 100;
        for (let i = 1; i < stops.length - 1; i++) {
          if (stops[i].pos !== null) continue;
          let j = i;
          while (j < stops.length && stops[j].pos === null) j++;
          const ini = stops[i - 1].pos, fim = stops[j].pos, n = j - i + 1;
          for (let k = i; k < j; k++) stops[k].pos = ini + ((fim - ini) * (k - i + 1)) / n;
        }
        const topo = cv.height - rg.height;
        const g2 = ctx.createLinearGradient(0, cv.height, 0, topo);
        for (const s of stops) g2.addColorStop(Math.min(1, Math.max(0, s.pos / 100)), s.cor);
        ctx.fillStyle = g2;
        ctx.fillRect(0, topo, cv.width, rg.height);
      }
    }

    /* amostra a faixa exata onde o texto é pintado */
    const x0 = Math.max(0, Math.round(rt.left - rf.left));
    const y0 = Math.max(0, Math.round(rt.top - rf.top));
    const w0 = Math.min(cv.width - x0, Math.round(rt.width));
    const h0 = Math.min(cv.height - y0, Math.round(rt.height));
    if (w0 < 2 || h0 < 2) continue;
    const dados = ctx.getImageData(x0, y0, w0, h0).data;

    let soma = 0, pior = 1, n = 0;
    for (let i = 0; i < dados.length; i += 4) {
      const l = lum(dados[i], dados[i + 1], dados[i + 2]);
      soma += l; n++;
      if (l > pior) pior = l;
    }
    const medio = soma / n;
    out.push({
      nome, w: Math.round(rf.width), h: Math.round(rf.height),
      gradiente: grad ? Math.round(grad.getBoundingClientRect().height) : 0,
      stops: stops ? stops.length : 0,
      razaoMedia: razao(medio),
      razaoPior: razao(pior),
    });
  }
  return out;
})()`

for (const w of larguras) {
  await cmd('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await cmd('Page.navigate', { url: `${baseUrl}/` })
  await pause(2200)
  await evaluate(`(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });
    window.scrollTo(0, document.body.scrollHeight); return 1; })()`)
  await pause(1400)
  await evaluate(`(()=>{window.scrollTo(0,0);return 1})()`)
  await pause(600)
  const r = await evaluate(SONDA)
  console.log(`\n--- ${w}px ---`)
  for (const c of r)
    console.log(
      `  ${c.nome.padEnd(24)} caixa ${String(c.w).padStart(4)}x${String(c.h).padEnd(4)} grad ${String(c.gradiente).padStart(3)}px/${c.stops}st  ` +
        `contraste médio ${String(c.razaoMedia).padStart(6)}:1   pior pixel ${String(c.razaoPior).padStart(6)}:1  ` +
        `${c.razaoPior >= 4.5 ? 'AA' : c.razaoPior >= 3 ? 'AA-grande' : 'REPROVA'}`,
    )
}
socket.close()
