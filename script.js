(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = header.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.querySelector('.sr-only').textContent = isOpen ? 'Close navigation' : 'Open navigation';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.querySelector('.sr-only').textContent = 'Open navigation';
      });
    });
  }

  const copyEmail = async () => {
    const address = copyButton?.dataset.copyEmail;
    if (!address || !copyStatus) return;

    try {
      await navigator.clipboard.writeText(address);
      copyStatus.textContent = 'Email address copied.';
    } catch {
      copyStatus.textContent = `Copy this email: ${address}`;
    }
  };

  copyButton?.addEventListener('click', copyEmail);
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  document.querySelectorAll('a, button').forEach((control) => {
    const release = () => control.classList.remove('is-pressing');
    control.addEventListener('pointerdown', () => control.classList.add('is-pressing'));
    control.addEventListener('pointerup', release);
    control.addEventListener('pointercancel', release);
    control.addEventListener('pointerleave', release);
    control.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') control.classList.add('is-pressing');
    });
    control.addEventListener('keyup', release);
  });

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }
})();
