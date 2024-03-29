import 'reflect-metadata';

import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { application } from './application';
import { Env } from './env';
import { createLogger, loggerEnvUtil } from '@/utils/createLogger';
import {
    GqlAppBuilderContext,
    gqlAppBuilderPlugin,
    gqlAppBuilderContextMapper,
} from '@/utils/gqlAppBuilder';

const logger = createLogger<{ path: any; code: any }>('APOLLO_ERROR', {
    ...loggerEnvUtil(
        Env.LOG_APOLLO_ERROR_LEVEL,
        Env.LOG_APOLLO_ERROR_CONSOLE_LEVEL,
        Env.LOG_APOLLO_ERROR_FILE_LEVEL,
        Env.LOG_APOLLO_ERROR_FILE_DIR,
    ),
    consoleFormat: ({ message, subData, timestamp }) =>
        `${timestamp} [APOLLO_ERROR]: (${subData.path}${
            subData.code ? ', ' + subData.code : ''
        }) ${message}`,
});
const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema(application.build());

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<GqlAppBuilderContext>({
    schema,
    formatError: (error) => {
        logger.error(error.message, {
            path: error.path,
            code: error.extensions && error.extensions.code,
        });
        return error;
    },
    plugins: [
        Env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageLocalDefault({
                  includeCookies: true,
              }),
        gqlAppBuilderPlugin,
        ApolloServerPluginDrainHttpServer({ httpServer }),

        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

(async () => {
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: Env.CORS_ORIGIN,
            credentials: Env.CORS_CREDENTIALS,
        }),
        cookieParser(),
        bodyParser.json(),
        expressMiddleware<GqlAppBuilderContext>(server, {
            context: gqlAppBuilderContextMapper,
        }),
    );
    const origin = Env.SERVER_ORIGIN;
    const port = Env.SERVER_PORT;
    await new Promise<void>((resolve) => httpServer.listen(port, resolve));
    console.log(
        `GraphQL Server listening on ${
            origin ?? `'http'://localhost:${port}`
        }/graphql`,
    );
})();
