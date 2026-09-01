/**
 * ==============================================================================
 * PROJECTS JAVASCRIPT MODULE
 * Fetches portfolio projects from backend REST API (GET /api/projects)
 * and dynamically renders project cards with loading and error states.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderProjects();
});

/**
 * Fetches project records from the backend API and handles rendering
 */
async function fetchAndRenderProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  // 1. Show Loading State
  renderLoadingState(projectsGrid);

  try {
    // API_BASE_URL is defined in js/main.js
    const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/projects`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Check for valid response and projects array
    if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
      renderEmptyState(projectsGrid);
      return;
    }

    // 2. Render Project Cards on Success
    renderProjectCards(projectsGrid, result.data);
  } catch (error) {
    console.error('❌ [Projects] Error fetching projects from API:', error);
    renderErrorState(projectsGrid);
  }
}

/**
 * Displays a loading placeholder inside the projects grid
 */
function renderLoadingState(container) {
  container.innerHTML = `
    <div class="projects-loader" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px;">
      <div style="display: inline-block; width: 44px; height: 44px; border: 3px solid rgba(56,189,248,0.2); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
      <p style="color: var(--text-secondary); font-size: 1.05rem;">Loading featured projects...</p>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
}

/**
 * Dynamically builds and appends project cards to the container
 */
function renderProjectCards(container, projects) {
  container.innerHTML = ''; // Clear loading indicator

  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = `project-card fade-in delay-${((index % 3) + 1) * 100}`;
    card.id = `project-${project._id || index}`;

    // Fallback image if not provided
    const imageSrc = project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
    
    // Generate tech stack badge pills
    const techPills = Array.isArray(project.techStack)
      ? project.techStack.map((tech) => `<span class="tech-tag">${escapeHTML(tech)}</span>`).join('')
      : '';

    card.innerHTML = `
      <div class="project-image-wrapper">
        <img 
          src="${escapeHTML(imageSrc)}" 
          alt="${escapeHTML(project.title)} Thumbnail" 
          class="project-img"
          loading="lazy"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';"
        >
      </div>
      <div class="project-content">
        <h3 class="project-title">${escapeHTML(project.title)}</h3>
        <p class="project-description">${escapeHTML(project.description)}</p>
        <div class="project-tech">
          ${techPills}
        </div>
        <div class="project-links">
          ${
            project.githubUrl
              ? `<a href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-secondary" aria-label="View ${escapeHTML(project.title)} on GitHub">
                  <span>GitHub</span>
                 </a>`
              : ''
          }
          ${
            project.liveUrl
              ? `<a href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary" aria-label="View live demo for ${escapeHTML(project.title)}">
                  <span>Live Demo</span>
                 </a>`
              : ''
          }
        </div>
      </div>
    `;

    container.appendChild(card);

    // Observe newly created card for scroll animation if observer exists
    if (window.fadeObserver) {
      window.fadeObserver.observe(card);
    } else {
      card.classList.add('visible');
    }
  });
}

/**
 * Renders a user-friendly error message if API fails
 */
function renderErrorState(container) {
  container.innerHTML = `
    <div class="projects-error" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); backdrop-filter: var(--backdrop-blur);">
      <div style="font-size: 2.5rem; margin-bottom: 12px;">⚠️</div>
      <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--text-primary);">Couldn't load projects right now</h3>
      <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 20px;">
        Unable to connect to the backend server. Please make sure the server is running or try again later.
      </p>
      <button onclick="fetchAndRenderProjects()" class="btn btn-secondary" style="padding: 10px 20px; font-size: 0.9rem; cursor: pointer;">
        🔄 Retry Connection
      </button>
    </div>
  `;
}

/**
 * Renders empty state when no projects are in database
 */
function renderEmptyState(container) {
  container.innerHTML = `
    <div class="projects-empty" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px;">
      <p style="color: var(--text-secondary); font-size: 1.1rem;">No portfolio projects found yet.</p>
    </div>
  `;
}

/**
 * Helper to escape HTML characters and prevent XSS injection
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
