import {loadFiles} from '@graphql-tools/load-files';
import {GqlAppBuilder} from '../utils/gqlAppBuilder';
import {authModule} from '@/app/common/auth/authModule';
import {initModule} from '@/app/common/init/initModule';

export const application = new GqlAppBuilder({
    typeDefs: await loadFiles('./typeDefs/**/*.graphql'),
    modules: [
        initModule,
        authModule
    ],
    middlewares: {
        'Query': {
            '*': []
        },
        'Mutation': {
            '*': []
        }
    }
});
