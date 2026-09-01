# Full-Stack Developer Portfolio

A responsive, high-performance personal portfolio website built with a modern decoupled full-stack architecture. Features dynamic project showcases powered by a Node.js/Express REST API and MongoDB Atlas, responsive design with CSS custom properties and glassmorphism, asynchronous contact form submission with client and server input validation, rate limiting, and smooth scroll animations.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, Vanilla CSS3 (Custom Properties, CSS Grid, Flexbox, Glassmorphism), Vanilla JavaScript ES6+ (Fetch API, Intersection Observer, DOM API). *Zero frontend frameworks or build tools.*
- **Backend:** Node.js, Express.js (REST API architecture, Route Controllers, Modular Router).
- **Database:** MongoDB Atlas (Cloud Database) via Mongoose ODM.
- **Security & Utilities:** Helmet (HTTP security headers), CORS (Cross-Origin Resource Sharing), Express-Rate-Limit (anti-spam protection), Dotenv (environment configuration), Nodemon (development server).
- **Hosting & Deployment:** Netlify (Frontend Static Hosting) & Render (Backend Web Service).

---

## 📁 Project Structure

```text
portfolio/
├── backend/
│   ├── config/
│   │   └── db.js            # Mongoose connection logic with offline fallback
│   ├── controllers/
│   │   ├── projectController.js # Projects business logic (getAll, getById)
│   │   └── contactController.js # Contact form message handling
│   ├── middleware/
│   │   ├── errorHandler.js  # Centralized 4-argument Express error handler
│   │   └── validate.js      # Input validation for contact form submissions
│   ├── models/
│   │   ├── Project.js       # Project Mongoose schema and model
│   │   └── Message.js       # Contact message Mongoose schema with email regex
│   ├── routes/
│   │   ├── projects.js      # GET /api/projects and GET /api/projects/:id
│   │   └── contact.js       # POST /api/contact with rate limiting
│   ├── seed/
│   │   └── seedProjects.js  # Database seeder script with 3 sample projects
│   ├── .env.example         # Environment variables template
│   ├── .gitignore           # Backend ignore rules (node_modules, .env)
│   ├── package.json         # Dependencies and lifecycle scripts
│   └── server.js            # Express application entry point
├── frontend/
│   ├── assets/
│   │   ├── images/          # Profile and project graphics
│   │   └── resume/          # Downloadable resume PDF
│   ├── css/
│   │   ├── style.css        # Theme variables, typography, layout & components
│   │   └── responsive.css   # Breakpoint media queries (mobile/tablet/desktop)
│   ├── js/
│   │   ├── main.js          # API config, mobile hamburger menu, scroll animations
│   │   ├── projects.js      # Dynamic project fetching, card rendering & error states
│   │   └── contact.js       # Form validation, AJAX submission & live status feedback
│   ├── index.html           # Semantic one-page portfolio layout
│   └── netlify.toml         # Netlify static publishing configuration
├── netlify.toml             # Root Netlify configuration
├── .gitignore               # Root Git ignore rules
└── README.md                # Project documentation and deployment guide
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git**

### 2. Installation & Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/portfolio.git
   cd portfolio
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file inside the `backend/` directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Open `backend/.env` and configure:
   ```env
   # MongoDB Atlas Connection String
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

   # Server Port (Defaults to 5000)
   PORT=5000
   ```
   *(Note: If `MONGO_URI` is left blank during offline testing, the server gracefully serves sample project data and accepts messages without crashing).*

4. **Seed the database (Optional but recommended):**
   ```bash
   npm run seed
   ```

5. **Start the backend development server:**
   ```bash
   npm run dev
   ```
   The API will start at `http://localhost:5000` with Nodemon auto-reloading.

### 3. Frontend Setup

In a new terminal window, serve the `frontend/` folder:
- Using Python:
  ```bash
  cd frontend
  python -m http.server 3000
  ```
- Or using Node's `npx serve`:
  ```bash
  npx serve frontend -p 3000
  ```
- Or open `frontend/index.html` with VS Code **Live Server** (Port 5500).

Open your browser at **`http://localhost:3000`** (or your local server address).

---

## 📡 REST API Documentation

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `https://your-render-app.onrender.com/api`

---

### 1. Health Check
Checks if the backend server is operational.

* **URL:** `GET /api/health`
* **Headers:** None
* **Success Response (`200 OK`):**
  ```json
  {
    "status": "ok"
  }
  ```

---

### 2. Get All Projects
Fetches all portfolio projects sorted by creation date descending.

* **URL:** `GET /api/projects`
* **Method:** `GET`
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "_id": "65f000000000000000000001",
        "title": "E-Commerce Platform",
        "description": "A full-stack e-commerce web application with product search, category filtering, persistent shopping cart, and secure Stripe checkout workflow.",
        "techStack": ["Node.js", "Express", "MongoDB", "JavaScript", "CSS3", "Stripe API"],
        "imageUrl": "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
        "githubUrl": "https://github.com/example/ecommerce-platform",
        "liveUrl": "https://ecommerce-platform-demo.netlify.app",
        "featured": true,
        "createdAt": "2026-03-01T10:00:00.000Z"
      }
    ]
  }
  ```

---

### 3. Get Single Project by ID
Retrieves details of a specific project by its MongoDB ObjectId.

* **URL:** `GET /api/projects/:id`
* **Method:** `GET`
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "65f000000000000000000001",
      "title": "E-Commerce Platform",
      "description": "A full-stack e-commerce web application...",
      "techStack": ["Node.js", "Express", "MongoDB", "JavaScript", "CSS3"],
      "imageUrl": "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      "githubUrl": "https://github.com/example/ecommerce-platform",
      "liveUrl": "https://ecommerce-platform-demo.netlify.app",
      "featured": true,
      "createdAt": "2026-03-01T10:00:00.000Z"
    }
  }
  ```
* **Error Response (`404 Not Found`):**
  ```json
  {
    "success": false,
    "message": "Project not found with id: 65f000000000000000000999"
  }
  ```

---

### 4. Submit Contact Message
Validates and saves a contact form submission to MongoDB. Protected by rate limiting (max 5 submissions per 15 minutes per IP).

* **URL:** `POST /api/contact`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "name": "Alex Smith",
    "email": "alex.smith@example.com",
    "message": "Hello! I saw your portfolio and would like to connect about an internship opportunity."
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Message received",
    "data": {
      "id": "6a96bc162a3a409b242faf5e",
      "name": "Alex Smith",
      "email": "alex.smith@example.com",
      "createdAt": "2026-09-01T11:50:46.917Z"
    }
  }
  ```
* **Validation Error Response (`400 Bad Request`):**
  ```json
  {
    "success": false,
    "message": "Please provide a valid email address."
  }
  ```
* **Rate Limit Exceeded Response (`429 Too Many Requests`):**
  ```json
  {
    "success": false,
    "message": "Too many messages sent from this IP, please try again after 15 minutes."
  }
  ```

---

## 🌐 Production Deployment Guide

Follow these steps to deploy both frontend and backend for free:

### Step 1: MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free `M0` cluster.
2. In **Database Access**, create a user with a secure password.
3. In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** > **Drivers** > **Node.js** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### Step 2: Push Project to GitHub
Initialize your local git repository and push to GitHub:
```bash
git init
git add .
git commit -m "feat: complete full-stack portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 3: Deploy Backend on Render
1. Sign up at [Render.com](https://render.com/).
2. Click **New +** > **Web Service** and connect your GitHub repository.
3. Configure the service:
   - **Name:** `portfolio-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add:
   - `MONGO_URI` = `your_mongodb_atlas_connection_string`
   - `NODE_ENV` = `production`
5. Click **Create Web Service**.
6. Copy your deployed Render URL (e.g., `https://portfolio-api.onrender.com`).

### Step 4: Deploy Frontend on Netlify
1. Sign up at [Netlify.com](https://www.netlify.com/).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select your portfolio repository.
4. Configure build settings:
   - **Base directory:** `frontend` (or leave blank if using root `netlify.toml`)
   - **Publish directory:** `.` (or `frontend`)
   - **Build command:** *(leave empty)*
5. Click **Deploy Site**.
6. Copy your deployed Netlify URL (e.g., `https://my-portfolio.netlify.app`).

### Step 5: Final URL Synchronization
1. Open [`frontend/js/main.js`](frontend/js/main.js) and update `API_BASE_URL` with your Render URL:
   ```javascript
   const API_BASE_URL = 'https://portfolio-api.onrender.com/api';
   ```
2. Open [`backend/server.js`](backend/server.js) and ensure your Netlify domain is allowed in CORS.
3. Commit and push the changes:
   ```bash
   git add frontend/js/main.js backend/server.js
   git commit -m "chore: configure production URLs for Netlify and Render"
   git push
   ```
Netlify and Render will automatically trigger new builds and go live!

---

## 🔮 Known Limitations & Future Improvements

- **Admin Dashboard:** Adding an authenticated dashboard (JWT / OAuth) for creating, updating, and deleting projects directly through a web interface without database scripts.
- **Email Notifications:** Integrating Nodemailer or SendGrid to send automatic email alerts to your inbox whenever a new contact message is submitted.
- **Blog Section:** Adding a lightweight markdown-powered blog for sharing engineering insights and tutorials.
- **Dark/Light Theme Toggle:** Adding a client-side theme switcher with `localStorage` persistence.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
