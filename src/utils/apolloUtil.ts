import {APOLLO_LOGGER, ApolloLogger} from '@/app/apollo-logger.provider';
import {DatabaseProvider} from '@/app/common/database/database.provider';
import {isEmpty} from '@/utils/tools';
import {ExpressContext} from 'apollo-server-express/dist/ApolloServer';
import {CONTEXT, Injector, Middleware} from 'graphql-modules';

export type ModuleContext = ExpressContext & {
    injector: Injector;
    moduleId: string;
}

export const logMiddleware: Middleware = async ({context: {injector}, info}, next) => {
    const logger = injector.get<ApolloLogger>(APOLLO_LOGGER);
    const context = injector.get<ExpressContext>(CONTEXT);
    const type = info.parentType.name;
    if (type === 'Query' || type === 'Mutation' || type === 'Subscription') {
        logger.info(`${type}: '${info.fieldName}' called.`, {
            fieldName: info.fieldName,
            type,
            query: context.req.body?.query,
            params: isEmpty(info.variableValues) ? undefined : info.variableValues
        });
    }
    return next();
}

export const dbMiddleware: Middleware = async ({context: {injector}}, next) => {
    const databaseProvider = injector.get<DatabaseProvider>(DatabaseProvider);
    await databaseProvider.init();
    try {
        return await next();
    } catch (e) {
        databaseProvider.setError(true);
        throw e;
    }
}

export const orderByIdArray = (arr: any[], idArr: ReadonlyArray<string|number>, getIdFn: (item: any) => string|number = item => item.id) => {
    const map: {[k:string]: any} = {};
    arr.forEach(item => map[getIdFn(item)] = item);
    return idArr.map(id => map[id]);
};
