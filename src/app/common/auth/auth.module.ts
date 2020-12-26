import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {AuthProvider} from '@/app/common/auth/auth.provider';
import {RoleProvider} from '@/app/common/auth/role.provider';
import {UserProvider} from '@/app/user/user.provider';
import {Resolvers} from '@/generated-models';
import {createModule} from 'graphql-modules';
import typeDefs from './auth.schema.graphql';

export const authModule = createModule({
    id: 'auth-module',
    typeDefs,
    providers: [
        AuthProvider,
        AuthInfoProvider,
        RoleProvider,
        UserProvider,
    ],
    resolvers: {
        Mutation: {
            authentication: (parent, args, {injector}) => injector.get<UserProvider>(UserProvider).authentication(args.id, args.pw),
            refreshToken: (parent, args, {injector}) => injector.get<AuthInfoProvider>(AuthInfoProvider).tokenRefresh(),
            invalidate: (parent, args, {injector}) => injector.get<AuthInfoProvider>(AuthInfoProvider).tokenInvalidate(),
        },
    } as Resolvers
});