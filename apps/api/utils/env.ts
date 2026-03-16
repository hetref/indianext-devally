export function requiredEnv(name: string): string {
    const envStore = globalThis as { process?: { env?: Record<string, string | undefined> } };
    const value = envStore.process?.env?.[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}
