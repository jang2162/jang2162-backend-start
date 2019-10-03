import {Logger} from '@/lib/Logger';
import {GraphQLModule} from '@graphql-modules/core';

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
            useFactory: () => new Logger<GraphQLLoggerSubData>('APOLLO',
                ({ level, message, subData, timestamp }) => `${timestamp} [APOLLO:${subData.type}] ${level}: ${message} [[\n${subData.query}]] ${
                    subData.params ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
                }`
            )
        }
    ]
});