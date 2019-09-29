import {createResolver, subQueryCheck} from '@/lib/ApolloUtil';
import {SampleService} from './sampleService';

export interface SampleUserInput {
    name: string;
    hobby?: string;
}

export interface SampleUser {
    id: number
    name: string;
    hobby?: string;
}

export interface SampleUserSubqueryCheck {
    post: boolean
}

// export const sampleUserLoader = makeLoader<number, SampleUser>((idArr, subQueryChecker) => {
//     const service = new SampleService();
//     console.log(idArr);
//     return service.sampleUserBatch(idArr);
// });


export const sampleResolver = {
    Query: {
        sampleUsers: createResolver<any, SampleUser[]>(async (source, args, injector) => {
            const sampleService = new SampleService();
            return (await sampleService.sampleUserList());
        })
    },
    Mutation: {
        addSampleUser: createResolver<{test: SampleUserInput}, SampleUser>(async (source, args, injector) => {
            const sampleService = new SampleService();
            return await sampleService.insertSampleUser(args.test);
        })
    },

    SampleUser: {
    }
};