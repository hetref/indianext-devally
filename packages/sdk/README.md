# Security SDK Package

## Role In The Architecture
This package is the developer SDK distributed as an npm package.
It captures authentication telemetry and sends normalized security events to the platform ingestion API.

## Technologies Used
- TypeScript library package
- Fetch-based HTTP transport for broad compatibility
- Lightweight metadata collectors for device and browser context

## Service Interactions
- Installed by external applications that want login security monitoring.
- Sends login and session telemetry to apps/api ingestion endpoints.
- Supports downstream scoring and alerting by packages/detection and apps/ai-api.

## Scalability And Modularity Guidance
- Keep trackers decoupled from transport implementations.
- Version event payload contracts explicitly.
- Add optional batching and retry layers without changing public API.
- Keep runtime dependencies minimal for easy adoption.

## SDK Responsibilities
The SDK collects metadata such as device, IP, browser, and timestamp, then forwards telemetry to the platform.
