/* ═══════════════════════════════════════════════════════════════
   OralTech · capa de movimiento v2 (6-sep-2026)
   ───────────────────────────────────────────────────────────────
   Principios:
   · Estado final = layout actual. Solo transform y opacity; al
     terminar cada entrada se limpia el transform (clearProps) para
     no dejar containing blocks ni stacking contexts residuales.
   · Un solo motor por nodo: lo que mueve oraltech.js (.vt-card,
     .ba-*, .op-pista, .gal-panel, .wa-panel) NO se toca; solo
     entra su contenedor como un único nodo.
   · Nada de getBoundingClientRect ni vh: bajo body{zoom} Safari
     miente. Los failsafes usan IntersectionObserver.
   · Celular primero: cada elemento entra cuando entra ÉL (batchMax
     2 en pantallas angostas) y lo que en escritorio es hover, en
     celular ocurre al entrar en pantalla (iconos, fotos, hairlines).
   · Sin GSAP, sin JS o con reduced-motion: todo visible. El <head>
     de cada página pone html.js-anim antes del primer paint y lo
     quita solo a los 3,5 s si este archivo no confirmó (__prAnimOk).
   · Cada nodo vuelve a SU opacidad de diseño (leída con
     getComputedStyle), no a 1.

   Tokens (espejo de los de oraltech.css, bloque 18):
     T.press .12 · T.ui .22 · T.reveal .7 · T.cine 1.0
     E.out = power4.out (≈ cubic-bezier(.22,1,.36,1))
     E.cine = expo.out (≈ cubic-bezier(.16,1,.3,1))
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var html = document.documentElement;
  var GATE = 'js-anim';
  var T = { press: 0.12, ui: 0.22, reveal: 0.7, cine: 1.0 };
  var E = { out: 'power4.out', cine: 'expo.out' };
  var D = 18;               // desplazamiento de entrada en px
  var STAGGER = 0.07;
  var movil = function () { return window.innerWidth < 760; };

  /* ── Selectores ─────────────────────────────────────────────
     .reveal: lo que ya lleva la clase en el HTML.
     EXTRA: nodos que entran igual aunque no lleven .reveal.
     CABECERA: contenedores de solo texto (antetítulo + titular +
       párrafo): no se funde el contenedor; entran sus hijos uno a
       uno y el titular por líneas.
     TARJETA: contenedores con fondo propio (bloque oscuro, form)
       que sí se funden como bloque y además componen sus hijos. */
  var SEL_EXTRA = '.section-tag:not(.reveal), footer .footer-grid > *, footer .footer-bottom, .vt-pista-uso, .cta-section';
  var SEL_CABECERA = '.clinic-header, .services-header, .team-header, .testimonios-header, .pacientes-txt, h2.section-headline';
  var SEL_TITULO = 'h1, h2';
  var TARJETAS = {
    '.booking-bar': '.booking-head, .booking-fields > *',
    '.contacto-form': '.contacto-form-header, :scope > input, :scope > select, :scope > textarea, :scope > .campo-sede, :scope > button',
    '.faq': ':scope > .overline, .faq-item',
    '.cta-final': '.cta-final-inner > *:not(h2)',
    '.cta-section': ':scope > *:not(h2)'
  };

  /* ── Utilidades ───────────────────────────────────────────── */
  function toArr(x) { return Array.prototype.slice.call(x); }
  function q(sel, root) { return toArr((root || document).querySelectorAll(sel)); }
  function tipoTarjeta(el) { for (var k in TARJETAS) if (el.matches(k)) return k; return null; }
  function esCabecera(el) {
    if (el.matches(SEL_CABECERA)) return true;
    // columna de texto de un .landing-split / .historia-grid / .contacto-wrap: tiene h2 y nada "pesado"
    var p = el.parentElement;
    if (p && /landing-split|historia-grid|contacto-wrap/.test(p.className || '') && el.querySelector('h2') && !el.querySelector('img, form, .tipo-card, .catalog-card')) return true;
    return false;
  }
  /* Hijos de una cabecera: los del contenedor, bajando un nivel en los
     envoltorios que contienen el titular. Nunca el propio titular. */
  function hijosDe(el) {
    var out = [];
    if (el.matches(SEL_TITULO)) return out;      // los hijos de un titular son sus líneas: nunca se animan aparte
    toArr(el.children).forEach(function (c) {
      if (c.matches(SEL_TITULO) || c.matches('.reveal')) return;   // un .reveal anidado es objetivo propio
      if (c.querySelector(SEL_TITULO)) toArr(c.children).forEach(function (cc) { if (!cc.matches(SEL_TITULO) && !cc.matches('.reveal')) out.push(cc); });
      else out.push(c);
    });
    return out;
  }

  function setCountersToFinal() {
    q('[data-counter]').forEach(function (el) {
      var target = parseFloat(el.dataset.counter);
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = (el.dataset.prefix || '') + target.toFixed(decimals) + (el.dataset.suffix || '');
    });
  }

  /* Todo visible, sin animación. Vale para reduced-motion, para
     cuando GSAP no cargó y como red final. */
  function mostrarTodo() {
    html.classList.remove(GATE);
    q('.reveal, .pr-oculto, ' + SEL_EXTRA).forEach(function (el) {
      el.classList.add('is-in');
      el.classList.remove('pr-oculto');
      el.style.opacity = ''; el.style.transform = ''; el.style.transition = '';
    });
    q('.pr-hijo, .pr-titulo').forEach(function (h) {
      h.style.opacity = ''; h.style.transform = ''; h.style.transition = '';
      h.classList.remove('pr-hijo'); h.classList.remove('pr-titulo');
    });
    q('.hero-compact h1').forEach(function (h) { h.style.animation = ''; });
    setCountersToFinal();
  }

  function init() {
    var reduce = false;
    try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduce || !window.gsap || !window.ScrollTrigger) { mostrarTodo(); return; }

    window.__prAnimOk = true;
    gsap.registerPlugin(ScrollTrigger);
    var conSplit = !!window.SplitText;
    if (conSplit) { try { gsap.registerPlugin(SplitText); } catch (e) { conSplit = false; } }

    /* ── 1 · Objetivos y opacidades de diseño ──────────────────
       Se quita la compuerta un instante (sin paint de por medio)
       para leer la opacidad que CADA nodo tiene por diseño y
       devolverlo a ESA, no a 1. */
    var objetivos = q('.reveal').concat(q(SEL_EXTRA)).filter(function (el, i, arr) {
      return arr.indexOf(el) === i && !el.closest('.no-anim');
    });
    /* ⚠ Varios nodos llevan transition:all en CSS (botones, .tipo-card,
       .testimonio…): al cambiar la opacidad, getComputedStyle devuelve el
       valor EN TRANSICIÓN (0 al arrancar), no el de diseño. Se lee con la
       transición apagada. Y mientras GSAP anima un nodo, su transición
       CSS se apaga también: dos motores sobre la misma propiedad hacen
       que el movimiento vaya con retraso y termine mal. */
    function leerOpacidad(el) {
      var tr = el.style.transition, op = el.style.opacity;
      var conCompuerta = el.classList.contains('reveal') && !el.classList.contains('is-in');
      if (conCompuerta) el.classList.add('is-in');   // que la compuerta CSS no devuelva 0
      el.style.transition = 'none'; el.style.opacity = '';
      var v = parseFloat(getComputedStyle(el).opacity); if (isNaN(v)) v = 1;
      el.style.opacity = op; el.style.transition = tr;
      if (conCompuerta) el.classList.remove('is-in');
      return v;
    }
    html.classList.remove(GATE);
    var opDisenio = new Map();
    objetivos.forEach(function (el) { opDisenio.set(el, leerOpacidad(el)); });
    html.classList.add(GATE);
    function opDe(el) { return opDisenio.has(el) ? opDisenio.get(el) : 1; }

    var hechos = new Set();
    var entradas = 0;

    function sinTransicion(el) { el.style.transition = 'none'; }
    function conTransicion(el) { el.style.transition = ''; }
    function ocultarTitulo(h) { h.classList.add('pr-titulo'); gsap.set(h, { opacity: 0 }); }
    function ocultarHijo(h, y) { h.classList.add('pr-hijo'); sinTransicion(h); gsap.set(h, { y: y, opacity: 0 }); }

    /* Estado inicial inline: la compuerta CSS solo cubre el primer
       paint; a partir de aquí manda el inline y quitar la clase
       después no rompe nada. */
    objetivos.forEach(function (el) {
      if (esCabecera(el)) {
        el.classList.add('is-in');          // el contenedor no se funde
        el.style.opacity = '';
        hijosDe(el).forEach(function (h) { ocultarHijo(h, 12); });
        (el.matches(SEL_TITULO) ? [el] : q(SEL_TITULO, el)).forEach(ocultarTitulo);
      } else {
        el.classList.add('pr-oculto');
        sinTransicion(el);
        gsap.set(el, { y: D, opacity: 0 });
        var t = tipoTarjeta(el);
        if (t) {
          q(TARJETAS[t], el).forEach(function (h) { if (!h.matches(SEL_TITULO) && !h.matches('.reveal') && !h.closest(SEL_TITULO)) ocultarHijo(h, 10); });
          q(SEL_TITULO, el).forEach(ocultarTitulo);
        }
      }
    });

    /* ── 2 · Titular por líneas con máscara ───────────────────── */
    var fuentesListas = false;
    var fuentesPromesa = new Promise(function (res) {
      var t = setTimeout(function () { fuentesListas = true; res(); }, 350);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { clearTimeout(t); fuentesListas = true; res(); });
      }
    });

    function fadeTitulo(h, delay) {
      return gsap.fromTo(h, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: T.reveal, ease: E.out, delay: delay || 0, clearProps: 'transform', onComplete: function () { h.classList.remove('pr-titulo'); } });
    }

    function lineas(h, delay) {
      if (!conSplit || h.classList.contains('solo-lectores')) return fadeTitulo(h, delay);
      // nada dentro del titular puede llevar estilos inline nuestros: SplitText
      // guarda el HTML y al revertir los devolvería tal cual (ocultos)
      q('.pr-hijo, .pr-titulo', h).forEach(function (x) { x.classList.remove('pr-hijo'); x.classList.remove('pr-titulo'); x.style.opacity = ''; x.style.transform = ''; x.style.transition = ''; });
      var split;
      try {
        split = SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'pr-linea', aria: 'auto' });
      } catch (e) { return fadeTitulo(h, delay); }
      if (!split || !split.lines || !split.lines.length) { try { split && split.revert(); } catch (e) {} return fadeTitulo(h, delay); }
      /* Sitio para descendentes (g, p, y) y tildes: cada máscara lleva
         relleno arriba/abajo y el margen negativo equivalente. Los
         márgenes negativos del primer y último hijo colapsarían a través
         del titular y lo encogerían (medido: 0,084 de CLS en casos.html),
         así que se le da al titular un relleno de 0,02 px, que corta el
         colapso sin mover nada visible. */
      (split.masks || []).forEach(function (m) { m.style.padding = '.1em 0 .14em'; m.style.margin = '-.1em 0 -.14em'; });
      var cs = getComputedStyle(h), padT = h.style.paddingTop, padB = h.style.paddingBottom;
      if (parseFloat(cs.paddingTop) === 0) h.style.paddingTop = '0.02px';
      if (parseFloat(cs.paddingBottom) === 0) h.style.paddingBottom = '0.02px';
      gsap.set(h, { opacity: 1 });
      return gsap.from(split.lines, {
        yPercent: 115, duration: 0.8, ease: E.cine, stagger: 0.08, delay: delay || 0,
        onComplete: function () {
          try { split.revert(); } catch (e) {}
          h.style.paddingTop = padT; h.style.paddingBottom = padB;
          gsap.set(h, { clearProps: 'opacity' });
          h.classList.remove('pr-titulo');
        }
      });
    }

    function tituloCuandoHayaFuentes(h, delay) {
      if (fuentesListas) { lineas(h, delay); return; }
      fuentesPromesa.then(function () { lineas(h, delay); });
    }

    /* ── 3 · Hijos: opacidad de diseño y limpieza ─────────────── */
    var opHijoCache = new Map();
    function opHijo(h) {
      if (!opHijoCache.has(h)) opHijoCache.set(h, leerOpacidad(h));
      return opHijoCache.get(h);
    }
    function limpiarHijo(h) {
      h.classList.remove('pr-hijo');
      gsap.set(h, { clearProps: opHijo(h) === 1 ? 'transform,opacity' : 'transform' });
      conTransicion(h);
    }
    function animarHijos(lista, delay, dur, stag) {
      if (!lista.length) return;
      gsap.to(lista, {
        y: 0, opacity: function (i, t) { return opHijo(t); },
        duration: dur, ease: E.out, delay: delay, stagger: stag, overwrite: 'auto',
        onComplete: function () { lista.forEach(limpiarHijo); }
      });
    }

    /* Lo que pasa DESPUÉS de que un bloque entró: gestos que en
       escritorio son hover y aquí ocurren solos una vez. */
    function posEntrada(el) {
      if (el.matches('.service-card')) setTimeout(function () { el.classList.add('saludado'); }, 1700);
    }
    function terminar(el) {
      el.classList.add('is-in');
      el.classList.remove('pr-oculto');
      gsap.set(el, { clearProps: opDe(el) === 1 ? 'transform,opacity' : 'transform' });
      conTransicion(el);
      posEntrada(el);
    }

    /* ── 4 · Entrada de un objetivo ───────────────────────────── */
    function entrar(el, delay) {
      if (hechos.has(el)) return;
      hechos.add(el); entradas++;
      if (window.__prAnimDebug) window.__prAnimDebug.push([Math.round(performance.now()), el.tagName + '.' + (el.className || '').toString().split(' ').slice(0, 2).join('.'), delay]);
      delay = delay || 0;

      if (esCabecera(el)) {
        var hijos = q('.pr-hijo', el);
        var titulos = el.matches(SEL_TITULO) ? [el] : q(SEL_TITULO, el);
        var ante = hijos.filter(function (h) { return h.matches('.overline, .section-tag, .hero-tag, .hero-breadcrumb'); });
        var resto = hijos.filter(function (h) { return ante.indexOf(h) === -1; });
        animarHijos(ante, delay, 0.6, 0.06);
        titulos.forEach(function (h, i) { tituloCuandoHayaFuentes(h, delay + 0.08 + i * 0.1); });
        animarHijos(resto, delay + 0.3, T.reveal, 0.07);
        posEntrada(el);
        return;
      }

      gsap.to(el, {
        y: 0, opacity: opDe(el), duration: T.reveal, ease: E.out, delay: delay, overwrite: 'auto',
        onComplete: function () { terminar(el); }
      });
      if (tipoTarjeta(el)) {
        q(SEL_TITULO, el).forEach(function (h, i) { tituloCuandoHayaFuentes(h, delay + 0.15 + i * 0.1); });
        animarHijos(q('.pr-hijo', el), delay + 0.25, 0.55, 0.05);
      }
    }

    /* ── 5 · Lotes por scroll ─────────────────────────────────── */
    function esHero(el) { return !!el.closest('.hero'); }
    var pendientes = objetivos.filter(function (el) { return !esHero(el); });

    /* Sin batchMax: cuando varios nodos entran en el mismo tick (scroll
       rápido), los que pasaban del tope quedaban en un segundo lote que a
       veces no llegaba a dispararse si el usuario ya había vuelto a subir
       (medido: .footer-bottom se quedaba en opacity 0). Con un solo lote y
       el escalonado topado en 5 pasos se ve igual y no falla. */
    /* clamp(): para los últimos nodos de la página (el pie) "top 88%" cae
       más allá del scroll máximo y el disparador no llegaba nunca (medido:
       start 3908 con scroll máximo 3858). Con clamp se dispara al llegar
       al final. */
    ScrollTrigger.batch(pendientes, {
      start: 'clamp(top 88%)',
      once: true,
      interval: 0.1,
      onEnter: function (lote) { lote.forEach(function (el, i) { entrar(el, Math.min(i, 5) * STAGGER); }); }
    });

    /* ── 6 · Heros ────────────────────────────────────────────── */
    // Hero compacto de las interiores: la CSS anima antetítulo y párrafo
    // con keyframes; el h1 lleva un delay de 250 ms en CSS. Si llegamos
    // antes, se hace por líneas; si no, se deja terminar el fundido CSS.
    var h1 = document.querySelector('.hero-compact h1:not(.solo-lectores)');
    if (h1 && conSplit && parseFloat(getComputedStyle(h1).opacity) < 0.05) {
      h1.style.animation = 'none';
      ocultarTitulo(h1);
      tituloCuandoHayaFuentes(h1, 0.12);
    }
    objetivos.filter(esHero).forEach(function (el, i) { entrar(el, 0.2 + i * STAGGER); });

    /* ── 7 · Contadores ───────────────────────────────────────── */
    q('[data-counter]').forEach(function (el) {
      var target = parseFloat(el.dataset.counter);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      var obj = { val: 0 };
      el.textContent = prefix + (0).toFixed(decimals) + suffix;
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(obj, { val: target, duration: 1.4, ease: 'power2.out', onUpdate: function () { el.textContent = prefix + obj.val.toFixed(decimals) + suffix; } });
        }
      });
    });

    /* ── 8 · Comparadores: la pista del tirador se apaga al usarlos ── */
    q('.ba').forEach(function (ba) {
      var r = ba.querySelector('.ba-rango');
      if (r) r.addEventListener('input', function () { ba.classList.add('usado'); }, { once: true, passive: true });
    });

    /* ── 9 · Failsafes sin mediciones ─────────────────────────── */
    // (a) IntersectionObserver: en cuanto algo asoma a la vista, si 0,7 s
    //     después sigue sin entrar, se le fuerza la entrada (aunque el
    //     usuario ya haya pasado de largo: mejor animarlo fuera de pantalla
    //     que dejarlo invisible). Inmune al zoom.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          io.unobserve(el);
          setTimeout(function () { if (!hechos.has(el)) entrar(el, 0); }, 700);
        });
      }, { threshold: 0.01 });
      pendientes.forEach(function (el) { io.observe(el); });
    }
    // (b) Si a los 3,5 s no entró NADA (ScrollTrigger roto), todo visible.
    setTimeout(function () { if (entradas === 0) mostrarTodo(); }, 3500);
    // (c) Refrescos: al cargar imágenes y fuentes cambia el layout.
    window.addEventListener('load', function () { ScrollTrigger.refresh(); setTimeout(function () { ScrollTrigger.refresh(); }, 1200); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
