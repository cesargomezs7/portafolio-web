#!/usr/bin/env python3
"""
optimize-images.py — convierte las 4 fotos de un cliente a WebP listas para deploy.

Uso:
    python3 _scripts/optimize-images.py <ruta-carpeta-img>

Ejemplo:
    python3 _scripts/optimize-images.py mvps/sonrisa-bogota/img/
    python3 _scripts/optimize-images.py clientes/clinica-rodriguez/img/

Requisitos:
    pip3 install Pillow   (ya viene con la mayoría de installs Python 3 en macOS)

Qué hace:
    1. Busca los 4 archivos JPG esperados (hero-clinica, equipo-dentista,
       servicios-herramientas, pacientes-sonrisa) en la carpeta indicada.
    2. Convierte cada uno a WebP quality 80 (fotos grandes) o 85 (avatar).
    3. Reporta tamaños antes/después.
    4. Mantiene los JPG originales como fallback para browsers antiguos.

Política de MVPs/clientes de Pronto (decisión 15-abr-2026):
    - MVPs showcase: WebP full-size quality 80 (prioriza calidad visual).
    - Clientes reales: mismo flujo inicial; si Core Web Vitals da bajo,
      generar variantes -800.webp en segunda pasada.
"""
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: falta Pillow. Instálalo con: pip3 install Pillow")
    sys.exit(1)

# Archivos esperados en cada MVP/cliente y su calidad de compresión
EXPECTED_FILES = {
    'hero-clinica':         {'quality': 80, 'description': 'Hero background'},
    'equipo-dentista':      {'quality': 80, 'description': 'Sección Nosotros'},
    'servicios-herramientas': {'quality': 80, 'description': 'Showcase strip'},
    'pacientes-sonrisa':    {'quality': 85, 'description': 'Avatar testimonio'},
}

def convert_to_webp(img_dir: Path, generate_mobile: bool = False):
    """Convierte los JPG esperados a WebP."""
    if not img_dir.is_dir():
        print(f"ERROR: la carpeta {img_dir} no existe.")
        sys.exit(1)

    total_before = 0
    total_after = 0

    print(f"📸 Optimizando imágenes en: {img_dir}\n")
    print(f"{'Archivo':<32} {'JPG':>10} {'WebP':>10} {'Ahorro':>8}")
    print('-' * 62)

    for name, cfg in EXPECTED_FILES.items():
        jpg_path = img_dir / f'{name}.jpg'
        if not jpg_path.exists():
            print(f"{name:<32} {'⚠ no encontrado':>30}")
            continue

        original_size = jpg_path.stat().st_size
        total_before += original_size

        img = Image.open(jpg_path)
        # WebP full size
        webp_path = img_dir / f'{name}.webp'
        img.save(webp_path, 'WEBP', quality=cfg['quality'], method=6)
        webp_size = webp_path.stat().st_size
        total_after += webp_size

        # Variante mobile (solo si se pide y la imagen es grande)
        if generate_mobile and img.width > 800:
            ratio = 800 / img.width
            mobile = img.resize((800, int(img.height * ratio)), Image.LANCZOS)
            mobile_path = img_dir / f'{name}-800.webp'
            mobile.save(mobile_path, 'WEBP', quality=max(cfg['quality'] - 5, 70), method=6)

        pct = 100 * (1 - webp_size / original_size)
        print(f"{name:<32} {original_size/1024:>8.0f}KB {webp_size/1024:>8.0f}KB {pct:>7.0f}%")

    print('-' * 62)
    if total_before > 0:
        total_pct = 100 * (1 - total_after / total_before)
        print(f"{'TOTAL':<32} {total_before/1024:>8.0f}KB {total_after/1024:>8.0f}KB {total_pct:>7.0f}%")
    print()
    print("✅ Conversión completa. Los JPG originales quedan como fallback.")
    print("   El HTML usa <picture> con <source type='image/webp'> + <img src='.jpg' />")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python3 optimize-images.py <ruta-carpeta-img> [--mobile]")
        print("")
        print("Ejemplo: python3 _scripts/optimize-images.py mvps/sonrisa-bogota/img/")
        sys.exit(1)

    img_dir = Path(sys.argv[1]).resolve()
    generate_mobile = '--mobile' in sys.argv

    convert_to_webp(img_dir, generate_mobile=generate_mobile)
