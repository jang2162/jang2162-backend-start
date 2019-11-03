import {parseDate} from '@/app/init/scalar/date.scalar';
import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';

export default new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime scalar type',
    serialize: value => parseDate(value).format('YYYY-MM-DD HH:mm:ss'),
    parseValue: value => parseDate(value).toDate(),
    parseLiteral: ast => {
        if (ast.kind !== Kind.STRING && ast.kind !== Kind.INT) {
            throw new GraphQLError(
                `Can only parse strings or number to date but got a: ${ast.kind}`,
            );
        }
        const value = ast.kind === Kind.STRING ?
            ast.value :
            parseInt(ast.value, 10);

        try {
            return parseDate(value).toDate();
        } catch (e) {
            throw new GraphQLError(
                `Value is not a valid Date: ${ast.value}`,
                ast
            );
        }
    }
})
