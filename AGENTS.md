# Pravah — Agent Guidelines

## Stack
- **Frontend:** React 19 + Vite + TanStack Router + Zustand + Tailwind CSS 4
- **Backend:** Hono + Drizzle ORM + SQLite (Cloudflare Workers)
- **Package manager:** pnpm

## Commands

**Frontend:** `pnpm dev` (port 3001), `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm typecheck`
**Backend:** `pnpm dev` (wrangler), `pnpm deploy`, `pnpm lint`, `pnpm format`

## Conventions

- **Biome** (v2.0.6): single quotes, 2 spaces, run `pnpm lint && pnpm format` before commit
- **TypeScript:** strict mode, explicit return types helpful
- **Imports:** `@/` alias for source root, order: external → internal → utils
- **Naming:** files kebab-case, components PascalCase, functions camelCase, DB snake_case
- **API:** routes in `*.routes.ts`, controllers in `*.controllers.ts`, group in `modules/`

## Error Handling

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
Always check `error instanceof Error`. Use `stoker/http-status-codes` for HTTP codes.

## Key Paths
- Schema: `backend/src/db/schema.ts`
- Routes: `backend/src/modules/*/`
- Components: `frontend/src/components/`
- Migrations: `pnpm drizzle-kit migrate`

## Code Navigation & File Reading

**Primary principle: minimize context consumption.** Read outlines first, then targeted sections. Be surgical.

### Tool Hierarchy
| Need | Primary Tool | Approach |
|------|--------------|----------|
| Directory overview | grepika | `toc` |
| Find code (NL/regex) | grepika | `search` (requires index) |
| File structure | grepika | `outline` → `get` with line range |
| Symbol definitions | tilth | `search` — definition-first |
| What calls X? | tilth | `search kind:callers` |

### Quick Decision
- "Find files about X topic" → **grepika** (NL search)
- "Where is Y defined?" → **tilth** (structural)
- "What calls Z?" → **tilth** (callers)
- Regex/text pattern → **grepika** (grep mode)

## Notes
- Edge runtime (Cloudflare Workers)
- Sentry + PostHog integrated (no setup needed)
- No test framework (Vitest optional)
