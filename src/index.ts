import 'reflect-metadata';

import {createServer} from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {ApolloServerPluginLandingPageDisabled} from '@apollo/server/plugin/disabled';
import {
    ApolloServerPluginLandingPageLocalDefault
} from '@apollo/server/plugin/landingPage/default';
import {application} from 'application';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {Env} from './env';
import {ApolloContext} from './utils/apolloUtil';
import {createLogger, loggerEnvUtil} from './utils/createLogger';


const logger = createLogger<{path: any, code: any}>('APOLLO_ERROR', {
    ...loggerEnvUtil(
        Env.LOG_APOLLO_ERROR_LEVEL,
        Env.LOG_APOLLO_ERROR_CONSOLE_LEVEL,
        Env.LOG_APOLLO_ERROR_FILE_LEVEL,
        Env.LOG_APOLLO_ERROR_FILE_DIR
    ),
    consoleFormat: ({ message, subData, timestamp }) =>
        `${timestamp} [APOLLO_ERROR]: (${subData.path}${subData.code ? ', ' + subData.code : ''}) ${message}`
});
const app = express();
const httpServer = createServer(app);
const server = new ApolloServer<ApolloContext>({
    ...(application.build()),
    formatError: error => {
        logger.error(error.message, {
            path: error.path,
            code: error.extensions && error.extensions.code
        });
        return error;
    },
    plugins: [
        process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageLocalDefault({
                includeCookies: true
            }),
    ],
});
(async ()=>{
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        cookieParser(),
        expressMiddleware(server, {
            context: async ctx => ctx,
        }),
    );
    const origin = Env.SERVER_ORIGIN;
    const port = Env.SERVER_PORT;
    await new Promise<void>((resolve) => httpServer.listen(port, resolve));
    console.log(`GraphQL Server listening on ${origin ?? `'http'://localhost:${port}`}/graphql`)
})()
