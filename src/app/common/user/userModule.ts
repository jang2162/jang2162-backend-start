import {authFilterMiddleware, AuthInfoService} from '@/app/common/auth/authInfoService';
import {UserService} from '@/app/common/user/userService';
import {GqlAppBuilderModule} from '@/utils/gqlAppBuilder';

export const userModule: GqlAppBuilderModule = {
    resolvers: {
        Query: {
            selectMyInfo: injector => injector.resolve<UserService>(UserService).getMyInfo()
        }
    },
    middlewares: {
        Query: {
            selectMyInfo: [authFilterMiddleware.role('USER')]
        }
    }
}
