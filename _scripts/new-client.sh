#!/usr/bin/env bash
# new-client.sh — bootstrap de carpeta nueva para un cliente real o MVP.
#
# Uso:
#   ./new-client.sh <slug-cliente> [--mvp-showcase]
#
# Ejemplos:
#   ./new-client.sh clinica-rodriguez
#       → crea clientes/clinica-rodriguez/ con todo el template copiado
#       → listo para editar y personalizar
#
#   ./new-client.sh sonrisa-premium-medellin --mvp-showcase
#       → crea mvps/sonrisa-premium-medellin/ (para MVP showcase)
#       → mantiene banner ético + disclaimer + noindex
#
# Qué hace:
#   1. Copia la carpeta sonrisa-bogota/ (MVP base) a la nueva ubicación.
#   2. Actualiza CNAME con el nuevo subdominio.
#   3. Si es cliente real (sin --mvp-showcase):
#        - Elimina el banner ético amarillo del HTML
#        - Elimina el disclaimer del footer
#        - Remueve la meta noindex,nofollow
#   4. Deja placeholder 🟡 PENDIENTE en cada campo personalizable.
#
# Después de ejecutar este script:
#   - Completar los 15 campos de CONSTRUCCION-MVP-ESENCIAL.md sección 2
#   - Ejecutar optimize-images.py en img/
#   - Seguir CHECKLIST-NUEVO-CLIENTE.md paso a paso

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTAFOLIO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_SRC="$PORTAFOLIO_DIR/mvps/sonrisa-bogota"

# --- argumentos ---
if [ $# -lt 1 ]; then
    echo "Uso: $0 <slug-cliente> [--mvp-showcase]"
    echo ""
    echo "Ejemplos:"
    echo "  $0 clinica-rodriguez                      (crea clientes/clinica-rodriguez/)"
    echo "  $0 sonrisa-premium-medellin --mvp-showcase  (crea mvps/sonrisa-premium-medellin/)"
    exit 1
fi

SLUG="$1"
IS_MVP=false
if [ "${2:-}" = "--mvp-showcase" ]; then
    IS_MVP=true
fi

# --- validaciones ---
if [ ! -d "$TEMPLATE_SRC" ]; then
    echo "ERROR: template source no existe en $TEMPLATE_SRC"
    exit 1
fi

if [ "$IS_MVP" = true ]; then
    DEST="$PORTAFOLIO_DIR/mvps/$SLUG"
else
    DEST="$PORTAFOLIO_DIR/clientes/$SLUG"
    mkdir -p "$PORTAFOLIO_DIR/clientes"
fi

if [ -d "$DEST" ]; then
    echo "ERROR: ya existe $DEST — borrar primero o usar otro slug."
    exit 1
fi

# --- copiar ---
echo "📁 Copiando template a $DEST"
cp -R "$TEMPLATE_SRC" "$DEST"

# --- actualizar CNAME con placeholder ---
if [ "$IS_MVP" = true ]; then
    SUBDOMAIN="${SLUG}.prontoweb.co"
else
    SUBDOMAIN="EDITAR-CON-DOMINIO-DEL-CLIENTE.com"
fi
echo "$SUBDOMAIN" > "$DEST/CNAME"
echo "📝 CNAME → $SUBDOMAIN"

# --- si es cliente real, remover banner ético + disclaimer + noindex ---
if [ "$IS_MVP" = false ]; then
    echo "🧹 Limpiando template para cliente real:"
    # Nota: usamos python para edits multilinea seguros
    python3 "$SCRIPT_DIR/_strip-mvp-markers.py" "$DEST/index.html"
    echo "   ✓ Banner ético amarillo removido"
    echo "   ✓ Disclaimer del footer removido"
    echo "   ✓ meta noindex,nofollow removido"
fi

# --- checklist recordatorio ---
cat <<EOF

✅ Carpeta creada en: $DEST

📋 PASOS SIGUIENTES:

1. Reemplazar las 4 fotos en $DEST/img/:
   - hero-clinica.jpg (mismo nombre, foto del consultorio del cliente)
   - equipo-dentista.jpg (foto del doctor/equipo)
   - servicios-herramientas.jpg (foto de instrumental/consultorio)
   - pacientes-sonrisa.jpg (avatar para testimonio — o usar iniciales)

2. Optimizar las fotos nuevas:
   python3 _scripts/optimize-images.py $DEST/img/

3. Editar $DEST/index.html — reemplazar con find/replace (cuidado: globales):
   "Sonrisa Bogotá"           → nombre comercial del cliente
   "Chapinero"                → ciudad/zona del cliente
   "Calle 72 # 10-34"         → dirección real del cliente
   "+57 300 000 0000"         → teléfono fijo del cliente
   "573124672674"             → WhatsApp del CLIENTE (NO el de Pronto)
   "+57 312 467 2674"         → WhatsApp del cliente formato legible
   "Dr. Ramón García"         → doctor principal del cliente
   "sonrisabogota.prontoweb.co" → subdominio/dominio del cliente
   "UMAMI_WEBSITE_ID_SONRISA_BOGOTA" → ID Umami del cliente (crear website en umami.is)
   Testimonios "Valentina R" / "Jorge M" / "Marcela C" → testimonios reales
   Precios (\$95.000, \$580.000, etc.) → precios reales del cliente

4. Actualizar Schema.org JSON-LD en el <head>:
   - address streetAddress/addressLocality
   - telephone
   - openingHoursSpecification (horarios reales)
   - hasOfferCatalog (6 servicios con precios reales)
   - aggregateRating → SOLO si el cliente ya tiene reseñas verificables en Google Business Profile

5. Seguir paso a paso:
   /PRONTO/docs/construccion-mvp/CHECKLIST-NUEVO-CLIENTE.md

EOF
