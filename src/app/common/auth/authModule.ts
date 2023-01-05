import {GqlAppBuilderModule, RESPONSE} from '@/utils/gqlAppBuilder';
import {AuthService} from '@/app/common/auth/authService';
import {Response} from 'express';
import {AuthInfoService} from '@/app/common/auth/authInfoService';

export const authModule: GqlAppBuilderModule = {
    resolvers: {
        Mutation: {
            authentication: injector => injector.resolve<AuthInfoService>(AuthInfoService).authenticationTest(0),
            refreshToken: injector => injector.resolve<AuthInfoService>(AuthInfoService).tokenRefresh(),
            invalidate: injector => injector.resolve<AuthInfoService>(AuthInfoService).tokenInvalidate()
        }
    }
}
