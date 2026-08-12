/* Isola o efeito vertical de D-2: mede com 1.15fr e, no mesmo carregamento,
   força `repeat(3,1fr)` e remede. D-1/D-4 ficam constantes (nenhum dos dois
   toca layout: `.door::before` é absoluto com `inset:0`). */
const list = await fetch('http://127.0.0.1:9222/json/list').then(r=>r.json())
const s = new WebSocket(list.find(i=>i.type==='page').webSocketDebuggerUrl)
await new Promise((res,rej)=>{s.addEventListener('open',res,{once:true});s.addEventListener('error',rej,{once:true})})
let id=0; const pend=new Map()
s.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){const w=pend.get(m.id);pend.delete(m.id); m.error?w.reject(new Error(m.error.message)):w.resolve(m.result)}})
const cmd=(m,p={})=>{const i=++id;s.send(JSON.stringify({id:i,method:m,params:p}));return new Promise((res,rej)=>pend.set(i,{resolve:res,reject:rej}))}
const ev=async x=>{const r=await cmd('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms))
await cmd('Page.enable')

const LER = `(()=>{const p=[...document.querySelectorAll('[aria-label="Frentes da Bianchini"] [role="tab"]')];
  const sec=document.querySelector('section[aria-labelledby="hero-titulo"]');
  const linhas=b=>{const l=[...b.querySelectorAll('span')].filter(s=>[...s.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
    return l.map(el=>Math.round(el.getBoundingClientRect().height/parseFloat(getComputedStyle(el).lineHeight))).join('+');};
  return JSON.stringify({heroBottom:+sec.getBoundingClientRect().bottom.toFixed(1),
    alturas:p.map(b=>+b.getBoundingClientRect().height.toFixed(1)),
    larguras:p.map(b=>+b.getBoundingClientRect().width.toFixed(1)),
    linhas:p.map(linhas),
    ovf:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)});})()`

console.log('vw × h |            estado | heroBottom | alturas | larguras | linhas nome+cue | ovf')
for (const [w,h] of [[1024,768],[1366,768],[1440,900],[1600,900],[1920,1080]]) {
  await cmd('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false})
  await cmd('Page.navigate',{url:'http://127.0.0.1:3210/'}); await pause(2600); await ev('document.fonts.ready')
  const dep = JSON.parse(await ev(LER))
  await ev(`(()=>{document.querySelector('[aria-label="Frentes da Bianchini"]').style.gridTemplateColumns='repeat(3, minmax(0, 1fr))';return 1})()`)
  await pause(500)
  const ant = JSON.parse(await ev(LER))
  const fmt=(t,o)=>`${String(w).padStart(4)}×${h} | ${t.padStart(17)} | ${String(o.heroBottom).padStart(10)} | ${o.alturas.join('/')} | ${o.larguras.join('/')} | ${o.linhas.join(' ')} | ${o.ovf}`
  console.log(fmt('1fr/1fr/1fr (antes)', ant))
  console.log(fmt('1.15fr (depois)', dep))
}
s.close()
