import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';

export const initResolver = {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
};