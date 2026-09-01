/**
 * Database Seeder Script: Projects
 * Populates MongoDB with realistic sample projects.
 *
 * Usage:
 *   node seed/seedProjects.js
 *   or
 *   npm run seed
 */

const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const Project = require('../models/Project');

// Sample portfolio project data
const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce web application with product search, category filtering, persistent shopping cart, and secure Stripe checkout workflow.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'CSS3', 'Stripe API'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/example/ecommerce-platform',
    liveUrl: 'https://ecommerce-platform-demo.netlify.app',
    featured: true,
  },
  {
    title: 'Task Management System',
    description: 'A responsive Kanban-style project tracker with interactive task status updates, tag filtering, priority management, and activity logging.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Express', 'MongoDB'],
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/example/task-manager-app',
    liveUrl: 'https://taskmanager-demo.netlify.app',
    featured: true,
  },
  {
    title: 'Interactive Weather Dashboard',
    description: 'A dynamic meteorological web application providing real-time conditions, 5-day forecasts, geolocation search, and humidity/wind index cards.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API', 'Chart.js'],
    imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/example/weather-dashboard',
    liveUrl: 'https://weather-dashboard-demo.netlify.app',
    featured: false,
  },
];

const seedProjects = async () => {
  console.log('🌱 [Seeder] Starting database seeding process...');

  // Connect to MongoDB
  const conn = await connectDB();

  if (!conn) {
    console.error('❌ [Seeder] Unable to connect to MongoDB. Please make sure MONGO_URI is correctly configured in backend/.env');
    process.exit(1);
  }

  try {
    // 1. Clear any existing project records
    console.log('🧹 [Seeder] Removing existing projects...');
    await Project.deleteMany({});
    console.log('✨ [Seeder] Existing project collection cleared.');

    // 2. Insert sample project records
    console.log('📦 [Seeder] Inserting sample projects...');
    const createdProjects = await Project.insertMany(sampleProjects);
    console.log(`✅ [Seeder] Successfully inserted ${createdProjects.length} sample projects:`);

    createdProjects.forEach((proj, idx) => {
      console.log(`   ${idx + 1}. ${proj.title} (ID: ${proj._id})`);
    });

    // 3. Disconnect cleanly
    await mongoose.connection.close();
    console.log('🔒 [Seeder] Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder] Error seeding project data: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedProjects();
