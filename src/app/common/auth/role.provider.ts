import {DatabaseTransactionProvider} from '@/app/common/database/database.transaction.provider';
import {Injectable} from 'graphql-modules';
import Knex from 'knex';

export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';

@Injectable({
    global: true
})
export class RoleProvider {
    private roleLoaded = false;
    private roleIdMapper: {[k:string]: number} = {};

    constructor(
        private dbTran: DatabaseTransactionProvider,
    ){
        this.loadRole().then();
    }

    async checkRole(roleName: string | string[], roleId: number | number[]) {
        if (!this.roleLoaded) {
            await this.loadRole();
        }
        const roleNameList = Array.isArray(roleName) ? roleName : [roleName];
        const roleIdList = Array.isArray(roleId) ? roleId : [roleId];
        for (const roleNameItem of roleNameList) {
            if (roleIdList.indexOf(this.roleIdMapper[roleNameItem]) !== -1) {
                return true;
            }
        }
        return false;
    }

    async addRole(userId: string, role: string, trx?: Knex) {
        const {trx: trx2, release} = await this.dbTran.getTransaction();
        const curTrx = trx || trx2;
        await curTrx('user_role').insert({
            user_id: userId,
            role_id: this.roleIdMapper[role]
        });

        if (!trx) {
            await release();
        }
    }

    private async loadRole() {
        const {trx, release} = await this.dbTran.getTransaction();
        const res = await trx('role_info');
        this.roleIdMapper = {};
        for (const item of res) {
            this.roleIdMapper[item.name] = item.id;
        }
        this.roleLoaded = true;
        await release();
    }
}