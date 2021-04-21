import {
    insertAuthToken,
    invalidateToken, renewAccessKey,
    selectAuthData,
    selectRoleByUserId,
    selectSalt
} from '@/app/common/auth/auth.query';
import {Env} from '@/env';
import {getTransaction} from '@/transaction';
import {ApolloError} from 'apollo-server-errors';
import {Response} from 'express';
import {Injectable} from 'graphql-modules';
import {sign, verify} from 'jsonwebtoken'
import { v4 as uuid4 } from 'uuid';

export interface IAccessToken {
    uid: number,
    rol: number[],
    exp: number,
    iss: string,
    sub: string,
    jti: string,
    rfk: string,
}

@Injectable({
    global: true
})
export class AuthProvider {

    constructor(){}

    async authentication(response: Response, userId: number, salt: string) {
        const {trx, release} = await getTransaction();
        let accessToken;
        try {
            const refreshKey = uuid4().replace(/-/g, '');
            const accessKey = uuid4().replace(/-/g, '');
            const roles = (await selectRoleByUserId(trx, {userId: userId})).map(item => item.roleId);
            await insertAuthToken(trx, {
                userId,
                refreshKey,
                accessKey,
                salt,
            });
            accessToken = sign({
                uid: userId,
                rol: roles,
                rfk: refreshKey
            }, Env.JWT_SECRET, {
                issuer: Env.JWT_ISSUER,
                subject: 'ACCESS_TOKEN',
                expiresIn: Env.JWT_EXPIRED_IN,
                jwtid: accessKey,
                noTimestamp: true
            });
            await release();
        } catch (e) {
            await release(true);
            throw e;
        }

        response.cookie('token', accessToken, {
            secure: Env.NODE_ENV === 'production',
            domain: Env.JWT_COOKIE_DOMAIN,
            expires: new Date(Date.now() + Env.JWT_REFRESH_EXPIRED_IN * 1000),
            httpOnly: true,
            sameSite: 'lax'
        });

    }

    async refresh(response: Response, accessTokenPayload: IAccessToken) {
        const {trx, release} = await getTransaction();
        let token;
        try {
            const authData = await selectAuthData(trx, {refreshKey: accessTokenPayload.rfk});
            const salt = (await selectSalt(trx, {userId: accessTokenPayload.uid})).slat;

            if (!salt || !authData || authData.userId !== accessTokenPayload.uid) {
                throw new ApolloError('', 'UNKNOWN_ERROR');
            }

            if (authData.salt !== salt) {
                throw new ApolloError('', 'SALT_VALUE_CHANGED');
            }

            if (authData.refreshInterval > Env.JWT_REFRESH_EXPIRED_IN) {
                throw new ApolloError('', 'REFRESH_TOO_LATE');
            }

            if (authData.accessKey !== accessTokenPayload.jti) {
                await invalidateToken(trx, {refreshKey: accessTokenPayload.rfk});
                throw new ApolloError('', 'ACCESS_KEY_IS_OLD');
            }

            const accessKey = uuid4().replace(/-/g, '');
            const roles = (await selectRoleByUserId(trx, {userId: accessTokenPayload.uid})).map(item => item.roleId);
            await renewAccessKey(trx, {accessKey, refreshKey: accessTokenPayload.rfk});
            token = sign({
                uid: accessTokenPayload.uid,
                rol: roles,
                rfk: accessTokenPayload.rfk,
            }, Env.JWT_SECRET, {
                issuer: Env.JWT_ISSUER,
                subject: 'ACCESS_TOKEN',
                expiresIn: Env.JWT_EXPIRED_IN,
                jwtid: accessKey,
                noTimestamp: true
            });
            await release();
        } catch (e) {
            await release(true);
            throw e;
        }
        response.cookie('token', token, {
            secure: Env.NODE_ENV === 'production',
            domain: Env.JWT_COOKIE_DOMAIN,
            expires: new Date(Date.now() + Env.JWT_REFRESH_EXPIRED_IN * 1000),
            httpOnly: true,
            sameSite: 'lax'
        });
    }

    async invalidate(response: Response, accessTokenPayload: IAccessToken) {
        const {trx, release} = await getTransaction();
        try {
            await invalidateToken(trx, {accessKey: accessTokenPayload.jti});
            response.clearCookie('token', {
                secure: Env.NODE_ENV === 'production',
                domain: Env.JWT_COOKIE_DOMAIN,
                httpOnly: true,
                sameSite: 'Lax'
            });
            await release(true);
        } catch (e) {
            await release(true);
        }
    }

    verify(token: string) {
        let payload = null;
        let err = 0; // 0 정상, 1: 만료, 2: 검증불가
        try {
            payload = verify(token, Env.JWT_SECRET, {
                issuer: Env.JWT_ISSUER,
                subject: 'ACCESS_TOKEN',
            });
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                try {
                    payload = verify(token, Env.JWT_SECRET, {
                        issuer: Env.JWT_ISSUER,
                        subject: 'ACCESS_TOKEN',
                        ignoreExpiration: true
                    });
                    err = 1;
                } catch (e) {
                    err = 2;
                }
            } else {
                err = 2;
            }
        }
        return {payload, err};
    }
}
