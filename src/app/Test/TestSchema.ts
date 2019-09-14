import {gql} from 'apollo-server-core';

export const TestSchema = gql`
    input TestInput {
        name: String!
        hobby: String
    }

    type Test {
        id: ID!,
        name: String!,
        hobby(prefix: String): String
    }

    extend type Query {
        tests(dd: Int): [Test]
    }

    extend type Mutation {
        addTest(test: TestInput!): Test
    }
`