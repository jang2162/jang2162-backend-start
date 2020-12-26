import {createModule} from 'graphql-modules';
import {PaginationUtilProvider} from './pagination-util.provider';
import typeDefs from './pagination.schema.graphql';

export const paginationModule = createModule({
    id: 'pagination-module',
    typeDefs,
    providers: [
        PaginationUtilProvider
    ]
});