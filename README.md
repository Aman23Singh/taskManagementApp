# Task Management System

Full-stack task management app with an Express + Prisma API and a Next.js (App Router) frontend.

## Features
- Email/password authentication with access and refresh tokens
- Create, list, update, delete, and toggle tasks
- Search and status filtering with pagination
- Responsive UI built with Tailwind CSS

## Tech Stack
- Backend: Node.js, Express, Prisma, SQLite, Zod
- Frontend: Next.js, React, Tailwind CSS

## Project Structure
- backend: REST API, Prisma schema, migrations
- frontend: Next.js app, UI components, client-side auth

## Prerequisites
- Node.js 18+
- npm 9+

## Environment Variables
Backend (backend/.env):
- DATABASE_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN (optional)
- JWT_REFRESH_EXPIRES_IN (optional)
- PORT (optional, defaults to 4000)

Frontend (frontend/.env.local):
- NEXT_PUBLIC_API_URL (example: http://localhost:4000)

## Setup
1. Install backend dependencies.
2. Install frontend dependencies.
3. Configure environment variables.
4. Run Prisma migrations.
5. Start the backend and frontend.

## Scripts
Backend (backend):
- dev
- build
- start
- prisma:generate
- prisma:migrate

Frontend (frontend):
- dev
- build
- start
- lint

## API Endpoints
- GET /health
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /tasks
- GET /tasks/:id
- POST /tasks
- PATCH /tasks/:id
- DELETE /tasks/:id
- POST /tasks/:id/toggle

## Notes
- SQLite is used for local development by default.
- The frontend expects the backend URL via NEXT_PUBLIC_API_URL.
