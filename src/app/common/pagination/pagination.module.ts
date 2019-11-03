import {GraphQLModule} from '@graphql-modules/core';
import {PaginationUtilProvider} from './pagination-util.provider';
import typeDefs from './pagination.schema.graphql';


export const paginationModule = new GraphQLModule({
    typeDefs,
    providers: [
        PaginationUtilProvider
    ]
});