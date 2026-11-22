(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Keep touch gestures native and use Lenis only when motion is allowed.
  let lenis;
  const updateSmoothScroll = () => {
    if (reducedMotion.matches) {
      lenis?.destroy();
      lenis = undefined;
    } else if (!lenis && typeof window.Lenis === 'function') {
      lenis = new window.Lenis({
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.1,
      });
    }
  };
  updateSmoothScroll();
  reducedMotion.addEventListener('change', updateSmoothScroll);

  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== hash) history.pushState(null, '', hash);
      lenis.scrollTo(target);
    });
  });

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

  // Reveal headline words once; preserve the original text and inline emphasis.
  if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
    const activeTextAnimations = new Set();
    document.querySelectorAll('main h1, main h2, main h3').forEach((heading) => {
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
          } else {
            const word = document.createElement('span');
            word.className = 'headline-word';
            word.textContent = part;
            fragment.append(word);
          }
        });
        node.replaceWith(fragment);
      });
    });
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        currentObserver.unobserve(entry.target);
        if (reducedMotion.matches) return;
        const isHeading = /^H[1-3]$/.test(entry.target.tagName);
        const targets = isHeading ? [...entry.target.querySelectorAll('.headline-word')] : [entry.target];
        const stagger = Math.min(90, 800 / Math.max(1, targets.length - 1));
        targets.forEach((target, index) => {
          const frames = isHeading ? [
            { opacity: 0, filter: 'blur(4px)' },
            { opacity: 1, filter: 'blur(0px)' },
          ] : [
            { opacity: 0.65, transform: 'translateY(5px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ];
          const animation = target.animate(frames, {
            duration: isHeading ? 600 : 440,
            delay: isHeading ? index * stagger : 0,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            fill: 'backwards',
          });
          activeTextAnimations.add(animation);
          const release = () => activeTextAnimations.delete(animation);
          animation.addEventListener('finish', release, { once: true });
          animation.addEventListener('cancel', release, { once: true });
        });
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('main h1, main h2, main h3, main p:not(.copy-status)').forEach((element) => observer.observe(element));
    reducedMotion.addEventListener('change', () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      activeTextAnimations.forEach((animation) => animation.cancel());
    });
  }
})();
