export type AnomalyDecision = {
    isAnomalous: boolean;
    reason: string;
};

export function detectAnomaly(score: number, threshold = 0.7): AnomalyDecision {
    return {
        isAnomalous: score >= threshold,
        reason: score >= threshold ? "threshold_exceeded" : "within_baseline",
    };
}
