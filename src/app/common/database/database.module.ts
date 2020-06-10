import {DatabaseTransactionProvider} from '@/app/common/database/database.transaction.provider';
import {createLogger} from '@/lib/createLogger';
import {GraphQLModule} from '@graphql-modules/core';
import {Logger} from 'custom-logger';
import {range} from 'utils';
import {DatabaseProvider} from './database.provider';

interface DbLoggerSubData {
    // debug
    queryText?: string
    params?: any[],
    rowCount?: number,
    duration?: number,

    // error
    code?: string,
    position?: string
}

export type DbLogger = Logger<DbLoggerSubData>;

export const databaseModule = new GraphQLModule({
    providers: [
        {
            provide: Logger,
            useFactory: () => createLogger<DbLoggerSubData>('DB',
                ({ level, message, subData, timestamp }) => `${timestamp} [DB] ${level}: ${
                level === 'debug' 
                    ? `executed query\nQuery: ${subData.queryText}\nDuration: ${subData.duration}ms\nRowCount: ${subData.rowCount}${
                        subData.params && subData.params.length > 0 ?
                            `\nParams: (${range(subData.params.length).map(idx => `$${idx+1}=>${ subData.params[idx]}`).join(', ')})`
                            :''
                    }` 
                    : 
                level === 'error' 
                    ? `(${subData.code}, ${subData.position}) ${message}` 
                    : message }`
            )
        },
        DatabaseProvider,
        DatabaseTransactionProvider,
    ],
});