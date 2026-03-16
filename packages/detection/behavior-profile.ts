export type BehaviorProfile = {
    userId: string;
    avgDailyLogins: number;
    knownIpCount: number;
    knownDeviceCount: number;
};

export function defaultBehaviorProfile(userId: string): BehaviorProfile {
    return {
        userId,
        avgDailyLogins: 0,
        knownIpCount: 0,
        knownDeviceCount: 0,
    };
}
