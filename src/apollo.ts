import {ApolloServer} from 'apollo-server-express';
import application from '@/app/application';
import {Env} from '@/env';
import {createLogger, loggerEnvUtil} from '@/utils/createLogger';

const logger = createLogger<{path: any, code: any}>('APOLLO_ERROR', {
    ...loggerEnvUtil(
        Env.LOG_APOLLO_ERROR_LEVEL,
        Env.LOG_APOLLO_ERROR_CONSOLE_LEVEL,
        Env.LOG_APOLLO_ERROR_FILE_LEVEL,
        Env.LOG_APOLLO_ERROR_FILE_DIR
    ),
    consoleFormat: ({ message, subData, timestamp }) =>
        `${timestamp} [APOLLO_ERROR]: (${subData.path}${subData.code ? ', ' + subData.code : ''}) ${message}`
});

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

