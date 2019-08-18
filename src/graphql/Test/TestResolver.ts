import {createResolver} from '@/lib/ApolloUtil';

export interface TestInput {
    name: string;
    hobby?: string;
}

export interface Test {
    id: number
    name: string;
    hobby?: string;
}

const sampleData: Test[] = [
    {
        id: 1,
        name: 'AAAA',
        hobby: 'qq'
    },
    {
        id: 2,
        name: 'BBBB',
        hobby: 'hobby1'
    },
    {
        id: 3,
        name: 'CCCC',
    },
    {
        id: 4,
        name: 'DDDD',
        hobby: 'hobby2'
    },
    {
        id: 5,
        name: 'EEEE',
    }
];

export default {
    Query: {
        tests: createResolver<any, Test[]>((source, args,context) => {
            return sampleData
        }),
    },
    Mutation: {
        addTest: createResolver<{test: TestInput}, Test>((source, args, context) => {
            const item = {
                id: sampleData.length,
                ...args.test
            };
            sampleData.push(item);
            return item;
        })
    },
    Test : {
        hobby: createResolver<{prefix: string}>((test, args, context) => {
            const prefix = args.prefix || 'My Hobby is ';
            return `${prefix} ${test.hobby}`;
        })
    }
};