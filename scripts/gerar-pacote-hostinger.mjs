#!/usr/bin/env node
/**
 * ============================================================
 * GERADOR DO PACOTE DE PRODUÇÃO PARA A HOSTINGER
 * ============================================================
 *
 * Monta `deploy-hostinger/` e `bianchini-hostinger.zip` a partir de um build
 * `output: 'export'`. O resultado é uma **pasta de site estático**: joga-se no
 * painel da Hostinger e ela substitui o site anterior, sem processo Node, sem
 * instalar dependência e sem comando de start.
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
 * O QUE VAI DENTRO
 * ------------------------------------------------------------
 *
 * O conteúdo de `out/` mais um `.htaccess` gerado aqui. Nenhum `package.json`,
 * nenhum `node_modules`, nenhum `server.js` — num site estático eles não teriam
 * função, e a versão anterior deste script quebrou o deploy justamente por
 * enviar um `package.json` que fez o painel da Hostinger tentar compilar o
 * pacote.
 *
 * O `.htaccess` carrega o que o export estático não consegue emitir sozinho:
 * os dois redirects de link antigo e os cinco cabeçalhos de segurança, que
 * saíram do `next.config.ts` nesta rodada.
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
const require_ = createRequire(import.meta.url)

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
passo(2, 'Build de produção (next build, output: export)')
/*
  O binário do Next é invocado **direto pelo Node**, e não por `npm run build`.
  No Windows, `execFileSync` recusa executar um `.cmd` sem `shell: true` (é a
  proteção contra injeção de argumento introduzida no Node 18.20/20.12), e com
  `shell: true` a linha passaria a depender de aspas do interpretador. Chamar o
  `next` diretamente evita os dois problemas e não muda o resultado — é o mesmo
  comando que `npm run build` executa.
*/
try {
  const nextBin = require_.resolve('next/dist/bin/next')
  execFileSync(process.execPath, [nextBin, 'build'], {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl },
  })
} catch {
  erro('O build falhou. Pacote não gerado.')
}

const out = path.join(raiz, 'out')
if (!existsSync(path.join(out, 'index.html')))
  erro('out/index.html não existe. `output: "export"` está em next.config.ts?')

/* ============================================================
   3. MONTAGEM — A PASTA É O SITE
   ============================================================

   O export do Next já produz exatamente o que a hospedagem espera: HTML, CSS,
   JS e assets, com `index.html` na raiz. A montagem é uma cópia, mais o
   `.htaccess`.

   **Por que existe um `.htaccess`.** Com `output: 'export'` o Next deixa de
   aplicar `redirects()` e `headers()` — os dois dependem de servidor. Em vez de
   perdê-los, eles são reescritos aqui na linguagem do Apache/LiteSpeed, que é o
   que roda na Hostinger. Ver o comentário em `next.config.ts`: aquele arquivo
   deixou de ser a fonte deles, este passou a ser.
   ============================================================ */
passo(3, 'Montando deploy-hostinger/')
await mkdir(destino, { recursive: true })
await cp(out, destino, { recursive: true })

const htaccess = `# Gerado por scripts/gerar-pacote-hostinger.mjs — nao editar a mao.
# Regerar com: npm run pacote:hostinger

# ---------- Links antigos ----------
# Substituem os redirects() do next.config.ts, que o export estatico ignora.
RedirectPermanent /forno-combinado-rational /linhas-de-produtos/forno-combinado-rational/
RedirectPermanent /construcao-e-reformas /solucoes/arquitetura/

# ---------- Cabecalhos de seguranca ----------
# Substituem os headers() do next.config.ts, pela mesma razao.
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()"
</IfModule>

# ---------- Pagina de erro ----------
ErrorDocument 404 /404.html

# ---------- Cache ----------
# Os arquivos de /_next/static/ carregam hash no nome: mudou o conteudo, mudou a
# URL. Por isso podem ser cacheados por um ano com seguranca. O HTML nao pode:
# a URL dele nao muda, e um HTML cacheado seguraria a versao antiga do site no
# navegador de quem ja visitou.
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>

# ---------- Compressao ----------
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
`
await writeFile(path.join(destino, '.htaccess'), htaccess, 'utf8')
console.log('   .htaccess escrito (2 redirects + 5 cabecalhos + cache + gzip)')

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
  [
    '',
    '  Site estático: a pasta É o site.',
    '  Envie o conteúdo de deploy-hostinger/ para public_html — inclusive o',
    '  arquivo .htaccess, que costuma ficar oculto nos gerenciadores de arquivo.',
    '  Não há nada a instalar nem a iniciar.',
  ].join('\n'),
)
