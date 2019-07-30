import {gql} from 'apollo-server-express';

export const typeDef = gql`
    extend type Query {
        "A simple type for getting started!"
        hello: String
    }
`;

export const resolver = {
    Query: {
        hello: () => 'world'
    }
};