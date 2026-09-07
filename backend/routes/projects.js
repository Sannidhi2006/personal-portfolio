/**
 * Project Routes
 * Defines API endpoints for retrieving project data.
 */

const express = require('express');
const router = express.Router();
const { getAllProjects } = require('../controllers/projectController');

// GET /api/projects - Retrieve all projects
router.get('/', getAllProjects);

module.exports = router;
