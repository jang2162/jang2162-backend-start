import {Logger} from '@/lib/Logger';
import {GraphQLModule} from '@graphql-modules/core';
import env from 'json-env';
import {Pool} from 'pg';
import {range} from 'utils';
import {DatabaseProvider} from './database.provider';

interface DbLoggerSubData {
    queryText: string
    params?: any[],
    rowCount: number,
    duration: number,
}

export type DbLogger = Logger<DbLoggerSubData>;

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
        {
            provide: Logger,
            useFactory: () => new Logger<DbLoggerSubData>('DB',
                ({ level, message, subData, timestamp }) => `${timestamp} [DB] ${level}: ${
                level === 'debug' 
                    ? `executed query\n${subData.queryText}\nDuration: (${subData.duration}ms)  RowCount: ${subData.rowCount}${
                        subData.params && subData.params.length > 0 ?
                            `\nParams: (${range(subData.params.length).map(idx => `$${idx+1}=>${ subData.params[idx]}`).join(', ')})`
                            :''
                    }` 
                    : message}`
            )
        },
        DatabaseProvider,
    ],
});