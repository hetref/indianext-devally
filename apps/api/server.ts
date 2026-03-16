import Fastify from "fastify";

import { registerHealthRoute } from "./routes/health";

const app = Fastify({ logger: true });

registerHealthRoute(app);

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

app
    .listen({ port, host })
    .then(() => {
        app.log.info({ port, host }, "API server running");
    })
    .catch((error) => {
        app.log.error(error, "Failed to start API server");
        process.exit(1);
    });
