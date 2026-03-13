/* ============================================================
   RENDERED OUTDOOR DESIGN — Main Script
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky nav ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => { header.classList.toggle('scrolled', window.scrollY > 0); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll animations ---------- */
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animEls.forEach(el => observer.observe(el));
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- CTA buttons pre-select service dropdown ---------- */
  document.querySelectorAll('a[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const serviceVal = link.getAttribute('data-service');
      const select = document.getElementById('service');
      if (select && serviceVal) select.value = serviceVal;
    });
  });

  /* ---------- Contact form — Web3Forms ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) { field.style.borderColor = '#c0392b'; valid = false; }
        else field.style.borderColor = '';
      });
      if (!valid) return;
      const btn = document.getElementById('submit-btn');
      const original = btn.textContent;
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;
      try {
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
        const data = await response.json();
        if (data.success) {
          form.reset();
          const successMsg = document.getElementById('form-success');
          if (successMsg) successMsg.style.display = 'block';
          btn.style.display = 'none';
          const note = form.querySelector('.form-note');
          if (note) note.style.display = 'none';
        } else {
          btn.textContent = 'Something went wrong — please try again';
          btn.disabled = false;
          setTimeout(() => { btn.textContent = original; }, 4000);
        }
      } catch {
        btn.textContent = 'Something went wrong — please try again';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = original; }, 4000);
      }
    });
  }
})();
