import {gql} from 'apollo-server-express';
import * as TestSchema from './Test/TestSchema';

const typeDef = gql`
  type Query 
`;

export const typeDefs = [
    typeDef, TestSchema.typeDef
];

export const resolvers = [
    TestSchema.resolver
];