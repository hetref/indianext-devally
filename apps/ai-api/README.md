# AI API Service

## Role In The Architecture
This service provides anomaly detection and behavioral intelligence for the platform.
It evaluates authentication activity, computes risk scores, and exposes scoring endpoints consumed by the central API.

## Technologies Used
- Node.js or Python friendly project layout
- TypeScript starter scaffolding for service contracts
- Neo4j-backed graph analysis integration patterns
- HTTP endpoint layer for internal scoring calls

## Service Interactions
- Receives scoring requests and event context from apps/api.
- Uses graph intelligence features from packages/graph.
- Can consume historical baselines from packages/db.
- Returns anomaly classifications and risk scores back to apps/api.

## Scalability And Modularity Guidance
- Keep model definitions, pipelines, and API transport layers isolated.
- Treat feature generation as versioned pipelines.
- Run inference workers independently from API ingress.
- Add batch and streaming execution paths without changing contracts.
- Keep model and graph adapters pluggable to support experimentation.
