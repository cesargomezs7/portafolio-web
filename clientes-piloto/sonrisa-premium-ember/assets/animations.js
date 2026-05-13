/* Sonrisa Premium · EMBER · Animaciones GSAP */
(function () {
  function init() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    if (!window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const START_EARLY = 'top bottom+=60';

    // Hero entrada
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
      const els = heroText.querySelectorAll('.hero-tag, .hero-lead, h1');
      gsap.set(els, { y: 14, opacity: 0 });
      gsap.to(els, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.07, delay: 0.1 });
    }

    // Diente con scale
    const tooth = document.querySelector('.hero-tooth-img');
    if (tooth) {
      gsap.from(tooth, { scale: 0.92, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.15 });
    }

    // Carrusel doctores
    const doctorCards = document.querySelectorAll('.doctor-card');
    if (doctorCards.length) {
      gsap.from(doctorCards, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.3 });
    }

    // Strip bottom
    const stripBlocks = document.querySelectorAll('.hero-strip-block');
    if (stripBlocks.length) {
      gsap.from(stripBlocks, { y: 14, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08, delay: 0.5 });
    }

    // Reveal universal
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: START_EARLY, toggleActions: 'play none none none' }
        }
      );
    });

    // Section headlines
    gsap.utils.toArray('.section-headline').forEach(h => {
      if (h.classList.contains('reveal')) return;
      gsap.fromTo(h,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out',
          scrollTrigger: { trigger: h, start: 'top bottom+=100' }
        }
      );
    });

    // Servicio cards
    const servicioCards = gsap.utils.toArray('.servicio-card');
    if (servicioCards.length) {
      gsap.fromTo(servicioCards,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: '.servicios-grid', start: START_EARLY }
        }
      );
    }

    // Equipo cards
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(equipoCards,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.equipo-grid', start: START_EARLY }
        }
      );
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
