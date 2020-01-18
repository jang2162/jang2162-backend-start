import {DatabaseProvider} from '@/app/common/database/database.provider';
import {Injectable, ProviderScope} from '@graphql-modules/di';


@Injectable({
    scope: ProviderScope.Session
})
export class AuthProvider {
    constructor(
        private db: DatabaseProvider,
    ){}
}