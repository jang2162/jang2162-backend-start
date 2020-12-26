import {apolloLoggerProvider} from '@/app/apollo-logger.provider';
import {authModule} from '@/app/common/auth/auth.module';
import {DatabaseProvider} from '@/app/common/database/database.provider';
import {DatabaseTransactionProvider} from '@/app/common/database/database.transaction.provider';
import {paginationModule} from '@/app/common/pagination/pagination.module';
import {initModule} from '@/app/init/init.module';
import {sampleModule} from '@/app/sample/sample.module';
import {userModule} from '@/app/user/user.module';
import {dbMiddleware, logMiddleware} from '@/utils/apolloUtil';
import {createApplication} from 'graphql-modules';

export default createApplication({
    modules: [
        initModule,
        authModule,
        paginationModule,
        sampleModule,
        userModule,
    ],
    providers: [
        apolloLoggerProvider,
        DatabaseProvider,
        DatabaseTransactionProvider,
    ],
    middlewares: {
        'Query': {
            '*': [dbMiddleware, logMiddleware]
        },
        'Mutation': {
            '*': [dbMiddleware, logMiddleware]
        }
    }
});
