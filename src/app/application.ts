import {apolloLoggerProvider} from '@/app/apollo-logger.provider';
import {authModule} from '@/app/common/auth/auth.module';
import {DatabaseConnectionProvider} from '@/app/common/database/database-connection-provider';
import {initModule} from '@/app/init/init.module';
import {userModule} from '@/app/user/user.module';
import {dbMiddleware, logMiddleware} from '@/utils/apolloUtil';
import {createApplication} from 'graphql-modules';

export default createApplication({
    modules: [
        initModule,
        authModule,
        userModule,
    ],
    providers: [
        apolloLoggerProvider,
        DatabaseConnectionProvider,
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
