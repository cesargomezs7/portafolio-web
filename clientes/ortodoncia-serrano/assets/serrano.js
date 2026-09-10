/* ═══════════════════════════════════════════════════════════════
   Dr. Stefano Serrano · landings de campaña
   Una sola pieza de JS para las dos landings.

   Hace exactamente tres cosas:
     1. Capa de movimiento (decorativa: si esto no corre, todo se ve).
     2. Medición de conversiones de Google Ads — NACE APAGADA.
     3. Nada más.

   ⚠ Lo que NO hace, a propósito:
      · No manda ni una petición a ningún servidor de Pronto.
      · No carga Microsoft Clarity (el proyecto de Pronto es compartido:
        habría mezclado las sesiones de estos pacientes con las de
        todos los demás clientes).
      · No carga GSAP ni ninguna otra librería. Toda la animación es
        CSS; esto solo pone y quita clases. La landing entera pesa
        ~240 KB y Google encarece el clic si la página va lenta.
      · No recoge ningún dato del visitante.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 0 · Elementos que entran ─────────────────────────────────
     Los bloques enteros suben; las rejillas de varios hijos iguales
     además los escalonan. */
  var BLOQUES  = '.sec, .strip, .hero';
  // El FAQ NO va en cascada a propósito: con 10 preguntas la última tardaba
  // 1,2 s en aparecer, y quien llega ahí quiere leerlas ya. La cascada sirve
  // para 3-4 tarjetas, no para una lista larga.
  var CASCADAS = '.strip-grid, .steps, .doc-list, .close-data';

  var bloques = [].slice.call(document.querySelectorAll(BLOQUES));
  [].forEach.call(document.querySelectorAll(CASCADAS), function (e) {
    e.classList.add('stagger');
    if (bloques.indexOf(e) === -1) bloques.push(e);
  });

  function mostrarTodo() {
    for (var i = 0; i < bloques.length; i++) bloques[i].classList.add('is-in');
  }

  /* Con reduced-motion o sin IntersectionObserver: todo visible, sin mover nada. */
  if (reduce || !('IntersectionObserver' in window)) {
    mostrarTodo();
  } else {

    /* ── 1 · El hero entra al cargar, sin esperar al scroll ───── */
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('hero-in', 'is-in');
      // el antetítulo del hero traza su rayita con el resto
    }

    for (var j = 0; j < bloques.length; j++) {
      if (bloques[j] !== hero) bloques[j].classList.add('rise');
    }

    /* ── 2 · El resto entra al asomar por la pantalla ─────────── */
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.02 });

    for (var k = 0; k < bloques.length; k++) {
      if (bloques[k] !== hero) io.observe(bloques[k]);
    }

    /* Red de seguridad: pase lo que pase, a los 3,5 s todo es visible.
       (En OralTech hubo nodos que se quedaron a opacidad 0 porque el
       lote de ScrollTrigger nunca llegó a ejecutarse.) */
    setTimeout(mostrarTodo, 3500);

    /* ── 3 · El botón invita, sin cansar ──────────────────────
       El brillo hace 3 pasadas y para. Un botón que late para
       siempre se lee como presión, y en salud eso resta. */
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll('.btn--wa'), function (b) {
        b.classList.add('brilla');
      });
    }, 1800);

    /* ── 4 · La burbuja saca su etiqueta y la recoge ──────────── */
    var burbuja = document.querySelector('.wa-float');
    if (burbuja) {
      setTimeout(function () {
        burbuja.classList.add('con-label');
        setTimeout(function () { burbuja.classList.remove('con-label'); }, 5200);
      }, 3200);
    }
  }

  /* ── 5 · Conversión de Google Ads ─────────────────────────────
     La conversión de estas landings es UNA: que el visitante toque
     WhatsApp. No hay formulario, así que no hay nada más que medir.

     Mientras SERRANO_ADS.activo sea false no se carga gtag.js y no
     sale ni una petición hacia Google. */
  var cfg = window.SERRANO_ADS || {};
  if (!cfg.activo || !cfg.id || cfg.id.indexOf('X') !== -1) return;

  var SEND_TO = cfg.id + '/' + cfg.etiqueta;

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
