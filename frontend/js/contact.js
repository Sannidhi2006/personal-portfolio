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
      // API_BASE_URL is defined in js/main.js (loaded before this script)
      const baseUrl = typeof API_BASE_URL !== 'undefined'
        ? API_BASE_URL
        : 'http://localhost:5000/api';

      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      // ── 4. SUCCESS PATH ──────────────────────────────────────────────────────
      if (response.ok && result.success) {
        showFormStatus('success', '✅ Thank you! Your message has been received. I\'ll be in touch soon.');
        form.reset();
        clearAllErrors();
      } else {
        // ── 5. BACKEND VALIDATION ERROR (400 etc.) ───────────────────────────
        const errMsg = result.message || 'Something went wrong. Please check your input and try again.';
        showFormStatus('error', `❌ ${errMsg}`);
      }
    } catch (networkError) {
      // ── 6. NETWORK ERROR (server down, no internet, etc.) ───────────────────
      console.error('❌ [Contact] Network request failed:', networkError);
      showFormStatus(
        'error',
        '❌ Unable to reach the server. Please check your connection and try again later.'
      );
    } finally {
      // Always re-enable the submit button so user can retry
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
