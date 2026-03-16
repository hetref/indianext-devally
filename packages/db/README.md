# Database Package

## Role In The Architecture
This package is the shared database layer for PostgreSQL (Neon).
It centralizes Prisma access so all services use one consistent data contract.

## Technologies Used
- PostgreSQL (Neon)
- Prisma ORM for migrations and type-safe queries
- TypeScript for shared, typed database access

## Service Interactions
- apps/api uses this package to persist and query telemetry, sessions, and alerts.
- apps/ai-api can use this package for historical behavior baselines.
- packages/detection consumes event and profile data through this package.

## Scalability And Modularity Guidance
- Keep Prisma schema changes backward compatible where possible.
- Group query logic by domain and avoid service-specific coupling.
- Use migration discipline and review indexes for high-volume event tables.
- Expose stable interfaces so app services can evolve independently.

## Planned Schema Domains
The schema will evolve to include users, sites, sessions, login_events, and alerts.
