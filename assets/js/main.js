// Rivas Seven — propuesta 16 Ball Creations
// El scroll hace amanecer la página: noche violeta → sol mango → crema.

(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // ── Letras: cada palabra en su span para iluminarla con el scroll
  const lyricsBlock = document.getElementById('letras');
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
      const p = clamp((vh * 0.35 - r.top) / (r.height - vh * 0.7));
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
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
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
    next.setAttribute('aria-label', last ? 'Volver al inicio' : 'Ir a la siguiente sección');
  };
  next.addEventListener('click', () => {
    const target = next.classList.contains('is-last') ? null : nextStop();
    scrollTo({ top: target ? scrollY + target.getBoundingClientRect().top : 0, behavior: reduced ? 'auto' : 'smooth' });
  });
  addEventListener('scroll', syncNext, { passive: true });
  syncNext();

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
    say('Disponible en la versión final.');
  }));
  document.querySelector('[data-demo-form]').addEventListener('submit', e => {
    e.preventDefault();
    e.target.querySelector('.form__note').textContent = 'Maqueta: la solicitud aún no se envía a ningún lado.';
  });
})();
