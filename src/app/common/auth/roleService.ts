import {singleton} from 'tsyringe';
import {selectRoles} from '@/app/common/auth/authQuery';
import {getTransaction} from '@/transaction';

export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';

@singleton()
export class RoleService {
    private roleLoaded = false;
    private roleIdMapper: {[k:string]: number} = {};

    async checkRole(roleNameArr: string[], roleIdArr: number[]) {
        if (!this.roleLoaded) {
            await this.loadRole();
        }
        for (const roleNameItem of roleNameArr) {
            if (roleIdArr.indexOf(this.roleIdMapper[roleNameItem]) !== -1) {
                return true;
            }
        }
        return false;
    }


    async getRoleId(role: string) {
        if (!this.roleLoaded) {
            await this.loadRole();
        }
        return this.roleIdMapper[role];
    }

    private async loadRole() {
        const {trx, release} = await getTransaction();
        const res = await selectRoles(trx);
        this.roleIdMapper = {};
        for (const item of res) {
            this.roleIdMapper[item.name] = item.id;
        }
        this.roleLoaded = true;
        await release();
    }
}
