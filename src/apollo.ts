import application from '@/app/application';
import {createLogger} from '@/utils/createLogger';
import {ApolloServer} from 'apollo-server-express';

const logger = createLogger<{path: any, code: any}>('APOLLO_ERROR', ({ message, subData, timestamp }) =>
    `${timestamp} [APOLLO_ERROR]: (${subData.path}${subData.code ? ', ' + subData.code : ''}) ${message}`
);
const apollo = new ApolloServer({
    schema: application.createSchemaForApollo(),
    context: session => session,
    formatError: error => {
        logger.error(error.message, {
            path: error.path,
            code: error.extensions && error.extensions.code
        });
        return error;
    }
});

export default apollo;

