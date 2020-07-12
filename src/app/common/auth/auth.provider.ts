import {DatabaseTransactionProvider} from '@/app/common/database/database.transaction.provider';
import {Injectable} from '@graphql-modules/di';
import {ApolloError} from 'apollo-server-errors';
import env from 'json-env';
import {sign, verify} from 'jsonwebtoken'
import uuid4 from 'uuid/v4';

export interface IAccessToken {
    uid: number,
    rol: number[],
    exp: number,
    iss: string,
    sub: string,
    jti: string,
    rfk: string,
}

@Injectable()
export class AuthProvider {
    private expiredIn = env.getNumber('jwt.expiredIn', 600);
    private refreshExpiredIn = env.getNumber('jwt.refreshExpiredIn', 1209600);
    private secret = env.getString('jwt.secret');
    private issuer = env.getString('jwt.issuer', '') || undefined;

    constructor(
        private dbTran: DatabaseTransactionProvider,
    ){}

    async authentication(uid: number, salt: string) {
        const {trx, release} = await this.dbTran.getTransaction();
        const refreshKey = uuid4().replace(/-/g, '');
        const accessKey = uuid4().replace(/-/g, '');
        const roles = (await trx('user_role').where('user_id', uid)).map((item: any) => item.role_id);
        await trx('auth_token').insert({
            user_id: uid,
            refresh_key: refreshKey,
            access_key: accessKey,
            salt,
        });
        const accessToken = sign({
            uid,
            rol: roles,
            rfk: refreshKey
        }, this.secret, {
            issuer: this.issuer,
            subject: 'ACCESS_TOKEN',
            expiresIn: this.expiredIn,
            jwtid: accessKey,
            noTimestamp: true
        });

        await release();
        return {
            token: accessToken
        }
    }

    async refresh(accessTokenPayload: IAccessToken) {
        const {trx, release} = await this.dbTran.getTransaction();

        const authData = await trx('auth_token').first([
            'user_id',
            this.dbTran.knex.raw('EXTRACT(epoch FROM (NOW() - last_date))::int refresh_interval'),
            'access_key',
            'salt'
        ]).where('refresh_key', accessTokenPayload.rfk)
            .where('disabled', 0);
        const saltRow = await trx('user').first(this.dbTran.knex.raw('SUBSTR(password, 0, 29) salt'))
            .where('id', accessTokenPayload.uid);

        if (!(saltRow?.salt) || !authData || authData.user_id !== accessTokenPayload.uid) {
            throw new ApolloError('', 'UNKNOWN_ERROR');
        }

        if (authData.salt !== saltRow.salt) {
            throw new ApolloError('', 'SALT_VALUE_CHANGED');
        }

        if (authData.refresh_interval > this.refreshExpiredIn) {
            throw new ApolloError('', 'REFRESH_TOO_LATE');
        }

        if (authData.access_key !== accessTokenPayload.jti) {
            await trx('auth_token').update({
                disabled: 1
            }).where('refresh_key', accessTokenPayload.rfk);
            throw new ApolloError('', 'ACCESS_KEY_IS_OLD');
        }

        const accessKey = uuid4().replace(/-/g, '');
        const roles = (await trx('user_role').where('user_id', accessTokenPayload.uid)).map((item: any) => item.role_id);
        await trx('auth_token').update({
            access_key: accessKey,
            last_date: this.dbTran.knex.fn.now()
        }).where('refresh_key', accessTokenPayload.rfk);
        const token = sign({
            uid: accessTokenPayload.uid,
            rol: roles,
            rfk: accessTokenPayload.rfk,
        }, this.secret, {
            issuer: this.issuer,
            subject: 'ACCESS_TOKEN',
            expiresIn: this.expiredIn,
            jwtid: accessKey,
            noTimestamp: true
        });
        await release();
        return {token}
    }

    async invalidate(accessTokenPayload: IAccessToken) {
        const {trx, release} = await this.dbTran.getTransaction();
        await trx('auth_token').update({
            disabled: 1
        }).where('access_key', accessTokenPayload.jti);
        await release();
    }

    verify(token: string) {
        let payload = null;
        let err = 0; // 0 정상, 1: 만료, 2: 검증불가
        try {
            payload = verify(token, this.secret, {
                issuer: this.issuer,
                subject: 'ACCESS_TOKEN',
            });
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                try {
                    payload = verify(token, this.secret, {
                        issuer: this.issuer,
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