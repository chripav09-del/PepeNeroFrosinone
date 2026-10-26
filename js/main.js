/* Header, foglio menu, «aperto ora», ingressi allo scorrimento, caroselli. */
import { ORARI, GIORNI, hhmm } from './dati.js';

/* ---------- Ora di Roma (con ?ora=2026-11-01T00:30 per le prove) ---------- */
export function oraRoma() {
  const prova = new URLSearchParams(location.search).get('ora');
  if (prova && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(prova)) {
    const [d, t] = prova.split('T');
    const [y, m, g] = d.split('-').map(Number);
    const [h, mi] = t.split(':').map(Number);
    return { giorno: new Date(Date.UTC(y, m - 1, g)).getUTCDay(), min: h * 60 + mi };
  }
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const giorno = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { giorno, min: Number(p.hour) * 60 + Number(p.minute) };
}

/* La cena chiude all'01:00: l'01:00 di domenica appartiene alla sera di sabato. */
export function stato({ giorno, min }) {
  const ieri = (giorno + 6) % 7;
  for (const [a, b] of ORARI[ieri]) if (b > 1440 && min < b - 1440) return { aperto: true, chiude: b };
  for (const [a, b] of ORARI[giorno]) if (min >= a && min < b) return { aperto: true, chiude: b };
  const prossimo = ORARI[giorno].find(([a]) => a > min);
  return prossimo ? { aperto: false, riapre: prossimo[0], domani: false } : { aperto: false, riapre: ORARI[(giorno + 1) % 7][0][0], domani: true };
}

const fino = (m) => (m % 1440 === 60 ? 'fino all’01:00' : `fino alle ${hhmm(m)}`);
export const orariDelGiorno = (g) => ORARI[g].map(([a, b]) => `${hhmm(a)}–${hhmm(b)}`).join(' · ');

const ora = oraRoma();
const st = stato(ora);
document.querySelectorAll('[data-stato]').forEach((el) => {
  el.classList.toggle('aperto', st.aperto);
  el.querySelector('[data-stato-testo]').textContent = st.aperto
    ? `Aperto ora · ${fino(st.chiude)}`
    : `Chiuso · riapre ${st.domani ? 'domani ' : ''}alle ${hhmm(st.riapre)}`;
});
document.querySelectorAll('[data-oggi]').forEach((el) => {
  el.innerHTML = `<strong>Oggi, ${GIORNI[ora.giorno]}:</strong> ${orariDelGiorno(ora.giorno)}`;
});
document.querySelectorAll('tr[data-giorno]').forEach((tr) => tr.classList.toggle('oggi', Number(tr.dataset.giorno) === ora.giorno));

/* ---------- Header con ombra dopo lo scorrimento ---------- */
const testata = document.querySelector('.testata');
const ombra = () => testata?.classList.toggle('scorsa', scrollY > 8);
addEventListener('scroll', ombra, { passive: true });
ombra();

/* ---------- Foglio menu da telefono ---------- */
const foglio = document.getElementById('foglio-menu');
const apri = document.querySelector('[data-apri-menu]');
let ultimo = null;
const fuori = () => [...document.body.children].filter((el) => el !== foglio && el.tagName !== 'SCRIPT');
function chiudiFoglio() {
  foglio.hidden = true;
  apri.setAttribute('aria-expanded', 'false');
  fuori().forEach((el) => (el.inert = false));
  document.body.style.overflow = '';
  ultimo?.focus();
}
if (foglio && apri) {
  apri.addEventListener('click', () => {
    ultimo = document.activeElement;
    foglio.hidden = false;
    apri.setAttribute('aria-expanded', 'true');
    fuori().forEach((el) => (el.inert = true));
    document.body.style.overflow = 'hidden';
    foglio.querySelector('a, button')?.focus();
  });
  foglio.addEventListener('click', (e) => { if (e.target.closest('[data-chiudi-menu]')) chiudiFoglio(); });
  foglio.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return chiudiFoglio();
    if (e.key !== 'Tab') return;
    const f = [...foglio.querySelectorAll('a, button')];
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  });
}

/* ---------- Ingressi allo scorrimento (una volta) ---------- */
const vista = new IntersectionObserver((voci) => voci.forEach((v) => {
  if (v.isIntersecting) { v.target.classList.add('in-vista'); vista.unobserve(v.target); }
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.entra, .scopri, .pennellata').forEach((el) => vista.observe(el));

/* ---------- Caroselli: frecce, puntini, tastiera. Nessun avanzamento automatico. ---------- */
document.querySelectorAll('.carosello').forEach((c) => {
  const binario = c.querySelector('.carosello__binario');
  const [prima, dopo] = c.querySelectorAll('.carosello__freccia');
  const punti = c.querySelector('.carosello__punti');
  const voci = [...binario.children];
  if (punti) punti.innerHTML = voci.map(() => '<span></span>').join('');
  const passo = () => (voci[1] ? voci[1].offsetLeft - voci[0].offsetLeft : binario.clientWidth);
  const aggiorna = () => {
    const max = binario.scrollWidth - binario.clientWidth - 2;
    if (prima) prima.disabled = binario.scrollLeft <= 2;
    if (dopo) dopo.disabled = binario.scrollLeft >= max;
    if (punti) {
      const i = Math.round(binario.scrollLeft / passo());
      [...punti.children].forEach((p, j) => p.classList.toggle('attivo', j === Math.min(i, voci.length - 1)));
    }
  };
  prima?.addEventListener('click', () => binario.scrollBy({ left: -passo(), behavior: 'smooth' }));
  dopo?.addEventListener('click', () => binario.scrollBy({ left: passo(), behavior: 'smooth' }));
  binario.addEventListener('scroll', aggiorna, { passive: true });
  binario.addEventListener('keydown', (e) => {
    if (e.target !== binario) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); binario.scrollBy({ left: passo(), behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); binario.scrollBy({ left: -passo(), behavior: 'smooth' }); }
  });
  addEventListener('resize', aggiorna, { passive: true });
  aggiorna();
});

/* ---------- Linguette del menu: quella della sezione in vista ---------- */
const linguette = document.querySelectorAll('.linguette a');
if (linguette.length) {
  const mappa = new Map([...linguette].map((a) => [a.getAttribute('href').slice(1), a]));
  const capitoli = new IntersectionObserver((voci) => voci.forEach((v) => {
    if (!v.isIntersecting) return;
    linguette.forEach((a) => a.classList.remove('attiva'));
    const a = mappa.get(v.target.id);
    if (a) { a.classList.add('attiva'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  }), { rootMargin: '-40% 0px -55% 0px' });
  mappa.forEach((_, id) => { const s = document.getElementById(id); if (s) capitoli.observe(s); });
}
