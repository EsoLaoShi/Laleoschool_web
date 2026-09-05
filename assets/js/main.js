// Laleoschool — comportements partagés du site

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');

  if (toggle && header) {
    toggle.addEventListener('click', () => {
      header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', header.classList.contains('is-open'));
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => header.classList.remove('is-open'));
    });
  }

  // Apparition au défilement
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Compteurs de statistiques
  const stats = document.querySelectorAll('[data-count]');
  if (stats.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      stats.forEach((el) => statObserver.observe(el));
    } else {
      stats.forEach(animateCount);
    }
  }

  // Lightbox pour les galeries photo
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const src = trigger.dataset.lightbox;
        const alt = trigger.dataset.caption || '';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('is-open');
      });
    });
    const closeLightbox = () => lightbox.classList.remove('is-open');
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Flèches de la galerie défilante
  document.querySelectorAll('.gallery-nav').forEach((nav) => {
    const container = nav.closest('.wrap') || document;
    const row = container.querySelector('.gallery-row');
    const prev = nav.querySelector('[data-scroll="prev"]');
    const next = nav.querySelector('[data-scroll="next"]');
    if (!row) return;
    const amount = 240;
    if (prev) prev.addEventListener('click', () => row.scrollBy({ left: -amount, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => row.scrollBy({ left: amount, behavior: 'smooth' }));
  });

  // Année dynamique dans le pied de page
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
