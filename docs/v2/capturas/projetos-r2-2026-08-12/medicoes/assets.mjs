/**
 * R2 — dimensão real e peso de cada fotografia do acervo de Projetos, lidas do cabeçalho
 * do arquivo (JPEG SOF / PNG IHDR). Não depende do navegador nem de biblioteca.
 *
 * Uso: node assets.mjs
 */
import { readFile, stat, readdir } from 'node:fs/promises'
import path from 'node:path'

const raiz = path.resolve(process.cwd(), '../../../../..')
const pastas = ['public/images/projects', 'public/images/hero']

function dimensoes(buf) {
  /* PNG */
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), tipo: 'png' }
  }
  /* JPEG: percorre os marcadores até um SOF (0xC0..0xCF, menos C4/C8/CC) */
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue }
      const marcador = buf[i + 1]
      if (marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), tipo: 'jpeg' }
      }
      i += 2 + buf.readUInt16BE(i + 2)
    }
  }
  return null
}

const linhas = []
for (const pasta of pastas) {
  const dir = path.join(raiz, pasta)
  let arquivos = []
  try { arquivos = await readdir(dir) } catch { continue }
  for (const nome of arquivos.sort()) {
    if (!/\.(jpe?g|png|webp)$/i.test(nome)) continue
    const p = path.join(dir, nome)
    const buf = await readFile(p)
    const s = await stat(p)
    const d = dimensoes(buf)
    linhas.push({
      arquivo: `${pasta.replace('public/images/', '')}/${nome}`,
      w: d?.w ?? null,
      h: d?.h ?? null,
      proporcao: d ? +(d.w / d.h).toFixed(2) : null,
      kb: Math.round(s.size / 1024),
      tipo: d?.tipo ?? path.extname(nome).slice(1),
    })
  }
}

linhas.sort((a, b) => (b.w ?? 0) * (b.h ?? 0) - (a.w ?? 0) * (a.h ?? 0))
console.log('arquivo'.padEnd(46), 'W×H'.padEnd(12), 'prop'.padEnd(7), 'KB')
for (const l of linhas) {
  console.log(
    l.arquivo.padEnd(46),
    `${l.w}×${l.h}`.padEnd(12),
    String(l.proporcao).padEnd(7),
    l.kb,
  )
}
console.log(JSON.stringify(linhas, null, 1))
