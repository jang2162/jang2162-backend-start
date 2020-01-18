import {DatabaseProvider} from '@/app/common/database/database.provider';
import {AuthToken} from '@/generated-models';
import {Injectable} from '@graphql-modules/di';
import env from 'json-env';
import {sign} from 'jsonwebtoken'
import uuid4 from 'uuid/v4';


@Injectable()
export class AuthProvider {
    private expiredIn = env.getNumber('jwt.expiredIn', 123) * 1000;
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
}