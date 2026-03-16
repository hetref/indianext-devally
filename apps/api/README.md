# API Service

## Role In The Architecture
The API service is the central ingestion layer for the security platform.
It receives telemetry from the SDK, manages sessions and alerts, coordinates with detection services, writes event data to PostgreSQL through Prisma, and updates graph relationships in Neo4j.

## Technologies Used
- Node.js runtime
- Fastify for HTTP APIs
- TypeScript for type safety and maintainability
- Prisma client from packages/db for PostgreSQL access
- Neo4j integration via packages/graph

## Service Interactions
- Receives login and auth telemetry from packages/sdk consumers.
- Serves apps/web with security analytics and alert data through REST and optional WebSocket channels.
- Calls packages/detection to compute anomaly and risk scores.
- Persists canonical event records using packages/db.
- Emits relationship updates through packages/graph for behavioral intelligence.

## Scalability And Modularity Guidance
- Keep routes, controllers, and services separated by domain.
- Isolate external integrations behind adapters to avoid tight coupling.
- Add asynchronous queues for high-volume ingestion paths.
- Keep request validation and middleware reusable and stateless.
- Scale reads and writes independently by splitting command and query flows over time.
