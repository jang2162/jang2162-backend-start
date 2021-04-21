import {authFilterMiddleware} from '@/app/common/auth/auth-info.provider';
import {ROLE_ADMIN} from '@/app/common/auth/role.provider';
import {Resolvers} from '@/generated-models';
import {createModule} from 'graphql-modules';
import {UserProvider} from './user.provider';
import * as typeDefs from './user.schema.graphql';

export const userModule = createModule({
    id: 'user-module',
    typeDefs,
    providers: [
        UserProvider
    ],
    middlewares: {
        Mutation: {
            addUser: [authFilterMiddleware.role(ROLE_ADMIN)]
        }
    },
    resolvers: {
        Query: {
            userById: (parent, args, {injector}) => injector.get<UserProvider>(UserProvider).userById(args.id),
            users: (parent, args, {injector}) => injector.get<UserProvider>(UserProvider).getUserConnection(args.search, args.page),
        },
        Mutation: {
            addUser: (parent, args, {injector}) =>  injector.get<UserProvider>(UserProvider).insertUser(args.user)
        }
    } as Resolvers,
});
