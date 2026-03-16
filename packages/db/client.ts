export type DbClient = {
    query: <T>(operation: string, payload?: unknown) => Promise<T>;
};

export function createDbClient(): DbClient {
    return {
        query: async <T>(_operation: string): Promise<T> => {
            throw new Error("Database client is not initialized yet. Wire Prisma client generation before use.");
        },
    };
}

export const db = createDbClient();
