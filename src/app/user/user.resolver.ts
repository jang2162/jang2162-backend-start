import {
    AuthToken,
    MutationAddUserArgs,
    MutationAuthenticationArgs,
    Resolvers, User,
} from '@/generated-models';
import {simpleResolve} from '@/lib/ApolloUtil';
import {UserProvider} from './user.provider';

const resolvers: Resolvers = {
    Query: {
    },
    Mutation: {
        authentication: simpleResolve<MutationAuthenticationArgs, AuthToken>(({injector, args}) =>
            injector.get<UserProvider>(UserProvider).authentication(args.id, args.pw)
        ),
        addUser: simpleResolve<MutationAddUserArgs, User>(({injector, args}) =>
            injector.get<UserProvider>(UserProvider).insertUser(args.user)
        )
    },
};

export default resolvers;