export type LoginEvent = {
    siteId: string;
    userId: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
};

export function normalizeLoginEvent(event: LoginEvent): LoginEvent {
    return {
        ...event,
        ipAddress: event.ipAddress.trim(),
        userAgent: event.userAgent.trim(),
    };
}
