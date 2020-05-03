import {authFilterMiddleware} from '@/app/common/auth/auth-info.provider';
import {
    AuthToken,
    MutationAddSampleUserArgs, MutationAuthenticationArgs, QuerySamplePostByIdArgs,
    QuerySamplePostsArgs,
    QuerySampleUserByIdArgs, QuerySampleUsersArgs,
    Resolvers,
    SamplePost, SamplePostConnection,
    SampleUser, SampleUserConnection, SampleUserPostsArgs
} from '@/generated-models';
import {SimpleResolver} from '@/lib/apolloUtil';
import {SampleProvider} from './sample.provider';

const resolvers: Resolvers = {
    Query: {
        sampleUsers: new SimpleResolver<QuerySampleUsersArgs>(authFilterMiddleware.role('ROLE_ADMIN')).build(({injector, args}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserConnection(args.form)
        ),

        sampleUserById: new SimpleResolver<QuerySampleUserByIdArgs>().build(({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).sampleUserById(args.id)
        ),

        samplePosts: new SimpleResolver<QuerySamplePostsArgs>().build(({injector, args}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostConnection(args.form)
        ),

        samplePostById: new SimpleResolver<QuerySamplePostByIdArgs>().build(({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostById(args.id)
        ),
    },
    Mutation: {
        addSampleUser: new SimpleResolver<MutationAddSampleUserArgs>().build(({args, injector}) =>
            injector.get<SampleProvider>(SampleProvider).insertSampleUser(args.user)
        )
    },

    SampleUser: {
        posts: new SimpleResolver<SampleUserPostsArgs, SamplePostConnection, SampleUser>().build(({injector, source, args}) =>
            injector.get<SampleProvider>(SampleProvider).samplePostConnection({page: args.page, userId: source.id})
        )
    },

    SamplePost: {
        writer: new SimpleResolver<{}, SampleUser, SamplePost>().build(({injector, source}) =>
                injector.get<SampleProvider>(SampleProvider).sampleUserById(source.writer_id)
        )
    }
};

export default resolvers;