import {authFilterMiddleware} from '@/app/common/auth/auth-info.provider';
import {ROLE_USER} from '@/app/common/auth/role.provider';
import {Resolvers} from '@/generated-models';
import {createModule} from 'graphql-modules/';
import {SampleProvider} from './sample.provider';
import * as typeDefs from './sample.schema.graphql';

export const sampleModule = createModule({
    id: 'sample-module',
    typeDefs,
    providers: [
        SampleProvider
    ],
    middlewares: {
        Query: {
            sampleUserById: [authFilterMiddleware.role(ROLE_USER)]
        }
    },
    resolvers: {
        Query: {
            sampleUserById: (parent, args, {injector}) => injector.get<SampleProvider>(SampleProvider).sampleUserById(args.id),

            samplePosts: (parent, args, {injector}) => injector.get<SampleProvider>(SampleProvider).samplePostConnection(args.form),

            samplePostById: (parent, args, {injector}) => injector.get<SampleProvider>(SampleProvider).samplePostById(args.id),
        },
        Mutation: {
            addSampleUser: (parent, args, {injector}) => injector.get<SampleProvider>(SampleProvider).insertSampleUser(args.user)
        },

        SampleUser: {
            posts: (parent, args, {injector}) =>
                injector.get<SampleProvider>(SampleProvider).samplePostConnection({
                    page: args.page,
                    date4: [],
                    date6: [],
                    userId: parent.id
                })
        },

        SamplePost: {
            writer: (parent, args, {injector}) =>
                injector.get<SampleProvider>(SampleProvider).sampleUserById(parent.writer_id)
        }
    } as Resolvers
});