// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Quote form submission
  const form = document.getElementById('quoteForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('quoteSubmit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.className = 'form-status';
      statusEl.textContent = '';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          statusEl.textContent = data.message || 'Thanks! We\u2019ll be in touch shortly.';
          statusEl.classList.add('show', 'ok');
          form.reset();
        } else {
          statusEl.textContent = data.error || 'Something went wrong. Please call us instead.';
          statusEl.classList.add('show', 'err');
        }
      } catch (err) {
        statusEl.textContent = 'Network error. Please call or text (207) 415-1977.';
        statusEl.classList.add('show', 'err');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request My Quote';
      }
    });
  }

  // Floating help widget
  const helpToggle = document.getElementById('helpToggle');
  const helpCard = document.getElementById('helpCard');
  const helpClose = document.getElementById('helpClose');
  const helpCta = document.getElementById('helpCta');

  if (helpToggle && helpCard) {
    const openCard = () => helpCard.classList.add('open');
    const closeCard = () => {
      helpCard.classList.remove('open');
      try { sessionStorage.setItem('helpWidgetDismissed', '1'); } catch (err) { /* ignore */ }
    };

    helpToggle.addEventListener('click', () => {
      helpCard.classList.contains('open') ? closeCard() : openCard();
    });
    if (helpClose) helpClose.addEventListener('click', closeCard);
    if (helpCta) helpCta.addEventListener('click', closeCard);

    // Auto-open once, a few seconds in, unless already dismissed this session
    let alreadyDismissed = false;
    try { alreadyDismissed = sessionStorage.getItem('helpWidgetDismissed') === '1'; } catch (err) { /* ignore */ }
    if (!alreadyDismissed) {
      setTimeout(openCard, 4000);
    }
  }
});
