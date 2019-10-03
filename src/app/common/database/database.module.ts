import {Logger} from '@/lib/Logger';
import {GraphQLModule} from '@graphql-modules/core';
import env from 'json-env';
import {Pool} from 'pg';
import {DatabaseProvider} from './database.provider';

export const DB_LOGGER = Symbol('DB_LOGGER');
export const databaseModule = new GraphQLModule({
    providers: [
        {
            provide: Pool,
            useFactory: () =>  new Pool({
                host: env.get('db.host'),
                port: env.get('db.port'),
                database: env.get('db.name'),
                user: env.get('db.user'),
                password: env.get('db.password')
            }),
        },
        // {
        //     provide: DB_LOGGER,
        //     useFactory: () => new Logger('DB')
        // },
        DatabaseProvider,
    ],
});