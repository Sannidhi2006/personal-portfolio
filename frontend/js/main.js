/**
 * ==============================================================================
 * MAIN JAVASCRIPT MODULE
 * Handles global configuration, mobile hamburger navigation, active link tracking,
 * and Intersection Observer scroll-in animations.
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. GLOBAL API CONFIGURATION
// ------------------------------------------------------------------------------
/**
 * Base URL for the backend REST API.
 * NOTE: For local development, this points to http://localhost:5000/api.
 * When deploying to production (e.g., Render, Railway, Heroku), replace this with
 * your live deployed backend URL (e.g., "https://my-portfolio-api.onrender.com/api").
 */
const API_BASE_URL = 'http://localhost:5000/api';

// ------------------------------------------------------------------------------
// 2. MOBILE NAVIGATION DRAWER TOGGLE
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    // Toggle mobile menu on hamburger button click
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when any nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          hamburgerBtn.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !hamburgerBtn.contains(event.target)
      ) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 3. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS (.fade-in)
  // ----------------------------------------------------------------------------
  initScrollAnimations();
});

/**
 * Initializes IntersectionObserver to trigger .visible on .fade-in elements
 */
function initScrollAnimations() {
  // Add fade-in classes to key section containers for smooth entry animations
  const animatedSelectors = [
    '.hero-content',
    '.hero-media',
    '.about-container',
    '.skill-card',
    '.contact-form',
  ];

  animatedSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.classList.contains('fade-in')) {
        el.classList.add('fade-in');
        // Add subtle stagger delays for grid cards
        if (selector === '.skill-card') {
          const delayClass = `delay-${((index % 4) + 1) * 100}`;
          el.classList.add(delayClass);
        }
      }
    });
  });

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  // Observe all existing .fade-in elements
  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });

  // Attach observer to window for dynamic elements (like project cards)
  window.fadeObserver = observer;
}
