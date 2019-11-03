import 'graphql-import-node';
import 'reflect-metadata';

import express from 'express'
import http from 'http';
import env from 'json-env';
import apollo from './apollo';

const app = express();
apollo.applyMiddleware({ app }); // app is from an existing express app
const server = http.createServer(app);
apollo.installSubscriptionHandlers(server);

const host = env.getString('host', '127.0.0.1');
const port= env.getNumber('port', 4000);
server.listen({port, host}, () =>
    console.log(`GraphQL Server listening on http://${host==='0.0.0.0' ? '127.0.0.1' : host}:${port}${apollo.graphqlPath}`)
);