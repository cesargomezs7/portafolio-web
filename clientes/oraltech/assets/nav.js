/* ───────────────────────────────────────────────
   Módulo Pronto · Navegación compartida (piel IVORY)
   Inyecta el navbar (con desplegables Servicios/Sedes)
   y el menú móvil en <div id="site-nav"></div>.
   Conserva la estructura Ivory: logo diente + texto de
   dos líneas + nav-right (ubicación + botón Agendar).
   ─────────────────────────────────────────────── */
(function () {
  var mount = document.getElementById('site-nav');
  if (!mount) return;

  /* ── Base de rutas ──
     nav.js se incluye como "assets/nav.js" desde la raíz y como
     "../assets/nav.js" desde /blog/. Derivamos el prefijo de nuestro
     propio <script src> para que enlaces E IMÁGENES funcionen en ambos.
     (Con defer, document.currentScript es null: hay que buscarlo.) */
  var me = document.currentScript;
  if (!me) {
    var ss = document.getElementsByTagName('script');
    for (var i = 0; i < ss.length; i++) {
      if (/assets\/nav\.js/.test(ss[i].getAttribute('src') || '')) { me = ss[i]; break; }
    }
  }
  var BASE = me ? (me.getAttribute('src') || '').replace(/assets\/nav\.js.*$/, '') : '';

  var WA = 'https://wa.me/573224130747';
  var chev = '<svg class="nav-chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var logo =
    '<a href="' + BASE + 'index.html" class="nav-logo">' +
      '<img class="nav-logo-img" src="' + BASE + 'img/logo-oraltech-navy-nav.png" ' +
           'alt="OralTech · Clínica dental" width="136" height="34" decoding="async">' +
      '<span class="nav-logo-tag">Odontología · Cúcuta y Medellín</span>' +
    '</a>';

  var navbar =
    '<nav class="navbar" id="navbar">' +
      '<button class="nav-burger" id="navBurger" aria-label="Abrir menú"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg></button>' +
      logo +
      '<ul class="nav-links">' +
        '<li><a href="' + BASE + 'index.html" data-nav="inicio">Inicio</a></li>' +
        '<li class="nav-dd">' +
          '<a href="' + BASE + 'index.html#servicios" data-nav="servicios">Servicios ' + chev + '</a>' +
          '<ul class="nav-sub">' +
            '<li><a href="' + BASE + 'diseno-de-sonrisa.html">Diseño de sonrisa</a></li>' +
            '<li><a href="' + BASE + 'microdiseno.html">Microdiseño</a></li>' +
            '<li><a href="' + BASE + 'ortodoncia.html">Ortodoncia</a></li>' +
            '<li><a href="' + BASE + 'blanqueamiento.html">Blanqueamiento</a></li>' +
            '<li><a href="' + BASE + 'limpieza-dental.html">Limpieza dental</a></li>' +
            '<li><a href="' + BASE + 'implantes.html">Implantes dentales</a></li>' +
          '</ul>' +
        '</li>' +
        '<li class="nav-dd">' +
          '<a href="' + BASE + 'contacto.html#sedes" data-nav="sedes">Sedes ' + chev + '</a>' +
          '<ul class="nav-sub">' +
            '<li><a href="' + BASE + 'sede-cucuta.html">Quinta Oriental · Cúcuta</a></li>' +
            '<li><a href="' + BASE + 'sede-medellin.html">El Poblado · Medellín</a></li>' +
          '</ul>' +
        '</li>' +
        '<li><a href="' + BASE + 'casos.html" data-nav="casos">Casos</a></li>' +
        '<li><a href="' + BASE + 'nosotros.html" data-nav="nosotros">Nosotros</a></li>' +
        '<li><a href="' + BASE + 'blog/index.html" data-nav="blog">Blog</a></li>' +
        '<li><a href="' + BASE + 'contacto.html" data-nav="contacto">Contacto</a></li>' +
      '</ul>' +
      '<div class="nav-right">' +
        '<div class="nav-location">Cúcuta · Medellín</div>' +
        '<a href="' + WA + '?text=Hola,%20vengo%20de%20su%20página%20web%20y%20quiero%20agendar%20una%20cita." target="_blank" class="nav-menu-btn">Agendar</a>' +
      '</div>' +
    '</nav>';

  var mobile =
    '<div class="mobile-menu" id="mobileMenu">' +
      '<button class="mm-close" id="mmClose" aria-label="Cerrar menú">&times;</button>' +
      '<ul>' +
        '<li><a href="' + BASE + 'index.html">Inicio</a></li>' +
        '<li class="mm-group">Servicios</li>' +
        '<li><a class="mm-sub" href="' + BASE + 'diseno-de-sonrisa.html">Diseño de sonrisa</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'microdiseno.html">Microdiseño</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'ortodoncia.html">Ortodoncia</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'blanqueamiento.html">Blanqueamiento</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'limpieza-dental.html">Limpieza dental</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'implantes.html">Implantes dentales</a></li>' +
        '<li class="mm-group">Sedes</li>' +
        '<li><a class="mm-sub" href="' + BASE + 'sede-cucuta.html">Quinta Oriental · Cúcuta</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'sede-medellin.html">El Poblado · Medellín</a></li>' +
        '<li><a href="' + BASE + 'casos.html">Casos</a></li>' +
        '<li><a href="' + BASE + 'nosotros.html">Nosotros</a></li>' +
        '<li><a href="' + BASE + 'blog/index.html">Blog</a></li>' +
        '<li><a href="' + BASE + 'contacto.html">Contacto</a></li>' +
        '<li><a class="mm-cta" href="' + WA + '?text=Hola,%20vengo%20de%20su%20página%20web%20y%20quiero%20agendar%20una%20cita." target="_blank">Agendar por WhatsApp</a></li>' +
      '</ul>' +
    '</div>';

  mount.outerHTML = navbar + mobile;

  // ── Marcar activo según la página ──
  var path = (location.pathname.split('/').pop() || 'index.html');
  var servicePages = ['ortodoncia.html', 'implantes.html', 'blanqueamiento.html', 'diseno-de-sonrisa.html', 'microdiseno.html', 'limpieza-dental.html'];
  var sedePages = ['sede-cucuta.html', 'sede-medellin.html'];
  var key = 'inicio';
  if (path === 'casos.html') key = 'casos';
  else if (path === 'nosotros.html') key = 'nosotros';
  else if (path === 'contacto.html') key = 'contacto';
  else if (location.pathname.indexOf('/blog/') >= 0) key = 'blog';
  else if (servicePages.indexOf(path) >= 0) key = 'servicios';
  else if (sedePages.indexOf(path) >= 0) key = 'sedes';
  var activeEl = document.querySelector('.nav-links [data-nav="' + key + '"]');
  if (activeEl) activeEl.classList.add('active');

  // ── Navbar sólido al hacer scroll ──
  var navbar_el = document.getElementById('navbar');
  var onScroll = function () { navbar_el.classList.toggle('scrolled', window.scrollY > 60); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Burger / menú móvil ──
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('mobileMenu');
  var close = document.getElementById('mmClose');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.add('open'); document.body.style.overflow = 'hidden'; });
    var hide = function () { menu.classList.remove('open'); document.body.style.overflow = ''; };
    if (close) close.addEventListener('click', hide);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', hide); });
  }
})();
