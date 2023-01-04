import {loadFiles} from '@graphql-tools/load-files';
import {GqlAppBuilder} from '../utils/gqlAppBuilder';
import {initModule} from '@/app/modules/init/initModule';

export const application = new GqlAppBuilder({
    typeDefs: await loadFiles('./typeDefs/**/*.graphql'),
    modules: [
        initModule
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
