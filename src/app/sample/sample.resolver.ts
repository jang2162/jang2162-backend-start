import {
    MutationAddSampleUserArgs,
    QuerySampleUserByIdArgs,
    Resolvers,
    SamplePost,
    SampleUser
} from '@/generated-models';
import {simpleResolve} from '@/lib/ApolloUtil';
import {SampleProvider} from './sample.provider';

const resolvers: Resolvers = {
    Query: {
        sampleUsers: simpleResolve<any, SampleUser[]>(async ({injector}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserList()
        ),

        sampleUserById: simpleResolve<QuerySampleUserByIdArgs, SampleUser>(async ({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserById(args.id)
        ),

        samplePosts: simpleResolve<any, SamplePost[]>(async ({injector}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostList()
        )
    },
    Mutation: {
        addSampleUser: simpleResolve<MutationAddSampleUserArgs, SampleUser>(async ({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).insertSampleUser(args.test)
        )
    },

    SampleUser: {
        posts: simpleResolve<any, any, SampleUser>(({injector, source}) => {
            const provider = injector.get<SampleProvider>(SampleProvider);
            return [];
        })
    },

    SamplePost: {
        writer: simpleResolve<any, SampleUser, SamplePost>(async ({injector, source}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserById(source.writer_id)
        )
    }
};

export default resolvers;