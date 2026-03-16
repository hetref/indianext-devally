export type Neo4jConfig = {
    uri: string;
    username: string;
    password: string;
};

export function createNeo4jClient(config: Neo4jConfig): Neo4jConfig {
    return config;
}
