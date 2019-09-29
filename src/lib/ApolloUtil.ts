import {LogProvider} from '@/app/common/LogProvider';
import {ModuleContext} from '@graphql-modules/core';
import {Injector} from '@graphql-modules/di';
import {GraphQLResolveInfo} from 'graphql';


export function createResolver<Arguments = any, Result = any, Source = any>(
    cb: (source: Source, args: Arguments, injector: Injector, info: GraphQLResolveInfo) => Result | Promise<Result>
) {
    return (source: Source, args: Arguments, context: ModuleContext, info: GraphQLResolveInfo) => {
        context.injector.get(LogProvider).log(info);
        return cb(source, args, context.injector, info);
    }
}

export const orderByIdArray = (arr: any[], idArr: Array<string|number>, getIdFn: (item: any) => string|number = item => item.id) => {
    const map: {[k:string]: any} = {};
    arr.forEach(item => map[getIdFn(item)] = item);
    return idArr.map(id => map[id]);
};
