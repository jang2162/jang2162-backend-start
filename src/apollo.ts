import rootModule from '@/app/modules';
import getLogger from '@/lib/LoggerUtil';
import {ApolloServer} from 'apollo-server-express';

const logger = getLogger('APOLLO_ERROR');
const apollo = new ApolloServer({
    modules: [
        rootModule
    ],
    context: session =>session,
    formatError: error => {
        logger.error(error.message, error.extensions && error.extensions.code);
        return error;
    }
});

export default apollo;

