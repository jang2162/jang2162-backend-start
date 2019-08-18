import {ApolloContext} from '@/apollo';
import getLogger from '@/lib/LoggerUtil';
import {GraphQLResolveInfo} from 'graphql';
import {isEmpty} from 'utils';

export const logger = getLogger('APOLLO');

export function createResolver<Arguments = any, Result = any, Source = any>(
    cb: (source: Source, args: Arguments, context: ApolloContext, info: GraphQLResolveInfo) => Result | Promise<Result>
) {
    return (source: Source, args: Arguments, context: ApolloContext, info: GraphQLResolveInfo) => {
        const type = info.parentType.name;
        if (type === 'Query' || type === 'Mutation') {
            logger.info(`${type}: '${info.fieldName}' called. ${isEmpty(info.variableValues) ? '' : `Params: ${JSON.stringify(info.variableValues)}`}`, type);
        }
        return cb(source, args, context, info);
    }
}

