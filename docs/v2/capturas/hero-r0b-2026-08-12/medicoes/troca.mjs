/* §27 — a troca de cena continua espacial: sem apagão, sem crossfade, sem ghosting.
   Amostra a luminância média de uma faixa da área de mídia (fora da coluna de texto)
   a cada ~60ms durante a troca. Apagão = queda brusca comum; crossfade = as duas
   cenas somadas. Aqui a curva tem de ser monótona e contínua, sem vale. */
const list = await fetch('http://127.0.0.1:9222/json/list').then(r=>r.json())
const s = new WebSocket(list.find(i=>i.type==='page').webSocketDebuggerUrl)
await new Promise((res,rej)=>{s.addEventListener('open',res,{once:true});s.addEventListener('error',rej,{once:true})})
let id=0; const pend=new Map()
s.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){const w=pend.get(m.id);pend.delete(m.id); m.error?w.reject(new Error(m.error.message)):w.resolve(m.result)}})
const cmd=(m,p={})=>{const i=++id;s.send(JSON.stringify({id:i,method:m,params:p}));return new Promise((res,rej)=>pend.set(i,{resolve:res,reject:rej}))}
const ev=async x=>{const r=await cmd('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms))
await cmd('Page.enable')
await cmd('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false})
await cmd('Page.navigate',{url:'http://127.0.0.1:3210/'}); await pause(3000); await ev('document.fonts.ready')

await ev(`window.__lum=(u,x,y,w,h)=>new Promise(r=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');
  c.width=i.width;c.height=i.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(i,0,0);
  const d=g.getImageData(x,y,w,h).data;let s=0,n=0;for(let p=0;p<d.length;p+=16){s+=0.2126*d[p]+0.7152*d[p+1]+0.0722*d[p+2];n++;}
  r(+(s/n).toFixed(2));};i.onerror=()=>r(null);i.src=u;})`)
/* faixa de mídia: metade direita do palco, acima das portas e fora da coluna de texto */
const FAIXA = { x: 820, y: 120, w: 600, h: 420 }
const amostra = async () => {
  const shot = await cmd('Page.captureScreenshot', { format: 'png' })
  return ev(`window.__lum('data:image/png;base64,${shot.data}',${FAIXA.x},${FAIXA.y},${FAIXA.w},${FAIXA.h})`)
}
for (const [de, para, i] of [['equipamentos','projetos',1], ['projetos','consultoria',2]]) {
  const base = await amostra()
  await ev(`(()=>{[...document.querySelectorAll('[aria-label="Frentes da Bianchini"] [role="tab"]')][${i}].click();return 1})()`)
  const serie = [base]
  for (let k = 0; k < 14; k++) serie.push(await amostra())
  await pause(1500)
  serie.push(await amostra())
  const min = Math.min(...serie), max = Math.max(...serie)
  console.log(`${de} → ${para}`)
  console.log('  série:', serie.join(' '))
  console.log(`  min ${min} | max ${max} | piso dos extremos ${Math.min(serie[0], serie[serie.length-1])} | apagão? ${min < Math.min(serie[0], serie[serie.length-1]) * 0.6 ? 'SIM' : 'não'}`)
}
s.close()
