/* Sonrisa Premium · Ivory · Animaciones GSAP
   Cargar después de gsap.min.js + ScrollTrigger.min.js
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
      gsap.set(heroEls, { y: 28, opacity: 0 });
      gsap.to(heroEls, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.15,
      });

      // Foto del hero (si existe) con escala muy sutil
      const heroPhoto = document.querySelector('.hero-photo, .hero-photo img, .hero-visual img');
      if (heroPhoto) {
        gsap.from(heroPhoto, {
          scale: 1.06,
          opacity: 0,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.25,
        });
      }
    }

    // ───────────────────────────────────────────────────
    // REVEAL universal · cualquier elemento con .reveal
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
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
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.equipo-grid',
            start: 'top 80%',
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
        { x: -28, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.servicios-list',
            start: 'top 80%',
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
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.catalog-grid',
            start: 'top 80%',
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
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: testimonios[0],
            start: 'top 85%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // GALERÍA pacientes · escalonada
    // ───────────────────────────────────────────────────
    const galeriaCards = gsap.utils.toArray('.galeria-card');
    if (galeriaCards.length) {
      gsap.fromTo(
        galeriaCards,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: galeriaCards[0],
            start: 'top 80%',
          },
        }
      );
    }

    // ───────────────────────────────────────────────────
    // HEADLINES de sección · expo.out reveal
    // ───────────────────────────────────────────────────
    gsap.utils.toArray('.section-headline').forEach((h) => {
      // Solo si no tiene ya class reveal (evita doble animación)
      if (h.classList.contains('reveal')) return;
      gsap.fromTo(
        h,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 85%',
          },
        }
      );
    });

    // ───────────────────────────────────────────────────
    // STATS BIG · número y descripción aparecen juntos
    // ───────────────────────────────────────────────────
    const heroStatBig = document.querySelector('.hero-stat-big');
    if (heroStatBig && !heroContent) {
      // Solo si NO está en el hero (en hero ya se animó)
      gsap.fromTo(
        heroStatBig,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: heroStatBig,
            start: 'top 85%',
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
