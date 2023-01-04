import {Request, Response} from 'express';
import {GraphQLError} from 'graphql';
import jwt from 'jsonwebtoken';
import {autoInjectable, inject, singleton} from 'tsyringe';
import {v4 as uuid4} from 'uuid';
import {AuthService, IAccessToken} from '@/app/common/auth/authService';
import {ROLE_USER, RoleService} from '@/app/common/auth/roleService';
import {Env} from '@/env';
import {genGraphqlErrorCode} from '@/utils/apolloUtil';
import {GqlAppBuilderMiddleware, REQUEST, RESPONSE} from '@/utils/gqlAppBuilder';

@autoInjectable()
export class AuthInfoService {
    private readonly err: number = -1;
    private readonly payload: any = null;

    constructor(
        private authService: AuthService,
        @inject(REQUEST) private req: Request,
        @inject(RESPONSE) private res: Response
    ) {
        const token: string = req.cookies?.token ?? '';
        if (token) {
            const tokenParse = authService.verify(token);
            this.err = tokenParse.err;
            this.payload = tokenParse.payload;
        }
    }

    getInfo() {
        if (this.err) {
            if (this.err === 1) {
                throw new GraphQLError('', genGraphqlErrorCode('ACCESS_TOKEN_EXPIRED'));
            } else {
                throw new GraphQLError('', genGraphqlErrorCode('ACCESS_TOKEN_INVALID'));
            }
        } else {
            return this.payload as IAccessToken
        }
    }

    authenticationTest(id: number) {
        const refreshKey = uuid4().replace(/-/g, '');
        const accessKey = uuid4().replace(/-/g, '');
        const roles = [ROLE_USER];
        const accessToken = jwt.sign({
            uid: id,
            rol: roles,
            rfk: refreshKey
        }, Env.JWT_SECRET, {
            issuer: Env.JWT_ISSUER,
            subject: 'ACCESS_TOKEN',
            expiresIn: Env.JWT_EXPIRED_IN,
            jwtid: accessKey,
            noTimestamp: true
        });

        this.res.cookie('token', accessToken, {
            secure: Env.JWT_COOKIE_SECURE,
            domain: Env.JWT_COOKIE_DOMAIN,
            expires: new Date(Date.now() + Env.JWT_REFRESH_EXPIRED_IN * 1000),
            httpOnly: true,
            sameSite: 'lax'
        });
        return Env.NODE_ENV === 'development' ? accessToken : null
    }

    async authentication(userId: number, salt: string) {
        await this.authService.authentication(this.res, userId, salt);
    }

    async tokenRefresh() {
        if (this.err) {
            if (this.err === 1) {
                await this.authService.refresh(this.res, this.payload as IAccessToken);
            } else {
                throw new GraphQLError('', genGraphqlErrorCode('ACCESS_TOKEN_INVALID'));
            }
        } else {
            throw new GraphQLError('', genGraphqlErrorCode('ACCESS_TOKEN_NOT_EXPIRED'));
        }
        return null;
    }

    async tokenInvalidate() {
        if (this.err) {
            if (this.err === 1) {
                throw new GraphQLError('', genGraphqlErrorCode('ACCESS_TOKEN_EXPIRED'));

            } else {
                throw new GraphQLError('', genGraphqlErrorCode('ACCESS_TOKEN_INVALID'));
            }
        } else {
            await this.authService.invalidate(this.res, this.payload as IAccessToken);
        }
        return null;
    }
}

export const authFilterMiddleware = {
    role(roles: string | string[]): GqlAppBuilderMiddleware {
        return async injector => {
            const authInfoService =injector.resolve<AuthInfoService>(AuthInfoService);
            const roleService = injector.resolve<RoleService>(RoleService);
            const payload = authInfoService.getInfo();
            if (!await roleService.checkRole(roles, payload.rol)) {
                throw new GraphQLError('', genGraphqlErrorCode('ACCESS_PERMISSION_DENIED)'))
            }
        }
    }
};

