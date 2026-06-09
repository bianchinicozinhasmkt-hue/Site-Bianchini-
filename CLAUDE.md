# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Servidor local

```bash
python -m http.server 8080
# Acesse: http://localhost:8080/bianchini-kitchen-pro.html
```

## Processamento de imagens (Python + Pillow)

Remoção de fundo em logos PNG:
```python
from PIL import Image
import numpy as np
# L2 distance from average corner pixel color
# Tolerâncias: lo=17.5, hi=52.5 para transição suave
```

Otimização de imagens para web:
```python
img.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
# MAX_DIM = 1400px em qualquer dimensão
```

## Arquitetura

**Arquivo único:** `bianchini-kitchen-pro.html` — todo CSS e JS estão embutidos neste arquivo. Não há build, bundler ou dependências externas além do Google Fonts.

**Pastas de assets:**
- `Fotos/` — imagens do hero slider (`slide1.jpg`–`slide4.jpg`, JPEG otimizados)
- `clientes/` — logos dos clientes em PNG com fundo transparente
- `logo-bianchini-kitchen-pro.png` — logo principal na raiz

**Design tokens** (`:root` no CSS):
- `--dark: #1A2840` (navy da marca), `--gold: #8C1A2E` (carmim)
- Fontes: DM Sans + DM Serif Display (Google Fonts)

**Estrutura do `<script>` inline** (final do `<body>`, nesta ordem):
1. `document.body.classList.add('js-on')` — habilita reveal animations
2. Hero slider — `querySelectorAll('.hero-right .hslide')` + `setInterval`
3. Navbar shadow — IntersectionObserver no scroll
4. Mobile menu — toggle CSS via `style.cssText`
5. Trust strip — preenche `#ts-track` com logos duplicadas para loop infinito
6. Reveal on scroll — IntersectionObserver adiciona `.in` nos `.reveal`

**Trust strip (faixa animada de clientes):** os itens são gerados via JS a partir do array `clientes[]`. O HTML contém um fallback estático idêntico caso o JS não rode. A animação é CSS puro (`@keyframes ts-scroll`, `translateX(-50%)`), com os itens HTML duplicados para loop contínuo.

**Progressive enhancement:** `.js-on .reveal { opacity:0 }` — elementos `.reveal` ficam invisíveis só quando JS roda (evita conteúdo oculto se JS falhar).

**Responsivo:** hero vira coluna única abaixo de ~1024px; `.hero-right` recebe altura explícita no mobile.

## Pitfalls conhecidos

**Curly quotes quebram o JS:** commits via heredoc podem introduzir Unicode `'` `'` (U+2018/U+2019) no lugar de ASCII `'` (0x27) nas strings JavaScript. Isso causa `SyntaxError` fatal que mata todo o script. Para corrigir:
```python
raw = raw.replace(b'\xe2\x80\x98', b"'").replace(b'\xe2\x80\x99', b"'")
```

**Nomes de arquivo case-sensitive:** o Windows é case-insensitive, mas servidores Linux não são. Sempre salvar assets em minúsculo. Para renomear no Windows (2 passos):
```powershell
Rename-Item "ARQUIVO.png" "arquivo-tmp.png"
Rename-Item "arquivo-tmp.png" "arquivo.png"
```

**Tamanhos de logo na trust strip:**
- Padrão: `ts-logo` (52px altura)
- Grande: `ts-logo-lg` (68px) — Plaza Lounge, Petrobras, Adonis, Novilho de Ouro
- Extra grande: `ts-logo-xl` (88px) — Othon, Mocellin

**Slider hero:** usa `background-image` inline em cada `.hslide` (não `<img>`). A classe `.on` controla `opacity: 1`; todos os slides são `position: absolute; inset: 0`.

## Contatos e dados reais do site

- WhatsApp: `+55 21 96469-0650`
- Email: `comercial@bianchinicozinhas.com.br`
- 18 anos de experiência, 3.000+ projetos entregues
