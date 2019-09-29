import {LogProvider} from '@/app/common/LogProvider';
import {GraphQLModule} from '@graphql-modules/core';

export const commonModule = new GraphQLModule({
    providers: [
        LogProvider
    ]
});