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
const require_ = createRequire(import.meta.url)
const pkgProjeto = JSON.parse(await readFile(path.join(raiz, 'package.json'), 'utf8'))

/** Versão exata que este build usou — não a faixa declarada no projeto. */
const versaoInstalada = (nome) => require_(`${nome}/package.json`).version

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
  const nextBin = require_.resolve('next/dist/bin/next')
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
   3. MONTAGEM — SEM `node_modules`, COM MANIFESTO DE RUNTIME
   ============================================================

   O `standalone` monta um `node_modules` rastreado, e a tentação é enviá-lo:
   o pacote fica autocontido e o servidor só precisaria de `node server.js`.
   **Não funciona neste caso, por duas razões independentes.**

   ------------------------------------------------------------
   1. Binário nativo é da plataforma de build
   ------------------------------------------------------------

   `sharp` — que o otimizador do `next/image` usa — traz binário por sistema
   operacional. Medido, o pacote gerado aqui carregava 20 MB de
   `@img/sharp-win32-x64`, que **não carrega** num host Linux. O sintoma não
   seria erro no deploy: seria imagem quebrada em produção.

   ------------------------------------------------------------
   2. O painel da Hostinger roda `npm install` + `npm run build`
   ------------------------------------------------------------

   Isto foi descoberto **em produção**, e é o que quebrou o primeiro deploy. A
   versão anterior deste script enviava o `package.json` **do projeto**, com
   `"build": "next build"` e as devDependencies inteiras. O painel:

     · rodou `npm install` → instalou 365 pacotes, incluindo eslint e
       typescript, que não têm nenhuma função em runtime;
     · rodou `npm run build` → `next build` procurou `src/app`, que
       deliberadamente não existe num pacote **já compilado**, e abortou com
       "Couldn't find any `pages` or `app` directory".

   Brigar com essa automação é frágil. O certo é o pacote **ser** o que a
   automação espera: um app Node comum, com um `package.json` que declara só o
   runtime e cujo `build` não tem nada a fazer.

   ------------------------------------------------------------
   A montagem, então
   ------------------------------------------------------------

   Um caminho só, igual em qualquer plataforma de build: **nenhum
   `node_modules` viaja**. O pacote leva `server.js`, `.next/`, `public/` e um
   manifesto mínimo; o host instala as quatro dependências de runtime para a
   própria arquitetura. Fica maior no primeiro deploy e correto em todos.
   ============================================================ */
passo(3, 'Montando deploy-hostinger/')
await mkdir(destino, { recursive: true })
console.log('   sem node_modules — o host instala as dependências de runtime')

// 3a. o servidor standalone, sem o node_modules rastreado
await cp(standalone, destino, {
  recursive: true,
  filter: (src) => !path.relative(standalone, src).split(path.sep).includes('node_modules'),
})

// 3b. o Next NÃO copia estes dois — é comportamento documentado, não defeito
await cp(path.join(raiz, '.next', 'static'), path.join(destino, '.next', 'static'), {
  recursive: true,
})
await cp(path.join(raiz, 'public'), path.join(destino, 'public'), { recursive: true })

/* ============================================================
   3c. O MANIFESTO DE RUNTIME
   ============================================================

   Escrito do zero, e **não** copiado do projeto. O `package.json` do
   repositório descreve como *desenvolver* o site; este descreve como *executar*
   o que já foi compilado. São documentos diferentes, e enviar o primeiro no
   lugar do segundo foi o que quebrou o primeiro deploy.

   As quatro dependências saem de fatos verificáveis, não de estimativa:

     next, react, react-dom  `.next/standalone/server.js` faz
                             `require('next')` e
                             `require('next/dist/server/lib/start-server')`, e o
                             render das páginas precisa do par react
     sharp                   otimizador de imagem do `next/image`. É
                             `optionalDependency` do próprio Next, mas fica
                             **explícita** aqui: se o npm a pular por qualquer
                             razão, o sintoma é imagem quebrada em produção, e
                             uma dependência declarada falha alto em vez de
                             falhar em silêncio

   Versões travadas nas que este build usou. Não são faixas (`^`) de propósito:
   o pacote foi testado contra estas, e um `npm install` no servidor daqui a três
   meses não deve trazer uma minor diferente da validada.

   Fora ficam `clsx` e `tailwind-merge` — o compilador do Next as embute nos
   chunks — e todo o bloco de desenvolvimento (eslint, typescript, tailwind,
   postcss, autoprefixer, @types/*), que não executa nada em produção.

   `scripts.build` é um **no-op declarado**. O painel da Hostinger o executa
   automaticamente depois do install; como o app já vem compilado, a resposta
   correta é dizer isso e sair com 0. Deixá-lo como `next build` é o que
   produziu "Couldn't find any `pages` or `app` directory".
   ============================================================ */
const manifesto = {
  name: 'bianchini-cozinhas',
  version: pkgProjeto.version,
  private: true,
  description: 'Site institucional da Bianchini — pacote de produção pré-compilado',
  scripts: {
    build: 'node -e "console.log(\'Aplicação já compilada no pacote — nada a fazer.\')"',
    start: 'node server.js',
  },
  dependencies: {
    next: pkgProjeto.dependencies.next.replace(/^[\^~]/, ''),
    react: versaoInstalada('react'),
    'react-dom': versaoInstalada('react-dom'),
    sharp: versaoInstalada('sharp'),
  },
  /*
    ---------- `overrides` viaja junto (2026-08-11) ----------

    O projeto declara `overrides: { postcss: "^8.5.25" }` para forçar uma versão
    corrigida de uma dependência **transitiva** do Next. Sem ele no manifesto, o
    `npm install` do servidor resolvia `postcss` pela faixa do próprio Next e
    trazia uma versão vulnerável — medido: `npm audit` acusava
    `postcss <=8.5.22, severity high` no pacote instalado.

    Isto não é uma decisão nova de dependência: é a decisão que o repositório já
    tomou, que o `package.json` do projeto registra, e que eu tinha deixado para
    trás ao escrever o manifesto do zero. Copiar o bloco inteiro em vez de
    reescrevê-lo garante que qualquer override futuro acompanhe sem outra
    correção aqui.
  */
  ...(pkgProjeto.overrides ? { overrides: pkgProjeto.overrides } : {}),
  engines: pkgProjeto.engines,
}
await writeFile(
  path.join(destino, 'package.json'),
  JSON.stringify(manifesto, null, 2) + '\n',
  'utf8',
)

/*
  Nenhum lockfile é enviado. O do projeto descreve a árvore de desenvolvimento
  inteira e não bate com este manifesto — `npm ci` abortaria por dessincronia.
  Sem lockfile, `npm install` resolve as quatro dependências travadas acima, que
  é exatamente o que o painel da Hostinger executa.
*/

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
  `\n  No servidor, dentro da pasta:\n` +
    `      npm install      (4 dependências de runtime, na arquitetura do host)\n` +
    `      npm start        (= node server.js)\n\n` +
    `  O painel da Hostinger faz o install e chama "npm run build" sozinho —\n` +
    `  o build deste pacote é um no-op declarado, porque o app já vem compilado.`,
)
