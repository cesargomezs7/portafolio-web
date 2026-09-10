/* ═══════════════════════════════════════════════════════════════
   Dr. Stefano Serrano · landings de campaña
   Una sola pieza de JS para las dos landings.

   Hace exactamente tres cosas:
     1. Entradas por scroll (decorativas: si esto no corre, todo se ve).
     2. Medición de conversiones de Google Ads — NACE APAGADA.
     3. Nada más.

   ⚠ Lo que NO hace, a propósito:
      · No manda ni una petición a ningún servidor de Pronto.
      · No carga Microsoft Clarity (el proyecto de Pronto es compartido:
        habría mezclado las sesiones de estos pacientes con las de
        todos los demás clientes).
      · No recoge ningún dato del visitante.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1 · Entradas por scroll ──────────────────────────────────
     IntersectionObserver, no ScrollTrigger: es inmune al zoom del
     navegador, que en Safari falsea getBoundingClientRect.
     Todo nodo animado termina SIEMPRE visible, incluso si el
     observer nunca dispara. */
  var animables = document.querySelectorAll('.sec, .strip, .hero-copy, .hero-art');

  function mostrarTodo() {
    for (var i = 0; i < animables.length; i++) animables[i].classList.add('is-in');
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window) || !animables.length) {
    mostrarTodo();
  } else {
    for (var j = 0; j < animables.length; j++) animables[j].classList.add('rise');

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.02 });

    for (var k = 0; k < animables.length; k++) io.observe(animables[k]);

    /* Red de seguridad: pase lo que pase, a los 3 s todo es visible.
       (En OralTech hubo nodos que se quedaron a opacidad 0 porque el
       lote de ScrollTrigger nunca llegó a ejecutarse.) */
    setTimeout(mostrarTodo, 3000);
  }

  /* ── 2 · Conversión de Google Ads ─────────────────────────────
     La conversión de estas landings es UNA: que el visitante toque
     WhatsApp. No hay formulario, así que no hay nada más que medir.

     Mientras SERRANO_ADS.activo sea false no se carga gtag.js y no
     sale ni una petición hacia Google. */
  var cfg = window.SERRANO_ADS || {};
  if (!cfg.activo || !cfg.id || cfg.id.indexOf('X') !== -1) return;

  var SEND_TO = cfg.id + '/' + cfg.etiqueta;

  // Cargar gtag.js
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', cfg.id);

  /* Un solo listener delegado, en vez de un onclick por enlace:
     así ningún botón nuevo se queda sin medir. */
  var SEL = 'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"]';

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest(SEL);
    if (!a || typeof window.gtag !== 'function') return;

    var enPestanaNueva = a.target === '_blank' ||
                         ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button === 1;

    /* CASO A — se abre en pestaña nueva. La landing NO se descarga,
       así que el evento sale tranquilo y no hay que retener a nadie.
       (Todos los botones de estas landings son target="_blank", así
       que este es el camino normal.) */
    if (enPestanaNueva) {
      gtag('event', 'conversion', { send_to: SEND_TO, value: 0, currency: cfg.moneda || 'COP' });
      return;
    }

    /* CASO B — navegación en la misma pestaña. Hay que esperar a que
       el ping salga o el evento se pierde. Con tope de 800 ms: nunca
       se deja a un usuario esperando por una métrica. */
    var destino = a.href, ido = false;
    var irse = function () { if (!ido) { ido = true; window.location.href = destino; } };

    ev.preventDefault();
    setTimeout(irse, 800);
    gtag('event', 'conversion', {
      send_to: SEND_TO, value: 0, currency: cfg.moneda || 'COP', event_callback: irse
    });
  }, false);
})();
