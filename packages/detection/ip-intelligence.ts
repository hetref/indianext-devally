export type IpIntelligence = {
    ipAddress: string;
    isProxy: boolean;
    reputationScore: number;
};

export function evaluateIp(ipAddress: string): IpIntelligence {
    return {
        ipAddress,
        isProxy: false,
        reputationScore: 0.5,
    };
}
