import {GraphQLModule} from '@graphql-modules/core';
import 'graphql-import-node';
import {initResolver} from './initResolver';
import typeDefs from './initTypeDefs.graphql';

export const initModule = new GraphQLModule({
    typeDefs,
    resolvers: initResolver
});