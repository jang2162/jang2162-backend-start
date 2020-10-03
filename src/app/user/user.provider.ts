import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {AuthProvider} from '@/app/common/auth/auth.provider';
import {ROLE_USER, RoleProvider} from '@/app/common/auth/role.provider';
import {DatabaseProvider} from '@/app/common/database/database.provider';
import {PaginationUtilProvider} from '@/app/common/pagination/pagination-util.provider';
import {Maybe, User, UserConnection, UserForm, UserInput} from '@/generated-models';
import {orderByIdArray} from '@/lib/apolloUtil';
import {Injectable, ProviderScope} from '@graphql-modules/di';
import {ApolloError} from 'apollo-server-errors';
import {compare, hash} from 'bcrypt'
import DataLoader from 'dataloader';

@Injectable({
    scope: ProviderScope.Session
})
export class UserProvider {

    private userDataLoader = new DataLoader<string, User>(keys => this.userBatch(keys));

    constructor(
        private db: DatabaseProvider,
        private pageUtil: PaginationUtilProvider,
        private authProvider: AuthProvider,
        private authInfoProvider: AuthInfoProvider,
        private roleProvider: RoleProvider,
    ){}

    async authentication(id: string, pw: string) {
        const trx = await this.db.getConn();

        const res = await trx('user').where('login_id', id);
        if (res.length > 0) {
            const user = res[0];
            if (await compare(pw, user.password)) {
                await this.authInfoProvider.authentication(res[0].id, res[0].password.slice(0, 29));
            } else {
                throw new ApolloError('', 'PASSWORD_NOT_MATCH');
            }
        } else {
            throw new ApolloError('', 'USER_NOT_FOUND');
        }
    }

    async userBatch(idArr: readonly string[]) {
        const trx = await this.db.getConn();
        const res = await trx('user').whereIn('id', idArr)
            .select(['id', 'login_id loginId', 'name', 'birthday', 'create_date createDate']);
        return orderByIdArray(res, idArr);
    }

    async userConnection(form: Maybe<UserForm>): Promise<UserConnection> {
        if (!form) {
            throw Error();
        }
        const trx = await this.db.getConn();
        const builder = trx('user')
            .select(['id', 'login_id loginId', 'name', 'birthday', 'create_date createDate']);
        return this.pageUtil.getConnection(builder, form.page);
    }

    async userById(id: string) {
        return this.userDataLoader.load(id);
    }

    async insertUser(user: UserInput): Promise<User> {
        const trx = await this.db.getConn();
        const res = await trx('user').insert({
            name: user.name,
            login_id: user.loginId,
            password: await hash(user.password, 10),
            birthday: user.birthday,
        }).returning(['id', 'login_id as loginId', 'name', 'birthday', 'create_date as createDate']);

        if (res?.[0]?.id) {
            await this.roleProvider.addRole(res[0].id, ROLE_USER);
        } else {
            throw new Error('USER_INSERT_ERROR');
        }
        return res[0];
    }
}