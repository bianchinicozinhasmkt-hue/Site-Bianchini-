/**
 * Inventário dos assets candidatos a `#equipamentos`: dimensão real, peso e
 * densidade de pixels contra a escala de renderização da composição nova.
 *
 * Lê a dimensão direto do cabeçalho do JPEG/PNG (SOF0..SOF3 / IHDR) — sem
 * dependência nova, que o projeto não aceita.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const DIRS = ['public/images/projects', 'public/images/hero', 'public/images/equipment']

function dimJpeg(buf) {
  let i = 2
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
    }
    i += 2 + buf.readUInt16BE(i + 2)
  }
  return null
}
function dimPng(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}

const linhas = []
for (const dir of DIRS) {
  let arquivos
  try {
    arquivos = await readdir(dir)
  } catch {
    continue
  }
  for (const nome of arquivos) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(nome)) continue
    const p = path.join(dir, nome)
    const buf = await readFile(p)
    const { size } = await stat(p)
    let d = null
    if (buf[0] === 0xff && buf[1] === 0xd8) d = dimJpeg(buf)
    else if (buf[0] === 0x89 && buf[1] === 0x50) d = dimPng(buf)
    linhas.push({
      arquivo: '/' + p.replace(/\\/g, '/').replace(/^public\//, ''),
      w: d?.w ?? null,
      h: d?.h ?? null,
      mp: d ? +((d.w * d.h) / 1e6).toFixed(2) : null,
      kb: Math.round(size / 1024),
      razao: d ? +(d.w / d.h).toFixed(2) : null,
    })
  }
}

linhas.sort((a, b) => (b.w ?? 0) - (a.w ?? 0))
for (const l of linhas) {
  console.log(
    `${String(l.w).padStart(5)}x${String(l.h).padEnd(5)} r=${String(l.razao).padEnd(5)} ${String(l.kb).padStart(5)}kB  ${l.arquivo}`,
  )
}
