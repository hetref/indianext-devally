export type LoginTelemetry = {
    userId: string;
    siteId: string;
    sessionId: string;
    ipAddress: string;
    browser: string;
    device: string;
    timestamp: string;
};

export function buildLoginTelemetry(input: LoginTelemetry): LoginTelemetry {
    return {
        ...input,
        browser: input.browser.trim(),
        device: input.device.trim(),
    };
}
