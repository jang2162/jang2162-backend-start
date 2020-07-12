import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {
    AccessToken,
    Resolvers
} from '@/generated-models';
import {SimpleResolver} from '@/lib/apolloUtil';

const resolvers: Resolvers = {
    Mutation: {
        refreshToken: new SimpleResolver<any, AccessToken>().build(({injector}) =>
            injector.get<AuthInfoProvider>(AuthInfoProvider).tokenRefresh()
        ),
        invalidate: new SimpleResolver().build(({injector}) =>
            injector.get<AuthInfoProvider>(AuthInfoProvider).tokenInvalidate()
        )
    },
};

export default resolvers;