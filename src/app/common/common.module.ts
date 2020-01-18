import {authModule} from '@/app/common/auth/auth.module';
import {GraphQLModule} from '@graphql-modules/core';
import {databaseModule} from './database/database.module';
import {loggerModule} from './logger/logger.module';
import {paginationModule} from './pagination/pagination.module';

export const commonModule = new GraphQLModule({
    imports: [
        authModule,
        loggerModule,
        databaseModule,
        paginationModule
    ]
});