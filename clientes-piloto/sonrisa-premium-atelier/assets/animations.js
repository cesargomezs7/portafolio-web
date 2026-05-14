/* Sonrisa Premium · ATELIER (verde sage boutique) · Animaciones GSAP */
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

  // ─── Split H1 hero en palabras ANTES de GSAP
  function splitHeroH1() {
    const h1 = document.querySelector('.hero h1');
    if (!h1 || h1.dataset.split === '1') return;
    const html = h1.innerHTML;
    const parts = html.split(/<br\s*\/?>/i);
    h1.innerHTML = parts.map(line => line.trim().split(/\s+/).map(w =>
      `<span class="word"><span class="word-inner">${w}</span></span>`
    ).join(' ')).join('<br>');
    h1.dataset.split = '1';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', splitHeroH1);
  else splitHeroH1();

  // Helper: setea counters a su valor final (sin animar)
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

    // ─── H1 hero word-by-word reveal (stagger dramático Atelier) ─
    const words = gsap.utils.toArray('.hero h1 .word-inner');
    if (words.length) {
      gsap.set(words, { y: '110%', opacity: 0 });
      gsap.to(words, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        stagger: 0.09, delay: 0.2
      });
    }

    // Hero lead + actions entrance
    const heroLead = document.querySelector('.hero p.hero-lead');
    const heroActions = document.querySelector('.hero-actions');
    if (heroLead) gsap.fromTo(heroLead, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.7 });
    if (heroActions) gsap.fromTo(heroActions, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.9 });

    // Hero rule line draw
    const heroRule = document.querySelector('.hero-rule');
    if (heroRule) gsap.fromTo(heroRule, { width: 0 }, { width: '60px', duration: 0.8, ease: 'power2.out', delay: 0.1 });

    // Hero photo entrance (parallax sutil)
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) gsap.fromTo(heroPhoto, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.3 });

    // ─── Section headings: clip-path reveal ─
    gsap.utils.toArray('.section h2, .faq h2, .cta-final h2, .section-rule-text').forEach(h => {
      gsap.fromTo(h,
        { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: h, start: 'top bottom-=80' }
        }
      );
    });

    // ─── Section-rule lines draw on scroll ─
    gsap.utils.toArray('.section-rule').forEach(rule => {
      const before = rule;
      gsap.fromTo(before,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: rule, start: 'top bottom-=80' }
        }
      );
    });

    // Reveal universal (resto de elementos)
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.classList.contains('hero-photo')) return;
      if (el.tagName === 'H1' || el.tagName === 'H2') return;
      gsap.fromTo(el,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: START_EARLY, toggleActions: 'play none none none' }
        }
      );
    });

    // Service cards stagger
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.services-grid', start: START_EARLY }
        }
      );
    }

    // Equipo cards stagger
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(equipoCards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.equipo-grid', start: START_EARLY }
        }
      );
    }

    // Testimonios stagger
    const testimonios = gsap.utils.toArray('.testimonio-card');
    if (testimonios.length) {
      gsap.fromTo(testimonios,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.testimonios-grid', start: START_EARLY }
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

    // Diferencia cards stagger
    const diferenciaCards = gsap.utils.toArray('.diferencia-card');
    if (diferenciaCards.length) {
      gsap.fromTo(diferenciaCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.diferencia-grid', start: START_EARLY }
        }
      );
    }

    // ─── Counter animation con POP ─
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
              gsap.fromTo(el, { scale: 1 }, { scale: 1.08, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 });
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
