import 'graphql-import-node';
import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express'
import http from 'http';
import env from 'json-env';
import apollo from './apollo';

const app = express();
app.use(cookieParser())
if (env.getBool('cors', false)) {
    app.use(cors());
}

apollo.applyMiddleware({ app }); // app is from an existing express app
const server = http.createServer(app);

apollo.installSubscriptionHandlers(server);

const host = env.getString('host', '127.0.0.1');
const port= env.getNumber('port', 4200);
server.listen({port, host}, () =>
    console.log(`GraphQL Server listening on ${env.getBool('production', false) ? 'https' : 'http'}://${host==='0.0.0.0' ? '127.0.0.1' : host}:${port}${apollo.graphqlPath}`)
);