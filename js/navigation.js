/**
 * ============================================
 * VALENTINE'S DAY WEBSITE - NAVIGATION & DATA
 * ============================================
 * 
 * Handles page navigation and data persistence across pages.
 */

const Navigation = {
  // Storage key for all Valentine data
  STORAGE_KEY: 'valentineData',
  
  // Default data structure
  defaultData: {
    response: null,           // 'yes' or null
    acceptedAt: null,         // Timestamp when "Yes" was clicked
    noClickCount: 0,          // How many times "No" was clicked
    selectedDate: null,       // Selected date for the date
    selectedFood: [],         // Array of selected food options
    selectedDessert: [],      // Array of selected dessert options
    selectedActivities: [],   // Array of selected activities
    completed: false          // Whether the full flow was completed
  },
  
  /**
   * Initialize navigation and load saved data
   */
  init() {
    Utils.log('Navigation initialized');
    this.setupPageTransitions();
    this.setupBackButton();
    return this;
  },
  
  /**
   * Get current Valentine data
   * @returns {Object} Current data state
   */
  getData() {
    return Utils.loadData(this.STORAGE_KEY, { ...this.defaultData });
  },
  
  /**
   * Save Valentine data
   * @param {Object} data - Data to save (will merge with existing)
   */
  saveData(data) {
    const current = this.getData();
    const updated = { ...current, ...data };
    Utils.saveData(this.STORAGE_KEY, updated);
    Utils.log('Data saved', 'log', updated);
  },
  
  /**
   * Update a specific field
   * @param {string} field - Field name
   * @param {any} value - New value
   */
  updateField(field, value) {
    const data = this.getData();
    data[field] = value;
    Utils.saveData(this.STORAGE_KEY, data);
    Utils.log(`Updated ${field}`, 'log', value);
  },
  
  /**
   * Record that user clicked "Yes"
   * @param {number} noClickCount - How many "No" clicks before "Yes"
   */
  recordYes(noClickCount) {
    this.saveData({
      response: 'yes',
      acceptedAt: new Date().toISOString(),
      noClickCount: noClickCount
    });
    Utils.log(`Yes recorded after ${noClickCount} no clicks`);
  },
  
  /**
   * Save date selection
   * @param {string} date - Selected date
   */
  saveDate(date) {
    this.updateField('selectedDate', date);
  },
  
  /**
   * Save food selections
   * @param {Array} foods - Selected food options
   */
  saveFood(foods) {
    this.updateField('selectedFood', foods);
  },
  
  /**
   * Save dessert selections
   * @param {Array} desserts - Selected dessert options
   */
  saveDessert(desserts) {
    this.updateField('selectedDessert', desserts);
  },
  
  /**
   * Save activity selections
   * @param {Array} activities - Selected activities
   */
  saveActivities(activities) {
    this.updateField('selectedActivities', activities);
  },
  
  /**
   * Mark flow as completed
   */
  markCompleted() {
    this.updateField('completed', true);
  },
  
  /**
   * Reset all data and start over
   */
  reset() {
    Utils.clearAllData();
    Utils.log('All data reset');
    window.location.href = 'index.html';
  },
  
  /**
   * Navigate to next page with transition
   * @param {string} url - URL to navigate to
   */
  goTo(url) {
    Utils.pageTransition(url);
  },
  
  /**
   * Setup page transition overlays
   */
  setupPageTransitions() {
    // Create transition overlay if not exists
    if (!Utils.$('.page-transition-overlay')) {
      const overlay = Utils.createElement('div', {
        className: 'page-transition-overlay'
      }, '<div class="transition-heart">💕</div>');
      document.body.appendChild(overlay);
    }
    
    // Remove active class on page load (for incoming transition)
    window.addEventListener('load', () => {
      const overlay = Utils.$('.page-transition-overlay');
      if (overlay) {
        setTimeout(() => {
          overlay.classList.remove('active');
        }, 100);
      }
    });
  },
  
  /**
   * Setup back button prevention (optional)
   */
  setupBackButton() {
    // Optional: Prevent going back to index after saying yes
    const data = this.getData();
    if (data.response === 'yes' && window.location.pathname.includes('index.html')) {
      // Redirect to thankyou if they try to go back
      // window.location.href = 'thankyou.html';
    }
  },
  
  /**
   * Get summary for final page
   * @returns {Object} Summary of all selections
   */
  getSummary() {
    const data = this.getData();
    
    return {
      noClickCount: data.noClickCount || 0,
      acceptedAt: data.acceptedAt ? new Date(data.acceptedAt) : null,
      date: data.selectedDate,
      formattedDate: data.selectedDate ? Utils.formatDate(data.selectedDate) : 'Not selected',
      food: data.selectedFood || [],
      dessert: data.selectedDessert || [],
      activities: data.selectedActivities || [],
      countdown: data.selectedDate ? Utils.getTimeRemaining(data.selectedDate) : null
    };
  },
  
  /**
   * Check if user has completed specific step
   * @param {string} step - Step to check ('response', 'date', 'food', 'dessert', 'activities')
   * @returns {boolean} True if step is completed
   */
  hasCompleted(step) {
    const data = this.getData();
    
    switch (step) {
      case 'response':
        return data.response === 'yes';
      case 'date':
        return data.selectedDate !== null;
      case 'food':
        return data.selectedFood && data.selectedFood.length > 0;
      case 'dessert':
        return data.selectedDessert && data.selectedDessert.length > 0;
      case 'activities':
        return data.selectedActivities && data.selectedActivities.length > 0;
      default:
        return false;
    }
  },
  
  /**
   * Get current progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgress() {
    const steps = ['response', 'date', 'food', 'dessert', 'activities'];
    const completed = steps.filter(step => this.hasCompleted(step)).length;
    return Math.round((completed / steps.length) * 100);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
});

// Make Navigation globally available
window.Navigation = Navigation;
