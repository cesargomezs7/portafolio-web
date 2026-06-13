/* ───────────────────────────────────────────────
   Módulo Pronto · Navegación compartida
   Inyecta el navbar (con desplegables Servicios/Sedes)
   y el menú móvil en <div id="site-nav"></div>.
   Marca activo según la página y maneja scroll + burger.
   Editar el menú UNA sola vez aquí → aplica a todas las páginas.
   ─────────────────────────────────────────────── */
(function () {
  var mount = document.getElementById('site-nav');
  if (!mount) return;

  var WA = 'https://wa.me/573172328959';
  var chev = '<svg class="nav-chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var navbar =
    '<nav class="navbar" id="navbar">' +
      '<button class="nav-burger" id="navBurger" aria-label="Abrir menú"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg></button>' +
      '<a href="index.html" class="nav-logo">DentiTown</a>' +
      '<ul class="nav-links">' +
        '<li><a href="index.html" data-nav="inicio">Inicio</a></li>' +
        '<li class="nav-dd">' +
          '<a href="index.html#servicios" data-nav="servicios">Servicios ' + chev + '</a>' +
          '<ul class="nav-sub">' +
            '<li><a href="ortodoncia.html">Ortodoncia</a></li>' +
            '<li><a href="implantes.html">Implantes dentales</a></li>' +
            '<li><a href="blanqueamiento.html">Blanqueamiento</a></li>' +
            '<li><a href="diseno-de-sonrisa.html">Diseño de sonrisa</a></li>' +
            '<li><a href="endodoncia.html">Endodoncia</a></li>' +
            '<li><a href="odontologia-general.html">Odontología general</a></li>' +
          '</ul>' +
        '</li>' +
        '<li class="nav-dd">' +
          '<a href="contacto.html#sedes" data-nav="sedes">Sedes ' + chev + '</a>' +
          '<ul class="nav-sub">' +
            '<li><a href="sede-chapinero.html">Chapinero · Bogotá</a></li>' +
            '<li><a href="sede-chico.html">Chicó · Bogotá</a></li>' +
            '<li><a href="sede-poblado.html">El Poblado · Medellín</a></li>' +
          '</ul>' +
        '</li>' +
        '<li><a href="nosotros.html" data-nav="nosotros">Nosotros</a></li>' +
        '<li><a href="contacto.html" data-nav="contacto">Contacto</a></li>' +
      '</ul>' +
      '<a href="' + WA + '?text=Hola%20DentiTown,%20quiero%20agendar%20una%20valoración" target="_blank" class="nav-cta">Agendar consulta</a>' +
    '</nav>';

  var mobile =
    '<div class="mobile-menu" id="mobileMenu">' +
      '<button class="mm-close" id="mmClose" aria-label="Cerrar menú">&times;</button>' +
      '<ul>' +
        '<li><a href="index.html">Inicio</a></li>' +
        '<li class="mm-group">Servicios</li>' +
        '<li><a class="mm-sub" href="ortodoncia.html">Ortodoncia</a></li>' +
        '<li><a class="mm-sub" href="implantes.html">Implantes dentales</a></li>' +
        '<li><a class="mm-sub" href="blanqueamiento.html">Blanqueamiento</a></li>' +
        '<li><a class="mm-sub" href="diseno-de-sonrisa.html">Diseño de sonrisa</a></li>' +
        '<li><a class="mm-sub" href="endodoncia.html">Endodoncia</a></li>' +
        '<li><a class="mm-sub" href="odontologia-general.html">Odontología general</a></li>' +
        '<li class="mm-group">Sedes</li>' +
        '<li><a class="mm-sub" href="sede-chapinero.html">Chapinero · Bogotá</a></li>' +
        '<li><a class="mm-sub" href="sede-chico.html">Chicó · Bogotá</a></li>' +
        '<li><a class="mm-sub" href="sede-poblado.html">El Poblado · Medellín</a></li>' +
        '<li><a href="nosotros.html">Nosotros</a></li>' +
        '<li><a href="contacto.html">Contacto</a></li>' +
        '<li><a class="mm-cta" href="' + WA + '?text=Hola%20DentiTown,%20quiero%20agendar%20una%20valoración" target="_blank">Agendar por WhatsApp</a></li>' +
      '</ul>' +
    '</div>';

  mount.outerHTML = navbar + mobile;

  // ── Marcar activo según la página ──
  var path = (location.pathname.split('/').pop() || 'index.html');
  var servicePages = ['ortodoncia.html', 'implantes.html', 'blanqueamiento.html', 'diseno-de-sonrisa.html', 'endodoncia.html', 'odontologia-general.html'];
  var sedePages = ['sede-chapinero.html', 'sede-chico.html', 'sede-poblado.html'];
  var key = 'inicio';
  if (path === 'nosotros.html') key = 'nosotros';
  else if (path === 'contacto.html') key = 'contacto';
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
