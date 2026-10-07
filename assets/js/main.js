// Rivas Seven — sitio por 16 Ball Creations
// El scroll hace amanecer la página: noche violeta → sol mango → crema.

(() => {
  const root = document.documentElement;

  // ── Textos del script según el idioma de la página (<html lang>)
  const T = {
    es: {
      menuOpen: 'Abrir menú', menuClose: 'Cerrar menú',
      next: 'Ir a la siguiente sección', top: 'Volver al inicio',
      soon: 'Disponible muy pronto.',
      subject: 'Solicitud de contratación', name: 'Nombre', type: 'Tipo de evento', city: 'Ciudad', date: 'Fecha',
      noMail: '¿No se abrió tu correo? Escríbeme a ',
    },
    pt: {
      menuOpen: 'Abrir menu', menuClose: 'Fechar menu',
      next: 'Ir para a próxima seção', top: 'Voltar ao início',
      soon: 'Disponível em breve.',
      subject: 'Pedido de contratação', name: 'Nome', type: 'Tipo de evento', city: 'Cidade', date: 'Data',
      noMail: 'Seu e-mail não abriu? Me escreve em ',
    },
    en: {
      menuOpen: 'Open menu', menuClose: 'Close menu',
      next: 'Go to the next section', top: 'Back to top',
      soon: 'Coming soon.',
      subject: 'Booking request', name: 'Name', type: 'Event type', city: 'City', date: 'Date',
      noMail: 'Email app didn\x27t open? Write me at ',
    },
  };
  const t = T[root.lang.slice(0, 2)] || T.es;
  // Rutas de assets relativas a este script: sirven igual en /, /pt/ y /en/
  const assetUrl = path => new URL('../' + path, document.currentScript.src).href;
  const nav = document.querySelector('.nav');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // ── Letras: cada palabra en su span para iluminarla con el scroll
  const lyricsBlock = document.getElementById('letras');
  const lyricsStage = lyricsBlock.querySelector('.lyrics__stage');
  const lyricWords = [...lyricsBlock.querySelectorAll('[data-line]')].flatMap(line => {
    const words = line.textContent.trim().split(/\s+/);
    line.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    return [...line.querySelectorAll('.w')];
  });

  // ── Tramo donde amanece: de la mitad de «Dos caras» al inicio de «Historia»
  const faces = document.getElementById('caras');
  const story = document.getElementById('historia');
  const themed = [...document.querySelectorAll('[data-theme]')];

  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    const mid = scrollY + vh * 0.5;

    const dawnFrom = faces.offsetTop + faces.offsetHeight * 0.35;
    const dawnTo = story.offsetTop + story.offsetHeight * 0.75;
    const dawn = clamp((mid - dawnFrom) / (dawnTo - dawnFrom));
    root.style.setProperty('--dawn', dawn.toFixed(4));

    // Tema del texto según la sección que ocupa el centro de la pantalla.
    // En «dawn» el texto pasa a oscuro solo cuando el cielo ya aclaró lo suficiente.
    const current = themed.find(s => {
      const r = s.getBoundingClientRect();
      return r.top <= vh * 0.5 && r.bottom > vh * 0.5;
    });
    let theme = current ? current.dataset.theme : 'dark';
    if (theme === 'dawn' && dawn < 0.6) theme = 'dark';
    if (root.dataset.theme !== theme) root.dataset.theme = theme;

    nav.classList.toggle('is-scrolled', scrollY > 40);

    if (!reduced) {
      // Todas las palabras se encienden a lo largo del tramo fijo de la sección
      const r = lyricsBlock.getBoundingClientRect();
      // Termina de encenderse al 70 % del tramo fijo, antes de que el bloque se suelte
      const pin = r.height - lyricsStage.offsetHeight;
      const p = clamp((vh * 0.3 - r.top) / (vh * 0.3 + pin * 0.7));
      const lit = Math.round(p * lyricWords.length);
      lyricWords.forEach((w, i) => w.classList.toggle('on', i < lit));
    }
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();

  // ── Aparición de bloques
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── Menú móvil
  const toggle = document.querySelector('.nav__toggle');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  document.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ── Botón de abajo: salta a la siguiente sección; en la última vuelve arriba
  const next = document.querySelector('.next');
  const stops = [...document.querySelectorAll('main > section, .footer')];
  const nextStop = () => stops.find(s => s.getBoundingClientRect().top > 8);
  const syncNext = () => {
    const last = !nextStop() || innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    next.classList.toggle('is-last', last);
    next.setAttribute('aria-label', last ? t.top : t.next);
  };
  next.addEventListener('click', () => {
    const target = next.classList.contains('is-last') ? null : nextStop();
    scrollTo({ top: target ? scrollY + target.getBoundingClientRect().top : 0, behavior: reduced ? 'auto' : 'smooth' });
  });
  addEventListener('scroll', syncNext, { passive: true });
  syncNext();

  // ── Animación del logo en la portada: se reproduce una vez y queda en el último cuadro.
  // Sin movimiento reducido o si el navegador bloquea el autoplay, se muestra el logo fijo.
  const anim = document.querySelector('.hero__anim');
  const logoSrc = assetUrl('img/logo-s7-512.png');
  if (anim) {
    const toStatic = () => {
      const img = document.createElement('img');
      img.src = logoSrc;
      img.alt = '';
      anim.replaceWith(img);
    };
    if (reduced) toStatic();
    else anim.play().catch(toStatic);
  }

  // ── Video: carga el reproductor de YouTube solo al hacer clic
  document.querySelectorAll('[data-yt]').forEach(btn => btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    iframe.title = 'Rivas Seven — Último Estado';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    btn.replaceWith(iframe);
  }));

  // ── Aviso para lo que todavía no funciona en la maqueta
  const toast = document.querySelector('.toast');
  let toastTimer;
  const say = msg => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };
  document.querySelectorAll('.is-pending').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    say(t.soon);
  }));
  // ── Formulario de contrataciones: abre el correo del visitante con la solicitud armada
  const mailForm = document.querySelector('[data-mail-form]');
  mailForm.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(mailForm);
    const subject = `${t.subject} · ${d.get('tipo')} · ${d.get('nombre')}`;
    const body = [
      `${t.name}: ${d.get('nombre')}`,
      `${t.type}: ${d.get('tipo')}`,
      `${t.city}: ${d.get('ciudad') || '—'}`,
      `${t.date}: ${d.get('fecha') || '—'}`,
      '',
      d.get('mensaje') || '',
    ].join('\n');
    location.href = `mailto:${mailForm.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    mailForm.querySelector('.form__note').textContent = t.noMail + mailForm.dataset.to;
  });
})();
