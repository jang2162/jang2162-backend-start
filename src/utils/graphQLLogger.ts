import {createLogger} from '@/utils/createLogger';

interface GraphQLLoggerSubData {
    type: string,
    fieldName: string,
    query: string,
    params?: any,
}

export const graphQLLogger = createLogger<GraphQLLoggerSubData>('APOLLO',
    ({ level, message, subData, timestamp }) => `${timestamp} [APOLLO:${subData.type}] ${level}: ${message} [[\n${subData.query}]] ${
        subData.params ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
    }`
)
