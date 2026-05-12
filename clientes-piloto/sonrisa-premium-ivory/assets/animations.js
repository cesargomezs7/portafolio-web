/* Sonrisa Premium · Ivory · Animaciones GSAP
   Estrategia: animar ANTES de que el elemento entre al viewport
   + animaciones cortas (0.3-0.4s) para que estén completas cuando llegan a ojo.
   ───────────────────────────────────────────────────── */

(function () {
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
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Defaults globales: trigger ANTES del viewport, duración corta
    const START_EARLY = 'top bottom+=100'; // 100px ANTES de tocar el viewport (más temprano)
    const DURATION_FAST = 0.2;

    // ───────────────────────────────────────────────────
    // HERO · entrada al cargar la página (sin scroll)
    // ───────────────────────────────────────────────────
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroEls = heroContent.querySelectorAll(
        '.hero-breadcrumb, .hero-tag, h1, .lead, p, .hero-cta-row, .btn-pill, .hero-stats, .hero-stat-big'
      );
      gsap.set(heroEls, { y: 10, opacity: 0 });
      gsap.to(heroEls, {
        y: 0,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
        stagger: 0.025,
        delay: 0.03,
      });

      const heroPhoto = document.querySelector('.hero-photo, .hero-photo img, .hero-visual img, .hero-visual-img');
      if (heroPhoto) {
        gsap.from(heroPhoto, {
          scale: 1.02,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          delay: 0.05,
        });
      }
    }

    // ───────────────────────────────────────────────────
    // REVEAL universal · .reveal
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 8, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
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
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h,
            start: 'top bottom+=150', // 150px ANTES, prioridad máxima
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
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION_FAST,
          ease: 'power2.out',
          stagger: 0.04,
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
        { x: -8, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out',
          stagger: 0.03,
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
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out',
          stagger: 0.035,
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
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out',
          stagger: 0.035,
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
        { scale: 0.98, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.22,
          ease: 'power2.out',
          stagger: 0.04,
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
