import {Logger} from '@/lib/Logger';
import {GraphQLModule} from '@graphql-modules/core';

interface GraphQLLoggerGeneric {
    type: string,
    fieldName: string,
    query: string,
    params?: any
}

export const GRAPHQL_LOGGER = Symbol('GRAPHQL_LOGGER');
export type GraphQLLogger = Logger<GraphQLLoggerGeneric>;

export const loggerModule = new GraphQLModule({
    providers: [
        {
            provide: GRAPHQL_LOGGER,
            useFactory: () => new Logger<GraphQLLoggerGeneric>('APOLLO',
                undefined,
                data => `${data.timestamp} [APOLLO:${data.type}] ${data.level}: ${data.message} [[\n${data.query}]] ${
                    data.params ? `=> (Params: ${JSON.stringify(data.params)})` : ''
                }`
            )
        }
    ]
});