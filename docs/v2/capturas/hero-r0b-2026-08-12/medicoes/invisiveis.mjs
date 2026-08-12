const list = await fetch('http://127.0.0.1:9222/json/list').then(r=>r.json())
const s = new WebSocket(list.find(i=>i.type==='page').webSocketDebuggerUrl)
await new Promise((res,rej)=>{s.addEventListener('open',res,{once:true});s.addEventListener('error',rej,{once:true})})
let id=0; const pend=new Map()
s.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){const w=pend.get(m.id);pend.delete(m.id); m.error?w.reject(new Error(m.error.message)):w.resolve(m.result)}})
const cmd=(m,p={})=>{const i=++id;s.send(JSON.stringify({id:i,method:m,params:p}));return new Promise((res,rej)=>pend.set(i,{resolve:res,reject:rej}))}
const ev=async x=>{const r=await cmd('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms))
await cmd('Page.enable')
await cmd('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
await cmd('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false})
await cmd('Page.navigate',{url:'http://127.0.0.1:3210/'}); await pause(3000); await ev('document.fonts.ready')
console.log(await ev(`JSON.stringify([...document.querySelectorAll('section[aria-labelledby="hero-titulo"] *')]
  .filter(el=>{const cs=getComputedStyle(el);const r=el.getBoundingClientRect();
    return r.width>4&&r.height>4&&parseFloat(cs.opacity)<0.05&&cs.visibility!=='hidden';})
  .map(el=>({tag:el.tagName, cls:(el.className.baseVal!==undefined?el.className.baseVal:el.className||'').toString().slice(0,70),
             txt:el.textContent.trim().slice(0,32), ariaHidden:el.getAttribute('aria-hidden'),
             pai:el.parentElement.tagName+'.'+(el.parentElement.className.baseVal!==undefined?'':(el.parentElement.className||'').toString().slice(0,40))})), null, 1)`))
/* máscara das cenas: nada pode ficar preso fechado */
console.log(await ev(`JSON.stringify([...document.querySelectorAll('[class*="frame"]')].map(f=>({
  ariaHidden:f.getAttribute('aria-hidden'), opacity:getComputedStyle(f).opacity,
  mask:getComputedStyle(f).webkitMaskPosition||getComputedStyle(f).maskPosition,
  transform:getComputedStyle(f).transform, anim:getComputedStyle(f).animationName})))`))
s.close()
