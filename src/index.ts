import {createServer} from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import application from './app/application';
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
const executor = application.createApolloExecutor();
const app = express();
const httpServer = createServer(app);
const server = new ApolloServer<ApolloContext>({
    gateway: {
        async load() {
            return {executor}
        },
        onSchemaLoadOrUpdate() {
            return () => {};
        },
        async stop() {},
    },
    // schema,
    formatError: error => {
        logger.error(error.message, {
            path: error.path,
            code: error.extensions && error.extensions.code
        });
        return error;
    }
});
(async ()=>{
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(server, {
            context: async ctx => ctx,
        }),
    );
    const host = Env.SERVER_HOST;
    const port = Env.SERVER_PORT;
    await new Promise<void>((resolve) => httpServer.listen({ port, host }, resolve));
    console.log(`GraphQL Server listening on ${Env.NODE_ENV === 'production' ? 'https' : 'http'}://${host==='0.0.0.0' ? '127.0.0.1' : host}:${port}/graphql`)

})()
