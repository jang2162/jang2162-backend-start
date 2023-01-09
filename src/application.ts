import {loadFiles} from '@graphql-tools/load-files';
import {authModule} from '@/app/common/auth/authModule';
import {initModule} from '@/app/common/init/initModule';
import {tempModule} from '@/app/temp/tempModule';
import {dbMiddleware, logMiddleware} from '@/utils/apolloUtil';
import {GqlAppBuilder} from '@/utils/gqlAppBuilder';


export const application = new GqlAppBuilder({
    typeDefs: await loadFiles('./typeDefs/**/*.graphql'),
    modules: [
        initModule,
        authModule,
        tempModule
    ],
    middlewares: {
        '*': {
            '*': [dbMiddleware]
        },
        'Query': {
            '*': [logMiddleware]
        },
        'Mutation': {
            '*': [logMiddleware]
        },
        'Subscription': {
            '*': [logMiddleware]
        }
    }
});
