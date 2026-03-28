# Workspace — ERP Venezuela

## Overview

ERP profesional optimizado para Venezuela con tasa BCV dinámica, 3 niveles de usuario y sistema de bloqueo comercial (Trial Gate).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Recharts + jsPDF
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── erp-venezuela/      # React frontend (main app at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Seed script for initial users and products
```

## ERP Features

### User Roles
- **DEVELOPER** (SuperAdmin): User management, manual BCV rate override
- **DUEÑO**: Dashboard, Inventory CRUD, Sales history, PDF Reports
- **CAJERA**: POS interface, Stock read-only view

### Default Accounts (seeded)
- `developer` / `dev2024!` — DEVELOPER role
- `dueno` / `dueno2024!` — DUEÑO role
- `cajera` / `cajera2024!` — CAJERA role

### Key Modules
- **BCV Rate Engine**: Scraper + manual override. Stored in DB, cached 4 hours.
- **Trial Gate**: Set `VITE_TRIAL_END_DATE=YYYY-MM-DD` to enable trial expiry block.
- **Inventory**: Products in USD, displayed in Bs using live rate.
- **POS**: Mobile-first point of sale with payment method selection.
- **PDF Reports**: jsPDF reports with totals, profit, top 5 products.

### Trial Gate
Set environment variable `VITE_TRIAL_END_DATE` to a date in format `YYYY-MM-DD`.
When today's date exceeds this value, all routes are blocked showing a full screen message.

WhatsApp contact link in `artifacts/erp-venezuela/src/components/TrialGuard.tsx` — update the number.

## API Routes

- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user
- `GET/POST /api/users` — User management (DEVELOPER only)
- `PATCH /api/users/:id` — Toggle user active/name
- `GET/POST /api/products` — Inventory
- `PUT/DELETE /api/products/:id` — Edit/delete product
- `GET/POST /api/sales` — Sales
- `GET /api/sales/summary` — Reports summary (DUEÑO)
- `GET /api/bcv/rate` — Current BCV rate
- `POST /api/bcv/rate` — Manual rate override (DEVELOPER)

## TypeScript & Composite Projects

- Always typecheck from root: `pnpm run typecheck`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Push DB schema: `pnpm --filter @workspace/db run push`
- Seed DB: `pnpm --filter @workspace/scripts run seed`
