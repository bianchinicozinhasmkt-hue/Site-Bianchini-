// Ponto de entrada único, compartilhado pelas 3 páginas do site.
// Cada módulo faz guard-clause para os elementos que usa — é seguro
// chamar todos os inits em qualquer página, mesmo sem os elementos alvo.

import { initNavbarScroll, initMobileMenu } from './modules/navigation.js';
import { initHeroSlider } from './modules/slider.js';
import { initReveal } from './modules/reveal.js';
import { initAnchorTracking } from './modules/anchors.js';
import { initClientTicker } from './modules/client-ticker.js';

initReveal();
initNavbarScroll();
initMobileMenu();
initHeroSlider();
initClientTicker();
initAnchorTracking();
