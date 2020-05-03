import {authFilterMiddleware} from '@/app/common/auth/auth-info.provider';
import {
    AuthToken,
    MutationAddUserArgs,
    MutationAuthenticationArgs,
    Resolvers, User,
} from '@/generated-models';
import {SimpleResolver} from '@/lib/apolloUtil';
import {UserProvider} from './user.provider';

const resolvers: Resolvers = {
    Query: {
    },
    Mutation: {
        authentication: new SimpleResolver<MutationAuthenticationArgs, AuthToken>().build(({injector, args}) =>
            injector.get<UserProvider>(UserProvider).authentication(args.id, args.pw)
        ),
        addUser: new SimpleResolver<MutationAddUserArgs, User>(authFilterMiddleware.role('ROLE_ADMIN'))
            .build(({injector, args}) =>
                injector.get<UserProvider>(UserProvider).insertUser(args.user)
            )
    },
};

export default resolvers;