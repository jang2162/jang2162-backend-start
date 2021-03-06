import 'graphql-import-node';
import 'reflect-metadata';

import http from 'http';
import {Env} from '@/env';
import cookieParser from 'cookie-parser';
import express from 'express'
import apollo from './apollo';

const app = express();
const cp = cookieParser();
app.use(cp);

apollo.applyMiddleware({
    app,
    cors: {
        origin: Env.CORS_ORIGIN,
        credentials: true,
    },
}); // app is from an existing express app

const server = http.createServer(app);

apollo.installSubscriptionHandlers(server);

const host = Env.SERVER_HOST;
const port = Env.SERVER_PORT;
server.listen({port}, () =>
    console.log(`GraphQL Server listening on ${Env.NODE_ENV === 'production' ? 'https' : 'http'}://${host==='0.0.0.0' ? '127.0.0.1' : host}:${port}${apollo.graphqlPath}`)
);
