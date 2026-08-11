# Deploy na Hostinger

STATUS: ACTIVE · procedimento operacional.

## Antes de tudo: este site precisa de Node

Não é um site estático e **não sobe em hospedagem compartilhada de PHP**.
Contrate **VPS** ou um plano com **Node.js**.

Export estático foi avaliado e recusado: desligaria os dois redirects de URL antiga, os cinco
cabeçalhos de segurança e a otimização de imagem do `next/image` (os PNG da primeira dobra
passariam a ser servidos no tamanho original). A justificativa completa está no comentário de
`next.config.ts`.

## O que usar

| artefato | o que é |
| --- | --- |
| `bianchini-hostinger.zip` | **envie este** — 21,2 MB, 259 arquivos |
| `deploy-hostinger/` | a mesma coisa descompactada, caso prefira FTP direto |

Os dois são gerados por `npm run pacote:hostinger` e **não** são versionados.

## Passo a passo

**1. Contrate/acesse um VPS ou plano Node.js** com Node 20 ou superior
(`engines` do projeto exige `>=20.9.0`).

**2. Envie `bianchini-hostinger.zip`** para a pasta da aplicação — pelo Gerenciador de
Arquivos do hPanel ou por FTP.

**3. Apague o conteúdo antigo** da pasta antes de extrair. Se havia um site anterior ali,
remova tudo, inclusive `index.html` e `.htaccess` remanescentes.

**4. Extraia o ZIP na raiz da aplicação.** Ao final a pasta tem exatamente isto:

```
server.js            ← o servidor
package.json
package-lock.json
.next/               ← build (server + static)
public/              ← imagens, fontes e assets
```

**5. Configure o Node** no painel da Hostinger:

| campo | valor |
| --- | --- |
| Arquivo de entrada / startup | `server.js` |
| Comando de start | `npm start` (equivale a `node server.js`) |
| Versão do Node | 20 ou superior |
| Variável `PORT` | a que o painel indicar (o `server.js` a respeita) |
| Variável `HOSTNAME` | `0.0.0.0` |

**6. Deixe o painel instalar.** A Hostinger roda `npm install` e depois `npm run build`
sozinha — os dois estão previstos:

- `npm install` traz **4 dependências** de runtime (`next`, `react`, `react-dom`, `sharp`),
  compiladas para a arquitetura do servidor. O pacote não traz `node_modules` de propósito:
  o `sharp`, que faz a otimização de imagem, tem binário por sistema operacional, e enviar o
  binário da máquina de build quebraria as imagens em produção;
- `npm run build` **não compila nada** — o app já vem compilado, e o script apenas informa
  isso e sai com sucesso. Se você vir *"Aplicação já compilada no pacote — nada a fazer"*,
  está certo.

Se preferir fazer à mão pelo SSH, dentro da pasta: `npm install` e depois `npm start`.

**7. Inicie a aplicação** e aponte o domínio para ela. Ative SSL (Let's Encrypt no hPanel) —
o site envia `Strict-Transport-Security`, que só faz sentido sobre HTTPS.

**8. Valide** abrindo, nesta ordem:

- `/` — a primeira dobra com as três portas;
- `/contato` — confirme o WhatsApp **+55 21 96469-0650**;
- `/sitemap.xml` — as URLs têm de começar com o seu domínio, **nunca** com `localhost`;
- `/forno-combinado-rational` — tem de redirecionar para `/linhas-de-produtos/forno-combinado-rational`.

## Se o domínio for outro

O domínio é **embutido no build**, não lido em runtime — trocá-lo exige **regerar o pacote**,
não editar arquivo no servidor:

```bash
NEXT_PUBLIC_SITE_URL=https://o-dominio-certo.com.br npm run pacote:hostinger
```

O pacote atual foi gerado com `https://bianchinicozinhas.com.br`.

## O que NÃO subir

`src/` · `docs/` · `node_modules/` de desenvolvimento · `.git/` · `.next/cache/` ·
`deploy-hostinger/` (é a origem do ZIP, não um extra) · capturas de tela · `.env` de qualquer
tipo · o repositório inteiro.

## Variáveis de ambiente

Uma só, e **não é segredo**:

| variável | quando | valor |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **build** | a URL pública, sem barra final |

`PORT` e `HOSTNAME` são do servidor e o painel da Hostinger normalmente as define sozinho.
Nenhuma chave, token ou credencial é usada pelo projeto — o formulário de contato não tem
backend: ele monta a mensagem e abre WhatsApp ou e-mail.

## Aviso conhecido do `npm audit`

Depois do install, o `npm audit` acusa **2 vulnerabilidades high**, as duas do mesmo pacote:
`sharp <0.35.0`, por CVEs herdadas da libvips.

**Não rode `npm audit fix --force`.** Ele subiria o `sharp` para fora da faixa que o Next
15.5.22 declara (`^0.34.3`), e a correção não foi validada contra este build. A condição é
anterior a este pacote — o repositório usa a mesma versão — e a decisão de atualizar é do
gestor, não do deploy.

O `postcss` também aparecia na lista até 2026-08-11; foi resolvido levando o bloco
`overrides` do projeto para dentro do manifesto do pacote.
