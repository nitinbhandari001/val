/**
 * ============================================
 * VALENTINE'S DAY WEBSITE - UTILITY FUNCTIONS
 * ============================================
 * 
 * Helper functions for common operations.
 * Includes error handling, DOM utilities, and device detection.
 */

const Utils = {
  // ==========================================
  // DEVICE DETECTION
  // ==========================================
  
  /**
   * Check if the current device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return (
      window.innerWidth <= CONFIG.mobile.breakpoint ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)
    );
  },
  
  /**
   * Check if device supports touch
   * @returns {boolean} True if touch is supported
   */
  hasTouch() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  },
  
  // ==========================================
  // LOGGING
  // ==========================================
  
  /**
   * Debug logger that respects CONFIG settings
   * @param {string} message - Message to log
   * @param {string} type - Log type: 'log', 'warn', 'error'
   * @param {any} data - Optional data to log
   */
  log(message, type = 'log', data = null) {
    if (!CONFIG.debug.enabled) return;
    if (CONFIG.debug.level === 'none') return;
    if (CONFIG.debug.level === 'errors' && type !== 'error') return;
    
    const prefix = '💕 [Valentine]';
    const timestamp = new Date().toLocaleTimeString();
    
    if (data) {
      console[type](`${prefix} ${timestamp}: ${message}`, data);
    } else {
      console[type](`${prefix} ${timestamp}: ${message}`);
    }
  },
  
  /**
   * Log an error
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  logError(message, error = null) {
    this.log(message, 'error', error);
  },
  
  // ==========================================
  // DOM UTILITIES
  // ==========================================
  
  /**
   * Safely get element by selector
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null
   */
  $(selector) {
    try {
      return document.querySelector(selector);
    } catch (e) {
      this.logError(`Invalid selector: ${selector}`, e);
      return null;
    }
  },
  
  /**
   * Safely get all elements by selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} NodeList of elements
   */
  $$(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (e) {
      this.logError(`Invalid selector: ${selector}`, e);
      return [];
    }
  },
  
  /**
   * Create element with attributes
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Attributes to set
   * @param {string} content - Inner content
   * @returns {Element} Created element
   */
  createElement(tag, attrs = {}, content = '') {
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    });
    
    if (content) {
      el.innerHTML = content;
    }
    
    return el;
  },
  
  // ==========================================
  // IMAGE HANDLING
  // ==========================================
  
  /**
   * Load image with fallback
   * @param {string} src - Image source
   * @param {string} fallbackEmoji - Emoji to show if image fails
   * @param {Element} targetElement - Element to update
   */
  loadImageWithFallback(src, fallbackEmoji, targetElement) {
    const img = new Image();
    
    img.onload = () => {
      if (targetElement.tagName === 'IMG') {
        targetElement.src = src;
      } else {
        targetElement.style.backgroundImage = `url(${src})`;
      }
      this.log(`Image loaded: ${src}`);
    };
    
    img.onerror = () => {
      this.logError(`Image failed to load: ${src}`);
      this.showFallbackEmoji(targetElement, fallbackEmoji);
    };
    
    img.src = src;
  },
  
  /**
   * Show fallback emoji when image fails
   * @param {Element} element - Target element
   * @param {string} emoji - Fallback emoji
   */
  showFallbackEmoji(element, emoji) {
    if (element.tagName === 'IMG') {
      // Replace img with span containing emoji
      const span = document.createElement('span');
      span.className = 'fallback-emoji';
      span.textContent = emoji;
      span.style.fontSize = '150px';
      span.style.display = 'block';
      span.style.textAlign = 'center';
      span.style.lineHeight = '300px';
      element.parentNode.replaceChild(span, element);
    } else {
      element.innerHTML = `<span class="fallback-emoji">${emoji}</span>`;
    }
  },
  
  /**
   * Preload images for better performance
   * @param {Array} imageSources - Array of image URLs
   * @returns {Promise} Resolves when all images are loaded
   */
  preloadImages(imageSources) {
    const promises = imageSources.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ src, status: 'loaded' });
        img.onerror = () => resolve({ src, status: 'error' });
        img.src = src;
      });
    });
    
    return Promise.all(promises);
  },
  
  // ==========================================
  // POSITION & MOVEMENT
  // ==========================================
  
  /**
   * Get safe position within viewport bounds
   * @param {number} padding - Distance from edges
   * @param {Element} element - Element to position
   * @returns {Object} { x, y } coordinates
   */
  getSafePosition(padding, element) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = element.offsetWidth || 100;
    const elementHeight = element.offsetHeight || 50;
    
    // Calculate safe bounds
    const minX = padding;
    const maxX = viewportWidth - elementWidth - padding;
    const minY = padding;
    const maxY = viewportHeight - elementHeight - padding;
    
    // Generate random position within safe bounds
    const x = Math.max(minX, Math.min(maxX, Math.random() * (maxX - minX) + minX));
    const y = Math.max(minY, Math.min(maxY, Math.random() * (maxY - minY) + minY));
    
    return { x, y };
  },
  
  /**
   * Calculate distance between two points
   * @param {number} x1 - First X coordinate
   * @param {number} y1 - First Y coordinate
   * @param {number} x2 - Second X coordinate
   * @param {number} y2 - Second Y coordinate
   * @returns {number} Distance in pixels
   */
  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
  
  /**
   * Get position away from cursor
   * @param {number} cursorX - Cursor X position
   * @param {number} cursorY - Cursor Y position
   * @param {Element} element - Element to position
   * @param {number} minDistance - Minimum distance from cursor
   * @returns {Object} { x, y } coordinates
   */
  getPositionAwayFromCursor(cursorX, cursorY, element, minDistance) {
    const padding = CONFIG.buttons.noButtonMovement.edgePadding;
    let attempts = 0;
    let position;
    
    // Try to find a position away from cursor
    do {
      position = this.getSafePosition(padding, element);
      attempts++;
    } while (
      this.getDistance(cursorX, cursorY, position.x, position.y) < minDistance &&
      attempts < 10
    );
    
    return position;
  },
  
  // ==========================================
  // DATA PERSISTENCE
  // ==========================================
  
  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.log(`Data saved: ${key}`);
    } catch (e) {
      this.logError(`Failed to save data: ${key}`, e);
    }
  },
  
  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default if not found
   * @returns {any} Stored value or default
   */
  loadData(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      this.logError(`Failed to load data: ${key}`, e);
      return defaultValue;
    }
  },
  
  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   */
  removeData(key) {
    try {
      localStorage.removeItem(key);
      this.log(`Data removed: ${key}`);
    } catch (e) {
      this.logError(`Failed to remove data: ${key}`, e);
    }
  },
  
  /**
   * Clear all Valentine data from localStorage
   */
  clearAllData() {
    this.removeData('valentineData');
    this.removeData('musicPreference');
    this.log('All Valentine data cleared');
  },
  
  // ==========================================
  // FORMATTING
  // ==========================================
  
  /**
   * Format date for display
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    const d = new Date(date);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return d.toLocaleDateString('en-US', options);
  },
  
  /**
   * Format time remaining until a date
   * @param {Date|string} targetDate - Target date
   * @returns {Object} { days, hours, minutes, seconds }
   */
  getTimeRemaining(targetDate) {
    const total = new Date(targetDate) - new Date();
    
    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    
    return {
      total,
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / (1000 * 60)) % 60),
      seconds: Math.floor((total / 1000) % 60),
      isPast: false
    };
  },
  
  // ==========================================
  // RANDOM UTILITIES
  // ==========================================
  
  /**
   * Get random item from array
   * @param {Array} array - Source array
   * @returns {any} Random item
   */
  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  
  /**
   * Get random number in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  },
  
  // ==========================================
  // ANIMATION HELPERS
  // ==========================================
  
  /**
   * Wait for specified duration
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Resolves after duration
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Add CSS class with animation end callback
   * @param {Element} element - Target element
   * @param {string} className - Class to add
   * @param {Function} callback - Callback when animation ends
   */
  animateWithClass(element, className, callback) {
    element.classList.add(className);
    
    const handleEnd = () => {
      element.removeEventListener('animationend', handleEnd);
      if (callback) callback();
    };
    
    element.addEventListener('animationend', handleEnd);
  },
  
  /**
   * Trigger page transition animation
   * @param {string} url - URL to navigate to
   */
  pageTransition(url) {
    const overlay = this.$('.page-transition-overlay');
    
    if (overlay) {
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = url;
      }, CONFIG.animations.pageTransition);
    } else {
      window.location.href = url;
    }
  }
};

// Make Utils globally available
window.Utils = Utils;
