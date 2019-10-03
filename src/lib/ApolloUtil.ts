import {GRAPHQL_LOGGER, GraphQLLogger} from '@/app/common/logger/logger.module';
import {ModuleContext, ModuleSessionInfo} from '@graphql-modules/core';
import {Injector} from '@graphql-modules/di';
import {GraphQLResolveInfo} from 'graphql';
import {isEmpty} from 'utils';


export function simpleResolve<Arguments = any, Result = any, Source = any>(
    cb: (data: {source: Source, args: Arguments, injector: Injector, info: GraphQLResolveInfo}) => Result | Promise<Result>
) {
    return (source: Source, args: Arguments, context: ModuleContext, info: GraphQLResolveInfo) => {
        const logger = context.injector.get<GraphQLLogger>(GRAPHQL_LOGGER);
        const moduleSessionInfo = context.injector.get<ModuleSessionInfo>(ModuleSessionInfo);
        const type = info.parentType.name;
        if (type === 'Query' || type === 'Mutation' || type === 'Subscription') {
            logger.info(`${type}: '${info.fieldName}' called.`, {
                fieldName: info.fieldName,
                type,
                query: moduleSessionInfo.session.req.body.query,
                params: isEmpty(info.variableValues) ? undefined : info.variableValues
            });
        }

        return cb({source, args, injector: context.injector, info});
    }
}

export const orderByIdArray = (arr: any[], idArr: Array<string|number>, getIdFn: (item: any) => string|number = item => item.id) => {
    const map: {[k:string]: any} = {};
    arr.forEach(item => map[getIdFn(item)] = item);
    return idArr.map(id => map[id]);
};
