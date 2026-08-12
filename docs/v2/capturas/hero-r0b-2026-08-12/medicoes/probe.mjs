const endpoint = 'http://127.0.0.1:9222'
const list = await fetch(`${endpoint}/json/list`).then(r=>r.json())
const t = list.find(i=>i.type==='page')
const s = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((res,rej)=>{s.addEventListener('open',res,{once:true});s.addEventListener('error',rej,{once:true})})
let id=0; const pend=new Map()
s.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){const w=pend.get(m.id);pend.delete(m.id); m.error?w.reject(new Error(m.error.message)):w.resolve(m.result)}})
const cmd=(method,params={})=>{const i=++id;s.send(JSON.stringify({id:i,method,params}));return new Promise((res,rej)=>pend.set(i,{resolve:res,reject:rej}))}
const ev=async(x)=>{const r=await cmd('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value}
const pause=(ms)=>new Promise(r=>setTimeout(r,ms))
await cmd('Page.enable')

for (const [w,h] of [[1024,768],[768,1024]]) {
  await cmd('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false})
  await cmd('Page.navigate',{url:'http://127.0.0.1:3210/'}); await pause(2500)
  await ev(`document.fonts.ready`)
  const out = await ev(`(()=>{
    const portas=[...document.querySelectorAll('[aria-label="Frentes da Bianchini"] [role="tab"]')];
    const res=portas.map(b=>{
      const linhas=[...b.querySelectorAll('span')].filter(s=>[...s.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
      const cue=linhas[1]; if(!cue) return null;
      const cs=getComputedStyle(cue);
      const probe=document.createElement('span');
      probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;';
      probe.style.font=cs.font; probe.style.letterSpacing=cs.letterSpacing;
      probe.textContent=cue.textContent; document.body.appendChild(probe);
      const nat=probe.getBoundingClientRect().width; probe.remove();
      return {nome:b.id.replace('hero-aba-',''), texto:cue.textContent.slice(0,44),
        natural:+nat.toFixed(1), util:+cue.getBoundingClientRect().width.toFixed(1),
        linhas:Math.round(cue.getBoundingClientRect().height/parseFloat(cs.lineHeight)),
        fontSize:cs.fontSize};
    });
    // largura útil que existiria com 1fr/1fr/1fr
    const fila=portas[0].parentElement; const gap=parseFloat(getComputedStyle(fila).columnGap);
    const total=portas.reduce((a,b)=>a+b.getBoundingClientRect().width,0);
    const pad=parseFloat(getComputedStyle(portas[0]).paddingLeft)*2;
    return JSON.stringify({res, igual:+((total/3)-pad).toFixed(1),
      alturaPorta:+portas[0].getBoundingClientRect().height.toFixed(1)});
  })()`)
  console.log(w+'×'+h, out)
}
s.close()
