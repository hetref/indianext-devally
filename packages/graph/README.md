# Graph Intelligence Package

## Role In The Architecture
This package is the Neo4j integration layer for relationship intelligence.
It models connections between users, devices, IPs, sessions, and sites to uncover suspicious behavioral patterns.

## Technologies Used
- Neo4j client adapters
- TypeScript service layer for graph operations
- Query modules for reusable graph traversals

## Service Interactions
- apps/api uses this package to update graph relationships from incoming events.
- packages/detection consumes graph patterns to strengthen risk scoring.
- apps/ai-api uses graph-derived features for behavioral anomaly analysis.

## Scalability And Modularity Guidance
- Keep graph queries versioned and domain-scoped.
- Separate client connection lifecycle from graph business logic.
- Add read/write query boundaries to simplify scaling.
- Keep graph DTOs stable for cross-service integration.

## Why Graph + SQL
Neo4j captures relationship intelligence and coordinated behavior, while PostgreSQL stores the raw event source of truth.
