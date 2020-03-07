import {createLogger} from '@/lib/createLogger';
import {GraphQLModule} from '@graphql-modules/core';
import {Logger} from 'custom-logger';

interface GraphQLLoggerSubData {
    type: string,
    fieldName: string,
    query: string,
    params?: any,
}

export const GRAPHQL_LOGGER = Symbol('GRAPHQL_LOGGER');
export type GraphQLLogger = Logger<GraphQLLoggerSubData>;

export const loggerModule = new GraphQLModule({
    providers: [
        {
            provide: GRAPHQL_LOGGER,
            useFactory: () => createLogger<GraphQLLoggerSubData>('APOLLO',
                ({ level, message, subData, timestamp }) => `${timestamp} [APOLLO:${subData.type}] ${level}: ${message} [[\n${subData.query}]] ${
                    subData.params ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
                }`
            )
        }
    ]
});