import dayjs from 'dayjs';
import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';

export function parseDate(value: string | dayjs.Dayjs | Date) {
    if (value instanceof Date) {
        value = dayjs(value);
    } else if (typeof value === 'string') {
        value = dayjs(value, [
            'YYYY-MM-DD',
            'YYYYMMDD',
            'YYYY-MM-DDTHH:mm:ss.SSS',
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DDTHH:mm',
            'YYYY-MM-DD HH:mm:ss',
            'YYYYMMDDHHmmss',
        ], true);
    }

    if (!value.isValid()) {
        throw new GraphQLError(
            `Value is not a valid Date: ${value}`,
        );
    }
    return value
}

export const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date scalar type',
    serialize: (value) => parseDate(value as any).format('YYYY-MM-DD'),
    parseValue: (value) => parseDate(value as any).startOf('date').toDate(),
    parseLiteral: ast => {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Can only parse strings or number to date but got a: ${ast.kind}`,
            );
        }

        try {
            return parseDate(ast.value).startOf('date').toDate();
        } catch (e) {
            throw new GraphQLError(
                `Value is not a valid Date: ${ast.value}`,
                ast
            );
        }
    }
})
