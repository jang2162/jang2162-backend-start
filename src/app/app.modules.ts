import {initModule} from '@/app/init/init.module';
import {sampleModule} from '@/app/sample/sample.module';
import {userModule} from '@/app/user/user.module';
import {GraphQLModule} from '@graphql-modules/core';

export default new GraphQLModule({
    imports: [
        initModule,
        sampleModule,
        userModule,
    ]
});
