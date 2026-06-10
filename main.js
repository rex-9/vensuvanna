/* ═══════════════════════════════════════════════
   Paṭicca-Samuppāda — main.js
   Scroll-driven stage engine · all text content
   ═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────
   TEXT CONTENT — edit these objects to update all labels
   ───────────────────────────────────────────────── */

const PLANT_STAGES = [
  {
    pali: 'Avijjā · Taṇhā · Saṅkhāra',
    en: 'Ignorance · Craving · Volitional Formation',
    vi: 'Vô Minh · Ái · Hành',
    desc: 'The dark, moist soil holds three hidden forces that drive all existence. Avijjā — ignorance of the true nature of reality — is the ground itself. Taṇhā — craving and thirst — is the water saturating the soil, the unseen nutrient. Saṅkhāra / Kamma — volitional formations — is the seed waiting within the earth. Without soil and water, the seed cannot sprout. The entire cycle of existence rests on these three roots. The Noble Path aims to dry up Taṇhā and illuminate Avijjā, so that no new seed can ever germinate again.',
  },
  {
    pali: 'Viññāṇa',
    en: 'Consciousness',
    vi: 'Thức',
    desc: 'From the fertile conditions of ignorance and craving, a sprout breaks through the soil: Viññāṇa — Consciousness. Just as a seed needs warm earth and moisture to germinate, consciousness arises dependent on the conditions of past kamma, craving, and ignorance. This is not a permanent self or soul, but a stream of awareness — moment to moment, conditioned and conditioning. The first flicker of a new life, fragile and green, already reaching toward the light.',
  },
  {
    pali: 'Nāma-Rūpa',
    en: 'Mind & Matter',
    vi: 'Danh & Sắc',
    desc: 'The sprout divides into two distinct shoots: Rūpa (matter) on one side, Nāma (mind) on the other. Rūpa is the physical form — the body, the material substrate of existence. Nāma is the mental cluster — feeling (vedanā), perception (saññā), volition (cetanā), attention (manasikāra), and contact (phassa). Neither can exist without the other. Body needs mind to be alive; mind needs body to experience the world. Together they constitute the psycho-physical being — the "person" who will grow senses, feel the world, and generate more kamma.',
  },
  {
    pali: 'Saḷāyatana',
    en: 'Six Sense Bases',
    vi: 'Sáu Căn',
    desc: 'Six branches extend from the young plant: the Six Sense Bases — eye (cakkhu), ear (sota), nose (ghāna), tongue (jivhā), body (kāya), and mind (mano). These are the six gates through which all experience enters. They develop from nāma-rūpa just as branches grow from a stem — each one a reach toward the world. Without these sense bases, no contact with phenomena is possible. They are the plant\'s entire apparatus of experience, stretching toward sunlight, air, and rain.',
  },
  {
    pali: 'Phassa',
    en: 'Contact',
    vi: 'Xúc',
    desc: 'A bud forms where branch meets world: Phassa — Contact. Contact arises when three things meet simultaneously: a sense organ, its object, and the corresponding consciousness. Eye + visible form + eye-consciousness = contact. This meeting is the hinge between inner and outer worlds. The bud is not yet open — experience has not yet bloomed into feeling. Everything that follows in the cycle depends upon this intimate meeting point. Contact is neither purely inside nor outside; it is the bridge itself.',
  },
  {
    pali: 'Vedanā',
    en: 'Feeling / Sensation',
    vi: 'Thọ',
    desc: 'The bud bursts open into full flower: Vedanā — Feeling. Every contact gives rise to one of three feeling tones: pleasant (sukha), unpleasant (dukkha), or neutral (adukkhamasukha). The flower in full bloom — beautiful, complete, present in this very moment. This is the most crucial pivot point in the entire cycle. With clear mindfulness here, the chain can be broken: pleasant feeling met with awareness rather than craving; unpleasant feeling met with equanimity rather than aversion. Vedanā is where liberation is most accessible — right here, in the raw texture of experience itself.',
  },
  {
    pali: 'Taṇhā',
    en: 'Craving',
    vi: 'Ái',
    desc: 'An unripe fruit forms — green and grasping: Taṇhā — Craving. Arising from pleasant feeling, craving takes three forms: kāma-taṇhā (craving for sensual pleasure), bhava-taṇhā (craving for existence and becoming), and vibhava-taṇhā (craving for non-existence). Like a young fruit drawing the plant\'s energy toward itself, craving pulls the mind relentlessly toward its objects. Notice: Taṇhā appears twice in the cycle — as moisture in the soil (the beginning) and as this green fruit. Craving both initiates and perpetuates the entire wheel.',
  },
  {
    pali: 'Upādāna',
    en: 'Clinging / Attachment',
    vi: 'Thủ',
    desc: 'The fruit ripens into heavy, full maturity: Upādāna — Clinging. From craving ripens attachment. Four types: clinging to sensual pleasures (kāmupādāna), to views and opinions (diṭṭhupādāna), to rites and rituals (sīlabbatupādāna), and to a doctrine of self (attavādupādāna). The ripe fruit is heavy on the branch, drawing everything toward it. Where taṇhā is the reach, upādāna is the grip. This tightening is what makes craving into potent kamma — and yet even here, with clear investigation, the hold can be released.',
  },
  {
    pali: 'Bhava',
    en: 'Becoming / Existence',
    vi: 'Hữu',
    desc: 'Inside the ripe fruit lies the seed: Bhava — Becoming. From clinging arises becoming — the process of kamma actively shaping conditions for a new existence. Three realms: sensual existence (kāma-bhava), form existence (rūpa-bhava), and formless existence (arūpa-bhava). The seed inside the fruit is the future already forming, encoded in the present moment\'s intentions and actions. Bhava is not yet a new life — it is the momentum, the gravitational pull toward the next arising. This seed carries the imprint of everything that came before.',
  },
  {
    pali: 'Jāti · Jarā-Maraṇa',
    en: 'Birth · Aging & Death',
    vi: 'Sinh · Lão Tử',
    desc: 'The fruit falls. The seed drops into the soil — and the wheel turns again. Jāti — Birth: arising into a new existence with new conditions, new sense bases, new pain and joy. Jarā-Maraṇa — Aging and Death: the inevitable decay and dissolution of whatever was born. With birth arise grief, lamentation, pain, sorrow, and despair. This is the full weight of saṃsāra — the wheel turning only because ignorance and craving sit at its hub. May all beings discover the path to its complete cessation. ↻',
  },
];

const HUMAN_STAGES = [
  {
    pali: 'Avijjā · Taṇhā · Saṅkhāra',
    en: 'Ignorance · Craving · Kamma',
    vi: 'Vô Minh · Ái · Nghiệp',
    desc: 'Before conception, three forces gather like clouds before rain. Avijjā — fundamental ignorance of the Three Characteristics: impermanence, suffering, and not-self. Taṇhā — the deep thirst for existence, for pleasure, for continuity of self. Saṅkhāra / Kamma — the accumulated volitional actions of past lives, ripening seeds waiting to find new ground. These three are the proximate conditions for a new human life. Without them, no relinking consciousness can arise. The entire human story begins here, in these unseen roots.',
  },
  {
    pali: 'Paṭisandhi · Viññāṇa',
    en: 'Re-linking Consciousness · Conception',
    vi: 'Kiết Sinh Thức · Thụ Thai',
    desc: 'At the moment of conception, paṭisandhi-citta arises — the relinking consciousness. This is Viññāṇa performing its function of connecting the previous existence to the new one. It is conditioned by the last kamma, death-proximate kamma, or the habitual kamma of the dying being. In Theravāda understanding, this is not a soul transmigrating — it is a flame lighting another flame: the continuity is causal, not substantial. A new life has begun, already shaped by everything that came before.',
  },
  {
    pali: 'Nāma-Rūpa',
    en: 'Mind & Form Develop in the Womb',
    vi: 'Danh Sắc Phát Triển',
    desc: 'In the womb, Nāma-Rūpa develops — the psycho-physical organism takes shape. Rūpa: the physical body forms, nourished by the mother\'s body, governed by the nutriment element (ojā). Nāma: the mental factors — feeling, perception, volition, contact, attention — arise together with consciousness. Mind and matter condition each other in a mutually dependent dance. The body shapes what the mind can experience; the mind directs how the body develops. The fetus is already a complete being of nāma-rūpa, even in the womb.',
  },
  {
    pali: 'Saḷāyatana',
    en: 'Six Sense Organs Form',
    vi: 'Sáu Căn Hình Thành',
    desc: 'The six sense organs form and mature: eyes, ears, nose, tongue, body, and the mind-base (manāyatana). In the womb these develop gradually — the mind-base present from conception, the physical senses maturing through weeks and months. These are the "internal bases" (ajjhattika āyatana). Their corresponding "external bases" — sights, sounds, smells, tastes, touches, and mental objects — are the entire world waiting to be met. The organism is now fully equipped for experience.',
  },
  {
    pali: 'Phassa',
    en: 'Contact · Birth into the World',
    vi: 'Xúc · Chào Đời',
    desc: 'Birth: the child enters the world and Contact begins in full. The first breath, the first sound, the first sensation of cold air and light — these are the first contacts of the new life. Every moment thereafter is an unbroken stream of contacts: sense organ meeting sense object, giving rise to consciousness, the three together constituting phassa. Contact is not merely physical touch — it is the constant meeting of inner and outer at every sense door, the unceasing bridge between the organism and the world. A newborn is already fully immersed in the flow.',
  },
  {
    pali: 'Vedanā',
    en: 'Feeling Tones Through Life',
    vi: 'Thọ',
    desc: 'The growing child lives in a constant stream of Vedanā — feeling tones. Every contact carries one: pleasant, unpleasant, or neutral. A smile, a cry, a taste of food, a lullaby — all carry these tones. Pleasant feelings pull the mind toward them; unpleasant push away; neutral are overlooked. This is the crossroads of liberation. The Buddha taught that one who remains mindful at the level of vedanā can interrupt the chain — feeling need not become craving. Without that mindfulness, pleasant vedanā ripens into taṇhā, and the wheel turns.',
  },
  {
    pali: 'Taṇhā',
    en: 'Craving Arises in the Young Adult',
    vi: 'Ái Sinh Khởi',
    desc: 'The young person grows and Taṇhā takes hold — craving for sensual pleasures: beautiful sights, pleasing sounds, attractive people, rich food. Craving for existence: the desire to become more, to achieve, to be someone. Craving for non-existence: the wish to escape what is painful. These three cravings arise from pleasant, neutral, and unpleasant feelings respectively. Like fire, craving is never satisfied — it feeds on experience and grows stronger. The flames of desire drive nearly all actions of adult life, generating a constant stream of new kamma.',
  },
  {
    pali: 'Upādāna',
    en: 'Clinging / Grasping',
    vi: 'Thủ',
    desc: 'Craving solidifies into Upādāna — Clinging. We cling to what we love, to our beliefs and worldviews, to rituals we think will save us, and most fundamentally — to the idea of a permanent self. Upādāna turns the reach of taṇhā into the grip of possession. "This is mine. This is me. This is my self." The chains bind tightly: to possessions, relationships, status, and identity. And yet — what is held will change; what is grasped will slip away. The chains of attachment are also the very source of all grief.',
  },
  {
    pali: 'Bhava',
    en: 'Becoming · Kamma-Making',
    vi: 'Hữu · Tạo Nghiệp',
    desc: 'Through clinging, a person becomes — Bhava: Becoming. Every intentional action, word, and thought is kamma. Through bhava, one actively creates conditions for future existence. Meritorious kamma, demeritorious kamma, and imperturbable kamma (rooted in jhāna) — all are generated here in the mature life. Like seeds scattered across the future, these actions carry the imprint of intention (cetanā) and will bear fruit in accordance with their nature. The mature human being is, at every moment, planting the garden of the next existence.',
  },
  {
    pali: 'Jāti · Jarā-Maraṇa',
    en: 'Aging, Death & Rebirth',
    vi: 'Sinh · Lão Tử · Tái Sinh',
    desc: 'Old age comes. Death approaches. Whatever was born must age; whatever has arisen must cease. At the moment of death, the last kamma, death-proximate kamma, or habitual kamma presents itself to the dying mind. If avijjā and taṇhā persist — if ignorance and craving have not been uprooted — then a new paṭisandhi-citta arises, and the cycle begins again from the very first condition. Liberation is possible. The cessation of avijjā through the Noble Eightfold Path brings the cessation of taṇhā, and with it the end of birth, aging, and death. ↻',
  },
];

/* ─────────────────────────────────────────────────
   SKY THEMES PER STAGE
   ───────────────────────────────────────────────── */
const PLANT_SKY = ['', '', '', '', 'dawn', 'dawn', 'dusk', 'dusk', 'day', 'day'];
const HUMAN_SKY = ['', '', '', '', 'dawn', 'dawn', 'dusk', 'dusk', 'day', 'day'];

/* ─────────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────────── */
let mode = 'plant';   // 'plant' | 'human'
let stageIndex = 0;
let totalStages = 10;
let lastIndex = -1;
let ticking = false;

/* ─────────────────────────────────────────────────
   DOM REFERENCES
   ───────────────────────────────────────────────── */
const sky = document.getElementById('sky');
const scrollSpc = document.getElementById('scroll-spacer');
const labelPali = document.getElementById('label-pali');
const labelEn = document.getElementById('label-en');
const labelVi = document.getElementById('label-vi');
const labelDesc = document.getElementById('label-desc');
const stageNum = document.getElementById('stage-num');
const stageNav = document.getElementById('stage-nav');
const scrollHint = document.getElementById('scroll-hint');
const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');
const toggleLabel = document.getElementById('toggle-label');
const toggleIcon = document.getElementById('toggle-icon');

/* ─────────────────────────────────────────────────
   STARS
   ───────────────────────────────────────────────── */
function buildStars() {
  const wrap = document.getElementById('stars');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = 1 + Math.random() * 2;
    s.style.cssText = `
      width:${sz}px; height:${sz}px;
      top:${Math.random() * 72}%;
      left:${Math.random() * 100}%;
      --td:${2.2 + Math.random() * 5}s;
      --td2:${Math.random() * 5}s;
      --oa:${0.1 + Math.random() * 0.3};
      --ob:${0.6 + Math.random() * 0.4};
    `;
    wrap.appendChild(s);
  }
}

/* ─────────────────────────────────────────────────
   NAV DOTS
   ───────────────────────────────────────────────── */
function buildNav() {
  stageNav.innerHTML = '';
  for (let i = 0; i < totalStages; i++) {
    const btn = document.createElement('button');
    btn.className = 'ndot' + (i === stageIndex ? ' active' : '');
    btn.setAttribute('aria-label', `Stage ${i + 1}`);
    btn.addEventListener('click', () => jumpToStage(i));
    stageNav.appendChild(btn);
  }
}

function updateNav() {
  document.querySelectorAll('.ndot').forEach((d, i) => {
    d.classList.toggle('active', i === stageIndex);
  });
}

/* ─────────────────────────────────────────────────
   STAGE ELEMENTS
   ───────────────────────────────────────────────── */
function getStageEl(m, i) {
  return document.getElementById(`${m === 'plant' ? 'ps' : 'hs'}${i}`);
}

function showStage(newIdx, direction) {
  const oldEl = getStageEl(mode, lastIndex);
  const newEl = getStageEl(mode, newIdx);
  if (!newEl) return;

  // Hide old
  if (oldEl && oldEl !== newEl) {
    oldEl.classList.remove('entering');
    oldEl.classList.add('exiting');
    setTimeout(() => {
      oldEl.style.display = 'none';
      oldEl.classList.remove('exiting');
    }, 460);
  }

  // Show new
  newEl.style.display = '';
  void newEl.offsetWidth; // reflow
  newEl.classList.remove('exiting');
  newEl.classList.add('entering');
  setTimeout(() => newEl.classList.remove('entering'), 720);

  // Labels
  const data = mode === 'plant' ? PLANT_STAGES[newIdx] : HUMAN_STAGES[newIdx];
  updateLabels(data, newIdx);

  // Sky
  const skyMap = mode === 'plant' ? PLANT_SKY : HUMAN_SKY;
  const cls = skyMap[newIdx] || '';
  sky.className = cls;

  lastIndex = newIdx;
}

function updateLabels(data, idx) {
  [labelPali, labelEn, labelVi, labelDesc].forEach(el => {
    el.style.opacity = '0';
  });
  stageNum.textContent = String(idx + 1).padStart(2, '0');

  setTimeout(() => {
    labelPali.textContent = data.pali;
    labelEn.textContent = data.en;
    labelVi.textContent = data.vi;
    labelDesc.textContent = data.desc;
    labelDesc.scrollTop = 0;
    [labelPali, labelEn, labelVi, labelDesc].forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.classList.remove('label-flash');
        void el.offsetWidth;
        el.classList.add('label-flash');
      }, i * 60);
    });
  }, 120);
}

/* ─────────────────────────────────────────────────
   SCROLL ENGINE
   ───────────────────────────────────────────────── */
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const maxScroll = scrollSpc.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    const raw = ratio * (totalStages - 1);
    const newIdx = Math.round(raw);

    if (newIdx !== stageIndex) {
      const dir = newIdx > stageIndex ? 1 : -1;
      stageIndex = newIdx;
      showStage(newIdx, dir);
      updateNav();
      if (window.scrollY > 80) scrollHint.classList.add('hidden');
    }
  });
}

/* ─────────────────────────────────────────────────
   JUMP (nav dots, keyboard)
   ───────────────────────────────────────────────── */
function jumpToStage(idx) {
  const maxScroll = scrollSpc.offsetHeight - window.innerHeight;
  const target = (idx / (totalStages - 1)) * maxScroll;
  window.scrollTo({ top: target, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────
   TOGGLE VIEW
   ───────────────────────────────────────────────── */
function switchMode(newMode) {
  // Hide all old stages
  for (let i = 0; i < totalStages; i++) {
    const el = getStageEl(mode, i);
    if (el) el.style.display = 'none';
  }

  // Update view visibility
  document.getElementById('plant-view').classList.toggle('active', newMode === 'plant');
  document.getElementById('human-view').classList.toggle('active', newMode === 'human');

  mode = newMode;
  lastIndex = -1;

  if (newMode === 'plant') {
    toggleLabel.textContent = 'Human';
    toggleIcon.textContent = '🌱';
  } else {
    toggleLabel.textContent = 'Plant';
    toggleIcon.textContent = '🧘';
  }

  // Initialize at current stage
  showStage(stageIndex, 0);
  buildNav();
  updateNav();
}

/* ─────────────────────────────────────────────────
   RESET
   ───────────────────────────────────────────────── */
function resetAll() {
  stageIndex = 0;
  lastIndex = -1;

  // Hide all stages
  for (let i = 0; i < totalStages; i++) {
    const el = getStageEl(mode, i);
    if (el) el.style.display = 'none';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  sky.className = '';
  scrollHint.classList.remove('hidden');

  setTimeout(() => {
    showStage(0, 0);
    updateNav();
  }, 400);
}

/* ─────────────────────────────────────────────────
   KEYBOARD
   ───────────────────────────────────────────────── */
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      jumpToStage(Math.min(stageIndex + 1, totalStages - 1));
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      jumpToStage(Math.max(stageIndex - 1, 0));
    }
    if (e.key === 'r' || e.key === 'R') resetAll();
  });
}

/* ─────────────────────────────────────────────────
   AMBIENT PARTICLES
   ───────────────────────────────────────────────── */
function spawnParticles() {
  const canvas = document.getElementById('canvas');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = 2 + Math.random() * 3;
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${20 + Math.random() * 60}%;
      bottom:${90 + Math.random() * 60}px;
      --pu:${7 + Math.random() * 8}s;
      --pd:${Math.random() * 8}s;
    `;
    canvas.appendChild(p);
  }
}

/* ─────────────────────────────────────────────────
   TOUCH / SWIPE support
   ───────────────────────────────────────────────── */
function initSwipe() {
  let startY = 0;
  document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dy = startY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 40) return;
    if (dy > 0) jumpToStage(Math.min(stageIndex + 1, totalStages - 1));
    else jumpToStage(Math.max(stageIndex - 1, 0));
  }, { passive: true });
}

/* ─────────────────────────────────────────────────
   MOUSE-PARALLAX on character
   ───────────────────────────────────────────────── */
function initParallax() {
  let raf = null;
  document.addEventListener('mousemove', (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const el = document.querySelector('.char-view.active svg');
      if (el) {
        el.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
        el.style.transition = 'transform 0.12s ease-out';
      }
    });
  });
}

/* ─────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildStars();
  buildNav();
  spawnParticles();
  initKeyboard();
  initSwipe();
  initParallax();

  // Show first stage
  showStage(0, 0);

  // Scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Toggle
  btnToggle.addEventListener('click', () => {
    switchMode(mode === 'plant' ? 'human' : 'plant');
  });

  // Reset
  btnReset.addEventListener('click', resetAll);

  // Scroll hint hide
  const hideHint = () => {
    if (window.scrollY > 60) {
      scrollHint.classList.add('hidden');
      window.removeEventListener('scroll', hideHint);
    }
  };
  window.addEventListener('scroll', hideHint, { passive: true });
});