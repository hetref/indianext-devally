export type RiskScoreResult = {
    userId: string;
    sessionId: string;
    score: number;
    reasons: string[];
};

export function scoreSession(userId: string, sessionId: string): RiskScoreResult {
    return {
        userId,
        sessionId,
        score: 0,
        reasons: ["Model pipeline not initialized"],
    };
}
