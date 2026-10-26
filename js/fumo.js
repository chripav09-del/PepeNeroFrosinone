/* Movimento-firma: il piatto-Vesuvio del logo, il sugo che «erutta» e il fumo che scrive.
   <svg class="vesuvio" data-scritta="pepenero|apresto|ops" data-quando="subito|vista"></svg>
   Le lettere sono tracciati (non testo) presi dal font dei titoli: «Pepe» leggero, «Nero» pesante. */
import { GLIFI } from './glifi.js';

const PIATTO = [
  'M6 282 L62 281', 'M70 281.5 L196 279', // bordo, aperto come un tratto di pennarello
  'M10 287 C40 305 80 315 110 315 C148 314 176 303 193 288',
  'M34 294 C72 301 136 303 176 293',
  'M80 321 L140 320',
];
const SPAGHETTI = [
  'M28 273 c10-8 20 4 30-4 s18 6 28-2 s20 6 30-2 s22 6 32-2 s16 4 26-2',
  'M38 266 c8-6 14 2 22-3 s14 4 22-1 c6-2 8 2 4 4',
  'M138 263 c10-4 20 2 30-2 s12 4 18 0',
  'M48 278 q20-6 40 0 t40 0 t44-3',
  'M62 259 c4-7 12-5 13 1 c1 4-6 5-6 1',
  'M160 268 c6-6 14-2 12 3 c-2 4-8 2-6-1',
];
const SUGO = 'M66 262 C72 256 78 252 84 250 C88 244 92 240 98 238 C102 233 108 231 114 232 C120 230 126 233 130 237 C136 238 140 243 146 246 C152 249 158 252 164 256 C168 258 170 260 172 262 C162 265 150 262 141 266 C131 262 119 268 108 264 C96 268 84 262 74 266 Z';
const FUMO = 'M114 233 c-7-3 5-6-1-10 s6-5-1-9 s5-5 1-8';
const RICCIOLO = 'M101 50 c-3-6 6-8 5-14 s-8-6-3-12 s8-3 5-9';

const ns = 'http://www.w3.org/2000/svg';

function costruisci(svg) {
  const parola = GLIFI[svg.dataset.scritta] || GLIFI.pepenero;
  const s = Math.min(150 / parola.w, 0.62);
  const fine = 206 - parola.w * s;
  const lettere = parola.l
    .map(([peso, d], i) => `<path class="v-lettera ${peso}" pathLength="1" vector-effect="non-scaling-stroke" style="--i:${i}" d="${d}"/>`)
    .join('');
  svg.setAttribute('viewBox', '0 0 200 326');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML =
    `<g class="v-piatto">${PIATTO.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g class="v-spaghetti">${SPAGHETTI.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<path class="v-sugo" d="${SUGO}"/>` +
    `<g class="v-fumo-g"><path class="v-fumo" pathLength="1" d="${FUMO}"/>` +
    `<g transform="translate(118 206) rotate(-90) scale(${s.toFixed(3)})">${lettere}</g>` +
    `<path class="v-fumo" pathLength="1" d="${RICCIOLO.replace('M101 50', `M101 ${Math.round(fine - 4)}`)}"/></g>`;
}

const disegna = (svg) => svg.classList.add('disegna');
const osserva = 'IntersectionObserver' in window
  ? new IntersectionObserver((voci) => voci.forEach((v) => { if (v.isIntersecting) { disegna(v.target); osserva.unobserve(v.target); } }), { threshold: 0.35 })
  : null;

document.querySelectorAll('svg.vesuvio').forEach((svg) => {
  costruisci(svg);
  if (svg.dataset.quando === 'vista' && osserva) osserva.observe(svg);
  else requestAnimationFrame(() => requestAnimationFrame(() => disegna(svg)));
});
