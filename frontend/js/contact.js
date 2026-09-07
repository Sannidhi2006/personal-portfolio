/**
 * ==============================================================================
 * CONTACT FORM JAVASCRIPT MODULE
 * Handles client-side validation, form submission to POST /api/contact,
 * loading states, success/error feedback, and graceful offline error handling.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const formStatus = document.getElementById('form-status');

  // Input fields
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // Email regex (same pattern as backend)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAX_MSG_LENGTH = 2000;

  // ============================================================================
  // 1. LISTEN FOR SUBMIT EVENT
  // ============================================================================
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clear previous status & errors
    clearAllErrors();
    hideFormStatus();

    // ── 2. CLIENT-SIDE VALIDATION ──────────────────────────────────────────────
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    if (!name) {
      showFieldError(nameInput, 'Name is required.');
      isValid = false;
    } else if (name.length > 100) {
      showFieldError(nameInput, 'Name must be under 100 characters.');
      isValid = false;
    }

    if (!email) {
      showFieldError(emailInput, 'Email address is required.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!message) {
      showFieldError(messageInput, 'Message is required.');
      isValid = false;
    } else if (message.length > MAX_MSG_LENGTH) {
      showFieldError(messageInput, `Message must be under ${MAX_MSG_LENGTH} characters. (Currently: ${message.length})`);
      isValid = false;
    }

    // Stop here if any validation failed — do NOT send network request
    if (!isValid) return;

    // ── 3. SET LOADING STATE ───────────────────────────────────────────────────
    setLoadingState(true, submitBtn, btnText);
    showFormStatus('loading', '⏳ Sending your message...');

    try {
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = (isLocalDev && window.location.port !== '5000')
        ? 'http://localhost:5000/api'
        : '/api';

      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      }).catch(() => null);

      if (response && response.ok) {
        const result = await response.json().catch(() => ({}));
        showFormStatus('success', '✅ Thank you! Your message has been sent. A confirmation has been dispatched to your email.');
        form.reset();
        clearAllErrors();
        return;
      }

      // Cloud Fallback
      const formSubmitRes = await fetch('https://formsubmit.co/ajax/kamathshinnu555@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
        showFormStatus('success', '✅ Thank you! Your message has been sent. A confirmation has been dispatched to your email.');
        form.reset();
        clearAllErrors();
      } else {
        throw new Error('Fallback failed');
      }
    } catch (networkError) {
      console.error('❌ [Contact] Error submitting form:', networkError);
      showFormStatus(
        'error',
        '⚠️ Unable to deliver message directly. Please email kamathshinnu555@gmail.com or try again.'
      );
    } finally {
      setLoadingState(false, submitBtn, btnText);
    }
  });

  // Clear errors on input so they don't linger while user is correcting
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Shows an inline error message below a given input/textarea field
   */
  function showFieldError(inputEl, message) {
    // Remove any existing error for this field
    clearFieldError(inputEl);

    inputEl.classList.add('input-error');

    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-text';
    errorSpan.setAttribute('role', 'alert');
    errorSpan.textContent = message;

    // Insert after the input inside its .form-group
    inputEl.insertAdjacentElement('afterend', errorSpan);
  }

  /**
   * Removes inline error for a single field
   */
  function clearFieldError(inputEl) {
    inputEl.classList.remove('input-error');
    const existingError = inputEl.parentElement.querySelector('.error-text');
    if (existingError) existingError.remove();
  }

  /**
   * Removes all inline field errors in the form
   */
  function clearAllErrors() {
    form.querySelectorAll('.error-text').forEach((el) => el.remove());
    form.querySelectorAll('.input-error').forEach((el) =>
      el.classList.remove('input-error')
    );
  }

  /**
   * Shows the #form-status div with a type (success | error | loading)
   */
  function showFormStatus(type, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
  }

  /**
   * Hides the #form-status div
   */
  function hideFormStatus() {
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  /**
   * Disables/enables the submit button and updates its label
   */
  function setLoadingState(isLoading, btn, textEl) {
    btn.disabled = isLoading;
    textEl.textContent = isLoading ? 'Sending...' : 'Send Message';
    btn.style.opacity = isLoading ? '0.7' : '1';
    btn.style.cursor = isLoading ? 'not-allowed' : 'pointer';
  }
});
