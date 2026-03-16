import { existsSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "../../../node_modules/.prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";
import { Pool } from "pg";

const envCandidates = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../packages/db/.env"),
    path.resolve(process.cwd(), "../../packages/db/.env"),
];

for (const envPath of envCandidates) {
    if (existsSync(envPath)) {
        loadEnv({ path: envPath });
    }
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
    throw new Error(
        "DATABASE_URL is not configured. Add it to apps/web/.env or packages/db/.env before starting the web app.",
    );
}

const pool = new Pool({
    connectionString: databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
