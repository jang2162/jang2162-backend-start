import 'reflect-metadata';

import {createServer} from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import {application} from './app/application';
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
    plugins: []
});
(async ()=>{
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            credentials: true,
            origin: 'http://localhost.com:4200'
        }),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ctx => ctx,
        }),
    );
    const host = Env.SERVER_HOST;
    const port = Env.SERVER_PORT;
    await new Promise<void>((resolve) => httpServer.listen(port, resolve));
    console.log(`GraphQL Server listening on ${Env.NODE_ENV === 'production' ? 'https' : 'http'}://${host==='0.0.0.0' ? '127.0.0.1' : host}:${port}/graphql`)

})()
