import dateScalar from '@/app/init/scalar/date.scalar';
import dateTimeScalar from '@/app/init/scalar/datetime.scalar';
import timestampScalar from '@/app/init/scalar/timestamp.scalar';
import {createModule} from 'graphql-modules';
import typeDefs from './init.schema.graphql';

export const initModule = createModule({
    id: 'init-module',
    typeDefs,
    resolvers: {
        Date: dateScalar,
        Datetime: dateTimeScalar,
        Timestamp: timestampScalar,
    }
});