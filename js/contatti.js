/* Form di prenotazione → WhatsApp. Nessun dato inviato a server, nessun dato salvato. */
import { ORARI, GIORNI, hhmm, waLink } from './dati.js';
import { oraRoma } from './main.js';

const form = document.getElementById('prenota');
if (form) {
  const giorno = form.elements.giorno;
  const ora = form.elements.ora;
  const oggi = oraRoma();

  // data minima = oggi (ora di Roma), formato yyyy-mm-dd
  const adesso = new Date();
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(adesso);
  giorno.min = iso;

  /* fasce prenotabili: pranzo 12:00–15:30, cena dall'apertura fino alle 23:30, ogni 30' */
  function fasce(g) {
    const [[pa], [ca]] = ORARI[g];
    const out = [];
    for (let m = pa; m <= 930; m += 30) out.push(m);
    for (let m = ca; m <= 1410; m += 30) out.push(m);
    return out;
  }
  function riempiOre() {
    const g = giorno.value ? new Date(`${giorno.value}T12:00:00Z`).getUTCDay() : null;
    const scelto = ora.value;
    ora.innerHTML = '<option value="">Scegli</option>';
    if (g === null) { ora.disabled = true; return; }
    ora.disabled = false;
    const eOggi = giorno.value === iso;
    fasce(g).filter((m) => !eOggi || m > oggi.min).forEach((m) => {
      const o = new Option(hhmm(m), hhmm(m));
      o.textContent = hhmm(m);
      ora.add(o);
    });
    if ([...ora.options].some((o) => o.value === scelto)) ora.value = scelto;
  }
  giorno.addEventListener('change', riempiOre);
  riempiOre();

  const errore = (campo, testo) => {
    campo.setAttribute('aria-invalid', testo ? 'true' : 'false');
    const box = document.getElementById(`${campo.id}-err`);
    if (box) box.textContent = testo || '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.elements.sito.value) return; // campo trappola
    const f = form.elements;
    let primo = null;
    const controlla = (campo, ok, testo) => { errore(campo, ok ? '' : testo); if (!ok && !primo) primo = campo; };
    controlla(f.nome, f.nome.value.trim().length > 1, 'Scrivi il tuo nome.');
    controlla(f.giorno, !!f.giorno.value, 'Scegli il giorno.');
    controlla(f.ora, !!f.ora.value, 'Scegli l’ora.');
    const n = Number(f.persone.value);
    controlla(f.persone, n >= 1 && n <= 20, 'Da 1 a 20 persone (per gruppi più grandi chiamate).');
    controlla(f.privacy, f.privacy.checked, 'Serve la presa visione dell’informativa.');
    if (primo) { primo.focus(); return; }

    const g = new Date(`${f.giorno.value}T12:00:00Z`);
    const data = `${GIORNI[g.getUTCDay()]} ${g.getUTCDate()}/${g.getUTCMonth() + 1}`;
    const testo = `Ciao Pepe Nero, vorrei prenotare un tavolo.\nNome: ${f.nome.value.trim()}\nGiorno: ${data}\nOra: ${f.ora.value}\nPersone: ${n}` +
      (f.nota.value.trim() ? `\nNota: ${f.nota.value.trim()}` : '');
    window.open(waLink(testo), '_blank', 'noopener');
    document.getElementById('prenota-stato').textContent = 'Si è aperto WhatsApp con il messaggio pronto: premi Invia per mandarlo al locale.';
  });
}
