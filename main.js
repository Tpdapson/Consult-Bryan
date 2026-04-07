/* ============================================================
   CONSULT BRYAN – Main JS
   Animations: Intersection Observer (no dependencies)
   ============================================================ */

// Enable animations only when JS is confirmed running
document.documentElement.classList.add('js-animations');

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAV: Scroll — white bg + hide-on-down / show-on-up --- */
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNav = () => {
    const y = window.scrollY;

    // Switch to white bg once past the top bar
    nav.classList.toggle('scrolled', y > 60);

    if (y <= 60) {
      // At the very top — always visible
      nav.classList.remove('nav-hidden');
    } else if (y > lastScrollY + 8) {
      // Scrolling DOWN — hide
      nav.classList.add('nav-hidden');
    } else if (y < lastScrollY - 4) {
      // Scrolling UP — reveal
      nav.classList.remove('nav-hidden');
    }

    lastScrollY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* --- NAV: Mobile hamburger --- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.style.display === 'flex';
      mobileNav.style.display = isOpen ? 'none' : 'flex';
      // Animate hamburger bars
      const bars = toggle.querySelectorAll('span');
      if (!isOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });
  }

  /* --- SCROLL ANIMATIONS --- */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop observing for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const animTargets = document.querySelectorAll(
    '.fade-up, .fade-in, .slide-left, .slide-right'
  );
  animTargets.forEach(el => observer.observe(el));

  /* --- HERO LOAD ANIMATIONS --- */
  // Trigger hero animations immediately after load
  const heroAnimEls = document.querySelectorAll('.hero .fade-up');
  setTimeout(() => {
    heroAnimEls.forEach(el => el.classList.add('visible'));
  }, 100);

  /* --- STAGGER: Apply delays to children in stagger groups --- */
  document.querySelectorAll('[data-stagger]').forEach(group => {
    const children = group.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
      child.classList.add('fade-up');
      observer.observe(child);
    });
  });

  /* --- CONTACT FORM: Submit to Formspree --- */
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreojbnz'; // ← replace with your Formspree endpoint

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          btn.textContent = '✓ Request Sent!';
          btn.style.background = '#16A34A';
          btn.style.borderColor = '#16A34A';
          btn.style.opacity = '1';

          const success = document.createElement('p');
          success.style.cssText = `
            margin-top: 16px;
            font-size: 15px;
            color: #16A34A;
            font-family: var(--font-head, 'Plus Jakarta Sans', sans-serif);
            font-weight: 600;
            text-align: center;
          `;
          success.textContent = "We've received your request. Expect to hear from us within 24 hours.";
          form.appendChild(success);

          setTimeout(() => {
            form.reset();
            btn.textContent = original;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.opacity = '';
            success.remove();
          }, 5000);
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.opacity = '1';

        const error = document.createElement('p');
        error.style.cssText = `
          margin-top: 16px;
          font-size: 15px;
          color: #DC2626;
          font-family: var(--font-head, 'Plus Jakarta Sans', sans-serif);
          font-weight: 600;
          text-align: center;
        `;
        error.textContent = 'Something went wrong. Please try again or email us directly.';
        form.appendChild(error);
        setTimeout(() => error.remove(), 5000);
      }
    });
  }

  /* --- SMOOTH ANCHOR SCROLLING (for same-page links) --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile nav if open
        if (mobileNav) {
          mobileNav.style.display = 'none';
          const bars = toggle?.querySelectorAll('span');
          if (bars) {
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
          }
        }
      }
    });
  });

});
