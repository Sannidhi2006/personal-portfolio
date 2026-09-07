/**
 * ==============================================================================
 * PROJECTS JAVASCRIPT MODULE
 * Fetches portfolio projects from backend REST API (GET /api/projects)
 * and dynamically renders project cards with loading, error, and fallback states.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderProjects();
});

const fallbackProjects = [
  {
    title: 'Student Result Management System',
    description: 'A web app for managing student academic records, grades and reports.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'React'],
    github_url: 'https://github.com/Sannidhi2006/student-result-system',
    live_url: 'https://smart-result-manager.netlify.app'
  },
  {
    title: 'Smitrace',
    description: 'An AI-driven educational platform for interactive learning experiences.',
    technologies: ['Python', 'Flask', 'TensorFlow', 'HTML/CSS'],
    github_url: 'https://github.com/Sannidhi2006/SIH',
    live_url: 'https://socraticengine.onrender.com/'
  },
  {
    title: 'ATM Banking Management System',
    description: 'A simulation of ATM operations with secure transaction handling.',
    technologies: ['JavaScript', 'Node.js', 'SQL', 'Docker'],
    github_url: 'https://github.com/Sannidhi2006/apex-atm-simulator',
    live_url: 'https://web-weld-one-42.vercel.app/'
  }
];

/**
 * Fetches project records from the backend API and handles rendering
 */
async function fetchAndRenderProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      renderProjectCards(projectsGrid, data);
    } else {
      throw new Error('Invalid or empty project data from API');
    }
  } catch (error) {
    console.warn('⚠️ [Projects] Failed to fetch from API, falling back to local data:', error);
    renderProjectCards(projectsGrid, fallbackProjects);
  }
}

/**
 * Dynamically builds and appends project cards to the container
 */
function renderProjectCards(container, projects) {
  container.innerHTML = '';

  projects.forEach((project) => {
    const techBadges = Array.isArray(project.technologies)
      ? project.technologies.map((tech) => `<li>${escapeHTML(tech)}</li>`).join('')
      : '';

    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <ul class="tech-badges">
        ${techBadges}
      </ul>
      <div class="project-links">
        ${
          project.github_url
            ? `<a href="${escapeHTML(project.github_url)}" target="_blank" rel="noopener noreferrer" class="btn-primary">GitHub</a>`
            : ''
        }
        ${
          project.live_url
            ? `<a href="${escapeHTML(project.live_url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary">Live Demo</a>`
            : ''
        }
      </div>
    `;

    container.appendChild(card);
  });
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

