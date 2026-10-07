// Genera /pt/index.html y /en/index.html a partir de index.html (español).
// El español es la fuente: se edita index.html y se corre `node scripts/build-i18n.mjs`.
// Cada entrada es [español, portugués (Brasil), inglés]. Si un texto en español cambia y
// ya no aparece, el script avisa y no escribe nada, para que ninguna página quede a medias.
// La letra de la canción se queda en español a propósito: es su canción.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'index.html'), 'utf8');

const LANGS = {
  pt: { col: 1, html: 'pt-BR', path: 'pt/' },
  en: { col: 2, html: 'en', path: 'en/' },
};

const STRINGS = [
  // ── Cabecera
  ['<html lang="es">', '<html lang="pt-BR">', '<html lang="en">'],
  ['<title>Rivas Seven — El creador de las vainas</title>',
    '<title>Rivas Seven — Cantor e compositor colombiano</title>',
    '<title>Rivas Seven — Colombian singer-songwriter</title>'],
  ['Soy Rivas Seven, cantautor de Medellín con raíces chocoanas. Despecho, duelo y superación sobre ritmo tropical urbano. Nuevo sencillo: Último Estado.',
    'Sou Rivas Seven, cantor e compositor de Medellín com raízes no Chocó. Desilusão, luto e superação sobre ritmo tropical urbano. Novo single: Último Estado.',
    'I’m Rivas Seven, a singer-songwriter from Medellín with roots in Chocó. Heartbreak, grief and moving on over a tropical urban beat. New single: Último Estado.'],
  ['El primero del álbum Desprendiéndome. Ya disponible.',
    'O primeiro single do álbum Desprendiéndome. Já disponível.',
    'The first single from the album Desprendiéndome. Out now.'],
  ['<link rel="canonical" href="https://rivasseven.com/">',
    '<link rel="canonical" href="https://rivasseven.com/pt/">',
    '<link rel="canonical" href="https://rivasseven.com/en/">'],
  ['<meta property="og:url" content="https://rivasseven.com/">',
    '<meta property="og:url" content="https://rivasseven.com/pt/">',
    '<meta property="og:url" content="https://rivasseven.com/en/">'],

  // ── Navegación
  ['aria-label="Rivas Seven, inicio"', 'aria-label="Rivas Seven, início"', 'aria-label="Rivas Seven, home"'],
  ['<a href="#lanzamiento">Música</a>', '<a href="#lanzamiento">Música</a>', '<a href="#lanzamiento">Music</a>'],
  ['<a href="#letras">Letras</a>', '<a href="#letras">Letras</a>', '<a href="#letras">Lyrics</a>'],
  ['<a href="#historia">Historia</a>', '<a href="#historia">História</a>', '<a href="#historia">Story</a>'],
  ['<a href="#galeria">Galería</a>', '<a href="#galeria">Galeria</a>', '<a href="#galeria">Gallery</a>'],
  ['<a href="#contacto">Contrataciones</a>', '<a href="#contacto">Contratação</a>', '<a href="#contacto">Booking</a>'],
  ['aria-label="Principal"', 'aria-label="Principal"', 'aria-label="Main"'],
  ['rel="noopener">Escuchar</a>', 'rel="noopener">Ouvir</a>', 'rel="noopener">Listen</a>'],
  ['aria-label="Abrir menú"', 'aria-label="Abrir menu"', 'aria-label="Open menu"'],

  // ── Portada
  ['alt="Rivas Seven sentado en una silla en medio de la calle, de noche"',
    'alt="Rivas Seven sentado numa cadeira no meio da rua, à noite"',
    'alt="Rivas Seven sitting on a chair in the middle of the street at night"'],
  ['Nuevo sencillo · Ya disponible', 'Novo single · Já disponível', 'New single · Out now'],
  ['Hago música para soltar <em>lo que duele.</em>',
    'Faço música para deixar ir <em>o que dói.</em>',
    'I make music to let go of <em>what hurts.</em>'],
  ['Ver «Último Estado»', 'Ver «Último Estado»', 'Watch “Último Estado”'],

  // ── Lanzamiento
  ['01 — Lanzamiento', '01 — Lançamento', '01 — New release'],
  ['El primer sencillo de <strong>Desprendiéndome</strong>, mi nuevo álbum. Lo canté frente al mar, para cuando ves lo que no querías ver: el celular en la mano y el orgullo en el suelo.',
    'O primeiro single de <strong>Desprendiéndome</strong>, meu novo álbum. Cantei de frente para o mar, para quando você vê o que não queria ver: o celular na mão e o orgulho no chão.',
    'The first single from <strong>Desprendiéndome</strong>, my new album. I sang it facing the sea, for when you see what you didn’t want to see: phone in hand, pride on the floor.'],
  ['aria-label="Reproducir el video de Último Estado"',
    'aria-label="Reproduzir o vídeo de Último Estado"',
    'aria-label="Play the Último Estado video"'],
  ['Video lyrics · 2:40', 'Lyric video · 2:40', 'Lyric video · 2:40'],

  // ── Letras (la letra no se traduce)
  ['aria-label="Fragmentos de Último Estado"', 'aria-label="Trechos de Último Estado"', 'aria-label="Excerpts from Último Estado"'],
  ['Último Estado · fragmentos', 'Último Estado · trechos', 'Último Estado · excerpts'],
  ['Mi nuevo álbum · 2026', 'Meu novo álbum · 2026', 'My new album · 2026'],

  // ── Dos caras («El creador de las vainas» es su sello y se deja en español)
  ['Tengo dos caras,<br><em>un mismo corazón.</em>',
    'Tenho duas faces,<br><em>um só coração.</em>',
    'Two sides,<br><em>one heart.</em>'],
  ['<p class="face__tag">De noche</p>', '<p class="face__tag">De noite</p>', '<p class="face__tag">By night</p>'],
  ['<p class="face__tag">De día</p>', '<p class="face__tag">De dia</p>', '<p class="face__tag">By day</p>'],
  ["<h3>Pa' llorarla</h3>", '<h3>Pra chorar</h3>', '<h3>To cry it out</h3>'],
  ["<h3>Pa' bailarla</h3>", '<h3>Pra dançar</h3>', '<h3>To dance it off</h3>'],
  ['Despecho sin filtro. Lo que no te dije, te lo canto.',
    'Dor de cotovelo sem filtro. O que eu não te disse, eu canto.',
    'Heartbreak, unfiltered. What I never told you, I sing.'],
  ['Afrobeat, vibras de los 2000 y pasos a lo loco. Porque yo también sano bailando.',
    'Afrobeat, vibe anos 2000 e passos sem juízo. Porque eu também me curo dançando.',
    'Afrobeat, 2000s vibes and wild moves. Because I heal by dancing too.'],

  // ── Historia
  ['alt="Rivas Seven de pie en la calle con los brazos cruzados"',
    'alt="Rivas Seven em pé na rua, de braços cruzados"',
    'alt="Rivas Seven standing in the street with his arms crossed"'],
  ['Sesión en la calle · 2024', 'Ensaio na rua · 2024', 'Street session · 2024'],
  ['03 — Historia', '03 — História', '03 — Story'],
  ['Del Chocó<br>a Medellín.', 'Do Chocó<br>a Medellín.', 'From Chocó<br>to Medellín.'],
  ['Soy Daniel Mauricio Rivas Ramírez. Crecí entre dos orillas: la sangre chocoana y la calle paisa. A los 12 años escribí mi primera letra y no he parado.',
    'Sou Daniel Mauricio Rivas Ramírez. Cresci entre duas margens: o sangue do Chocó e a rua de Medellín. Aos 12 anos escrevi minha primeira letra e não parei mais.',
    'I’m Daniel Mauricio Rivas Ramírez. I grew up between two shores: Chocó blood and Medellín streets. I wrote my first lyrics at 12 and haven’t stopped since.'],
  ['Antes de cantar las mías, compuse para otros artistas urbanos. Crecí con Michael Jackson, Aaliyah, 50 Cent y Eminem, y de ahí sale mi sonido: afrobeat, dancehall y reggaetón con el alma de los 2000.',
    'Antes de cantar as minhas, compus para outros artistas urbanos. Cresci ouvindo Michael Jackson, Aaliyah, 50 Cent e Eminem, e daí vem o meu som: afrobeat, dancehall e reggaeton com a alma dos anos 2000.',
    'Before singing my own songs, I wrote for other urban artists. I grew up on Michael Jackson, Aaliyah, 50 Cent and Eminem, and that’s where my sound comes from: afrobeat, dancehall and reggaeton with a 2000s soul.'],
  ['«Si estás luchando en eso que quieres ser, <em>ya eres exitoso.</em>»',
    '«Se você está lutando pelo que quer ser, <em>já é um sucesso.</em>»',
    '“If you’re fighting for what you want to be, <em>you’re already successful.</em>”'],
  ['años tenía cuando escribí mi primera canción', 'anos eu tinha quando escrevi minha primeira canção', 'years old when I wrote my first song'],
  ['mi debut con «No Más Dolor»', 'minha estreia com «No Más Dolor»', 'my debut with “No Más Dolor”'],
  ['«Desprendiéndome», mi nuevo álbum', '«Desprendiéndome», meu novo álbum', '“Desprendiéndome”, my new album'],

  // ── Discografía
  ['04 — Discografía', '04 — Discografia', '04 — Discography'],
  ['Lo que suena.', 'O que toca.', 'Now playing.'],
  ['Sencillo · Desprendiéndome', 'Single · Desprendiéndome', 'Single · Desprendiéndome'],
  ['Sencillo · afrobeat', 'Single · afrobeat', 'Single · afrobeat'],
  ['Sencillo · video oficial', 'Single · clipe oficial', 'Single · official video'],
  ["Sencillo · pa' la discoteca", 'Single · pra pista', 'Single · for the club'],
  ['Sencillo debut', 'Single de estreia', 'Debut single'],
  ['aria-label="Ver Último Estado en YouTube"', 'aria-label="Ver Último Estado no YouTube"', 'aria-label="Watch Último Estado on YouTube"'],
  ['aria-label="Ver Iracema en YouTube"', 'aria-label="Ver Iracema no YouTube"', 'aria-label="Watch Iracema on YouTube"'],
  ['aria-label="Ver Sándalo en YouTube"', 'aria-label="Ver Sándalo no YouTube"', 'aria-label="Watch Sándalo on YouTube"'],
  ['aria-label="Ver Con Too en YouTube"', 'aria-label="Ver Con Too no YouTube"', 'aria-label="Watch Con Too on YouTube"'],
  ['aria-label="Escuchar No Más Dolor en Spotify"', 'aria-label="Ouvir No Más Dolor no Spotify"', 'aria-label="Listen to No Más Dolor on Spotify"'],

  // ── Galería
  ['05 — Galería', '05 — Galeria', '05 — Gallery'],
  ['A plena luz.', 'À luz do dia.', 'In broad daylight.'],
  ['alt="Rivas Seven de perfil en la calle, de noche"', 'alt="Rivas Seven de perfil na rua, à noite"', 'alt="Rivas Seven in profile on the street at night"'],
  ['alt="Rivas Seven bajo luz violeta"', 'alt="Rivas Seven sob luz violeta"', 'alt="Rivas Seven under violet light"'],
  ['alt="Primer plano de Rivas Seven con anillo dorado"', 'alt="Close de Rivas Seven com anel dourado"', 'alt="Close-up of Rivas Seven wearing a gold ring"'],
  ['alt="Silueta de Rivas Seven bajo una palmera frente al mar"', 'alt="Silhueta de Rivas Seven sob uma palmeira diante do mar"', 'alt="Silhouette of Rivas Seven under a palm tree by the sea"'],
  ['alt="Rivas Seven sentado en la calle, de noche"', 'alt="Rivas Seven sentado na rua, à noite"', 'alt="Rivas Seven sitting on the street at night"'],
  ['alt="Rivas Seven de negro con cadena dorada"', 'alt="Rivas Seven de preto com corrente dourada"', 'alt="Rivas Seven in black with a gold chain"'],

  // ── Contrataciones
  ['06 — Contrataciones y prensa', '06 — Contratação e imprensa', '06 — Booking &amp; press'],
  ['Llévame<br>a tu tarima.', 'Me leve<br>pro seu palco.', 'Bring me<br>to your stage.'],
  ['Shows, festivales, eventos privados, colaboraciones y entrevistas. Escríbeme y lo cuadramos.',
    'Shows, festivais, eventos privados, parcerias e entrevistas. Me escreve e a gente combina.',
    'Shows, festivals, private events, collaborations and interviews. Write me and let’s make it happen.'],
  ['?text=Hola%20Rivas%20Seven%2C%20quiero%20hablar%20de%20una%20contrataci%C3%B3n',
    '?text=Ol%C3%A1%20Rivas%20Seven%2C%20quero%20falar%20sobre%20uma%20contrata%C3%A7%C3%A3o',
    '?text=Hi%20Rivas%20Seven%2C%20I%27d%20like%20to%20talk%20about%20a%20booking'],
  ['?subject=Solicitud%20de%20contrataci%C3%B3n', '?subject=Pedido%20de%20contrata%C3%A7%C3%A3o', '?subject=Booking%20request'],
  ['Kit de prensa · pronto', 'Press kit · em breve', 'Press kit · coming soon'],
  ['<label>Nombre<input', '<label>Nome<input', '<label>Name<input'],
  ['<label>Tipo de evento', '<label>Tipo de evento', '<label>Event type'],
  ['<option>Show / concierto</option>', '<option>Show / concerto</option>', '<option>Show / concert</option>'],
  ['<option>Evento privado</option>', '<option>Evento privado</option>', '<option>Private event</option>'],
  ['<option>Colaboración</option>', '<option>Parceria</option>', '<option>Collaboration</option>'],
  ['<option>Prensa / entrevista</option>', '<option>Imprensa / entrevista</option>', '<option>Press / interview</option>'],
  ['<label>Ciudad<input', '<label>Cidade<input', '<label>City<input'],
  ['<label>Fecha<input', '<label>Data<input', '<label>Date<input'],
  ['<label>Mensaje<textarea', '<label>Mensagem<textarea', '<label>Message<textarea'],
  ['>Enviar solicitud</button>', '>Enviar pedido</button>', '>Send request</button>'],
  ['Se abre tu correo con la solicitud lista para enviar.',
    'Seu e-mail abre com o pedido pronto para enviar.',
    'Your email app opens with the request ready to send.'],

  // ── Pie y botón inferior
  ['alt="Logo de Rivas Seven"', 'alt="Logo de Rivas Seven"', 'alt="Rivas Seven logo"'],
  ['Únete, que esto va a ser grande.', 'Chega junto, que isso vai ser grande.', 'Join in — this is going to be big.'],
  ['<span>Sitio por <a', '<span>Site por <a', '<span>Site by <a'],
  ['aria-label="Ir a la siguiente sección"', 'aria-label="Ir para a próxima seção"', 'aria-label="Go to the next section"'],
];

// Enlaces del selector de idioma: en las subcarpetas, el español queda un nivel arriba.
const LANG_LINKS = {
  pt: [['href="./" hreflang="es"', 'href="../" hreflang="es"'], ['href="pt/" hreflang="pt-BR"', 'href="./" hreflang="pt-BR"'], ['href="en/" hreflang="en"', 'href="../en/" hreflang="en"']],
  en: [['href="./" hreflang="es"', 'href="../" hreflang="es"'], ['href="pt/" hreflang="pt-BR"', 'href="../pt/" hreflang="pt-BR"'], ['href="en/" hreflang="en"', 'href="./" hreflang="en"']],
};

const missing = STRINGS.filter(([es]) => !source.includes(es)).map(([es]) => es);
if (missing.length) {
  console.error('Estos textos en español ya no están en index.html; actualiza la tabla:\n- ' + missing.join('\n- '));
  process.exit(1);
}

for (const [code, lang] of Object.entries(LANGS)) {
  let html = source;
  // Primero los textos más largos, para que uno corto no pise parte de uno largo.
  for (const row of [...STRINGS].sort((a, b) => b[0].length - a[0].length)) {
    html = html.split(row[0]).join(row[lang.col]);
  }
  for (const [from, to] of LANG_LINKS[code]) html = html.split(from).join(to);
  // El idioma activo es el de esta página
  html = html.replace(' aria-current="page"', '');
  html = html.replace(`hreflang="${lang.html}" lang="${lang.html}"`, `hreflang="${lang.html}" lang="${lang.html}" aria-current="page"`);
  // Las rutas de assets suben un nivel
  html = html.replace(/(src|href)="assets\//g, '$1="../assets/');

  const out = join(root, lang.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`✓ ${lang.path}index.html`);
}
