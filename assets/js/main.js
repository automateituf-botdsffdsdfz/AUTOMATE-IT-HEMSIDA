(() => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Mobile nav toggle
  const menuToggle = qs('#menu-toggle');
  const mobileMenu = qs('#mobile-menu');
  if (menuToggle && mobileMenu) {
    // Prevent page scroll when menu open on iOS (allow scrolling inside overlay)
    const preventScroll = (e) => {
      if (!mobileMenu.classList.contains('open')) return;
      if (!mobileMenu.contains(e.target)) {
        e.preventDefault();
      }
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      // Lock page scroll via classes (iOS-safe combined with touchmove trap)
      document.body.classList.toggle('menu-open', isOpen);
      document.documentElement.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
      if (isOpen) {
        try { document.addEventListener('touchmove', preventScroll, { passive: false }); } catch (_) { /* no-op */ }
        // Reset overlay scroll so links start at top regardless of previous state
        try {
          mobileMenu.scrollTop = 0;
          mobileMenu.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch (_) { mobileMenu.scrollTop = 0; }
        const firstLink = mobileMenu.querySelector('a, button');
        if (firstLink) {
          try { firstLink.scrollIntoView({ block: 'start' }); } catch (_) {}
          firstLink.focus();
        }
      } else {
        document.removeEventListener('touchmove', preventScroll);
      }
    });
    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        document.removeEventListener('touchmove', preventScroll);
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Öppna meny');
        menuToggle.focus();
      }
    });
  }

  // Close menu on resize to desktop
  const handleResize = () => {
    if (window.innerWidth >= 960 && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Öppna meny');
      }
      // no-op: scroll lock handled via classes only
    }
  };
  window.addEventListener('resize', handleResize);

  // Overlay close button
  const overlayClose = qs('#overlay-close');
  if (overlayClose && mobileMenu) {
    overlayClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Öppna meny');
        menuToggle.focus();
      }
    });
  }

  // Close mobile menu when clicking links
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('a[href^="#"]')) {
        mobileMenu.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        if (menuToggle) menuToggle.setAttribute('aria-label', 'Öppna meny');
      }
    });
  }

  // Add header shadow on scroll
  const header = qs('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Toast helper
  const toastEl = qs('#toast');
  function showToast(message, timeout = 3000) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), timeout);
  }
  window.__showToast = showToast;

  // Form validation with ARIA live updates
  const form = qs('form[data-validate]');
  if (form) {
    const live = qs('#form-live-region');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errors = validateForm(form);
      if (errors.length) {
        const firstError = errors[0];
        firstError.field.focus();
        const message = errors.map(x => x.message).join('. ');
        if (live) { live.textContent = message; }
        showToast('Korrigera markerade fält.');
        return;
      }
      // Web3Forms submission if enabled
      if (form.hasAttribute('data-web3forms')) {
        try {
          const formData = new FormData(form);
          const resp = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });
          const data = await resp.json();
          if (data && data.success) {
            showToast('Tack! Vi återkommer snart.');
            if (live) { live.textContent = 'Formuläret skickades. Tack!'; }
            form.reset();
          } else {
            showToast('Kunde inte skicka just nu. Försök igen.');
            if (live) { live.textContent = 'Fel vid skickning. Försök igen senare.'; }
          }
        } catch (err) {
          showToast('Nätverksfel. Kontrollera uppkopplingen.');
          if (live) { live.textContent = 'Nätverksfel vid skickning.'; }
        }
      } else {
        form.submit();
      }
    });
  }

  function validateForm(form) {
    const results = [];
    const required = qsa('[data-required="true"]', form);
    for (const el of required) {
      const id = el.getAttribute('id');
      const errorEl = id ? qs(`#error-${id}`) : null;
      const label = el.getAttribute('aria-label') || (id ? (qs(`label[for="${id}"]`)?.textContent || 'Detta fält') : 'Detta fält');
      let valid = true;
      let msg = '';
      if (!el.value || String(el.value).trim() === '') {
        valid = false; msg = `${label} är obligatoriskt`;
      } else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        valid = false; msg = 'Ogiltig e-postadress';
      }
      if (!valid) {
        el.setAttribute('aria-invalid', 'true');
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.hidden = false;
        }
        results.push({ field: el, message: msg });
      } else {
        el.removeAttribute('aria-invalid');
        if (errorEl) { errorEl.hidden = true; errorEl.textContent = ''; }
      }
    }
    return results;
  }
})();


