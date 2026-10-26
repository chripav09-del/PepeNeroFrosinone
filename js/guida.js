/* «Cosa ti va stasera?»: ogni tessera apre sotto il carosello il pannello coi piatti firma. */
const tessere = [...document.querySelectorAll('.tessera[aria-controls]')];

function chiudi(t, rimettiFuoco) {
  t.setAttribute('aria-expanded', 'false');
  document.getElementById(t.getAttribute('aria-controls')).hidden = true;
  if (rimettiFuoco) t.focus();
}

tessere.forEach((t) => {
  const pannello = document.getElementById(t.getAttribute('aria-controls'));
  t.addEventListener('click', () => {
    const aperta = t.getAttribute('aria-expanded') === 'true';
    tessere.forEach((x) => x !== t && chiudi(x, false));
    if (aperta) return chiudi(t, false);
    t.setAttribute('aria-expanded', 'true');
    pannello.hidden = false;
    const titolo = pannello.querySelector('h3');
    titolo.focus({ preventScroll: true });
    const r = pannello.getBoundingClientRect();
    if (r.bottom > innerHeight || r.top < 70) {
      const dove = scrollY + r.top - 80;
      scrollTo({ top: dove, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  });
  pannello.querySelector('.voglia__chiudi')?.addEventListener('click', () => chiudi(t, true));
  pannello.addEventListener('keydown', (e) => { if (e.key === 'Escape') chiudi(t, true); });

  /* lieve inclinazione 3D seguendo il puntatore (solo mouse, max 4°) */
  t.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
    t.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 8}deg`);
  });
  t.addEventListener('pointerleave', () => { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); });
});
