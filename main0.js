/* ═══════════════════════════════════════════════
   Paṭicca-Samuppāda — Dependent Origination
   main.js  —  all text + interaction logic
   ═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   TEXT CONTENT — edit here as needed
   ───────────────────────────────────────────── */

const PLANT_DESCRIPTIONS = [
  // Stage 0 — Avijjā · Taṇhā · Saṅkhāra
  `The dark, moist soil holds three hidden forces that drive all existence.
  Avijjā (Vô Minh) — ignorance of the true nature of reality — is the ground itself.
  Taṇhā (Ái) — craving and thirst — is the water saturating the soil, the nutrient that feeds becoming.
  Saṅkhāra / Kamma (Hành / Nghiệp) — volitional formations — is the seed waiting within.
  Without soil and water, the seed cannot sprout. The entire cycle rests on these three roots.
  The practice of the Noble Path aims to dry up Taṇhā and illuminate Avijjā, so no new seed can germinate.`,

  // Stage 1 — Viññāṇa
  `From the fertile conditions of ignorance and craving, a sprout breaks through: Viññāṇa (Thức) — Consciousness.
  Just as a seed needs soil and water to germinate, consciousness arises dependent on the conditions of past kamma, craving, and ignorance.
  This is not a permanent self or soul, but a stream of awareness — moment to moment, conditioned and conditioning.
  It is the first flicker of a new life, fragile and green, already reaching toward the light.`,

  // Stage 2 — Nāma-Rūpa
  `The sprout divides into two shoots: Nāma (Danh) and Rūpa (Sắc) — Mind and Matter.
  Rūpa is the physical form: the body, the material substrate.
  Nāma is the mental cluster: feeling (vedanā), perception (saññā), volition (cetanā), attention (manasikāra), and contact (phassa).
  Neither can exist without the other. Body needs mind to be alive; mind needs body to experience.
  Together they constitute the psycho-physical being — the "person" that will develop senses, feel the world, and generate more kamma.`,

  // Stage 3 — Saḷāyatana
  `Six branches extend from the plant: Saḷāyatana (Sáu Xứ) — the Six Sense Bases.
  Eye (cakkhu), Ear (sota), Nose (ghāna), Tongue (jivhā), Body (kāya), and Mind (mano).
  These are the six gates through which experience enters. They develop from nāma-rūpa just as branches grow from a young stem.
  Without these sense bases, no contact with the world is possible. They are the plant's reach toward sunlight, water, and air — the apparatus of experience.`,

  // Stage 4 — Phassa
  `A bud forms where branch meets world: Phassa (Xúc) — Contact.
  Contact arises when three things meet: a sense organ, its object, and the corresponding consciousness.
  Eye + visible form + eye-consciousness = contact. Ear + sound + ear-consciousness = contact.
  This is the meeting point — neither purely inside nor outside. The bud is not yet open; experience has not yet bloomed into feeling.
  Contact is the hinge between the inner and outer worlds. Everything that follows depends on this meeting.`,

  // Stage 5 — Vedanā
  `The bud blooms into a flower: Vedanā (Thọ) — Feeling / Sensation.
  Every contact gives rise to one of three feeling tones: pleasant (sukha), unpleasant (dukkha), or neutral (adukkhamasukha).
  The flower in full bloom — beautiful, complete, present. This is the pivot point of the entire cycle.
  With clear mindfulness here, the chain can be broken. If pleasant feeling is met with awareness rather than craving, if unpleasant feeling is met with equanimity rather than aversion, the cycle loses its momentum.
  Vedanā is where liberation is most accessible — right here, in the texture of experience.`,

  // Stage 6 — Taṇhā
  `An unripe fruit forms — green and grasping: Taṇhā (Ái) — Craving.
  Arising from vedanā, craving takes three forms: kāma-taṇhā (craving for sensual pleasure), bhava-taṇhā (craving for existence), and vibhava-taṇhā (craving for non-existence / annihilation).
  Like a young fruit that draws the plant's energy toward itself, craving pulls the mind toward its objects, distorting perception and generating new kamma.
  Notice: Taṇhā appears twice in the cycle — as a nutrient in the soil (stage 1) and as this young fruit. Craving both begins and perpetuates the cycle.`,

  // Stage 7 — Upādāna
  `The fruit ripens into full maturity: Upādāna (Thủ) — Clinging / Attachment.
  From craving ripens clinging. Four types: clinging to sensual pleasures (kāmupādāna), to views (diṭṭhupādāna), to rites and rituals (sīlabbatupādāna), and to a doctrine of self (attavādupādāna).
  The ripe fruit is heavy on the branch, drawing everything toward it. Clinging is craving intensified and solidified — it is what makes craving into kamma.
  Where taṇhā is the reach, upādāna is the grip. This is the tightening that makes liberation feel impossible — and yet, even here, investigation can loosen the hold.`,

  // Stage 8 — Bhava
  `Inside the ripe fruit lies a seed: Bhava (Hữu) — Becoming / Existence.
  From clinging arises becoming — the process of kamma actively shaping the conditions for a new existence.
  Three realms of becoming: sensual existence (kāma-bhava), form existence (rūpa-bhava), and formless existence (arūpa-bhava).
  The seed inside the fruit is the future already forming, encoded in the present moment's intentions and actions.
  Bhava is not yet a new life — it is the momentum, the gravitational pull toward the next birth.`,

  // Stage 9 — Jāti · Jarā-Maraṇa
  `The fruit falls. The seed drops into the soil. A new cycle begins.
  Jāti (Sinh) — Birth: arising into a new existence, a new set of conditions, a new body-mind.
  Jarā-Maraṇa (Lão Tử) — Aging and Death: the inevitable decay and dissolution of whatever was born.
  With birth come: grief (soka), lamentation (parideva), pain (dukkha), mental suffering (domanassa), and despair (upāyāsa).
  This is the full weight of saṃsāra — the wheel that turns only because of ignorance and craving at its hub.
  May all beings find the path to its cessation. ↻`
];

const HUMAN_DESCRIPTIONS = [
  // H0 — Avijjā · Taṇhā · Saṅkhāra
  `Before conception, three forces gather like clouds before rain.
  Avijjā (Vô Minh) — fundamental ignorance of the Three Characteristics (impermanence, suffering, not-self).
  Taṇhā (Ái) — the deep thirst for existence, for pleasure, for continuity of self.
  Saṅkhāra / Kamma (Hành / Nghiệp) — the accumulated volitional actions of past lives, ripening seeds waiting to find new soil.
  These three are the proximate conditions for a new human life. Without them, no rebirth consciousness can arise.`,

  // H1 — Paṭisandhi · Viññāṇa
  `At the moment of conception, paṭisandhi-citta (Kiết Sinh Thức) arises — the relinking consciousness.
  This is Viññāṇa (Thức) performing its function of connecting the previous life to the new one.
  It is conditioned by the last kamma, death-proximate kamma, or habitual kamma of the dying being.
  In the Theravāda understanding, this is not a soul transmigrating — it is a flame lighting another flame.
  The continuity is causal, not substantial. A new life has begun, already shaped by everything that came before.`,

  // H2 — Nāma-Rūpa
  `In the womb, Nāma-Rūpa (Danh Sắc) develops — the psycho-physical organism takes shape.
  Rūpa (Sắc): the physical body forms, nourished by the mother's body, governed by the element of nutrition (ojā).
  Nāma (Danh): the mental factors — feeling, perception, volition, contact, attention — arise together with consciousness.
  Mind and matter condition each other in a mutually dependent dance. The body shapes what the mind can experience; the mind directs how the body develops.
  The fetus is already a full being of nāma-rūpa, even before birth.`,

  // H3 — Saḷāyatana
  `The six sense organs form and mature: Saḷāyatana (Sáu Căn).
  Eyes, ears, nose, tongue, body, and the mind-base (manāyatana) — the seat of mental cognition.
  In the womb, these develop gradually. The mind-base is present from conception; the physical senses mature through the weeks and months.
  These are the "internal bases" (ajjhattika āyatana). Their corresponding "external bases" — sights, sounds, smells, etc. — are the world waiting to be met.
  The organism is now fully equipped for experience.`,

  // H4 — Phassa
  `Birth: the child enters the world and Phassa (Xúc) — Contact — begins in full.
  The first breath, the first sound, the first sensation of cold air and light — these are the first contacts of a new life.
  Every moment thereafter is a stream of contacts: sense organ meeting sense object, giving rise to sense consciousness, the three together constituting phassa.
  Contact is not merely physical touch — it is the meeting of inner and outer at every sense door, the constant bridge between organism and world.
  A newborn is already fully immersed in the flow of experience.`,

  // H5 — Vedanā
  `The child grows and lives in a constant stream of Vedanā (Thọ) — feeling tones.
  Every contact — a smile, a cry, a taste of food, a lullaby — carries a feeling tone: pleasant, unpleasant, or neutral.
  Pleasant feelings naturally pull the mind toward them; unpleasant feelings push the mind away. Neutral feelings tend to be overlooked.
  This is the crossroads of liberation. The Buddha taught that one who remains mindful at the level of vedanā can interrupt the chain — feeling need not become craving.
  Without that mindfulness, pleasant vedanā ripens into taṇhā, and the wheel turns.`,

  // H6 — Taṇhā
  `The young person grows and Taṇhā (Ái) — Craving — takes hold.
  Craving for sensual pleasures: beautiful sights, pleasing sounds, attractive people, delicious food.
  Craving for existence: the desire to continue, to become more, to achieve, to be someone.
  Craving for non-existence: the wish to escape, to disappear, to destroy what is painful.
  These three cravings arise from pleasant, neutral, and unpleasant feelings respectively.
  Like fire, craving is never satisfied — it feeds on experience and grows. The flames of desire drive all the actions of adult life.`,

  // H7 — Upādāna
  `Craving solidifies into Upādāna (Thủ) — Clinging / Attachment.
  We cling to what we love, to our beliefs and worldviews, to rituals and practices we believe will save us, and most fundamentally — to the idea of a permanent self.
  Upādāna turns the reach of taṇhā into the grip of possession. "This is mine. This is me. This is my self."
  The chains bind tightly: to possessions, to relationships, to status, to identity.
  And yet — what is held will change. What is grasped will slip away. The chains of attachment are also the source of all grief.`,

  // H8 — Bhava
  `Through clinging, a person becomes — Bhava (Hữu): Becoming / Kamma-Making.
  Every intentional action, word, and thought is kamma. Through bhava, one actively creates the conditions for future existence.
  Meritorious kamma, demeritorious kamma, and imperturbable kamma (jhāna-based) — all are generated here.
  Like seeds scattered into the future, these actions carry the imprint of intention (cetanā) and will bear fruit in accordance with their nature.
  The mature human being is, at every moment, planting the garden of the next life.`,

  // H9 — Jāti · Jarā-Maraṇa
  `Old age comes. Death approaches. Jāti (Sinh) · Jarā-Maraṇa (Lão Tử).
  Whatever was born must age. Whatever has arisen must cease. This is the nature of conditioned existence.
  At the moment of death, the last kamma, death-proximate kamma, or habitual kamma presents itself to the dying mind.
  If the conditions of avijjā and taṇhā persist — if ignorance and craving have not been uprooted — then a new paṭisandhi-citta arises, and the cycle begins again.
  Liberation is possible. The cessation of avijjā through the Noble Eightfold Path brings the cessation of taṇhā, and with it, the end of birth, aging, and death. ↻`
];

/* ─────────────────────────────────────────────
   STAR GENERATION
   ───────────────────────────────────────────── */
function generateStars() {
  const wrap = document.getElementById('stars-wrap');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      top:${Math.random() * 70}%;
      left:${Math.random() * 100}%;
      --dur:${2 + Math.random() * 4}s;
      --delay:${Math.random() * 4}s;
      opacity:${0.2 + Math.random() * 0.6};
      width:${1 + Math.random() * 2}px;
      height:${1 + Math.random() * 2}px;
    `;
    wrap.appendChild(s);
  }
}

/* ─────────────────────────────────────────────
   INJECT DESCRIPTIONS
   ───────────────────────────────────────────── */
function injectDescriptions() {
  PLANT_DESCRIPTIONS.forEach((text, i) => {
    const el = document.getElementById(`plant-${i}-desc`);
    if (el) el.textContent = text;
  });
  HUMAN_DESCRIPTIONS.forEach((text, i) => {
    const el = document.getElementById(`human-${i}-desc`);
    if (el) el.textContent = text;
  });
}

/* ─────────────────────────────────────────────
   NAV DOTS
   ───────────────────────────────────────────── */
function buildNavDots(view) {
  const container = document.getElementById('nav-dots');
  container.innerHTML = '';
  const count = 10;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Stage ${i + 1}`);
    dot.addEventListener('click', () => scrollToStage(view, i));
    container.appendChild(dot);
  }
}

function updateNavDots(index) {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

/* ─────────────────────────────────────────────
   SCROLL / INTERSECTION OBSERVER
   ───────────────────────────────────────────── */
let currentView = 'plant';
let observers = [];
let activeStageIndex = -1;

function getStages(view) {
  return document.querySelectorAll(`#view-${view} .stage`);
}

function scrollToStage(view, index) {
  const stages = getStages(view);
  if (stages[index]) {
    stages[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function setupObserver(view) {
  // Clear previous observers
  observers.forEach(obs => obs.disconnect());
  observers = [];

  const stages = getStages(view);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const idx = parseInt(entry.target.getAttribute('data-index'), 10);
        activeStageIndex = idx;
        updateNavDots(idx);
        updateSky(idx);
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -10% 0px'
  });

  stages.forEach(stage => {
    stage.classList.remove('visible');
    observer.observe(stage);
  });

  observers.push(observer);
}

/* ─────────────────────────────────────────────
   SKY TRANSITIONS (day/night/dawn by stage)
   ───────────────────────────────────────────── */
function updateSky(stageIndex) {
  const sky = document.getElementById('sky-layer');
  sky.classList.remove('dawn', 'day');
  if (stageIndex >= 4 && stageIndex <= 6) {
    sky.classList.add('dawn');
  } else if (stageIndex >= 7) {
    sky.classList.add('day');
  }
}

/* ─────────────────────────────────────────────
   VIEW TOGGLE (Plant ↔ Human)
   ───────────────────────────────────────────── */
function switchView(newView) {
  currentView = newView;

  // Show/hide views
  document.getElementById('view-plant').classList.toggle('active', newView === 'plant');
  document.getElementById('view-human').classList.toggle('active', newView === 'human');

  // Update button label
  const label = document.getElementById('toggle-label');
  const icon = document.querySelector('.toggle-icon');
  if (newView === 'plant') {
    label.textContent = 'Switch to Human';
    icon.textContent = '🌱';
  } else {
    label.textContent = 'Switch to Plant';
    icon.textContent = '🧘';
  }

  // Rebuild nav dots and observers
  buildNavDots(newView);
  setupObserver(newView);

  // Scroll to top of main
  document.getElementById('scroll-main').scrollTo({ top: 0 });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  updateSky(0);
}

/* ─────────────────────────────────────────────
   RESET
   ───────────────────────────────────────────── */
function resetAnimation() {
  // Remove visible from all stages in current view
  getStages(currentView).forEach(stage => {
    stage.classList.remove('visible');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateSky(0);
  updateNavDots(0);

  // Re-observe after a beat so the first stage can re-trigger
  setTimeout(() => {
    setupObserver(currentView);
  }, 600);
}

/* ─────────────────────────────────────────────
   SCROLL HINT
   ───────────────────────────────────────────── */
function initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  const onScroll = () => {
    if (window.scrollY > 80) {
      hint.classList.add('hidden');
      window.removeEventListener('scroll', onScroll);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─────────────────────────────────────────────
   3D TILT on mouse move (subtle, for scene-3d)
   ───────────────────────────────────────────── */
function initTilt() {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;

    document.querySelectorAll(`#view-${currentView} .stage.visible .soil-block,
      #view-${currentView} .stage.visible .sprout-obj,
      #view-${currentView} .stage.visible .two-shoots-obj,
      #view-${currentView} .stage.visible .salayatana-obj,
      #view-${currentView} .stage.visible .phassa-plant,
      #view-${currentView} .stage.visible .flower-plant,
      #view-${currentView} .stage.visible .fruit-plant,
      #view-${currentView} .stage.visible .bhava-plant,
      #view-${currentView} .stage.visible .womb-obj,
      #view-${currentView} .stage.visible .fetus-obj,
      #view-${currentView} .stage.visible .baby-sense-obj,
      #view-${currentView} .stage.visible .birth-scene,
      #view-${currentView} .stage.visible .child-obj,
      #view-${currentView} .stage.visible .young-adult-obj,
      #view-${currentView} .stage.visible .adult-obj,
      #view-${currentView} .stage.visible .mature-human-obj,
      #view-${currentView} .stage.visible .elderly-obj`).forEach(el => {
      el.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
    });
  });
}

/* ─────────────────────────────────────────────
   KEYBOARD NAVIGATION
   ───────────────────────────────────────────── */
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    const stages = getStages(currentView);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      const next = Math.min(activeStageIndex + 1, stages.length - 1);
      scrollToStage(currentView, next);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      const prev = Math.max(activeStageIndex - 1, 0);
      scrollToStage(currentView, prev);
    }
  });
}

/* ─────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  injectDescriptions();
  buildNavDots('plant');
  setupObserver('plant');
  initScrollHint();
  initTilt();
  initKeyboard();

  // Toggle button
  document.getElementById('btn-toggle').addEventListener('click', () => {
    switchView(currentView === 'plant' ? 'human' : 'plant');
  });

  // Reset button
  document.getElementById('btn-reset').addEventListener('click', resetAnimation);

  // Trigger first stage visibility after a short delay (hero moment)
  setTimeout(() => {
    const firstStage = document.querySelector(`#view-plant .stage`);
    if (firstStage) firstStage.classList.add('visible');
    updateNavDots(0);
  }, 400);
});