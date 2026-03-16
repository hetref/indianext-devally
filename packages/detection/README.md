# Detection Package

## Role In The Architecture
This package contains anomaly detection and risk scoring logic.
It combines deterministic security rules with model-driven signals to produce actionable risk outcomes.

## Technologies Used
- TypeScript domain logic
- Rule-based detection pipelines
- Extension points for ML model inference outputs
- Integrations with graph and database packages

## Service Interactions
- apps/api calls this package to score incoming authentication events.
- packages/graph contributes relationship-based intelligence signals.
- packages/db provides baseline and historical telemetry data.
- apps/ai-api can enrich this package with advanced model predictions.

## Scalability And Modularity Guidance
- Keep detectors and scoring policies isolated by concern.
- Version scoring formulas to support controlled rollouts.
- Expose pure functions for easy testing and reproducibility.
- Keep feature extraction separate from decision thresholds.

## Detection Focus
This package computes security risk scores by combining rule-based logic and ML-assisted anomaly indicators.
