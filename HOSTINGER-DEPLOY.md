# Deploy na Hostinger

STATUS: ACTIVE · procedimento operacional.

O site é **estático**. A pasta gerada *é* o site: joga no painel, substitui o anterior,
funciona. Sem Node, sem instalar dependência, sem comando de start.

## O que usar

| artefato | o que é |
| --- | --- |
| `bianchini-hostinger.zip` | **envie este** — 20,7 MB, 151 arquivos |
| `deploy-hostinger/` | a mesma coisa descompactada, para arrastar por FTP |

Gerados por `npm run pacote:hostinger` e não versionados.

## Passo a passo

1. No hPanel, abra o **Gerenciador de Arquivos** e entre em `public_html`.
2. **Apague tudo o que está lá** (o site v1).
3. Envie `bianchini-hostinger.zip` e extraia **dentro de `public_html`**.
4. Confirme que `index.html` ficou na **raiz** de `public_html`, e não dentro de uma
   subpasta. Se o extrator criar `public_html/deploy-hostinger/`, mova o conteúdo um nível
   acima.
5. Ative o **"Mostrar arquivos ocultos"** e confirme que o **`.htaccess` está lá**. Ele
   carrega os redirects de link antigo, os cabeçalhos de segurança e as regras de cache — se
   sumir no upload, o site funciona, mas perde essas três coisas.
6. Abra o domínio. Aparece na hora.

## Validação rápida

- `/` — a primeira dobra com as três portas
- `/contato/` — WhatsApp **+55 21 96469-0650**
- `/sitemap.xml` — URLs começando com o seu domínio, nunca com `localhost`
- `/forno-combinado-rational` — redireciona para `/linhas-de-produtos/forno-combinado-rational/`

## Se o domínio for outro

O domínio é **embutido no build**. Trocar exige regerar o pacote, não editar arquivo no
servidor:

```bash
NEXT_PUBLIC_SITE_URL=https://o-dominio-certo.com.br npm run pacote:hostinger
```

O pacote atual foi gerado com `https://bianchinicozinhas.com.br`.

## O que este modelo custa — e o que foi compensado

Sem servidor, o Next perde três recursos. Dois foram recuperados no `.htaccess`; um não tem
como.

| recurso | situação |
| --- | --- |
| Redirects de link antigo | ✅ recuperado — `RedirectPermanent` no `.htaccess` |
| Cabeçalhos de segurança (5) | ✅ recuperado — `mod_headers` no `.htaccess` |
| Otimização de imagem | ❌ **perdido** — ver abaixo |

**A perda real:** o `next/image` deixa de gerar AVIF/WebP e de redimensionar por breakpoint.
Cada imagem passa a ser servida como está em `public/`. Medido na home, em 1440×900:
**8,3 MB transferidos, dos quais 7,4 MB são imagem** — contra ~1,5 MB com otimização ligada.

Isso não quebra nada e o site continua correto em todos os testes, mas pesa no carregamento,
principalmente em 4G. As duas saídas, quando houver tempo:

1. **comprimir os arquivos de origem** em `public/images/` (o `consultoria.png` sozinho tem
   1,7 MB) e regerar o pacote — resolve a maior parte sem mudar código;
2. migrar para um plano com Node, que devolve a otimização automática.

## O que NÃO subir

`src/` · `docs/` · `node_modules/` · `.git/` · `out/` · `deploy-hostinger/` como subpasta ·
capturas de tela · o repositório inteiro.

## Variáveis de ambiente

Uma só, usada **no build**, e não é segredo:

| variável | valor |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | a URL pública, sem barra final |

Nenhuma chave, token ou credencial é usada pelo projeto — o formulário de contato não tem
backend: monta a mensagem e abre WhatsApp ou e-mail.
