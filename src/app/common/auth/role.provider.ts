import {DatabaseProvider} from '@/app/common/database/database.provider';
import {Injectable} from '@graphql-modules/di';


export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';

@Injectable()
export class RoleProvider {
    private roleLoaded = false;
    private roleIdMapper: {[k:string]: number} = {};

    constructor(
        private db: DatabaseProvider,
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

    async addRole(userId: string, role: string) {
        const trx = await this.db.getTrx();
        await trx('user_role').insert({
            user_id: userId,
            role_id: this.roleIdMapper[role]
        });
    }

    private async loadRole() {
        const trx = await this.db.getTrx();
        const res = await trx('role_info');
        this.roleIdMapper = {};
        for (const item of res) {
            this.roleIdMapper[item.name] = item.id;
        }
        this.roleLoaded = true;
    }
}