import dateTimeScalar from '@/app/init/scalar/date-time.scalar';
import dateScalar from '@/app/init/scalar/date.scalar';
import {createModule} from 'graphql-modules';
import typeDefs from './init.schema.graphql';

export const initModule = createModule({
    id: 'init-module',
    typeDefs,
    resolvers: {
        Date: dateScalar,
        DateTime: dateTimeScalar,
    }
});