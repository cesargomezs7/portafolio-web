/* Ten Salud Oral · interacciones + medición */
(function () {
  'use strict';

  var WORKER = 'https://pronto-forms-worker.cesargomezs711.workers.dev';
  var CLINICA = 'Ten Salud Oral';
  var WA = '573148924108';

  /* ── Tracking ───────────────────────────── */
  function track(event) {
    try {
      fetch(WORKER + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event, clinica: CLINICA }),
        keepalive: true
      }).catch(function () {});
    } catch (e) { /* nunca romper la página por tracking */ }
  }
  window.tsoTrack = track;
  track('visit');

  /* clic en cualquier enlace de WhatsApp */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href*="wa.me"]');
    if (a) track('wa_click');
  });

  /* ── Header con sombra al hacer scroll ──── */
  var header = document.querySelector('.header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Menú móvil ─────────────────────────── */
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });
  }

  /* ── Reveal on scroll ───────────────────── */
  var rvObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { rvObs.observe(el); });

  /* ── Contadores animados ────────────────── */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var dur = 1600, t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-CO');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var cObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cObs.observe(el); });

  /* ── Sliders antes / después ────────────── */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba-range');
    if (!range) return;
    range.addEventListener('input', function () {
      ba.style.setProperty('--pos', range.value + '%');
    });
  });

  /* ── Burbuja WhatsApp inteligente ───────── */
  var wab = document.querySelector('.wab');
  if (wab) {
    var label = wab.querySelector('.wab-label');
    var defaultMsg = wab.getAttribute('data-msg') || 'Hola, quiero agendar una cita en Ten Salud Oral.';
    var defaultLabel = label ? label.textContent : '';
    var current = '';

    function setContext(msg, text) {
      if (current === text) return;
      current = text;
      wab.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
      if (label && label.textContent !== text) {
        label.classList.add('swap');
        setTimeout(function () {
          label.textContent = text;
          label.classList.remove('swap');
        }, 220);
      }
    }
    setContext(defaultMsg, defaultLabel);

    var sections = document.querySelectorAll('[data-wa]');
    if (sections.length) {
      var waObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var msg = e.target.getAttribute('data-wa');
            var txt = e.target.getAttribute('data-wa-label') || defaultLabel;
            setContext(msg, txt);
          }
        });
      }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
      sections.forEach(function (s) { waObs.observe(s); });
    }
  }

  /* ── Formulario de contacto ─────────────── */
  var form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var ok = form.querySelector('.form-ok');
      var err = form.querySelector('.form-err');
      ok.style.display = 'none'; err.style.display = 'none';
      btn.disabled = true;
      var prev = btn.textContent;
      btn.textContent = 'Enviando…';
      var data = {
        nombre: form.nombre.value.trim(),
        telefono: form.telefono.value.trim(),
        servicio: form.servicio.value,
        sede: 'El Carmen de Viboral',
        mensaje: form.mensaje.value.trim(),
        clinica: CLINICA
      };
      fetch(WORKER + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        form.reset();
        ok.style.display = 'block';
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).catch(function () {
        err.style.display = 'block';
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = prev;
      });
    });
  }
})();
