import {DatabaseProvider} from '@/app/common/database/database.provider';
import {AccessToken, AuthToken} from '@/generated-models';
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
}

export interface IRefreshToken {
    iss: string,
    sub: string,
    jti: string,
}

@Injectable()
export class AuthProvider {
    private expiredIn = env.getNumber('jwt.expiredIn', 600);
    private refreshExpiredIn = env.getNumber('jwt.refreshExpiredIn', 1209600);
    private secret = env.getString('jwt.secret');
    private issuer = env.getString('jwt.issuer', '') || undefined;

    constructor(
        private db: DatabaseProvider,
    ){}

    async authentication(uid: number, salt: string): Promise<AuthToken> {
        const refreshKey = uuid4().replace(/-/g, '');
        const accessKey = uuid4().replace(/-/g, '');
        const rolesQuery = this.db.knex('user_role').where('user_id', uid);
        const roles = (await this.db.exec(rolesQuery)).map((item: any) => item.role_id);
        const tokenInsertQuery = this.db.knex('auth_token').insert({
            user_id: uid,
            refresh_key: refreshKey,
            access_key: accessKey,
            salt,
        });
        await this.db.exec(tokenInsertQuery);
        const accessToken = sign({
            uid,
            rol: roles
        }, this.secret, {
            issuer: this.issuer,
            subject: 'ACCESS_TOKEN',
            expiresIn: this.expiredIn,
            jwtid: accessKey,
            noTimestamp: true
        });

        const refreshToken = sign({}, this.secret, {
            issuer: this.issuer,
            subject: 'REFRESH_TOKEN',
            jwtid: refreshKey,
            noTimestamp: true
        });

        return {
            refreshToken,
            accessToken
        }
    }

    async refresh(accessTokenPayload: IAccessToken, refreshToken: string): Promise<AccessToken> {
        let refreshTokenPayload;
        try {
            refreshTokenPayload = verify(refreshToken, this.secret, {
                issuer: this.issuer,
                subject: 'REFRESH_TOKEN',
            }) as IRefreshToken;
        } catch (e) {
            throw new ApolloError('', 'REFRESH_TOKEN_INVALID');
        }

        const tokenSelectQuery = this.db.knex('auth_token').first([
            'user_id',
            this.db.knex.raw('EXTRACT(epoch FROM (NOW() - last_date))::int refresh_interval'),
            'access_key',
            'salt'
        ]).where('refresh_key', refreshTokenPayload.jti)
            .where('disabled', 0);
        const authData = await this.db.exec(tokenSelectQuery);
        const saltSelectQuery = this.db.knex('user').first(this.db.knex.raw('SUBSTR(password, 8, 22) salt'))
            .where('id', accessTokenPayload.uid);
        const saltRow = await this.db.exec(saltSelectQuery);

        if (!saltRow || !saltRow.salt || !authData || authData.user_id !== accessTokenPayload.uid) {
            throw new ApolloError('', 'UNKNOWN_ERROR');
        }

        if (authData.salt !== saltRow.salt) {
            throw new ApolloError('', 'SALT_VALUE_CHANGED');
        }

        if (authData.refresh_interval > this.refreshExpiredIn) {
            throw new ApolloError('', 'REFRESH_TOO_LATE');
        }

        if (authData.access_key !== accessTokenPayload.jti) {
            const tokenDisableQuery = this.db.knex('auth_token').update({
                disabled: 1
            }).where('refresh_key', refreshTokenPayload.jti);
            await this.db.exec(tokenDisableQuery);
            throw new ApolloError('', 'ACCESS_KEY_IS_OLD');
        }

        const accessKey = uuid4().replace(/-/g, '');
        const rolesQuery = this.db.knex('user_role').where('user_id', accessTokenPayload.uid);
        const roles = (await this.db.exec(rolesQuery)).map((item: any) => item.role_id);
        const tokenInsertQuery = this.db.knex('auth_token').update({
            access_key: accessKey,
            last_date: this.db.knex.fn.now()
        }).where('refresh_key', refreshTokenPayload.jti);
        await this.db.exec(tokenInsertQuery);
        const token = sign({
            uid: accessTokenPayload.uid,
            rol: roles
        }, this.secret, {
            issuer: this.issuer,
            subject: 'ACCESS_TOKEN',
            expiresIn: this.expiredIn,
            jwtid: accessKey,
            noTimestamp: true
        });

        return {token}
    }

    async invalidate(accessTokenPayload: IAccessToken) {
        const tokenDisableQuery = this.db.knex('auth_token').update({
            disabled: 1
        }).where('access_key', accessTokenPayload.jti);
        await this.db.exec(tokenDisableQuery);
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