import {Request, Response} from 'express';
import {isEmpty} from './tools';
import {APOLLO_LOGGER, ApolloLogger} from '@/app/apollo-logger.provider';
import {DatabaseConnectionService} from '@/app/common/database/databaseConnectionService';
import {GqlAppBuilderMiddleware, REQUEST} from '@/utils/gqlAppBuilder';
export interface ApolloContext{
    req: Request;
    res: Response;
}

export const logMiddleware: GqlAppBuilderMiddleware = (injector, parent, args, info) => {
    const logger = injector.resolve<ApolloLogger>(APOLLO_LOGGER);
    const req = injector.resolve<Request>(REQUEST);
    const type = info.parentType.name;
    logger.info(`${type}: '${info.fieldName}' called.`, {
        fieldName: info.fieldName,
        type,
        query: req.body?.query,
        params: isEmpty(info.variableValues) ? undefined : info.variableValues
    });
}

export const dbMiddleware: GqlAppBuilderMiddleware = async (injector) => {
    return async (resolveData, resolveError) => {
        if (resolveError) {
            const databaseConnectionService = injector.resolve<DatabaseConnectionService>(DatabaseConnectionService);
            await databaseConnectionService.release();
        }
    }
}

export const orderByIdArray = (arr: any[], idArr: ReadonlyArray<string|number>, getIdFn: (item: any) => string|number = item => item.id) => {
    const map: {[k:string]: any} = {};
    arr.forEach(item => map[getIdFn(item)] = item);
    return idArr.map(id => map[id]);
};

export const genGraphqlErrorCode = (code: string) => ({extensions: {code}})
