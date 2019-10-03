import {MutationAddSampleUserArgs, Resolvers, SampleUser} from '@/generated-models';
import {simpleResolve} from '@/lib/ApolloUtil';
import {SampleProvider} from './sample.provider';

const resolvers: Resolvers = {
    Query: {
        sampleUsers: simpleResolve<any, SampleUser[]>(async ({injector}) => {
            const provider = injector.get<SampleProvider>(SampleProvider);
            return (await provider.sampleUserList());
        })
    },
    Mutation: {
        addSampleUser: simpleResolve<MutationAddSampleUserArgs, SampleUser>(async ({args, injector}) => {
            const provider = injector.get<SampleProvider>(SampleProvider);
            return await provider.insertSampleUser(args.test);
        })
    },
};

export default resolvers;