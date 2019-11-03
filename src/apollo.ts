import appModule from '@/app/app.modules';
import {Logger} from '@/lib/Logger';
import {ApolloServer} from 'apollo-server-express';

const logger = new Logger('APOLLO_ERROR');
const apollo = new ApolloServer({
    typeDefs: appModule.typeDefs,
    resolvers: appModule.resolvers,
    context: session =>session,
    formatError: error => {
        logger.error(error.message, error.extensions && error.extensions.code);
        return error;
    }
});

export default apollo;

