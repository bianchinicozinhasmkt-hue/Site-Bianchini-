/**
 * Comparação antes × depois a partir dos dois `medicao.json`.
 *
 * Três coisas que o harness mede mas não conclui sozinho:
 *
 *   1. DOSSIÊ — diferença nó a nó da árvore de `/solucoes/cozinhas-industriais`.
 *      A assinatura é `tag|class` na ordem do documento, então qualquer troca de
 *      elemento, de utilitário ou de ordem aparece. O esperado é ZERO.
 *
 *   2. CARDS — o detector reconhece card por construção (superfície própria ou
 *      borda fechada). Um botão PRIMARY preenchido satisfaz "superfície própria"
 *      e é contado, embora seja **ação**, não caixa de conteúdo. Em 320 o CTA
 *      quebra em duas linhas e passa de 60px de altura, entrando no filtro. A
 *      contagem normativa exclui `a`/`button`, e as duas são impressas.
 *
 *   3. Os gates numéricos da ficha 2, lado a lado.
 */
import { readFile } from 'node:fs/promises'

const antes = JSON.parse(await readFile(process.argv[2], 'utf8'))
const depois = JSON.parse(await readFile(process.argv[3], 'utf8'))

const semAcao = (cards) => cards.filter((c) => c.tag !== 'a' && c.tag !== 'button')

console.log('=== #equipamentos — ficha 2 (documento 03) ===\n')
console.log(
  'viewport      chars        blocos      cards*       amarelos     altura            img%',
)
for (const vp of Object.keys(antes.home)) {
  const a = antes.home[vp].equipamentos
  const d = depois.home[vp].equipamentos
  const ca = semAcao(a.cards).length
  const cd = semAcao(d.cards).length
  console.log(
    `${vp.padEnd(12)} ${String(a.caracteres).padStart(4)}→${String(d.caracteres).padEnd(6)} ` +
      `${String(a.blocosTexto).padStart(2)}→${String(d.blocosTexto).padEnd(6)} ` +
      `${String(ca).padStart(2)}→${String(cd).padEnd(8)} ` +
      `${String(a.nAmarelos).padStart(2)}→${String(d.nAmarelos).padEnd(8)} ` +
      `${String(a.h).padStart(4)}→${String(d.h).padEnd(5)} (${(d.h - a.h > 0 ? '+' : '') + (d.h - a.h)})`.padEnd(18) +
      ` ${String(a.areaImagemPct).padStart(4)}→${d.areaImagemPct}`,
  )
}

console.log('\n* cards excluindo ações (a/button). Bruto, incluindo o CTA preenchido:')
for (const vp of Object.keys(antes.home)) {
  const a = antes.home[vp].equipamentos
  const d = depois.home[vp].equipamentos
  if (a.cards.length !== semAcao(a.cards).length || d.cards.length !== semAcao(d.cards).length)
    console.log(
      `   ${vp}: bruto ${a.cards.length}→${d.cards.length}  ` +
        `(ação contada: antes ${a.cards.filter((c) => c.tag === 'a' || c.tag === 'button').map((c) => `${c.w}x${c.h}`).join(',') || '—'} · ` +
        `depois ${d.cards.filter((c) => c.tag === 'a' || c.tag === 'button').map((c) => `${c.w}x${c.h}`).join(',') || '—'})`,
    )
}

console.log('\n=== protagonismo — área da protagonista × faixa inteira ===\n')
for (const vp of Object.keys(antes.home)) {
  const a = antes.home[vp].equipamentos
  const d = depois.home[vp].equipamentos
  const faixaA = +(a.areaImagemPct - a.areaProtagonistaPct).toFixed(1)
  const faixaD = +(d.areaImagemPct - d.areaProtagonistaPct).toFixed(1)
  console.log(
    `${vp.padEnd(12)} antes prot ${String(a.areaProtagonistaPct).padStart(5)}% × faixa ${String(faixaA).padStart(5)}%  ${a.areaProtagonistaPct > faixaA ? 'domina' : 'PERDE '}` +
      `   →   depois prot ${String(d.areaProtagonistaPct).padStart(5)}% × faixa ${String(faixaD).padStart(5)}%  ${d.areaProtagonistaPct > faixaD ? 'domina' : 'PERDE '}`,
  )
}

console.log('\n=== massa texto × fotografia (palco) ===\n')
for (const vp of Object.keys(antes.home)) {
  const a = antes.home[vp].equipamentos
  const d = depois.home[vp].equipamentos
  console.log(
    `${vp.padEnd(12)} ${String(a.massa?.pctFoto).padStart(5)}% → ${String(d.massa?.pctFoto).padStart(5)}% de fotografia` +
      `   (sangria direita ${a.sangria?.direita} → ${d.sangria?.direita}px)`,
  )
}

console.log('\n=== higiene ===\n')
for (const vp of Object.keys(depois.home)) {
  const d = depois.home[vp]
  console.log(
    `${vp.padEnd(12)} overflow=${d.overflow.length}  console=${d.consoleErrors.length}  http>=400=${d.httpFailures.length}  ` +
      `imgQuebrada=${d.imgsQuebradas.length}  hrefVazio=${d.hrefsVazios.length}  ancoraQuebrada=${d.ancorasQuebradas.length}`,
  )
  if (d.consoleErrors.length) console.log('    ', d.consoleErrors.slice(0, 3))
  if (d.httpFailures.length) console.log('    ', d.httpFailures.slice(0, 3))
  if (d.ancorasQuebradas.length) console.log('    ', d.ancorasQuebradas)
}

console.log('\n=== DOSSIER REGRESSION CHECK — /solucoes/cozinhas-industriais ===\n')
let falhas = 0
for (const vp of Object.keys(antes.dossie)) {
  const a = antes.dossie[vp]
  const d = depois.dossie[vp]
  const difs = []

  const maxLen = Math.max(a.arvore.length, d.arvore.length)
  const nosDif = []
  for (let i = 0; i < maxLen; i++) {
    if (a.arvore[i] !== d.arvore[i]) nosDif.push({ i, antes: a.arvore[i], depois: d.arvore[i] })
  }
  if (nosDif.length) difs.push(`árvore: ${nosDif.length} nó(s) diferentes`)

  for (const campo of ['h', 'w', 'bg', 'padding', 'nNos', 'nTextos', 'caracteres', 'html', 'docH']) {
    if (String(a[campo]) !== String(d[campo])) difs.push(`${campo}: ${a[campo]} → ${d[campo]}`)
  }

  const txtA = JSON.stringify(a.textos)
  const txtD = JSON.stringify(d.textos)
  if (txtA !== txtD) difs.push('textos diferem')

  const imgA = JSON.stringify(a.imagens)
  const imgD = JSON.stringify(d.imagens)
  if (imgA !== imgD) difs.push('imagens diferem')

  const acA = JSON.stringify(a.acoes)
  const acD = JSON.stringify(d.acoes)
  if (acA !== acD) difs.push('ações diferem')

  if (difs.length) {
    falhas++
    console.log(`${vp}  FAIL`)
    for (const dif of difs) console.log('   ·', dif)
    for (const n of nosDif.slice(0, 8)) console.log(`   #${n.i}  ${n.antes}\n        →  ${n.depois}`)
  } else {
    console.log(
      `${vp}  PASS  — ${a.nNos} nós, ${a.nTextos} textos, ${a.caracteres} caracteres, ` +
        `${a.imagens.length} imagens, ${a.acoes.length} ações, altura ${a.h}px, ${a.html} bytes de HTML: idênticos`,
    )
  }
}
console.log(
  `\nDOSSIER REGRESSION CHECK: ${falhas === 0 ? 'PASS' : 'FAIL'}  (${falhas} viewport(s) com diferença)`,
)
