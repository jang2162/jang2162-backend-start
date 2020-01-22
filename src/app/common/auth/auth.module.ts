import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {AuthProvider} from '@/app/common/auth/auth.provider';
import {databaseModule} from '@/app/common/database/database.module';
import {GraphQLModule} from '@graphql-modules/core';
import typeDefs from './auth.schema.graphql';

export const authModule = new GraphQLModule({
    typeDefs,
    providers: [
        AuthProvider,
        AuthInfoProvider
    ],
    imports: [
        databaseModule,
    ]
});