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

  // ─── Split H1 hero en palabras ANTES de cargar GSAP (para que se vea oculto)
  function splitHeroH1() {
    const h1 = document.querySelector('.hero h1');
    if (!h1 || h1.dataset.split === '1') return;
    const html = h1.innerHTML;
    // Reemplaza palabras (preserva <br>) por spans inline
    const parts = html.split(/<br\s*\/?>/i);
    h1.innerHTML = parts.map(line => line.trim().split(/\s+/).map(w =>
      `<span class="word"><span class="word-inner">${w}</span></span>`
    ).join(' ')).join('<br>');
    h1.dataset.split = '1';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', splitHeroH1);
  else splitHeroH1();

  // Helper: setea counters a su valor final (sin animar).
  // Lo usan tanto el modo reduced-motion como el fallback sin GSAP.
  function setCountersToFinal() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseFloat(el.dataset.counter);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    });
  }

  function init() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .word-inner').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      setCountersToFinal();
      return;
    }
    if (!window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal, .word-inner').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      setCountersToFinal();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const START_EARLY = 'top bottom-=60';

    // Hero meta entrada
    const heroMeta = document.querySelector('.hero-meta');
    if (heroMeta) {
      gsap.fromTo(heroMeta, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.5 });
    }

    // ─── H1 word-by-word reveal (stagger drámatico) ─
    const words = gsap.utils.toArray('.hero h1 .word-inner');
    if (words.length) {
      gsap.set(words, { y: '110%', opacity: 0 });
      gsap.to(words, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        stagger: 0.08, delay: 0.2
      });
    }

    // Hero photo SIN animación (estática para evitar el "parpadeo" reportado por usuario)

    // ─── Headings clip-path reveal (más dramático que fade) ─
    gsap.utils.toArray('.section h2, .faq h2').forEach(h => {
      gsap.fromTo(h,
        { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: h, start: 'top bottom-=80' }
        }
      );
    });

    // Reveal universal (resto de elementos)
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.classList.contains('hero-top') || el.classList.contains('hero-photo')) return;
      if (el.tagName === 'H1' || el.tagName === 'H2') return; // ya animados arriba
      gsap.fromTo(el,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: START_EARLY, toggleActions: 'play none none none' }
        }
      );
    });

    // Service cards stagger con scale sutil
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.services-grid', start: START_EARLY }
        }
      );
    }

    // Benefit cards stagger entrance al cargar
    const benefits = gsap.utils.toArray('.benefit-card');
    if (benefits.length) {
      gsap.fromTo(benefits,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.12, delay: 1.1 }
      );
    }

    // Clinic photos: stagger reveal con scale
    const clinicPhotos = gsap.utils.toArray('.clinic-photo-main, .clinic-photo-secondary > div');
    if (clinicPhotos.length) {
      gsap.fromTo(clinicPhotos,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.clinic-grid', start: START_EARLY }
        }
      );
    }

    // Equipo cards stagger
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(equipoCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.equipo-grid', start: START_EARLY }
        }
      );
    }

    // FAQ items stagger
    const faqItems = gsap.utils.toArray('.faq-item');
    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.07,
          scrollTrigger: { trigger: '.faq-list', start: START_EARLY }
        }
      );
    }

    // ─── Counter animation con POP al terminar ─
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
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            },
            onComplete: () => {
              // POP scale al terminar
              gsap.fromTo(el, { scale: 1 }, { scale: 1.08, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 });
            }
          });
        }
      });
    });

    // ─── Team carrusel: fade transition al cambiar doctor ─
    const teamPhoto = document.querySelector('.team-photo img');
    const teamCarousel = document.querySelector('.team-card');
    if (teamPhoto && teamCarousel) {
      // Interceptar el cambio: cuando el src cambia, animar fade
      const observer = new MutationObserver(() => {
        gsap.fromTo(teamPhoto,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
        gsap.fromTo('.team-info > *',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.04 }
        );
      });
      observer.observe(teamPhoto, { attributes: true, attributeFilter: ['src'] });
    }

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
