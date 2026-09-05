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

  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · Video del hero ───────────────────────────────────
     Arranca solo. Todos los navegadores exigen que el autoplay
     vaya en silencio, así que se ofrece un botón para el sonido.
     En celular se sirve la versión ligera que ellos ya tenían. */
  (function heroVideo() {
    var v = document.getElementById('heroVideo');
    if (!v) return;

    /* La fuente de celular NO se cambia aquí: va declarada en el HTML con
       <source media>. Hacerlo por JS provocaba una descarga doble (medido:
       16,7 MB en celular en vez de 5). */

    var intento = v.play();
    if (intento && intento.catch) {
      intento.catch(function () {
        // Si el navegador bloquea incluso el autoplay silencioso,
        // se muestran los controles para que se pueda ver a mano.
        v.controls = true;
      });
    }

    var btn = document.getElementById('heroSonido');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var encendido = v.muted;
      v.muted = !encendido;
      btn.setAttribute('aria-pressed', encendido ? 'true' : 'false');
      btn.querySelector('.hv-sonido-txt').textContent = encendido ? 'Silenciar' : 'Activar sonido';
      if (encendido && v.paused) v.play();
    });

    // Al salir de la pantalla se pausa: no tiene sentido gastar
    // batería y datos reproduciendo algo que nadie está viendo.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (v.paused) v.play().catch(function () {}); }
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.15 }).observe(v);
    }
  })();

  /* ── 2 · Comparadores antes / después ───────────────────── */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var rango = ba.querySelector('.ba-rango');
    if (!rango) return;
    var pintar = function () { ba.style.setProperty('--pos', rango.value + '%'); };
    rango.addEventListener('input', pintar);
    pintar();
  });

  /* ── 3 · Carrusel de videotestimonios ────────────────────
     Los videos van SOLOS, sin pulsar nada. Para no reventar el
     navegador con 36 reproductores:
       · el <video> se crea solo en las tarjetas que están a la
         vista (IntersectionObserver) y se destruye al salir;
       · todas las copias del mismo testimonio comparten el
         segundo exacto de reproducción, así el que va saliendo
         por arriba va igual de avanzado que su gemelo de abajo;
       · al pasar el ratón, la cinta y los videos se detienen.  */
  (function carrusel() {
    var wrap = document.querySelector('.vt-wrap');
    if (!wrap) return;
    var tarjetas = [].slice.call(wrap.querySelectorAll('.vt-card'));
    if (!tarjetas.length) return;

    var reloj = {};   // segundo compartido por cada testimonio

    function crearVideo(card) {
      if (card.querySelector('video')) return card.querySelector('video');
      var src = card.getAttribute('data-video');
      if (!src) return null;
      var v = document.createElement('video');
      v.muted = true;                 // requisito del autoplay
      v.defaultMuted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');
      v.preload = 'auto';
      var poster = card.querySelector('.vt-poster');
      if (poster) v.poster = poster.getAttribute('src');
      v.src = src;
      card.insertBefore(v, card.firstChild);
      // se engancha al segundo que lleve su gemelo
      var t = reloj[src] || 0;
      v.addEventListener('loadedmetadata', function () {
        if (v.duration && t) { try { v.currentTime = t % v.duration; } catch (e) {} }
      });
      return v;
    }

    function soltar(card) {
      var v = card.querySelector('video');
      if (!v) return;
      reloj[card.getAttribute('data-video')] = v.currentTime;
      v.pause(); v.removeAttribute('src'); v.load(); v.remove();
      card.classList.remove('reproduciendo');
    }

    var pausado = false;

    function arrancar(card) {
      var v = crearVideo(card);
      if (!v) return;
      card.classList.add('reproduciendo');
      if (!pausado) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    }

    if (reducido) {
      /* Quien pidió menos movimiento no recibe autoplay. Pero la tarjeta
         no puede quedarse muerta: al pulsarla, se reproduce. */
      tarjetas.forEach(function (c) {
        c.addEventListener('click', function () {
          var v = c.querySelector('video');
          if (v) { soltar(c); return; }
          v = crearVideo(c);
          if (!v) return;
          v.muted = false; v.controls = true; v.loop = false;
          c.classList.add('reproduciendo');
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        });
      });
    }

    if ('IntersectionObserver' in window && !reducido) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) arrancar(e.target);
          else soltar(e.target);
        });
      }, { root: null, rootMargin: '120px', threshold: 0.25 });
      tarjetas.forEach(function (c) { obs.observe(c); });
    }

    /* Sincronía: cada segundo, todas las copias de un mismo
       testimonio se alinean con la que va más adelantada. Sin
       esto, las dos filas se van separando con el tiempo. */
    setInterval(function () {
      var lider = {};
      tarjetas.forEach(function (c) {
        var v = c.querySelector('video');
        if (!v || v.readyState < 2) return;
        var k = c.getAttribute('data-video');
        if (lider[k] === undefined || v.currentTime > lider[k]) lider[k] = v.currentTime;
      });
      tarjetas.forEach(function (c) {
        var v = c.querySelector('video');
        if (!v || v.readyState < 2 || !v.duration) return;
        var k = c.getAttribute('data-video');
        var meta = lider[k];
        if (meta !== undefined && Math.abs(v.currentTime - meta) > 0.2) {
          try { v.currentTime = meta % v.duration; } catch (e) {}
        }
        reloj[k] = meta;
      });
    }, 700);

    /* Tocar una tarjeta le pone sonido (y silencia las demás). Los
       videos van en silencio porque el autoplay lo exige, así que
       este es el único modo de oír a un paciente. */
    if (!reducido) {
      tarjetas.forEach(function (c) {
        c.addEventListener('click', function () {
          var v = c.querySelector('video');
          if (!v) return;
          var eraMudo = v.muted;
          tarjetas.forEach(function (o) {
            var ov = o.querySelector('video');
            if (ov) { ov.muted = true; }
            o.classList.remove('con-sonido');
          });
          if (eraMudo) {
            v.muted = false;
            c.classList.add('con-sonido');
            if (v.paused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          }
        });
      });
    }

    /* Al pasar el ratón se detiene todo: la cinta (CSS) y los videos. */
    function congelar(si) {
      pausado = si;
      wrap.querySelectorAll('.vt-fila').forEach(function (f) {
        f.style.animationPlayState = si ? 'paused' : '';
      });
      tarjetas.forEach(function (c) {
        var v = c.querySelector('video');
        if (!v) return;
        if (si) v.pause();
        else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    }
    wrap.addEventListener('mouseenter', function () { congelar(true); });
    wrap.addEventListener('mouseleave', function () { congelar(false); });

    // Con la pestaña en segundo plano, nada de gastar batería.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) congelar(true);
      else if (!wrap.matches(':hover')) congelar(false);
    });
  })();

  /* ── 4 · Burbuja de WhatsApp con las dos sedes ───────────── */
  (function whatsapp() {
    var burbuja = document.getElementById('waFloat');
    var panel = document.getElementById('waPanel');
    if (!burbuja || !panel) return;

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

    /* El mensaje prellenado cambia según la sección (data-wa) y
       wa-widget.js actualiza el href de la burbuja. Aquí se propaga
       ese texto a los dos botones de sede. */
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
  })();

  /* ── 5 · Galería de la clínica, con cambio de sede ───────── */
  (function galeria() {
    var g = document.querySelector('.gal');
    if (!g) return;
    var botones = [].slice.call(g.querySelectorAll('.gal-tab'));
    var paneles = [].slice.call(g.querySelectorAll('.gal-panel'));
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        var sede = b.getAttribute('data-sede');
        botones.forEach(function (x) {
          var act = x === b;
          x.classList.toggle('activo', act);
          x.setAttribute('aria-selected', act ? 'true' : 'false');
        });
        paneles.forEach(function (p) {
          p.classList.toggle('activo', p.getAttribute('data-sede') === sede);
        });
      });
    });
  })();

  /* ── 6 · Carrusel de opiniones de Google ──────────────────
     Las opiniones viven en un array al principio de index.html
     (window.ORALTECH_OPINIONES) para que actualizarlas no obligue
     a tocar el HTML: se pegan ahí y listo. */
  (function opiniones() {
    var caja = document.getElementById('opCarrusel');
    if (!caja) return;
    var pista = caja.querySelector('.op-pista');
    var tarjetas = [].slice.call(pista.children);
    if (!tarjetas.length) return;

    var i = 0, porVista = 1, auto = null;

    function calcularPorVista() {
      var a = caja.clientWidth;
      porVista = a >= 660 ? 2 : 1;
      return porVista;
    }
    function maxIndice() { return Math.max(0, tarjetas.length - calcularPorVista()); }

    /* ⚠ El paso NO se calcula como ancho + gap: styles.css aplica
       body{zoom} en pantallas grandes, así que getBoundingClientRect
       devuelve píxeles YA escalados y getComputedStyle los del CSS sin
       escalar. Mezclarlos desalineaba el carrusel y dejaba tarjetas
       partidas (medido: 2 partidas en la posición 1). Se mide la
       distancia entre dos tarjetas vecinas, que ya viene en el mismo
       espacio, y se guarda; solo se vuelve a medir al cambiar el ancho. */
    var paso = 0;
    function medirPaso() {
      /* offsetLeft, NO getBoundingClientRect: bajo body{zoom} el rect viene
         multiplicado por el zoom mientras que translateX() se aplica en
         píxeles CSS, así que usar el rect desplazaba de más. offsetLeft está
         en el mismo espacio que el transform. Medido: con el rect quedaban
         2 tarjetas partidas a 1440px (zoom 1,1) y a 1920px (zoom 1,5);
         con offsetLeft, cero en los cinco anchos probados. */
      if (tarjetas.length < 2) { paso = tarjetas[0].offsetWidth; return; }
      paso = tarjetas[1].offsetLeft - tarjetas[0].offsetLeft;
    }

    function pintar() {
      if (!paso) medirPaso();
      pista.style.transform = 'translateX(' + (-i * paso) + 'px)';
      caja.querySelectorAll('.op-punto').forEach(function (p, n) {
        p.classList.toggle('activo', n === i);
      });
      var prev = caja.querySelector('.op-nav.prev'), sig = caja.querySelector('.op-nav.sig');
      if (prev) prev.disabled = i <= 0;
      if (sig) sig.disabled = i >= maxIndice();
    }

    function ir(n) { i = Math.max(0, Math.min(maxIndice(), n)); pintar(); }

    caja.querySelectorAll('.op-nav').forEach(function (b) {
      b.addEventListener('click', function () {
        ir(i + (b.classList.contains('sig') ? 1 : -1));
        reiniciarAuto();
      });
    });
    caja.querySelectorAll('.op-punto').forEach(function (p, n) {
      p.addEventListener('click', function () { ir(n); reiniciarAuto(); });
    });

    function reiniciarAuto() {
      if (auto) clearInterval(auto);
      if (reducido) return;
      auto = setInterval(function () { ir(i >= maxIndice() ? 0 : i + 1); }, 6500);
    }
    caja.addEventListener('mouseenter', function () { if (auto) clearInterval(auto); });
    caja.addEventListener('mouseleave', reiniciarAuto);

    // arrastre con el dedo
    var x0 = null;
    caja.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    caja.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var d = e.changedTouches[0].clientX - x0;
      if (Math.abs(d) > 45) { ir(i + (d < 0 ? 1 : -1)); reiniciarAuto(); }
      x0 = null;
    }, { passive: true });

    window.addEventListener('resize', function () {
      var previo = pista.style.transition;
      pista.style.transition = 'none';
      pista.style.transform = 'translateX(0px)';
      medirPaso();
      pista.style.transition = previo;
      ir(i);
    });
    pintar(); reiniciarAuto();
  })();

  /* ── 7 · Cifras: subrayado dorado al entrar en pantalla ──── */
  (function cifras() {
    var celdas = document.querySelectorAll('.stats-grid > div');
    if (!celdas.length || !('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vista'); o.unobserve(e.target); } });
    }, { threshold: 0.4 });
    celdas.forEach(function (c) { o.observe(c); });
  })();
})();
