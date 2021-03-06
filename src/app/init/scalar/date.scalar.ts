import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';
import moment from 'moment';

export function parseDate(value: string | moment.Moment | Date) {
    if (value instanceof Date) {
        value = moment(value);
    } else if (typeof value === 'string') {
        value = moment(value, [
            'YYYY-MM-DD',
            'YYYYMMDD',
            'YYYY-MM-DDTHH:mm:ss.SSS',
            'YYYY-MM-DDTHH:mm:ss',
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

export default new GraphQLScalarType({
    name: 'Date',
    description: 'Date scalar type',
    serialize: value => parseDate(value).format('YYYY-MM-DD'),
    parseValue: value => parseDate(value).set(({h:0, m:0, s:0, ms:0})).toDate(),
    parseLiteral: ast => {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Can only parse strings or number to date but got a: ${ast.kind}`,
            );
        }

        try {
            return parseDate(ast.value).set(({h:0, m:0, s:0, ms:0})).toDate();
        } catch (e) {
            throw new GraphQLError(
                `Value is not a valid Date: ${ast.value}`,
                ast
            );
        }
    }
})
