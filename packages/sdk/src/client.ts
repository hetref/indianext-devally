export type SecurityEventTransport = (payload: Record<string, unknown>) => Promise<void>;

export type SdkClientOptions = {
    endpoint: string;
    apiKey?: string;
    transport?: SecurityEventTransport;
};

export function createSdkClient(options: SdkClientOptions): SecurityEventTransport {
    if (options.transport) {
        return options.transport;
    }

    return async (payload: Record<string, unknown>) => {
        await fetch(options.endpoint, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...(options.apiKey ? { authorization: `Bearer ${options.apiKey}` } : {}),
            },
            body: JSON.stringify(payload),
        });
    };
}
