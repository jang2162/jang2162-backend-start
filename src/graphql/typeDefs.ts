import TestSchema from '@gql/Test/TestSchema';
import {gql} from 'apollo-server-core';

export default [
    gql`
        type Query
        type Mutation
    `,
    TestSchema
];