import {Request, Response, RequestHandler} from 'express';
import {DocumentNode, GraphQLResolveInfo, GraphQLScalarType} from 'graphql';
import {container, DependencyContainer, inject, InjectionToken, instancePerContainerCachingFactory} from 'tsyringe';
import {v4 as uuid4} from 'uuid';
import {DatabaseConnectionService} from '@/app/common/database/databaseConnectionService';
import {Env} from '@/env';
import {Resolvers} from '@/generated-models';
import {createLogger, loggerEnvUtil} from '@/utils/createLogger';
import {isEmpty} from '@/utils/tools';

export class InjectorWrapper {
   constructor(private injector: DependencyContainer, private onDestroyCallback: (p: OnDestroy[]) => void) {}
   resolve<T>(injectionToken: InjectionToken) {
       this.injector.afterResolution(injectionToken, (token, result) => {
           if ((token as any).prototype instanceof Object && 'onDestroy' in (token as any).prototype) {
               this.onDestroyCallback(Array.isArray(result) ? result : [result])
           }
       }, {frequency: 'Once'})
       return this.injector.resolve<T>(injectionToken)
   }
}

export type  GqlAppBuilderMiddleware =  (injector: InjectorWrapper, parent: any, args: any, info: GraphQLResolveInfo) => void | null | undefined | Promise<void | null | undefined | GqlAppBuilderMiddlewareCallback>
export type  GqlAppBuilderMiddlewareCallback = (resolveData: any, resolveError: any) => void | null | undefined | Promise<any>
export const REQUEST = Symbol('REQUEST');
export const RESPONSE = Symbol('RESPONSE');
export const REQ_KEY = Symbol('REQ_KEY');

export interface GqlAppBuilderModule {
    middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>
    resolvers?: Resolvers<InjectorWrapper>
}
export type ResolveFn<TResult, TParent, TContext, TArgs> = (
    injector: TContext,
    parent: TParent,
    args: TArgs,
    info: GraphQLResolveInfo
) => Promise<TResult> | TResult;
export interface GqlAppBuilderConfig {
    typeDefs : DocumentNode[]

    modules: GqlAppBuilderModule[]
    middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>
}


export class GqlAppBuilder{
    constructor(private config: GqlAppBuilderConfig) {}

    static getMatchMiddlewares(typeName: string, fieldName: string, middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>): GqlAppBuilderMiddleware[] {
        if (middlewares && typeName in middlewares && fieldName in middlewares[typeName]) {
            return middlewares[typeName][fieldName]
        }
        return []
    }

    build(){
        const typeDefs = this.config.typeDefs;
        const resolvers = {}
        for (const module of this.config.modules) {
            for(const typeName in module.resolvers) {
                if (module.resolvers[typeName] instanceof GraphQLScalarType) {
                    if (typeName in resolvers) {
                        throw Error('gqlAppBuilder build error. (already exist resolver type)');
                    }
                    resolvers[typeName] = module.resolvers[typeName]
                } else {
                    for(const fieldName in module.resolvers[typeName]) {
                        const middlewares: GqlAppBuilderMiddleware[] = []
                        middlewares.push(
                            ...GqlAppBuilder.getMatchMiddlewares('*', '*', this.config.middlewares)
                            , ...GqlAppBuilder.getMatchMiddlewares('*', '*', module.middlewares)
                            , ...GqlAppBuilder.getMatchMiddlewares(typeName, '*', this.config.middlewares)
                            , ...GqlAppBuilder.getMatchMiddlewares(typeName, '*', module.middlewares)
                            , ...GqlAppBuilder.getMatchMiddlewares(typeName, fieldName, this.config.middlewares)
                            , ...GqlAppBuilder.getMatchMiddlewares(typeName, fieldName, module.middlewares)
                        )

                        if (!(typeName in resolvers)) {
                            resolvers[typeName] = {}
                        }
                        if (resolvers[typeName][fieldName]) {
                            throw Error('gqlAppBuilder build error. (already exist resolver field)');
                        }

                        resolvers[typeName][fieldName] = async (parent: any, args: any, injector: InjectorWrapper, info: GraphQLResolveInfo) => {
                            const callbacks: GqlAppBuilderMiddlewareCallback[] = []
                            let resolveData: any;
                            let resolveError: any;
                            try {
                                for (const middleware of middlewares) {
                                    const cb = await middleware(injector, parent, args, info)
                                    if (cb) {
                                        callbacks.push(cb)
                                    }
                                }
                                resolveData = module.resolvers[typeName][fieldName](injector, parent, args, info);
                            } catch (error) {
                                resolveError = error
                            }

                            callbacks.reverse()
                            for (const cb of callbacks) {
                                await cb(resolveData, resolveError)
                            }
                            if (resolveError) {
                                throw resolveError;
                            }
                            return resolveData;
                        }
                    }
                }
            }
        }
        return {
            typeDefs,
            resolvers
        }
    }
}

const gqlQueryLogger = createLogger<{reqKey:string, query: string, params?: any}>('GQL_QUERY', {
    ...loggerEnvUtil(
        Env.LOG_GQL_LEVEL,
        Env.LOG_GQL_CONSOLE_LEVEL,
        Env.LOG_GQL_FILE_LEVEL,
        Env.LOG_GQL_FILE_DIR
    ),
    consoleFormat: ({ level, message, subData, timestamp }) => `${timestamp} [GQL_QUERY] ${level}: #${subData.reqKey}# ${message} \n${subData.query} ${
        !isEmpty(subData.params) ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
    }`
})

const gqlFieldLogger = createLogger<{reqKey:string,  type: string, fieldName: string}>('GQL_FIELD', {
    ...loggerEnvUtil(
        Env.LOG_GQL_LEVEL,
        Env.LOG_GQL_CONSOLE_LEVEL,
        Env.LOG_GQL_FILE_LEVEL,
        Env.LOG_GQL_FILE_DIR
    ),
    consoleFormat: ({ level, message, subData, timestamp }) => `${timestamp} [GQL_FIELD] ${level}: #${subData.reqKey}# ${message}`
});

export const logMiddleware: GqlAppBuilderMiddleware = (injector, parent, args, info) => {
    const reqKey = injector.resolve<string>(REQ_KEY)
    const type = info.parentType.name;
    gqlFieldLogger.info(`${type}(${info.fieldName}) called.`, {
        fieldName: info.fieldName,
        type,
        reqKey
    });
}

export const orderByIdArray = (arr: any[], idArr: ReadonlyArray<string|number>, getIdFn: (item: any) => string|number = item => item.id) => {
    const map: {[k:string]: any} = {};
    arr.forEach(item => map[getIdFn(item)] = item);
    return idArr.map(id => map[id]);
};

export const genGraphqlErrorCode = (code: string) => ({extensions: {code}})


export const GqlAppBuilderExpressMiddleware: RequestHandler = (req, res, next) => {
    if (req.method.toLowerCase() === 'post' && req.body?.operationName !== 'IntrospectionQuery') {
        const reqKey = uuid4().replace(/-/g, '');
        const injector = container.createChildContainer()
        injector.register<Request>(REQUEST, {useValue: req})
            .register<Response>(RESPONSE, {useValue: res})
            .register<string>(REQ_KEY, {useValue: reqKey})
        gqlQueryLogger.info('GQL called.', {
            reqKey,
            query: req.body?.query,
            params: req.body?.variables
        })

        const destroyableArr:OnDestroy[] = []
        const injectorWrapper = new InjectorWrapper(injector, arr => {
            for (const destroyable of arr) {
                if (destroyableArr.indexOf(destroyable) < 0) {
                    destroyableArr.push(destroyable)
                }
            }
        });
        const databaseConnectionService = injectorWrapper.resolve<DatabaseConnectionService>(DatabaseConnectionService);
        injectorWrapper.resolve<DatabaseConnectionService>(DatabaseConnectionService);
        injectorWrapper.resolve<DatabaseConnectionService>(DatabaseConnectionService);
        injectorWrapper.resolve<DatabaseConnectionService>(DatabaseConnectionService);
        (req as any).injector = injectorWrapper
        next()
    }
    next()
}

export interface OnDestroy {
    onDestroy();
}
