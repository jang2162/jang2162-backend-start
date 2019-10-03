import {GraphQLModule} from '@graphql-modules/core';
import {databaseModule} from './database/database.module';
import {loggerModule} from './logger/logger.module';

export const commonModule = new GraphQLModule({
    imports: [
        loggerModule,
        databaseModule
    ]
});