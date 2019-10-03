import {GraphQLModule} from '@graphql-modules/core';
import resolvers from './init.resolver';
import typeDefs from './init.schema.graphql';

export const initModule = new GraphQLModule({
    typeDefs,
    resolvers
});