import {initModule} from '@/app/init/initModule';
import {sampleModule} from '@/app/sample/sampleModule';
import {GraphQLModule} from '@graphql-modules/core';

export default new GraphQLModule({
    imports: [
        initModule,
        sampleModule
    ]
});
