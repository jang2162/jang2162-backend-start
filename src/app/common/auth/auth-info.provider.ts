import {AuthProvider} from '@/app/common/auth/auth.provider';
import {SimpleResolveMiddleware} from '@/lib/ApolloUtil';
import {ModuleSessionInfo} from '@graphql-modules/core';
import {Injectable, ProviderScope} from '@graphql-modules/di';


@Injectable({
    scope: ProviderScope.Session
})
export class AuthInfoProvider {
    private err: number = -1;
    private payload: any = null;

    constructor(
        private moduleSessionInfo: ModuleSessionInfo,
        private authProvider: AuthProvider
    ) {
        const authorization: string = moduleSessionInfo.session.req &&
            moduleSessionInfo.session.req.headers &&
            moduleSessionInfo.session.req.headers.authorization || '';
        const res = /^Bearer (.*)$/.exec(authorization);

        if (res && res.length === 2) {
            const tokenParse = authProvider.verify(res[1]);
            console.log(tokenParse);
            this.err = tokenParse.err;
            this.payload = tokenParse.payload;
        }
    }
}

export const authFilterMiddleware = {
    role(roles: string | string[]): SimpleResolveMiddleware {
        return {
            run: ({injector}) => {
                const authInfo = injector.get<AuthInfoProvider>(AuthInfoProvider);
            }
        }
    }
};

