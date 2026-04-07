/* ============================================================
   CIL – Curtidora Itaúna | main.js
   ============================================================ */
(function () {
  'use strict';

  /* ── NAV scroll behavior ── */
  const nav = document.getElementById('nav');
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── Mobile burger menu ── */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── Intersection Observer – reveal animations ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            setTimeout(() => el.classList.add('revealed'), 0);
          }
        });
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Staggered reveal per parent group
  const groups = {};
  revealEls.forEach(el => {
    const key = el.parentElement;
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });

  revealEls.forEach(el => observer.observe(el));

  // Stagger items in same parent
  document.querySelectorAll('.produtos__grid, .diferenciais__cards, .sust__grid, .hero__stats, .sobre__values').forEach(container => {
    const children = container.querySelectorAll('.reveal, .reveal-left, .produto-card, .dif-card, .sust-item');
    const childObserver = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('revealed');
          }, i * 100);
        });
        childObserver.disconnect();
      }
    }, { threshold: 0.08 });
    childObserver.observe(container);
    children.forEach(c => c.classList.add('reveal'));
  });

  /* ── Counter animation ── */
  function animateCounter(el, target, suffix = '') {
    const duration = 1600;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = (suffix === '+' ? '+' : '') + current + (suffix !== '+' ? suffix : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll('.hero__stat strong');
        stats.forEach(stat => {
          const text = stat.textContent.trim();
          if (text === '+45') { stat.textContent = '+0'; animateCounter(stat, 45, '+'); }
          else if (text === '100%') { stat.textContent = '0%'; animateCounter(stat, 100, '%'); }
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const statsBar = document.querySelector('.hero__stat-bar');
  if (statsBar) statObserver.observe(statsBar);

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Form submission ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Mensagem Enviada ✓';
      btn.style.background = '#4caf50';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3500);
    });
  }

  /* ── Parallax subtle on hero ── */
  const heroBg = document.querySelector('.hero__texture');
  window.addEventListener('scroll', () => {
    if (heroBg) {
      const y = window.scrollY * 0.25;
      heroBg.style.transform = `translateY(${y}px)`;
    }
  }, { passive: true });

  /* ── Mercado pills stagger reveal ── */
  const pillsContainer = document.querySelector('.mercados__grid');
  if (pillsContainer) {
    const pillObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pillsContainer.querySelectorAll('.mercado-pill').forEach((pill, i) => {
          setTimeout(() => pill.classList.add('revealed'), i * 80);
        });
        pillObserver.disconnect();
      }
    }, { threshold: 0.2 });
    pillObserver.observe(pillsContainer);
  }

})();
