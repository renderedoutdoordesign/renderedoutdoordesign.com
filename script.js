/* ============================================================
   RENDERED OUTDOOR DESIGN — Main Script
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Sticky nav ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll-reveal animation ---------- */
  // Only animate small discrete card elements — large layout sections
  // (about, contact) stay fully visible to avoid blank-space bugs.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -20px 0px' }
  );

  // Reset stagger index per group so delays never accumulate across sections
  ['.process-step', '.service-card'].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`;
      revealObserver.observe(el);
    });
  });

  // Inject revealed styles
  const styleTag = document.createElement('style');
  styleTag.textContent = '.revealed { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(styleTag);

  /* ---------- Contact form — Web3Forms ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client-side validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      const btn = document.getElementById('submit-btn');
      const original = btn.textContent;
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form)
        });
        const data = await response.json();

        if (data.success) {
          form.reset();
          const successMsg = document.getElementById('form-success');
          if (successMsg) successMsg.style.display = 'block';
          btn.style.display = 'none';
          const note = form.querySelector('.form-note');
          if (note) note.style.display = 'none';
        } else {
          btn.textContent = 'Something went wrong \u2014 please try again';
          btn.disabled = false;
          setTimeout(() => { btn.textContent = original; }, 4000);
        }
      } catch {
        btn.textContent = 'Something went wrong \u2014 please try again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = original; }, 4000);
      }
    });
  }

})();
