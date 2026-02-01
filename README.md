# 💕 Valentine's Day Interactive Website

A romantic, interactive Valentine's Day website that combines the best features from multiple inspirational projects. Ask someone to be your Valentine with a playful, hard-to-refuse experience!

## ✨ Features

### Main Question Page
- **Moving "No" Button** - Runs away when you try to click it (desktop only)
- **Growing "Yes" Button** - Gets bigger with each "No" attempt
- **Dynamic GIF Changes** - Shows progressively sadder/pleading expressions
- **Text Variations** - "No" button text changes with each click
- **Confetti Celebration** - Beautiful confetti animation when they say "Yes!"
- **Floating Hearts** - Romantic background animation

### Multi-Page Date Planning
- **Date Selection** - Pick when to have your date
- **Food Preferences** - Choose favorite cuisines
- **Dessert Selection** - Pick sweet treats
- **Activities** - Plan fun things to do together
- **Summary Page** - See all choices with countdown

### Additional Features
- **Mobile Optimized** - Works great on phones (button movement disabled)
- **Background Music** - Optional romantic music (muted by default)
- **Share Options** - WhatsApp sharing and screenshot download
- **Data Persistence** - Selections saved across pages
- **Reset Option** - Start over anytime

---

## 🚀 Quick Start

1. **Download or Clone** the repository
2. **Open `index.html`** in a web browser
3. That's it! No server required.

### For Local Development
```bash
# If you have Python installed
python -m http.server 8000
# Then open http://localhost:8000

# Or with Node.js
npx serve
```

---

## 🎨 Customization Guide

### 1. Changing Messages

Edit `js/config.js` to customize all text:

```javascript
// Main question
mainQuestion: "Will you be my Valentine? 💕",

// Success message
yesMessage: "Yayyy!! I knew you'd say yes! 🥰",

// "No" button messages (add or remove as needed)
noButtonMessages: [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  // Add more messages here...
],

// Final page message
finalMessage: "Thank you for being my Valentine! 💖",
```

### 2. Replacing GIFs

**Recommended GIF Sizes:**
- Width: 300px
- Height: 300px (or square ratio)
- Format: GIF, PNG, JPG, or WebP
- File size: Under 500KB each for fast loading

**Steps to Replace:**
1. Add your GIFs to `assets/gifs/` folder
2. Update `js/config.js`:

```javascript
gifSequence: [
  { src: "assets/gifs/your-gif-1.gif", alt: "Description", fallbackEmoji: "🥺" },
  { src: "assets/gifs/your-gif-2.gif", alt: "Description", fallbackEmoji: "😢" },
  // Add more GIFs...
],

// Success GIF
successGif: {
  src: "assets/gifs/celebration.gif",
  alt: "Happy celebration",
  fallbackEmoji: "🎉"
},
```

**Current GIF Sequence (placeholder names):**
1. `please.gif` - Initial pleading face
2. `think.gif` - Thinking/considering
3. `sad1.gif` - Slightly sad
4. `sad2.gif` - Getting sadder
5. `plz.gif` - Please please
6. `cry1.gif` - Starting to cry
7. `cry2.gif` - Crying more
8. `desperate.gif` - Desperate plea
9. `cute.gif` - Cute puppy eyes
10. `loveme.gif` - Love me please
11. `puppy.gif` - Adorable puppy
12. `heart.gif` - Heart eyes
13. `final.gif` - Final plea
14. `happy.gif` - Success celebration

### 3. Changing Color Scheme

Edit CSS variables in `css/style.css`:

```css
:root {
  /* Primary Colors */
  --color-primary: #ff69b4;        /* Hot pink */
  --color-primary-dark: #ff1493;   /* Deep pink */
  --color-primary-light: #ffc0cb;  /* Light pink */
  
  /* Background Gradient */
  --bg-gradient-start: #ffd6e8;
  --bg-gradient-end: #fff0f5;
  
  /* Text Colors */
  --text-primary: #bd1e59;
  --text-secondary: #ff69b4;
  
  /* Button Colors */
  --btn-yes: #22c55e;       /* Green */
  --btn-no: #ef4444;        /* Red */
}
```

### 4. Modifying Page Flow

**Current Flow:**
```
index.html → thankyou.html → date.html → food.html → dessert.html → activities.html → lastpage.html
```

**To Remove a Page:**
1. Delete the HTML file
2. Update navigation in the previous page's JS
3. Example: To skip dessert, change `food.html` navigation:
```javascript
// In food.html
nextBtn.addEventListener('click', () => {
  Navigation.goTo('activities.html'); // Skip dessert.html
});
```

**To Add a New Page:**
1. Copy an existing page as template
2. Update page indicators
3. Update navigation in adjacent pages
4. Add any new data fields to `Navigation` in `js/navigation.js`

### 5. Selection Options

Modify options in `js/config.js`:

```javascript
// Food options
foodOptions: [
  { id: "italian", label: "Italian 🍝", image: "assets/images/italian.jpg" },
  { id: "sushi", label: "Sushi 🍱", image: "assets/images/sushi.jpg" },
  // Add or modify options...
],

// Dessert options
dessertOptions: [
  { id: "icecream", label: "Ice Cream 🍦", image: "assets/images/icecream.jpg" },
  // Add or modify options...
],

// Activity options
activityOptions: [
  { id: "movies", label: "Movies 🎬", image: "assets/images/movies.jpg" },
  // Add or modify options...
],
```

### 6. Button Behavior Settings

```javascript
buttons: {
  // Yes button initial size
  yesInitialSize: { width: 100, height: 48, fontSize: 20 },
  
  // Growth factor per "No" click (1.12 = 12% growth)
  yesGrowthFactor: 1.12,
  
  // Maximum size caps
  yesMaxSize: { width: 400, height: 200, fontSize: 60 },
  
  // No button movement settings
  noButtonMovement: {
    enabled: true,
    edgePadding: 50,        // Min distance from screen edge
    baseSpeed: 150,         // Base movement distance
    speedIncreasePerClick: 20,
    maxSpeed: 400,
    transitionDuration: 300 // Animation speed in ms
  }
}
```

### 7. Animation Settings

```javascript
animations: {
  floatingHearts: {
    enabled: true,
    interval: 300,      // Time between new hearts (ms)
    emojis: ["💖", "💕", "💗", "💓", "❤️", "🩷"],
    duration: 4000      // How long hearts stay visible
  },
  
  confetti: {
    particleCount: 150,
    spread: 100,
    colors: ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ffffff"]
  }
}
```

### 8. Audio Settings

```javascript
audio: {
  enabled: true,
  mutedByDefault: true,  // Recommended for UX
  backgroundMusic: "assets/audio/romantic-music.mp3",
  successSound: "assets/audio/celebration.mp3",
  volume: 0.5
}
```

---

## 🧪 Testing Checklist

### Main Page (index.html)
- [ ] GIF loads correctly on initial visit
- [ ] "Yes" button bounces with animation
- [ ] Clicking "No" changes button text
- [ ] Clicking "No" changes GIF
- [ ] "Yes" button grows with each "No" click
- [ ] (Desktop) "No" button moves away on hover
- [ ] (Desktop) "No" button moves away when cursor gets close
- [ ] (Mobile) Button movement is disabled
- [ ] (Mobile) Buttons are touch-friendly size
- [ ] Clicking "Yes" triggers confetti
- [ ] Clicking "Yes" redirects to thank you page
- [ ] Floating hearts appear in background
- [ ] Audio toggle works

### Multi-Page Flow
- [ ] Thank you page shows "No" click count
- [ ] Date picker accepts dates
- [ ] Quick date suggestions work
- [ ] Food selection allows multiple choices
- [ ] Dessert selection allows multiple choices
- [ ] Activities selection allows multiple choices
- [ ] Selections persist when navigating back
- [ ] Back buttons work on all pages
- [ ] Page indicators show correct progress

### Final Page (lastpage.html)
- [ ] Shows correct "No" click count
- [ ] Shows selected date with countdown
- [ ] Countdown updates every second
- [ ] Shows all selected food items
- [ ] Shows all selected desserts
- [ ] Shows all selected activities
- [ ] WhatsApp share creates correct message
- [ ] Screenshot download works
- [ ] Reset button clears all data

### Edge Cases
- [ ] Works when no GIFs exist (shows fallback emoji)
- [ ] Works when no food/dessert/activities selected
- [ ] Works when date not selected
- [ ] Works after localStorage is cleared
- [ ] Works on slow internet (loading states)

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Design
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Small Mobile (320px)

---

## 📁 File Structure

```
valentine-final/
│
├── index.html              # Main question page
├── thankyou.html          # Thank you + stats
├── date.html              # Date picker
├── food.html              # Food selection
├── dessert.html           # Dessert selection
├── activities.html        # Activities selection
├── lastpage.html          # Summary + countdown + share
│
├── css/
│   ├── style.css          # Core styles + CSS variables
│   ├── animations.css     # Keyframes + animated elements
│   └── pages.css          # Page-specific styles
│
├── js/
│   ├── config.js          # All customizable settings
│   ├── utils.js           # Helper functions
│   ├── navigation.js      # Data persistence + page navigation
│   └── main.js            # Main page logic
│
├── assets/
│   ├── gifs/              # GIF images (add your own!)
│   ├── images/            # Food/activity images
│   └── audio/             # Background music
│
└── README.md              # This file
```

---

## 🌐 Deployment

### GitHub Pages (Free)
1. Create a GitHub repository
2. Push all files to the `main` branch
3. Go to Settings → Pages
4. Select "Deploy from a branch" → `main` → `/ (root)`
5. Wait a few minutes
6. Your site will be live at: `https://YOUR-USERNAME.github.io/REPO-NAME/`

### Netlify (Free)
1. Create account at netlify.com
2. Drag and drop the folder to deploy
3. Get instant URL

### Vercel (Free)
1. Create account at vercel.com
2. Import from GitHub or drag & drop
3. Get instant URL

---

## 🐛 Troubleshooting

### GIFs Not Loading
- Check file paths are correct
- Ensure GIFs are in `assets/gifs/` folder
- Check file names match config.js exactly (case-sensitive)
- Fallback emojis should appear if GIFs fail

### Button Not Moving (Desktop)
- Check CONFIG.buttons.noButtonMovement.enabled is true
- Ensure not on mobile device
- Check browser console for errors

### Data Not Persisting
- Check if localStorage is enabled in browser
- Check browser console for errors
- Try clearing cache and refreshing

### Audio Not Playing
- Browser autoplay policies require user interaction
- Click the audio toggle button first
- Check audio file exists in assets/audio/

### Confetti Not Working
- Ensure CDN script loaded (check network tab)
- Check browser console for errors
- Fallback DOM confetti should work

---

## 📜 Credits

This project combines ideas from:
- [Ask-out-your-Valentine](https://github.com/) - GIF swapping, text changes
- [loveme-app](https://github.com/) - Button movement, floating hearts
- [moonshine](https://github.com/) - Multi-page flow

### Libraries Used
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Confetti effects
- [html2canvas](https://html2canvas.hertzen.com/) - Screenshot functionality
- [Google Fonts](https://fonts.google.com/) - Poppins font

---

## 💖 License

MIT License - Feel free to use, modify, and share!

Made with love for Valentine's Day 2026 💕

---

## 🎁 Bonus Tips

1. **Custom Domain**: Register a romantic domain name (e.g., "willyoubemyvalentine.love")

2. **Add Your Photos**: Replace placeholder images with actual couple photos

3. **Personalize Messages**: Add inside jokes or special memories

4. **Send at the Right Time**: Schedule sending the link for maximum surprise

5. **Test First**: Always test the full flow before sending

6. **Backup Plan**: Have a direct "Yes" link ready in case of technical issues

---

Good luck with your Valentine! 🌹💕
