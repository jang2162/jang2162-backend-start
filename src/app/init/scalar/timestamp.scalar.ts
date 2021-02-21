import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';

export default new GraphQLScalarType({
    name: 'Timestamp',
    description: 'Timestamp scalar type',
    serialize: value => value.getTime(),
    parseValue: value => new Date(value),
    parseLiteral: ast => {
        if (ast.kind !== Kind.INT) {
            throw new GraphQLError(
                `Can only parse strings or number to date but got a: ${ast.kind}`,
            );
        }

        try {
            return new Date(parseInt(ast.value));
        } catch (e) {
            throw new GraphQLError(
                `Value is not a valid Date: ${ast.value}`,
                ast
            );
        }
    }
})
