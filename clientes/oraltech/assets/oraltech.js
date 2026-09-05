/* ═══════════════════════════════════════════════════════════════
   OralTech · comportamiento de los componentes propios
   ───────────────────────────────────────────────────────────────
   Sin dependencias. GSAP NO toca ninguno de estos nodos: el
   carrusel se mueve con CSS y el comparador con un <input range>
   nativo. Es a propósito (memoria zoom-css-safari-chrome: bajo
   body{zoom}, Safari devuelve coordenadas equivocadas y dos
   motores animando el mismo nodo terminan peleándose).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1 · Video de presentación ─────────────────────────────
     preload="none": la portada NO descarga el video hasta que
     alguien pulsa play. Así el hero pesa un póster, no 5,7 MB. */
  document.querySelectorAll('.video-hero').forEach(function (caja) {
    var v = caja.querySelector('video');
    var btn = caja.querySelector('.video-hero-play');
    if (!v || !btn) return;
    btn.addEventListener('click', function () {
      v.setAttribute('preload', 'auto');
      v.controls = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.controls = true; });
      btn.hidden = true;
    });
    v.addEventListener('pause', function () { if (v.currentTime === 0) btn.hidden = false; });
  });

  /* ── 2 · Comparadores antes / después ───────────────────── */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var rango = ba.querySelector('.ba-rango');
    if (!rango) return;
    var pintar = function () { ba.style.setProperty('--pos', rango.value + '%'); };
    rango.addEventListener('input', pintar);
    pintar();
  });

  /* ── 3 · Carrusel de videotestimonios ────────────────────
     Las 36 tarjetas del carrusel son PÓSTERS, no <video>: meter
     36 reproductores en la portada sería un derroche de memoria.
     El <video> se crea aquí, solo para la tarjeta que se pulsa,
     y se destruye al terminar. La lista va repetida tres veces
     en el HTML para que el bucle CSS cierre sin costura. */
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('.vt-card'));

  function soltarVideo(card) {
    var v = card.querySelector('video');
    if (v) { v.pause(); v.removeAttribute('src'); v.load(); v.remove(); }
    card.classList.remove('reproduciendo');
    var fila = card.closest('.vt-fila');
    if (fila) fila.style.animationPlayState = '';
  }

  function pararTodo(menos) {
    tarjetas.forEach(function (c) { if (c !== menos) soltarVideo(c); });
  }

  tarjetas.forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.classList.contains('reproduciendo')) { soltarVideo(card); return; }
      var src = card.getAttribute('data-video');
      if (!src) return;
      pararTodo(card);

      var v = document.createElement('video');
      v.src = src;
      v.playsInline = true;
      v.controls = true;
      v.preload = 'auto';
      v.setAttribute('playsinline', '');           // Safari en iOS lo exige en el atributo
      var poster = card.querySelector('.vt-poster');
      if (poster) v.poster = poster.getAttribute('src');
      card.insertBefore(v, card.firstChild);

      card.classList.add('reproduciendo');
      var fila = card.closest('.vt-fila');
      if (fila) fila.style.animationPlayState = 'paused';

      var p = v.play();
      if (p && p.catch) p.catch(function () { /* si el navegador lo bloquea, quedan los controles */ });
      v.addEventListener('ended', function () { soltarVideo(card); });
    });
  });

  /* ── 4 · Burbuja de WhatsApp con las dos sedes ─────────────
     Su web pregunta la sede antes de abrir el chat. Replicado:
     sin esto, un paciente de Medellín escribiría a Cúcuta. */
  var burbuja = document.getElementById('waFloat');
  var panel = document.getElementById('waPanel');
  if (burbuja && panel) {
    // La burbuja deja de ser un enlace directo y pasa a abrir el panel
    burbuja.addEventListener('click', function (e) {
      e.preventDefault();
      panel.classList.toggle('open');
      burbuja.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !burbuja.contains(e.target)) {
        panel.classList.remove('open');
        burbuja.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { panel.classList.remove('open'); burbuja.setAttribute('aria-expanded', 'false'); }
    });

    /* El mensaje prellenado sigue cambiando según la sección que se
       esté viendo (data-wa), como promete el contrato. wa-widget.js
       actualiza el href de la burbuja; aquí propagamos ese texto a
       los dos botones de sede para no perder esa función. */
    var sincronizar = function () {
      var href = burbuja.getAttribute('href') || '';
      var i = href.indexOf('text=');
      if (i === -1) return;
      var texto = href.slice(i + 5);
      panel.querySelectorAll('.wa-sede').forEach(function (a) {
        var base = a.getAttribute('data-wa-base');
        if (base) a.setAttribute('href', base + texto);
      });
    };
    sincronizar();
    new MutationObserver(sincronizar).observe(burbuja, { attributes: true, attributeFilter: ['href'] });
  }
})();
