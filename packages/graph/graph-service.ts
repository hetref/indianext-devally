import type { Neo4jConfig } from "./neo4j-client";

export type SessionRelationship = {
    userId: string;
    sessionId: string;
    ipAddress: string;
    deviceId: string;
    siteId: string;
};

export function upsertSessionRelationship(_client: Neo4jConfig, relationship: SessionRelationship): SessionRelationship {
    return relationship;
}
