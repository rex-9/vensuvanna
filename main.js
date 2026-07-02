/* ═══════════════════════════════════════════════════════════════════════
   VEN. SUVANNA — SCRIPT.JS
   Heaven canvas · Light motes · Lotus petals · Carousels · Scroll reveals
   Structure mirrors MeritMoon's script.js, recoloured for Tāvatiṃsa.
   ═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── COLOR MIRRORS (matches CSS vars — edit in CSS, mirror here for canvas) */
const C = {
  sky: '#BFE0F5',
  azure: '#3E7CC2',
  lotus: '#D4738A',
  gold: '#D4A832',
  skyBright: '#EAF6FF',
  azureBright: '#5FA3E8',
  goldBright: '#F0CC60',
  skyDim: '#8CB4D0',
  azureDim: '#1F4A8A',
  bgDeep: '#0A1530',
};

/* ══════════════════════════════════════════════════════════════════════
   1. HEAVEN SKY + LIGHT CANVAS
   Layered: deep sky gradient → stars (sparse, daytime-faint) →
   golden light clusters → faint cloud-sea silhouette at canvas bottom
   ══════════════════════════════════════════════════════════════════════ */
(function initHeavenCanvas() {
  const canvas = document.getElementById('heaven-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shooters = [], driftClouds = [];
  let frame = 0, raf;

  function rand(a, b) { return Math.random() * (b - a) + a; }
  function hex2rgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  }
  function rgba(hex, a) {
    const { r, g, b } = hex2rgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* Stars / light specks (sparser + warmer than a night sky — heaven glints) */
  function buildStars() {
    stars = [];
    const n = Math.floor(W * H / 3200);
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      let sz, base, speed;
      if (t < 0.6) { sz = rand(0.25, 0.6); base = rand(0.08, 0.22); speed = rand(0.002, 0.005); }
      else if (t < 0.88) { sz = rand(0.6, 1.0); base = rand(0.18, 0.42); speed = rand(0.004, 0.008); }
      else { sz = rand(1.0, 1.6); base = rand(0.4, 0.75); speed = rand(0.007, 0.013); }
      stars.push({
        x: rand(0, W), y: rand(0, H * 0.7),
        sz, base, speed,
        phase: rand(0, Math.PI * 2),
        tint: Math.random() < 0.14
          ? (Math.random() < 0.6 ? C.gold : C.azureDim)
          : '#FFFFFF',
      });
    }
  }

  /* Wispy cloud smears (very faint, drifting) */
  function buildClouds() {
    driftClouds = [];
    for (let i = 0; i < 5; i++) {
      driftClouds.push({
        x: rand(W * 0.05, W * 0.95),
        y: rand(H * 0.08, H * 0.58),
        rx: rand(W * 0.14, W * 0.26),
        ry: rand(H * 0.05, H * 0.12),
        angle: rand(-0.2, 0.2),
        color: i % 2 === 0 ? C.sky : C.gold,
        alpha: rand(0.014, 0.03),
      });
    }
  }

  /* Shooting light streaks (rays of dharma) */
  function spawnShooter() {
    const angle = rand(-0.35, 0.12);
    const spd = rand(8, 18);
    shooters.push({
      x: rand(W * 0.05, W * 0.85),
      y: rand(0, H * 0.36),
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      len: rand(55, 125),
      op: 1,
      decay: rand(0.014, 0.025),
    });
  }

  /* Paint sky gradient */
  function drawSky() {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.22, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.95);
    g.addColorStop(0, 'rgba(63, 72, 92, 0.97)');
    g.addColorStop(0.3, 'rgb(18, 48, 139)');
    g.addColorStop(0.7, 'rgba(0, 0, 0, 0.99)');
    g.addColorStop(1, 'rgba(7,13,30,1)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* Paint cloud smears */
  function drawClouds() {
    driftClouds.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(c.rx, c.ry));
      g.addColorStop(0, rgba(c.color, c.alpha));
      g.addColorStop(0.5, rgba(c.color, c.alpha * 0.4));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /* Paint stars/light specks */
  function drawStars() {
    frame++;
    stars.forEach(s => {
      const op = s.base + Math.sin(frame * s.speed + s.phase) * s.base * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.sz, 0, Math.PI * 2);
      ctx.fillStyle = s.tint === '#FFFFFF'
        ? `rgba(255,255,255,${op})`
        : rgba(s.tint, op);
      ctx.fill();

      if (s.sz > 1.2 && op > 0.5) {
        const arm = s.sz * 2.6;
        ctx.strokeStyle = `rgba(255,248,220,${op * 0.3})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y);
        ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm);
        ctx.stroke();
      }
    });
  }

  /* Paint shooting light-rays */
  function drawShooters() {
    shooters = shooters.filter(s => s.op > 0);
    shooters.forEach(s => {
      const tx = s.x - s.vx * (s.len / 14);
      const ty = s.y - s.vy * (s.len / 14);
      const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, `rgba(255,244,210,${s.op})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = g;
      ctx.lineWidth = s.op * 1.4;
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.op -= s.decay;
    });
    if (frame % 320 === 0 && Math.random() < 0.5) spawnShooter();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawClouds();
    drawStars();
    drawShooters();
    raf = requestAnimationFrame(animate);
  }

  resize();
  buildStars();
  buildClouds();
  animate();

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      cancelAnimationFrame(raf);
      resize(); buildStars(); buildClouds(); animate();
    }, 200);
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   2. LIGHT MOTES (fireflies analogue — golden motes drifting upward)
   ══════════════════════════════════════════════════════════════════════ */
(function initMotes() {
  const container = document.getElementById('motes');
  if (!container) return;
  const count = window.innerWidth < 768 ? 10 : 20;

  for (let i = 0; i < count; i++) {
    const m = document.createElement('div');
    m.className = 'mote';
    const x = Math.random() * 100;
    const y = 30 + Math.random() * 65;
    const dur = 6 + Math.random() * 12;
    const del = Math.random() * 10;
    const dx = (Math.random() - 0.5) * 80;
    const dy = -(20 + Math.random() * 80);
    const dx2 = (Math.random() - 0.5) * 60;
    const dy2 = -(40 + Math.random() * 100);
    if (Math.random() < 0.3) {
      m.style.background = '#5FA3E8';
      m.style.boxShadow = '0 0 6px 2px #5FA3E8';
    }
    m.style.cssText += `
      left: ${x}%; top: ${y}%;
      --mt-dur: ${dur}s;
      --mt-delay: ${del}s;
      --mt-dx: ${dx}px;
      --mt-dy: ${dy}px;
      --mt-dx2: ${dx2}px;
      --mt-dy2: ${dy2}px;
      animation-delay: ${del}s;
      animation-duration: ${dur}s;
    `;
    container.appendChild(m);
  }
})();


/* ══════════════════════════════════════════════════════════════════════
   3. LOTUS PETALS (drifting downward, gentle)
   ══════════════════════════════════════════════════════════════════════ */
(function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  const blooms = ['🌸', '🌺', '🌼', '🪷', '✿'];
  const count = window.innerWidth < 768 ? 6 : 12;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'petal-fall';
    el.textContent = blooms[Math.floor(Math.random() * blooms.length)];
    const sz = 0.8 + Math.random() * 0.7;
    el.style.cssText = `
      left:${Math.random() * 100}%;
      --pf-sz:${sz}rem;
      --pf-dur:${18 + Math.random() * 22}s;
      --pf-delay:${-Math.random() * 32}s;
      --pf-drift:${(Math.random() - 0.5) * 100}px;
      --pf-spin:${(Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 180)}deg;
    `;
    container.appendChild(el);
  }
})();


/* ══════════════════════════════════════════════════════════════════════
   4. CUSTOM CURSOR
   ══════════════════════════════════════════════════════════════════════ */
(function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const el = document.createElement('div');
  el.id = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  document.body.style.cursor = 'none';

  let cx = -100, cy = -100, tx = -100, ty = -100;

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  function lerp(a, b, t) { return a + (b - a) * t; }
  function tick() {
    cx = lerp(cx, tx, 0.16);
    cy = lerp(cy, ty, 0.16);
    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  document.querySelectorAll('a,button,[role="button"]').forEach(node => {
    node.style.cursor = 'none';
    node.addEventListener('mouseenter', () => el.classList.add('hover'));
    node.addEventListener('mouseleave', () => el.classList.remove('hover'));
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   5. NAVIGATION
   ══════════════════════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!nav || !ham || !links) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   6. HERO ENTRY ANIMATION
   ══════════════════════════════════════════════════════════════════════ */
(function initHero() {
  const kicker = document.querySelector('.hero__kicker');
  if (kicker) setTimeout(() => {
    kicker.style.opacity = '1';
    kicker.style.animation = 'fade-up 0.8s var(--ease-heaven) forwards';
  }, 300);

  document.querySelectorAll('.hero__hl-line').forEach(line => {
    const d = parseInt(line.dataset.d || 0);
    setTimeout(() => line.classList.add('vis'), 500 + d);
  });

  document.querySelectorAll('.reveal-fade[data-d]').forEach(el => {
    if (!el.closest('.hero')) return;
    const d = parseInt(el.dataset.d || 0);
    setTimeout(() => el.classList.add('vis'), 500 + d);
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   7. INTERSECTION OBSERVER — scroll reveals + counters
   ══════════════════════════════════════════════════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal-fade, .reveal-card, .reveal-up').forEach(el => {
    if (el.closest('.hero')) return;
    const d = parseInt(el.dataset.d || 0);
    if (d) el.style.transitionDelay = (d / 1000) + 's';
    obs.observe(el);
  });

  [
    '.pcard', '.how__step', '.tcard', '.acard',
    '.fcol', '.footer__brand', '.retreat-item', '.mcard', '.talk-card',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal-fade') && !el.classList.contains('reveal-card')) {
        el.classList.add('reveal-fade');
        el.style.transitionDelay = (i * 0.06) + 's';
        if (!el.closest('.hero')) obs.observe(el);
      }
    });
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   8. ANIMATED COUNTERS
   ══════════════════════════════════════════════════════════════════════ */
(function initCounters() {
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function animateNum(el, target, dur = 2000) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    })(start);
  }

  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const t = parseInt(e.target.dataset.target, 10);
      if (!isNaN(t)) animateNum(e.target, t);
      cObs.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));
})();


/* ══════════════════════════════════════════════════════════════════════
   9. CAROUSEL FACTORY
   ══════════════════════════════════════════════════════════════════════ */
function makeCarousel({ trackId, prevId, nextId, dotsId, cardSel, perView, gapPx, autoplay }) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsEl = document.getElementById(dotsId);
  if (!track || !prev || !next || !dotsEl) return;

  const cards = [...track.querySelectorAll(cardSel)];
  if (!cards.length) return;

  const maxIdx = Math.max(0, cards.length - perView);
  let cur = 0;

  for (let i = 0; i <= maxIdx; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  }

  function cardW() { return cards[0].offsetWidth + gapPx; }

  function go(idx) {
    cur = Math.max(0, Math.min(idx, maxIdx));
    track.style.transform = `translateX(-${cur * cardW()}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  prev.addEventListener('click', () => go(cur - 1));
  next.addEventListener('click', () => go(cur + 1));

  let tx0 = 0;
  track.parentElement.addEventListener('touchstart', e => { tx0 = e.changedTouches[0].clientX; }, { passive: true });
  track.parentElement.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 44) go(dx < 0 ? cur + 1 : cur - 1);
  }, { passive: true });

  if (autoplay) {
    setInterval(() => go(cur < maxIdx ? cur + 1 : 0), autoplay);
  }
}

// Journey carousel
makeCarousel({
  trackId: 'journey-track', prevId: 'j-prev', nextId: 'j-next', dotsId: 'j-dots',
  cardSel: '.ccard', perView: Math.max(1, Math.floor(window.innerWidth / 348)),
  gapPx: 24, autoplay: 6000,
});

// Quotes carousel
makeCarousel({
  trackId: 'quote-track', prevId: 'q-prev', nextId: 'q-next', dotsId: 'q-dots',
  cardSel: '.tcard', perView: Math.max(1, Math.floor(window.innerWidth / 588)),
  gapPx: 24, autoplay: 0,
});


/* ══════════════════════════════════════════════════════════════════════
   10. PORTRAIT / SUN PARALLAX + EYE TRACKING
   ══════════════════════════════════════════════════════════════════════ */
(function initPortraitInteractions() {
  const portraitWrap = document.querySelector('.hero-portrait-wrap');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking || !portraitWrap) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        portraitWrap.style.setProperty('--portrait-shift', `${y * 0.06}px`);
      }
      ticking = false;
    });
  }, { passive: true });

  // Eye follow on sun mascots
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.sm-face').forEach(face => {
      const r = face.getBoundingClientRect();
      const fcx = r.left + r.width / 2;
      const fcy = r.top + r.height / 2;
      const dx = e.clientX - fcx;
      const dy = e.clientY - fcy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = 1.4;
      const mx = dist > 0 ? (dx / dist) * Math.min(dist * 0.025, max) : 0;
      const my = dist > 0 ? (dy / dist) * Math.min(dist * 0.025, max) : 0;
      face.querySelectorAll('.sm-eye').forEach(eye => {
        eye.style.transform = `translate(${mx}px,${my}px)`;
      });
    });
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   11. SUN MASCOT BLINK
   ══════════════════════════════════════════════════════════════════════ */
(function initBlink() {
  function blink(face) {
    face.querySelectorAll('.sm-eye').forEach(e => {
      const base = e.style.transform || '';
      e.style.transform = base + ' scaleY(0.08)';
      setTimeout(() => { e.style.transform = base; }, 110);
    });
  }
  function scheduleBlink(face) {
    setTimeout(() => { blink(face); scheduleBlink(face); }, 3000 + Math.random() * 4500);
  }
  document.querySelectorAll('.sm-face').forEach(face => scheduleBlink(face));
})();


/* ══════════════════════════════════════════════════════════════════════
   12. CARD AMBIENT GLOW (mouse-tracked radial)
   ══════════════════════════════════════════════════════════════════════ */
(function initCardGlow() {
  const selector = '.ccard, .pcard, .tcard, .mcard, .acard, .talk-card, .retreat-item, .topic-card';
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(212,168,50,0.06) 0%, transparent 55%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.backgroundImage = ''; });
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   13. SPARK BURST on primary button hover
   ══════════════════════════════════════════════════════════════════════ */
(function initSparks() {
  const kf = document.createElement('style');
  kf.textContent = `
    @keyframes spark-out {
      0%   { transform: translate(0,0) scale(0); opacity:1; }
      70%  { opacity:0.8; }
      100% { transform: translate(var(--spx),var(--spy)) scale(1.4); opacity:0; }
    }
  `;
  document.head.appendChild(kf);

  document.querySelectorAll('.btn--sky').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      for (let i = 0; i < 7; i++) {
        const sp = document.createElement('span');
        sp.textContent = Math.random() < 0.5 ? '✦' : '✧';
        const spx = (Math.random() - 0.5) * 48;
        const spy = (Math.random() - 0.7) * 48;
        sp.style.cssText = `
          position:absolute;
          color:${Math.random() < 0.5 ? C.goldBright : C.skyBright};
          font-size:${7 + Math.random() * 7}px;
          pointer-events:none; z-index:20;
          left:${15 + Math.random() * 70}%; top:${10 + Math.random() * 80}%;
          --spx:${spx}px; --spy:${spy}px;
          animation: spark-out 0.65s ease forwards;
          filter: drop-shadow(0 0 3px ${C.gold});
        `;
        btn.appendChild(sp);
        setTimeout(() => sp.remove(), 700);
      }
    });
  });
})();


/* ══════════════════════════════════════════════════════════════════════
   14. ACTIVE NAV HIGHLIGHT
   ══════════════════════════════════════════════════════════════════════ */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav__links a[href^="#"]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + e.target.id
            ? C.skyBright : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


/* ══════════════════════════════════════════════════════════════════════
   15. LIGHT WASH SCROLL RESPONSE
   ══════════════════════════════════════════════════════════════════════ */
(function initWashParallax() {
  const wash = document.querySelector('.light-wash');
  if (!wash) return;
  window.addEventListener('scroll', () => {
    const ratio = Math.min(window.scrollY / (document.body.scrollHeight * 0.25), 1);
    wash.style.opacity = 0.5 + ratio * 0.4;
  }, { passive: true });
})();


/* ══════════════════════════════════════════════════════════════════════
   16. KEYBOARD SHORTCUT — jump to visual teachings
   ══════════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 't' || e.key === 'T') window.location.href = 'dhamma/index.html';
});


/* ══════════════════════════════════════════════════════════════════════
   17. SMOOTH FADE-IN ON LOAD
   ══════════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.9s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
});

console.log('☸ Tāvatiṃsa — the heaven realm of the Thirty-Three.');
console.log('🪷 Sabbe sattā sukhitā hontu — May all beings be happy.');