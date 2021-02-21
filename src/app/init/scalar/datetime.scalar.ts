import {parseDate} from '@/app/init/scalar/date.scalar';
import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';

export default new GraphQLScalarType({
    name: 'Datetime',
    description: 'Datetime scalar type',
    serialize: value => parseDate(value).format('YYYY-MM-DD HH:mm:ss'),
    parseValue: value => parseDate(value).toDate(),
    parseLiteral: ast => {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Can only parse strings or number to date but got a: ${ast.kind}`,
            );
        }

        try {
            return parseDate(ast.value).toDate();
        } catch (e) {
            throw new GraphQLError(
                `Value is not a valid Date: ${ast.value}`,
                ast
            );
        }
    }
})
