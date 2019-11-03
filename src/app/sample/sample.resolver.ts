import {
    MutationAddSampleUserArgs, QuerySamplePostByIdArgs,
    QuerySamplePostsArgs,
    QuerySampleUserByIdArgs, QuerySampleUsersArgs,
    Resolvers,
    SamplePost, SamplePostConnection,
    SampleUser, SampleUserConnection, SampleUserPostsArgs
} from '@/generated-models';
import {simpleResolve} from '@/lib/ApolloUtil';
import {SampleProvider} from './sample.provider';

const resolvers: Resolvers = {
    Query: {
        sampleUsers: simpleResolve<QuerySampleUsersArgs, SampleUserConnection>(({injector, args}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserConnection(args.form)
        ),

        sampleUserById: simpleResolve<QuerySampleUserByIdArgs, SampleUser>(({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserById(args.id)
        ),

        samplePosts: simpleResolve<QuerySamplePostsArgs, SamplePostConnection>(({injector, args}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostConnection(args.form)
        ),

        samplePostById: simpleResolve<QuerySamplePostByIdArgs, SamplePost>(({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostById(args.id)
        ),
    },
    Mutation: {
        addSampleUser: simpleResolve<MutationAddSampleUserArgs, SampleUser>(({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).insertSampleUser(args.user)
        )
    },

    SampleUser: {
        posts: simpleResolve<SampleUserPostsArgs, any, SampleUser>(({injector, source, args}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostConnection({page: args.page, userId: source.id})
        )
    },

    SamplePost: {
        writer: simpleResolve<any, SampleUser, SamplePost>(({injector, source}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserById(source.writer_id)
        )
    }
};

export default resolvers;