import {IAccessToken, AuthProvider} from '@/app/common/auth/auth.provider';
import {RoleProvider} from '@/app/common/auth/role.provider';
import {SimpleResolveMiddleware} from '@/lib/ApolloUtil';
import {ModuleSessionInfo} from '@graphql-modules/core';
import {Injectable, ProviderScope} from '@graphql-modules/di';
import {ApolloError} from 'apollo-server-errors';


@Injectable({
    scope: ProviderScope.Session
})
export class AuthInfoProvider {
    private readonly err: number = -1;
    private readonly payload: any = null;

    constructor(
        private moduleSessionInfo: ModuleSessionInfo,
        private authProvider: AuthProvider,
    ) {
        const authorization: string = moduleSessionInfo.session.req &&
            moduleSessionInfo.session.req.headers &&
            moduleSessionInfo.session.req.headers.authorization || '';
        const res = /^Bearer (.*)$/.exec(authorization);

        if (res && res.length === 2) {
            const tokenParse = authProvider.verify(res[1]);
            this.err = tokenParse.err;
            this.payload = tokenParse.payload;
        }
    }

    getInfo() {
        if (this.err) {
            if (this.err === 1) {
                throw new ApolloError('', 'ACCESS_TOKEN_EXPIRED');
            } else {
                throw new ApolloError('', 'ACCESS_TOKEN_INVALID');
            }
        } else {
            return this.payload as IAccessToken
        }
    }

    tokenRefresh(refreshToken: string) {
        if (this.err) {
            if (this.err === 1) {
                return this.authProvider.refresh(this.payload as IAccessToken, refreshToken);
            } else {
                throw new ApolloError('', 'ACCESS_TOKEN_INVALID');
            }
        } else {
            throw new ApolloError('', 'ACCESS_TOKEN_NOT_EXPIRED');
        }
    }

    tokenInvalidate() {
        if (this.err) {
            if (this.err === 1) {
                throw new ApolloError('', 'ACCESS_TOKEN_EXPIRED');

            } else {
                throw new ApolloError('', 'ACCESS_TOKEN_INVALID');
            }
        } else {
            return this.authProvider.invalidate(this.payload);
        }
    }
}

export const authFilterMiddleware = {
    role(roles: string | string[]): SimpleResolveMiddleware {
        return {
            run: async ({injector}) => {
                const authInfo = injector.get<AuthInfoProvider>(AuthInfoProvider);
                const roleProvider = injector.get<RoleProvider>(RoleProvider);
                const payload = authInfo.getInfo();
                if (!await roleProvider.checkRole(roles, payload.rol)) {
                    throw new ApolloError('', 'ACCESS_PERMISSION_DENIED')
                }
            }
        }
    }
};

