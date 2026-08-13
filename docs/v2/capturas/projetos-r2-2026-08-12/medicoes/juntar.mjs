/**
 * R2 — consolida os `medicao-<largura>.json` de uma corrida em um `medicao.json` único e
 * imprime a tabela de inventário da seção.
 *
 * Uso: node juntar.mjs <antes|depois>
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const dir = process.argv[2] ?? 'antes'
const arquivos = (await readdir(dir)).filter((f) => /^medicao-.+\.json$/.test(f))
const juntos = { home: {}, dossie: {}, partes: arquivos.sort() }

for (const f of arquivos) {
  const j = JSON.parse(await readFile(path.join(dir, f), 'utf8'))
  Object.assign(juntos.home, j.home)
  Object.assign(juntos.dossie, j.dossie)
  juntos.baseUrl = j.baseUrl
}

await writeFile(path.join(dir, 'medicao.json'), JSON.stringify(juntos, null, 1))

const ordem = (k) => Number(k.split('x')[0])
const chaves = Object.keys(juntos.home).sort((a, b) => ordem(a) - ordem(b))

const col = (s, n) => String(s).padStart(n)
console.log(`\n=== ${dir.toUpperCase()} — inventário de #projetos ===\n`)
console.log(
  'viewport'.padEnd(11),
  col('altura', 7), col('chars', 6), col('blocos', 7), col('cards', 6), col('hair', 5),
  col('amar', 5), col('imgs', 5), col('foto%', 6), col('A/Btot', 7), col('A%foto', 7),
  col('rompem', 7), col('ovf', 4),
)
for (const k of chaves) {
  const p = juntos.home[k].projetos
  const m = p.massaFoto
  console.log(
    k.padEnd(11),
    col(p.h, 7), col(p.caracteres, 6), col(p.blocosTexto, 7),
    col(p.nCards, 6), col(p.nHairlines, 5), col(p.nAmarelos, 5), col(p.nImagens, 5),
    col(p.areaImagemPct, 6), col(m.A_sobre_Btotal, 7), col(m.A_pct_da_area_fotografica, 7),
    col(p.nRompem, 7), col(juntos.home[k].overflow.length, 4),
  )
}

/* cards reais = superfícies autônomas; leito de fotografia não conta */
console.log('\n--- cards por construção (leito de fotografia marcado) ---')
for (const k of chaves) {
  const p = juntos.home[k].projetos
  const reais = p.cards.filter((c) => !c.leitoDeFoto)
  console.log(`${k}: ${p.nCards} detectados, ${reais.length} autônomos`)
  for (const c of reais) console.log('   ', c.tag, c.motivo, `${c.w}x${c.h}`, c.cls.slice(0, 80))
}

console.log('\n--- amarelos ---')
for (const k of chaves) {
  const p = juntos.home[k].projetos
  console.log(`${k}: ${p.nAmarelos}`)
  for (const a of p.amarelos) console.log('   ', a.via, a.txt ?? '', (a.cls || '').slice(0, 62))
}

console.log('\n--- hairlines ---')
for (const k of chaves) {
  const p = juntos.home[k].projetos
  console.log(`${k}: ${p.nHairlines}`)
  for (const h of p.hairlines) console.log('   ', h.via, h.cor, (h.cls || '').slice(0, 62))
}

console.log('\n--- imagens e sangria ---')
for (const k of chaves) {
  const p = juntos.home[k].projetos
  console.log(`${k}  guia=${p.guia?.w}px [${p.guia?.left}..${p.guia?.right}]`)
  for (const i of p.imagens) {
    const s = (p.sangriaPorImagem ?? []).find((x) => x.src === i.src && x.rompeDireita !== undefined)
    console.log(
      '   ', i.src.padEnd(34), `${i.w}x${i.h}`.padEnd(12),
      'arq=' + i.natural.padEnd(10), 'amp=' + i.ampliacao,
      s ? `rompe=${s.rompe} full=${s.fullBleed}` : '',
    )
  }
}

console.log('\n--- estrutura do mosaico ---')
for (const k of chaves) {
  const p = juntos.home[k].projetos
  const c = p.contentores.find((x) => x.tag === 'ul')
  console.log(`${k}: ${c ? `${c.display} · cols=${c.gridTemplateColumns} · columnCount=${c.columnCount} · gap=${c.gap}` : '—'}`)
}

console.log('\n--- ações e legendas ---')
for (const k of chaves) {
  const p = juntos.home[k].projetos
  console.log(`${k}: ${p.nAcoes} ação(ões) · ${p.nLegendas} legendas`)
  for (const a of p.acoes) console.log('    CTA:', a.papel, a.txt, '→', a.href, `${a.w}x${a.h}`)
}

console.log('\n--- saúde ---')
for (const k of chaves) {
  const h = juntos.home[k]
  console.log(
    `${k}: console=${h.consoleErrors.length} http=${h.httpFailures.length} imgsQuebradas=${h.imgsQuebradas.length} hrefsVazios=${h.hrefsVazios.length} ancoras=${h.ancorasQuebradas.length} overflow=${h.overflow.length}`,
  )
  if (h.consoleErrors.length) console.log('    ', h.consoleErrors.slice(0, 3))
  if (h.httpFailures.length) console.log('    ', h.httpFailures.slice(0, 3))
}

console.log('\n--- vizinhas (y, altura, fundo) ---')
for (const k of chaves) {
  const v = juntos.home[k].vizinhas
  console.log(
    `${k}: equipamentos y=${v.equipamentos?.y} h=${v.equipamentos?.h} | projetos y=${v.projetos?.y} h=${v.projetos?.h} bg=${v.projetos?.bg} | pilares y=${v.pilares?.y} h=${v.pilares?.h} bg=${v.pilares?.bg}`,
  )
}

const d = juntos.dossie
if (Object.keys(d).length) {
  console.log('\n--- dossiê (/solucoes/cozinhas-industriais) ---')
  for (const k of Object.keys(d)) {
    console.log(`${k}: h=${d[k].h}px nos=${d[k].nNos} textos=${d[k].nTextos} chars=${d[k].caracteres} imgs=${d[k].imagens.length} html=${d[k].html}B`)
  }
}
