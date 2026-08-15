/* Sonrisa Atelier · ATELIER · Animaciones GSAP (refactored: sin flash inicial) */
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

  // ─── Split H1 en palabras (hero y hero-compact) ─
  function splitH1(selector) {
    const h1 = document.querySelector(selector);
    if (!h1 || h1.dataset.split === '1') return;
    const html = h1.innerHTML;
    const parts = html.split(/<br\s*\/?>/i);
    h1.innerHTML = parts.map(line => line.trim().split(/\s+/).map(w =>
      `<span class="word"><span class="word-inner">${w}</span></span>`
    ).join(' ')).join('<br>');
    h1.dataset.split = '1';
  }
  function splitAllH1s() {
    splitH1('.hero h1');
    splitH1('.hero-compact h1');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', splitAllH1s);
  else splitAllH1s();

  // Helper: counters al valor final
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
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.reveal, .word-inner').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      setCountersToFinal();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const START_EARLY = 'top bottom-=80';

    // ═══ HERO ENTRANCE (rápido, sin flash blanco) ═══

    // 1) Hero rule line: aparece primero (width grow)
    const heroRule = document.querySelector('.hero-rule');
    if (heroRule) {
      gsap.fromTo(heroRule, { width: 0 }, { width: '60px', duration: 0.5, ease: 'power2.out' });
    }

    // 2) H1 hero word-by-word reveal (delay 0 = sin flash inicial)
    const heroWords = gsap.utils.toArray('.hero h1 .word-inner');
    if (heroWords.length) {
      gsap.set(heroWords, { y: '105%', opacity: 0 });
      gsap.to(heroWords, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        stagger: 0.06, delay: 0.05
      });
    }

    // 3) Hero lead: ya visible, solo slide up sutil (sin opacity 0)
    const heroLead = document.querySelector('.hero p.hero-lead');
    if (heroLead) {
      gsap.from(heroLead, { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.3 });
    }

    // 4) Hero actions: slide up + fade in rápido
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      gsap.from(heroActions, { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.45 });
    }

    // 5) Hero photo: scale entrance SIN opacity 0 (siempre visible)
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      gsap.fromTo(heroPhoto,
        { scale: 1.04 },
        { scale: 1, duration: 1.0, ease: 'power3.out' }
      );
    }

    // ═══ HERO COMPACT (nosotros/contacto) — mismo patrón rápido ═══
    const heroCompactOverline = document.querySelector('.hero-compact .overline');
    if (heroCompactOverline) {
      gsap.from(heroCompactOverline, { y: 10, opacity: 0, duration: 0.5, ease: 'power2.out' });
    }
    const heroCompactWords = gsap.utils.toArray('.hero-compact h1 .word-inner');
    if (heroCompactWords.length) {
      gsap.set(heroCompactWords, { y: '105%', opacity: 0 });
      gsap.to(heroCompactWords, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        stagger: 0.06, delay: 0.1
      });
    }
    const heroCompactP = document.querySelector('.hero-compact p');
    if (heroCompactP) {
      gsap.from(heroCompactP, { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.3 });
    }

    // ═══ SECTION RULE LINES (líneas decorativas) ═══
    gsap.utils.toArray('.section-rule').forEach(rule => {
      const before = window.getComputedStyle(rule, '::before');
      // Animar el contenedor entero con fade up + un toque de scaleX para las líneas
      gsap.fromTo(rule,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: rule, start: START_EARLY }
        }
      );
    });

    // ═══ SECTION HEADINGS: fade up limpio (sin clip-path) ═══
    gsap.utils.toArray('.section h2, .faq h2, .cta-final h2').forEach(h => {
      gsap.fromTo(h,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: h, start: START_EARLY }
        }
      );
    });

    // ═══ Reveal universal (resto de elementos con class .reveal) ═══
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.classList.contains('hero-photo')) return;
      if (el.tagName === 'H1' || el.tagName === 'H2') return;
      gsap.fromTo(el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: START_EARLY, toggleActions: 'play none none none' }
        }
      );
    });

    // ═══ Service cards stagger ═══
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.services-grid', start: START_EARLY }
        }
      );
    }

    // ═══ Equipo cards stagger ═══
    const equipoCards = gsap.utils.toArray('.equipo-card');
    if (equipoCards.length) {
      gsap.fromTo(equipoCards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.equipo-grid', start: START_EARLY }
        }
      );
    }

    // ═══ Testimonios stagger ═══
    const testimonios = gsap.utils.toArray('.testimonio-card');
    if (testimonios.length) {
      gsap.fromTo(testimonios,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.testimonios-grid', start: START_EARLY }
        }
      );
    }

    // ═══ FAQ items stagger ═══
    const faqItems = gsap.utils.toArray('.faq-item');
    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.07,
          scrollTrigger: { trigger: '.faq-list', start: START_EARLY }
        }
      );
    }

    // ═══ Diferencia cards (nosotros) ═══
    const diferenciaCards = gsap.utils.toArray('.diferencia-card');
    if (diferenciaCards.length) {
      gsap.fromTo(diferenciaCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.diferencia-grid', start: START_EARLY }
        }
      );
    }

    // ═══ Stats counter con POP ═══
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

    // ═══ Hero photo subtle parallax on scroll (desktop only — en mobile es jittery) ═══
    if (heroPhoto && window.innerWidth > 768) {
      gsap.to(heroPhoto, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    }

    // ═══ Clinic photos subtle scale on reveal ═══
    const clinicMain = document.querySelector('.clinic-photo-main');
    if (clinicMain) {
      gsap.fromTo(clinicMain,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: clinicMain, start: START_EARLY }
        }
      );
    }
    const clinicSecondary = gsap.utils.toArray('.clinic-photo-secondary > div');
    if (clinicSecondary.length) {
      gsap.fromTo(clinicSecondary,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.clinic-photo-secondary', start: START_EARLY }
        }
      );
    }

    // ═══ Scroll progress bar ═══
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
      });
    }

    // ═══ CTA Final card subtle entrance ═══
    const ctaFinal = document.querySelector('.cta-final');
    if (ctaFinal) {
      gsap.fromTo(ctaFinal,
        { opacity: 0.6, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ctaFinal, start: 'top bottom-=100' }
        }
      );
    }

    // ═══ Mobile menu: stagger reveal de items al abrir ═══
    const mobileMenu = document.getElementById('mobileMenu');
    const navBurger = document.getElementById('navBurger');
    if (mobileMenu && navBurger) {
      navBurger.addEventListener('click', () => {
        // Pequeño delay para esperar a que el overlay aparezca
        requestAnimationFrame(() => {
          const items = mobileMenu.querySelectorAll('ul li');
          gsap.fromTo(items,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.1 }
          );
        });
      });
    }

    // ═══ Service card hover: scale + arrow translate ═══
    document.querySelectorAll('.service-card').forEach(card => {
      const arrow = card.querySelector('.learn-more svg');
      const link = card.querySelector('.learn-more');
      if (!arrow || !link) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(arrow, { x: 4, y: -4, duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
      });
    });

    // ═══ Footer reveal sutil ═══
    const footer = document.querySelector('footer');
    if (footer) {
      gsap.from(footer.querySelectorAll('.footer-col, .footer-brand'),
        { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: footer, start: 'top bottom-=50' }
        }
      );
    }

    // Refresh ScrollTrigger on load (asegura cálculos correctos tras fonts)
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
