/* Close-up das portas (cor + escala de cinza) numa base qualquer. */
const [outDir, baseUrl] = [process.argv[2], process.argv[3]]
const { writeFile, mkdir } = await import('node:fs/promises')
const path = await import('node:path')
await mkdir(outDir, { recursive: true })
const list = await fetch('http://127.0.0.1:9222/json/list').then(r=>r.json())
const s = new WebSocket(list.find(i=>i.type==='page').webSocketDebuggerUrl)
await new Promise((res,rej)=>{s.addEventListener('open',res,{once:true});s.addEventListener('error',rej,{once:true})})
let id=0; const pend=new Map()
s.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){const w=pend.get(m.id);pend.delete(m.id); m.error?w.reject(new Error(m.error.message)):w.resolve(m.result)}})
const cmd=(m,p={})=>{const i=++id;s.send(JSON.stringify({id:i,method:m,params:p}));return new Promise((res,rej)=>pend.set(i,{resolve:res,reject:rej}))}
const ev=async x=>{const r=await cmd('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms))
await cmd('Page.enable')
const P = `[aria-label="Frentes da Bianchini"] [role="tab"]`
for (const [w,h] of [[1440,900],[1024,768],[390,844]]) {
  await cmd('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false})
  await cmd('Page.navigate',{url:baseUrl+'/'}); await pause(2800); await ev('document.fonts.ready')
  await ev(`(()=>{window.scrollTo(0,0);return 1})()`); await pause(400)
  const clip = JSON.parse(await ev(`(()=>{const p=[...document.querySelectorAll('${P}')];
    const a=p[0].getBoundingClientRect(), c=p[2].getBoundingClientRect();
    const head=document.querySelector('[class*="decisionHead"]').getBoundingClientRect();
    return JSON.stringify({x:Math.max(0,a.x-14),y:Math.max(0,head.y-16),
      width:Math.min(${w},c.right-a.x+28),height:(a.bottom-head.y)+34});})()`))
  for (const cinza of [false, true]) {
    if (cinza) { await ev(`(()=>{document.documentElement.style.filter='grayscale(1)';return 1})()`); await pause(250) }
    const shot = await cmd('Page.captureScreenshot',{format:'png',clip:{...clip,scale:2}})
    await writeFile(path.join(outDir, `${w}-portas-close${cinza?'-cinza':''}.png`), Buffer.from(shot.data,'base64'))
    if (cinza) await ev(`(()=>{document.documentElement.style.filter='';return 1})()`)
  }
  console.log('close', w)
}
s.close()
