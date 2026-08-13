#!/usr/bin/env bash
# R2 — corrida do inventário e das capturas, um navegador por passo.
#
# Uma conexão CDP reaproveitada entre viewports enforcava o socket a partir da terceira
# (`timeout CDP Page.navigate`, depois `Log.enable` já na abertura). Não é a viewport: 768
# sozinho, em navegador limpo, roda em 40s. Cada passo ganha um Chrome próprio, e os JSON
# por largura são consolidados depois por `juntar.mjs`.
#
# Uso: bash rodar.sh <antes|depois> [--shots]
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
ALVO="${1:?use: rodar.sh <antes|depois> [--shots]}"
SHOTS="${2:-}"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
PERFIL="C:/Users/gabri/AppData/Local/Temp/claude/c--Users-gabri-Desktop-Coisas-Projeto-Bianchini/df1ab30e-835b-46e8-ba43-5d5e8cc24690/scratchpad"

abrir () {
  taskkill //F //IM chrome.exe >/dev/null 2>&1
  sleep 1
  "$CHROME" --headless=new --remote-debugging-port=9222 --hide-scrollbars --disable-gpu \
    --no-first-run --user-data-dir="$PERFIL/chrome-$1" about:blank >/dev/null 2>&1 &
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    [ -n "$(curl -s http://127.0.0.1:9222/json/version 2>/dev/null | head -c 10)" ] && return 0
    sleep 2
  done
  echo "chrome nao subiu"; return 1
}

for w in 320 390 768 1024 1366 1440 1600 1920; do
  abrir "vp$w" || exit 1
  echo "=== inventario $w ==="
  timeout 400 node "$DIR/measure-r2.mjs" "$DIR/$ALVO" http://127.0.0.1:3210 --vp=$w --sem-dossie 2>&1 | tail -12
done

abrir dossie || exit 1
echo "=== dossie ==="
timeout 400 node "$DIR/measure-r2.mjs" "$DIR/$ALVO" http://127.0.0.1:3210 --vp=0 2>&1 | tail -12

if [ "$SHOTS" = "--shots" ]; then
  for w in 320 390 768 1024 1366 1440 1600 1920; do
    abrir "sh$w" || exit 1
    echo "=== inteira $w ==="
    timeout 400 node "$DIR/tirar-capturas.mjs" "$DIR/$ALVO" http://127.0.0.1:3210 --modo=inteira --vp=$w 2>&1 | tail -12
  done
  for w in 1920 1440 390; do
    abrir "mo$w" || exit 1
    echo "=== momentos $w ==="
    timeout 400 node "$DIR/tirar-capturas.mjs" "$DIR/$ALVO" http://127.0.0.1:3210 --modo=momentos --vp=$w 2>&1 | tail -7
  done
  for w in 390 1440; do
    abrir "do$w" || exit 1
    echo "=== dossie shot $w ==="
    timeout 400 node "$DIR/tirar-capturas.mjs" "$DIR/$ALVO" http://127.0.0.1:3210 --modo=dossie --vp=$w 2>&1 | tail -12
  done
fi

taskkill //F //IM chrome.exe >/dev/null 2>&1
echo "FIM"
