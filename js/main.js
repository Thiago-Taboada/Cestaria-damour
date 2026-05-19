const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

const reveals = document.querySelectorAll('.reveal');
const staggerParents = document.querySelectorAll('.services-grid, .gallery-grid');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

staggerParents.forEach(parent => {
  const children = parent.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
  });
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);
      el.textContent = target === 15700 ? '15,7 mil' : current.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

const parallax = document.querySelector('.parallax-strip');
window.addEventListener('scroll', () => {
  if (!parallax) return;
  const rect = parallax.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const offset = (window.innerHeight - rect.top) * 0.15;
    parallax.style.backgroundPositionY = `${50 + offset * 0.1}%`;
  }
});
