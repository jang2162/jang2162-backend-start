import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';
import {parseDate} from './dateScalar';

export const DatetimeScalar = new GraphQLScalarType({
    name: 'Datetime',
    description: 'Datetime scalar type',
    serialize: value => parseDate(value as any).format('YYYY-MM-DD HH:mm:ss'),
    parseValue: value => parseDate(value as any).toDate(),
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
