// ============================================================
// TOPICS.JSON APPROACH — CLEAN & SIMPLE
// ============================================================

const BASE_PATH = '/dhamma/';
const MANIFEST_URL = BASE_PATH + 'topics.json';

// State
let topicData = {};
let topicList = [];
let currentTopic = '';
let currentSlideIndex = 0;
let totalSlides = 0;
let allSlides = [];
let isFullscreen = false;
let transitionLock = false;
let editMode = false;
let isInitializing = true;

// DOM refs
const featuredArea = document.getElementById('featuredArea');
const carouselTrack = document.getElementById('carouselTrack');
const counterDisplay = document.getElementById('counterDisplay');
const totalSlidesSpan = document.getElementById('totalSlidesSpan');
const bodyEl = document.body;
const navControls = document.querySelector('.nav-controls');
const slideCounter = document.getElementById('slideCounter');
const carouselSection = document.getElementById('carouselSection');
const topicOverlay = document.getElementById('topicOverlay');
const topicListEl = document.getElementById('topicList');
const topicCloseBtn = document.getElementById('topicCloseBtn');
const topicBtn = document.getElementById('topicBtn');
const firstBtn = document.getElementById('firstBtn');
const prevBtn = document.getElementById('prevBtn');
const linkBtn = document.getElementById('linkBtn');
const nextBtn = document.getElementById('nextBtn');
const lastBtn = document.getElementById('lastBtn');
const currentTopicDisplay = document.getElementById('currentTopicDisplay');

// ========== HELPERS ==========
function isVideoFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext);
}

function isMediaFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext);
}

function getFileUrl(topic, file) {
  return `${BASE_PATH}${topic}/${file}`;
}

function extractBaseName(filename) {
  const match = filename.match(/\d+-(.+)\./);
  return match ? match[1] : null;
}

// ========== URL HANDLING ==========
function getSlideFromURL() {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic');
  const slide = parseInt(params.get('slide'), 10);

  // If no topic param at all, return null (use defaults)
  if (!topic) {
    return null;
  }

  // If topic exists but no slide or invalid slide, default to 1
  if (isNaN(slide) || slide < 1) {
    return { topic: topic, slide: 1 };
  }

  return { topic: topic, slide: slide };
}

function updateURL(topic, slideIndex, replace = false) {
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  params.set('slide', slideIndex + 1);
  const newUrl = new URL(window.location.href);
  newUrl.search = params.toString();

  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

function cleanURL() {
  // If URL has no params or only has slide without topic, clean it up
  const params = new URLSearchParams(window.location.search);
  const hasTopic = params.has('topic');
  const hasSlide = params.has('slide');

  // If no params at all, or only slide without topic, remove all params
  if (!hasTopic || (hasSlide && !hasTopic)) {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.search = '';
    window.history.replaceState({}, '', cleanUrl);
    return true;
  }

  // If topic exists but slide is invalid or missing, add slide=1
  if (hasTopic && !hasSlide) {
    const topic = params.get('topic');
    const newUrl = new URL(window.location.href);
    newUrl.search = `?topic=${topic}&slide=1`;
    window.history.replaceState({}, '', newUrl);
    return true;
  }

  return false;
}

// ========== LOAD TOPICS ==========
async function loadTopics() {
  try {
    const resp = await fetch(MANIFEST_URL);
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const manifest = await resp.json();

    if (typeof manifest !== 'object' || Array.isArray(manifest)) {
      throw new Error('Invalid manifest format');
    }

    topicData = {};
    for (const [key, files] of Object.entries(manifest)) {
      if (Array.isArray(files) && files.length > 0) {
        // Keep files in the order they appear in JSON (no sorting)
        const filtered = files.filter(f => isMediaFile(f));
        if (filtered.length > 0) {
          topicData[key] = filtered;
        }
      }
    }

    if (Object.keys(topicData).length === 0) {
      throw new Error('No valid topics found in manifest');
    }

    topicList = Object.keys(topicData);
    console.log('✅ Loaded topics:', topicList);

  } catch (error) {
    console.error('Failed to load topics.json:', error);
    // Show error message
    featuredArea.innerHTML = `
          <div style="color:#fff;text-align:center;padding:40px;font-size:1.2rem;background:rgba(0,0,0,0.3);border-radius:20px;margin:20px;max-width:600px;margin-left:auto;margin-right:auto;">
            <p style="font-size:2rem;margin-bottom:10px;">⚠️</p>
            <p><strong>Could not load topics.json</strong></p>
            <p style="font-size:0.9rem;margin-top:10px;opacity:0.8;">Make sure the file exists in the root folder.</p>
            <pre style="background:#1a1a2a;padding:12px;border-radius:8px;text-align:left;font-size:0.75rem;margin:15px auto;max-width:320px;overflow-x:auto;color:#d4af37;">
{
  "paticca": ["1-slide.png", "2-slide.mp4"],
  "asubha": ["1-image.jpg", "2-image.png"]
}
            </pre>
          </div>
        `;
    totalSlidesSpan.innerText = '0';
    updateButtonsState();
    return false;
  }

  return true;
}

// ========== BUILD SLIDES ==========
function buildSlidesForTopic(topicName) {
  const files = topicData[topicName] || [];
  if (files.length === 0) {
    featuredArea.innerHTML = `
          <div style="color:#fff;text-align:center;padding:40px;font-size:1.2rem;background:rgba(0,0,0,0.3);border-radius:20px;margin:20px;">
            <p>📁 No slides found in "${topicName}"</p>
            <p style="font-size:0.9rem;margin-top:10px;">Check topics.json for this topic</p>
          </div>
        `;
    carouselTrack.innerHTML = '';
    totalSlides = 0;
    currentSlideIndex = 0;
    totalSlidesSpan.innerText = '0';
    updateCounterDisplay();
    updateButtonsState();
    return;
  }

  allSlides = files.map(f => ({ topic: topicName, file: f }));
  totalSlides = allSlides.length;
  if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;

  // Build featured area
  featuredArea.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (i === currentSlideIndex) slide.classList.add('active');
    const frame = document.createElement('div');
    frame.className = 'image-frame';

    const fileUrl = getFileUrl(topicName, allSlides[i].file);
    const isVideo = isVideoFile(allSlides[i].file);

    if (isVideo) {
      const video = document.createElement('video');
      video.src = fileUrl;
      video.autoplay = false;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.controls = true;
      video.style.maxWidth = '100%';
      video.style.maxHeight = '70vh';
      video.style.width = 'auto';
      video.style.height = 'auto';
      video.style.objectFit = 'contain';
      frame.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = fileUrl;
      img.alt = `${topicName} slide ${i + 1}`;
      img.onerror = function () {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%232a2a3a" width="400" height="300"/%3E%3Ctext x="200" y="150" font-family="sans-serif" font-size="20" fill="%23d4af37" text-anchor="middle" dominant-baseline="middle"%3EMissing%3C/text%3E%3C/svg%3E';
      };
      frame.appendChild(img);
    }
    slide.appendChild(frame);
    featuredArea.appendChild(slide);
  }

  totalSlidesSpan.innerText = totalSlides;
  updateCounterDisplay();
  updateButtonsState();
  updateTopicDisplay();
  buildCarouselForTopic(topicName);
  updateCarouselActive();

  // Update URL with current state
  if (!isInitializing) {
    updateURL(topicName, currentSlideIndex);
  }

  renderTopicList();
}

function buildCarouselForTopic(topicName) {
  carouselTrack.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    if (i === currentSlideIndex) item.classList.add('active');

    const fileUrl = getFileUrl(topicName, allSlides[i].file);
    const isVideo = isVideoFile(allSlides[i].file);

    if (isVideo) {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'video-thumb';
      const video = document.createElement('video');
      video.src = fileUrl;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.addEventListener('loadeddata', function () { this.currentTime = 0.1; });
      video.addEventListener('seeked', function () {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 160;
        canvas.height = video.videoHeight || 90;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        thumbDiv.innerHTML = '';
        thumbDiv.appendChild(img);
        video.pause();
      });
      video.load();
      thumbDiv.appendChild(video);
      item.appendChild(thumbDiv);
    } else {
      const img = document.createElement('img');
      img.src = fileUrl;
      img.alt = `thumb ${i + 1}`;
      img.onerror = function () {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="70"%3E%3Crect fill="%232a2a3a" width="100" height="70"/%3E%3C/svg%3E';
      };
      item.appendChild(img);
    }

    item.addEventListener('click', (function (idx) {
      return function () { if (!isFullscreen && !transitionLock) goToSlide(idx); };
    })(i));
    carouselTrack.appendChild(item);
  }
}

// ========== NAVIGATION ==========
function goToSlide(index, updateUrlParam = true) {
  if (transitionLock || totalSlides === 0) return;
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;
  if (index === currentSlideIndex) return;

  transitionLock = true;
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) { transitionLock = false; return; }

  if (isFullscreen) {
    slides[currentSlideIndex]?.querySelector('.image-frame')?.classList.remove('fullscreen');
  }
  slides[currentSlideIndex]?.classList.remove('active');
  slides[index]?.classList.add('active');
  if (isFullscreen) {
    slides[index]?.querySelector('.image-frame')?.classList.add('fullscreen');
  }

  currentSlideIndex = index;
  updateCounterDisplay();
  updateButtonsState();
  updateCarouselActive();

  if (updateUrlParam && !isInitializing) {
    updateURL(currentTopic, currentSlideIndex);
    // Save to localStorage
    try { localStorage.setItem('dhammaTalkLastSlide', currentSlideIndex); } catch (e) { }
  }

  setTimeout(() => { transitionLock = false; }, 500);
}

function firstSlide() { if (currentSlideIndex !== 0) goToSlide(0); }
function prevSlide() { if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1); }
function nextSlide() { if (currentSlideIndex + 1 < totalSlides) goToSlide(currentSlideIndex + 1); }
function lastSlide() { if (currentSlideIndex !== totalSlides - 1) goToSlide(totalSlides - 1); }

function jumpToLinked() {
  if (totalSlides === 0) return;
  const currentFile = allSlides[currentSlideIndex]?.file || '';
  const base = extractBaseName(currentFile);
  if (!base) return;
  for (let i = 0; i < totalSlides; i++) {
    if (i !== currentSlideIndex && extractBaseName(allSlides[i].file) === base) {
      goToSlide(i);
      return;
    }
  }
}

function switchTopic(topicName) {
  if (topicName === currentTopic) { closeTopicModal(); return; }
  currentTopic = topicName;
  currentSlideIndex = 0;
  updateTopicDisplay();
  buildSlidesForTopic(topicName);
  closeTopicModal();
  try {
    localStorage.setItem('dhammaTopic', topicName);
    localStorage.setItem('dhammaTalkLastSlide', 0);
  } catch (e) { }
  // Update URL immediately after switching
  updateURL(topicName, 0);
}

// ========== UI UPDATES ==========
function updateCounterDisplay() {
  counterDisplay.innerText = totalSlides > 0 ? currentSlideIndex + 1 : 0;
}

function updateButtonsState() {
  firstBtn.disabled = (currentSlideIndex === 0 || totalSlides === 0);
  prevBtn.disabled = (currentSlideIndex === 0 || totalSlides === 0);
  nextBtn.disabled = (currentSlideIndex === totalSlides - 1 || totalSlides === 0);
  lastBtn.disabled = (currentSlideIndex === totalSlides - 1 || totalSlides === 0);

  let hasMatch = false;
  if (totalSlides > 0) {
    const currentFile = allSlides[currentSlideIndex]?.file || '';
    const base = extractBaseName(currentFile);
    if (base) {
      for (let i = 0; i < totalSlides; i++) {
        if (i !== currentSlideIndex && extractBaseName(allSlides[i].file) === base) {
          hasMatch = true;
          break;
        }
      }
    }
  }
  linkBtn.disabled = !hasMatch;
}

function updateCarouselActive() {
  const items = document.querySelectorAll('.carousel-item');
  items.forEach((item, idx) => {
    if (idx === currentSlideIndex) item.classList.add('active');
    else item.classList.remove('active');
  });
  const activeItem = items[currentSlideIndex];
  if (activeItem && !isFullscreen) {
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// ========== TOPIC MODAL ==========
function renderTopicList() {
  topicListEl.innerHTML = '';
  if (topicList.length === 0) {
    topicListEl.innerHTML = `
          <div class="topic-empty">
            <p>📂 No topics loaded</p>
            <p style="font-size:0.8rem;margin-top:8px;">Check topics.json</p>
          </div>
        `;
    return;
  }
  topicList.forEach(name => {
    const div = document.createElement('div');
    div.className = 'topic-item' + (name === currentTopic ? ' active' : '');
    const count = topicData[name]?.length || 0;
    div.innerHTML = `<span>📁 ${name}</span><span class="badge">${count}</span>`;
    div.addEventListener('click', () => switchTopic(name));
    topicListEl.appendChild(div);
  });
}

function openTopicModal() {
  renderTopicList();
  topicOverlay.classList.add('open');
}

function closeTopicModal() {
  topicOverlay.classList.remove('open');
}

// ========== FULLSCREEN ==========
function toggleFullscreen() {
  const slides = document.querySelectorAll('.slide');
  const activeSlide = slides[currentSlideIndex];
  const imageFrame = activeSlide?.querySelector('.image-frame');
  isFullscreen = !isFullscreen;
  if (isFullscreen) {
    bodyEl.classList.add('fullscreen-bg');
    if (imageFrame) imageFrame.classList.add('fullscreen');
    navControls.classList.add('hidden');
    slideCounter.classList.add('hidden');
    carouselSection.classList.add('hidden');
  } else {
    bodyEl.classList.remove('fullscreen-bg');
    if (imageFrame) imageFrame.classList.remove('fullscreen');
    navControls.classList.remove('hidden');
    slideCounter.classList.remove('hidden');
    carouselSection.classList.remove('hidden');
  }
}

// ========== COUNTER EDIT ==========
function initTypeableCounter() {
  const parent = document.getElementById('slideCounter');
  const displaySpan = counterDisplay;
  displaySpan.addEventListener('click', (e) => {
    if (editMode || isFullscreen || totalSlides === 0) return;
    e.stopPropagation();
    editMode = true;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'counter-input';
    input.value = currentSlideIndex + 1;
    input.min = 1;
    input.max = totalSlides;
    input.step = 1;
    parent.replaceChild(input, displaySpan);
    input.focus();
    input.select();

    function commit() {
      if (!editMode) return;
      let val = parseInt(input.value, 10);
      if (isNaN(val)) val = currentSlideIndex + 1;
      val = Math.max(1, Math.min(totalSlides, val));
      const newIndex = val - 1;
      parent.replaceChild(displaySpan, input);
      editMode = false;
      if (newIndex !== currentSlideIndex) goToSlide(newIndex);
      else updateCounterDisplay();
    }
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        parent.replaceChild(displaySpan, input);
        editMode = false;
        updateCounterDisplay();
      }
    });
  });
}

// ========== KEYBOARD ==========
function handleKeydown(e) {
  if (transitionLock || editMode) return;
  if (topicOverlay.classList.contains('open')) {
    if (e.key === 'Escape') { closeTopicModal(); return; }
    return;
  }
  if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleFullscreen();
    return;
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    firstSlide();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    lastSlide();
  } else if (e.key === ' ' || e.key === 'Space') {
    if (!linkBtn.disabled) {
      e.preventDefault();
      jumpToLinked();
    }
  }
}

// ========== POPSTATE HANDLER ==========
function handlePopState() {
  const urlData = getSlideFromURL();

  // If no URL params or invalid, don't do anything (stay on current)
  if (!urlData) {
    return;
  }

  const { topic, slide } = urlData;

  // Check if the topic exists
  if (topic && topicData[topic]) {
    const slideIndex = Math.min(slide - 1, topicData[topic].length - 1);
    const validSlide = Math.max(0, slideIndex);

    if (topic !== currentTopic) {
      // Switching topics
      currentTopic = topic;
      currentSlideIndex = validSlide;
      buildSlidesForTopic(topic);
      // Don't update URL again (it's already in the popstate)
    } else {
      // Same topic, different slide
      if (validSlide !== currentSlideIndex) {
        goToSlide(validSlide, false);
      }
    }
  }
}

// ========== UPDATE TOPIC DISPLAY ==========
function updateTopicDisplay() {
  if (currentTopicDisplay) {
    currentTopicDisplay.textContent = currentTopic || 'Topics';
  }
}

// ========== DOUBLE-CLICK FULLSCREEN FOR MOBILE ==========
function initDoubleClickFullscreen() {
  const featuredArea = document.getElementById('featuredArea');

  if (featuredArea) {
    featuredArea.addEventListener('dblclick', function (e) {
      // Only trigger on mobile (768px and below)
      if (window.innerWidth <= 768) {
        toggleFullscreen();
      }
    });
  }
}

// ========== INIT ==========
async function init() {
  // Show loading
  featuredArea.innerHTML = `
        <div style="color:#fff;text-align:center;padding:40px;font-size:1.2rem;">
          <div class="loading-spinner">📂 Loading topics.json...</div>
        </div>
      `;

  const loaded = await loadTopics();
  if (!loaded) return;

  // Clean up URL if needed
  const urlCleaned = cleanURL();

  // Get slide info from URL (after cleaning)
  const urlData = getSlideFromURL();

  let startTopic = '';
  let startSlide = 0;

  if (urlData) {
    // We have valid URL params
    startTopic = urlData.topic;
    startSlide = urlData.slide - 1; // 0-indexed

    // Validate
    if (!topicData[startTopic]) {
      // Topic doesn't exist, fallback
      startTopic = topicList[0];
      startSlide = 0;
    } else {
      // Ensure slide is within bounds
      const maxSlide = topicData[startTopic].length - 1;
      startSlide = Math.min(startSlide, maxSlide);
      startSlide = Math.max(0, startSlide);
    }
  } else {
    // No URL params or invalid, use localStorage or defaults
    try {
      const savedTopic = localStorage.getItem('dhammaTopic');
      const savedSlide = parseInt(localStorage.getItem('dhammaTalkLastSlide'), 10);

      if (savedTopic && topicData[savedTopic]) {
        startTopic = savedTopic;
        startSlide = !isNaN(savedSlide) && savedSlide >= 0 ? savedSlide : 0;

        // Ensure slide is within bounds
        const maxSlide = topicData[startTopic].length - 1;
        startSlide = Math.min(startSlide, maxSlide);
        startSlide = Math.max(0, startSlide);
      } else {
        startTopic = topicList[0];
        startSlide = 0;
      }
    } catch (e) {
      startTopic = topicList[0];
      startSlide = 0;
    }

    // Update URL with defaults
    isInitializing = false;
    updateURL(startTopic, startSlide, true);
    isInitializing = true;
  }

  currentTopic = startTopic;
  currentSlideIndex = startSlide;

  // Update the topic display button
  updateTopicDisplay();

  // Build slides
  buildSlidesForTopic(currentTopic);

  // Now mark initialization as complete
  isInitializing = false;

  // Ensure URL is correct after building
  updateURL(currentTopic, currentSlideIndex, true);

  initTypeableCounter();
  updateButtonsState();
  updateCarouselActive();

  // Event listeners
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('popstate', handlePopState);

  topicBtn.addEventListener('click', openTopicModal);
  topicCloseBtn.addEventListener('click', closeTopicModal);
  topicOverlay.addEventListener('click', (e) => {
    if (e.target === topicOverlay) closeTopicModal();
  });

  firstBtn.addEventListener('click', firstSlide);
  prevBtn.addEventListener('click', prevSlide);
  linkBtn.addEventListener('click', jumpToLinked);
  nextBtn.addEventListener('click', nextSlide);
  lastBtn.addEventListener('click', lastSlide);

  // Initialize double-click fullscreen for mobile
  initDoubleClickFullscreen();

  console.log(`📚 Loaded ${topicList.length} topics:`, topicList);
  console.log(`📄 Current: ${currentTopic} (${totalSlides} slides), slide: ${currentSlideIndex + 1}`);
}

init();