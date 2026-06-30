# InternFlow 🚀

**InternFlow** is a feature-rich, full-stack Internship Management and Growth Platform designed to streamline the lifecycle of internships. It connects interns, mentors, and placement coordinators through interactive dashboards, project tracking, real-time collaboration, and developer stats integration.

## 🎬 Demo Video

[![InternFlow Demo - Watch on YouTube](https://img.youtube.com/vi/ZoWRuA7NKjY/maxresdefault.jpg)](https://youtu.be/ZoWRuA7NKjY)

> 🎬 *Click the thumbnail above to watch the full InternFlow demo on YouTube.*

---

## 🌟 Key Features

### 1. Developer Portfolio & GitHub Integration
- **Activity Tracker:** Real-time extraction of developer metrics (repositories, languages, commits, PRs, issues) via the GitHub API to measure intern contributions.
- **Growth Tracker:** Track developer skills progression and map milestones.

### 2. Task & Project Management
- **Kanban Board:** Drag-and-drop task workflow system powered by `@hello-pangea/dnd` (`react-beautiful-dnd`).
- **Sprint Management:** Group and track milestones within structured sprints.

### 3. Career & Placement Assistance
- **Resume Builder:** Automatically generate clean, downloadable PDF resumes via server-side rendering (`pdfkit`).
- **Placement Dashboard:** Manage and coordinate job listings, internship applications, and interviewer reviews.

### 4. Interactive Analytics & Communication
- **Data Visualization:** Beautiful charts analyzing performance, sprint velocities, and task progress using React and `Recharts` (fully optimized with `ResponsiveContainer`).
- **Real-Time Collaboration:** Instant feedback loops, comment systems, and live notifications driven by `Socket.io`.
- **System Actions:** Integrated email alerts utilizing `Nodemailer`.
- **Data Export:** Export intern records and evaluation data directly into spreadsheet-friendly formats (CSV via `json2csv`).

### 5. Enterprise-Grade Security
- **Role-Based Auth:** Secure authentication using JWT and cryptographically hashed passwords (`bcryptjs`).
- **Resilience:** Express Rate Limiters block auth route brute-forcing.
- **Database Pooling:** Optimized MySQL backend connection pools with foreign key index optimization to support fast `JOIN` query execution.
- **Security Headers:** Hardened Express security using `helmet` and `cors`.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Core Framework:** React 18 (Vite SPA template)
- **State Management:** Redux Toolkit & React Query (TanStack Query)
- **UI Framework:** Material UI (MUI) & Emotion
- **Charts:** Recharts
- **Drag & Drop:** `@hello-pangea/dnd`
- **Real-Time Gateway:** Socket.io Client

### Backend (`/server`)
- **Runtime:** Node.js (Express.js)
- **Database:** MySQL (using `mysql2` driver with database pool configurations)
- **Real-Time Server:** Socket.io
- **PDF Generation:** PDFKit
- **Validation:** Joi (Schema Validation)
- **Logger:** Winston & Morgan

---

## 📂 Project Structure

```text
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── api/            # API endpoints & integrations
│   │   ├── components/     # Reusable UI widgets
│   │   ├── contexts/       # Global contexts (Auth, Theme, etc.)
│   │   ├── pages/          # Full page views (Analytics, Auth, Dashboard, etc.)
│   │   ├── store/          # Redux slices
│   │   └── theme/          # Custom MUI styles
│   └── vercel.json         # Routing configuration for Vercel
│
├── server/                 # Backend Node Express application
│   ├── src/
│   │   ├── config/         # Server configurations
│   │   ├── database/       # Migrations and Seeds
│   │   ├── middleware/     # Security, rate limiter, & error-handling middleware
│   │   ├── modules/        # Module-based server controllers & services
│   │   └── server.js       # Main server entrance
│   └── render.yaml         # Deployment blueprint for Render.com
│
└── DEPLOYMENT.md           # In-depth Deployment & Operations guide
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL instance

### Setup Backend
```bash
cd server
cp .env.example .env     # Fill in your credentials
npm install
npm run migrate
npm run seed
npm run dev
```

### Setup Frontend
```bash
cd client
cp .env.example .env     # Fill in your API URL
npm install
npm run dev
```

---

## 🌐 Deployment

- **Frontend** → [Vercel](https://vercel.com) — Root Dir: `client`, Build: `npm run build`
- **Backend** → [Render](https://render.com) — Root Dir: `server`, Start: `npm start`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full guide.

---

## 👤 Author

**InternFlow Team**  
Built with ❤️ for streamlining the internship experience.
