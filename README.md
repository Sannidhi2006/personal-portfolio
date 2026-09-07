# Sannidhi Naveen Kamath — Personal Portfolio

A responsive, modern full-stack developer portfolio featuring an interactive 3D landing screen, dynamic project retrieval powered by MongoDB Atlas, accessible navigation with keyboard support, and contact message persistence via REST APIs.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Vanilla CSS3 (CSS Custom Properties, Glassmorphism, Responsive Grid, Flexbox), Modern Vanilla JavaScript (Canvas 2D, Fetch API, DOM manipulation).
- **Backend:** Node.js, Express.js (REST API architecture, rate limiting, security headers, centralized error handler).
- **Database:** MongoDB Atlas (Cloud NoSQL Database) with Mongoose ODM.
- **Security & Optimization:** Helmet (security headers), CORS, Express-Rate-Limit, Dotenv, DNS resolution fallback.
- **Hosting & Deployment:** Netlify (Frontend), Render (Backend), MongoDB Atlas (Database).

---

## 📁 Project Structure

```text
portfolio/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & DNS resolver configuration
│   ├── controllers/
│   │   ├── projectController.js  # GET /api/projects controller
│   │   └── contactController.js  # POST /api/contact controller
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized JSON error handler
│   │   └── validate.js           # Contact form payload validator
│   ├── models/
│   │   ├── Project.js            # Project schema (title, description, technologies, URLs, order)
│   │   └── Message.js            # Contact message schema
│   ├── routes/
│   │   ├── projects.js           # /api/projects routes
│   │   └── contact.js            # /api/contact route with rate limiting
│   ├── seed/
│   │   └── seedProjects.js       # Idempotent database seeder (upsert on title)
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server entry point & static asset server
├── frontend/
│   ├── assets/
│   │   ├── images/               # Profile photo (profile.jpg)
│   │   └── resume/               # Resume PDF (resume.pdf)
│   ├── index.html                # Main SPA landing page and sections
│   ├── style.css                 # Design system tokens, 3D landing, responsive layout
│   └── script.js                 # Canvas engine, parallax, dynamic fetch & form handling
├── .env                          # Environment variables (MongoDB URI & Port)
├── package.json                  # Root npm scripts
├── netlify.toml                  # Netlify deployment configuration
└── README.md                     # Documentation and setup guide
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- A **MongoDB Atlas** cluster URI (or local MongoDB instance)

### 2. Environment Setup (`.env`)
Create a `.env` file in the project root directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/?retryWrites=true&w=majority
```

> **Note on Special Characters:** If your MongoDB password contains characters such as `@`, `#`, or `$`, the database configuration automatically handles URI encoding.

---

### 3. Running the Backend

From the project root directory:

```powershell
# Install backend dependencies (if running for the first time)
cd backend
npm install
cd ..

# Run the database seeder to populate the 3 real projects
npm run seed

# Start the server (runs on http://localhost:5000)
npm start
```

### 4. Running the Frontend

- **Option A (Integrated):** The Express server at `http://localhost:5000` automatically serves the frontend. Simply open `http://localhost:5000` in your browser.
- **Option B (Live Server / Static):** You can also open `frontend/index.html` with VS Code Live Server (port `5500` or `3000`). The backend supports full CORS requests across origins.

---

## ☁️ Deployment Guide

### 1. Database: MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a database user with read/write permissions.
4. Obtain your connection string (`mongodb+srv://...`) and set it in your hosting platform environment variables.

### 2. Backend: Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: your MongoDB Atlas connection string.
   - `PORT`: `5000` (or leave default).

### 3. Frontend: Netlify
1. Create a new site on [Netlify](https://www.netlify.com).
2. Connect your GitHub repository.
3. Configure build settings:
   - **Base directory:** `frontend`
   - **Publish directory:** `frontend`
4. If your backend is hosted separately on Render, update the API base URL in `frontend/script.js` or set up Netlify rewrites in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-render-backend.onrender.com/api/:splat"
     status = 200
     force = true
   ```

---

## ➕ Adding a Fourth Project to MongoDB

You can add additional projects at any time using either of the following methods:

### Method A: Updating the Seed Script
Open `backend/seed/seedProjects.js` and add your fourth project to the `projectsToSeed` array:

```javascript
{
  title: 'My Fourth Awesome Project',
  description: 'A brief 1-2 sentence description of what the project does.',
  technologies: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
  github_url: 'https://github.com/Sannidhi2006/my-fourth-project',
  live_url: 'https://my-fourth-project.vercel.app',
  image: '',
  order: 4
}
```

Then run:
```powershell
npm run seed
```
The script will upsert the project into MongoDB Atlas without altering or duplicating existing projects.

### Method B: Directly via MongoDB Atlas Web UI
1. Go to your cluster in MongoDB Atlas and click **Browse Collections**.
2. Select the `projects` collection.
3. Click **Insert Document** and enter the JSON:
   ```json
   {
     "title": "My Fourth Awesome Project",
     "description": "A brief description of what the project does.",
     "technologies": ["React", "Node.js", "MongoDB"],
     "github_url": "https://github.com/Sannidhi2006/my-project",
     "live_url": "https://my-project.netlify.app",
     "image": "",
     "order": 4
   }
   ```
4. Click **Insert**. Refresh your portfolio website — the new project card will appear automatically!

---

## 📄 License
Created by Sannidhi Naveen Kamath © 2026. All rights reserved.
