import {commonModule} from '@/app/common/common.module';
import {GraphQLModule} from '@graphql-modules/core';
import {SampleProvider} from './sample.provider';
import resolvers from './sample.resolver';
import * as typeDefs from './sample.schema.graphql';

export const sampleModule = new GraphQLModule({
    typeDefs,
    resolvers,
    providers: [
        SampleProvider
    ],
    imports: [
        commonModule,
    ]
});