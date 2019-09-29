import 'graphql-import-node';
import {commonModule} from '@/app/common/commonModule';

import {GraphQLModule} from '@graphql-modules/core';
import {sampleResolver} from './sampleResolver';
import * as typeDefs from './sampleTypeDefs.graphql';

export const sampleModule = new GraphQLModule({
    typeDefs,
    resolvers: sampleResolver,
    imports: [
        commonModule
    ]
});