# Deploy na Hostinger — painel de Implantações

STATUS: ACTIVE · procedimento operacional.

O painel **Implantações** é um pipeline de build: você sobe um zip do **código-fonte**, ele
roda `npm install` → `npm run build` → `npm start`. Quem compila é o host, não a sua máquina.

Isso é o oposto de subir arquivos prontos, e foi o que derrubou as duas primeiras tentativas:

| tentativa | o que foi enviado | erro |
| --- | --- | --- |
| 1ª | build `standalone` | `Couldn't find any pages or app directory` |
| 2ª | site estático (`out/`) | mesmo erro no build |
| **3ª** | **código-fonte** | ✅ |

## O que enviar

```
C:\Users\gabri\Desktop\Coisas\Projeto-Bianchini\bianchini-hostinger.zip
```

20,2 MB · 194 arquivos · gerado por `npm run pacote:hostinger`.

Dentro: `src/`, `public/`, `package.json`, `package-lock.json` e os arquivos de configuração.
Sem `node_modules`, sem `.next`, sem `out`, sem `docs`, sem `.git`.

## Passo a passo

**1. Variáveis de ambiente — faça isto ANTES de implantar.**
No menu lateral, em **Variáveis de ambiente**:

| nome | valor |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://bianchinicozinhas.com.br` |

Ela é lida durante o build. Sem ela o build passa em silêncio, mas `sitemap.xml`,
`robots.txt`, as canônicas e o Open Graph saem apontando para `http://localhost:3000` — falha
que só aparece depois de indexada.

**2. Implantações › Arquivos de origem** → *Carregar novos arquivos* → envie o ZIP.

**3. Configuração de compilação:**

| campo | valor |
| --- | --- |
| Configuração predefinida | `Next.js` |
| Versão do node | `22.x` |
| Diretório raiz | `./` |
| Comando de instalação | `npm ci` (ou `npm install`) |
| Comando de compilação | `npm run build` |
| Comando de início | `npm start` |
| Diretório de saída | `.next` |

Se algum desses campos não existir no seu painel, é porque o preset Next.js já o preenche.

**4. Salve e implante.** O primeiro build leva alguns minutos (instala ~366 pacotes e compila
19 rotas). Acompanhe em **Logs de execução**.

## Validação

- `/` — primeira dobra com as três portas
- `/contato` — WhatsApp **+55 21 96469-0650**
- `/sitemap.xml` — URLs com o seu domínio, nunca `localhost`
- `/forno-combinado-rational` — redireciona para `/linhas-de-produtos/forno-combinado-rational`

## Testado antes de entregar

O ZIP foi extraído numa pasta limpa e submetido à mesma sequência do painel:

- `npm install` → 366 pacotes;
- `npm run build` → compila e gera as 19 rotas, exit 0;
- `npm start` → sobe.

Com o servidor no ar: 10 rotas em 200, redirect legado em 308, cabeçalhos de segurança
emitidos, WhatsApp `5521964690650`, sitemap com o domínio real, e `/_next/image` devolvendo
**AVIF de 32 KB** — a otimização de imagem funciona, porque aqui existe servidor.

## Avisos esperados no log

**`5 high severity vulnerabilities` depois do `npm install`.** Vêm de dependências de
desenvolvimento (eslint 8 e transitivas) e de `sharp <0.35.0`. Nenhuma executa em produção
servindo páginas. **Não rode `npm audit fix --force`**: ele sobe o `sharp` para fora da faixa
que o Next 15.5.22 declara e altera dependências que não foram validadas contra este build.

**Avisos de `deprecated`** (`inflight`, `glob@7`, `rimraf@3`, `@humanwhocodes/*`) são
transitivos do eslint. Ruído de instalação, não erro.

## Se der "Falha ao salvar as configurações de implantação"

É erro do formulário do painel, não do pacote. Verifique, nesta ordem:

1. algum campo obrigatório da *Configuração de compilação* em branco — preencha com a tabela
   acima;
2. o upload do ZIP concluiu antes de você salvar;
3. tente salvar as **Variáveis de ambiente** primeiro, separadamente, e depois a configuração
   de compilação.

## Se o domínio for outro

Basta trocar `NEXT_PUBLIC_SITE_URL` em Variáveis de ambiente e reimplantar. Como o build roda
no host, **não é preciso regerar o ZIP**.

## Variáveis de ambiente

Uma só, e não é segredo:

| variável | quando | valor |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | a URL pública, sem barra final |

Nenhuma chave, token ou credencial é usada pelo projeto — o formulário de contato não tem
backend: monta a mensagem e abre WhatsApp ou e-mail.
