/* Pepe Nero Frosinone: UNICA fonte di verità per orari, voglie, piatti firma e recensioni.
   La usa il sito (aperto ora, foglio menu, form) e la usa _build/build.mjs per scrivere l'HTML statico.
   Nomi e ingredienti copiati dal menu digitale del locale (leggimenu). Nessun prezzo. */

export const LOCALE = {
  nome: 'Pepe Nero Frosinone',
  via: 'Via Tiburtina 114', // CIVICO DA CONFERMARE: 114 (scheda Google e menu) vs 174 (elenchi vecchi)
  cap: '03100',
  citta: 'Frosinone',
  fisso: '0775 271184',
  fissoTel: 'tel:+390775271184',
  wa: '393 306 9657',
  waNumero: '393933069657',
  email: 'pepenerofrosinone@gmail.com',
  maps: 'https://www.google.com/maps/search/?api=1&query=Pepe+Nero+Frosinone+Via+Tiburtina',
  recensioni: 'https://www.google.com/maps/search/?api=1&query=Pepe+Nero+Frosinone+Via+Tiburtina',
  instagram: 'https://www.instagram.com/pepenerofrosinone/',
  facebook: 'https://www.facebook.com/frosinonepepenero',
  menuDigitale: 'https://www.leggimenu.it/menu/pepenerofrosinone',
  deliveroo: 'https://deliveroo.it/it/menu/frosinone/frosinone/pepe-nero-frosinone',
  glovo: 'https://glovoapp.com/en/it/frosinone/stores/pepe-nero-frs',
};

export const waLink = (testo) => `https://wa.me/${LOCALE.waNumero}?text=${encodeURIComponent(testo)}`;

/* Orari in minuti dalla mezzanotte; la cena chiude alle 01:00 = 1500 (del giorno dopo).
   Indice giorno come Date.getDay(): 0 domenica ... 6 sabato. */
const PRANZO = [720, 960];
export const ORARI = [0, 1, 2, 3, 4, 5, 6].map((g) => [PRANZO, [g === 1 || g === 2 ? 1170 : 1140, 1500]]);
export const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

export const hhmm = (m) => {
  const t = ((m % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

export const VOGLIE = [
  {
    id: 'pizza', titolo: 'Pizza dal forno a legna', breve: 'la pizza',
    riga: 'Napoletana, cornicione alto, fior di latte di Agerola',
    foto: 'pizza-napoletana-cornicione', fotoAlt: 'Pizza napoletana con cornicione alto e bruciacchiato, mozzarella e basilico',
    piatti: [
      ['Margherita', 'Pomodoro San Marzano, fior di latte di Agerola, parmigiano e basilico'],
      ['Regina Margherita', 'Pomodorini freschi datterino, poco sugo, fior di latte di Agerola, basilico'],
      ['Bufalina', 'Mozzarella di bufala, pomodorini pachino e poco sugo'],
      ['Sorrisi e Bocconcini', 'Cornicione ripieno di ricotta, pomodorini, bufala DOP'],
      ['Ragù e Polpette', 'Provola di Agerola, ragù e polpette'],
      ['B&B', 'Mortadella, pesto di pistacchio di Bronte, trito di pistacchi'],
    ],
    nota: 'C’è anche la pizza a ruoto: ’O sole mio, Passione, Luna Rossa…',
  },
  {
    id: 'fritti', titolo: 'Fritti napoletani', breve: 'i fritti',
    riga: 'Spaccanapoli, frittatine, crocchettoni',
    foto: 'pizza-fritta', fotoAlt: 'Pizza fritta dorata e gonfia su un piatto rosso',
    piatti: [
      ['Spaccanapoli', 'Pizzetta fritta con pomodoro, parmigiano e basilico'],
      ['Spaccanapoli 2.0', 'Pizzetta fritta con pistacchio, burrata e mortadella'],
      ['Frittatina Classica', 'Bucatini, carne macinata, besciamella, salsiccia, piselli'],
      ['Frittatina Pistacchio, Mortadella e Burrata', ''],
      ['Crocchettone Cacio & Pepe', 'Patate lesse, grana padano, pecorino romano, pepe, bacon (180 g)'],
      ['Angioletti', 'Bastoncini di pasta di pizza fritta con datterino'],
    ],
  },
  {
    id: 'polpette', titolo: 'Polpette e parmigiana', breve: 'polpette e parmigiana',
    riga: 'Al ragù, al pistacchio, cacio e pepe',
    foto: 'frittatina-melanzana-sale', fotoAlt: 'Fritto napoletano con melanzana e sale grosso, in primo piano',
    piatti: [
      ['Polpettine al Ragù', 'Polpette di manzo con ragù'],
      ['Polpettine & Pistacchio', 'Polpettine di manzo con crema di parmigiano e pesto di pistacchio'],
      ['Polpette cacio, pepe e bacon croccante', ''],
      ['Polpette alla Genovese Napoletana', ''],
      ['Parmigiana di Melanzane', ''],
      ['Cannolo ripieno di parmigiana', 'Cannolo siciliano ripieno di parmigiana di melanzane, mousse di mozzarella di bufala, scaglie di parmigiano'],
    ],
  },
  {
    id: 'mare', titolo: 'Primi e mare', breve: 'i primi di mare',
    riga: 'Paccheri alla pescatora, scialatielli, baccalà',
    foto: 'paccheri-pescatora', fotoAlt: 'Paccheri alla pescatora con gamberoni, cozze e vongole',
    piatti: [
      ['Paccheri alla pescatora', 'Con seppia, gamberoni, pomodorini datterino, cozze, vongole e prezzemolo'],
      ['Linguina Puteolana', 'Linguine con vongole veraci, pomodoro datterino e prezzemolo'],
      ['Scialatielli di mare', 'Scialatielli veraci, vongole, cannolicchi, cozze, macchiato al pomodorino e prezzemolo'],
      ['Ziti alla Genovese Napoletana', 'Con ziti, cipolla, battuto di carote sedano e odori, carne di manzo a pezzi e pecorino'],
      ['Zuppa di cozze alla napoletana', 'Cozze, vongole, cannolicchi, polpo, gamberone, leggermente macchiato, olio piccante, fresella e tarallo con pepe'],
      ['Baccalà alla Napoletana', 'Con baccalà, pomodoro, olive nere, capperi'],
    ],
  },
  {
    id: 'brace', titolo: 'Brace e carne', breve: 'la carne alla brace',
    riga: 'Tagliate argentine, Chianina, fiocco di vitello',
    foto: 'straccetti-rucola', fotoAlt: 'Straccetti di manzo con pomodorini su un letto di rucola',
    piatti: [
      ['Tagliata Argentina all’aceto balsamico', 'Con carne di Angus argentino, scaglie di grana e rucola (250 g)'],
      ['Fiocco di Vitello', 'Cotto a bassa temperatura, glassato all’Aglianico su soffice di patate'],
      ['Mini Hamburger di Chianina', '8 miniburger di chianina alla brace serviti con 3 salsine'],
      ['Bistecca di vitellino alla brace', '300 g'],
      ['Misto di Carne alla Griglia', 'Verdure grigliate, salsiccia, patate al forno, manzetta texana, mini hamburger di chianina, reale di manzo americano'],
    ],
  },
  {
    id: 'panini', titolo: 'Panini', breve: 'i panini',
    riga: 'Pane brioche o pane pizza, tutto farcito',
    foto: null,
    piatti: [
      ['Chianino', 'Con lardo di Colonnata, formaggio di fossa, hamburger chianino, fior di latte di Agerola, cipolla caramellata'],
      ['Parmigiana & Polpette', 'Con fiordilatte, polpette al ragù, parmigiana di melanzane'],
      ['Magnifico', 'Hamburger di chianina 200 g, formaggio roquefort, cipolla di Tropea e crema di parmigiano'],
      ['Pepe Nero', 'Con misticanza, pomodoro ramato, cotoletta di petto di pollo e patatine'],
      ['Triple Burger', 'Tre hamburger, patatine fritte, bacon, cheddar, maionese affumicata piccante, provola di Agerola'],
    ],
    nota: 'Pane brioche o pane pizza, scegli tu.',
  },
];

export const DOLCI = [
  ['Sorrisi e Delizie', 'Pizza dolce col cornicione ripieno di crema pasticcera, amarene e chantilly'],
  ['La nostra Cheesecake', 'Con crema di babà e nutella'],
  ['Frutta realistica', 'Cocco, mango, lampone, nocciola'],
  ['Tiramisù', 'Senza glutine e senza lattosio'],
  ['Cheesecake frutti di bosco', 'Senza glutine'],
];

/* Frasi copiate esatte dalle recensioni Google (nome + iniziale). Mai in JSON-LD. */
export const RECENSIONI = [
  ['Una vera pizzeria Napoletana "verace", pizza per i massimi, consigliatissimi gli antipasti tipici e tutta la cucina napoletana', 'Gian Pietro B.', 'agosto 2026'],
  ['Menù molto ricco orientato alla cucina campana: pizza fritta, parmigiana di melanzane, polpette in tutte le combinazioni possibili', 'Errigo C.', 'luglio 2026'],
  ['Una autentica certezza a Frosinone e non solo.', 'Luca R.', 'ottobre 2025'],
  ['Divina la Spaccanapoli 2.0 con burrata mortadella e pistacchi! (Provatela)', 'Fabrizio F.', '2024'],
  ['Locale pulito e accogliente. Servizio veloce e cibo ottimo. La pizza fritta è una delizia.', 'Ylenia P.', 'ottobre 2025'],
  ['Quando non sai dove andare o nella coppia o comitiva ci sono gusti differenti, l\'unica alternativa è scegliere Pepe Nero.', 'Antonio B.', '2024'],
];
