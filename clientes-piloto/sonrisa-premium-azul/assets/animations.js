/* Sonrisa Premium · AZUL (Dentty) · Animaciones GSAP */
(function () {
  // ─── Sync navbar top a banner ─
  function syncNavToBanner() {
    const banner = document.querySelector('.pronto-banner');
    const navbar = document.querySelector('.navbar');
    if (banner && navbar) navbar.style.top = banner.offsetHeight + 'px';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncNavToBanner);
  else syncNavToBanner();
  window.addEventListener('load', syncNavToBanner);
  window.addEventListener('resize', syncNavToBanner);

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

    const START_EARLY = 'top bottom-=60';

    // Hero entrada
    const heroTop = document.querySelector('.hero-top');
    if (heroTop) {
      gsap.set(heroTop, { y: 14, opacity: 0 });
      gsap.to(heroTop, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.15 });
    }
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      gsap.set(heroPhoto, { y: 24, opacity: 0 });
      gsap.to(heroPhoto, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.35 });
    }

    // Reveal universal
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.classList.contains('hero-top') || el.classList.contains('hero-photo')) return;
      gsap.fromTo(el,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: START_EARLY, toggleActions: 'play none none none' }
        }
      );
    });

    // Service cards stagger
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: '.services-grid', start: START_EARLY }
        }
      );
    }

    // Equipo cards stagger
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(equipoCards,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.equipo-grid', start: START_EARLY }
        }
      );
    }

    // Counter animation
    gsap.utils.toArray('[data-counter]').forEach(el => {
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
            }
          });
        }
      });
    });

    // Scroll progress bar
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
      });
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
