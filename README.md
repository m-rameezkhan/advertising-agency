# Advertising Agency SaaS Assessment Project

This repository contains a complete full-stack SaaS-style implementation of the assessment, organized by task:

- `1.1` React dashboard with local JSON data, charts, filters, dark mode, and responsive layout
- `1.2` AI-assisted creative brief builder with multi-step form and PDF export
- `2.1` Express + PostgreSQL campaign management API with JWT auth, validation, rate limiting, soft deletes, and OpenAPI
- `2.2` Docker-ready AI content generation microservice with structured logging, request IDs, SSE, and env-based secrets
- `2.3` Real-time notification system with Socket.IO, alert rules, persisted history, and React notification center

## Monorepo Layout

- `apps/web` - React + Vite + Tailwind frontend
- `apps/api` - Campaign management API and notifications server
- `apps/ai-service` - AI microservice for copy generation and creative brief support
- `infra/db/schema.sql` - PostgreSQL schema
- `docs/openapi.yaml` - OpenAPI spec

## Quick Start

1. Copy `.env.example` to `.env`
2. Fill in the API keys and database values
3. Install dependencies:

```bash
npm install
```

4. Run PostgreSQL and execute:

```bash
psql "$DATABASE_URL" -f infra/db/schema.sql
```

If you already have another PostgreSQL server on `5432`, update the project database URL and Docker port to use a different host port such as `5433`.

5. Start the apps in separate terminals:

```bash
npm run dev:web
npm run dev:api
npm run dev:ai
```

## Extra Features Added

- Executive summary panel on the dashboard
- API health cards in the frontend
- Notification center with unread tracking
- Alert rule configuration seeded per campaign
- AI creative brief endpoint in the microservice for richer `1.2` output
