import {container} from 'tsyringe';
import {Env} from '@/env';
import {createLogger, Logger, loggerEnvUtil} from '@/utils/createLogger';
interface ApolloLoggerSubData {
    type: string,
    fieldName: string,
    query: string,
    params?: any,
}

export const APOLLO_LOGGER = Symbol('APOLLO_LOGGER');
export type ApolloLogger = Logger<ApolloLoggerSubData>;
container.register<Logger<ApolloLoggerSubData>>(APOLLO_LOGGER, {useValue: createLogger<ApolloLoggerSubData>('APOLLO', {
        ...loggerEnvUtil(
            Env.LOG_APOLLO_LEVEL,
            Env.LOG_APOLLO_CONSOLE_LEVEL,
            Env.LOG_APOLLO_FILE_LEVEL,
            Env.LOG_APOLLO_FILE_DIR
        ),
        consoleFormat: ({ level, message, subData, timestamp }) => `${timestamp} [APOLLO:${subData.type}] ${level}: ${message} [[\n${subData.query}]] ${
            subData.params ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
        }`
    })
});
