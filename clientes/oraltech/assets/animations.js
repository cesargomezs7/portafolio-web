/* OralTech · Ivory · Animaciones GSAP
   Estrategia: animar ANTES de que el elemento entre al viewport
   + animaciones cortas (0.3-0.4s) para que estén completas cuando llegan a ojo.
   ───────────────────────────────────────────────────── */

(function () {
  /* Contadores al valor final, sin animación (14-ago-2026).
     Lo usan el modo reduced-motion y el fallback sin GSAP: sin esto esos
     visitantes veían "+0 AÑOS DE EXPERIENCIA" para siempre. */
  function setCountersToFinal() {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    });
  }

  function init() {
    // Navbar shadow on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Respeta usuarios con preferencia de menos movimiento
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      setCountersToFinal();
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      setCountersToFinal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Defaults globales: trigger ANTES del viewport, duración corta
    const START_EARLY = 'top bottom+=60'; // 60px antes del viewport
    const DURATION_FAST = 0.28;

    // ───────────────────────────────────────────────────
    // HERO · entrada al cargar la página (sin scroll)
    // ───────────────────────────────────────────────────
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroEls = heroContent.querySelectorAll(
        '.hero-breadcrumb, .hero-tag, h1, .lead, p, .hero-cta-row, .btn-pill, .hero-stats, .hero-stat-big'
      );
      gsap.set(heroEls, { y: 14, opacity: 0 });
      gsap.to(heroEls, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.035,
        delay: 0.05,
      });

      const heroPhoto = document.querySelector('.hero-photo, .hero-photo img, .hero-visual img, .hero-visual-img');
      if (heroPhoto) {
        gsap.from(heroPhoto, {
          scale: 1.025,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
          delay: 0.08,
        });
      }
    }

    // ───────────────────────────────────────────────────
    // REVEAL universal · .reveal
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: START_EARLY,
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ───────────────────────────────────────────────────
    // SECTION HEADLINES · prioridad alta, animar muy temprano
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.section-headline').forEach((h) => {
      if (h.classList.contains('reveal')) return;
      gsap.fromTo(
        h,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h,
            start: 'top bottom+=100', // 100px antes
          },
        }
      );
    });

    // ───────────────────────────────────────────────────
    // EQUIPO cards · stagger
    // ───────────────────────────────────────────────────
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(
        equipoCards,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION_FAST,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.equipo-grid',
            start: START_EARLY,
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // SERVICIOS lista · slide-in
    // ───────────────────────────────────────────────────
    const servicioItems = gsap.utils.toArray('.servicio-item');
    if (servicioItems.length) {
      gsap.fromTo(
        servicioItems,
        { x: -10, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: '.servicios-list',
            start: START_EARLY,
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // CATÁLOGO · stagger en grid
    // ───────────────────────────────────────────────────
    const catalogCards = gsap.utils.toArray('.catalog-card');
    if (catalogCards.length) {
      gsap.fromTo(
        catalogCards,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
          stagger: 0.045,
          scrollTrigger: {
            trigger: '.catalog-grid',
            start: START_EARLY,
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // TESTIMONIOS
    // ───────────────────────────────────────────────────
    const testimonios = gsap.utils.toArray('.testimonio');
    if (testimonios.length) {
      gsap.fromTo(
        testimonios,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
          stagger: 0.045,
          scrollTrigger: {
            trigger: testimonios[0],
            start: START_EARLY,
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // GALERÍA pacientes · scale leve
    // ───────────────────────────────────────────────────
    const galeriaCards = gsap.utils.toArray('.galeria-card, .resultado-card');
    if (galeriaCards.length) {
      gsap.fromTo(
        galeriaCards,
        { scale: 0.975, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: galeriaCards[0],
            start: START_EARLY,
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // STATS BIG (cuando NO en hero)
    // ───────────────────────────────────────────────────
    const heroStatBig = document.querySelector('.hero-stat-big');
    if (heroStatBig && !heroContent) {
      gsap.fromTo(
        heroStatBig,
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: heroStatBig,
            start: START_EARLY,
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // CONTADORES (14-ago-2026): los números cuentan al entrar
    // al viewport. Sin esto las cifras del index portado del
    // master ("+8 años", "3 especialistas", "4.8 ★") se
    // quedaban clavadas en 0 para TODO el mundo.
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('[data-counter]').forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const obj = { val: 0 };
      el.textContent = prefix + (0).toFixed(decimals) + suffix;
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom-=80',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            },
          });
        },
      });
    });

    // ───────────────────────────────────────────────────
    // FAILSAFE: forzar revelado de cualquier .reveal que
    // siga oculto 1.5s después del primer scroll (por si
    // un trigger no se calculó bien con imágenes lazy)
    // ───────────────────────────────────────────────────
    let forced = false;
    const forceReveal = () => {
      if (forced) return;
      forced = true;
      // Refresh ScrollTrigger después de que cargaran imágenes
      ScrollTrigger.refresh();
      // Failsafe: si algo sigue invisible cerca del viewport, mostrarlo
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && parseFloat(getComputedStyle(el).opacity) < 0.1) {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: true });
          }
        });
      }, 200);
    };

    // Refresh cuando carguen imágenes lazy (cambia layout y positions)
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    window.addEventListener('scroll', forceReveal, { once: true, passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
