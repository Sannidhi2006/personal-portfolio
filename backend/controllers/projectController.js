/**
 * Project Controller
 * Handles business logic for fetching portfolio projects.
 */

const mongoose = require('mongoose');
const Project = require('../models/Project');

// Fallback project dataset for offline development mode
const fallbackProjects = [
  {
    _id: '65f000000000000000000001',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce web application with product search, category filtering, persistent shopping cart, and secure Stripe checkout workflow.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'CSS3', 'Stripe API'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/example/ecommerce-platform',
    liveUrl: 'https://ecommerce-platform-demo.netlify.app',
    featured: true,
    createdAt: new Date('2026-03-01T10:00:00.000Z'),
  },
  {
    _id: '65f000000000000000000002',
    title: 'Task Management System',
    description: 'A responsive Kanban-style project tracker with interactive task status updates, tag filtering, priority management, and activity logging.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Express', 'MongoDB'],
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/example/task-manager-app',
    liveUrl: 'https://taskmanager-demo.netlify.app',
    featured: true,
    createdAt: new Date('2026-02-15T10:00:00.000Z'),
  },
  {
    _id: '65f000000000000000000003',
    title: 'Interactive Weather Dashboard',
    description: 'A dynamic meteorological web application providing real-time conditions, 5-day forecasts, geolocation search, and humidity/wind index cards.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API', 'Chart.js'],
    imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/example/weather-dashboard',
    liveUrl: 'https://weather-dashboard-demo.netlify.app',
    featured: false,
    createdAt: new Date('2026-01-20T10:00:00.000Z'),
  },
];

/**
 * @desc    Get all portfolio projects
 * @route   GET /api/projects
 * @access  Public
 */
const getAllProjects = async (req, res, next) => {
  try {
    // If connected to MongoDB, query database directly
    if (mongoose.connection.readyState === 1) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    }

    // Offline / Standalone development fallback
    return res.status(200).json({
      success: true,
      count: fallbackProjects.length,
      data: fallbackProjects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single portfolio project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(`Project not found with id: ${id}`);
      error.statusCode = 404;
      return next(error);
    }

    // If connected to MongoDB, query database
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error(`Project not found with id: ${id}`);
        error.statusCode = 404;
        return next(error);
      }

      return res.status(200).json({
        success: true,
        data: project,
      });
    }

    // Offline / Standalone development fallback
    const foundProject = fallbackProjects.find((p) => p._id.toString() === id);

    if (!foundProject) {
      const error = new Error(`Project not found with id: ${id}`);
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: foundProject,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
};
