export type DeviceFingerprint = {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
};

export function createDeviceFingerprint(input: DeviceFingerprint): DeviceFingerprint {
    return input;
}
