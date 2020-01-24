import appModule from '@/app/app.modules';
import {Logger} from '@/lib/Logger';
import {ApolloServer} from 'apollo-server-express';

const logger = new Logger<{path: any, code: any}>('APOLLO_ERROR', ({ message, subData, timestamp }) =>
    `${timestamp} [APOLLO_ERROR]: (${subData.path}${subData.code ? ', ' + subData.code : ''}) ${message}`
);
const apollo = new ApolloServer({
    typeDefs: appModule.typeDefs,
    resolvers: appModule.resolvers,
    context: session =>session,
    formatError: error => {
        logger.error(error.message, {
            path: error.path,
            code: error.extensions && error.extensions.code
        });
        return error;
    }
});

export default apollo;

