import {createLogger} from '@/utils/createLogger';
import {Logger} from 'custom-logger';
import {ValueProvider, InjectionToken} from 'graphql-modules';

interface ApolloLoggerSubData {
    type: string,
    fieldName: string,
    query: string,
    params?: any,
}

export const APOLLO_LOGGER = new InjectionToken('APOLLO_LOGGER');
export const apolloLoggerProvider: ValueProvider<Logger<ApolloLoggerSubData>> = {
    provide: APOLLO_LOGGER,
    useValue: createLogger<ApolloLoggerSubData>('APOLLO',
        ({ level, message, subData, timestamp }) => `${timestamp} [APOLLO:${subData.type}] ${level}: ${message} [[\n${subData.query}]] ${
            subData.params ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
        }`
    )
}

export type ApolloLogger = Logger<ApolloLoggerSubData>;
