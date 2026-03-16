type HeaderValue = string | string[] | undefined;

type HttpRequest = {
    headers: Record<string, HeaderValue>;
};

type HttpReply = {
    header: (key: string, value: string) => void;
};

function fallbackRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function attachRequestId(request: HttpRequest, reply: HttpReply): void {
    const rawHeader = request.headers["x-request-id"];
    const requestId = typeof rawHeader === "string" ? rawHeader : fallbackRequestId();
    reply.header("x-request-id", requestId);
}
