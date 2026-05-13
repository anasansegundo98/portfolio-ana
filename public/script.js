/* ═══════════════════════════════════════════════════════
   Portfolio de Ana — script.js
   ═══════════════════════════════════════════════════════ */

/* ── 1. TYPING EFFECT ──────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing');
  if (!el) return;

  const lines = [
    'Ana San Segundo García',
    'Full Stack Developer',
    'Diseñadora UX/UI',
    'Aprendiz perpetua 🌱',
  ];

  let lineIdx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 70, SPEED_DEL = 35, PAUSE = 1800;

  function tick() {
    const current = lines[lineIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
})();


/* ── 2. SCROLL REVEAL ──────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
})();


/* ── 3. ACTIVE NAV ON SCROLL ───────────────────────────── */
(function initActiveNav() {
  const links = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = [...links].map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function update() {
    const scrollY = window.scrollY + 100;
    let active = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= scrollY) active = s; });
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + active.id);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── 4. CAROUSEL ───────────────────────────────────────── */
(function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const prev  = document.querySelector('.carousel .prev');
  const next  = document.querySelector('.carousel .next');
  if (!track || !prev || !next) return;

  const step = () => track.querySelector('.project-card')?.offsetWidth + 20 || 320;

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left:  step(), behavior: 'smooth' }));
})();


/* ── 5. VIDEO MODAL ────────────────────────────────────── */
/* Crea el modal en el DOM y lo inyecta con CSS inline para
   no depender de clases externas */
(function initModal() {
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  Object.assign(overlay.style, {
    display:        'none',
    position:       'fixed',
    inset:          '0',
    background:     'rgba(26,26,46,0.92)',
    zIndex:         '9999',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '24px',
  });

  const box = document.createElement('div');
  Object.assign(box.style, {
    position:     'relative',
    width:        '100%',
    maxWidth:     '860px',
    border:       '3px solid #C0396B',
    background:   '#1A1A2E',
    boxShadow:    '8px 8px 0 #C0396B',
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position:    'absolute',
    top:         '-18px',
    right:       '-18px',
    width:       '36px',
    height:      '36px',
    background:  '#C0396B',
    color:       'white',
    border:      'none',
    fontWeight:  '700',
    fontSize:    '1rem',
    cursor:      'pointer',
    lineHeight:  '1',
    zIndex:      '1',
  });

  const video = document.createElement('video');
  Object.assign(video.style, { display: 'block', width: '100%' });
  video.controls = true;
  video.setAttribute('playsinline', '');

  box.append(closeBtn, video);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function close() {
    video.pause();
    video.src = '';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  window.openModal = function (src) {
    video.src = src;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    video.play().catch(() => {});
  };
})();


/* ── 6. CONTACT FORM ───────────────────────────────────── */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const btn  = form.querySelector('.submit-btn');
  const originalHTML = btn.innerHTML;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Estado: enviando */
    btn.disabled = true;
    btn.innerHTML = `<span>Enviando…</span>`;

    /* Simula envío — aquí conectarías tu backend / Formspree / EmailJS */
    setTimeout(() => {
      btn.innerHTML = `<span>¡Mensaje enviado! 🎉</span>`;
      btn.style.background = '#7CB518';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 1400);
  });
})();


/* ── 7. CURSOR TRAIL (pixel sparkles) ─────────────────── */
(function initCursorTrail() {
  /* Solo en desktop */
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const COLORS = ['#C0396B', '#F2C84B', '#F49AB0', '#A8D848', '#E8628A'];
  const pool   = [];
  const POOL_SIZE = 18;

  for (let i = 0; i < POOL_SIZE; i++) {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position:      'fixed',
      pointerEvents: 'none',
      zIndex:        '9998',
      width:         '6px',
      height:        '6px',
      borderRadius:  '0',           /* pixel cuadrado */
      opacity:       '0',
      transition:    'opacity 0.4s, transform 0.4s',
      willChange:    'transform, opacity',
    });
    document.body.appendChild(dot);
    pool.push(dot);
  }

  let poolIdx = 0;

  document.addEventListener('mousemove', (e) => {
    const dot   = pool[poolIdx % POOL_SIZE];
    const color = COLORS[poolIdx % COLORS.length];
    poolIdx++;

    dot.style.left    = e.clientX - 3 + 'px';
    dot.style.top     = e.clientY - 3 + 'px';
    dot.style.background = color;
    dot.style.transform  = 'scale(1)';
    dot.style.opacity    = '0.85';

    requestAnimationFrame(() => {
      dot.style.opacity   = '0';
      dot.style.transform = `scale(0) translate(${rnd(-12,12)}px, ${rnd(-12,12)}px)`;
    });
  });

  function rnd(a, b) { return Math.random() * (b - a) + a; }
})();


/* ── 8. SKILL HOVER TOOLTIP ────────────────────────────── */
(function initSkillTooltips() {
  const tips = {
    HTML:       '¡La columna vertebral de la web!',
    CSS:        'Donde el diseño cobra vida 🎨',
    JavaScript: 'El lenguaje que lo mueve todo ⚡',
    Java:       'Robustez y orientación a objetos',
    Python:     'Limpio, potente y versátil 🐍',
    PHP:        'Backend del lado del servidor',
    MySQL:      'Bases de datos relacionales 📊',
    MongoDB:    'NoSQL para datos flexibles',
    Git:        'Control de versiones sin miedo',
    GitHub:     'Donde vive mi código 🐙',
    Figma:      'Diseño y prototipado visual ✏️',
    Trello:     'Organización kanban 📌',
  };

  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, {
    position:      'fixed',
    pointerEvents: 'none',
    zIndex:        '9997',
    background:    '#1A1A2E',
    color:         '#F2C84B',
    fontFamily:    "'JetBrains Mono', monospace",
    fontSize:      '0.72rem',
    fontWeight:    '700',
    padding:       '6px 12px',
    border:        '2px solid #C0396B',
    letterSpacing: '0.05em',
    opacity:       '0',
    transition:    'opacity 0.15s',
    whiteSpace:    'nowrap',
  });
  document.body.appendChild(tooltip);

  document.querySelectorAll('.skill').forEach((skill) => {
    const name = skill.querySelector('span')?.textContent.trim();
    if (!name || !tips[name]) return;

    skill.addEventListener('mouseenter', (e) => {
      tooltip.textContent = tips[name];
      tooltip.style.opacity = '1';
      moveTooltip(e);
    });
    skill.addEventListener('mousemove', moveTooltip);
    skill.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  });

  function moveTooltip(e) {
    tooltip.style.left = e.clientX + 14 + 'px';
    tooltip.style.top  = e.clientY - 32 + 'px';
  }
})();


/* ── 9. PARALLAX HERO DOTS ─────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.body.style.setProperty(
      '--dot-offset',
      `${y * 0.18}px`
    );
  }, { passive: true });

  /* Apply the CSS variable in a style tag */
  const style = document.createElement('style');
  style.textContent = `
    body::before {
      background-position: 0 var(--dot-offset, 0);
    }
  `;
  document.head.appendChild(style);
})();


/* ── 10. FOOTER YEAR ───────────────────────────────────── */
(function updateYear() {
  const el = document.querySelector('.site-footer p');
  if (el) el.textContent = el.textContent.replace(/\d{4}/, new Date().getFullYear());
})();