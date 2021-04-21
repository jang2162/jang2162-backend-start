import {AuthInfoProvider} from '@/app/common/auth/auth-info.provider';
import {AuthProvider} from '@/app/common/auth/auth.provider';
import {ROLE_USER, RoleProvider} from '@/app/common/auth/role.provider';
import {DatabaseConnectionProvider} from '@/app/common/database/database-connection-provider';
import {
    getUserByLoginId,
    getUserListBatch,
    getUserConnection,
    insertUser, userAddRole
} from '@/app/user/user.query';
import {PageInput, User, UserInput, UserSearchInput} from '@/generated-models';
import {orderByIdArray} from '@/utils/apolloUtil';
import {ApolloError} from 'apollo-server-errors';
import {compare, hash} from 'bcrypt'
import DataLoader from 'dataloader';
import {Injectable, Scope} from 'graphql-modules';

@Injectable({
    scope: Scope.Operation
})
export class UserProvider {

    private userDataLoader = new DataLoader<string, User>(keys => this.userBatch(keys));

    constructor(
        private db: DatabaseConnectionProvider,
        private authProvider: AuthProvider,
        private authInfoProvider: AuthInfoProvider,
        private roleProvider: RoleProvider,
    ){}

    async authentication(id: string, pw: string) {
        const trx = await this.db.getConn();
        const user =  await getUserByLoginId(trx, {loginId: id});
        if (user) {
            if (await compare(pw, user.password)) {
                await this.authInfoProvider.authentication(user.id, user.password.slice(0, 29));
            } else {
                throw new ApolloError('', 'PASSWORD_NOT_MATCH');
            }
        } else {
            throw new ApolloError('', 'USER_NOT_FOUND');
        }
    }

    async userBatch(idArr: readonly string[]) {
        const trx = await this.db.getConn();
        const res = await getUserListBatch(trx, {idArr});
        return orderByIdArray(res, idArr);
    }

    async userById(id: string) {
        return this.userDataLoader.load(id);
    }

    async insertUser(user: UserInput): Promise<User> {
        const trx = await this.db.getConn();
        const res = await insertUser(trx, {
            user: {
                ...user,
                password: await hash(user.password, 10),
            }
        });

        if (res?.[0].id) {
            await userAddRole(trx, {
                userId: res[0].id,
                roleId: await this.roleProvider.getRoleId(ROLE_USER)
            });
        } else {
            throw new Error('USER_INSERT_ERROR');
        }
        return res[0];
    }

    async getUserConnection(searchInput?: UserSearchInput | null, pageInput?: PageInput | null) {
        const trx = await this.db.getConn();
        return getUserConnection(trx, searchInput, pageInput);
    }

}
