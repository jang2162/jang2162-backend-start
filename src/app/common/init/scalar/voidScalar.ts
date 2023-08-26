import { GraphQLScalarType } from 'graphql';

export const VoidScalar = new GraphQLScalarType({
    name: 'Void',

    description: 'Represents NULL values',

    serialize() {
        return null;
    },

    parseValue() {
        return null;
    },

    parseLiteral() {
        return null;
    },
});
