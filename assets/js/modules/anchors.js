// Navegação por âncoras — destaca a seção ativa na sidebar e no menu mobile (linhas de produto)

export function initAnchorTracking() {
  const sections = document.querySelectorAll('.lp-section');
  if (!sections.length) return;

  const sideLinks = document.querySelectorAll('.side-nav a');
  const mobileLinks = document.querySelectorAll('.mobile-anchor-nav a');

  function setActive(id) {
    sideLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
    mobileLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach((s) => observer.observe(s));

  setActive(sections[0].id);
}
