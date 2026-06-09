/* ───────────────────────────────────────────────
   Módulo Pronto · Chat widget WhatsApp contextual
   Cambia el mensaje pre-escrito de la burbuja flotante
   según la sección visible. Plug-and-play:
     - id="waFloat" en el <a> de la burbuja
       (con <span id="waFloatLabel"> adentro)
     - data-wa-base="https://wa.me/NUMERO?text=" en el <a>
     - data-wa="mensaje" y data-wa-label="texto"
       en cada <section> que quiera contexto propio
   Si la página no tiene secciones con data-wa, la
   burbuja simplemente conserva su href por defecto.
   ─────────────────────────────────────────────── */
(function () {
  // ── Contadores Pronto: visita + clics a WhatsApp ──
  var TRACK = 'https://pronto-forms-worker.cesargomezs711.workers.dev/track';
  function track(ev) {
    try { fetch(TRACK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: ev, clinica: 'Sonrisa Premium' }), keepalive: true }); } catch (e) {}
  }
  track('visit');
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a[href*="wa.me"]')) track('wa_click');
  }, true);

  var floatEl = document.getElementById('waFloat');
  if (!floatEl) return;

  var labelEl = document.getElementById('waFloatLabel');
  var base = floatEl.getAttribute('data-wa-base') || 'https://wa.me/573124672674?text=';
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-wa]'));
  if (!sections.length) return;

  var labelTimer = null;

  function apply(sec) {
    var msg = sec.getAttribute('data-wa');
    var label = sec.getAttribute('data-wa-label');
    if (msg) floatEl.href = base + encodeURIComponent(msg);
    if (labelEl && label && labelEl.textContent !== label) {
      labelEl.textContent = label;
      // pop breve del label cuando cambia el contexto
      floatEl.classList.add('wa-show-label');
      clearTimeout(labelTimer);
      labelTimer = setTimeout(function () {
        floatEl.classList.remove('wa-show-label');
      }, 2200);
    }
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) apply(e.target);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  // Invitación no intrusiva: la burbuja "se abre" sola una vez a los 5s,
  // mostrando su etiqueta. No bloquea, no tapa contenido, es móvil-safe.
  setTimeout(function () {
    floatEl.classList.add('wa-show-label');
    setTimeout(function () { floatEl.classList.remove('wa-show-label'); }, 4500);
  }, 5000);
})();
