import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {
    AccessToken,
    MutationRefreshTokenArgs,
    Resolvers
} from '@/generated-models';
import {SimpleResolver} from '@/lib/ApolloUtil';

const resolvers: Resolvers = {
    Mutation: {
        refreshToken: new SimpleResolver<MutationRefreshTokenArgs, AccessToken>().build(({injector, args}) =>
            injector.get<AuthInfoProvider>(AuthInfoProvider).tokenRefresh(args.refreshToken)
        ),
    },
};

export default resolvers;