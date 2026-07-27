// Hero slider (home)

export function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-right .hslide');
  if (!slides.length) return;
  let current = 0;
  function showSlide(n) {
    slides.forEach((s) => s.classList.remove('on'));
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('on');
  }
  setInterval(() => showSlide(current + 1), 2000);
}
