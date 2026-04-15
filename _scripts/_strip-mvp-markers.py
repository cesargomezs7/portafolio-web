#!/usr/bin/env python3
"""
_strip-mvp-markers.py — limpia el HTML de markers de MVP showcase
para dejarlo listo como sitio de cliente real.

Qué remueve:
  1. El banner ético amarillo superior (div.ethics-banner)
  2. El disclaimer del footer (div.footer-disclaimer)
  3. La meta tag <meta name="robots" content="noindex,nofollow" />

Se invoca automáticamente desde new-client.sh cuando NO es MVP showcase.
NO invocar manualmente a menos que sepas lo que haces.
"""
import re
import sys
from pathlib import Path

if len(sys.argv) != 2:
    print("Uso: _strip-mvp-markers.py <ruta-index.html>")
    sys.exit(1)

html_path = Path(sys.argv[1])
if not html_path.exists():
    print(f"ERROR: {html_path} no existe")
    sys.exit(1)

content = html_path.read_text(encoding='utf-8')
original_len = len(content)

# 1. Remover banner ético (div.ethics-banner completo con su comentario)
content = re.sub(
    r'<!-- ─── BANNER ÉTICO.*?-->\s*<div class="ethics-banner">.*?</div>\s*',
    '',
    content,
    count=1,
    flags=re.DOTALL
)

# 2. Remover disclaimer del footer
content = re.sub(
    r'<div class="footer-disclaimer">.*?</div>\s*',
    '',
    content,
    count=1,
    flags=re.DOTALL
)

# 3. Remover meta robots noindex
content = re.sub(
    r'<!--[^>]*SOLO PARA MVP SHOWCASE[^>]*-->\s*',
    '',
    content,
    count=1
)
content = re.sub(
    r'<meta name="robots" content="noindex,nofollow" />\s*',
    '',
    content,
    count=1
)

# 4. Limpiar CSS huérfano del ethics-banner y footer-disclaimer.
#    (sin el HTML asociado, el CSS no hace nada, pero queda código muerto.
#    Mejor limpiarlo para tener el archivo profesional.)

# 4a. Remover comentario de sección "BANNER ÉTICO SUPERIOR" + bloque CSS + variantes
content = re.sub(
    r'/\* ─── BANNER ÉTICO SUPERIOR ─+ \*/\s*',
    '',
    content,
    count=1
)
# Todos los selectores que empiezan con .ethics-banner (incluye "ethics-banner i", "ethics-banner a", etc.)
content = re.sub(
    r'\.ethics-banner[^{]*\{[^}]*\}\s*',
    '',
    content
)

# 4b. Todos los selectores que empiezan con .footer-disclaimer
content = re.sub(
    r'\.footer-disclaimer[^{]*\{[^}]*\}\s*',
    '',
    content
)

new_len = len(content)
if new_len == original_len:
    print("⚠ No se detectaron markers de MVP. ¿El HTML ya estaba limpio?")
else:
    html_path.write_text(content, encoding='utf-8')
    print(f"✅ {original_len - new_len} chars removidos (banner HTML + CSS + disclaimer HTML + CSS + meta noindex)")
