import {commonModule} from '@/app/common/common.module';
import {GraphQLModule} from '@graphql-modules/core';
import {UserProvider} from './user.provider';
import resolvers from './user.resolver';
import * as typeDefs from './user.schema.graphql';

export const userModule = new GraphQLModule({
    typeDefs,
    resolvers,
    providers: [
        UserProvider
    ],
    imports: [
        commonModule,
    ]
});