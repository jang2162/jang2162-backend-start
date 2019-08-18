import {logger} from '@/lib/ApolloUtil';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';

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

