import {GRAPHQL_LOGGER, GraphQLLogger} from '@/app/common/logger/logger.module';
import {ModuleContext, ModuleSessionInfo} from '@graphql-modules/core';
import {Injector} from '@graphql-modules/di';
import {GraphQLResolveInfo} from 'graphql';
import {isEmpty} from 'utils';

type SimpleResolveCallback<Arguments, Result, Source> = (data: {source: Source, args: Arguments, injector: Injector, info: GraphQLResolveInfo}) => Result  | Promise<Result>
export interface SimpleResolveMiddleware {
    readonly run: (data: {source: any, args: any, injector: Injector, info: GraphQLResolveInfo}) => Promise<void> | void;
}

const logMiddleware: SimpleResolveMiddleware = {
    run({injector, info}) {
        const logger = injector.get<GraphQLLogger>(GRAPHQL_LOGGER);
        const moduleSessionInfo = injector.get<ModuleSessionInfo>(ModuleSessionInfo);
        const type = info.parentType.name;
        if (type === 'Query' || type === 'Mutation' || type === 'Subscription') {
            logger.info(`${type}: '${info.fieldName}' called.`, {
                fieldName: info.fieldName,
                type,
                query: moduleSessionInfo.session.req.body.query,
                params: isEmpty(info.variableValues) ? undefined : info.variableValues
            });
        }
    }
};

export const skipLogMiddleware: SimpleResolveMiddleware = {
    run() {}
};

export class SimpleResolver<Arguments = {}, Result = any, Source = any> {
    private middlewareList:SimpleResolveMiddleware[] = [];
    constructor(middleware?: SimpleResolveMiddleware | SimpleResolveMiddleware[]) {
        if (middleware) {
            this.middlewareList = this.middlewareList.concat(middleware);
        }
        if (this.middlewareList.indexOf(skipLogMiddleware) === -1) {
            this.middlewareList.unshift(logMiddleware);
        }
    }

    build(cb: SimpleResolveCallback<Arguments, Result , Source>) {
        return async (source: Source, args: Arguments, context: ModuleContext, info: GraphQLResolveInfo) => {
            const data = {source, args, injector: context.injector, info};
            for (const middleware of this.middlewareList) {
                await middleware.run(data);
            }
            return cb(data);
        }
    }
}

export const orderByIdArray = (arr: any[], idArr: Array<string|number>, getIdFn: (item: any) => string|number = item => item.id) => {
    const map: {[k:string]: any} = {};
    arr.forEach(item => map[getIdFn(item)] = item);
    return idArr.map(id => map[id]);
};
