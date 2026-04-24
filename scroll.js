/* ============================================================
   DISTRICT STUDIO - scroll.js
   Theme toggle + Lenis + parallax + cursor-follow + reveal
   ============================================================ */

// -- Theme system ------------------------------------------
(function initTheme() {
  const root = document.documentElement;
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => {
    if (root.classList.contains('dark')) return true;
    if (root.classList.contains('light')) return false;
    return sysDark.matches;
  };
  const setLabel = () => {
    const text = isDark() ? 'Light' : 'Dark';
    document.querySelectorAll('[data-theme-label]').forEach((el) => { el.textContent = text; });
  };
  setLabel();

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.classList.remove('dark', 'light');
      root.classList.add(next);
      try { localStorage.setItem('district-theme', next); } catch (e) {}
      setLabel();
    });
  });

  sysDark.addEventListener('change', () => {
    try { if (localStorage.getItem('district-theme')) return; } catch (err) {}
    setLabel();
  });
})();

// -- Mobile menu -------------------------------------------
(function initMenu() {
  const overlay = document.querySelector('[data-menu-overlay]');
  if (!overlay) return;
  const open = () => {
    document.body.classList.add('menu-open');
    overlay.setAttribute('aria-hidden', 'false');
    if (typeof lenis !== 'undefined') lenis.stop();
  };
  const close = () => {
    document.body.classList.remove('menu-open');
    overlay.setAttribute('aria-hidden', 'true');
    if (typeof lenis !== 'undefined') lenis.start();
  };
  document.querySelectorAll('[data-menu-open]').forEach((b) => b.addEventListener('click', open));
  document.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', close));
  document.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// -- Lenis smooth scroll -----------------------------------
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// -- Parallax hero iso -------------------------------------
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (parallaxEls.length) {
  const hero = document.querySelector('.hero');
  const heroH = hero ? hero.offsetHeight : window.innerHeight;
  lenis.on('scroll', (e) => {
    if (e.scroll > heroH * 1.2) return;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      el.style.transform = `translateY(${e.scroll * speed}px)`;
    });
  });
}

// -- Cursor-follow (desktop only) --------------------------
const isDesktop = window.matchMedia('(hover: hover)').matches;
if (isDesktop) {
  const preview = document.createElement('div');
  preview.className = 'cursor-preview';
  preview.textContent = 'View';
  document.body.appendChild(preview);

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  const OFFSET_X = 18;
  const OFFSET_Y = 18;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;
    preview.style.transform = `translate(${curX + OFFSET_X}px, ${curY + OFFSET_Y}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const label = el.dataset.cursor;
      if (label && label.length) preview.textContent = label;
      else preview.textContent = 'View';
      document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });
  });
}

// -- Scroll-reveal ------------------------------------------
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  els.forEach((el) => io.observe(el));
})();

// -- Anchor links via Lenis --------------------------------
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -40 });
  });
});
