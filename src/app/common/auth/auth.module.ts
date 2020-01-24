import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {AuthProvider} from '@/app/common/auth/auth.provider';
import {RoleProvider} from '@/app/common/auth/role.provider';
import {databaseModule} from '@/app/common/database/database.module';
import {loggerModule} from '@/app/common/logger/logger.module';
import {GraphQLModule} from '@graphql-modules/core';
import resolvers from './auth.resolver';
import typeDefs from './auth.schema.graphql';

export const authModule = new GraphQLModule({
    typeDefs,
    resolvers,
    providers: [
        AuthProvider,
        AuthInfoProvider,
        RoleProvider
    ],
    imports: [
        databaseModule,
        loggerModule
    ]
});