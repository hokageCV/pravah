# Agent Guidelines for Pravah

This document provides guidelines for agents working on the Pravah codebase.

## Project Overview

Pravah is a habit tracking application with:
- Frontend: React 19 + Vite + TanStack Router + Zustand + Tailwind CSS 4
- Backend: Hono + Drizzle ORM + SQLite (Cloudflare Workers)
- Package Manager: pnpm

## Build/Lint/Test Commands

### Frontend (`/frontend`)
```bash
pnpm dev          # Start dev server on port 3001
pnpm build        # Production build
pnpm serve        # Preview production build
pnpm lint         # Lint with Biome (fixes issues)
pnpm format       # Format with Biome
pnpm typecheck    # TypeScript type checking
```

### Backend (`/backend`)
```bash
pnpm dev          # Start dev server (wrangler)
pnpm deploy       # Deploy to Cloudflare Workers
pnpm lint         # Lint with Biome (fixes issues)
pnpm format       # Format with Biome
```

### Running a Single Test
There are currently no tests in this project. Tests are not required but can be added using Vitest if needed.

## Code Style Guidelines

### Formatting & Linting
- Tool: Biome (v2.0.6)
- Quotes: Single quotes for both JavaScript and JSX
- Indentation: 2 spaces
- Run before commit: Always run `pnpm lint && pnpm format` before committing
- Config locations: `frontend/biome.json` and `backend/biome.json`

### TypeScript
- All code must be written in TypeScript
- Enable strict type checking
- Use explicit return types for functions when helpful

### Import Conventions
- Use path aliases: `@/` for source root (e.g., `@/db`, `@/modules/auth`)
- Order imports: external libs → internal modules → local utils
- Run Biome's import organization: `biome check --write --organize-imports-enabled=true`

### Naming Conventions
- Files: kebab-case (e.g., `auth.controllers.ts`, `habit-list.tsx`)
- Components: PascalCase (e.g., `HabitList`, `PathNotFound`)
- Functions/variables: camelCase
- Database tables/schemas: snake_case (e.g., `users`, `habit_logs`)

### Error Handling

Backend (Hono):
```typescript
try {
  // operation
} catch (error) {
  return c.json(
    { error: error instanceof Error ? error.message : 'Fallback message' },
    HttpStatusCodes.INTERNAL_SERVER_ERROR
  );
}
```
- Always check for `error instanceof Error` before accessing `error.message`
- Use `stoker` library for HTTP status codes: `import * as HttpStatusCodes from 'stoker/http-status-codes'`

Frontend:
- Use error boundaries for component errors
- Leverage Sentry for error tracking (already configured in `main.tsx`)
- Use React Query's error handling for API failures

### Database & ORM
- Use Drizzle ORM for all database operations
- Use Zod schemas for validation (`@hono/zod-openapi`)
- Schema files in `backend/src/db/schema.ts`
- Run migrations with `pnpm drizzle-kit migrate`

### API Design
- Use OpenAPI with Zod openapi (`@hono/zod-openapi`)
- Define routes in `*.routes.ts` files
- Define controllers in `*.controllers.ts` files
- Group related functionality in `modules/` directory

### React/Frontend Patterns
- Use TanStack Router with file-based routing (`createFileRoute`)
- Use Zustand for global state management
- Use React Query (`@tanstack/react-query`) for server state
- Use Tailwind CSS for styling (v4 with `@tailwindcss/vite`)
- Components go in `src/components/`, routes in `src/routes/`

### Environment Variables
- Never commit secrets to `.env` files
- Use `.env.example` for required variables
- Frontend variables: `VITE_*` prefix
- Backend variables: defined in `wrangler.toml` and accessed via `c.env`

## Key Files & Directories

```
pravah/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── routes/         # TanStack Router routes
│   │   ├── utils/          # Utility functions
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── biome.json
├── backend/
│   ├── src/
│   │   ├── db/             # Drizzle schema & migrations
│   │   ├── lib/            # App setup & types
│   │   ├── middlewares/    # Custom middleware
│   │   ├── modules/        # Feature modules (auth, habits, groups, etc.)
│   │   └── index.ts        # Entry point
│   ├── package.json
│   ├── wrangler.toml
│   └── biome.json
└── README.md
```

## Development Workflow

1. Make changes in appropriate `frontend/` or `backend/` directory
2. Run typecheck: `pnpm typecheck` (frontend) or check TS manually
3. Run linter: `pnpm lint`
4. Run formatter: `pnpm format`
5. Test locally with `pnpm dev`
6. Build to verify: `pnpm build`

## Important Notes

- Backend runs on Cloudflare Workers (Edge runtime)
- No test framework is currently set up
- The project uses pnpm workspaces implicitly via separate directories
- PostHog and Sentry are already integrated for analytics/error tracking
