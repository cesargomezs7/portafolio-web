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

  /* Los textos que este archivo escribe también tienen que respetar el
     idioma de la página: si no, en /en/ el botón del hero salta a
     "Silenciar" al primer clic. */
  var EN = /\/en\//.test(location.pathname);
  var TXT = EN
    ? { sonidoOn: 'Turn on sound', sonidoOff: 'Mute' }
    : { sonidoOn: 'Activar sonido', sonidoOff: 'Silenciar' };

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

    /* El marco toma la proporción REAL del video en cuanto se conoce.
       El de escritorio es 1280x720 (16:9) y el de celular 720x450 (1,60):
       con un 16/9 fijo, al de celular le cortaba los lados. */
    var ajustarProporcion = function () {
      if (!v.videoWidth || !v.videoHeight) return;
      var caja = v.closest('.hv-pantalla');
      if (caja) caja.style.setProperty('--ratio-video', v.videoWidth + ' / ' + v.videoHeight);
    };
    v.addEventListener('loadedmetadata', ajustarProporcion);
    ajustarProporcion();

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
      btn.querySelector('.hv-sonido-txt').textContent = encendido ? TXT.sonidoOff : TXT.sonidoOn;
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
  (function anilloTestimonios() {
    /* Seis testimonios en seis posiciones. Cada tanto, todos avanzan
       una posición siguiendo el anillo:

            arriba   [2] <- [1] <- [0]
                      |              ^
            abajo    [3] -> [4] -> [5]

       Ninguna tarjeta queda cortada por el borde: se mueven de una
       posición a otra, siempre enteras. Un video a medias no se puede
       ver, que es justo lo que fallaba con la cinta continua. */
    var anillo = document.getElementById('vtAnillo');
    if (!anillo) return;
    var tarjetas = [].slice.call(anillo.querySelectorAll('.vt-card'));
    if (tarjetas.length !== 6) return;

    var PASOS = 6, giro = 0, detenido = false, reloj = null;

    /* posición -> columna y fila, en el orden en que viajan */
    function coordenadas(slot) {
      return slot < 3 ? { col: 2 - slot, fila: 0 } : { col: slot - 3, fila: 1 };
    }

    function colocar(animado) {
      /* ⚠ NO leer --vt-card con getComputedStyle: es un calc() y el navegador
         devuelve la cadena literal sin resolver, así que parseFloat da NaN y
         el transform queda inválido (medido: las 6 tarjetas apiladas en 0,0).
         Se mide la geometría real. Y con offsetWidth/offsetHeight, no con
         getBoundingClientRect: bajo body{zoom} el rect viene escalado y el
         transform se aplica en píxeles CSS. */
      var ancho = tarjetas[0].offsetWidth;
      var alto  = tarjetas[0].offsetHeight;
      var hueco = parseFloat(getComputedStyle(anillo).getPropertyValue('--vt-hueco')) || 18;
      if (!ancho || !alto) return;
      anillo.style.height = (alto * 2 + hueco) + 'px';
      tarjetas.forEach(function (c, i) {
        var s = (i + giro) % PASOS;
        var p = coordenadas(s);
        if (!animado) c.style.transition = 'none';
        c.style.setProperty('--x', (p.col * (ancho + hueco)) + 'px');
        c.style.setProperty('--y', (p.fila * (alto + hueco)) + 'px');
        if (!animado) { c.offsetHeight; c.style.transition = ''; }
      });
    }

    function avanzar() { if (!detenido) { giro = (giro + 1) % PASOS; colocar(true); } }

    function arrancarReloj() {
      if (reloj) clearInterval(reloj);
      if (!reducido) reloj = setInterval(avanzar, 4200);
    }

    /* ── el video de cada tarjeta ── */
    function crearVideo(card) {
      var v = card.querySelector('video');
      if (v) return v;
      var src = card.getAttribute('data-video');
      if (!src) return null;
      v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.loop = true;
      v.playsInline = true;
      v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
      v.preload = 'auto';
      var poster = card.querySelector('.vt-poster');
      if (poster) v.poster = poster.getAttribute('src');
      v.src = src;
      card.insertBefore(v, card.firstChild);
      return v;
    }

    function reproducirTodos() {
      tarjetas.forEach(function (c) {
        var v = crearVideo(c);
        if (v && v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    }
    function pausarTodos() {
      tarjetas.forEach(function (c) {
        var v = c.querySelector('video');
        if (v && !v.paused) v.pause();
      });
    }

    /* Solo se crean y reproducen cuando la sección está a la vista */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (!reducido) reproducirTodos(); arrancarReloj(); }
          else { pausarTodos(); if (reloj) { clearInterval(reloj); reloj = null; } }
        });
      }, { threshold: 0.12 }).observe(anillo);
    } else { reproducirTodos(); arrancarReloj(); }

    /* ── enfoque: cursor encima = se detiene el anillo y salen los
          controles del video (avance, tiempo y volumen) ── */
    function enfocar(card) {
      detenido = true;
      tarjetas.forEach(function (o) {
        if (o === card) return;
        var ov = o.querySelector('video');
        o.classList.remove('enfoque');
        if (ov) { ov.controls = false; ov.muted = true; ov.loop = true; }
      });
      var v = crearVideo(card);
      if (!v) return;
      card.classList.add('enfoque');
      v.controls = true; v.loop = false; v.muted = false;
      var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play(); });
    }
    function soltar(card) {
      var v = card.querySelector('video');
      card.classList.remove('enfoque');
      if (v) { v.controls = false; v.muted = true; v.loop = true;
               var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      detenido = false;
    }

    tarjetas.forEach(function (c) {
      c.addEventListener('mouseenter', function () { enfocar(c); });
      c.addEventListener('mouseleave', function () { soltar(c); });
      c.addEventListener('click', function (e) {
        if (c.classList.contains('enfoque')) return;   // el clic va a los controles
        e.preventDefault(); enfocar(c);
      });
    });
    document.addEventListener('click', function (e) {
      if (!anillo.contains(e.target)) {
        tarjetas.forEach(function (c) { if (c.classList.contains('enfoque')) soltar(c); });
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { pausarTodos(); if (reloj) { clearInterval(reloj); reloj = null; } }
      else { reproducirTodos(); arrancarReloj(); }
    });

    window.addEventListener('resize', function () { colocar(false); });
    colocar(false);
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
