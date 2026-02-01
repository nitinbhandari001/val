/**
 * ============================================
 * VALENTINE'S DAY WEBSITE - CONFIGURATION FILE
 * ============================================
 * 
 * This file contains all customizable settings for the Valentine's website.
 * Edit values here to personalize without touching the main logic.
 * 
 * @author Your Name
 * @version 1.0.0
 */

const CONFIG = {
  // ==========================================
  // PERSONAL MESSAGES
  // ==========================================
  
  /**
   * Main question displayed on the homepage
   * Personalized for Nainika (Flappy bird) 🐦💕
   */
  mainQuestion: "Will you be my Valentine, Flappy bird? 🐦💕",
  
  /**
   * Message shown when user clicks "Yes"
   */
  yesMessage: "I knew my Flappy bird would say yes! 🐦💖",
  
  /**
   * Messages displayed on the "No" button with each click
   * Personalized with "Flappy bird" and "Nainika"
   */
  noButtonMessages: [
    "No",
    "Sure?",
    "Bhav mat kha 🐦",
    "Think again!",
    "Nainika pls 🥺",
    "Don't fly away! 🐦",
    "Dil tod diya 💔",
    "Pachtaegi! 💕",
    "I'll cry...",
    "Pretty pls? 🌹",
    "Aiseee 😢",
    "Dekh le 🐦🥺",
    "Last chance!",
    "No escape 💕",
    "BC YES bol! 😭"
  ],
  
  /**
   * Final page personalized message
   */
  finalMessage: "Thank you for being my Valentine, Flappy bird! Every moment with you is magical. 🐦💖",
  
  // ==========================================
  // GIF CONFIGURATION
  // ==========================================
  
  /**
   * GIF images displayed with each "No" click
   * Recommended size: 300x300px or similar square ratio
   * Supported formats: GIF, PNG, JPG, WebP
   * 
   * The system will:
   * - Loop through these in order
   * - Use the last one if clicks exceed array length
   * - Show fallback emoji if image fails to load
   */
  gifSequence: [
    { src: "assets/gifs/image1.gif", alt: "Cute pleading face", fallbackEmoji: "🥺" },
    { src: "assets/gifs/think.gif", alt: "Thinking", fallbackEmoji: "🤔" },
    { src: "assets/gifs/image2.gif", alt: "Getting worried", fallbackEmoji: "😕" },
    { src: "assets/gifs/sadface.gif", alt: "Sad face", fallbackEmoji: "😢" },
    { src: "assets/gifs/image3.gif", alt: "More worried", fallbackEmoji: "😟" },
    { src: "assets/gifs/plz.gif", alt: "Please", fallbackEmoji: "🙏" },
    { src: "assets/gifs/image4.gif", alt: "Pleading", fallbackEmoji: "🥺" },
    { src: "assets/gifs/cry.gif", alt: "Crying", fallbackEmoji: "😭" },
    { src: "assets/gifs/image5.gif", alt: "Desperate", fallbackEmoji: "💔" },
    { src: "assets/gifs/attitude.gif", alt: "Attitude", fallbackEmoji: "😤" },
    { src: "assets/gifs/cute.gif", alt: "Cute face", fallbackEmoji: "🥹" },
    { src: "assets/gifs/image6.gif", alt: "Last hope", fallbackEmoji: "🙏" },
    { src: "assets/gifs/loveme.gif", alt: "Love me", fallbackEmoji: "💕" },
    { src: "assets/gifs/angry.gif", alt: "Getting frustrated", fallbackEmoji: "😠" },
    { src: "assets/gifs/image7.gif", alt: "Final plea", fallbackEmoji: "💖" }
  ],
  
  /**
   * Success GIF shown when user clicks "Yes"
   */
  successGif: {
    src: "assets/gifs/thanks.gif",
    alt: "Thank you celebration",
    fallbackEmoji: "🎉"
  },
  
  // ==========================================
  // BUTTON BEHAVIOR SETTINGS
  // ==========================================
  
  buttons: {
    /**
     * Initial "Yes" button size (in pixels)
     */
    yesInitialSize: {
      width: 100,
      height: 48,
      fontSize: 20
    },
    
    /**
     * How much the "Yes" button grows with each "No" click
     * Uses multiplier: newSize = initialSize * (growthFactor ^ clickCount)
     */
    yesGrowthFactor: 1.12,
    
    /**
     * Maximum "Yes" button size (prevents it from getting too huge)
     */
    yesMaxSize: {
      width: 400,
      height: 200,
      fontSize: 60
    },
    
    /**
     * "No" button movement settings (desktop only)
     */
    noButtonMovement: {
      enabled: true,
      
      // Minimum distance from screen edges (in pixels)
      edgePadding: 50,
      
      // Base movement speed (pixels)
      baseSpeed: 150,
      
      // Speed increase per click (makes it harder to catch)
      speedIncreasePerClick: 20,
      
      // Maximum speed cap
      maxSpeed: 400,
      
      // Transition duration for smooth movement (in ms)
      transitionDuration: 300,
      
      // Easing function for movement
      transitionEasing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    }
  },
  
  // ==========================================
  // MOBILE SETTINGS
  // ==========================================
  
  mobile: {
    /**
     * Disable button movement on mobile (recommended: true)
     * Button movement is frustrating on touch devices
     */
    disableButtonMovement: true,
    
    /**
     * Minimum touch target size (iOS/Android guidelines: 44x44px)
     */
    minButtonSize: 44,
    
    /**
     * Breakpoint for mobile detection (in pixels)
     */
    breakpoint: 768
  },
  
  // ==========================================
  // AUDIO SETTINGS
  // ==========================================
  
  audio: {
    /**
     * Enable background music feature
     */
    enabled: true,
    
    /**
     * Start muted by default (recommended: true for better UX)
     */
    mutedByDefault: true,
    
    /**
     * Background music file path
     */
    backgroundMusic: "assets/audio/bg-love-music.mp3",
    
    /**
     * Sound effect when clicking "Yes"
     */
    successSound: "assets/audio/aww.mp3",
    
    /**
     * Volume level (0.0 to 1.0)
     */
    volume: 0.5,

    /**
     * Force autoplay attempts on page load (will register fallbacks)
     */
    forceAutoplay: true
  },

  // ==========================================
  // EMAIL SETTINGS
  // ==========================================
  
  email: {
    /**
     * Toggle email delivery from the final page
     */
    enabled: true,

    /**
     * Email delivery provider (currently supports 'formsubmit')
     */
    provider: "formspree",

    /**
     * Formspree form ID (used when provider === 'formspree')
     */
    formspreeId: "meezgnap",

    /**
     * Destination email address (update this to your inbox!)
     */
    recipient: "nitinbhandari.24jun@gmail.com",

    /**
     * Subject line for the summary email
     */
    subject: "Our Valentine Plan 💕",

    /**
     * Success message shown after email is sent
     */
    successMessage: "Summary sent! Check your inbox 💌",

    /**
     * Error message shown if email fails
     */
    errorMessage: "Couldn't send the email. Please try again in a moment."
  },
  
  // ==========================================
  // ANIMATION SETTINGS
  // ==========================================
  
  animations: {
    /**
     * Floating hearts background animation
     */
    floatingHearts: {
      enabled: true,
      // Interval between new hearts (in ms)
      interval: 300,
      // Heart emojis to use (including bird for Flappy bird 🐦)
      emojis: ["💖", "💕", "💗", "💓", "❤️", "🩷", "🐦"],
      // How long hearts stay visible (in ms)
      duration: 4000
    },
    
    /**
     * Confetti settings for celebration
     */
    confetti: {
      particleCount: 150,
      spread: 100,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ffffff"]
    },
    
    /**
     * Page transition duration (in ms)
     */
    pageTransition: 500
  },
  
  // ==========================================
  // COLOR SCHEME (CSS Variables)
  // ==========================================
  
  colors: {
    // Primary colors
    primary: "#ff69b4",        // Hot pink
    primaryDark: "#ff1493",    // Deep pink
    primaryLight: "#ffc0cb",   // Light pink
    
    // Secondary colors
    secondary: "#dc143c",      // Crimson
    accent: "#ffd700",         // Gold
    
    // Background gradient
    backgroundStart: "#ffd6e8",
    backgroundEnd: "#fff0f5",
    
    // Text colors
    textPrimary: "#bd1e59",
    textSecondary: "#ff69b4",
    
    // Button colors
    yesButton: "#22c55e",      // Green
    yesButtonHover: "#16a34a",
    noButton: "#ef4444",       // Red
    noButtonHover: "#dc2626"
  },
  
  // ==========================================
  // DATE OPTIONS
  // ==========================================
  
  dateOptions: {
    /**
     * Minimum selectable date (null = today)
     */
    minDate: null,
    
    /**
     * Maximum days in advance (from today)
     */
    maxDaysAhead: 365,
    
    /**
     * Default date format for display
     */
    displayFormat: "MMMM D, YYYY"
  },
  
  // ==========================================
  // SELECTION OPTIONS
  // ==========================================
  
  /**
   * Food options for selection page
   * Add/remove items as needed
   */
  foodOptions: [
    { id: "pasta", label: "Pasta 🍝", image: "assets/images/pasta.jpeg" },
    { id: "sushi", label: "Sushi 🍱", image: "assets/images/sushi.jpeg" },
    { id: "korean", label: "Korean 🥢", image: "assets/images/koreanfood.jpeg" },
    { id: "ramen", label: "Ramen 🍜", image: "assets/images/ramen.jpeg" },
    { id: "burger", label: "Burgers 🍔", image: "assets/images/burgers.jpeg" },
    { id: "pizza", label: "Pizza 🍕", image: "assets/images/pizza.jpeg" },
    { id: "salad", label: "Salad 🥗", image: "assets/images/salad.jpeg" },
    { id: "dumplings", label: "Dumplings 🥟", image: "assets/images/dumplings.jpeg" },
    { id: "hotdog", label: "Hot Dog 🌭", image: "assets/images/dog.jpeg" },
    { id: "me", label: "ME 😎", image: "assets/images/lipbiting.gif" }
  ],
  
  /**
   * Dessert options for selection page
   */
  dessertOptions: [
    { id: "mochi", label: "Mochi 🍡", image: "assets/images/mochi.jpeg" },
    { id: "icecream", label: "Ice Cream 🐟", image: "assets/images/taiyaki.jpeg" },
    { id: "tiramisu", label: "Tiramisu 🍨", image: "assets/images/tiramisu.jpg" },
    { id: "brownie", label: "Sizzling Brownie 🥐", image: "assets/images/brownie.jpg" },
    { id: "boba", label: "Boba Tea 🧋", image: "assets/images/boba.jpeg" },
    { id: "churros", label: "Churros 🥐", image: "assets/images/churro.jpeg" },
    { id: "mesweet", label: "ME 😎", image: "assets/images/lipbiting.gif" }
  ],
  
  /**
   * Activity options for selection page
   */
  activityOptions: [
    { id: "cinema", label: "Movies 🎬", image: "assets/images/cinema.jpeg" },
    { id: "aquarium", label: "Aquarium 🐠", image: "assets/images/aquarium.jpeg" },
    { id: "park", label: "Walk in Park 🌳", image: "assets/images/park.jpeg" },
    { id: "arcade", label: "Arcade 🎮", image: "assets/images/arcade.jpeg" },
    { id: "kunsthalle", label: "Art Exhibition 🖼️", image: "assets/images/kunsthalle.jpeg" },
    { id: "cats", label: "Cat Cafe 🐱", image: "assets/images/cat.jpg" },
    { id: "meactivity", label: "ME 😎", image: "assets/images/lipbiting.gif" }
  ],
  
  // ==========================================
  // SHARING & EXPORT
  // ==========================================
  
  sharing: {
    /**
     * Enable WhatsApp share button
     */
    whatsapp: true,
    
    /**
     * Enable screenshot/download feature
     */
    screenshot: true,
    
    /**
     * Share message template
     */
    shareMessage: "Someone just said YES to being my Valentine! 💕❤️ Check this out: "
  },
  
  // ==========================================
  // DEBUG SETTINGS
  // ==========================================
  
  debug: {
    /**
     * Enable console logging for debugging
     * Set to false for production
     */
    enabled: true,
    
    /**
     * Log level: 'all', 'errors', 'none'
     */
    level: "all"
  }
};

// Freeze config to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.buttons);
Object.freeze(CONFIG.mobile);
Object.freeze(CONFIG.audio);
Object.freeze(CONFIG.email);
Object.freeze(CONFIG.animations);
Object.freeze(CONFIG.colors);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
