import {AuthProvider, IAccessToken} from '@/app/common/auth/auth.provider';
import {RoleProvider} from '@/app/common/auth/role.provider';
import {ApolloError} from 'apollo-server-errors';
import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
import {Injectable, Scope, CONTEXT, Inject, Middleware} from 'graphql-modules';

@Injectable({
    scope: Scope.Operation,
    global: true
})
export class AuthInfoProvider {
    private readonly err: number = -1;
    private readonly payload: any = null;

    constructor(
        private authProvider: AuthProvider,
        @Inject(CONTEXT) private context: ExpressContext
    ) {
        const token: string = context.req.cookies?.token ?? '';
        if (token) {
            const tokenParse = authProvider.verify(token);
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

    async authentication(uid: number, salt: string) {
        await this.authProvider.authentication(this.context.res, uid, salt);
    }

    async tokenRefresh() {
        if (this.err) {
            if (this.err === 1) {
                return await this.authProvider.refresh(this.context.res, this.payload as IAccessToken);
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
            return this.authProvider.invalidate(this.context.res, this.payload as IAccessToken);
        }
    }
}

export const authFilterMiddleware = {
    role(roles: string | string[]): Middleware {
        return async ({context}, next) => {
            const authInfo = context.injector.get<AuthInfoProvider>(AuthInfoProvider);
            const roleProvider = context.injector.get<RoleProvider>(RoleProvider);
            const payload = authInfo.getInfo();
            if (!await roleProvider.checkRole(roles, payload.rol)) {
                throw new ApolloError('', 'ACCESS_PERMISSION_DENIED')
            }
            return next();
        }
    }
};

