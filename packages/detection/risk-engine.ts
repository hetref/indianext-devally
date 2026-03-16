export type RiskSignal = {
    name: string;
    weight: number;
    value: number;
};

export function calculateRiskScore(signals: RiskSignal[]): number {
    return signals.reduce((sum, signal) => sum + signal.weight * signal.value, 0);
}
