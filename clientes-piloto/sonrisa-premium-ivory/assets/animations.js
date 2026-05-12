/* Sonrisa Premium · Ivory · Animaciones GSAP
   Cargar después de gsap.min.js + ScrollTrigger.min.js
   Tunings: agresivos pero suaves. Si se siente lento, bajar duraciones.
   ───────────────────────────────────────────────────── */

(function () {
  function init() {
    // Navbar shadow on scroll (vanilla, sin GSAP)
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
      // Fallback: si GSAP no cargó, simplemente muestra todo
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ───────────────────────────────────────────────────
    // HERO · entrada escalonada al cargar la página
    // ───────────────────────────────────────────────────
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroEls = heroContent.querySelectorAll(
        '.hero-breadcrumb, .hero-tag, h1, .lead, p, .hero-cta-row, .btn-pill, .hero-stats, .hero-stat-big'
      );
      gsap.set(heroEls, { y: 20, opacity: 0 });
      gsap.to(heroEls, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.05,
        delay: 0.08,
      });

      const heroPhoto = document.querySelector('.hero-photo, .hero-photo img, .hero-visual img, .hero-visual-img');
      if (heroPhoto) {
        gsap.from(heroPhoto, {
          scale: 1.04,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          delay: 0.12,
        });
      }
    }

    // ───────────────────────────────────────────────────
    // REVEAL universal · cualquier elemento con .reveal
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ───────────────────────────────────────────────────
    // EQUIPO cards · stagger horizontal
    // ───────────────────────────────────────────────────
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(
        equipoCards,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.equipo-grid',
            start: 'top 88%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // SERVICIOS lista · slide-in desde la izquierda
    // ───────────────────────────────────────────────────
    const servicioItems = gsap.utils.toArray('.servicio-item');
    if (servicioItems.length) {
      gsap.fromTo(
        servicioItems,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.servicios-list',
            start: 'top 88%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // CATÁLOGO de servicios · stagger en grid
    // ───────────────────────────────────────────────────
    const catalogCards = gsap.utils.toArray('.catalog-card');
    if (catalogCards.length) {
      gsap.fromTo(
        catalogCards,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: '.catalog-grid',
            start: 'top 88%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // TESTIMONIOS · fade up suave
    // ───────────────────────────────────────────────────
    const testimonios = gsap.utils.toArray('.testimonio');
    if (testimonios.length) {
      gsap.fromTo(
        testimonios,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: testimonios[0],
            start: 'top 90%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // GALERÍA pacientes · escalonada
    // ───────────────────────────────────────────────────
    const galeriaCards = gsap.utils.toArray('.galeria-card, .resultado-card');
    if (galeriaCards.length) {
      gsap.fromTo(
        galeriaCards,
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: galeriaCards[0],
            start: 'top 88%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // HEADLINES de sección · reveal suave
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.section-headline').forEach((h) => {
      if (h.classList.contains('reveal')) return;
      gsap.fromTo(
        h,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 90%',
          },
        }
      );
    });

    // ───────────────────────────────────────────────────
    // STATS BIG · entran con back ease cuando NO están en hero
    // ───────────────────────────────────────────────────
    const heroStatBig = document.querySelector('.hero-stat-big');
    if (heroStatBig && !heroContent) {
      gsap.fromTo(
        heroStatBig,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: heroStatBig,
            start: 'top 88%',
          },
        }
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
