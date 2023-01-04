import {DocumentNode, GraphQLResolveInfo, GraphQLScalarType} from 'graphql';
import {Resolvers} from '../generated-models';
import {ApolloContext, ModuleContext} from './apolloUtil';

export type  GqlAppBuilderMiddleware =  (parent: any, args: any, context: ModuleContext, info: GraphQLResolveInfo) => Promise<any>

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
                            const newContext = {
                                ...context
                                , injector: {} as any
                            }

                            for (const middleware of middlewares) {
                                await middleware(parent, args, newContext, info)
                            }
                            await module.resolvers[typeName][fieldName](parent, args, newContext, info)
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
    resolvers?: Resolvers<ModuleContext>
}

