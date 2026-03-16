type HttpRouteRegistrar = {
    get: (path: string, handler: () => Promise<{ ok: boolean; service: string }> | { ok: boolean; service: string }) => void;
};

export function registerHealthRoute(app: HttpRouteRegistrar): void {
    app.get("/health", async () => ({ ok: true, service: "api" }));
}
