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
  /* RAIZ = camino hasta la raíz del sitio (donde viven assets/, img/ y
     video/). Se deduce del propio <script src>. */
  var RAIZ = me ? (me.getAttribute('src') || '').replace(/assets\/nav\.js.*$/, '') : '';

  /* ── Idioma ──────────────────────────────────────────────
     El español vive en la raíz y el inglés en /en/. El selector
     lleva a la MISMA página en el otro idioma, no a la portada:
     mandar a alguien al inicio cuando estaba leyendo implantes es
     perder la visita. */
  var enIngles = /\/en\//.test(location.pathname);
  var archivo  = (location.pathname.split('/').pop() || 'index.html');
  var enBlog   = location.pathname.indexOf('/blog/') >= 0;

  /* BASE = camino hasta la raíz del IDIOMA actual. No es lo mismo que RAIZ:
     desde /en/implantes.html los recursos están en ../assets/ pero los
     enlaces a otras páginas son hermanos, sin prefijo. */
  var BASE = RAIZ + (enIngles ? 'en/' : '');

  /* La misma página en el otro idioma. Mandar a la portada a quien estaba
     leyendo implantes es perder la visita. */
  function gemela(destinoIngles) {
    return RAIZ + (destinoIngles ? 'en/' : '') + (enBlog ? 'blog/' : '') + archivo;
  }

  /* ── Textos en los dos idiomas ─────────────────────────────
     El menú lo inyecta este archivo, así que si los textos van en
     duro, una página en inglés termina con el menú en español.
     Es lo que pasaba y es de los fallos que más delatan una web
     "traducida a medias" ante un paciente extranjero. */
  var T = enIngles ? {
    logoAlt:   'OralTech · Dental clinic',
    logoTag:   'Dentistry · Cúcuta & Medellín',
    abrir:     'Open menu',
    cerrar:    'Close menu',
    inicio:    'Home',
    servicios: 'Services',
    sonrisa:   'Smile design',
    micro:     'Micro smile design',
    orto:      'Orthodontics',
    blanq:     'Teeth whitening',
    limpieza:  'Dental cleaning',
    implantes: 'Dental implants',
    sedes:     'Locations',
    cucuta:    'Quinta Oriental · Cúcuta',
    medellin:  'El Poblado · Medellín',
    casos:     'Results',
    nosotros:  'About us',
    blog:      'Blog',
    contacto:  'Contact',
    ciudades:  'Cúcuta · Medellín',
    agendar:   'Book now',
    agendarWA: 'Book on WhatsApp',
    idiomaLbl: 'Language',
    mensaje:   'Hi,%20I%20found%20you%20on%20your%20website%20and%20I%27d%20like%20to%20book%20an%20appointment.'
  } : {
    logoAlt:   'OralTech · Clínica dental',
    logoTag:   'Odontología · Cúcuta y Medellín',
    abrir:     'Abrir menú',
    cerrar:    'Cerrar menú',
    inicio:    'Inicio',
    servicios: 'Servicios',
    sonrisa:   'Diseño de sonrisa',
    micro:     'Microdiseño',
    orto:      'Ortodoncia',
    blanq:     'Blanqueamiento',
    limpieza:  'Limpieza dental',
    implantes: 'Implantes dentales',
    sedes:     'Sedes',
    cucuta:    'Quinta Oriental · Cúcuta',
    medellin:  'El Poblado · Medellín',
    casos:     'Casos',
    nosotros:  'Nosotros',
    blog:      'Blog',
    contacto:  'Contacto',
    ciudades:  'Cúcuta · Medellín',
    agendar:   'Agendar',
    agendarWA: 'Agendar por WhatsApp',
    idiomaLbl: 'Idioma',
    mensaje:   'Hola,%20vengo%20de%20su%20p%C3%A1gina%20web%20y%20quiero%20agendar%20una%20cita.'
  };

  var WA = 'https://wa.me/573224130747';
  var chev = '<svg class="nav-chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var logo =
    '<a href="' + BASE + 'index.html" class="nav-logo">' +
      '<img class="nav-logo-img" src="' + RAIZ + 'img/logo-oraltech-navy-nav.png" ' +
           'alt="' + T.logoAlt + '" width="136" height="34" decoding="async">' +
      '<span class="nav-logo-tag">' + T.logoTag + '</span>' +
    '</a>';

  var navbar =
    '<nav class="navbar" id="navbar">' +
      '<button class="nav-burger" id="navBurger" aria-label="\' + T.abrir + \'"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg></button>' +
      logo +
      '<ul class="nav-links">' +
        '<li><a href="' + BASE + 'index.html" data-nav="inicio">' + T.inicio + '</a></li>' +
        '<li class="nav-dd">' +
          '<a href="' + BASE + 'index.html#servicios" data-nav="servicios">' + T.servicios + ' ' + chev + '</a>' +
          '<ul class="nav-sub">' +
            '<li><a href="' + BASE + 'diseno-de-sonrisa.html">' + T.sonrisa + '</a></li>' +
            '<li><a href="' + BASE + 'microdiseno.html">' + T.micro + '</a></li>' +
            '<li><a href="' + BASE + 'ortodoncia.html">' + T.orto + '</a></li>' +
            '<li><a href="' + BASE + 'blanqueamiento.html">' + T.blanq + '</a></li>' +
            '<li><a href="' + BASE + 'limpieza-dental.html">' + T.limpieza + '</a></li>' +
            '<li><a href="' + BASE + 'implantes.html">' + T.implantes + '</a></li>' +
          '</ul>' +
        '</li>' +
        '<li class="nav-dd">' +
          '<a href="' + BASE + 'contacto.html#sedes" data-nav="sedes">' + T.sedes + ' ' + chev + '</a>' +
          '<ul class="nav-sub">' +
            '<li><a href="' + BASE + 'sede-cucuta.html">' + T.cucuta + '</a></li>' +
            '<li><a href="' + BASE + 'sede-medellin.html">' + T.medellin + '</a></li>' +
          '</ul>' +
        '</li>' +
        '<li><a href="' + BASE + 'casos.html" data-nav="casos">' + T.casos + '</a></li>' +
        '<li><a href="' + BASE + 'nosotros.html" data-nav="nosotros">' + T.nosotros + '</a></li>' +
        '<li><a href="' + BASE + 'blog/index.html" data-nav="blog">Blog</a></li>' +
        '<li><a href="' + BASE + 'contacto.html" data-nav="contacto">' + T.contacto + '</a></li>' +
      '</ul>' +
      '<div class="nav-right">' +
        '<div class="idioma" role="group" aria-label="\' + T.idiomaLbl + \'">' +
          '<a class="idioma-op' + (enIngles ? '' : ' activo') + '" href="' + gemela(false) + '" hreflang="es" lang="es"' + (enIngles ? '' : ' aria-current="true"') + '>ES</a>' +
          '<a class="idioma-op' + (enIngles ? ' activo' : '') + '" href="' + gemela(true) + '" hreflang="en" lang="en"' + (enIngles ? ' aria-current="true"' : '') + '>EN</a>' +
        '</div>' +
        '<div class="nav-location">' + T.ciudades + '</div>' +
        '<a href="' + WA + '?text=' + T.mensaje + '" target="_blank" class="nav-menu-btn">' + T.agendar + '</a>' +
      '</div>' +
    '</nav>';

  var mobile =
    '<div class="mobile-menu" id="mobileMenu">' +
      '<button class="mm-close" id="mmClose" aria-label="\' + T.cerrar + \'">&times;</button>' +
      '<ul>' +
        '<li><a href="' + BASE + 'index.html">' + T.inicio + '</a></li>' +
        '<li class="mm-group">' + T.servicios + '</li>' +
        '<li><a class="mm-sub" href="' + BASE + 'diseno-de-sonrisa.html">' + T.sonrisa + '</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'microdiseno.html">' + T.micro + '</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'ortodoncia.html">' + T.orto + '</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'blanqueamiento.html">' + T.blanq + '</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'limpieza-dental.html">' + T.limpieza + '</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'implantes.html">' + T.implantes + '</a></li>' +
        '<li class="mm-group">' + T.sedes + '</li>' +
        '<li><a class="mm-sub" href="' + BASE + 'sede-cucuta.html">' + T.cucuta + '</a></li>' +
        '<li><a class="mm-sub" href="' + BASE + 'sede-medellin.html">' + T.medellin + '</a></li>' +
        '<li><a href="' + BASE + 'casos.html">' + T.casos + '</a></li>' +
        '<li><a href="' + BASE + 'nosotros.html">' + T.nosotros + '</a></li>' +
        '<li><a href="' + BASE + 'blog/index.html">Blog</a></li>' +
        '<li><a href="' + BASE + 'contacto.html">' + T.contacto + '</a></li>' +
        '<li><a class="mm-cta" href="' + WA + '?text=' + T.mensaje + '" target="_blank">' + T.agendarWA + '</a></li>' +
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
