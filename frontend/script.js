/**
 * Sannidhi Naveen Kamath - Ultra-Modern 3D Creative Portfolio Landing Screen
 * Features:
 * - 3D Perspective Starfield / Nebula Canvas Engine
 * - Smooth Multi-layer 3D Card Parallax & Glare Reflection
 * - Magnetic 3D CTA Button with Particle Burst on Click
 * - Accessible, responsive, respects prefers-reduced-motion
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // DOM Elements
  const landingScreen = document.getElementById('landing-screen');
  const landingCard = document.getElementById('landing-card');
  const cardGlare = document.getElementById('card-glare');
  const portraitBox = document.getElementById('portrait-box');
  const enterBtn = document.getElementById('enter-btn');
  const mainPortfolio = document.getElementById('main-portfolio');
  const canvas = document.getElementById('bg-canvas');
  const glyphs = document.querySelectorAll('.glyph');

  /* ==========================================================================
     1. 3D Volumetric Luminous Orbs & Atmospheric Depth Canvas Engine
     ========================================================================== */
  let sparkParticles = [];

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Multi-color Radiant 3D Palette
    const orbColors = [
      { core: '#ff2d87', glow: 'rgba(255, 45, 135, 0.65)', ambient: 'rgba(255, 45, 135, 0.18)' }, // Radiant Rose Pink
      { core: '#f5a623', glow: 'rgba(245, 166, 35, 0.65)', ambient: 'rgba(245, 166, 35, 0.18)' }, // Warm Amber Gold
      { core: '#00f0ff', glow: 'rgba(0, 240, 255, 0.65)', ambient: 'rgba(0, 240, 255, 0.18)' },   // Cyber Cyan
      { core: '#a855f7', glow: 'rgba(168, 85, 247, 0.65)', ambient: 'rgba(168, 85, 247, 0.18)' }, // Electric Violet
      { core: '#6366f1', glow: 'rgba(99, 102, 241, 0.65)', ambient: 'rgba(99, 102, 241, 0.18)' }, // Royal Indigo
      { core: '#34d399', glow: 'rgba(52, 211, 153, 0.65)', ambient: 'rgba(52, 211, 153, 0.18)' }  // Emerald
    ];

    // Floating 3D Soft Cosmic Depth Specks
    const speckCount = Math.min(Math.floor((width * height) / 14000), 65);
    const specks = [];
    class Speck3D {
      constructor() {
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = Math.random() * 850 + 50;
        this.radius = Math.random() * 2.2 + 0.8;
        this.colorData = orbColors[Math.floor(Math.random() * orbColors.length)];
        this.vz = Math.random() * 0.4 + 0.15;
      }
      update() {
        this.z -= this.vz;
        if (this.z < 20) {
          this.z = 900;
          this.x = (Math.random() - 0.5) * width * 1.5;
          this.y = (Math.random() - 0.5) * height * 1.5;
        }
      }
      draw(mNormX, mNormY) {
        const factor = 550 / (550 + this.z);
        const screenX = width / 2 + (this.x - mNormX * 24) * factor;
        const screenY = height / 2 + (this.y - mNormY * 24) * factor;
        const size = this.radius * factor;

        if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorData.core;
        ctx.globalAlpha = factor * 0.75;
        ctx.shadowBlur = size > 1.4 ? 8 : 0;
        ctx.shadowColor = this.colorData.core;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < speckCount; i++) {
      specks.push(new Speck3D());
    }

    // Supernova Spark Particles for Button Click
    class Spark {
      constructor(x, y, customColor) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.025 + 0.012;
        this.size = Math.random() * 4 + 1.5;
        this.color = customColor || orbColors[Math.floor(Math.random() * orbColors.length)].core;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.life -= this.decay;
      }

      draw() {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    let mouseNormX = 0;
    let mouseNormY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseNormX = (e.clientX - width / 2) / (width / 2);
      mouseNormY = (e.clientY - height / 2) / (height / 2);
    });

    document.addEventListener('mouseleave', () => {
      mouseNormX = 0;
      mouseNormY = 0;
    });

    let canvasRaf;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render 3D Soft Cosmic Specks
      for (let i = 0; i < specks.length; i++) {
        specks[i].update();
        specks[i].draw(mouseNormX, mouseNormY);
      }

      // Draw Active Sparks
      for (let i = sparkParticles.length - 1; i >= 0; i--) {
        const spark = sparkParticles[i];
        spark.update();
        spark.draw();
        if (spark.life <= 0) {
          sparkParticles.splice(i, 1);
        }
      }

      canvasRaf = requestAnimationFrame(render);
    };

    render();

    // Trigger Sparks Function
    window.triggerSparks = (x, y, count = 50) => {
      for (let i = 0; i < count; i++) {
        sparkParticles.push(new Spark(x, y));
      }
    };

    // Resize Handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    });

    window.addEventListener('landing:exit', () => {
      cancelAnimationFrame(canvasRaf);
    });
  }

  /* ==========================================================================
     2. Multi-layer 3D Card Parallax & Interactive Holographic Avatar
     ========================================================================== */
  if (landingCard && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentPortraitX = 0;
    let currentPortraitY = 0;
    let isMouseActive = false;
    let tiltRaf = null;

    const maxCardRotate = 7.5;     // Card tilt
    const maxPortraitRotate = 18;  // Dynamic 3D avatar tilt

    const update3DEffects = () => {
      const rect = landingCard.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      let targetCardX = 0;
      let targetCardY = 0;
      let targetPortraitX = 0;
      let targetPortraitY = 0;

      if (isMouseActive) {
        const deltaX = (mouseX - cardCenterX) / (window.innerWidth * 0.5);
        const deltaY = (mouseY - cardCenterY) / (window.innerHeight * 0.5);

        targetCardY = Math.max(-maxCardRotate, Math.min(maxCardRotate, deltaX * maxCardRotate));
        targetCardX = Math.max(-maxCardRotate, Math.min(maxCardRotate, -deltaY * maxCardRotate));

        // Portrait 3D Avatar responds with amplified depth tilt
        targetPortraitY = Math.max(-maxPortraitRotate, Math.min(maxPortraitRotate, deltaX * maxPortraitRotate));
        targetPortraitX = Math.max(-maxPortraitRotate, Math.min(maxPortraitRotate, -deltaY * maxPortraitRotate));

        // Update card glare hotspot position
        const glareX = ((mouseX - rect.left) / rect.width) * 100;
        const glareY = ((mouseY - rect.top) / rect.height) * 100;
        landingCard.style.setProperty('--mouse-x', `${glareX.toFixed(1)}%`);
        landingCard.style.setProperty('--mouse-y', `${glareY.toFixed(1)}%`);

        if (portraitBox) {
          const pRect = portraitBox.getBoundingClientRect();
          const pGlareX = ((mouseX - pRect.left) / pRect.width) * 100;
          const pGlareY = ((mouseY - pRect.top) / pRect.height) * 100;
          portraitBox.style.setProperty('--mouse-x', `${Math.max(0, Math.min(100, pGlareX)).toFixed(1)}%`);
          portraitBox.style.setProperty('--mouse-y', `${Math.max(0, Math.min(100, pGlareY)).toFixed(1)}%`);
        }
      }

      // Smooth physics spring dampening
      currentRotateX += (targetCardX - currentRotateX) * 0.1;
      currentRotateY += (targetCardY - currentRotateY) * 0.1;
      currentPortraitX += (targetPortraitX - currentPortraitX) * 0.12;
      currentPortraitY += (targetPortraitY - currentPortraitY) * 0.12;

      landingCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

      if (portraitBox) {
        portraitBox.style.transform = `rotateX(${currentPortraitX.toFixed(2)}deg) rotateY(${currentPortraitY.toFixed(2)}deg) translateZ(28px)`;
      }

      tiltRaf = requestAnimationFrame(update3DEffects);
    };

    if (isFinePointer) {
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseActive = true;

        if (!tiltRaf) {
          tiltRaf = requestAnimationFrame(update3DEffects);
        }
      });

      document.addEventListener('mouseleave', () => {
        isMouseActive = false;
      });
    }

    // Interactive Click on 3D Avatar (Playful bounce & particle burst)
    if (portraitBox) {
      portraitBox.addEventListener('click', (e) => {
        const rect = portraitBox.getBoundingClientRect();
        const burstX = rect.left + rect.width / 2;
        const burstY = rect.top + rect.height / 2;

        portraitBox.style.transform = `scale(0.92) translateZ(10px) rotateX(${currentPortraitX}deg) rotateY(${currentPortraitY}deg)`;
        setTimeout(() => {
          portraitBox.style.transform = `scale(1.08) translateZ(42px) rotateX(${currentPortraitX}deg) rotateY(${currentPortraitY}deg)`;
          setTimeout(() => {
            portraitBox.style.transform = '';
          }, 240);
        }, 120);

        if (window.triggerSparks) {
          window.triggerSparks(burstX, burstY, 30);
        }
      });
    }
  }

  /* ==========================================================================
     3. Magnetic CTA Button with Cinematic Transition
     ========================================================================== */
  if (enterBtn && landingScreen && mainPortfolio) {
    // Magnetic pull effect on desktop
    if (isFinePointer && !prefersReducedMotion) {
      enterBtn.addEventListener('mousemove', (e) => {
        const rect = enterBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const moveX = (e.clientX - btnCenterX) * 0.28;
        const moveY = (e.clientY - btnCenterY) * 0.28;

        enterBtn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      });

      enterBtn.addEventListener('mouseleave', () => {
        enterBtn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    }

    // Enter Portfolio Action
    enterBtn.addEventListener('click', (e) => {
      const rect = enterBtn.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      // Trigger golden spark burst effect
      if (window.triggerSparks) {
        window.triggerSparks(clickX, clickY, 45);
      }

      window.dispatchEvent(new CustomEvent('landing:exit'));

      const openPortfolio = () => {
        // Step a: set display to a visible value matching the layout
        mainPortfolio.style.display = 'block';

        // Step b: force a reflow before changing opacity/transform
        void mainPortfolio.offsetHeight;

        // Step c: set opacity to 1 and transform to translateY(0) via active class and explicit styles
        mainPortfolio.classList.add('active');
        mainPortfolio.style.opacity = '1';
        mainPortfolio.style.transform = 'translateY(0)';
        mainPortfolio.setAttribute('aria-hidden', 'false');

        // Hide landing screen completely so both do not occupy space
        landingScreen.style.display = 'none';

        // Reset scroll position and set focus
        window.scrollTo(0, 0);
        mainPortfolio.focus();

        // Step 2: Explicitly re-check/reveal all sections and components currently in viewport
        revealSectionsInView();
        initProjectCardTilt();
      };

      if (prefersReducedMotion) {
        landingScreen.style.display = 'none';
        openPortfolio();
      } else {
        // Cinematic full-screen transition
        landingScreen.classList.add('exit');
        setTimeout(openPortfolio, 400);
      }
    });
  }

  /* ==========================================================================
     4. Dynamic Project Fetching & 3D Interactive Rendering
     ========================================================================== */
  const projectsGrid = document.getElementById('projects-grid');

  function initProjectCardTilt() {
    if (prefersReducedMotion || !isFinePointer) return;

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = 'true';

      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.prepend(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8.5;
        const rotateY = ((x - centerX) / centerX) * 8.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.boxShadow = '0 24px 50px rgba(0,0,0,0.6), 0 0 35px rgba(245, 166, 35, 0.22), 0 0 50px rgba(99, 102, 241, 0.15)';
        card.style.borderColor = 'rgba(245, 166, 35, 0.45)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
        card.style.borderColor = '';
      });
    });
  }
  
  if (projectsGrid) {
    const escapeHTML = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const renderProjects = (projects) => {
      projectsGrid.innerHTML = '';
      projects.forEach(project => {
        const techBadgesHtml = Array.isArray(project.technologies)
          ? project.technologies.map(tech => `<li>${escapeHTML(tech)}</li>`).join('')
          : '';
          
        const article = document.createElement('article');
        article.className = 'project-card';
        article.innerHTML = `
          <div class="card-glare" aria-hidden="true"></div>
          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.description)}</p>
          <ul class="tech-badges">
            ${techBadgesHtml}
          </ul>
          <div class="project-links">
            ${project.github_url ? `<a href="${escapeHTML(project.github_url)}" target="_blank" rel="noopener noreferrer" class="btn-primary">GitHub</a>` : ''}
            ${project.live_url ? `<a href="${escapeHTML(project.live_url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary">Live Demo</a>` : ''}
          </div>
        `;
        projectsGrid.appendChild(article);
      });

      // Observe and reveal newly rendered project cards
      revealSectionsInView();
      initProjectCardTilt();
    };

    const fallbackProjects = [
      {
        title: 'Student Result Management System',
        description: 'A full-stack web app for managing student academic records, grades, and reports with JWT-based authentication.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'JWT'],
        github_url: 'https://github.com/Sannidhi2006/student-result-system',
        live_url: 'https://smart-result-manager.netlify.app'
      },
      {
        title: 'Smitrace',
        description: 'An AI-driven educational platform for interactive learning experiences, built for Smart India Hackathon.',
        technologies: ['Python', 'Flask', 'TensorFlow', 'HTML', 'CSS', 'JavaScript'],
        github_url: 'https://github.com/Sannidhi2006/SIH',
        live_url: 'https://socraticengine.onrender.com/'
      },
      {
        title: 'ATM Banking Management System',
        description: 'A simulation of ATM operations with secure transaction handling, account management, and real-time balance updates.',
        technologies: ['JavaScript', 'Node.js', 'SQL', 'Docker'],
        github_url: 'https://github.com/Sannidhi2006/apex-atm-simulator',
        live_url: 'https://web-weld-one-42.vercel.app/'
      }
    ];

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          renderProjects(data);
        } else {
          throw new Error('Invalid or empty project data from API');
        }
      } catch (error) {
        console.error('Failed to fetch projects, using fallback data:', error);
        renderProjects(fallbackProjects);
      }
    };

    fetchProjects();
  }

  /* ==========================================================================
     5. Contact Form Submission Handling (with Email Delivery & Feedback)
     ========================================================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      // Remove existing notification
      const existingAlert = contactForm.querySelector('.form-feedback');
      if (existingAlert) existingAlert.remove();

      const nameInput = contactForm.querySelector('#name');
      const emailInput = contactForm.querySelector('#email');
      const messageInput = contactForm.querySelector('#message');

      const name = nameInput?.value?.trim();
      const email = emailInput?.value?.trim();
      const message = messageInput?.value?.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validation
      if (!name) {
        showFeedback(contactForm, 'error', '⚠️ Please enter your name.');
        nameInput?.focus();
        return;
      }
      if (!email || !emailRegex.test(email)) {
        showFeedback(contactForm, 'error', '⚠️ Please enter a valid email address (e.g., yourname@gmail.com).');
        emailInput?.focus();
        return;
      }
      if (!message) {
        showFeedback(contactForm, 'error', '⚠️ Please enter your message.');
        messageInput?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span style="display:inline-flex;align-items:center;gap:8px;">
            <svg style="animation:spin 1s linear infinite;width:18px;height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
            Sending Message...
          </span>`;
      }

      let sentSuccessfully = false;
      let responseMessage = '';

      try {
        // Step 1: Send to local / backend API endpoint
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiEndpoint = (isLocalDev && window.location.port !== '5000')
          ? 'http://localhost:5000/api/contact'
          : '/api/contact';

        const apiPromise = fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 5000)
        );

        const res = await Promise.race([apiPromise, timeoutPromise]).catch(() => null);

        if (res && res.ok) {
          const result = await res.json().catch(() => ({}));
          sentSuccessfully = true;
          responseMessage = result.message || 'Message sent successfully!';
        } else {
          // Step 2: Fallback to FormSubmit for instant real email delivery
          const formSubmitRes = await fetch('https://formsubmit.co/ajax/kamathshinnu555@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              message,
              _subject: `🚀 Portfolio Message from ${name}`,
              _replyto: email,
              _template: 'table',
              _captcha: 'false',
              _autoresponse: `Hi ${name},\n\nThank you for reaching out through my portfolio website! I have received your message:\n\n"${message}"\n\nI will review it and get back to you shortly.\n\nBest regards,\nSannidhi Naveen Kamath\nCreative Developer & Tech Enthusiast\nEmail: kamathshinnu555@gmail.com`
            })
          });

          if (formSubmitRes.ok) {
            sentSuccessfully = true;
            responseMessage = 'Message delivered successfully!';
          } else {
            throw new Error('Both API and fallback service failed');
          }
        }
      } catch (err) {
        console.warn('Direct submission error, attempting FormSubmit fallback:', err);
        try {
          const formSubmitRes = await fetch('https://formsubmit.co/ajax/kamathshinnu555@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              message,
              _subject: `🚀 Portfolio Message from ${name}`,
              _replyto: email,
              _template: 'table',
              _captcha: 'false',
              _autoresponse: `Hi ${name},\n\nThank you for reaching out through my portfolio website! I have received your message:\n\n"${message}"\n\nI will review it and get back to you shortly.\n\nBest regards,\nSannidhi Naveen Kamath\nCreative Developer & Tech Enthusiast\nEmail: kamathshinnu555@gmail.com`
            })
          });
          if (formSubmitRes.ok) {
            sentSuccessfully = true;
            responseMessage = 'Message delivered successfully!';
          }
        } catch (secondaryErr) {
          console.error('All submission attempts failed:', secondaryErr);
        }
      }

      if (sentSuccessfully) {
        showFeedback(
          contactForm,
          'success',
          `✅ <strong>Message Sent Successfully!</strong><br><span style="font-size:0.88rem;opacity:0.95;"> </strong></span>`
        );
        contactForm.reset();

        // Trigger celebratory visual sparks if canvas is active
        if (typeof window.triggerSparks === 'function') {
          const rect = submitBtn ? submitBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
          window.triggerSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
        }
      } else {
        const mailtoLink = `mailto:kamathshinnu555@gmail.com?subject=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        showFeedback(
          contactForm,
          'error',
          `⚠️ <strong>Unable to send message directly.</strong><br><span style="font-size:0.88rem;">Please check your connection or <a href="${mailtoLink}" style="color:#38bdf8;text-decoration:underline;font-weight:600;">click here to email kamathshinnu555@gmail.com directly</a>.</span>`
        );
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function showFeedback(form, type, htmlContent) {
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.style.marginTop = '1.25rem';
    feedback.style.padding = '0.9rem 1.2rem';
    feedback.style.borderRadius = '12px';
    feedback.style.fontSize = '0.95rem';
    feedback.style.lineHeight = '1.5';
    feedback.style.animation = 'feedbackFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';

    if (type === 'success') {
      feedback.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(16, 185, 129, 0.08))';
      feedback.style.border = '1px solid rgba(74, 222, 128, 0.45)';
      feedback.style.color = '#86efac';
      feedback.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.15)';
    } else {
      feedback.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(220, 38, 38, 0.08))';
      feedback.style.border = '1px solid rgba(248, 113, 113, 0.45)';
      feedback.style.color = '#fca5a5';
      feedback.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.15)';
    }

    feedback.innerHTML = htmlContent;
    form.appendChild(feedback);
  }

  /* ==========================================================================
     6. Mobile Hamburger Navigation Toggle
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  /* ==========================================================================
     7. Scroll-Triggered Section Fade-In Animations & Initial Viewport Reveal
     ========================================================================== */
  let fadeObserver = null;

  function revealSectionsInView() {
    const fadeTargets = document.querySelectorAll('.section, .project-card, .skills-list li');
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    fadeTargets.forEach((el) => {
      if (prefersReducedMotion) {
        el.classList.add('in-view');
        return;
      }

      // Check if element is currently visible inside the viewport
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < viewportHeight && rect.bottom > 0;

      if (isVisible) {
        el.classList.add('in-view');
        if (fadeObserver) {
          fadeObserver.unobserve(el);
        }
      } else if (fadeObserver) {
        fadeObserver.observe(el);
      }
    });
  }

  if (!prefersReducedMotion) {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
  }

  // Initial call for elements present on load
  revealSectionsInView();

  /* ==========================================================================
     8. Active Nav Link Highlight & Ambient Section Atmosphere on Scroll
     ========================================================================== */
  const allSections = document.querySelectorAll('.section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const ambientBg = document.getElementById('portfolio-ambient-bg');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          allNavLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
          });
          if (ambientBg) {
            ambientBg.dataset.section = activeId;
          }
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  allSections.forEach((section) => sectionObserver.observe(section));
});


