// Navbar shadow on scroll + menu mobile (toggle)

export function initNavbarScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const threshold = document.getElementById('hero') ? 30 : 10;
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > threshold), { passive: true });
}

export function initMobileMenu() {
  document.querySelectorAll('[data-menu-toggle]').forEach((toggle) => {
    const menuId = toggle.getAttribute('aria-controls');
    const menu = menuId ? document.getElementById(menuId) : null;
    if (!menu) return;
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

