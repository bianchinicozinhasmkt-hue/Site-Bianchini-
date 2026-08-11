#!/usr/bin/env node
/**
 * ============================================================
 * GERADOR DO PACOTE DE PRODUÇÃO PARA A HOSTINGER
 * ============================================================
 *
 * Monta `deploy-hostinger/` e `bianchini-hostinger.zip` a partir de um build
 * `output: 'standalone'` (ver `next.config.ts` para por que este site **não** é
 * um export estático).
 *
 * Uso:
 *
 *   NEXT_PUBLIC_SITE_URL=https://seudominio.com.br node scripts/gerar-pacote-hostinger.mjs
 *   npm run pacote:hostinger            (lê a variável do ambiente)
 *
 * ------------------------------------------------------------
 * O QUE ELE **NÃO** FAZ
 * ------------------------------------------------------------
 *
 * Não apaga `src/`, `public/`, `docs/`, `.git` nem qualquer arquivo-fonte. As
 * únicas coisas que ele remove são os **artefatos que ele próprio gera** —
 * `deploy-hostinger/` e o zip — e só para recriá-los do zero. Um gerador de
 * pacote que limpa o repositório é um destruidor de repositório.
 *
 * ------------------------------------------------------------
 * POR QUE `NEXT_PUBLIC_SITE_URL` É OBRIGATÓRIA AQUI
 * ------------------------------------------------------------
 *
 * Ela é lida em `src/data/site.ts` e, por ser `NEXT_PUBLIC_`, é **embutida no
 * bundle durante o build** — não é lida em runtime. Sem ela, `sitemap.xml`,
 * `robots.txt`, as canônicas e as imagens de Open Graph saem apontando para
 * `http://localhost:3000`, e o build passa em silêncio (só grava um aviso no
 * log). É o tipo de falha que só aparece depois de indexada, então aqui ela é
 * **fatal**: sem domínio, não há pacote.
 *
 * Trocar de domínio depois exige **regerar o pacote**, não editar arquivo no
 * servidor.
 *
 * ------------------------------------------------------------
 * PLATAFORMA
 * ------------------------------------------------------------
 *
 * O `node_modules` rastreado pelo standalone inclui binários nativos da
 * máquina de build (`sharp`, usado pelo otimizador de imagem). Gerado no
 * Windows, ele **não roda** num host Linux. Por isso o pacote traz
 * `package.json` e o lockfile: no servidor, `npm ci --omit=dev` reinstala as
 * dependências para a plataforma certa. O aviso aparece no fim da execução.
 */
import { cp, mkdir, rm, readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

const raiz = process.cwd()
const destino = path.join(raiz, 'deploy-hostinger')
const zip = path.join(raiz, 'bianchini-hostinger.zip')

const passo = (n, t) => console.log(`\n[${n}/6] ${t}`)
const erro = (m) => {
  console.error(`\n✗ ${m}\n`)
  process.exit(1)
}

/* ---------- 0. pré-condições ---------- */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
if (!siteUrl) {
  erro(
    'NEXT_PUBLIC_SITE_URL não definida.\n\n' +
      '  O domínio é embutido no bundle durante o build. Sem ele, sitemap,\n' +
      '  robots, canonical e Open Graph saem como http://localhost:3000.\n\n' +
      '  Exemplo:\n' +
      '    NEXT_PUBLIC_SITE_URL=https://bianchinicozinhas.com.br npm run pacote:hostinger',
  )
}
if (!/^https?:\/\/[^/\s]+$/.test(siteUrl)) {
  erro(`NEXT_PUBLIC_SITE_URL inválida: "${siteUrl}"\n  Esperado algo como https://bianchinicozinhas.com.br (sem barra final).`)
}
console.log(`\nDomínio de produção: ${siteUrl}`)

/* ---------- 1. limpa SÓ os artefatos deste script ---------- */
passo(1, 'Limpando artefatos anteriores (apenas deploy-hostinger/ e o zip)')
await rm(destino, { recursive: true, force: true })
await rm(zip, { force: true })

/* ---------- 2. build de produção ---------- */
passo(2, 'Build de produção (next build, output: standalone)')
/*
  O binário do Next é invocado **direto pelo Node**, e não por `npm run build`.
  No Windows, `execFileSync` recusa executar um `.cmd` sem `shell: true` (é a
  proteção contra injeção de argumento introduzida no Node 18.20/20.12), e com
  `shell: true` a linha passaria a depender de aspas do interpretador. Chamar o
  `next` diretamente evita os dois problemas e não muda o resultado — é o mesmo
  comando que `npm run build` executa.
*/
try {
  const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next')
  execFileSync(process.execPath, [nextBin, 'build'], {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl },
  })
} catch {
  erro('O build falhou. Pacote não gerado.')
}

const standalone = path.join(raiz, '.next', 'standalone')
if (!existsSync(path.join(standalone, 'server.js')))
  erro('.next/standalone/server.js não existe. `output: "standalone"` está em next.config.ts?')

/* ============================================================
   3. MONTAGEM — E A DECISÃO SOBRE O `node_modules`
   ============================================================

   O `standalone` monta um `node_modules` mínimo, rastreado, com só o que o
   servidor usa. Ele é ótimo **quando a máquina de build e o host são a mesma
   plataforma** — e é uma armadilha quando não são.

   O motivo é `sharp`, que o otimizador de imagem do `next/image` usa: ela traz
   binário nativo por plataforma (`@img/sharp-win32-x64`, `@img/sharp-linux-x64`,
   …). Um pacote gerado no Windows carrega ~20 MB de binário win32 que **não
   carrega** num host Linux — e o sintoma não é um erro claro no deploy, é
   imagem quebrada em produção.

   Por isso a montagem tem dois modos, decididos pela plataforma de build:

     linux  → o `node_modules` rastreado vai junto. O pacote é autocontido e o
              servidor só precisa de `node server.js`;
     outra  → o `node_modules` **fica de fora** e o pacote leva `package.json` +
              `package-lock.json`, para o servidor rodar `npm ci --omit=dev`.
              O ZIP encolhe de ~38 MB para ~11 MB e, mais importante, os
              binários passam a ser os da plataforma certa.

   Em nenhum dos dois casos o `node_modules` de **desenvolvimento** do projeto é
   enviado — no primeiro vai o rastreado, no segundo não vai nenhum.
   ============================================================ */
passo(3, 'Montando deploy-hostinger/')
await mkdir(destino, { recursive: true })

const autocontido = process.platform === 'linux'
console.log(
  autocontido
    ? '   modo autocontido (build em linux): node_modules rastreado incluído'
    : `   modo portátil (build em ${process.platform}): sem node_modules — o servidor roda npm ci --omit=dev`,
)

// 3a. o servidor autocontido (server.js + package.json + node_modules rastreado)
await cp(standalone, destino, {
  recursive: true,
  filter: (src) =>
    autocontido || !path.relative(standalone, src).split(path.sep).includes('node_modules'),
})

// 3b. o Next NÃO copia estes dois — é comportamento documentado, não defeito
await cp(path.join(raiz, '.next', 'static'), path.join(destino, '.next', 'static'), {
  recursive: true,
})
await cp(path.join(raiz, 'public'), path.join(destino, 'public'), { recursive: true })

/*
  3c. `package.json` e `package-lock.json` do **projeto**, intactos.

  O standalone grava um `package.json` próprio; ele é sobrescrito aqui pelo
  original de propósito. `npm ci` exige que os dois arquivos estejam em sincronia
  — um `package.json` podado contra um lockfile completo faz o comando abortar.
  Enviando o par original, `npm ci --omit=dev` instala só as cinco dependências
  de produção e ignora as de desenvolvimento, sem editar nada.
*/
await cp(path.join(raiz, 'package.json'), path.join(destino, 'package.json'))
for (const f of ['package-lock.json', 'npm-shrinkwrap.json']) {
  if (existsSync(path.join(raiz, f))) await cp(path.join(raiz, f), path.join(destino, f))
}

/* ---------- 4. poda o que não é runtime ---------- */
passo(4, 'Removendo o que não é necessário em produção')
const podar = [
  '.next/cache',
  'node_modules/.cache',
  '.git',
  '.github',
  '.vscode',
  '.idea',
  'docs',
  'src',
  'scripts',
  'coverage',
]
for (const p of podar) await rm(path.join(destino, p), { recursive: true, force: true })

// varredura por lixo espalhado e por segredo
const proibidos = /^(\.env(\..*)?|\.DS_Store|Thumbs\.db|npm-debug\.log.*|.*\.log|.*\.zip|.*\.mp4|.*\.mov)$/i
let removidos = 0
async function varrer(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      await varrer(p)
    } else if (proibidos.test(e.name)) {
      await rm(p, { force: true })
      removidos++
      console.log(`   removido: ${path.relative(destino, p)}`)
    }
  }
}
await varrer(destino)
console.log(`   ${removidos} arquivo(s) indevido(s) removido(s)`)

/* ---------- 5. auditoria do pacote ---------- */
passo(5, 'Auditando o pacote')
let arquivos = 0
let bytes = 0
async function medir(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) await medir(p)
    else {
      arquivos++
      bytes += (await stat(p)).size
    }
  }
}
await medir(destino)

// nenhuma URL de desenvolvimento pode ter sobrado no bundle servido
const suspeitas = []
async function grepDev(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue // dependências de terceiros, não nosso código
      await grepDev(p)
    } else if (/\.(js|html|json|txt|xml)$/.test(e.name)) {
      const s = await readFile(p, 'utf8').catch(() => '')
      if (/localhost:3000|127\.0\.0\.1:3\d{3}/.test(s)) suspeitas.push(path.relative(destino, p))
    }
  }
}
await grepDev(destino)
if (suspeitas.length) {
  erro(
    `URL de desenvolvimento encontrada no pacote:\n  ${suspeitas.slice(0, 10).join('\n  ')}\n\n` +
      '  Isso quer dizer que o build não recebeu NEXT_PUBLIC_SITE_URL.',
  )
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB'
console.log(`   ${arquivos} arquivos · ${mb(bytes)}`)
console.log('   sem .env, sem .git, sem docs, sem capturas, sem localhost')

/* ---------- 6. zip ---------- */
passo(6, 'Gerando bianchini-hostinger.zip')
try {
  if (process.platform === 'win32') {
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Compress-Archive -Path '${destino}\\*' -DestinationPath '${zip}' -CompressionLevel Optimal -Force`,
      ],
      { stdio: 'inherit' },
    )
  } else {
    execFileSync('zip', ['-rq', zip, '.'], { cwd: destino, stdio: 'inherit' })
  }
} catch {
  erro('Falha ao compactar. A pasta deploy-hostinger/ está pronta e pode ser enviada por FTP.')
}
const zipBytes = (await stat(zip)).size

console.log(`\n✓ Pacote pronto`)
console.log(`  deploy-hostinger/        ${arquivos} arquivos · ${mb(bytes)}`)
console.log(`  bianchini-hostinger.zip  ${mb(zipBytes)}`)
console.log(`  domínio embutido:        ${siteUrl}`)
console.log(
  autocontido
    ? `\n  Autocontido. No servidor basta:\n      node server.js`
    : `\n  Portátil (sem node_modules). No servidor, dentro da pasta:\n` +
      `      npm ci --omit=dev\n` +
      `      node server.js\n` +
      `  O npm ci é obrigatório: é ele que instala o sharp da plataforma do host.`,
)
