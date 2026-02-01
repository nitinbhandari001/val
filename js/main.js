/**
 * ============================================
 * VALENTINE'S DAY WEBSITE - MAIN LOGIC
 * ============================================
 * 
 * For my Flappy bird, Nainika 💕🐦
 * 
 * FIXED:
 * - No button is now easily clickable
 * - Button movement happens AFTER click, not before
 * - Button always stays within screen boundaries
 * - Creative removal after max clicks
 */

// ==========================================
// STATE MANAGEMENT
// ==========================================

const State = {
  noClickCount: 0,
  isMoving: false,
  lastCursorPosition: { x: 0, y: 0 },
  heartsInterval: null,
  audioPlaying: false,
  isMobile: false,
  noButtonRemoved: false,
  maxNoClicks: 15, // After this, No button will be removed
  
  reset() {
    this.noClickCount = 0;
    this.isMoving = false;
    this.noButtonRemoved = false;
  }
};

// ==========================================
// DOM ELEMENTS
// ==========================================

let Elements = {};

function cacheElements() {
  Elements = {
    gifDisplay: Utils.$('#gifDisplay'),
    questionText: Utils.$('#questionText'),
    yesButton: Utils.$('#yesButton'),
    noButton: Utils.$('#noButton'),
    buttonContainer: Utils.$('.button-container'),
    audioToggle: Utils.$('#audioToggle'),
    backgroundMusic: Utils.$('#backgroundMusic'),
    mainContent: Utils.$('.main-content')
  };
  
  Utils.log('DOM elements cached');
}

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
  Utils.log('Initializing Valentine page for Flappy bird 🐦💕');
  
  cacheElements();
  
  State.isMobile = Utils.isMobile();
  Utils.log(`Device type: ${State.isMobile ? 'Mobile' : 'Desktop'}`);
  
  setupEventListeners();
  loadGif(0);
  
  if (CONFIG.animations.floatingHearts.enabled) {
    startFloatingHearts();
  }
  
  setupAudio();
  
  Utils.log('Valentine page initialized successfully!');
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
  // Yes button click
  if (Elements.yesButton) {
    Elements.yesButton.addEventListener('click', handleYesClick);
  }
  
  // No button click - CLICK triggers everything, not hover
  if (Elements.noButton) {
    Elements.noButton.addEventListener('click', handleNoClick);
    
    // Desktop: Only move on HOVER, but keep it clickable!
    // Movement is subtle and happens AFTER a small delay
    if (!State.isMobile && CONFIG.buttons.noButtonMovement.enabled) {
      // Use mouseenter with a delay so user can still click
      Elements.noButton.addEventListener('mouseenter', handleNoButtonHover);
    }
  }
  
  // Audio toggle
  if (Elements.audioToggle) {
    Elements.audioToggle.addEventListener('click', toggleAudio);
  }
  
  // Window resize - recalculate safe zones
  window.addEventListener('resize', handleResize);
}

function handleResize() {
  State.isMobile = Utils.isMobile();
  
  // If button is outside viewport after resize, bring it back
  if (Elements.noButton && Elements.noButton.classList.contains('moving')) {
    ensureButtonInViewport();
  }
}

// ==========================================
// NO BUTTON HANDLERS (FIXED!)
// ==========================================

/**
 * Handle "No" button click
 * This is the MAIN handler - always triggers changes
 */
function handleNoClick(e) {
  // Prevent any default behavior
  e.preventDefault();
  e.stopPropagation();
  
  State.noClickCount++;
  Utils.log(`No clicked! Count: ${State.noClickCount}`);
  
  // Check if we've reached max clicks
  if (State.noClickCount >= State.maxNoClicks) {
    removeNoButtonCreatively();
    return;
  }
  
  // 1. Update button text
  updateNoButtonText();
  
  // 2. Update GIF
  updateGif();
  
  // 3. Grow Yes button
  growYesButton();
  
  // 4. Move No button AFTER click (desktop only)
  if (!State.isMobile && CONFIG.buttons.noButtonMovement.enabled) {
    // Small delay so user sees the click registered
    setTimeout(() => {
      moveNoButton();
    }, 100);
  }
  
  // 5. Pulse Yes button
  pulseYesButton();
}

/**
 * Handle mouse hover on No button
 * Only moves after a delay, giving user time to click
 */
function handleNoButtonHover(e) {
  if (State.isMobile || !CONFIG.buttons.noButtonMovement.enabled) return;
  if (State.isMoving || State.noButtonRemoved) return;
  
  // Only move after several clicks (make it progressively harder)
  if (State.noClickCount < 3) {
    // First few clicks - don't move on hover, only on click
    return;
  }
  
  // After 3 clicks, start moving on hover but with delay
  const delay = Math.max(300 - (State.noClickCount * 20), 100);
  
  setTimeout(() => {
    // Check if mouse is still over button
    if (Elements.noButton.matches(':hover') && !State.isMoving) {
      moveNoButton();
    }
  }, delay);
}

/**
 * Update "No" button text based on click count
 */
function updateNoButtonText() {
  const messages = CONFIG.noButtonMessages;
  const index = Math.min(State.noClickCount, messages.length - 1);
  
  if (Elements.noButton) {
    Elements.noButton.textContent = messages[index];
    Utils.log(`Button text: ${messages[index]}`);
  }
}

/**
 * Move "No" button to a safe position within viewport
 * FIXED: Always stays within screen boundaries - NO SCROLLING
 */
function moveNoButton() {
  if (State.isMoving || !Elements.noButton || State.noButtonRemoved) return;
  
  State.isMoving = true;
  
  const settings = CONFIG.buttons.noButtonMovement;
  const button = Elements.noButton;
  
  // Get ACTUAL button dimensions after any text changes
  const buttonRect = button.getBoundingClientRect();
  const buttonWidth = Math.max(buttonRect.width, 100);
  const buttonHeight = Math.max(buttonRect.height, 50);
  
  // CRITICAL FIX: Use document.documentElement for true viewport
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  
  // STRICT boundaries to prevent ANY scrolling
  // Use generous margins to keep button well within viewport
  const marginX = 40;
  const marginTop = 80; // Space for audio button and GIF
  const marginBottom = 40;
  
  // Calculate absolute safe bounds
  const minX = marginX;
  const maxX = viewportWidth - buttonWidth - marginX;
  const minY = marginTop;
  const maxY = viewportHeight - buttonHeight - marginBottom;
  
  // CRITICAL: Verify bounds are valid
  if (maxX <= minX || maxY <= minY) {
    Utils.log('Viewport too small for button movement - keeping button in place');
    State.isMoving = false;
    return;
  }
  
  // Get Yes button position to avoid overlap
  let yesButtonRect = { left: 0, right: 0, top: 0, bottom: 0 };
  if (Elements.yesButton) {
    yesButtonRect = Elements.yesButton.getBoundingClientRect();
  }
  
  // Generate random position within STRICT safe bounds
  let attempts = 0;
  let newX, newY;
  const safeZone = 50; // Distance to keep from Yes button
  
  do {
    // Generate within valid range
    newX = minX + Math.random() * (maxX - minX);
    newY = minY + Math.random() * (maxY - minY);
    attempts++;
    
    // Check if overlapping with Yes button
    const overlapsYes = (
      newX < yesButtonRect.right + safeZone &&
      newX + buttonWidth > yesButtonRect.left - safeZone &&
      newY < yesButtonRect.bottom + safeZone &&
      newY + buttonHeight > yesButtonRect.top - safeZone
    );
    
    if (!overlapsYes || attempts > 20) break;
  } while (attempts < 20);
  
  // CRITICAL FINAL CLAMP: Absolutely ensure position is within viewport
  // This is the failsafe that prevents off-screen positioning
  newX = Math.max(minX, Math.min(maxX, newX));
  newY = Math.max(minY, Math.min(maxY, newY));
  
  // Round to prevent subpixel rendering issues
  newX = Math.round(newX);
  newY = Math.round(newY);
  
  // FINAL VERIFICATION: Check that button will be fully visible
  if (newX + buttonWidth > viewportWidth - marginX) {
    newX = viewportWidth - buttonWidth - marginX;
  }
  if (newY + buttonHeight > viewportHeight - marginBottom) {
    newY = viewportHeight - buttonHeight - marginBottom;
  }
  
  // Apply position with fixed positioning
  button.classList.add('moving');
  button.style.position = 'fixed';
  button.style.transition = `left ${settings.transitionDuration}ms ${settings.transitionEasing}, 
                              top ${settings.transitionDuration}ms ${settings.transitionEasing}`;
  button.style.left = `${newX}px`;
  button.style.top = `${newY}px`;
  button.style.zIndex = '1000';
  
  // Enhanced logging for debugging
  Utils.log(`Button moved to: (${newX}, ${newY})`);
  Utils.log(`Viewport: ${viewportWidth}x${viewportHeight}, Button: ${buttonWidth}x${buttonHeight}`);
  Utils.log(`Safe range: X(${minX}-${maxX}), Y(${minY}-${maxY})`);
  Utils.log(`Button will be at: right=${newX + buttonWidth}, bottom=${newY + buttonHeight}`);
  
  // Verify position is safe
  if (newX + buttonWidth > viewportWidth || newY + buttonHeight > viewportHeight) {
    Utils.logError('WARNING: Button may be off-screen!');
  }
  
  // Reset moving flag
  setTimeout(() => {
    State.isMoving = false;
  }, settings.transitionDuration + 50);
}

/**
 * Ensure button is within viewport (called on resize)
 * STRICT boundary checking to prevent scrolling
 */
function ensureButtonInViewport() {
  if (!Elements.noButton || State.noButtonRemoved) return;
  if (!Elements.noButton.classList.contains('moving')) return;
  
  const button = Elements.noButton;
  const rect = button.getBoundingClientRect();
  
  // CRITICAL: Use document.documentElement for accurate viewport
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  
  // Margins
  const marginX = 40;
  const marginTop = 80;
  const marginBottom = 40;
  
  let needsMove = false;
  let newX = rect.left;
  let newY = rect.top;
  
  // Check left boundary
  if (rect.left < marginX) {
    newX = marginX;
    needsMove = true;
  }
  
  // Check right boundary
  if (rect.right > viewportWidth - marginX) {
    newX = viewportWidth - rect.width - marginX;
    needsMove = true;
  }
  
  // Check top boundary
  if (rect.top < marginTop) {
    newY = marginTop;
    needsMove = true;
  }
  
  // Check bottom boundary
  if (rect.bottom > viewportHeight - marginBottom) {
    newY = viewportHeight - rect.height - marginBottom;
    needsMove = true;
  }
  
  if (needsMove) {
    // Calculate safe bounds for clamping
    const minX = marginX;
    const maxX = viewportWidth - rect.width - marginX;
    const minY = marginTop;
    const maxY = viewportHeight - rect.height - marginBottom;
    
    // CRITICAL: Clamp and round values
    newX = Math.max(minX, Math.min(maxX, Math.round(newX)));
    newY = Math.max(minY, Math.min(maxY, Math.round(newY)));
    
    button.style.transition = 'left 0.2s ease, top 0.2s ease';
    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;
    
    Utils.log(`Button repositioned to: (${newX}, ${newY}) after resize`);
    Utils.log(`New viewport: ${viewportWidth}x${viewportHeight}`);
  }
}

/**
 * Reset No button to original position
 */
function resetNoButtonPosition() {
  if (Elements.noButton) {
    Elements.noButton.classList.remove('moving');
    Elements.noButton.style.position = '';
    Elements.noButton.style.left = '';
    Elements.noButton.style.top = '';
    Elements.noButton.style.zIndex = '';
  }
}

// ==========================================
// CREATIVE NO BUTTON REMOVAL 💕
// ==========================================

/**
 * Remove the No button in a creative, romantic way
 * Hearts explosion animation!
 */
function removeNoButtonCreatively() {
  if (State.noButtonRemoved) return;
  State.noButtonRemoved = true;
  
  Utils.log('Removing No button creatively! 💕');
  
  const button = Elements.noButton;
  if (!button) return;
  
  // Get button position for hearts explosion origin
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create hearts explosion from button position
  createHeartsExplosion(centerX, centerY);
  
  // Animate button disappearing
  button.style.transition = 'all 0.5s ease-out';
  button.style.transform = 'scale(0) rotate(720deg)';
  button.style.opacity = '0';
  
  // After animation, replace with romantic message
  setTimeout(() => {
    button.remove();
    showNoMoreNoMessage();
  }, 2000);
  
  // Update GIF to happy one
  updateGif();
  
  // Make Yes button even bigger and more inviting
  if (Elements.yesButton) {
    Elements.yesButton.style.transform = 'scale(1.3)';
    Elements.yesButton.classList.add('glow-animation');
  }
  
  // Update question text
  if (Elements.questionText) {
    Elements.questionText.innerHTML = 'Flappy bird, there\'s only one answer now! 🐦💕';
  }
}

/**
 * Create hearts explosion effect from a point
 */
function createHeartsExplosion(x, y) {
  const hearts = ['💕', '💖', '💗', '💓', '❤️', '🩷', '💘', '🐦'];
  const count = 20;
  
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'explosion-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${20 + Math.random() * 20}px;
      pointer-events: none;
      z-index: 10000;
      animation: heartExplode 1s ease-out forwards;
      --angle: ${(360 / count) * i}deg;
      --distance: ${100 + Math.random() * 100}px;
    `;
    
    document.body.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => heart.remove(), 1000);
  }
}

/**
 * Show romantic message where No button was
 */
function showNoMoreNoMessage() {
  const message = document.createElement('div');
  message.className = 'no-more-no-message';
  message.innerHTML = '💕 "No" gya Maa chudane! 😎😎<br><small>Aur tum fas gyi ho hamare sath😎! 💖</small>';
  
  // Style the message
  message.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 30%;
    transform: translateX(-50%);
    text-align: center;
    color: var(--color-primary);
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
    animation: fadeIn 0.5s ease forwards;
    z-index: 100;
  `;
  
  Elements.buttonContainer.appendChild(message);
  
  // Fade out after a few seconds
  setTimeout(() => {
    message.style.animation = 'fadeOut 1s ease forwards';
    setTimeout(() => message.remove(), 1000);
  }, 3000);
}

// ==========================================
// YES BUTTON HANDLERS
// ==========================================

function handleYesClick() {
  Utils.log('Yes clicked! Flappy bird said YES! 🎉🐦');
  
  Navigation.recordYes(State.noClickCount);
  updateForYes();
  celebrate();
  
  // Navigate to thank you page
  setTimeout(() => {
    Navigation.goTo('thankyou.html');
  }, 2000);
}

function updateForYes() {
  if (Elements.questionText) {
    Elements.questionText.innerHTML = 'I knew my Flappy bird would say yes! 🐦💖';
  }
  
  if (Elements.buttonContainer) {
    Elements.buttonContainer.style.display = 'none';
  }
  
  const successGif = CONFIG.successGif;
  if (Elements.gifDisplay) {
    Utils.loadImageWithFallback(
      successGif.src,
      successGif.fallbackEmoji,
      Elements.gifDisplay
    );
  }
}

function growYesButton() {
  if (!Elements.yesButton) return;
  
  const initial = CONFIG.buttons.yesInitialSize;
  const max = CONFIG.buttons.yesMaxSize;
  const factor = CONFIG.buttons.yesGrowthFactor;
  
  let newWidth = initial.width * Math.pow(factor, State.noClickCount);
  let newHeight = initial.height * Math.pow(factor, State.noClickCount);
  let newFontSize = initial.fontSize + (State.noClickCount * 3);
  
  newWidth = Math.min(newWidth, max.width);
  newHeight = Math.min(newHeight, max.height);
  newFontSize = Math.min(newFontSize, max.fontSize);
  
  Elements.yesButton.style.width = `${newWidth}px`;
  Elements.yesButton.style.height = `${newHeight}px`;
  Elements.yesButton.style.fontSize = `${newFontSize}px`;
  
  Utils.log(`Yes button: ${Math.round(newWidth)}x${Math.round(newHeight)}`);
}

function pulseYesButton() {
  if (!Elements.yesButton) return;
  
  Elements.yesButton.classList.add('pulse');
  setTimeout(() => {
    Elements.yesButton.classList.remove('pulse');
  }, 500);
}

// ==========================================
// GIF HANDLING
// ==========================================

function loadGif(index) {
  const gifs = CONFIG.gifSequence;
  const safeIndex = Math.min(index, gifs.length - 1);
  const gif = gifs[safeIndex];
  
  if (Elements.gifDisplay && gif) {
    Utils.loadImageWithFallback(
      gif.src,
      gif.fallbackEmoji,
      Elements.gifDisplay
    );
  }
}

function updateGif() {
  loadGif(State.noClickCount);
}

// ==========================================
// CELEBRATION EFFECTS
// ==========================================

function celebrate() {
  Utils.log('Celebrating! 🎉🐦');
  
  document.body.classList.add('celebration-active');
  triggerConfetti();
  playSuccessSound();
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    const settings = CONFIG.animations.confetti;
    
    // Multiple bursts
    confetti({
      particleCount: settings.particleCount,
      spread: settings.spread,
      origin: settings.origin,
      colors: settings.colors
    });
    
    setTimeout(() => {
      confetti({
        particleCount: settings.particleCount / 2,
        spread: settings.spread * 1.2,
        origin: { x: 0.3, y: 0.6 },
        colors: settings.colors
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: settings.particleCount / 2,
        spread: settings.spread * 1.2,
        origin: { x: 0.7, y: 0.6 },
        colors: settings.colors
      });
    }, 400);
  } else {
    createDomConfetti();
  }
}

function createDomConfetti() {
  const colors = CONFIG.animations.confetti.colors;
  
  for (let i = 0; i < 50; i++) {
    const confettiEl = Utils.createElement('div', {
      className: `confetti ${['square', 'circle', 'ribbon'][Math.floor(Math.random() * 3)]}`,
      style: {
        left: `${Math.random() * 100}vw`,
        background: Utils.randomFrom(colors),
        animationDuration: `${Utils.randomInRange(2, 4)}s`,
        animationDelay: `${Math.random() * 0.5}s`
      }
    });
    
    document.body.appendChild(confettiEl);
    setTimeout(() => confettiEl.remove(), 4000);
  }
}

// ==========================================
// FLOATING HEARTS
// ==========================================

function startFloatingHearts() {
  const settings = CONFIG.animations.floatingHearts;
  
  State.heartsInterval = setInterval(() => {
    createFloatingHeart();
  }, settings.interval);
  
  Utils.log('Floating hearts started');
}

function createFloatingHeart() {
  const settings = CONFIG.animations.floatingHearts;
  const emoji = Utils.randomFrom(settings.emojis);
  const size = Utils.randomFrom(['small', 'medium', 'large']);
  
  const heart = Utils.createElement('div', {
    className: `floating-heart ${size}`,
    style: {
      left: `${Math.random() * 100}vw`
    }
  }, emoji);
  
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, settings.duration);
}

function stopFloatingHearts() {
  if (State.heartsInterval) {
    clearInterval(State.heartsInterval);
    State.heartsInterval = null;
  }
}

// ==========================================
// AUDIO HANDLING
// ==========================================

function setupAudio() {
  if (!CONFIG.audio.enabled) {
    if (Elements.audioToggle) {
      Elements.audioToggle.style.display = 'none';
    }
    return;
  }
  
  const savedMuted = Utils.loadData('musicPreference', CONFIG.audio.mutedByDefault);
  
  if (Elements.backgroundMusic) {
    Elements.backgroundMusic.volume = CONFIG.audio.volume;
    Elements.backgroundMusic.muted = savedMuted;
    Elements.backgroundMusic.setAttribute('playsinline', '');
    Elements.backgroundMusic.autoplay = !savedMuted;

    if (!savedMuted && CONFIG.audio.forceAutoplay) {
      attemptBackgroundMusicAutoplay();
      registerAutoplayFallback();
    }
  }
  
  updateAudioToggle(savedMuted);
}

function toggleAudio() {
  if (!Elements.backgroundMusic) return;
  
  const isMuted = !Elements.backgroundMusic.muted;
  Elements.backgroundMusic.muted = isMuted;
  
  if (!isMuted) {
    Elements.backgroundMusic.play()
      .then(() => {
        State.audioPlaying = true;
      })
      .catch(err => {
        Utils.logError('Failed to play audio', err);
      });
  } else {
    State.audioPlaying = false;
  }
  
  Utils.saveData('musicPreference', isMuted);
  updateAudioToggle(isMuted);
}

function attemptBackgroundMusicAutoplay() {
  if (!Elements.backgroundMusic) return;
  Elements.backgroundMusic.play()
    .then(() => {
      State.audioPlaying = true;
      Utils.log('Background music autoplayed successfully');
      unregisterAutoplayFallback();
    })
    .catch(err => {
      State.audioPlaying = false;
      Utils.logError('Autoplay blocked - waiting for user interaction', err);
    });
}

let autoplayFallbackRegistered = false;
let autoplayFallbackHandler = null;
const autoplayFallbackEvents = ['pointerdown', 'keydown'];

function registerAutoplayFallback() {
  if (autoplayFallbackRegistered) return;
  autoplayFallbackHandler = () => {
    attemptBackgroundMusicAutoplay();
  };

  autoplayFallbackEvents.forEach(evt => {
    document.addEventListener(evt, autoplayFallbackHandler, { once: true });
  });

  autoplayFallbackRegistered = true;
}

function unregisterAutoplayFallback() {
  if (!autoplayFallbackRegistered) return;
  autoplayFallbackEvents.forEach(evt => {
    if (autoplayFallbackHandler) {
      document.removeEventListener(evt, autoplayFallbackHandler, { once: true });
    }
  });
  autoplayFallbackHandler = null;
  autoplayFallbackRegistered = false;
}

function updateAudioToggle(isMuted) {
  if (!Elements.audioToggle) return;
  
  Elements.audioToggle.textContent = isMuted ? '🔇' : '🔊';
  Elements.audioToggle.classList.toggle('muted', isMuted);
}

function playSuccessSound() {
  if (!CONFIG.audio.enabled) return;
  
  const successAudio = new Audio(CONFIG.audio.successSound);
  successAudio.volume = CONFIG.audio.volume;
  successAudio.play().catch(err => {
    Utils.logError('Failed to play success sound', err);
  });
}

// ==========================================
// CLEANUP
// ==========================================

function cleanup() {
  stopFloatingHearts();
  State.reset();
}

window.addEventListener('beforeunload', cleanup);

// ==========================================
// INITIALIZE ON DOM READY
// ==========================================

document.addEventListener('DOMContentLoaded', init);
