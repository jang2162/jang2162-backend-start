import {Request, Response} from 'express';
import {DocumentNode, GraphQLResolveInfo, GraphQLScalarType} from 'graphql';
import {container, DependencyContainer} from 'tsyringe';
import {ApolloContext} from './apolloUtil';
import {Resolvers} from '@/generated-models';

export type  GqlAppBuilderMiddleware =  (injector: DependencyContainer, parent: any, args: any, info: GraphQLResolveInfo) => Promise<any>

export const REQUEST = Symbol('REQUEST');
export const RESPONSE = Symbol('RESPONSE');

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

                        resolvers[typeName][fieldName] = async (parent: any, args: any, context: ApolloContext, info: GraphQLResolveInfo) => {
                            const injector = container.createChildContainer();
                            container.register<Request>(REQUEST, {useValue: context.req});
                            container.register<Response>(RESPONSE, {useValue: context.res});
                            for (const middleware of middlewares) {
                                await middleware(injector, parent, args, info)
                            }
                            return module.resolvers[typeName][fieldName](injector, parent, args, info)
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
export interface GqlAppBuilderModule {
    middlewares?: Record<string, Record<string, GqlAppBuilderMiddleware[]>>
    resolvers?: Resolvers<DependencyContainer>
}
export type ResolveFn<TResult, TParent, TContext, TArgs> = (
    injector: TContext,
    parent: TParent,
    args: TArgs,
    info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

