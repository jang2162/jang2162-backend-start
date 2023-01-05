import {AuthInfoService} from '@/app/common/auth/authInfoService';
import {GqlAppBuilderModule} from '@/utils/gqlAppBuilder';

export const authModule: GqlAppBuilderModule = {
    resolvers: {
        Mutation: {
            authentication: injector => injector.resolve<AuthInfoService>(AuthInfoService).authenticationTest(0),
            refreshToken: injector => injector.resolve<AuthInfoService>(AuthInfoService).tokenRefresh(),
            invalidate: injector => injector.resolve<AuthInfoService>(AuthInfoService).tokenInvalidate()
        }
    }
}
