import {Logger} from '@/lib/LoggerUtil';
import {ModuleSessionInfo, OnRequest} from '@graphql-modules/core';
import {Injectable, ProviderScope} from '@graphql-modules/di';
import {GraphQLResolveInfo} from 'graphql';
import {isEmpty} from 'utils';

const logger = new Logger<{type: string, fieldName: string, query: string, params?: any}>('APOLLO',
    undefined,
    data => `${data.timestamp} [APOLLO:${data.type}] ${data.level}: ${data.message} [[\n${data.query}]] ${
        data.params ? `=> (Params: ${JSON.stringify(data.params)})` : ''
    }`
);

@Injectable({
    scope: ProviderScope.Session
})
export class LogProvider implements OnRequest {
    private moduleSessionInfo?: ModuleSessionInfo;
    onRequest(moduleSessionInfo: ModuleSessionInfo) {
        this.moduleSessionInfo = moduleSessionInfo
    }

    log(info: GraphQLResolveInfo) {
        const type = info.parentType.name;
        if (this.moduleSessionInfo !== undefined && (type === 'Query' || type === 'Mutation' || type === 'Subscription')) {
            logger.info(`${type}: '${info.fieldName}' called.`, {
                fieldName: info.fieldName,
                type,
                query: this.moduleSessionInfo.session.req.body.query,
                params: isEmpty(info.variableValues) ? undefined : info.variableValues
            });
        }
    }
}