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
import express, {Request, Response} from 'express';
import {container, DependencyContainer} from 'tsyringe';
import {v4 as uuid4} from 'uuid';
import {Env} from './env';
import {createLogger, loggerEnvUtil} from './utils/createLogger';
import {GqlAppBuilderExpressMiddleware, InjectorWrapper, REQ_KEY, REQUEST, RESPONSE} from '@/utils/gqlAppBuilder';


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
const server = new ApolloServer({
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
        {

        }
    ],
});
(async ()=>{
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        cookieParser(),
        bodyParser.json(),
        GqlAppBuilderExpressMiddleware,
        expressMiddleware(server, {
            context: ctx => (ctx.req as any).injector,
        }),
    );
    const origin = Env.SERVER_ORIGIN;
    const port = Env.SERVER_PORT;
    await new Promise<void>((resolve) => httpServer.listen(port, resolve));
    console.log(`GraphQL Server listening on ${origin ?? `'http'://localhost:${port}`}/graphql`)
})()
