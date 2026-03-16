export type SessionUpdate = {
    sessionId: string;
    userId: string;
    event: "created" | "extended" | "ended";
    timestamp: string;
};

export function createSessionUpdate(update: SessionUpdate): SessionUpdate {
    return update;
}
