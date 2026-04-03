# AI-Based Advertising Agency Campaign Management System (SaaS)

A full-stack advertising agency dashboard built as a monorepo with a React frontend, Express API, PostgreSQL database, and AI microservice. The project is now wired end-to-end for live campaign management, authentication, analytics, notifications, and AI-safe fallback content generation.

## Features

- JWT-based authentication with login and signup
- Responsive SaaS dashboard with collapsible sidebar and premium header
- Live KPI cards powered by database campaign data
- Dynamic campaign table with create, edit, and soft delete
- Analytics charts with `7d`, `30d`, `90d`, and custom date ranges
- Client portfolio view derived from live campaign data
- Real-time alert history via Socket.IO notifications
- AI creative brief and content generation with safe fallback mode when no API key is available
- Dark mode and light mode support
- PostgreSQL persistence with seeded sample campaigns
- OpenAPI documentation for the backend API

## Monorepo Structure

- `apps/web` - React + Vite + Tailwind frontend
- `apps/api` - Express API, JWT auth, campaign CRUD, alerts, Socket.IO
- `apps/ai-service` - AI microservice with fallback content generation
- `infra/db/schema.sql` - PostgreSQL schema and seed data
- `docs/openapi.yaml` - API contract
- `docker-compose.yml` - local PostgreSQL and AI service containers

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Chart.js
- Backend: Node.js, Express, PostgreSQL, Socket.IO, JWT
- AI Service: Node.js, Express
- Database: PostgreSQL 16 via Docker

## Prerequisites

- Node.js 20+ or newer
- npm
- Docker Desktop

## After Clone: Full Setup

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Create environment file

Copy `.env.example` to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Recommended `.env` values for the included Docker setup:

```env
JWT_SECRET=replace-with-a-long-secret
OPENAI_API_KEY=replace-with-your-openai-key
DATABASE_URL=postgresql://postgres:rameez@localhost:5433/ad_agency_saas

API_PORT=4000
APP_USER_NAME=admin
APP_USER_EMAIL=admin@agency.local
APP_USER_PASSWORD=admin
CLIENT_ORIGIN=http://localhost:5173

AI_SERVICE_PORT=4010
LLM_MODEL=gpt-4.1-mini

VITE_API_URL=http://localhost:4000/api
VITE_AI_SERVICE_URL=http://localhost:4010
VITE_SOCKET_URL=http://localhost:4000
```

Notes:

- `OPENAI_API_KEY` is optional for local development. If it is missing, the AI service runs in safe fallback mode.
- `DATABASE_URL` must match the PostgreSQL password configured in `docker-compose.yml`.

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

The local database is exposed on host port `5433`, not `5432`.

On a fresh Docker volume, the schema in `infra/db/schema.sql` is loaded automatically.

### 4. Start the applications

You can run all services together from the repo root:

```bash
npm start
```

Or run them separately:

```bash
npm run dev:api
npm run dev:web
npm run dev:ai
```

### 5. Open the app

- Frontend: `http://localhost:5173`
- API health: `http://localhost:4000/api/health`
- AI health: `http://localhost:4010/generate/health`

### 6. Default login

Use either the username or email:

- Username: `admin`
- Email: `admin@agency.local`
- Password: `admin`

## How To Use The App

### Authentication

- Open the frontend at `http://localhost:5173`
- Log in with the default admin credentials or create a new account from the signup page

### Dashboard

- View live KPIs for impressions, clicks, CTR, conversions, spend, and ROAS
- Review performance charts using preset date filters or a custom range
- Monitor alert notifications from the header notification center

### Campaigns

- Go to `/campaigns`
- Create a new campaign with the `New campaign` button
- Edit an existing campaign from the table
- Soft delete campaigns without removing them permanently from the database

### Clients

- Go to `/clients`
- Review client summaries and live campaign rollups derived from database records

### Analytics

- Go to `/analytics`
- Explore campaign trends and range-based reporting

### AI Briefs

- Go to `/brief`
- Generate creative brief structure and content suggestions
- If no external API key is configured, fallback responses are returned instead of crashing

### Settings

- Go to `/settings`
- Toggle dark mode and review workspace-related account settings

## Backend API

Base URL:

```text
http://localhost:4000/api
```

### Auth

- `POST /auth/signup`
- `POST /auth/login`

### Campaigns

- `GET /campaigns`
- `GET /campaigns/:id`
- `POST /campaigns`
- `PUT /campaigns/:id`
- `DELETE /campaigns/:id`

`GET /campaigns` supports query params:

- `page`
- `limit`
- `status`
- `search`
- `sort`
- `direction`

Write routes require a JWT bearer token. The frontend handles token storage automatically after login.

### Alerts

- `GET /alerts`

### Health

- `GET /health`

## AI Service Endpoints

Base URL:

```text
http://localhost:4010/generate
```

- `POST /copy`
- `POST /social`
- `POST /hashtags`
- `POST /brief`
- `GET /health`

If `OPENAI_API_KEY` is missing or still set to a placeholder, the service returns structured fallback content.

## Database Notes

- Database name: `ad_agency_saas`
- Container name: `ad-agency-postgres`
- Host port: `5433`
- Internal container port: `5432`
- Schema file: `infra/db/schema.sql`

If you already started PostgreSQL with an old volume and the schema did not initialize correctly, recreate the database container and volume:

```bash
docker compose down -v
docker compose up -d postgres
```

Use this only if you are okay with wiping local database data.

## Useful Commands

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev:web
```

Run API:

```bash
npm run dev:api
```

Run AI service:

```bash
npm run dev:ai
```

Run all apps:

```bash
npm start
```

Build frontend:

```bash
npm run build --workspace apps/web
```

## Manual Test Checklist

- Start Docker PostgreSQL successfully
- Start API and confirm `Postgres connection established.`
- Start frontend and log in with `admin / admin`
- Open dashboard and verify KPIs are populated from live data
- Create a campaign and confirm the table refreshes
- Edit a campaign and confirm KPIs and charts update
- Delete a campaign and confirm it disappears from active views
- Open analytics and test `7d`, `30d`, `90d`, and custom range filters
- Open brief generation and verify fallback output works without an external API key
- Open notifications from the header and confirm the panel displays correctly

## Deployment Notes

- Build the frontend with `npm run build --workspace apps/web`
- Deploy the API and AI service with production environment variables
- Use a production PostgreSQL database and set `DATABASE_URL` accordingly
- Configure the frontend host to rewrite unknown routes to `index.html` because the app uses client-side routing
- Set a strong `JWT_SECRET` in production

## Submission Summary

This project is submission-ready with:

- Live dashboard data from PostgreSQL
- Full campaign CRUD
- Authentication
- Responsive multi-page frontend
- AI fallback mode
- Notifications
- Docker-based local database setup
