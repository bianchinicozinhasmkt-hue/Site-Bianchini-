#!/usr/bin/env node
/**
 * ============================================================
 * GERADOR DO PACOTE PARA O PAINEL DE IMPLANTAÇÕES DA HOSTINGER
 * ============================================================
 *
 * Monta `deploy-hostinger/` e `bianchini-hostinger.zip` com o **código-fonte**
 * do projeto — não com o build.
 *
 * Uso:
 *
 *   npm run pacote:hostinger
 *
 * ------------------------------------------------------------
 * POR QUE CÓDIGO-FONTE, E NÃO O SITE COMPILADO
 * ------------------------------------------------------------
 *
 * O painel de **Implantações** da Hostinger é um pipeline de build, não um
 * gerenciador de arquivos. Ele recebe um zip, aplica um preset ("Next.js"),
 * escolhe a versão do Node (22.x) e executa `npm install` → `npm run build` →
 * `npm start`. Quem compila é o host.
 *
 * As duas tentativas anteriores falharam justamente por não entender isso, e o
 * registro fica aqui para ninguém repetir:
 *
 *   · **`output: 'standalone'`** — enviamos o servidor já compilado. O painel
 *     rodou `next build` sobre um pacote sem `src/` e abortou com
 *     "Couldn't find any `pages` or `app` directory";
 *   · **`output: 'export'`** — enviamos o site estático. Mesmo problema no
 *     build, e `next start` ainda recusaria rodar contra um projeto exportado.
 *
 * O pacote correto é, portanto, o projeto: `src/`, `public/`, os arquivos de
 * configuração e o `package.json` com as dependências e os scripts reais.
 *
 * ------------------------------------------------------------
 * O QUE ELE **NÃO** FAZ
 * ------------------------------------------------------------
 *
 * Não apaga `src/`, `public/`, `docs/` nem `.git`. As únicas coisas que ele
 * remove são os artefatos que ele mesmo gera — `deploy-hostinger/` e o zip —, e
 * só para recriá-los.
 *
 * ------------------------------------------------------------
 * `NEXT_PUBLIC_SITE_URL` NÃO ENTRA NO PACOTE
 * ------------------------------------------------------------
 *
 * Ela é lida em `src/data/site.ts` **durante o build**, e quem executa o build
 * agora é o host. Por isso ela precisa estar em **Variáveis de ambiente** no
 * painel da Hostinger, e não num arquivo aqui dentro: um `.env` no zip seria
 * ignorado pelo pipeline na melhor hipótese, e vazaria configuração na pior.
 *
 * Sem ela, `sitemap.xml`, `robots.txt`, as canônicas e o Open Graph saem
 * apontando para `http://localhost:3000` — e o build **passa em silêncio**, só
 * gravando um aviso no log. O script avisa disso no fim.
 */
import { cp, mkdir, rm, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

const raiz = process.cwd()
const destino = path.join(raiz, 'deploy-hostinger')
const zip = path.join(raiz, 'bianchini-hostinger.zip')
const require_ = createRequire(import.meta.url)

const passo = (n, t) => console.log(`\n[${n}/5] ${t}`)
const erro = (m) => {
  console.error(`\n✗ ${m}\n`)
  process.exit(1)
}

/* ============================================================
   O QUE VAI NO PACOTE
   ============================================================

   Lista **explícita**, e não uma exclusão do que sobra. A diferença importa: com
   uma lista de exclusões, qualquer pasta nova criada no repositório entra no
   pacote por omissão — foi assim que 500 MB de capturas quase viajaram junto.
   Aqui, o que não está listado não vai.
   ============================================================ */
const incluir = [
  'src',
  'public',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'tailwind.config.ts',
  '.eslintrc.json',
  'next-env.d.ts',
]

/* ---------- 1. limpa SÓ os artefatos deste script ---------- */
passo(1, 'Limpando artefatos anteriores (apenas deploy-hostinger/ e o zip)')
await rm(destino, { recursive: true, force: true })
await rm(zip, { force: true })

/* ============================================================
   2. BUILD DE VERIFICAÇÃO
   ============================================================

   O build roda **aqui**, mesmo que o resultado não vá no pacote. A razão é
   simples: se `next build` falha nesta máquina, ele vai falhar no pipeline da
   Hostinger, e descobrir isso lá custa um ciclo inteiro de upload. É barato
   falhar cedo.

   `NEXT_PUBLIC_SITE_URL` é passada só para o build não emitir o aviso de
   localhost; ela não é gravada em lugar nenhum do pacote.
   ============================================================ */
passo(2, 'Build de verificação (o resultado não vai no pacote)')
try {
  const nextBin = require_.resolve('next/dist/bin/next')
  execFileSync(process.execPath, [nextBin, 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bianchinicozinhas.com.br',
    },
  })
} catch {
  erro('O build falhou aqui — falharia igual no painel da Hostinger. Pacote não gerado.')
}

/* ---------- 3. monta o pacote ---------- */
passo(3, 'Montando deploy-hostinger/ com o código-fonte')
await mkdir(destino, { recursive: true })
for (const item of incluir) {
  const origem = path.join(raiz, item)
  if (!existsSync(origem)) {
    console.log(`   ausente, ignorado: ${item}`)
    continue
  }
  await cp(origem, path.join(destino, item), { recursive: true })
  console.log(`   + ${item}`)
}

/* ---------- 4. auditoria ---------- */
passo(4, 'Auditando o pacote')

const proibidos = ['node_modules', '.next', 'out', '.git', 'docs', '.env', '.env.local']
for (const p of proibidos) {
  if (existsSync(path.join(destino, p))) erro(`"${p}" entrou no pacote e não deveria.`)
}

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

const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB'
console.log(`   ${arquivos} arquivos · ${mb(bytes)}`)
console.log('   sem node_modules, sem .next, sem out, sem .git, sem docs, sem .env')

/* ---------- 5. zip ---------- */
passo(5, 'Gerando bianchini-hostinger.zip')
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
  erro('Falha ao compactar. A pasta deploy-hostinger/ está pronta.')
}
const zipBytes = (await stat(zip)).size

console.log('\n✓ Pacote pronto')
console.log(`  deploy-hostinger/        ${arquivos} arquivos · ${mb(bytes)}`)
console.log(`  bianchini-hostinger.zip  ${mb(zipBytes)}`)
console.log(
  [
    '',
    '  Suba o ZIP em Implantações › Arquivos de origem › Carregar novos arquivos.',
    '  Configuração de compilação: preset Next.js, Node 22.x, diretório raiz ./',
    '',
    '  ANTES de implantar, em Variáveis de ambiente, defina:',
    '      NEXT_PUBLIC_SITE_URL = https://bianchinicozinhas.com.br',
    '  Sem ela o build passa, mas sitemap, robots e canônicas saem como localhost.',
  ].join('\n'),
)
