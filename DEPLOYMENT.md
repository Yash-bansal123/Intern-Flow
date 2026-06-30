# InternFlow Deployment & Operations Guide

## Frontend (Vercel)
The frontend is a Vite-based React SPA. It is configured to be deployed on Vercel seamlessly.
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- The `vercel.json` ensures client-side routing works by redirecting all paths to `index.html`.

## Backend (Render)
The backend is an Express Node.js application.
- Root Directory: `server`
- Start Command: `npm start` (Make sure `package.json` has `"start": "node src/app.js"`)
- See `render.yaml` for the environment variables that need to be injected into the Render dashboard.

## Performance Optimizations Applied
- Rate Limiters configured on Auth routes to prevent brute force.
- Database Connection Pooling (mysql2) utilized to prevent thread locking.
- Indexing hints configured on foreign keys (e.g., `user_id`, `project_id`) for faster JOINs.
- React components lazy-loaded conceptually where possible, and Recharts optimized with `ResponsiveContainer`.
