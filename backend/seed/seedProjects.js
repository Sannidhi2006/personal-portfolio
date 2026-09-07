require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Project = require('../models/Project');

const projectsToSeed = [
  {
    title: 'Student Result Management System',
    description: 'A full-stack web app for managing student academic records, grades, and reports with JWT-based authentication.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'JWT'],
    github_url: 'https://github.com/Sannidhi2006/student-result-system',
    live_url: 'https://smart-result-manager.netlify.app',
    image: '',
    order: 1
  },
  {
    title: 'Smitrace',
    description: 'An AI-driven educational platform for interactive learning experiences, built for Smart India Hackathon.',
    technologies: ['Python', 'Flask', 'TensorFlow', 'HTML', 'CSS', 'JavaScript'],
    github_url: 'https://github.com/Sannidhi2006/SIH',
    live_url: 'https://socraticengine.onrender.com/',
    image: '',
    order: 2
  },
  {
    title: 'ATM Banking Management System',
    description: 'A simulation of ATM operations with secure transaction handling, account management, and real-time balance updates.',
    technologies: ['JavaScript', 'Node.js', 'SQL', 'Docker'],
    github_url: 'https://github.com/Sannidhi2006/apex-atm-simulator-demo',
    live_url: 'https://apex-atm-simulator-demo.vercel.app/',
    image: '',
    order: 3
  }
];

const seedProjects = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('Failed to connect to the database. Seeding aborted.');
      process.exit(1);
    }

    console.log('Seeding projects...');
    for (const project of projectsToSeed) {
      await Project.findOneAndUpdate(
        { title: project.title },
        { $set: project },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`Upserted: ${project.title}`);
    }

    console.log('Projects seeded successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
