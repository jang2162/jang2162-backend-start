import {AuthProvider} from '@/app/common/auth/auth.provider';
import {DatabaseProvider} from '@/app/common/database/database.provider';
import {PaginationUtilProvider} from '@/app/common/pagination/pagination-util.provider';
import {
    Maybe,
    User,
    UserConnection,
    UserForm,
    UserInput
} from '@/generated-models';
import {orderByIdArray} from '@/lib/ApolloUtil';
import {Injectable, ProviderScope} from '@graphql-modules/di';
import {ApolloError} from 'apollo-server-errors';
import {compare, genSalt, hash} from 'bcrypt'
import DataLoader from 'dataloader';

@Injectable({
    scope: ProviderScope.Session
})
export class UserProvider {

    private userDataLoader = new DataLoader<string, User>(keys => this.userBatch(keys));

    constructor(
        private db: DatabaseProvider,
        private pageUtil: PaginationUtilProvider,
        private authProvider: AuthProvider
    ){}

    async authentication(id: string, pw: string) {
        const builder = this.db.knex('user').where('login_id', id);
        const res = await this.db.exec(builder);
        if (res.length > 0) {
            const user = res[0];
            if (await compare(pw, user.password)) {
                return this.authProvider.authentication(res[0].id, res[0].password.slice(7, 29));
            } else {
                throw new ApolloError('', 'PASSWORD_NOT_MATCH');
            }
        } else {
            throw new ApolloError('', 'USER_NOT_FOUND');
        }
    }

    async userBatch(idArr: string[]) {
        const builder = this.db.knex('user').whereIn('id', idArr)
            .select(['id', 'login_id', 'loginId', 'name', 'birthday', 'create_date createDate']);
        const res = await this.db.exec(builder);
        return orderByIdArray(res, idArr);
    }

    async userConnection(form: Maybe<UserForm>): Promise<UserConnection> {
        if (!form) {
            throw Error();
        }
        const builder = this.db.knex('user')
            .select(['id', 'login_id', 'loginId', 'name', 'birthday', 'create_date createDate']);
        return this.pageUtil.getConnection(builder, form.page);
    }

    async userById(id: string) {
        return this.userDataLoader.load(id);
    }

    async insertUser(user: UserInput): Promise<User> {
        const builder = this.db.knex('user').insert({
            name: user.name,
            login_id: user.loginId,
            password: await hash(user.password, 10),
            birthday: user.birthday,
        }).returning(['id', 'login_id', 'loginId', 'name', 'birthday', 'create_date createDate']);

        const res = await this.db.exec(builder);
        return res[0];
    }
}