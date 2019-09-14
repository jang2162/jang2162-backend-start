import {logger} from '@/lib/ApolloUtil';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import resolvers from './app/resolvers';
import typeDefs from './app/typeDefs';

export interface ApolloContext {
    req: express.Request,
    loaders: {}
}

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        const context: ApolloContext = {
            req,
            loaders: {}
        };
        return context;
    },
    formatError: error => {
        logger.error(error.message, error.extensions && error.extensions.code);
        return error;
    }
});

export default apollo;

